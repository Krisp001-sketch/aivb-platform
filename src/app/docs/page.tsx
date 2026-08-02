"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import {
  Key,
  Terminal,
  ShieldCheck,
  Cpu,
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  Lock,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const navItems = [
  { group: "Getting Started", items: [
      { id: "installation", label: "Installation (Windows)" },
      { id: "activation", label: "Hardware Activation" },
      { id: "grace-period", label: "Offline Grace Period" },
    ]
  },
  { group: "Architecture", items: [
      { id: "hwid-fingerprint", label: "HWID Generation" },
      { id: "cryptography", label: "RSA Signed Tokens" },
    ]
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("installation");

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ScrollSpy / IntersectionObserver to highlight active button automatically
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionIds = ["installation", "activation", "grace-period", "hwid-fingerprint", "cryptography"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white px-6 py-12 scroll-smooth">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
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
              Documentation & User Guide
            </h1>
            <p className="text-textMuted text-sm">
              Complete setup instructions, activation protocols, and system architecture for AI Asset Video Builder.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Docs Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 text-xs sticky top-24 self-start"
          >
            {navItems.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                <h4 className="font-semibold text-textMuted uppercase tracking-wider px-2 mb-2">
                  {group.group}
                </h4>
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                        isActive
                          ? "bg-surface text-white border border-borderDark hover:border-brandBlue/50"
                          : "text-textMuted hover:text-white hover:bg-surface/50"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            ))}
          </motion.div>

          {/* Docs Main Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-3 space-y-10 text-sm"
          >
            {/* 1. Installation Section */}
            <motion.section variants={sectionVariants} id="installation" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brandBlue" /> Windows Installation
              </h2>
              <p className="text-textMuted leading-relaxed text-xs md:text-sm">
                AI Asset Video Builder runs natively on 64-bit Windows 10 and Windows 11. Download the standalone installer (`.exe`), execute as administrator if prompted, and complete the setup wizard.
              </p>
              <Card className="bg-surface/50 space-y-2 border-borderDark hover:border-brandBlue/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono text-brandBlue">
                  <Terminal className="w-4 h-4" /> Silent / Unattended Installation
                </div>
                <div className="bg-background p-3 rounded border border-borderDark font-mono text-xs text-gray-300 overflow-x-auto">
                  AIVB_Setup_v2.4.0.exe /S /D=C:\Program Files\AIVB Studio
                </div>
              </Card>
            </motion.section>

            {/* 2. Hardware Activation Section */}
            <motion.section
              variants={sectionVariants}
              id="activation"
              className="space-y-4 pt-6 border-t border-borderDark scroll-mt-24"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Key className="w-5 h-5 text-brandBlue" /> License Key Activation
              </h2>
              <p className="text-textMuted leading-relaxed text-xs md:text-sm">
                Upon launching the software for the first time, you will be prompted to enter your license key. The client desktop application hashes local motherboard, CPU, and Windows installation identifiers to construct a hardware fingerprint (HWID) before sending it to the central server.
              </p>
              <ul className="space-y-2 text-xs text-textMuted">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                  <span><strong>Free Trial:</strong> Restricted to 1 device per hardware fingerprint for 24 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                  <span><strong>Professional License:</strong> Authorizes up to 3 active Windows devices simultaneously.</span>
                </li>
              </ul>
            </motion.section>

            {/* 3. Offline Grace Period Section */}
            <motion.section
              variants={sectionVariants}
              id="grace-period"
              className="space-y-4 pt-6 border-t border-borderDark scroll-mt-24"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brandGreen" /> Offline Grace Period
              </h2>
              <p className="text-textMuted leading-relaxed text-xs md:text-sm">
                If internet connectivity is lost or network access is restricted, the desktop application relies on a local cryptographically signed cached token. The application will operate seamlessly for up to <strong>7 consecutive days</strong> offline before requiring a server heartbeat re-validation.
              </p>
            </motion.section>

            {/* 4. HWID Generation Section */}
            <motion.section
              variants={sectionVariants}
              id="hwid-fingerprint"
              className="space-y-4 pt-6 border-t border-borderDark scroll-mt-24"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-brandBlue" /> HWID Generation
              </h2>
              <p className="text-textMuted leading-relaxed text-xs md:text-sm">
                The client desktop client extracts non-reversible, deterministic SHA-256 hashes derived from machine components:
              </p>
              <Card className="bg-surface/50 space-y-3 border-borderDark hover:border-brandBlue/30 transition-colors">
                <ul className="space-y-2 text-xs text-textMuted">
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>Motherboard UUID</span>
                    <span className="font-mono text-white text-[11px]">WMIC csproduct get UUID</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-borderDark/50 pb-2">
                    <span>CPU Processor ID</span>
                    <span className="font-mono text-white text-[11px]">WMIC cpu get ProcessorId</span>
                  </li>
                  <li className="flex items-center justify-between pb-1">
                    <span>Windows Volume Serial</span>
                    <span className="font-mono text-white text-[11px]">Get-Volume C: SerialNumber</span>
                  </li>
                </ul>
              </Card>
              <p className="text-textMuted text-xs leading-relaxed">
                This combination ensures zero personal data collection while guaranteeing strict one-device license protection.
              </p>
            </motion.section>

            {/* 5. RSA Signed Tokens Section */}
            <motion.section
              variants={sectionVariants}
              id="cryptography"
              className="space-y-4 pt-6 border-t border-borderDark scroll-mt-24"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-brandBlue" /> RSA Signed Tokens
              </h2>
              <p className="text-textMuted leading-relaxed text-xs md:text-sm">
                License validation checks return an asymmetric 2048-bit RSA cryptographically signed token containing session expiry, feature flags, and target HWID.
              </p>
              <Card className="bg-surface/50 space-y-2 border-borderDark hover:border-brandBlue/30 transition-colors">
                <div className="flex items-center justify-between text-xs text-textMuted">
                  <span className="font-mono text-brandBlue">Token Verification Workflow</span>
                  <span className="text-[10px] text-brandGreen font-semibold">Offline Capable</span>
                </div>
                <p className="text-xs text-textMuted leading-relaxed">
                  The client application embedded public key verifies the authenticity of the local authorization payload on startup, preventing tampering or unauthorized license emulation.
                </p>
              </Card>
            </motion.section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}