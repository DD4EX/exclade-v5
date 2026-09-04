import { useEffect, useRef, useState } from "react";
import { Dice5, Radio, Zap } from "lucide-react";
import { EventFileModal } from "@/components/EventFileModal";
import { nonTechnicalEvents, type NonTechnicalEvent } from "@/data/nonTechnicalEvents";

export function ChaosZone() {
  const [openEvent, setOpenEvent] = useState<NonTechnicalEvent | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrambling, setScrambling] = useState(false);
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const scrambleTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (scrambleTimer.current) window.clearInterval(scrambleTimer.current);
  }, []);

  const selectOperation = (event: NonTechnicalEvent) => {
    setSelectedId(event.id);
    window.setTimeout(() => setOpenEvent(event), 260);
  };

  const assignRandomOperation = () => {
    if (scrambling) return;
    setScrambling(true);
    let cycles = 0;
    scrambleTimer.current = window.setInterval(() => {
      cycles += 1;
      setScrambleIndex(Math.floor(Math.random() * nonTechnicalEvents.length));
      if (cycles >= 9) {
        if (scrambleTimer.current) window.clearInterval(scrambleTimer.current);
        const chosen = nonTechnicalEvents[Math.floor(Math.random() * nonTechnicalEvents.length)];
        if (!chosen) { setScrambling(false); return; }
        setSelectedId(chosen.id);
        setScrambleIndex(nonTechnicalEvents.indexOf(chosen));
        setScrambling(false);
        window.setTimeout(() => setOpenEvent(chosen), 520);
      }
    }, 85);
  };

  return (
    <section id="non-technical" className="chaos-section" aria-labelledby="chaos-title">
      <div className="chaos-grid" aria-hidden="true" />
      <div className="chaos-smoke" aria-hidden="true" />
      <div className="chaos-inner">
        <div className="chaos-intro reveal-on-scroll">
          <div className="chaos-kicker"><Zap aria-hidden="true" size={15} /> NEXT OPERATION UNLOCKED</div>
          <p className="eyebrow">THE LAB HAS GONE OFF SCRIPT</p>
          <h2 id="chaos-title">CHAOS ZONE</h2>
          <p className="chaos-subtitle">WHERE THE RULES GET INTERESTING.</p>
          <p className="chaos-description">NON-TECHNICAL OPERATIONS <span>/</span> NO CODE. NO CIRCUITS. JUST CHAOS.</p>
        </div>

        <div className="chaos-toolbar reveal-on-scroll">
          <div className="chaos-counter">
            <span className="chaos-counter-brand">EXCLADE <b>2K26</b></span>
            <strong>06</strong>
            <span>AVAILABLE</span>
            <i><Radio aria-hidden="true" size={12} /> STATUS ACTIVE</i>
          </div>
          <div className="chaos-actions">
            <span className="chaos-filter-label">ALL OPERATIONS</span>
            <button type="button" className="random-button" onClick={assignRandomOperation} disabled={scrambling}>
              <Dice5 aria-hidden="true" size={15} /> {scrambling ? "ASSIGNING…" : "RANDOM OPERATION"}
            </button>
          </div>
        </div>

        <div className="chaos-assignment" aria-live="polite">
          {selectedId ? <><span>OPERATION SELECTED</span><strong>{scrambling ? "— —" : `OPERATION ${selectedId}`}</strong></> : <span>FEELING LUCKY? SELECT AN OPERATION</span>}
        </div>

        <div className="chaos-card-grid">
          {nonTechnicalEvents.map((event, index) => {
            const Icon = event.icon;
            const isSelected = selectedId === event.id;
            return (
              <article
                className={`chaos-card chaos-card-${index + 1} reveal-on-scroll${isSelected ? " chaos-card-selected" : ""}`}
                key={event.id}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <span className="chaos-card-scan" aria-hidden="true" />
                <span className="chaos-card-trace" aria-hidden="true" />
                <div className="chaos-card-topline">
                  <span>OPERATION {event.id}</span>
                  <span>NZ / {String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="chaos-visual" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.4} />
                  <span className="chaos-visual-mark">{index === 0 ? "◌ ◇ ◌" : index === 1 ? "△ ○ △" : index === 2 ? "? × !" : index === 3 ? "○ ○ ○" : index === 4 ? "↻ ↗ ↻" : "○ · ○"}</span>
                </div>
                <h3>{event.name}</h3>
                <div className="chaos-card-status"><span><i /> {event.status}</span><span>NON-TECHNICAL</span></div>
                <button type="button" className="chaos-accept" onClick={() => selectOperation(event)}>
                  ACCEPT CHALLENGE <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>

        <div className="chaos-footer-grid reveal-on-scroll">
          <div className="chaos-meter-panel">
            <p className="eyebrow">SYSTEM READOUT</p>
            <div className="chaos-meter-heading"><strong>CHAOS LEVEL</strong><span>80%</span></div>
            <div className="chaos-meter" aria-label="Chaos level 80 percent, decorative"><span className="chaos-meter-fill" /></div>
            <div className="chaos-meter-foot"><span>STABILITY</span><b>UNSTABLE</b></div>
          </div>
          <div className="chaos-final-copy">
            <p className="chaos-final-index">06 / 06 OPERATIONS AVAILABLE</p>
            <h3>SIX OPERATIONS.<br /><em>ZERO GUARANTEES.</em></h3>
            <p>THE LAB ISN&apos;T DONE YET.</p>
            <div className="hero-actions">
              <a className="primary-cta" href="#crew">MEET THE CREW <span aria-hidden="true">→</span></a>
              <a className="secondary-cta" href="#register">REGISTER</a>
            </div>
          </div>
        </div>
      </div>

      {scrambling && <span className="chaos-scramble-readout" aria-live="polite">OPERATION {String(scrambleIndex + 1).padStart(2, "0")} / ASSIGNING</span>}
      {openEvent && <EventFileModal event={openEvent} onClose={() => setOpenEvent(null)} />}
    </section>
  );
}