export type CrewGroup =
  | "ASSOCIATION"
  | "OFFICE BEARERS"
  | "OVERALL"
  | "TECHNICAL"
  | "NON-TECHNICAL"
  | "COMMITTEES";

export type Person = {
  id: string;
  name: string;
  group: CrewGroup;
  /** Role title where the source document provides one. */
  role?: string;
  /** Year / department string exactly as supplied. */
  dept?: string;
  /** Event or committee the person is assigned to, when applicable. */
  assignment?: string;
  /** FACULTY marker where the document states it. */
  note?: string;
};

export const associationCoordinators: Person[] = [
  { id: "A01", name: "Ms. S. Nandhini", group: "ASSOCIATION", role: "PRESIDENT", dept: "AP / IOT", note: "FACULTY" },
  { id: "A02", name: "Mr. Santhosh G", group: "ASSOCIATION", role: "SECRETARY", dept: "IV / IOT" },
  { id: "A03", name: "Ms. Vinishka", group: "ASSOCIATION", role: "TREASURER", dept: "IV / IOT" },
  { id: "A04", name: "Mr. Dhayalan B", group: "ASSOCIATION", role: "JOINT-SECRETARY", dept: "III / IOT" },
  { id: "A05", name: "Ms. Mahbuba Yasmin Laskar", group: "ASSOCIATION", role: "JOINT-TREASURER", dept: "III / IOT" },
  { id: "A06", name: "Mr. Mohamed Salih R", group: "ASSOCIATION", role: "JOINT-SECRETARY", dept: "II / IOT" },
  { id: "A07", name: "Ms. Vaishnavi C", group: "ASSOCIATION", role: "JOINT-TREASURER", dept: "II / IOT" },
];

export const officeBearers: Person[] = [
  { id: "B01", name: "Mr. Tamilarasan", group: "OFFICE BEARERS", dept: "IV / IOT" },
  { id: "B02", name: "Mr. Thamizhan", group: "OFFICE BEARERS", dept: "IV / IOT" },
  { id: "B03", name: "Ms. Leena", group: "OFFICE BEARERS", dept: "IV / IOT" },
  { id: "B04", name: "Ms. Vaishnavi", group: "OFFICE BEARERS", dept: "IV / IOT" },
  { id: "B05", name: "Mr. Tamilarasan M", group: "OFFICE BEARERS", dept: "III / IOT" },
  { id: "B06", name: "Mr. Dhayalan B", group: "OFFICE BEARERS", dept: "III / IOT" },
  { id: "B07", name: "Mr. Durai B", group: "OFFICE BEARERS", dept: "III / IOT" },
  { id: "B08", name: "Mr. Vishal P", group: "OFFICE BEARERS", dept: "III / IOT" },
  { id: "B09", name: "Ms. Amritha", group: "OFFICE BEARERS", dept: "III / IOT" },
  { id: "B10", name: "Ms. Saranya Chawla", group: "OFFICE BEARERS", dept: "III / IOT" },
];

export const overallCoordinators: Person[] = [
  { id: "O01", name: "Mr. Kaviyarasu", group: "OVERALL", role: "OVERALL COORDINATOR", assignment: "TECHNICAL OPERATIONS", dept: "III / IOT" },
  { id: "O02", name: "Ms. Kanishka", group: "OVERALL", role: "OVERALL COORDINATOR", assignment: "TECHNICAL OPERATIONS", dept: "III / IOT" },
  { id: "O03", name: "Mr. Sanjay", group: "OVERALL", role: "OVERALL COORDINATOR", assignment: "NON-TECHNICAL OPERATIONS", dept: "III / IOT" },
  { id: "O04", name: "Mr. Karthick", group: "OVERALL", role: "OVERALL COORDINATOR", assignment: "NON-TECHNICAL OPERATIONS", dept: "III / IOT" },
];

