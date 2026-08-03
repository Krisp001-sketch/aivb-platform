"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, User, LogIn, Menu, X, LogOut, Shield } from "lucide-react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "muqasim444@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkAdminStatus = (currentUser: any) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const userEmail = currentUser.email?.trim().toLowerCase();
    const isEmailAllowed = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
    const hasAdminRole =
      currentUser.user_metadata?.role === "admin" || currentUser.app_metadata?.role === "admin";
    
    setIsAdmin(isEmailAllowed || hasAdminRole);
  };

  useEffect(() => {
    // 1. Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    // 2. Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            AIVB <span className="text-xs font-normal text-neutral-400">Studio</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#workflow" className="hover:text-white transition-colors">
            Workflow
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/downloads" className="hover:text-white transition-colors">
            Download
          </Link>

          {/* Dynamic Admin Link on Main Bar */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30"
            >
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
        </div>

        {/* Dynamic Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-cyan-500/30 text-xs font-semibold text-white hover:border-cyan-400 transition-all shadow-md shadow-cyan-500/5"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>{user.user_metadata?.full_name || user.email?.split("@")[0] || "Account"}</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-neutral-950 font-bold text-xs hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
            >
              <LogIn className="w-4 h-4" /> Sign In / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 space-y-3 border-t border-white/10 mt-4">
          <Link href="/#features" className="block text-sm text-neutral-400 hover:text-white py-1">
            Features
          </Link>
          <Link href="/#workflow" className="block text-sm text-neutral-400 hover:text-white py-1">
            Workflow
          </Link>
          <Link href="/pricing" className="block text-sm text-neutral-400 hover:text-white py-1">
            Pricing
          </Link>
          <Link href="/docs" className="block text-sm text-neutral-400 hover:text-white py-1">
            Docs
          </Link>
          <Link href="/downloads" className="block text-sm text-neutral-400 hover:text-white py-1">
            Download
          </Link>
          
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm text-cyan-400 font-semibold py-1.5 px-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 w-fit"
            >
              <Shield className="w-4 h-4" /> Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-white/10">
            {user ? (
              <Link
                href="/account"
                className="block w-full text-center py-2.5 rounded-xl bg-neutral-900 border border-cyan-500/30 text-white text-xs font-bold"
              >
                Go to Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center py-2.5 rounded-xl bg-cyan-400 text-neutral-950 text-xs font-bold"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}