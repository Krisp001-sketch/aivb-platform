"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { HWIDTable, DeviceBinding } from "../../components/admin/HWIDTable";
import { Key, Send, ShieldAlert, CheckCircle, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

// 1. Add your designated admin emails here
// Parse comma-separated emails from environment variables
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [
  "muqasim444@gmail.com",
];

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

  // 2. Protect Route On Load
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is in hardcoded list OR has 'admin' in user_metadata
      const isEmailAllowed = user.email && ADMIN_EMAILS.includes(user.email);
      const hasAdminRole = user.user_metadata?.role === "admin";

      if (isEmailAllowed || hasAdminRole) {
        setIsAdmin(true);
        setCurrentUser(user);
      } else {
        setIsAdmin(false);
      }

      setAuthLoading(false);
    }

    checkAdmin();
  }, [router]);

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
      }
    } catch (err) {
      console.error("Failed to unbind device", err);
    }
  };

  // 3. Show Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brandBlue" />
      </div>
    );
  }

  // 4. Access Denied Screen for Non-Admins
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

  // 5. Protected Admin Interface
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
                      onChange={(e) => setMaxDevices(parseInt(e.target.value))}
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
                  result.success ? "bg-brandGreen/10 border-brandGreen/30 text-brandGreen" : "bg-red-500/10 border-red-500/30 text-red-400"
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
            <h2 className="text-base font-bold text-white">Active System Devices</h2>
            <HWIDTable devices={devices} onUnbind={handleUnbindDevice} />
          </div>

        </div>

      </div>
    </div>
  );
}