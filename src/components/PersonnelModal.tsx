import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { initialsOf, type Person } from "@/data/crew";

type Props = { person: Person; onClose: () => void };

export function PersonnelModal({ person, onClose }: Props) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [stage, setStage] = useState<"accessing" | "granted">(reduced ? "granted" : "accessing");
  const closeRef = useRef<HTMLButtonElement>(null);

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
    const t = window.setTimeout(() => setStage("granted"), 700);
    return () => window.clearTimeout(t);
  }, [stage]);

  return (
    <div className="file-overlay" onClick={onClose}>
      <div
        className="file-modal personnel-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Personnel file ${person.id} — ${person.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="file-scan" aria-hidden="true" />
        <div className="file-topline">
          <span className="file-case">PERSONNEL DATABASE</span>
          <span className="file-code">FILE {person.id}</span>
          <button ref={closeRef} type="button" className="file-x" onClick={onClose} aria-label="Close personnel file">
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        {stage === "accessing" ? (
          <p className="file-accessing" aria-live="polite">ACCESSING FILE…</p>
        ) : (
          <div className="file-body">
            <p className="file-granted">ACCESS GRANTED</p>
            <div className="file-title">
              <span className="file-icon personnel-avatar-lg" aria-hidden="true">{initialsOf(person.name)}</span>
              <h3>{person.name}</h3>
            </div>
            <dl className="file-facts">
              {person.role && (
                <div><dt>ROLE</dt><dd>{person.role}</dd></div>
              )}
              {person.assignment && (
                <div><dt>ASSIGNMENT</dt><dd>{person.assignment}</dd></div>
              )}
              {person.dept && (
                <div><dt>YEAR / DEPT.</dt><dd>{person.dept}</dd></div>
              )}
              <div><dt>DIVISION</dt><dd>{person.group}</dd></div>
              {person.note && <div><dt>CATEGORY</dt><dd>{person.note}</dd></div>}
              <div><dt>STATUS</dt><dd>AUTHORIZED</dd></div>
            </dl>
            <p className="file-note">EXCLADE DATABASE ENTRY. NO FURTHER DETAILS ON RECORD.</p>
            <button type="button" className="secondary-cta file-close" onClick={onClose}>[ CLOSE FILE ]</button>
          </div>
        )}
      </div>
    </div>
  );
}
