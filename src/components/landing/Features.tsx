"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FolderSync,
  Bot,
  Mic,
  Video,
  Layers,
  Terminal,
  ShieldCheck,
  Cloud,
  Sparkles,
  Zap,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const features = [
  {
    icon: FolderSync,
    title: "Automatic Asset Matching",
    description: "AI maps stock footage & local assets directly to your script timestamps.",
    badge: "AI Core",
    glow: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
    borderColor: "group-hover:border-cyan-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
        <div className="flex items-center gap-2 z-10 font-mono text-[10px]">
          <div className="p-2 rounded bg-neutral-900/90 border border-cyan-500/30 text-cyan-300">script.txt</div>
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <div className="p-2 rounded bg-neutral-900/90 border border-blue-500/30 text-blue-300">media_asset.mp4</div>
        </div>
      </div>
    ),
  },
  {
    icon: Bot,
    title: "AI Scene Detection",
    description: "Automated scene splitting with dynamic visual cuts & semantic cues.",
    badge: "Automation",
    glow: "from-purple-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-purple-400",
    borderColor: "group-hover:border-purple-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
        <div className="grid grid-cols-3 gap-1.5 w-3/4 z-10">
          <div className="h-10 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[9px] font-mono text-purple-300">Scene 1</div>
          <div className="h-10 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[9px] font-mono text-indigo-300">Scene 2</div>
          <div className="h-10 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[9px] font-mono text-cyan-300">Scene 3</div>
        </div>
      </div>
    ),
  },
  {
    icon: Mic,
    title: "Voice Synchronization",
    description: "Auto-align generated narration with precise audio waveform markers.",
    badge: "Audio Studio",
    glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
    borderColor: "group-hover:border-emerald-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <div className="flex items-end gap-1 h-12 z-10">
          {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 65].map((h, i) => (
            <div key={i} className="w-1.5 rounded-full bg-emerald-400/60" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Video,
    title: "Pro Timeline Editor",
    description: "Full multitrack visual editing directly inside your local desktop environment.",
    badge: "Multitrack",
    glow: "from-pink-500/20 via-rose-500/10 to-transparent",
    iconColor: "text-pink-400",
    borderColor: "group-hover:border-pink-500/40",
    graphic: (
      <div className="w-full h-full flex flex-col justify-center gap-1.5 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
        <div className="h-3 w-full rounded bg-pink-500/20 border border-pink-500/40 z-10 flex items-center px-2 text-[8px] font-mono text-pink-300">Audio Track</div>
        <div className="h-3 w-4/5 rounded bg-rose-500/20 border border-rose-500/40 z-10 flex items-center px-2 text-[8px] font-mono text-rose-300">Video Track</div>
        <div className="h-3 w-3/5 rounded bg-purple-500/20 border border-purple-500/40 z-10 flex items-center px-2 text-[8px] font-mono text-purple-300">Subtitle Track</div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: "Asset Library Indexing",
    description: "Organize, tag, and index thousands of media assets instantly.",
    badge: "Library",
    glow: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    borderColor: "group-hover:border-amber-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
        <div className="relative w-28 h-16 z-10">
          <div className="absolute inset-0 rounded-lg bg-neutral-900 border border-amber-500/30 rotate-6 translate-x-2" />
          <div className="absolute inset-0 rounded-lg bg-neutral-900 border border-amber-500/40 -rotate-3" />
          <div className="absolute inset-0 rounded-lg bg-neutral-900 border border-amber-400/60 p-2 flex items-center justify-between text-[10px] font-mono text-amber-300 shadow-lg">
            <span>Assets.db</span>
            <span className="text-[9px] bg-amber-500/20 px-1 rounded">Indexed</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Terminal,
    title: "FFmpeg Hardware Acceleration",
    description: "Multithreaded GPU rendering pipeline using NVENC/AMF hardware encoders.",
    badge: "GPU Engine",
    glow: "from-cyan-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-cyan-400",
    borderColor: "group-hover:border-cyan-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden font-mono text-[9px] px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
        <div className="w-full p-2 rounded bg-neutral-950/90 border border-cyan-500/30 text-cyan-400 z-10 space-y-1">
          <div className="flex justify-between">
            <span>[FFMPEG] Render</span>
            <span className="text-emerald-400">60 FPS</span>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-cyan-400" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "HWID Cryptographic Security",
    description: "Hardware-locked licensing system guaranteeing secure local execution.",
    badge: "Security",
    glow: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-blue-400",
    borderColor: "group-hover:border-blue-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
        <div className="px-3 py-1.5 rounded-full bg-neutral-900 border border-blue-500/40 text-[10px] font-mono text-blue-300 z-10 flex items-center gap-1.5 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>HWID-VERIFIED</span>
        </div>
      </div>
    ),
  },
  {
    icon: Cloud,
    title: "Batch Script Processing",
    description: "Queue unlimited video build files for continuous unattended execution.",
    badge: "Workflow",
    glow: "from-sky-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-sky-400",
    borderColor: "group-hover:border-sky-500/40",
    graphic: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent" />
        <div className="flex flex-col gap-1 w-3/4 z-10 font-mono text-[9px]">
          <div className="p-1.5 rounded bg-neutral-900 border border-sky-500/30 text-sky-300 flex justify-between">
            <span>Batch_01</span>
            <span className="text-emerald-400">Done</span>
          </div>
          <div className="p-1.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 flex justify-between">
            <span>Batch_02</span>
            <span>Queued</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      {/* Heading Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Engine
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Built for High-Speed <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Desktop Rendering</span>
        </h2>
        <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
          Powering professional automated video asset compilation with native GPU hardware performance.
        </p>
      </div>

      {/* Lightweight Glassmorphic Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`group relative rounded-2xl bg-neutral-900/60 border border-white/10 ${feature.borderColor} overflow-hidden backdrop-blur-md transition-all shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between`}
          >
            {/* Lightweight Vector Banner */}
            <div className="relative h-32 w-full bg-neutral-950/80 border-b border-white/5">
              {feature.graphic}

              {/* Top Badge */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-950/80 border border-white/10 text-[9px] font-bold text-neutral-300 backdrop-blur-md">
                {feature.badge}
              </div>

              {/* Floating Icon */}
              <div className="absolute bottom-2.5 left-3 p-2 rounded-lg bg-neutral-900/90 border border-white/10 shadow-md backdrop-blur-md">
                <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500">
                <span>Optimized Engine</span>
                <span className="text-cyan-400/80 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                  Details →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Features;