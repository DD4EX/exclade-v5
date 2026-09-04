import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TechnicalEvent } from "@/data/technicalEvents";
import type { NonTechnicalEvent } from "@/data/nonTechnicalEvents";

type Props = { event: TechnicalEvent | NonTechnicalEvent; onClose: () => void };

export function EventFileModal({ event, onClose }: Props) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [stage, setStage] = useState<"accessing" | "granted">(reduced ? "granted" : "accessing");
  const closeRef = useRef<HTMLButtonElement>(null);
  const Icon = event.icon;
  const isOperation = "status" in event;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (stage === "granted") return;
    const t = window.setTimeout(() => setStage("granted"), 750);
    return () => window.clearTimeout(t);
  }, [stage]);

  return (
    <div className="file-overlay" onClick={onClose}>
      <div
        className="file-modal"
        role="dialog"
        aria-modal="true"
         aria-label={`${isOperation ? "Operation" : "Case"} ${event.id} — ${event.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="file-scan" aria-hidden="true" />
        <div className="file-topline">
           <span className="file-case">{isOperation ? "OPERATION" : "CASE"} {event.id}</span>
           <span className="file-code">{"code" in event ? event.code : "CHAOS-ZONE"}</span>
          <button ref={closeRef} type="button" className="file-x" onClick={onClose} aria-label="Close file">
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        {stage === "accessing" ? (
           <p className="file-accessing" aria-live="polite">ACCESSING {isOperation ? "OPERATION" : "FILE"}…</p>
        ) : (
          <div className="file-body">
            <p className="file-granted">ACCESS GRANTED</p>
            <div className="file-title">
              <span className="file-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.5} /></span>
              <h3>{event.name}</h3>
            </div>
            <dl className="file-facts">
              <div>
                <dt>CLASSIFICATION</dt>
                <dd>{event.category}</dd>
              </div>
               <div>
                <dt>EVENT DETAILS</dt>
                <dd className="pending">{event.details}</dd>
              </div>
            </dl>
             <p className="file-note">{isOperation ? "OFFICIAL BRIEFING PENDING. ACCEPTANCE DOES NOT REGISTER YOU." : "EVENT DETAILS — COMING SOON. OFFICIAL BRIEFING PENDING."}</p>
            <button type="button" className="secondary-cta file-close" onClick={onClose}>
               [ CLOSE {isOperation ? "OPERATION" : "FILE"} ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
