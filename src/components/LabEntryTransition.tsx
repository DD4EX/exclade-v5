import { useEffect, useState } from "react";

type Props = { onDone: () => void };

export function LabEntryTransition({ onDone }: Props) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }
    const t1 = window.setTimeout(() => setGranted(true), 900);
    const t2 = window.setTimeout(onDone, 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className="lab-gate" role="status" aria-live="polite">
      <div className="lab-gate-smoke" aria-hidden="true" />
      <div className="lab-gate-beam" aria-hidden="true" />
      <div className="lab-gate-grid" aria-hidden="true" />
      <div className="lab-gate-copy">
        <p className="lab-gate-scan">{granted ? "ACCESS GRANTED" : "AUTHENTICATING SEQUENCE…"}</p>
        {granted && (
          <>
            <h2>THE EXCLADE LAB</h2>
            <p className="lab-gate-sub">WHERE TECHNOLOGY MEETS THE UNEXPECTED</p>
          </>
        )}
      </div>
      <button type="button" className="loader-skip lab-gate-skip" onClick={onDone}>
        SKIP
      </button>
    </div>
  );
}
