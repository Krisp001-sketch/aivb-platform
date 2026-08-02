// src/app/api/admin/generate/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";
import { sendLicenseEmail } from "../../../../lib/onesignal";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
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

    // 1. Insert new license into Supabase
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

    // 2. Send license email via OneSignal
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