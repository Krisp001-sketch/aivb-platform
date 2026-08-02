"use client";

import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Metrics } from "../components/landing/Metrics";
import { Features } from "../components/landing/Features";
import { Workflow } from "../components/landing/Workflow";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-blue-600 selection:text-white">
      <Navbar />
      <Hero />
      <Metrics />
      <Features />
      <Workflow />
      <Footer />
    </main>
  );
}