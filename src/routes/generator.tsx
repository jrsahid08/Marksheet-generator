import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, GripVertical, Search, RotateCcw, FileDown, FileUp,
  Upload, Building2, User, ListChecks, Wand2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  computeResult, makeSubject, SUBJECT_PRESETS, type ResultMode,
  type StudentData, type Subject,
} from "@/lib/result";
import Marksheet from "@/components/Marksheet";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "Result Generator — MarkSheet Pro" },
      { name: "description", content: "Enter student details and marks to instantly generate a professional printable digital marksheet with automatic grade, GPA and percentage calculation." },
      { property: "og:title", content: "Result Generator — MarkSheet Pro" },
      { property: "og:description", content: "Generate professional student marksheets with automatic calculations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Generator,
});

const STORAGE_KEY = "marksheet-draft";

const emptyData = (): StudentData => ({
  instituteName: "", instituteLogo: "", studentName: "", studentPhoto: "",
  roll: "", reg: "", father: "", mother: "", dob: "", className: "",
  semester: "", faculty: "", year: String(new Date().getFullYear()), exam: "",
  mode: "grade", fullMarks: 100, passMarks: 35,
  subjects: [makeSubject("English"), makeSubject("Mathematics"), makeSubject("Science")],
});

function Generator() {
  const { t } = useI18n();
  const [data, setData] = useState<StudentData>(emptyData);
  const [showSheet, setShowSheet] = useState(false);
  const [search, setSearch] = useState("");
  const dragIdx = useRef<number | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setData({ ...emptyData(), ...JSON.parse(saved) }); } catch { /* ignore */ }
    }
  }, []);
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), 400);
    return () => clearTimeout(id);
  }, [data]);

  const set = <K extends keyof StudentData>(k: K, v: StudentData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const setSubject = (id: string, patch: Partial<Subject>) =>
    setData((d) => ({ ...d, subjects: d.subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

  const addSubject = () => setData((d) => ({ ...d, subjects: [...d.subjects, makeSubject()] }));
  const delSubject = (id: string) =>
    setData((d) => ({ ...d, subjects: d.subjects.filter((s) => s.id !== id) }));

  const loadPreset = (faculty: string) => {
    const names = SUBJECT_PRESETS[faculty];
    if (!names) return;
    setData((d) => ({ ...d, faculty, subjects: names.map((n) => makeSubject(n)) }));
    toast.success(`${faculty} subjects loaded`);
  };

  const onFile = (file: File | undefined, key: "instituteLogo" | "studentPhoto") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set(key, reader.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (idx: number) => {
    const from = dragIdx.current;
    if (from === null || from === idx) return;
    setData((d) => {
      const arr = [...d.subjects];
      const [moved] = arr.splice(from, 1);
      arr.splice(idx, 0, moved);
      return { ...d, subjects: arr };
    });
    dragIdx.current = null;
  };

  const validate = (): boolean => {
    if (!data.studentName.trim()) return toast.error(t("err.name")), false;
    if (!data.instituteName.trim()) return toast.error(t("err.institute")), false;
    const valid = data.subjects.filter((s) => s.name.trim());
    if (!valid.length) return toast.error(t("err.subjects")), false;
    if (data.subjects.some((s) => s.name.trim() && Number(s.obtained) > Number(s.full)))
      return toast.error(t("err.marks")), false;
    return true;
  };

  const generate = () => {
    if (!validate()) return;
    setShowSheet(true);
    toast.success(t("toast.generated"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setData(emptyData());
    localStorage.removeItem(STORAGE_KEY);
    toast.success(t("toast.reset"));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.studentName || "marksheet"}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setData({ ...emptyData(), ...parsed });
        toast.success(t("toast.imported"));
      } catch { toast.error(t("toast.importFail")); }
    };
    reader.readAsText(file);
  };

  const r = computeResult(data.subjects);
  const filteredSubjects = data.subjects.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (showSheet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Marksheet data={data} onBack={() => setShowSheet(false)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("gen.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("gen.subtitle")}</p>
      </div>

      {/* Dashboard cards */}
      <Dashboard r={r} mode={data.mode} />

      {/* Mode toggle */}
      <div className="mt-6 inline-flex rounded-xl border border-border bg-card p-1">
        {(["grade", "percent"] as ResultMode[]).map((m) => (
          <button
            key={m}
            onClick={() => set("mode", m)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              data.mode === m ? "text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
            style={data.mode === m ? { background: "var(--gradient-primary)" } : {}}
          >
            {m === "grade" ? t("gen.mode.grade") : t("gen.mode.percent")}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Institute */}
        <Section icon={<Building2 className="h-5 w-5" />} title={t("gen.section.institute")}>
          <Field label={t("gen.instituteName")} value={data.instituteName} onChange={(v) => set("instituteName", v)} />
          <div className="grid grid-cols-2 gap-3">
            <FileField label={`${t("gen.instituteLogo")} (${t("gen.optional")})`} preview={data.instituteLogo} onFile={(f) => onFile(f, "instituteLogo")} t={t} />
            <Field label={`${t("gen.exam")}`} value={data.exam} onChange={(v) => set("exam", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gen.year")} value={data.year} onChange={(v) => set("year", v)} />
            <SelectField label={t("gen.faculty")} value={data.faculty} onChange={loadPreset}
              options={["", ...Object.keys(SUBJECT_PRESETS)]} />
          </div>
        </Section>

        {/* Student */}
        <Section icon={<User className="h-5 w-5" />} title={t("gen.section.student")}>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gen.studentName")} value={data.studentName} onChange={(v) => set("studentName", v)} />
            <FileField label={`${t("gen.studentPhoto")} (${t("gen.optional")})`} preview={data.studentPhoto} onFile={(f) => onFile(f, "studentPhoto")} t={t} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gen.roll")} value={data.roll} onChange={(v) => set("roll", v)} />
            <Field label={t("gen.reg")} value={data.reg} onChange={(v) => set("reg", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gen.class")} value={data.className} onChange={(v) => set("className", v)} />
            <Field label={t("gen.semester")} value={data.semester} onChange={(v) => set("semester", v)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label={`${t("gen.father")} (${t("gen.optional")})`} value={data.father} onChange={(v) => set("father", v)} />
            <Field label={`${t("gen.mother")} (${t("gen.optional")})`} value={data.mother} onChange={(v) => set("mother", v)} />
            <Field label={`${t("gen.dob")} (${t("gen.optional")})`} type="date" value={data.dob} onChange={(v) => set("dob", v)} />
          </div>
        </Section>
      </div>

      {/* Exam defaults */}
      <Section className="mt-6" icon={<ListChecks className="h-5 w-5" />} title={t("gen.section.exam")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField label={t("gen.fullMarks")} value={data.fullMarks} onChange={(v) => {
            set("fullMarks", v);
            setData((d) => ({
              ...d,
              fullMarks: v,
              subjects: d.subjects.map((s) => ({ ...s, full: v })),
            }));
          }} />
          <NumberField label={t("gen.passMarks")} value={data.passMarks} onChange={(v) => {
            set("passMarks", v);
            setData((d) => ({
              ...d,
              passMarks: v,
              subjects: d.subjects.map((s) => ({ ...s, pass: v })),
            }));
          }} />
        </div>
      </Section>

      {/* Subjects */}
      <Section className="mt-6" icon={<ListChecks className="h-5 w-5" />} title={t("gen.section.subjects")}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("gen.search")}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {Object.keys(SUBJECT_PRESETS).map((f) => (
            <button key={f} onClick={() => loadPreset(f)}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary">
              <Wand2 className="h-3.5 w-3.5" /> {f}
            </button>
          ))}
        </div>

        {/* subject rows */}
        <div className="space-y-2">
          <div className="hidden grid-cols-[24px_1fr_90px_90px_90px_36px] gap-2 px-1 text-xs font-semibold text-muted-foreground sm:grid">
            <span />
            <span>{t("gen.subject")}</span>
            <span className="text-center">{t("gen.full")}</span>
            <span className="text-center">{t("gen.pass")}</span>
            <span className="text-center">{t("gen.obtained")}</span>
            <span />
          </div>
          {filteredSubjects.map((s) => {
            const idx = data.subjects.indexOf(s);
            const over = Number(s.obtained) > Number(s.full);
            return (
              <div
                key={s.id}
                draggable
                onDragStart={() => (dragIdx.current = idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(idx)}
                className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-2 sm:grid-cols-[24px_1fr_90px_90px_90px_36px] sm:items-center sm:p-1.5"
              >
                <span className="hidden cursor-grab place-items-center text-muted-foreground sm:grid">
                  <GripVertical className="h-4 w-4" />
                </span>
                <input value={s.name} onChange={(e) => setSubject(s.id, { name: e.target.value })}
                  placeholder={t("gen.subject")}
                  className="col-span-2 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring sm:col-span-1" />
                <input type="number" value={s.full} onChange={(e) => setSubject(s.id, { full: +e.target.value })}
                  onFocus={(e) => e.target.select()}
                  aria-label={t("gen.full")}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm outline-none focus:ring-2 focus:ring-ring" />
                <input type="number" value={s.pass} onChange={(e) => setSubject(s.id, { pass: +e.target.value })}
                  onFocus={(e) => e.target.select()}
                  aria-label={t("gen.pass")}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm outline-none focus:ring-2 focus:ring-ring" />
                <input type="number" value={s.obtained} onChange={(e) => setSubject(s.id, { obtained: +e.target.value })}
                  onFocus={(e) => e.target.select()}
                  aria-label={t("gen.obtained")}
                  className={`rounded-md border bg-background px-2 py-1.5 text-center text-sm outline-none focus:ring-2 ${over ? "border-destructive focus:ring-destructive" : "border-border focus:ring-ring"}`} />
                <button onClick={() => delSubject(s.id)} aria-label="delete"
                  className="grid place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={addSubject}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/50 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
          <Plus className="h-4 w-4" /> {t("gen.addSubject")}
        </button>
      </Section>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={generate}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
          style={{ background: "var(--gradient-primary)" }}>
          <Wand2 className="h-4 w-4" /> {t("gen.generate")}
        </button>
        <button onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
          <RotateCcw className="h-4 w-4" /> {t("gen.reset")}
        </button>
        <button onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
          <FileDown className="h-4 w-4" /> {t("gen.exportJson")}
        </button>
        <button onClick={() => importRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
          <FileUp className="h-4 w-4" /> {t("gen.importJson")}
        </button>
        <input ref={importRef} type="file" accept="application/json" hidden
          onChange={(e) => importJson(e.target.files?.[0])} />
      </div>
    </div>
  );
}

/* ---------- sub components ---------- */

function Dashboard({ r, mode }: { r: ReturnType<typeof computeResult>; mode: ResultMode }) {
  const { t } = useI18n();
  const cards = [
    { label: t("dash.subjects"), value: r.count, suffix: "" },
    { label: t("dash.total"), value: r.totalObtained, suffix: `/${r.totalFull}` },
    { label: t("dash.percent"), value: +r.percentage.toFixed(1), suffix: "%" },
    mode === "grade"
      ? { label: t("dash.gpa"), value: +r.gpa.toFixed(2), suffix: "" }
      : { label: t("dash.average"), value: +r.average.toFixed(1), suffix: "" },
    { label: t("dash.grade"), text: r.finalGrade },
    { label: t("dash.result"), text: r.passed ? t("result.pass") : t("result.fail"), tone: r.passed ? "pass" : "fail" as const },
  ];
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c, i) => (
        <div key={i} className="card-hover rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</div>
          {"text" in c ? (
            <div className={`mt-1 font-display text-2xl font-extrabold ${
              c.tone === "pass" ? "text-success" : c.tone === "fail" ? "text-destructive" : "gradient-text"
            }`}>{c.text}</div>
          ) : (
            <div className="mt-1 font-display text-2xl font-extrabold">
              <Counter value={c.value as number} />{c.suffix}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = n;
    const dur = 500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(+(from + (value - from) * p).toFixed(value % 1 ? 2 : 0));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{n}</>;
}

function Section({ icon, title, children, className = "" }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-soft ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function NumberField({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type="number" min={0} value={value}
        onChange={(e) => onChange(+e.target.value)}
        onFocus={(e) => e.target.select()}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
        {options.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </label>
  );
}

function FileField({ label, preview, onFile, t }: {
  label: string; preview: string; onFile: (f?: File) => void; t: (k: never) => string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <button type="button" onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary">
        {preview ? (
          <img src={preview} alt="" className="h-6 w-6 rounded object-cover" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <span className="truncate">{preview ? "✓" : (t as (k: string) => string)("gen.upload")}</span>
      </button>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
