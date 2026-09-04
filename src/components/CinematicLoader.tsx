import { ArrowRight } from "lucide-react";

type CinematicLoaderProps = {
  onSkip: () => void;
};

export function CinematicLoader({ onSkip }: CinematicLoaderProps) {
  return (
    <div className="loader-screen" role="dialog" aria-label="EXCLADE 2K26 introduction">
      <div className="loader-noise" aria-hidden="true" />
      <div className="loader-dust loader-dust-one" aria-hidden="true" />
      <div className="loader-dust loader-dust-two" aria-hidden="true" />
      <div className="loader-content">
        <div className="loader-mark">E</div>
        <p className="loader-line loader-line-one">KSR COLLEGE OF ENGINEERING</p>
        <p className="loader-line loader-line-two">DEPARTMENT OF CSE (IoT)</p>
        <div className="loader-title">
          <span>EXCLADE</span>
          <span>2K26</span>
        </div>
        <p className="loader-caption">THE SYMPOSIUM BEGINS</p>
        <button type="button" className="loader-skip" onClick={onSkip}>
          Skip intro <ArrowRight aria-hidden="true" size={14} />
        </button>
      </div>
    </div>
  );
}