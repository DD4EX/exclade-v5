import { Lock, Unlock } from "lucide-react";

export function LabDashboard() {
  return (
    <section className="dashboard-section" aria-labelledby="dashboard-title">
      <div className="dashboard-inner">
        <div className="lab-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">THE LAB</p>
            <h2 id="dashboard-title">SELECT YOUR OPERATION</h2>
          </div>
          <span className="file-count">02 CATEGORIES</span>
        </div>

        <div className="dashboard-grid">
          <a className="op-card op-card-active reveal-on-scroll" href="#events">
            <span className="op-status"><Unlock aria-hidden="true" size={13} /> UNLOCKED</span>
            <h3>TECHNICAL</h3>
            <p>CLASSIFIED OPERATIONS</p>
            <span className="op-meta">05 FILES · VIEW OPERATIONS →</span>
          </a>

          <a className="op-card op-card-active reveal-on-scroll" href="#non-technical">
            <span className="op-status"><Unlock aria-hidden="true" size={13} /> UNLOCKED</span>
            <h3>NON-TECHNICAL</h3>
            <p>UNDERGROUND CHALLENGES</p>
            <span className="op-meta">06 OPERATIONS · ENTER CHAOS ZONE →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
