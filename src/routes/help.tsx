import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — MarkSheet Pro" },
      { name: "description", content: "Step-by-step guide to creating and exporting professional student marksheets with MarkSheet Pro." },
    ],
  }),
  component: Help,
});

const STEPS = [
  ["Choose a result mode", "Pick Grade Based (GPA) or Percentage Based at the top of the generator."],
  ["Enter institute & student details", "Add the institute name, logo, student name, photo, roll and registration numbers."],
  ["Add subjects and marks", "Load a faculty preset or add custom subjects, then enter full, pass and obtained marks."],
  ["Generate the marksheet", "Click Generate Marksheet to preview a professional, print-ready document."],
  ["Download or print", "Export a high-quality A4 PDF or print directly from your browser."],
];

function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Help Center</h1>
      <p className="mt-3 text-muted-foreground">Create a professional marksheet in five simple steps.</p>
      <ol className="mt-8 space-y-4">
        {STEPS.map(([h, d], i) => (
          <li key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}>{i + 1}</span>
            <div>
              <h3 className="font-display font-bold">{h}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link to="/generator"
        className="mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
        style={{ background: "var(--gradient-primary)" }}>
        Open Result Generator
      </Link>
    </div>
  );
}
