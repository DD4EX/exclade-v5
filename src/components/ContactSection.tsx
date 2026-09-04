import { Megaphone, Radio, ScrollText, Users } from "lucide-react";

const PENDING = "CONTACT DETAILS — COMING SOON";

const channels = [
  {
    id: "01",
    title: "GENERAL ENQUIRIES",
    line: "Questions about EXCLADE 2K26, schedules or access.",
    detail: PENDING,
    icon: Radio,
  },
  {
    id: "02",
    title: "REGISTRATION",
    line: "Reserve your place in the operation.",
    detail: "USE THE REGISTRATION TERMINAL BELOW.",
    icon: ScrollText,
    href: "#register",
    cta: "OPEN TERMINAL",
  },
  {
    id: "03",
    title: "MEDIA & PROMOTION",
    line: "Press, coverage and promotional requests.",
    detail: PENDING,
    icon: Megaphone,
  },
  {
    id: "04",
    title: "EVENT COORDINATION",
    line: "Reach the coordinators of a specific operation.",
    detail: "SEE THE PERSONNEL DATABASE.",
    icon: Users,
    href: "#crew",
    cta: "VIEW CREW",
  },
] as const;

const statuses = [
  ["SYSTEM", "ONLINE"],
  ["REGISTRATION", "AVAILABLE"],
  ["MEDIA", "ACTIVE"],
  ["EVENT SUPPORT", "AVAILABLE"],
] as const;

export function ContactSection() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-grid-bg" aria-hidden="true" />
      <div className="contact-smoke" aria-hidden="true" />

      <div className="contact-inner">
        <div className="lab-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">COMMUNICATION</p>
            <h2 id="contact-title">CONTACT THE CREW</h2>
            <p className="contact-subtitle">NEED ACCESS? CONTACT THE OPERATION.</p>
          </div>
          <span className="file-count">EXCLADE COMMUNICATION TERMINAL</span>
        </div>

        <ul className="contact-status-board reveal-on-scroll">
          {statuses.map(([label, state]) => (
            <li key={label}>
              <span>{label}</span>
              <b><i aria-hidden="true" />{state}</b>
            </li>
          ))}
        </ul>
        <p className="contact-status-note">Status indicators are decorative and do not reflect live system monitoring.</p>

        <div className="contact-grid">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <article
                className="contact-card reveal-on-scroll"
                key={channel.id}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="contact-card-scan" aria-hidden="true" />
                <p className="contact-card-topline">
                  <span>CHANNEL {channel.id}</span>
                  <span>EXCLADE 2K26</span>
                </p>
                <Icon className="contact-card-icon" aria-hidden="true" size={26} strokeWidth={1.4} />
                <h3>{channel.title}</h3>
                <p className="contact-card-line">{channel.line}</p>
                <p className={`contact-card-detail${channel.detail === PENDING ? " contact-card-pending" : ""}`}>
                  {channel.detail}
                </p>
                {"href" in channel && channel.href ? (
                  <a className="contact-card-cta" href={channel.href}>
                    {channel.cta} <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="contact-cta reveal-on-scroll">
          <p className="eyebrow">HAVE A QUESTION?</p>
          <h3>CONTACT THE CREW</h3>
          <p className="contact-cta-note">
            Official contact channels will be published here once released by the coordinators.
          </p>
          <div className="hero-actions">
            <a className="primary-cta" href="#register">REGISTER FOR EXCLADE 2K26 <span aria-hidden="true">→</span></a>
            <a className="secondary-cta" href="#crew">MEET THE CREW</a>
          </div>
        </div>
      </div>
    </section>
  );
}
