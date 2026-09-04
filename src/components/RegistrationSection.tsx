import { useMemo, useState } from "react";
import { CheckCircle2, Lock, Terminal } from "lucide-react";
import { technicalEvents } from "@/data/technicalEvents";
import { nonTechnicalEvents } from "@/data/nonTechnicalEvents";

type Fields = {
  fullName: string;
  college: string;
  department: string;
  year: string;
  email: string;
  phone: string;
};

const emptyFields: Fields = { fullName: "", college: "", department: "", year: "", email: "", phone: "" };

const labels: Record<keyof Fields, string> = {
  fullName: "FULL NAME",
  college: "COLLEGE / INSTITUTION",
  department: "DEPARTMENT",
  year: "YEAR",
  email: "EMAIL",
  phone: "PHONE NUMBER",
};

const years = ["I", "II", "III", "IV"];

export function RegistrationSection() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "events", string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const techNames = useMemo(() => technicalEvents.map((e) => e.name), []);
  const chaosNames = useMemo(() => nonTechnicalEvents.map((e) => e.name), []);

  const setField = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleEvent = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    setErrors((prev) => ({ ...prev, events: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields | "events", string>> = {};
    (Object.keys(labels) as (keyof Fields)[]).forEach((key) => {
      if (!fields[key].trim()) next[key] = "FIELD REQUIRED";
    });
    if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) {
      next.email = "ENTER A VALID EMAIL";
    }
    if (fields.phone.trim() && !/^[+]?[\d][\d\s-]{7,14}$/.test(fields.phone.trim())) {
      next.phone = "ENTER A VALID PHONE NUMBER";
    }
    if (selected.length === 0) next.events = "SELECT AT LEAST ONE OPERATION";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const reset = () => {
    setFields(emptyFields);
    setSelected([]);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section id="register" className="register-section" aria-labelledby="register-title">
      <div className="register-grid-bg" aria-hidden="true" />
      <div className="register-inner">
        <div className="lab-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">REGISTRATION</p>
            <h2 id="register-title">REGISTRATION TERMINAL</h2>
            <p className="register-subtitle">ENTER YOUR DETAILS TO JOIN THE OPERATION</p>
          </div>
          <span className="file-count"><Lock aria-hidden="true" size={12} /> EXCLADE 2K26 // SECURE ACCESS</span>
        </div>

        <div className="terminal-shell reveal-on-scroll">
          <div className="terminal-bar">
            <span><Terminal aria-hidden="true" size={13} /> REGISTRATION TERMINAL</span>
            <span>{submitted ? "SESSION COMPLETE" : "AWAITING INPUT"}</span>
          </div>

          {submitted ? (
            <div className="register-success" role="status" aria-live="polite">
              <span className="register-success-mark" aria-hidden="true"><CheckCircle2 size={30} strokeWidth={1.4} /></span>
              <p className="register-success-kicker">REGISTRATION COMPLETE</p>
              <h3>ACCESS GRANTED</h3>
              <p className="register-success-welcome">WELCOME TO<br /><b>EXCLADE 2K26</b></p>
              <p className="register-success-line">YOUR OPERATION IS CONFIRMED.</p>
              <dl className="file-facts">
                <div><dt>PARTICIPANT</dt><dd>{fields.fullName}</dd></div>
                <div><dt>OPERATIONS SELECTED</dt><dd>{selected.join(" · ")}</dd></div>
              </dl>
              <p className="register-demo-note">
                DEMO SUBMISSION — this form is not yet connected to a registration system, so nothing has been stored
                or sent. Official registration will be confirmed by the coordinators.
              </p>
              <button type="button" className="secondary-cta" onClick={reset}>[ NEW ENTRY ]</button>
            </div>
          ) : (
            <form className="register-form" onSubmit={onSubmit} noValidate>
              <fieldset className="register-fieldset">
                <legend>PARTICIPANT DETAILS</legend>
                <div className="register-fields">
                  {(Object.keys(labels) as (keyof Fields)[]).map((key) => (
                    <div className={`register-field${errors[key] ? " register-field-error" : ""}${fields[key].trim() && !errors[key] ? " register-field-ok" : ""}`} key={key}>
                      <label htmlFor={`reg-${key}`}>{labels[key]}</label>
                      {key === "year" ? (
                        <select
                          id="reg-year"
                          value={fields.year}
                          onChange={(e) => setField("year", e.target.value)}
                          aria-invalid={Boolean(errors.year)}
                          aria-describedby={errors.year ? "err-year" : undefined}
                        >
                          <option value="">SELECT YEAR</option>
                          {years.map((y) => <option key={y} value={y}>{y} YEAR</option>)}
                        </select>
                      ) : (
                        <input
                          id={`reg-${key}`}
                          type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                          value={fields[key]}
                          onChange={(e) => setField(key, e.target.value)}
                          aria-invalid={Boolean(errors[key])}
                          aria-describedby={errors[key] ? `err-${key}` : undefined}
                          autoComplete={key === "fullName" ? "name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"}
                        />
                      )}
                      {errors[key] && <span className="register-error" id={`err-${key}`}>{errors[key]}</span>}
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="register-fieldset">
                <legend>SELECT YOUR OPERATION</legend>
                <p className="register-hint">Select one or more operations.</p>

                <p className="register-group-label">TECHNICAL</p>
                <div className="event-selector">
                  {techNames.map((name) => (
                    <label className={`event-option${selected.includes(name) ? " event-option-active" : ""}`} key={name}>
                      <input type="checkbox" checked={selected.includes(name)} onChange={() => toggleEvent(name)} />
                      <span className="event-option-box" aria-hidden="true" />
                      <span className="event-option-name">{name}</span>
                    </label>
                  ))}
                </div>

                <p className="register-group-label register-group-label-chaos">NON-TECHNICAL</p>
                <div className="event-selector">
                  {chaosNames.map((name) => (
                    <label className={`event-option event-option-chaos${selected.includes(name) ? " event-option-active" : ""}`} key={name}>
                      <input type="checkbox" checked={selected.includes(name)} onChange={() => toggleEvent(name)} />
                      <span className="event-option-box" aria-hidden="true" />
                      <span className="event-option-name">{name}</span>
                    </label>
                  ))}
                </div>

                {errors.events && <span className="register-error" role="alert">{errors.events}</span>}
              </fieldset>

              <div className="register-submit-row">
                <p className="register-demo-note">
                  This terminal is a demo entry form — details are not stored or sent anywhere yet.
                </p>
                <button type="submit" className="primary-cta">REGISTER NOW <span aria-hidden="true">→</span></button>
              </div>
            </form>
          )}
        </div>
      </div>

      <a className="sticky-register-cta" href="#register">REGISTER NOW</a>
    </section>
  );
}
