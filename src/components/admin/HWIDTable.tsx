// src/components/admin/HWIDTable.tsx
"use client";

import React, { useState } from "react";
import { Trash2, Laptop, Clock, ShieldCheck } from "lucide-react";
import { formatDate, shortenHWID } from "../../lib/utils";

export interface DeviceBinding {
  id: string;
  device_name: string;
  hwid: string;
  last_heartbeat: string;
  activated_at: string;
  license_key: string;
}

interface HWIDTableProps {
  devices: DeviceBinding[];
  onUnbind: (deviceId: string) => void;
}

export function HWIDTable({ devices, onUnbind }: HWIDTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onUnbind(id);
    setDeletingId(null);
  };

  return (
    <div className="rounded-xl border border-borderDark bg-card overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-borderDark text-xs font-bold text-textMuted uppercase tracking-wider">
        <div className="col-span-4">Device Identity</div>
        <div className="col-span-3">License Binding</div>
        <div className="col-span-3">Last Heartbeat</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      <div className="divide-y divide-borderDark">
        {devices.map((device) => (
          <div
            key={device.id}
            className="grid grid-cols-12 gap-4 p-4 items-center text-xs text-textMuted hover:bg-surface/30 transition-colors"
          >
            {/* Device Info */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface border border-borderDark text-white">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">{device.device_name}</div>
                <div className="font-mono text-[10px] text-textMuted" title={device.hwid}>
                  {shortenHWID(device.hwid)}
                </div>
              </div>
            </div>

            {/* License Key */}
            <div className="col-span-3 font-mono text-[11px] text-brandBlue truncate">
              {device.license_key}
            </div>

            {/* Heartbeat Status */}
            <div className="col-span-3 flex items-center gap-1.5 text-textMuted">
              <Clock className="w-3.5 h-3.5 text-brandGreen" />
              <span>{formatDate(device.last_heartbeat)}</span>
            </div>

            {/* Unbind Button */}
            <div className="col-span-2 text-right">
              <button
                disabled={deletingId === device.id}
                onClick={() => handleDelete(device.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                title="Force Unbind HWID"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="p-8 text-center text-textMuted text-xs">
            No active hardware bindings found in database.
          </div>
        )}
      </div>
    </div>
  );
}