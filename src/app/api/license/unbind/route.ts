// src/app/api/license/unbind/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const { license_key, device_id } = await request.json();

    if (!license_key || !device_id) {
      return NextResponse.json(
        { success: false, error: "Missing required license_key or device_id." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Verify license ownership
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .select("id")
      .eq("key", license_key)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { success: false, error: "Invalid license key provided." },
        { status: 404 }
      );
    }

    // Target deletion strictly within the specified license scope
    const { error: deleteError } = await supabaseAdmin
      .from("devices")
      .delete()
      .eq("id", device_id)
      .eq("license_id", license.id);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: "Failed to unbind device from database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Device successfully unbound.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}