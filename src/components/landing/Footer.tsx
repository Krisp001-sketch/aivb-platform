"use client";

import Link from "next/link";
import { Video, Code2 } from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaXTwitter
} from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="border-t border-borderDark bg-background pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brandBlue to-brandPurple flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span>AIVB Technologies</span>
          </div>
          <p className="text-xs text-textMuted max-w-sm">
            Professional Windows desktop application for automated AI video generation and batch rendering.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="font-semibold text-white uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-textMuted">
            <li><Link href="#features" className="hover:text-white">Features</Link></li>
            <li><Link href="#workflow" className="hover:text-white">Workflow</Link></li>
            <li><Link href="/downloads" className="hover:text-white">Windows Download</Link></li>
            <li><Link href="/portal" className="hover:text-white">Customer Portal</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="font-semibold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-textMuted">
            <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
            <li><Link href="/docs" className="hover:text-white">API Reference</Link></li>
            <li><Link href="/docs" className="hover:text-white">Release Notes</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="font-semibold text-white uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-textMuted">
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-white">EULA License</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-borderDark flex flex-col md:flex-row items-center justify-between text-xs text-textMuted gap-4">
        <div>© 2026 AIVB Technologies. All rights reserved.</div>
        <div className="flex gap-4">
           <Code2 className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
           <FaGithub className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
           <FaXTwitter className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
           <FaDiscord className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
           <FaLinkedin className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
};