import { Cpu, FileText, Network, TerminalSquare, Wrench, type LucideIcon } from "lucide-react";

export type TechnicalEvent = {
  id: string;
  name: string;
  category: "TECHNICAL";
  details: string;
  icon: LucideIcon;
  code: string;
};

export const technicalEvents: TechnicalEvent[] = [
  { id: "01", name: "PAPER PRESENTATION", category: "TECHNICAL", details: "Coming Soon", icon: FileText, code: "PPR-01" },
  { id: "02", name: "WORKSHOP", category: "TECHNICAL", details: "Coming Soon", icon: Wrench, code: "WSP-02" },
  { id: "03", name: "IoT SIMULATOR", category: "TECHNICAL", details: "Coming Soon", icon: Cpu, code: "IOT-03" },
  { id: "04", name: "LINK LOGIC", category: "TECHNICAL", details: "Coming Soon", icon: Network, code: "LNK-04" },
  { id: "05", name: "REVERSE CODING", category: "TECHNICAL", details: "Coming Soon", icon: TerminalSquare, code: "RVC-05" },
];
