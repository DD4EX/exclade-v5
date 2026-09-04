import { initialsOf, type Person } from "@/data/crew";

type Props = {
  person: Person;
  index: number;
  variant?: "default" | "strong" | "compact";
  onOpen: (person: Person) => void;
};

export function PersonnelCard({ person, index, variant = "default", onOpen }: Props) {
  return (
    <button
      type="button"
      className={`personnel-card personnel-card-${variant} reveal-on-scroll`}
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
      onClick={() => onOpen(person)}
      aria-label={`Open personnel file for ${person.name}`}
    >
      <span className="personnel-scan" aria-hidden="true" />
      <span className="personnel-topline">
        <span>PERSONNEL FILE {person.id}</span>
        <span>{person.group}</span>
      </span>

      <span className="personnel-identity">
        <span className="personnel-avatar" aria-hidden="true">
          {initialsOf(person.name)}
        </span>
        <span className="personnel-name-block">
          <strong className="personnel-name">{person.name}</strong>
          {person.dept && <span className="personnel-dept">{person.dept}</span>}
        </span>
      </span>

      {(person.role || person.assignment) && (
        <span className="personnel-role">
          {person.role ?? person.assignment}
          {person.role && person.assignment && <em>{person.assignment}</em>}
        </span>
      )}

      <span className="personnel-foot">
        <span className="personnel-status"><i aria-hidden="true" /> AUTHORIZED</span>
        {person.note ? <span className="personnel-tag">{person.note}</span> : <span className="personnel-tag">OPEN FILE →</span>}
      </span>
    </button>
  );
}
