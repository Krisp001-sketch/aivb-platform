import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";
import { sendLicenseEmail } from "../../../../lib/onesignal";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import crypto from "crypto";

// Support both standard server ENVs and public ENVs
const envEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS;
const ADMIN_EMAILS = envEmails ? envEmails.split(",").map((e) => e.trim()) : ["muqasim444@gmail.com"];

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // Initialize Supabase Server Client with @supabase/ssr
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from Server Component context
            }
          },
        },
      }
    );

    // Verify authenticated user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userRole = session.user.user_metadata?.role;
    const isAllowed = (userEmail && ADMIN_EMAILS.includes(userEmail)) || userRole === "admin";

    if (!isAllowed) {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { email, tier = "PRO", max_devices = 3 } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Recipient email is required." },
        { status: 400 }
      );
    }

    // Generate formatted license key: AIVB-PRO-XXXX-XXXX-XXXX
    const randomSegment = () =>
      crypto.randomBytes(2).toString("hex").toUpperCase();
    const generatedKey = `AIVB-${tier}-${randomSegment()}-${randomSegment()}-${randomSegment()}`;

    const supabaseAdmin = getSupabaseAdmin();

    // Insert new license record
    const { data: newLicense, error: insertError } = await supabaseAdmin
      .from("licenses")
      .insert([
        {
          key: generatedKey,
          tier: tier,
          max_devices: max_devices,
          status: "ACTIVE",
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: "Database error creating key." },
        { status: 500 }
      );
    }

    // Dispatch email notification
    const emailResult = await sendLicenseEmail(email, generatedKey);

    return NextResponse.json({
      success: true,
      license: newLicense,
      emailSent: emailResult.success,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate license." },
      { status: 500 }
    );
  }
}