"use client";

import Competiotions from "@/components/Competiotions";
import HeroBackground from "@/components/hero-bg";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import React from "react";

export default function Home() {
  return (
    <main>
      <HeroBackground />
      <HeroSection />
      <ProjectsSection />
      <Competiotions />
    </main>
  );
}
