import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  ["HOME", "#home"],
  ["ABOUT", "#about"],
  ["EVENTS", "#events"],
  ["CREW", "#crew"],
  ["REGISTER", "#register"],
  ["CONTACT", "#contact"],
] as const;

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="nav-shell">
        <a className="brand-lockup" href="#home" aria-label="EXCLADE 2K26 home">
          <span className="brand-symbol">E</span>
          <span className="brand-name">EXCLADE <b>2K26</b></span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a className={label === "REGISTER" ? "nav-link nav-link-cta" : "nav-link"} href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => (
            <a className="mobile-nav-link" href={href} key={label} onClick={() => setIsOpen(false)}>
              <span>{label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}