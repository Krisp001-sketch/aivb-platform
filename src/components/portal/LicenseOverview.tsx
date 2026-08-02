// src/components/portal/LicenseOverview.tsx
"use client";

import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Key, Copy, Check, Monitor } from "lucide-react";

interface LicenseOverviewProps {
  licenseKey: string;
  tier: string;
  activeCount: number;
  maxDevices: number;
}

export function LicenseOverview({
  licenseKey,
  tier,
  activeCount,
  maxDevices,
}: LicenseOverviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentage = Math.min(100, (activeCount / maxDevices) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* License Key Info */}
      <Card className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between text-xs font-semibold text-textMuted">
          <span className="flex items-center gap-1.5">
            <Key className="w-4 h-4 text-brandBlue" /> Active License Key
          </span>
          <span className="px-2 py-0.5 rounded bg-brandBlue/10 text-brandBlue font-mono text-[10px] uppercase">
            {tier} TIER
          </span>
        </div>
        <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-borderDark font-mono text-sm tracking-wider text-white">
          <span>{licenseKey || "No License Loaded"}</span>
          {licenseKey && (
            <button
              onClick={handleCopy}
              className="text-textMuted hover:text-white transition-colors p-1"
              title="Copy License Key"
            >
              {copied ? (
                <Check className="w-4 h-4 text-brandGreen" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </Card>

      {/* Activation Slots Counter */}
      <Card className="space-y-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-textMuted">
          <span className="flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-brandPurple" /> Hardware Slots
          </span>
          <span className="font-mono text-white font-bold">
            {activeCount} / {maxDevices}
          </span>
        </div>
        <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-borderDark">
          <div
            className="bg-brandBlue h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[11px] text-textMuted">
          {maxDevices - activeCount} activation slot(s) remaining.
        </p>
      </Card>
    </div>
  );
}