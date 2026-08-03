import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, User } from "https://esm.sh/@supabase/supabase-js@2";

function generateSecureKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);

  let key = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) key += "-";
    key += chars[array[i] % chars.length];
  }
  return `AIVB-${key}`;
}

// Verify Paddle Signature using Web Crypto API
async function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string): Promise<boolean> {
  try {
    const parts = Object.fromEntries(signatureHeader.split(";").map((p) => p.split("=")));
    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signedPayload = `${ts}:${rawBody}`;
    const signatureBytes = new Uint8Array(h1.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

    return await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(signedPayload));
  } catch {
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  const signatureHeader = req.headers.get("paddle-signature");
  const webhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET_KEY") ?? "";

  if (!signatureHeader) {
    console.error("[SECURITY_ALERT] Missing paddle-signature header.");
    return new Response(JSON.stringify({ error: "Missing signature header" }), { status: 401 });
  }

  try {
    const rawBody = await req.text();

    // Verify Paddle Signature authenticity
    if (webhookSecret) {
      const isValid = await verifyPaddleSignature(rawBody, signatureHeader, webhookSecret);
      if (!isValid) {
        console.error("[SECURITY_ALERT] Invalid Paddle signature.");
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type;

    console.log(`[PADDLE_WEBHOOK] Received event: ${eventType}`);

    if (eventType === "transaction.completed") {
      const data = payload.data;
      const transactionId = data.id;
      const customerEmail = data.customer?.email || data.details?.customer?.email;
      const tier = ((data.custom_data?.tier as string) || "PRO").toUpperCase();

      if (!customerEmail) {
        console.error(`[ERROR] Transaction ${transactionId} missing customer email.`);
        return new Response(JSON.stringify({ error: "Missing customer email" }), { status: 400 });
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const serviceRoleKey = Deno.env.get("MY_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

      // 1. Idempotency Check
      const { data: existingLicense } = await supabaseAdmin
        .from("licenses")
        .select("key")
        .eq("paddle_transaction_id", transactionId)
        .maybeSingle();

      if (existingLicense) {
        console.log(`[IDEMPOTENT_SKIP] License already exists: ${existingLicense.key}`);
        return new Response(JSON.stringify({ message: "License already exists" }), { status: 200 });
      }

      // 2. User Lookup or Creation
      let userId: string;
      const { data: usersData, error: userFindError } = await supabaseAdmin.auth.admin.listUsers();
      if (userFindError) {
        console.error(`[USER_LOOKUP_FAILED] ${userFindError.message}`);
        return new Response(JSON.stringify({ error: userFindError.message }), { status: 500 });
      }

      const existingUser = usersData.users.find((u: User) => u.email === customerEmail);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
        });

        if (createError) {
          console.error(`[USER_CREATE_FAILED] ${createError.message}`);
          return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
        }
        userId = newUser.user.id;
      }

      // 3. Issue License Key
      const licenseKey = generateSecureKey();
      const maxDevices = tier === "ENTERPRISE" ? 10 : 3;

      const { error: insertError } = await supabaseAdmin.from("licenses").insert([
        {
          key: licenseKey,
          user_id: userId,
          tier: tier,
          status: "ACTIVE",
          max_devices: maxDevices,
          paddle_transaction_id: transactionId,
        },
      ]);

      if (insertError) {
        console.error(`[DB_INSERT_FAILED] ${insertError.message}`);
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
      }

      console.log(`[LICENSE_CREATED] Key: ${licenseKey} for ${customerEmail}`);
      return new Response(JSON.stringify({ success: true, key: licenseKey }), { status: 200 });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[WEBHOOK_ERROR] ${msg}`);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});