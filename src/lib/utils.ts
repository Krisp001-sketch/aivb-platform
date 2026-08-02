// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes cleanly avoiding specificity conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats ISO date strings into human-readable format.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Truncates long HWID hashes for UI display (e.g., e3b0c442...924).
 */
export function shortenHWID(hwid: string, chars = 6): string {
  if (!hwid || hwid.length <= chars * 2) return hwid;
  return `${hwid.slice(0, chars)}...${hwid.slice(-chars)}`;
}