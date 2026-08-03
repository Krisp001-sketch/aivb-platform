"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { User, Calendar, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Editable Form Fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setDateOfBirth(user.user_metadata?.date_of_birth || "");
      }
      setLoading(false);
    }
    getUserData();
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
        <Card className="p-8 text-center space-y-4 max-w-sm w-full">
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
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-xs text-textMuted">Manage your personal details and system metadata.</p>
        </div>

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

        <Card className="p-8 border-brandBlue/30 space-y-6">
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