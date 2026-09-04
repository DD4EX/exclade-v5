import { ArrowDown } from "lucide-react";

export function LabIntro() {
  return (
    <section id="lab" className="lab-intro" aria-labelledby="lab-intro-title">
      <div className="lab-intro-glow" aria-hidden="true" />
      <div className="lab-intro-grid" aria-hidden="true" />
      <div className="lab-intro-inner reveal-on-scroll">
        <p className="lab-intro-badge">ACCESS GRANTED</p>
        <h2 id="lab-intro-title">THE EXCLADE LAB</h2>
        <p className="lab-intro-sub">WHERE TECHNOLOGY MEETS THE UNEXPECTED</p>
        <a className="scroll-cue" href="#about">
          <span>PROCEED TO BRIEFING</span>
          <ArrowDown aria-hidden="true" size={14} />
        </a>
      </div>
    </section>
  );
}
