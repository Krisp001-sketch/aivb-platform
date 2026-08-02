export interface Device {
  id: string;
  name: string;
  os: "Windows" ;
  ip: string;
  lastActive: string;
  status: "Active" | "Idle" | "Offline";
}

export interface LicenseInfo {
  key: string;
  plan: string;
  status: "Active" | "Expired" | "Pending";
  maxDevices: number;
  activeDevicesCount: number;
  expirationDate: string;
}