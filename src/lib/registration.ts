export type RegistrationPayload = {
  fullName: string;
  college: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  events: string[];
};

export type RegistrationResult = { ok: boolean; message: string };

/**
 * Single submission entry point for the registration terminal.
 * No backend is connected yet — nothing is stored or transmitted.
 * Replace the body with a real API/server-function call when the
 * registration backend is available; the call signature stays the same.
 */
export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResult> {
  if (import.meta.env.DEV) {
    console.info("[EXCLADE] registration demo submission", payload.events.length, "operation(s)");
  }
  return { ok: true, message: "REGISTRATION SYSTEM READY FOR INTEGRATION" };
}
