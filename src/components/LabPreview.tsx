import { FlaskConical, RadioTower, Users } from "lucide-react";
import synthesisImage from "@/assets/exclade-synthesis.jpg";
import extractionImage from "@/assets/exclade-extraction.jpg";
import distillationImage from "@/assets/exclade-distillation.jpg";

const dossiers = [
  {
    id: "File 01 — Synthesis",
    angle: "α / 86°",
    title: "TECHNICAL",
    description: "Catalytic pathways for next-gen IoT sensors — from raw signal to refined output.",
    image: synthesisImage,
    icon: FlaskConical,
    tone: "amber",
  },
  {
    id: "File 02 — Extraction",
    angle: "β / 214°",
    title: "NON-TECHNICAL",
    description: "Distilling ambient data into clean, actionable intelligence under field conditions.",
    image: extractionImage,
    icon: RadioTower,
    tone: "sand",
  },
  {
    id: "File 03 — Distillation",
    angle: "γ / 302°",
    title: "THE CREW",
    description: "Refining complex systems into elegant, deployable engineering solutions.",
    image: distillationImage,
    icon: Users,
    tone: "lime",
  },
] as const;

export function LabPreview() {
  return (
    <section id="lab" className="lab-section" aria-labelledby="lab-title">
      <div className="lab-inner">
        <div className="lab-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">THE LAB</p>
            <h2 id="lab-title">THE OPERATION STARTS HERE</h2>
          </div>
          <span className="file-count">03 CLASSIFIED</span>
        </div>

        <div className="dossier-grid">
          {dossiers.map(({ id, angle, title, description, image, icon: Icon, tone }) => (
            <article className="dossier-card reveal-on-scroll" key={title}>
              <div className="dossier-topline">
                <span className={`dossier-id tone-${tone}`}>{id}</span>
                <span className="dossier-angle">{angle}</span>
              </div>
              <div className="dossier-image-wrap">
                <img src={image} alt={`${title.toLowerCase()} laboratory atmosphere`} width={1024} height={640} loading="lazy" />
                <div className="image-wash" aria-hidden="true" />
                <div className="dossier-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.5} /></div>
                <span className="classified-stamp">CLASSIFIED</span>
              </div>
              <div className="dossier-info">
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="dossier-rule" aria-hidden="true" />
                <span className="dossier-open">OPEN FILE <span aria-hidden="true">→</span></span>
              </div>
            </article>
          ))}
        </div>

        <p className="lab-footnote">MORE FILES DECLASSIFIED ON THE FULL BRIEFING.</p>
      </div>
    </section>
  );
}