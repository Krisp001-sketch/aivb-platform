"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glow = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`relative group rounded-[10px] bg-card border border-borderDark p-6 transition-all duration-300 hover:border-brandBlue/40 hover:shadow-xl ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Subtle Glow Overlay on Hover */}
      {glow && (
        <div className="absolute inset-0 rounded-[10px] bg-gradient-to-b from-brandBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};