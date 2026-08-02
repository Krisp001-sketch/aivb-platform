"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the account verification link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/account");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <Card className="space-y-6 p-8 border-brandBlue/30">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignUp ? "Create AIVB Account" : "Sign In to Account"}
            </h1>
            <p className="text-xs text-textMuted">
              Manage licenses, cloud sync, and device activations.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@studio.com"
                  className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-textMuted">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
              icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsSignUp(!isSignUp);
              }}
              className="text-xs text-brandBlue hover:underline font-semibold"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}