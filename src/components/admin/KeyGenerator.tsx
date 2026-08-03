"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Key, Send, CheckCircle, ShieldAlert } from "lucide-react";

interface KeyGeneratorProps {
  onSuccess?: () => void;
}

export function KeyGenerator({ onSuccess }: KeyGeneratorProps) {
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("PRO");
  const [maxDevices, setMaxDevices] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; key?: string; error?: string } | null>(null);

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
        setResult({ success: true, key: data.license?.key || data.key });
        setEmail("");
        if (onSuccess) onSuccess();
      } else {
        setResult({ success: false, error: data.error || "Failed to generate key." });
      }
    } catch (err) {
      setResult({ success: false, error: "Network request failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <option value="TRIAL">Trial (1 Device)</option>
              <option value="PRO">Pro (3 Devices)</option>
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
          {loading ? "Generating & Binding..." : "Issue License & Dispatch Email"}
        </Button>
      </form>

      {result && (
        <div
          className={`p-4 rounded-lg border text-xs flex items-center gap-3 ${
            result.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
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
  );
}