import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  // Keep this hook-heavy landing page in the route module. In preview builds,
  // the generated `?tsr-split=component` module can load through a separate
  // optimized React graph and leave React's hook dispatcher unset.
  codeSplitGroupings: [],
  head: () => ({
    meta: [
      { title: "EXCLADE 2K26 | KSR College of Engineering" },
      { name: "description", content: "EXCLADE 2K26 — enter the lab. Technical operations of the Department of CSE (IoT), KSR College of Engineering." },
      { property: "og:title", content: "EXCLADE 2K26 | Enter The Lab" },
      { property: "og:description", content: "Technical operations, classified case files and the EXCLADE 2K26 laboratory experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
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
