"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Save,
  Laptop,
  Lock,
  ExternalLink
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [licenseTier, setLicenseTier] = useState<string>("Free Tier / No Active License");
  const [hasActiveLicense, setHasActiveLicense] = useState<boolean>(false);

  // Status Message State
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAccount() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || "");

      // Read real license tier from user metadata or set default Free Tier
      const tier = currentUser.user_metadata?.license_tier || "Free Tier / No Active License";
      const isActive = currentUser.user_metadata?.license_active === true;
      
      setLicenseTier(tier);
      setHasActiveLicense(isActive);

      setLoading(false);
    }
    loadAccount();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updates: any = {
        data: { full_name: fullName },
      };

      if (newPassword.trim().length > 0) {
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        updates.password = newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      setMessage({ type: "success", text: "Account information updated successfully!" });
      setNewPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold hover:border-red-500/50 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Account Profile</h1>

        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Personal Info Update Form */}
          <div className="lg:col-span-2 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold">Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-xs text-neutral-400 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-2">Full / Display Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs text-neutral-400 mb-2">Change Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none transition-colors pl-10"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-neutral-950 text-xs font-bold hover:bg-cyan-300 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile Updates
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Subscription & HWID Status Panel */}
          <div className="space-y-6">
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold">Subscription Status</h2>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Current Active Tier</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${hasActiveLicense ? "text-cyan-400" : "text-amber-400"}`}>
                    {licenseTier}
                  </span>
                </div>
              </div>

              {!hasActiveLicense && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs space-y-2">
                  <p>No active desktop license detected on this account.</p>
                  <Link
                    href="/#download"
                    className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:underline"
                  >
                    Purchase / Claim License <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-white/5">
                <p className="text-xs text-neutral-400">Member Since</p>
                <p className="text-xs font-semibold text-white">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : "August 2026"}
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <Laptop className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold">HWID Bindings</h2>
              </div>
              <p className="text-xs text-neutral-400">
                {hasActiveLicense
                  ? "Bound Windows Hardware Identifiers."
                  : "Requires an active license before registering PC Hardware IDs."}
              </p>
              <button
                disabled={!hasActiveLicense}
                className="w-full py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Manage Hardware IDs
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}