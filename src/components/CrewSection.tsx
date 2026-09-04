import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { PersonnelCard } from "@/components/PersonnelCard";
import { PersonnelModal } from "@/components/PersonnelModal";
import {
  allPersonnel,
  associationCoordinators,
  chaosAssignments,
  committeeCoordinators,
  matchesQuery,
  nonTechnicalCoordinators,
  officeBearers,
  overallCoordinators,
  supportAssignments,
  technicalAssignments,
  technicalCoordinators,
  type CrewGroup,
  type Person,
} from "@/data/crew";

const filters = ["ALL", "ASSOCIATION", "OFFICE BEARERS", "TECHNICAL", "NON-TECHNICAL", "COMMITTEES"] as const;
type Filter = (typeof filters)[number];

function inFilter(person: Person, filter: Filter): boolean {
  if (filter === "ALL") return true;
  if (filter === "TECHNICAL") return person.group === "TECHNICAL" || (person.group === "OVERALL" && person.assignment === "TECHNICAL OPERATIONS");
  if (filter === "NON-TECHNICAL") return person.group === "NON-TECHNICAL" || (person.group === "OVERALL" && person.assignment === "NON-TECHNICAL OPERATIONS");
  return person.group === (filter as CrewGroup);
}

export function CrewSection() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [open, setOpen] = useState<Person | null>(null);

  const visible = useMemo(
    () => allPersonnel.filter((p) => inFilter(p, filter) && matchesQuery(p, query)),
    [filter, query],
  );
  const visibleIds = useMemo(() => new Set(visible.map((p) => p.id)), [visible]);
  const show = (person: Person) => visibleIds.has(person.id);
  const anyIn = (people: Person[]) => people.some(show);

  const stats = [
    ["ASSOCIATION", associationCoordinators.length],
    ["OFFICE BEARERS", officeBearers.length],
    ["TECHNICAL OPERATIONS", technicalAssignments.length],
    ["NON-TECHNICAL OPERATIONS", chaosAssignments.length],
    ["SUPPORT COMMITTEES", supportAssignments.length],
  ] as const;

  const renderGrid = (people: Person[], variant: "default" | "strong" | "compact" = "default") => (
    <div className={`personnel-grid personnel-grid-${variant}`}>
      {people.filter(show).map((person, index) => (
        <PersonnelCard key={person.id} person={person} index={index} variant={variant} onOpen={setOpen} />
      ))}
    </div>
  );

  const renderOperationBlocks = (assignments: string[], people: Person[], tone: "tech" | "chaos") =>
    assignments
      .map((assignment) => ({ assignment, crew: people.filter((p) => p.assignment === assignment && show(p)) }))
      .filter((block) => block.crew.length > 0)
      .map((block, index) => (
        <article
          className={`operation-coordinator operation-coordinator-${tone} reveal-on-scroll`}
          key={block.assignment}
          style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
        >
          <p className="operation-coordinator-label">{tone === "tech" ? "TECHNICAL OPERATION" : "CHAOS OPERATION"}</p>
          <h4>{block.assignment}</h4>
          <span className="operation-link" aria-hidden="true">│<br />▼</span>
          <p className="operation-coordinator-by">COORDINATED BY</p>
          <ul className="operation-crew-list">
            {block.crew.map((person) => (
              <li key={person.id}>
                <button type="button" onClick={() => setOpen(person)}>
                  <strong>{person.name}</strong>
                  <span>{person.dept}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      ));

  return (
    <section id="crew" className="crew-section" aria-labelledby="crew-title">
      <div className="crew-grid-bg" aria-hidden="true" />
      <div className="crew-smoke" aria-hidden="true" />

      <div className="crew-inner">
        <div className="crew-status reveal-on-scroll">
          <p className="eyebrow">OPERATION STATUS</p>
          <div className="crew-status-rows">
            <div><span>TECHNICAL</span><b>COMPLETE</b></div>
            <div><span>NON-TECHNICAL</span><b>COMPLETE</b></div>
            <div><span>NEXT FILE</span><b className="crew-status-next">THE CREW</b></div>
          </div>
        </div>

        <div className="crew-intro reveal-on-scroll">
          <p className="crew-db-tag"><Users aria-hidden="true" size={14} /> PERSONNEL DATABASE</p>
          <h2 id="crew-title">THE CREW</h2>
          <p className="crew-subtitle">THE PEOPLE BEHIND THE OPERATION</p>
          <p className="crew-note">EXCLADE 2K26 — ORGANIZING TEAM</p>
          <p className="crew-tagline">EVERY OPERATION NEEDS A CREW.</p>
        </div>

        <div className="crew-controls reveal-on-scroll">
          <div className="crew-search">
            <Search aria-hidden="true" size={15} />
            <label className="sr-only" htmlFor="crew-search-input">Search personnel</label>
            <input
              id="crew-search-input"
              type="search"
              value={query}
              placeholder="SEARCH PERSONNEL..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="crew-filters" role="group" aria-label="Filter personnel by division">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={`crew-filter${filter === item ? " crew-filter-active" : ""}`}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="crew-results" aria-live="polite">
          {visible.length} {visible.length === 1 ? "RECORD" : "RECORDS"} MATCHED
        </p>

        {visible.length === 0 && (
          <p className="crew-empty">NO MATCHING PERSONNEL IN THE EXCLADE DATABASE.</p>
        )}

        {anyIn(associationCoordinators) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 01</p><h3 className="crew-block-title">ASSOCIATION COORDINATORS</h3></div>
              <span className="file-count">{associationCoordinators.filter(show).length} FILES</span>
            </div>
            {renderGrid(associationCoordinators)}
          </div>
        )}

        {anyIn(officeBearers) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 02</p><h3 className="crew-block-title">OFFICE BEARERS</h3></div>
              <span className="file-count">{officeBearers.filter(show).length} FILES</span>
            </div>
            {renderGrid(officeBearers, "compact")}
          </div>
        )}

        {anyIn(overallCoordinators) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 03</p><h3 className="crew-block-title">OVERALL COORDINATORS</h3></div>
              <span className="file-count">CLEARANCE HIGH</span>
            </div>
            {renderGrid(overallCoordinators, "strong")}
          </div>
        )}

        {anyIn(technicalCoordinators) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 04</p><h3 className="crew-block-title">TECHNICAL CREW</h3></div>
              <span className="file-count">EVENT COORDINATORS</span>
            </div>
            <div className="operation-coordinator-grid">
              {renderOperationBlocks(technicalAssignments, technicalCoordinators, "tech")}
            </div>
          </div>
        )}

        {anyIn(nonTechnicalCoordinators) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 05</p><h3 className="crew-block-title">CHAOS CREW</h3></div>
              <span className="file-count">CHAOS COORDINATORS</span>
            </div>
            <div className="operation-coordinator-grid">
              {renderOperationBlocks(chaosAssignments, nonTechnicalCoordinators, "chaos")}
            </div>
          </div>
        )}

        {anyIn(committeeCoordinators) && (
          <div className="crew-block">
            <div className="lab-heading reveal-on-scroll">
              <div><p className="eyebrow">DIVISION 06</p><h3 className="crew-block-title">SUPPORT OPERATIONS</h3></div>
              <span className="file-count">{supportAssignments.length} DEPARTMENTS</span>
            </div>
            <div className="support-grid">
              {supportAssignments
                .map((assignment) => ({ assignment, crew: committeeCoordinators.filter((p) => p.assignment === assignment && show(p)) }))
                .filter((block) => block.crew.length > 0)
                .map((block, index) => (
                  <article className="support-card reveal-on-scroll" key={block.assignment} style={{ animationDelay: `${index * 60}ms` }}>
                    <p className="support-card-label">DEPARTMENT {String(index + 1).padStart(2, "0")}</p>
                    <h4>{block.assignment}</h4>
                    <ul>
                      {block.crew.map((person) => (
                        <li key={person.id}>
                          <button type="button" onClick={() => setOpen(person)}>
                            <strong>{person.name}</strong>
                            <span>{person.dept}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
            </div>
          </div>
        )}

        <div className="crew-stats reveal-on-scroll">
          <div className="crew-stats-head">
            <p className="eyebrow">EXCLADE DATABASE</p>
            <h3>EXCLADE PERSONNEL</h3>
          </div>
          <div className="crew-stats-grid">
            {stats.map(([label, value]) => (
              <div className="crew-stat" key={label}>
                <span>{label}</span>
                <strong>{String(value).padStart(2, "0")}</strong>
              </div>
            ))}
          </div>
          <p className="crew-stats-note">COUNTS DERIVED FROM THE OFFICIAL EXCLADE COORDINATOR RECORD.</p>
        </div>

        <div className="crew-handoff reveal-on-scroll">
          <div className="crew-handoff-rows">
            <div><span>PERSONNEL DATABASE</span><b>SECURED</b></div>
            <div><span>ALL OPERATIONS</span><b>READY</b></div>
            <div><span>NEXT STEP</span><b className="crew-status-next">REGISTRATION</b></div>
          </div>
          <h3>YOUR OPERATION STARTS HERE.</h3>
          <p>CHOOSE YOUR CHALLENGE. JOIN EXCLADE 2K26.</p>
          <div className="hero-actions">
            <a className="primary-cta" href="#register">REGISTER NOW <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>

      {open && <PersonnelModal person={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
