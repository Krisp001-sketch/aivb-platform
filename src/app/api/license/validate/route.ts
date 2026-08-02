// src/app/api/license/validate/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { license_key, hwid } = body;

    // 1. Validate payload
    if (!license_key) {
      return NextResponse.json(
        { valid: false, reason: "Missing license_key in request body." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 2. Fetch license details
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .select("id, status, tier, max_devices, created_at")
      .eq("key", license_key)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { valid: false, reason: "License key does not exist." },
        { status: 404 }
      );
    }

    if (license.status !== "ACTIVE") {
      return NextResponse.json(
        { valid: false, reason: `License is currently ${license.status.toLowerCase()}.` },
        { status: 403 }
      );
    }

    // 3. Fetch all registered devices under this license
    const { data: devices, error: devicesError } = await supabaseAdmin
      .from("devices")
      .select("id, device_name, hwid, activated_at, last_heartbeat")
      .eq("license_id", license.id)
      .order("activated_at", { ascending: false });

    if (devicesError) {
      return NextResponse.json(
        { valid: false, reason: "Failed to query bound devices." },
        { status: 500 }
      );
    }

    // Special Mode: Customer Portal Lookup (hwid === "PORTAL_CLIENT" or missing)
    if (!hwid || hwid === "PORTAL_CLIENT") {
      return NextResponse.json({
        valid: true,
        status: license.status,
        tier: license.tier,
        max_devices: license.max_devices,
        devices: devices || [],
      });
    }

    // 4. Desktop Client Mode: Verify exact HWID match
    const boundDevice = devices?.find((d) => d.hwid === hwid);

    if (!boundDevice) {
      return NextResponse.json(
        { valid: false, reason: "Hardware ID (HWID) is not registered under this license." },
        { status: 403 }
      );
    }

    // 5. Update device heartbeat timestamp
    const now = new Date().toISOString();
    await supabaseAdmin
      .from("devices")
      .update({ last_heartbeat: now })
      .eq("id", boundDevice.id);

    return NextResponse.json({
      valid: true,
      status: "ACTIVE",
      tier: license.tier,
      max_devices: license.max_devices,
      devices: devices || [],
      last_validated_at: now,
      offline_grace_remaining_seconds: 604800, // 7 days grace period
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, reason: "Internal license validation server error." },
      { status: 500 }
    );
  }
}