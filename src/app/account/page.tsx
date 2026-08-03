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
  ShieldCheck, 
  Key, 
  Laptop, 
  ShieldAlert,
  Trash2,
  HardDrive
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "muqasim444@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // License & Device States
  const [license, setLicense] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [unbindingId, setUnbindingId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setDateOfBirth(user.user_metadata?.date_of_birth || "");

        // Case-insensitive admin check
        const userEmail = user.email?.trim().toLowerCase();
        const isEmailAllowed = userEmail && ADMIN_EMAILS.includes(userEmail);
        const hasAdminRole = user.user_metadata?.role === "admin";
        setIsAdmin(!!(isEmailAllowed || hasAdminRole));

        // Fetch User's Active License & Detailed Bound HWID Devices
        try {
          const { data: licData } = await supabase
            .from("licenses")
            .select("*, devices(*)")
            .eq("user_id", user.id)
            .maybeSingle();

          if (licData) {
            setLicense(licData);
            setDevices(licData.devices || []);
          }
        } catch (err) {
          console.error("Failed to fetch license details:", err);
        } finally {
          setLicenseLoading(false);
        }
      }

      setLoading(false);
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
      setMessage({ type: "success", text: "Profile information updated successfully!" });
    }
  };

  const handleUnbindDevice = async (deviceId: string) => {
    setUnbindingId(deviceId);
    try {
      const res = await fetch("/api/license/unbind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });

      const data = await res.json();
      if (data.success) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
        setMessage({ type: "success", text: "Device successfully unbound!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to unbind device." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network request failed while unbinding device." });
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
          <p className="text-xs text-textMuted">You are not logged in.</p>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Go to Login Page
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
        </Link>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Account Dashboard</h1>
          <p className="text-xs text-textMuted">Manage your personal profile, active licenses, and registered HWID devices.</p>
        </div>

        {/* Admin Shortcut Banner */}
        {isAdmin && (
          <Card className="p-4 bg-brandBlue/10 border-brandBlue/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brandBlue shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Administrator Access Detected</p>
                <p className="text-[11px] text-textMuted">You have elevated rights to manage license keys and HWIDs.</p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="primary" size="sm">
                Open Admin Control
              </Button>
            </Link>
          </Card>
        )}

        {/* Feedback Messages */}
        {message && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. License & Activation Status Card */}
        <Card className="p-6 border-borderDark space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-brandBlue" /> License & Device Status
          </h2>

          {licenseLoading ? (
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Loader2 className="w-4 h-4 animate-spin text-brandBlue" /> Checking active license records...
            </div>
          ) : license ? (
            <div className="space-y-4">
              {/* License Details */}
              <div className="space-y-3 bg-background/50 p-4 rounded-lg border border-borderDark text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">License Tier:</span>
                  <span className="font-bold text-brandBlue uppercase">{license.tier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">Serial Key:</span>
                  <span className="font-mono text-white">{license.key}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-textMuted">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                    {license.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-borderDark/50">
                  <span className="text-textMuted flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" /> Bound Devices:
                  </span>
                  <span className="text-white font-medium">
                    {devices.length} / {license.max_devices} slots used
                  </span>
                </div>
              </div>

              {/* Bound HWID Devices List */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-textMuted flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-brandBlue" /> Registered HWID Hardware
                </p>

                {devices.length > 0 ? (
                  <div className="space-y-2">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between bg-background/80 p-3 rounded-lg border border-borderDark text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-mono font-medium text-white truncate max-w-[280px]">
                            {device.hwid || device.device_name || "Hardware Device"}
                          </p>
                          <p className="text-[10px] text-textMuted">
                            Registered: {new Date(device.created_at || Date.now()).toLocaleDateString()}
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
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-textMuted italic p-3 bg-background/30 rounded-lg border border-borderDark/50 text-center">
                    No hardware devices bound yet. Run the desktop application to auto-register this machine.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">No Active Software License Bound</p>
                <p className="text-textMuted text-[11px] mt-0.5">
                  Contact support or generate a license key from the admin portal to unlock software capabilities.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* 2. Personal Information Update Form */}
        <Card className="p-8 border-borderDark space-y-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">Personal Profile</h2>
            <p className="text-xs text-textMuted">Update your registered name and account details.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Email Address (Read Only)</label>
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