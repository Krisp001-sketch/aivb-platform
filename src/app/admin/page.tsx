"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { HWIDTable, DeviceBinding } from "../../components/admin/HWIDTable";
import { Key, Send, ShieldAlert, CheckCircle, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Parse comma-separated emails from environment variables with whitespace & case normalization
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "muqasim444@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export default function AdminPage() {
  const router = useRouter();
  
  // Auth & Admin Protection States
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form & Dashboard States
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("PRO");
  const [maxDevices, setMaxDevices] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; key?: string; error?: string } | null>(null);
  const [devices, setDevices] = useState<DeviceBinding[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  // Helper to load all active bound HWID devices across licenses
  const fetchDevices = useCallback(async () => {
    setDevicesLoading(true);
    try {
      const { data, error } = await supabase
        .from("devices")
        .select("*, licenses(key, tier, user_id)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDevices(data as unknown as DeviceBinding[]);
      }
    } catch (err) {
      console.error("Error loading bound devices:", err);
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  // Protect Route & Load Data On Mount
  useEffect(() => {
    async function checkAdminAndLoadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Normalized Case-Insensitive Check
      const userEmail = user.email?.trim().toLowerCase();
      const isEmailAllowed = userEmail && ADMIN_EMAILS.includes(userEmail);
      const hasAdminRole = user.user_metadata?.role === "admin";

      if (isEmailAllowed || hasAdminRole) {
        setIsAdmin(true);
        setCurrentUser(user);
        await fetchDevices(); // Fetch devices once verified as admin
      } else {
        setIsAdmin(false);
      }

      setAuthLoading(false);
    }

    checkAdminAndLoadData();
  }, [router, fetchDevices]);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier, max_devices: maxDevices }),
      });
      const data = await res.json();

      if (data.success) {
        setResult({ success: true, key: data.license.key });
        setEmail("");
        fetchDevices(); // Refresh list in case a binding changed
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (err) {
      setResult({ success: false, error: "Network request failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleUnbindDevice = async (deviceId: string) => {
    try {
      const res = await fetch("/api/license/unbind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      } else {
        console.error("Unbind failed:", data.error);
      }
    } catch (err) {
      console.error("Failed to unbind device", err);
    }
  };

  // Show Auth Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brandBlue" />
      </div>
    );
  }

  // Access Denied Screen for Non-Admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
        <Card className="p-8 text-center space-y-4 max-w-md w-full border-red-500/30">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-xs text-textMuted leading-relaxed">
              Your account (<span className="text-white">{currentUser?.email}</span>) does not have administrative rights.
            </p>
          </div>
          <Link href="/account">
            <Button variant="secondary" className="w-full">
              Back to Account
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Protected Admin Interface
  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-brandBlue" /> Licensing Admin Control
          </h1>
          <p className="text-textMuted text-sm">
            Generate new serial keys, set device limits, inspect HWID device registrations, and send automated emails.
          </p>
        </div>

        {/* Dashboard Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Key Generation Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-brandBlue" /> Rapid Key Generator
              </h3>

              <form onSubmit={handleGenerateKey} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-textMuted mb-2">
                    Customer Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="customer@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brandBlue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">License Tier</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full bg-background border border-borderDark rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brandBlue"
                    >
                      <option value="TRIAL">Trial (1 Device / 24 hrs)</option>
                      <option value="PRO">Pro (3 Devices Standard)</option>
                      <option value="LIFETIME">Enterprise / Lifetime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Max Devices</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={maxDevices}
                      onChange={(e) => setMaxDevices(parseInt(e.target.value) || 1)}
                      className="w-full bg-background border border-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brandBlue"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  disabled={loading}
                  icon={<Send className="w-4 h-4" />}
                  className="w-full"
                >
                  {loading ? "Generating & Sending..." : "Issue License & Dispatch Email"}
                </Button>
              </form>

              {/* Status Banner */}
              {result && (
                <div className={`p-4 rounded-lg border text-xs flex items-center gap-3 ${
                  result.success ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {result.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                  <div>
                    {result.success ? (
                      <>
                        <p className="font-bold">License Key Successfully Issued!</p>
                        <p className="font-mono mt-1 text-white">{result.key}</p>
                      </>
                    ) : (
                      <p className="font-bold">{result.error}</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* HWID Device Manager Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span>Active System Devices</span>
              {devicesLoading && <Loader2 className="w-4 h-4 animate-spin text-brandBlue" />}
            </h2>
            <HWIDTable devices={devices} onUnbind={handleUnbindDevice} />
          </div>

        </div>

      </div>
    </div>
  );
}