"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  ShieldCheck,
  Key,
  Monitor,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  Clock,
  Laptop,
  Search,
  Loader2,
} from "lucide-react";

interface Device {
  id: string;
  device_name: string;
  hwid: string;
  activated_at: string;
  last_heartbeat: string;
}

export default function PortalPage() {
  const [copied, setCopied] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unbindingId, setUnbindingId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [maxDevices, setMaxDevices] = useState(3);
  const [tier, setTier] = useState("PRO");
  const [errorMsg, setErrorMsg] = useState("");

  const copyLicense = () => {
    if (!activeKey) return;
    navigator.clipboard.writeText(activeKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString;
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/license/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKeyInput.trim(), hwid: "PORTAL_CLIENT" }),
      });
      const data = await res.json();

      if (data.valid || data.status === "ACTIVE") {
        setActiveKey(licenseKeyInput.trim());
        if (data.devices) setDevices(data.devices);
        if (data.max_devices) setMaxDevices(data.max_devices);
        if (data.tier) setTier(data.tier);
      } else {
        setErrorMsg(data.reason || "Invalid license key provided.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to license validation server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbind = async (deviceId: string) => {
    setUnbindingId(deviceId);
    try {
      const res = await fetch("/api/license/unbind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: activeKey, device_id: deviceId }),
      });
      const data = await res.json();

      if (data.success) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      } else {
        alert(data.error || "Failed to unbind device");
      }
    } catch (err) {
      alert("Network error unbinding device");
    } finally {
      setUnbindingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Customer Portal</h1>
            <p className="text-textMuted text-sm">
              Manage hardware bindings (HWID) and review active license parameters.
            </p>
          </div>
        </div>

        {/* License Verification Input */}
        <Card className="space-y-4 border-brandBlue/30 bg-surface/40">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-brandBlue" /> Lookup License Key
          </h3>
          <form onSubmit={handleLookup} className="flex gap-3">
            <input
              type="text"
              placeholder="Paste Serial Key (e.g. AIVB-PRO-XXXX-XXXX)"
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              className="flex-1 bg-background border border-borderDark rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-brandBlue"
            />
            <Button
              variant="primary"
              size="sm"
              disabled={isLoading}
              icon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            >
              {isLoading ? "Loading..." : "Load License"}
            </Button>
          </form>
          {errorMsg && (
            <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-textMuted">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-brandBlue" /> Active Key
              </span>
              <span className="text-brandBlue font-mono text-[11px]">
                {tier} TIER ({maxDevices} Devices Allowed)
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-borderDark font-mono text-sm tracking-wider text-white">
              <span>{activeKey || "No License Loaded"}</span>
              {activeKey && (
                <button onClick={copyLicense} className="text-textMuted hover:text-white p-1">
                  {copied ? <Check className="w-4 h-4 text-brandGreen" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </Card>

          <Card className="space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-textMuted">
              <span className="flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-brandPurple" /> Slot Usage
              </span>
              <span className="font-mono text-white font-bold">
                {devices.length} / {maxDevices}
              </span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-borderDark">
              <div
                className="bg-brandBlue h-full transition-all duration-300"
                style={{ width: `${Math.min((devices.length / maxDevices) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-textMuted">
              {Math.max(maxDevices - devices.length, 0)} slot(s) remaining.
            </p>
          </Card>
        </div>

        {/* Bound Devices Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Bound Machines</h2>
          <div className="rounded-xl border border-borderDark bg-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-borderDark text-xs font-bold text-textMuted uppercase tracking-wider">
              <div className="col-span-4">Device Identity</div>
              <div className="col-span-4">HWID Hash</div>
              <div className="col-span-3">Last Active</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="divide-y divide-borderDark">
              {devices.map((device) => (
                <div key={device.id} className="grid grid-cols-12 gap-4 p-4 items-center text-xs text-textMuted hover:bg-surface/30">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface border border-borderDark text-white">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{device.device_name}</div>
                      <div className="text-[10px] text-textMuted">Bound: {formatDate(device.activated_at)}</div>
                    </div>
                  </div>

                  <div className="col-span-4 font-mono text-[11px] text-gray-300 truncate" title={device.hwid}>
                    {device.hwid}
                  </div>

                  <div className="col-span-3 flex items-center gap-1.5 text-textMuted">
                    <Clock className="w-3.5 h-3.5 text-brandGreen" />
                    <span>{formatTimeAgo(device.last_heartbeat)}</span>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleUnbind(device.id)}
                      disabled={unbindingId === device.id}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                      title="Unbind Device"
                    >
                      {unbindingId === device.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {devices.length === 0 && (
                <div className="p-8 text-center text-textMuted text-xs">
                  No active HWID bindings registered under this license key.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}