const footerLinks = [
  ["HOME", "#home"],
  ["ABOUT", "#about"],
  ["EVENTS", "#events"],
  ["CREW", "#crew"],
  ["REGISTER", "#register"],
  ["CONTACT", "#contact"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-grid-bg" aria-hidden="true" />
      <div className="footer-smoke" aria-hidden="true" />
      <div className="footer-dust" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} style={{ left: `${index * 10 + 3}%`, animationDelay: `${index * 0.7}s` }} />
        ))}
      </div>

      <div className="footer-inner">
        <div className="footer-brand reveal-on-scroll">
          <h2>EXCLADE <em>2K26</em></h2>
          <p>KSR COLLEGE OF ENGINEERING</p>
          <p>DEPARTMENT OF CSE (IoT)</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </nav>

        <div className="footer-ending reveal-on-scroll">
          <div className="footer-status">
            <span>OPERATION STATUS</span>
            <b>COMPLETE</b>
          </div>
          <p className="footer-sign">UNTIL THE NEXT OPERATION.</p>
        </div>
      </div>

      <div className="footer-baseline">
        <span>EXCLADE 2K26</span>
        <span>THE OPERATION ENDS. THE EXPERIENCE DOESN'T.</span>
        <span>PHASE 05 · PRODUCTION READY</span>
      </div>
    </footer>
  );
}
