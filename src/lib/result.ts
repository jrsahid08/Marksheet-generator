// Result & grade calculation logic

export type Subject = {
  id: string;
  name: string;
  full: number;
  pass: number;
  obtained: number;
};

export type ResultMode = "grade" | "percent";

export type StudentData = {
  instituteName: string;
  instituteLogo: string; // data URL
  studentName: string;
  studentPhoto: string; // data URL
  roll: string;
  reg: string;
  father: string;
  mother: string;
  dob: string;
  className: string;
  semester: string;
  faculty: string;
  year: string;
  exam: string;
  mode: ResultMode;
  fullMarks: number;
  passMarks: number;
  subjects: Subject[];
};

export type GradeInfo = { grade: string; point: number };

// Default grade scale (editable via constant). Percentage-based thresholds.
export const GRADE_SCALE: { min: number; grade: string; point: number }[] = [
  { min: 90, grade: "A+", point: 4.0 },
  { min: 80, grade: "A", point: 3.6 },
  { min: 70, grade: "B+", point: 3.2 },
  { min: 60, grade: "B", point: 2.8 },
  { min: 50, grade: "C+", point: 2.4 },
  { min: 40, grade: "C", point: 2.0 },
  { min: 35, grade: "D", point: 1.6 },
  { min: 0, grade: "NG", point: 0.0 },
];

export function getGrade(obtained: number, full: number): GradeInfo {
  const pct = full > 0 ? (obtained / full) * 100 : 0;
  const found = GRADE_SCALE.find((g) => pct >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
  return { grade: found.grade, point: found.point };
}

export function getDivision(pct: number): string {
  if (pct >= 60) return "First Division (Distinction)";
  if (pct >= 45) return "Second Division";
  if (pct >= 35) return "Third Division";
  return "Fail";
}

export type ResultSummary = {
  totalObtained: number;
  totalFull: number;
  percentage: number;
  gpa: number;
  finalGrade: string;
  division: string;
  passed: boolean;
  count: number;
  highest: number;
  lowest: number;
  average: number;
  perSubject: (Subject & GradeInfo & { passed: boolean })[];
};

export function computeResult(subjects: Subject[]): ResultSummary {
  const valid = subjects.filter((s) => s.name.trim());
  const totalObtained = valid.reduce((a, s) => a + (Number(s.obtained) || 0), 0);
  const totalFull = valid.reduce((a, s) => a + (Number(s.full) || 0), 0);
  const percentage = totalFull > 0 ? (totalObtained / totalFull) * 100 : 0;

  const perSubject = valid.map((s) => {
    const gi = getGrade(Number(s.obtained) || 0, Number(s.full) || 0);
    return { ...s, ...gi, passed: (Number(s.obtained) || 0) >= (Number(s.pass) || 0) };
  });

  const passed = perSubject.length > 0 && perSubject.every((s) => s.passed && s.grade !== "NG");
  const gpa = perSubject.length
    ? perSubject.reduce((a, s) => a + s.point, 0) / perSubject.length
    : 0;

  const obtainedList = valid.map((s) => Number(s.obtained) || 0);
  const highest = obtainedList.length ? Math.max(...obtainedList) : 0;
  const lowest = obtainedList.length ? Math.min(...obtainedList) : 0;
  const average = obtainedList.length ? totalObtained / obtainedList.length : 0;

  const finalGrade = passed ? getGrade(totalObtained, totalFull).grade : "NG";

  return {
    totalObtained,
    totalFull,
    percentage,
    gpa,
    finalGrade,
    division: passed ? getDivision(percentage) : "Fail",
    passed,
    count: valid.length,
    highest,
    lowest,
    average,
    perSubject,
  };
}

// Predefined subject presets by faculty
export const SUBJECT_PRESETS: Record<string, string[]> = {
  Science: ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
  Commerce: ["English", "Mathematics", "Economics", "Accountancy", "Business Studies"],
  Management: ["English", "Mathematics", "Business", "Computer", "Economics"],
  Arts: ["English", "History", "Geography", "Political Science"],
};

export function makeSubject(name = ""): Subject {
  return {
    id: crypto.randomUUID(),
    name,
    full: 100,
    pass: 35,
    obtained: 0,
  };
}
