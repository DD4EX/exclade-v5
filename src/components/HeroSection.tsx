import { ArrowDown, ArrowRight } from "lucide-react";

type HeroSectionProps = { onEnterLab?: () => void };

export function HeroSection({ onEnterLab }: HeroSectionProps) {
  return (

    <section id="home" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-haze" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-meta reveal reveal-delay-one">
          <span>CSE · IoT DEPT.</span>
          <span className="meta-status"><i aria-hidden="true" /> PHASE 01</span>
        </div>

        <div className="institution-line reveal reveal-delay-two">
          <span aria-hidden="true" />
          <p>KSR COLLEGE OF ENGINEERING</p>
        </div>

        <div className="hero-title-wrap reveal reveal-delay-three">
          <h1 id="hero-title" className="hero-title">
            <span>EXCLADE</span>
            <span>2K26</span>
          </h1>
          <span className="title-sweep" aria-hidden="true" />
        </div>

        <p className="hero-copy reveal reveal-delay-four">
          A premium engineering symposium — where desert dust meets the laboratory, and ideas are classified for release.
        </p>

        <div className="hero-actions reveal reveal-delay-five">
          <button
            type="button"
            className="primary-cta"
            onClick={() => (onEnterLab ? onEnterLab() : document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" }))}
          >
            ENTER THE LAB
            <ArrowRight aria-hidden="true" size={18} />
          </button>
          <a className="secondary-cta" href="#about">EXPLORE EXCLADE</a>
        </div>
      </div>

      <div className="hero-footer reveal reveal-delay-five">
        <span>TECHNOLOGY · INNOVATION · EXPERIENCE</span>
        <a href="#lab" className="scroll-cue">
          <span>SCROLL TO ENTER</span>
          <ArrowDown aria-hidden="true" size={14} />
        </a>
      </div>
    </section>
  );
}