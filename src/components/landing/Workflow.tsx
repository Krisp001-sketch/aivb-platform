"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Cpu,
  Layers,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Script Input",
    desc: "Paste raw text scripts or AI narrative prompt.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    desc: "Semantic NLP extracts timestamps & visual triggers.",
    color: "from-cyan-400 to-teal-400",
  },
  {
    icon: Layers,
    step: "03",
    title: "Timeline Build",
    desc: "Automated multitrack layout & dynamic audio cuts.",
    color: "from-teal-400 to-indigo-500",
  },
  {
    icon: ImageIcon,
    step: "04",
    title: "Asset Match",
    desc: "Auto-assign stock footage & media overlays.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Film,
    step: "05",
    title: "GPU Render",
    desc: "Multithreaded FFmpeg hardware acceleration.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CheckCircle2,
    step: "06",
    title: "4K Export",
    desc: "Crisp production-ready MP4 output.",
    color: "from-pink-500 to-emerald-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Workflow = () => {
  return (
    <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto my-16 space-y-14">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> Automated Pipeline
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          How <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI Asset Video Builder</span> Works
        </h2>
        <p className="text-xs md:text-sm text-neutral-400">
          Transform raw video scripts into fully assembled high-definition videos in 6 seamless steps.
        </p>
      </motion.div>

      {/* 6-Step Visual Cards Pipeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative"
      >
        {steps.map((s, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative p-5 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-cyan-500/10"
          >
            {/* Step Number Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md bg-gradient-to-r ${s.color} text-neutral-950`}>
                STEP {s.step}
              </span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-neutral-600 hidden lg:block group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              )}
            </div>

            {/* Icon Container with Glow */}
            <div className="relative w-12 h-12 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${s.color} opacity-20 blur-sm group-hover:opacity-40 transition-opacity`} />
              <s.icon className="w-5 h-5 text-cyan-400 relative z-10" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {s.title}
              </h4>
              <p className="text-[11px] text-neutral-400 leading-snug">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};