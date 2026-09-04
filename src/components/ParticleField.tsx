const particles = [
  ["particle-one", "particle-amber"],
  ["particle-two", "particle-sand"],
  ["particle-three", "particle-lime"],
  ["particle-four", "particle-sand"],
  ["particle-five", "particle-amber"],
  ["particle-six", "particle-lime"],
  ["particle-seven", "particle-sand"],
  ["particle-eight", "particle-amber"],
];

export function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map(([position, tone]) => (
        <span key={position} className={`particle ${position} ${tone}`} />
      ))}
    </div>
  );
}