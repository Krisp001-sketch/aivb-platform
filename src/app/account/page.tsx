"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { 
  User, 
  Calendar, 
  Mail, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Laptop, 
  ShieldAlert,
  Trash2,
  HardDrive,
  Plus
} from "lucide-react";
import { supabase } from "../../lib/supabase";

// Helper function to generate/detect a live browser-based HWID fingerprint
async function fetchClientHWID(): Promise<{ hwid: string; deviceName: string }> {
  try {
    const screenRes = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || "Unknown OS";
    const cores = navigator.hardwareConcurrency || 4;

    const rawFingerprint = `${platform}-${screenRes}-${cores}-${language}-${userAgent}`;

    // Hash the combined device metrics to produce a clean 32-character HWID string
    const encoder = new TextEncoder();
    const data = encoder.encode(rawFingerprint);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const hwid = `HWID-${hashHex.substring(0, 24).toUpperCase()}`;
    const deviceName = `${platform} Desktop (${window.screen.width}x${window.screen.height})`;

    return { hwid, deviceName };
  } catch (err) {
    // Fallback ID if browser crypto APIs are restricted
    const fallbackId = `HWID-GENERIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    return { hwid: fallbackId, deviceName: "Web Workstation" };
  }
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // License & Device States
  const [license, setLicense] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [unbindingId, setUnbindingId] = useState<string | null>(null);
  
  // Live HWID States
  const [currentHwid, setCurrentHwid] = useState<string | null>(null);
  const [currentDeviceName, setCurrentDeviceName] = useState<string>("");
  const [bindingDevice, setBindingDevice] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      try {
        // Detect Live HWID on Component Mount
        const liveInfo = await fetchClientHWID();
        setCurrentHwid(liveInfo.hwid);
        setCurrentDeviceName(liveInfo.deviceName);

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error("Auth status error:", userError.message);
          setLoading(false);
          setLicenseLoading(false);
          return;
        }

        if (user) {
          setUser(user);
          setFullName(user.user_metadata?.full_name || "");
          setDateOfBirth(user.user_metadata?.date_of_birth || "");

          // Fetch user's license
          const { data: licData, error: licError } = await supabase
            .from("licenses")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (licError) {
            console.error("Supabase Licenses Query Failed:", licError);
          } else if (licData) {
            setLicense(licData);

            // Fetch bound devices for the license
            const { data: devData, error: devError } = await supabase
              .from("devices")
              .select("*")
              .eq("license_id", licData.id);

            if (devError) {
              console.error("Supabase Devices Query Failed:", devError);
            } else {
              setDevices(devData || []);
            }
          }
        }
      } catch (err: any) {
        console.error("Unexpected failure loading account data:", err?.message || err);
      } finally {
        setLoading(false);
        setLicenseLoading(false);
      }
    }

    loadAccountData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        date_of_birth: dateOfBirth,
      },
    });

    setUpdating(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setUser(data.user);
      setMessage({ type: "success", text: "Profile details successfully updated!" });
    }
  };

  const handleBindCurrentDevice = async () => {
    if (!license || !currentHwid) return;
    setBindingDevice(true);
    setMessage(null);

    // Check device limit
    if (devices.length >= (license.max_devices || 1)) {
      setMessage({
        type: "error",
        text: `Maximum device limit reached (${license.max_devices}). Unbind an existing device first.`,
      });
      setBindingDevice(false);
      return;
    }

    // Check if current device is already bound
    const isAlreadyBound = devices.some((d) => d.hwid === currentHwid);
    if (isAlreadyBound) {
      setMessage({ type: "error", text: "This machine is already registered and bound to your license." });
      setBindingDevice(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("devices")
        .insert({
          license_id: license.id,
          hwid: currentHwid,
          device_name: currentDeviceName,
          activated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        setMessage({ type: "error", text: error.message || "Failed to bind device." });
      } else {
        setDevices((prev) => [...prev, data]);
        setMessage({ type: "success", text: "Current machine bound to license successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "An error occurred while attempting to bind hardware." });
    } finally {
      setBindingDevice(false);
    }
  };

  const handleUnbindDevice = async (deviceId: string) => {
    setUnbindingId(deviceId);
    setMessage(null);

    try {
      const res = await fetch("/api/license/unbind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          device_id: deviceId,
          license_key: license?.key || null 
        }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
        setMessage({ type: "success", text: "Device unbound successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || data.message || "Failed to unbind hardware device." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error encountered while unbinding device." });
    } finally {
      setUnbindingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brandBlue" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
        <Card className="p-8 text-center space-y-4 max-w-sm w-full border-borderDark">
          <p className="text-xs text-textMuted">You must be logged in to view your account details.</p>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Go to Login Page
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isCurrentDeviceBound = devices.some((d) => d.hwid === currentHwid);

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-xs text-textMuted">Manage your personal details, software licenses, and registered HWID instances.</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* License & HWID Card */}
        <Card className="p-6 border-borderDark space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-brandBlue" /> License & Registered Hardware
          </h2>

          {licenseLoading ? (
            <div className="flex items-center gap-2 text-xs text-textMuted py-4">
              <Loader2 className="w-4 h-4 animate-spin text-brandBlue" /> Fetching active license entitlements...
            </div>
          ) : license ? (
            <div className="space-y-4">
              <div className="space-y-3 bg-background/50 p-4 rounded-lg border border-borderDark text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">Tier:</span>
                  <span className="font-bold text-brandBlue uppercase">{license.tier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">Serial Key:</span>
                  <span className="font-mono text-white select-all">{license.key}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                    {license.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-borderDark/50">
                  <span className="text-textMuted flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" /> Hardware Usage:
                  </span>
                  <span className="text-white font-medium">
                    {devices.length} / {license.max_devices} slots registered
                  </span>
                </div>
              </div>

              {/* Active Machine Live HWID Banner */}
              <div className="p-3 bg-brandBlue/5 border border-brandBlue/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brandBlue uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> Current Machine HWID
                  </span>
                  <span className="text-[10px] text-textMuted">
                    {isCurrentDeviceBound ? (
                      <span className="text-emerald-400 font-semibold">● Registered</span>
                    ) : (
                      <span className="text-amber-400 font-semibold">● Unbound</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-white bg-background/80 px-2 py-1 rounded border border-borderDark truncate max-w-[70%]">
                    {currentHwid || "Detecting Hardware..."}
                  </code>
                  {!isCurrentDeviceBound && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={bindingDevice || devices.length >= license.max_devices}
                      onClick={handleBindCurrentDevice}
                      className="text-[11px] py-1 px-2.5 h-auto flex items-center gap-1"
                    >
                      {bindingDevice ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-3 h-3" /> Bind Device
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Bound Devices List */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-textMuted flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-brandBlue" /> Bound Devices List
                </p>

                {devices.length > 0 ? (
                  <div className="space-y-2">
                    {devices.map((device) => {
                      const isThisDevice = device.hwid === currentHwid;
                      return (
                        <div
                          key={device.id}
                          className={`flex items-center justify-between bg-background/80 p-3 rounded-lg border text-xs ${
                            isThisDevice ? "border-brandBlue/50 bg-brandBlue/5" : "border-borderDark"
                          }`}
                        >
                          <div className="space-y-0.5 max-w-[75%]">
                            <p className="font-mono font-medium text-white truncate flex items-center gap-1.5">
                              {device.hwid || device.device_name}
                              {isThisDevice && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-brandBlue/20 text-brandBlue border border-brandBlue/30">
                                  This Machine
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-textMuted">
                              Bound on: {new Date(device.activated_at || device.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={unbindingId === device.id}
                            onClick={() => handleUnbindDevice(device.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                          >
                            {unbindingId === device.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-textMuted italic p-3 bg-background/30 rounded-lg border border-borderDark/50 text-center">
                    No hardware devices currently bound. Click "Bind Device" above to register this machine.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">No Active License Found</p>
                <p className="text-textMuted text-[11px] mt-0.5">
                  Your account does not have a license attached. Please activate a key to bind hardware devices.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* User Profile Form */}
        <Card className="p-8 border-borderDark space-y-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">Profile Details</h2>
            <p className="text-xs text-textMuted">Update your baseline account metadata.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full bg-background/50 border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-textMuted cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Date of Birth</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" disabled={updating}>
                {updating ? "Saving Changes..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}