export const technicalCoordinators: Person[] = [
  { id: "T01", name: "Mr. Kameshwaran K", group: "TECHNICAL", assignment: "PAPER PRESENTATION", dept: "III / IOT" },
  { id: "T02", name: "Ms. Nithya Rubini", group: "TECHNICAL", assignment: "WORKSHOP", dept: "III / IOT" },
  { id: "T03", name: "Ms. Divya", group: "TECHNICAL", assignment: "WORKSHOP", dept: "III / IOT" },
  { id: "T04", name: "Mr. Durai", group: "TECHNICAL", assignment: "IoT SIMULATOR", dept: "III / IOT" },
  { id: "T05", name: "Mr. Lobaz Richit", group: "TECHNICAL", assignment: "LINK LOGIC", dept: "III / IOT" },
  { id: "T06", name: "Ms. Nithya Rubini", group: "TECHNICAL", assignment: "REVERSE CODING", dept: "III / IOT" },
  { id: "T07", name: "Ms. Divya", group: "TECHNICAL", assignment: "REVERSE CODING", dept: "III / IOT" },
];

export const nonTechnicalCoordinators: Person[] = [
  { id: "N01", name: "Mr. Sridhar M", group: "NON-TECHNICAL", assignment: "E-SPORT (FREE FIRE)", dept: "III / IOT" },
  { id: "N02", name: "Mr. Sanjeev S", group: "NON-TECHNICAL", assignment: "E-SPORT (FREE FIRE)", dept: "III / IOT" },
  { id: "N03", name: "Mr. Kishore P", group: "NON-TECHNICAL", assignment: "JUICE MATCHING CHALLENGE", dept: "III / IOT" },
  { id: "N04", name: "Mr. Tamilarasan", group: "NON-TECHNICAL", assignment: "JUICE MATCHING CHALLENGE", dept: "III / IOT" },
  { id: "N05", name: "Mr. Tamizhmani G", group: "NON-TECHNICAL", assignment: "WRONG ANSWERS ONLY", dept: "III / IOT" },
  { id: "N06", name: "Mr. Kaviyarasu", group: "NON-TECHNICAL", assignment: "Cup Chaos", dept: "III / IOT" },
  { id: "N07", name: "Mr. Karthick", group: "NON-TECHNICAL", assignment: "Pass it, Twist it", dept: "III / IOT" },
  { id: "N08", name: "Mr. Vishal", group: "NON-TECHNICAL", assignment: "Balloon Cup Rush", dept: "III / IOT" },
];

export const committeeCoordinators: Person[] = [
  { id: "C01", name: "Mr. Tamilarasan M", group: "COMMITTEES", assignment: "FOOD COMMITTEE", dept: "III / IOT" },
  { id: "C02", name: "Mr. Kishore P", group: "COMMITTEES", assignment: "FOOD COMMITTEE", dept: "III / IOT" },
  { id: "C03", name: "Mr. Tamizhmani G", group: "COMMITTEES", assignment: "DECORATION COMMITTEE", dept: "III / IOT" },
  { id: "C04", name: "Mr. Vishal P", group: "COMMITTEES", assignment: "CERTIFICATE COMMITTEE", dept: "III / IOT" },
  { id: "C05", name: "Mr. Priyan J", group: "COMMITTEES", assignment: "REGISTRATION COMMITTEE", dept: "III / IOT" },
  { id: "C06", name: "Mr. Elavarasan V", group: "COMMITTEES", assignment: "MEDIA & PROMOTION", dept: "III / IOT" },
];

export const allPersonnel: Person[] = [
  ...associationCoordinators,
  ...officeBearers,
  ...overallCoordinators,
  ...technicalCoordinators,
  ...nonTechnicalCoordinators,
  ...committeeCoordinators,
];

/** Technical events grouped with their coordinators, for the operation link-up view. */
export const technicalAssignments = ["PAPER PRESENTATION", "WORKSHOP", "IoT SIMULATOR", "LINK LOGIC", "REVERSE CODING"];
export const chaosAssignments = ["E-SPORT (FREE FIRE)", "JUICE MATCHING CHALLENGE", "WRONG ANSWERS ONLY", "Cup Chaos", "Pass it, Twist it", "Balloon Cup Rush"];
export const supportAssignments = ["FOOD COMMITTEE", "DECORATION COMMITTEE", "CERTIFICATE COMMITTEE", "REGISTRATION COMMITTEE", "MEDIA & PROMOTION"];

export function initialsOf(name: string): string {
  const cleaned = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").trim();
  const parts = cleaned.split(/[\s.]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "E";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "X") : (parts[0]?.[1] ?? "X");
  return (first + second).toUpperCase();
}

export function matchesQuery(person: Person, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [person.name, person.role, person.dept, person.assignment, person.group, person.note]
    .filter(Boolean)
    .some((field) => (field as string).toLowerCase().includes(q));
}
