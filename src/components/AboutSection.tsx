import { Atom, CircuitBoard, FlaskConical } from "lucide-react";
import synthesisImage from "@/assets/exclade-synthesis.jpg";

export function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-inner">
        <div className="about-visual reveal-on-scroll">
          <p className="eyebrow">FILE 00 — ORIGIN</p>
          <h2 id="about-title" className="about-mark">
            <span>EXCLADE</span>
            <span>2K26</span>
          </h2>
          <div className="about-image">
            <img src={synthesisImage} alt="Amber-lit laboratory glassware in a dark chamber" width={1024} height={640} loading="lazy" />
            <div className="image-wash" aria-hidden="true" />
            <span className="about-nodes" aria-hidden="true" />
          </div>
          <div className="about-icons" aria-hidden="true">
            <FlaskConical size={18} strokeWidth={1.5} />
            <CircuitBoard size={18} strokeWidth={1.5} />
            <Atom size={18} strokeWidth={1.5} />
          </div>
        </div>

        <div className="about-copy reveal-on-scroll">
          <p className="eyebrow">ABOUT EXCLADE 2K26</p>
          <h3>CHEMISTRY + CODE + IoT + ENGINEERING</h3>
          <p>
            EXCLADE — 2026 is the symposium of the Department of CSE (IoT) at KSR College of
            Engineering. Inside the lab, technical and non-technical operations are prepared as
            classified files and released one at a time.
          </p>
          <dl className="about-facts">
            <div>
              <dt>INSTITUTION</dt>
              <dd>KSR College of Engineering</dd>
            </div>
            <div>
              <dt>DEPARTMENT</dt>
              <dd>CSE (IoT)</dd>
            </div>
            <div>
              <dt>SYMPOSIUM</dt>
              <dd>EXCLADE — 2026</dd>
            </div>
            <div>
              <dt>DATE</dt>
              <dd className="pending">AWAITING OFFICIAL DETAILS</dd>
            </div>
            <div>
              <dt>VENUE</dt>
              <dd className="pending">AWAITING OFFICIAL DETAILS</dd>
            </div>
            <div>
              <dt>REGISTRATION</dt>
              <dd className="pending">AWAITING OFFICIAL DETAILS</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
