"use client";

import { motion } from "framer-motion";
import { Download, Terminal, Play, Cpu, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        AI Asset Video Builder v2.4 Active &bull; HWID Cryptographic Security
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
      >
        Automated AI Video Builder & <br />
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          Batch Render Desktop Engine
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
      >
        High-performance Windows software built for content creators. Process script parsing, localized media mapping, multitrack audio timeline synchronization, and GPU rendering—all locally on your hardware.
      </motion.p>

      {/* Call to Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 pt-2"
      >
        {/* FIXED LINK TO /downloads */}
        <Link
          href="/downloads"
          className="flex items-center gap-2 text-sm font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 px-6 py-3 rounded-xl transition-all shadow-xl shadow-cyan-500/25"
        >
          <Download className="w-4 h-4" />
          Download Windows App (.exe)
        </Link>
        <Link
          href="/portal"
          className="flex items-center gap-2 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 px-6 py-3 rounded-xl transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Manage License Portal
        </Link>
      </motion.div>

      {/* Desktop App Preview Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 shadow-2xl max-w-5xl mx-auto overflow-hidden text-left"
      >
        {/* App Titlebar Mockup */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] font-mono text-neutral-400 ml-2">AIVB Desktop Studio v2.4 — [HWID-BOUND]</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-emerald-400" /> GPU Accelerated</span>
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-cyan-400" /> FFmpeg Thread Pool</span>
          </div>
        </div>

        {/* Inner App Workspace Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-cyan-400" /> Queue Processing
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex justify-between">
                <span className="text-white font-medium">Batch_Script_01.txt</span>
                <span className="text-emerald-400 font-mono">Rendering (78%)</span>
              </div>
              <div className="p-2 rounded bg-neutral-900/50 border border-neutral-800 flex justify-between text-neutral-400">
                <span>Batch_Script_02.txt</span>
                <span className="font-mono">Queued</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Live Pipeline Diagnostics</h4>
            <div className="p-3 rounded bg-neutral-900 font-mono text-[11px] text-neutral-400 space-y-1">
              <p className="text-cyan-400">[SYS] Initializing FFmpeg multithreading on NVENC hardware encoder...</p>
              <p className="text-white">[AI] Parsing timestamps and matching localized asset vectors (24 assets assigned)</p>
              <p className="text-emerald-400">[SUCCESS] Frame buffer initialized. Output: 3840x2160 @ 60fps</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};