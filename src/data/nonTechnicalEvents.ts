import {
  CircleDot,
  CircleHelp,
  FlaskConical,
  Gamepad2,
  Network,
  RotateCw,
  type LucideIcon,
} from "lucide-react";

export type NonTechnicalEvent = {
  id: string;
  name: string;
  category: "NON-TECHNICAL";
  status: "READY";
  details: "DETAILS — COMING SOON";
  icon: LucideIcon;
};

export const nonTechnicalEvents: NonTechnicalEvent[] = [
  { id: "01", name: "E-SPORT (FREE FIRE)", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: Gamepad2 },
  { id: "02", name: "JUICE MATCHING CHALLENGE", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: FlaskConical },
  { id: "03", name: "WRONG ANSWERS ONLY", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: CircleHelp },
  { id: "04", name: "Cup Chaos", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: CircleDot },
  { id: "05", name: "Pass it, Twist it", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: Network },
  { id: "06", name: "Balloon Cup Rush", category: "NON-TECHNICAL", status: "READY", details: "DETAILS — COMING SOON", icon: RotateCw },
];