"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { HWIDTable, DeviceBinding } from "../../components/admin/HWIDTable";
import { KeyGenerator } from "../../components/admin/KeyGenerator";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Shield, 
  Loader2, 
  Search, 
  Users, 
  Edit2, 
  Save, 
  X, 
  RefreshCw,
  HardDrive
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const HARDCODED_ADMINS = ["muqasim444@gmail.com"];
const ENV_ADMINS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_EMAILS = Array.from(new Set([...HARDCODED_ADMINS, ...ENV_ADMINS]));

export default function AdminPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // System States
  const [devices, setDevices] = useState<DeviceBinding[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // Search & Edit States
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ tier: string; status: string; max_devices: number }>({
    tier: "PRO",
    status: "ACTIVE",
    max_devices: 3,
  });

  const fetchData = useCallback(async () => {
    setDevicesLoading(true);
    setUsersLoading(true);
    try {
      // 1. Fetch Active Devices with Linked Licenses
      const { data: devData, error: devError } = await supabase
        .from("devices")
        .select("*, licenses(key, tier, user_id)")
        .order("created_at", { ascending: false });

      if (!devError && devData) {
        setDevices(devData as unknown as DeviceBinding[]);
      }

      // 2. Fetch Licenses for User Management Table
      const { data: licData, error: licError } = await supabase
        .from("licenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!licError && licData) {
        setLicenses(licData);
      }
    } catch (err) {
      console.error("Error loading administration metrics:", err);
    } finally {
      setDevicesLoading(false);
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      const userEmail = user.email?.trim().toLowerCase();
      const isEmailAllowed = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
      const hasAdminRole =
        user.user_metadata?.role === "admin" || user.app_metadata?.role === "admin";

      if (isEmailAllowed || hasAdminRole) {
        setIsAdmin(true);
        await fetchData();
      } else {
        setIsAdmin(false);
      }

      setAuthLoading(false);
    }

    checkAdminAndLoadData();
  }, [router, fetchData]);

  const handleUnbindDevice = async (deviceId: string) => {
    try {
      const res = await fetch("/api/license/unbind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      } else {
        console.error("Unbind failed:", data.error || data.message);
      }
    } catch (err) {
      console.error("Failed to unbind device:", err);
    }
  };

  const startEditLicense = (lic: any) => {
    setEditingLicenseId(lic.id);
    setEditForm({
      tier: lic.tier || "PRO",
      status: lic.status || "ACTIVE",
      max_devices: lic.max_devices || 3,
    });
  };

  const saveLicenseChanges = async (licenseId: string) => {
    try {
      const { error } = await supabase
        .from("licenses")
        .update({
          tier: editForm.tier,
          status: editForm.status,
          max_devices: editForm.max_devices,
        })
        .eq("id", licenseId);

      if (!error) {
        setLicenses((prev) =>
          prev.map((item) =>
            item.id === licenseId ? { ...item, ...editForm } : item
          )
        );
        setEditingLicenseId(null);
      } else {
        console.error("Failed to update license:", error.message);
      }
    } catch (err) {
      console.error("Error updating license:", err);
    }
  };

  // Filter Licenses/Users by Search Query
  const filteredLicenses = licenses.filter((lic) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      (lic.key && lic.key.toLowerCase().includes(q)) ||
      (lic.user_id && lic.user_id.toLowerCase().includes(q)) ||
      (lic.tier && lic.tier.toLowerCase().includes(q)) ||
      (lic.status && lic.status.toLowerCase().includes(q))
    );
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brandBlue" />
      </div>
    );
  }

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
              Your account (<span className="text-white font-mono">{currentUser?.email || "Unknown"}</span>) does not have administrative rights.
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

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-brandBlue" /> Licensing Admin Control
          </h1>
          <p className="text-textMuted text-sm">
            Generate serial keys, manage user accounts, update max device limits, and inspect active HWID nodes.
          </p>
        </div>

        {/* Top Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6">
            <KeyGenerator onSuccess={fetchData} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-brandBlue" /> Active Bound Devices
              </span>
              {devicesLoading && <Loader2 className="w-4 h-4 animate-spin text-brandBlue" />}
            </h2>
            <HWIDTable devices={devices} onUnbind={handleUnbindDevice} />
          </div>
        </div>

        {/* User Account & License Management Table */}
        <Card className="p-6 border-borderDark space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderDark/60 pb-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-brandBlue" /> User & License Database
              </h2>
              <p className="text-xs text-textMuted">Search accounts, alter license tiers, or adjust hardware allowances.</p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-textMuted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by key, user ID, tier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brandBlue"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-textMuted gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brandBlue" /> Querying license database...
            </div>
          ) : filteredLicenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-borderDark text-textMuted uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Serial Key</th>
                    <th className="py-2.5 px-3">User ID</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Max Slots</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderDark/50">
                  {filteredLicenses.map((lic) => {
                    const isEditing = editingLicenseId === lic.id;
                    return (
                      <tr key={lic.id} className="hover:bg-background/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-white font-medium select-all">
                          {lic.key}
                        </td>
                        <td className="py-3 px-3 text-textMuted font-mono truncate max-w-[140px]">
                          {lic.user_id || "Unassigned"}
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <select
                              value={editForm.tier}
                              onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                              className="bg-background border border-borderDark text-white text-xs rounded px-2 py-1"
                            >
                              <option value="FREE">FREE</option>
                              <option value="PRO">PRO</option>
                              <option value="ENTERPRISE">ENTERPRISE</option>
                            </select>
                          ) : (
                            <span className="font-semibold text-brandBlue uppercase">{lic.tier}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="bg-background border border-borderDark text-white text-xs rounded px-2 py-1"
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="SUSPENDED">SUSPENDED</option>
                              <option value="EXPIRED">EXPIRED</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                lic.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {lic.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={editForm.max_devices}
                              onChange={(e) =>
                                setEditForm({ ...editForm, max_devices: parseInt(e.target.value) || 1 })
                              }
                              className="w-16 bg-background border border-borderDark text-white text-xs rounded px-2 py-1"
                            />
                          ) : (
                            <span className="text-white font-medium">{lic.max_devices} Devices</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => saveLicenseChanges(lic.id)}
                                className="p-1.5 h-auto text-[10px]"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingLicenseId(null)}
                                className="p-1.5 h-auto text-[10px]"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => startEditLicense(lic)}
                              className="p-1.5 h-auto text-[10px]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-textMuted italic text-center py-6">
              No matching accounts or license records found in database.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}