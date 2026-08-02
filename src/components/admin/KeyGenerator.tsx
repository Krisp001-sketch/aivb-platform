// src/components/admin/KeyGenerator.tsx
"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Send, CheckCircle, ShieldAlert } from "lucide-react";

export function KeyGenerator() {
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("PRO");
  const [maxDevices, setMaxDevices] = useState(3);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier, max_devices: maxDevices }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          success: true,
          message: `Issued Key: ${data.license.key} (Sent to ${email})`,
        });
        setEmail("");
      } else {
        setStatus({ success: false, message: data.error || "Failed to generate key." });
      }
    } catch (err) {
      setStatus({ success: false, message: "Network connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-4">
      <h3 className="text-base font-bold text-white">Generate Serial Key</h3>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs text-textMuted mb-1">Customer Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full bg-background border border-borderDark rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-textMuted mb-1">Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-background border border-borderDark rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
            >
              <option value="TRIAL">TRIAL</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-textMuted mb-1">Max Devices</label>
            <input
              type="number"
              min="1"
              max="10"
              value={maxDevices}
              onChange={(e) => setMaxDevices(Number(e.target.value))}
              className="w-full bg-background border border-borderDark rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={loading}
          icon={<Send className="w-3.5 h-3.5" />}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate & Dispatch"}
        </Button>
      </form>

      {status && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            status.success
              ? "bg-brandGreen/10 border-brandGreen/30 text-brandGreen"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {status.success ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 shrink-0" />
          )}
          <span className="font-mono text-[11px]">{status.message}</span>
        </div>
      )}
    </Card>
  );
}