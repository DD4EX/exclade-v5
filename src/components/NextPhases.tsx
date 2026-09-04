import { ArrowUpRight, Clock3, Radio } from "lucide-react";

const phases = [
  {
    label: "PHASE 04",
    title: "THE CREW",
    detail: "Meet the people turning ideas into field-ready systems.",
    icon: Radio,
    tone: "lime",
  },
  {
    label: "PHASE 05",
    title: "THE BRIEFING",
    detail: "Final schedules, venue details and registration access will be released here.",
    icon: Clock3,
    tone: "amber",
  },
] as const;

export function NextPhases() {
  return (
    <section className="next-phases-section" aria-labelledby="next-phases-title">
      <div className="next-phases-inner">
        <div className="next-phases-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">NEXT TRANSMISSIONS</p>
            <h2 id="next-phases-title">THE NEXT PHASES</h2>
          </div>
          <span className="file-count">SIGNAL PENDING</span>
        </div>

        <div className="next-phases-grid">
          {phases.map(({ label, title, detail, icon: Icon, tone }) => (
            <article className="next-phase-card reveal-on-scroll" key={label}>
              <div className={`next-phase-icon tone-${tone}`}>
                <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
              </div>
              <p className={`eyebrow tone-${tone}`}>{label}</p>
              <h3>{title}</h3>
              <p className="next-phase-detail">{detail}</p>
              <span className="next-phase-status">
                AWAITING RELEASE <ArrowUpRight aria-hidden="true" size={14} />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}