import { useCallback, useEffect, useState } from "react";
import { AboutSection } from "@/components/AboutSection";
import { ChaosZone } from "@/components/ChaosZone";
import { CinematicLoader } from "@/components/CinematicLoader";
import { HeroSection } from "@/components/HeroSection";
import { LabDashboard } from "@/components/LabDashboard";
import { LabEntryTransition } from "@/components/LabEntryTransition";
import { LabIntro } from "@/components/LabIntro";
import { LabPreview } from "@/components/LabPreview";
import { NextPhases } from "@/components/NextPhases";
import { ParticleField } from "@/components/ParticleField";
import { SiteNav } from "@/components/SiteNav";
import { TechnicalOperations } from "@/components/TechnicalOperations";

export function ExcladePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(false), 3800);
    return () => window.clearTimeout(timer);
  }, []);

  const finishGate = useCallback(() => {
    setShowGate(false);
    document.getElementById("lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="exclade-app">
      {showLoader && <CinematicLoader onSkip={() => setShowLoader(false)} />}
      {showGate && <LabEntryTransition onDone={finishGate} />}
      <ParticleField />
      <SiteNav />
      <main>
        <HeroSection onEnterLab={() => setShowGate(true)} />
        <LabIntro />
        <AboutSection />
        <LabDashboard />
        <TechnicalOperations />
        <ChaosZone />
        <LabPreview />
        <NextPhases />
      </main>
      <footer id="contact" className="site-footer">
        <span>EXCLADE 2K26</span>
        <span>KSR COLLEGE OF ENGINEERING · CSE (IoT)</span>
        <span>PHASE 03 · CHAOS ZONE ONLINE</span>
      </footer>
    </div>
  );
}