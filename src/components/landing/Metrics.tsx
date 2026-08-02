"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Active Creators", value: "1,500+" },
  { label: "Assets Indexed", value: "250K+" },
  { label: "Videos Rendered", value: "18,000+" },
  { label: "System Uptime", value: "99.9%" },
];

export const Metrics = () => {
  return (
    <section className="border-y border-borderDark bg-surface/50 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-1"
          >
            <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-textMuted uppercase font-medium tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};