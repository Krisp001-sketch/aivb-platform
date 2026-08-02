"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  ...props
}) => {
  // Base styling for all variants
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  // Size variations
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs md:text-sm gap-2",
    lg: "px-6 py-3 text-sm md:text-base gap-2.5",
  };

  // Theme variant styles
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-brandBlue to-brandPurple text-white hover:opacity-90 shadow-lg shadow-brandBlue/20 border border-transparent",
    secondary:
      "bg-surface text-white hover:bg-card border border-borderDark hover:border-brandBlue/40",
    outline:
      "bg-transparent text-white border border-borderDark hover:bg-surface hover:border-textMuted",
    ghost:
      "bg-transparent text-textMuted hover:text-white hover:bg-surface/50",
    danger:
      "bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20 hover:text-red-300",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};