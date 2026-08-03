"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Mail, Lock, User, Calendar, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { supabase } from "../../lib/supabase";

type AuthMode = "signin" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              date_of_birth: dateOfBirth,
            },
          },
        });

        if (error) throw error;
        setIsSubmitted(true);
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) throw error;
        setSuccessMessage("Password reset email sent! Please check your inbox.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  // State: Confirmation Message after Sign-Up
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Card className="space-y-6 p-8 border-brandBlue/30 text-center">
            <div className="w-12 h-12 bg-brandBlue/20 text-brandBlue rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="text-xs text-textMuted leading-relaxed">
                We sent a confirmation link to <span className="text-white font-semibold">{email}</span>. Please verify your email address to activate your account.
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setMode("signin");
              }}
            >
              Back to Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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
              {mode === "signup" && "Create AIVB Account"}
              {mode === "signin" && "Sign In to Account"}
              {mode === "forgot" && "Reset Password"}
            </h1>
            <p className="text-xs text-textMuted">
              {mode === "signup" && "Fill out your details to activate standard cloud access."}
              {mode === "signin" && "Manage licenses, cloud sync, and device activations."}
              {mode === "forgot" && "Enter your email address to receive a recovery link."}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SIGN UP FIELDS */}
            {mode === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-textMuted">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-textMuted">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL FIELD (ALL MODES) */}
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

            {/* PASSWORD FIELDS */}
            {mode !== "forgot" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-textMuted">Password</label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setSuccessMessage(null);
                        setMode("forgot");
                      }}
                      className="text-xs text-brandBlue hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
            )}

            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-textMuted">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-background border border-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brandBlue"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "forgot" ? (
                  <KeyRound className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
            >
              {isLoading
                ? "Processing..."
                : mode === "signup"
                ? "Create Account"
                : mode === "forgot"
                ? "Send Reset Link"
                : "Sign In"}
            </Button>
          </form>

          {/* TOGGLE MODES */}
          <div className="text-center pt-2 space-y-2">
            {mode === "forgot" ? (
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode("signin");
                }}
                className="text-xs text-brandBlue hover:underline font-semibold"
              >
                ← Back to Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode(mode === "signup" ? "signin" : "signup");
                }}
                className="text-xs text-brandBlue hover:underline font-semibold"
              >
                {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}