// src/app/api/license/activate/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { license_key, hwid, device_name } = body;

    // 1. Basic payload validation
    if (!license_key || !hwid) {
      return NextResponse.json(
        { success: false, error: "Missing license key or hardware identifier." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 2. Fetch active license
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .select("*")
      .eq("key", license_key)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { success: false, error: "Invalid or non-existent license key." },
        { status: 404 }
      );
    }

    if (license.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: `License is currently ${license.status.toLowerCase()}.` },
        { status: 403 }
      );
    }

    // 3. Fetch current bound devices
    const { data: existingDevices, error: devicesError } = await supabaseAdmin
      .from("devices")
      .select("*")
      .eq("license_id", license.id);

    if (devicesError) {
      return NextResponse.json(
        { success: false, error: "Database error while fetching device bindings." },
        { status: 500 }
      );
    }

    const registeredDevice = existingDevices?.find((d) => d.hwid === hwid);

    // Refresh heartbeat if already registered
    if (registeredDevice) {
      await supabaseAdmin
        .from("devices")
        .update({ last_heartbeat: new Date().toISOString() })
        .eq("id", registeredDevice.id);

      return NextResponse.json({
        success: true,
        status: "ACTIVATED",
        license_key: license.key,
        hwid_bound: hwid,
        device_name: registeredDevice.device_name,
        tier: license.tier,
        max_devices: license.max_devices,
      });
    }

    // 4. Enforce Device Slot Limit
    if ((existingDevices?.length || 0) >= license.max_devices) {
      return NextResponse.json(
        {
          success: false,
          error: `Activation slot limit reached (${existingDevices.length}/${license.max_devices}). Unbind an existing device in the customer portal first.`,
        },
        { status: 403 }
      );
    }

    // 5. Insert new device binding
    const { error: insertError } = await supabaseAdmin.from("devices").insert([
      {
        license_id: license.id,
        hwid: hwid,
        device_name: device_name || "DESKTOP-CLIENT",
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { success: false, error: "Failed to register new HWID device binding." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "ACTIVATED",
      license_key: license.key,
      hwid_bound: hwid,
      device_name: device_name || "DESKTOP-CLIENT",
      tier: license.tier,
      max_devices: license.max_devices,
      offline_grace_days: 7,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal licensing server error." },
      { status: 500 }
    );
  }
}