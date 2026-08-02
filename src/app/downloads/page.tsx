"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  Download,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  ArrowLeft,
  Apple,
  Cpu,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DownloadsPage() {
  const [copied, setCopied] = useState(false);
  const sha256Hash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const copyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Download AI Asset Video Builder
            </h1>
            <p className="text-textMuted text-sm">
              Official releases for Windows x64 desktop platforms.
            </p>
          </div>
        </motion.div>

        {/* Primary Download Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Windows Download Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card glow className="space-y-6 border-brandBlue/40 h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brandBlue/10 text-brandBlue border border-brandBlue/20">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">Windows x64 Edition</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brandGreen/10 text-brandGreen border border-brandGreen/20">
                        STABLE
                      </span>
                    </div>
                    <p className="text-xs text-textMuted">Version 2.4.0 • Windows 10/11 (64-bit)</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-textMuted leading-relaxed">
                Includes native FFmpeg hardware acceleration binaries, CUDA support for AI asset matching, and cryptographically signed installer.
              </p>

              <div className="space-y-3 pt-2">
                <Button className="w-full justify-center gap-2 py-3" size="lg">
                  <Download className="w-5 h-5" /> Download Windows Installer (.exe)
                </Button>
                <div className="flex items-center justify-between text-[11px] text-textMuted">
                  <span>Release Date: July 2026</span>
                  <span>File Size: ~142 MB</span>
                </div>
              </div>

              {/* Checksum & Digital Signature */}
              <div className="space-y-2 pt-4 border-t border-borderDark">
                <div className="flex items-center justify-between text-xs font-semibold text-textMuted">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brandGreen" /> SHA256 Checksum
                  </span>
                  <button
                    onClick={copyHash}
                    className="text-brandBlue hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy Hash"}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-surface border border-borderDark text-[11px] font-mono text-gray-400 break-all">
                  {sha256Hash}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* System Requirements */}
          <motion.div variants={itemVariants}>
            <Card className="space-y-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-textMuted mb-3">
                  Minimum Requirements
                </h3>
                <ul className="space-y-2.5 text-xs text-textMuted">
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>OS</span>
                    <span className="text-white font-medium">Windows 10 / 11 (64-bit)</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>Processor</span>
                    <span className="text-white font-medium">Intel i5 / AMD Ryzen 5</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>Memory</span>
                    <span className="text-white font-medium">16 GB RAM</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>Graphics</span>
                    <span className="text-white font-medium">NVIDIA GTX 1060+</span>
                  </li>
                  <li className="flex items-center justify-between pb-1">
                    <span>Storage</span>
                    <span className="text-white font-medium">2 GB SSD Space</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-borderDark text-[11px] text-textMuted flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brandBlue shrink-0" />
                <span>Silent deployment supported with <code className="text-white">/S</code> flag.</span>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Coming Soon Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4 pt-6 border-t border-borderDark"
        >
          <h3 className="text-base font-bold">Other Operating Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl bg-card border border-borderDark/60 opacity-60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Apple className="w-6 h-6 text-textMuted" />
                <div>
                  <h4 className="text-sm font-bold text-white">macOS (Apple Silicon & Intel)</h4>
                  <p className="text-xs text-textMuted">Universal Binary Build</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-surface border border-borderDark text-textMuted">
                Coming Soon
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl bg-card border border-borderDark/60 opacity-60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-textMuted" />
                <div>
                  <h4 className="text-sm font-bold text-white">Linux (AppImage / Debian)</h4>
                  <p className="text-xs text-textMuted">Ubuntu / Debian / Fedora</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-surface border border-borderDark text-textMuted">
                Coming Soon
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}