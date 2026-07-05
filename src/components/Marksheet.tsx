import { useEffect, useRef, useState } from "react";
import { Download, Printer, ArrowLeft, GraduationCap } from "lucide-react";
import QRCode from "qrcode";
import { useI18n } from "@/lib/i18n";
import { computeResult, type StudentData } from "@/lib/result";

export default function Marksheet({
  data,
  onBack,
}: {
  data: StudentData;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [qr, setQr] = useState("");
  const [busy, setBusy] = useState(false);
  const r = computeResult(data.subjects);
  const isGrade = data.mode === "grade";
  const issueDate = new Date().toLocaleDateString();

  useEffect(() => {
    const payload = `${data.studentName} | ${data.roll} | ${data.exam} | ${
      isGrade ? "GPA " + r.gpa.toFixed(2) : r.percentage.toFixed(2) + "%"
    } | ${r.passed ? "PASS" : "FAIL"}`;
    QRCode.toDataURL(payload, { margin: 1, width: 120 }).then(setQr).catch(() => {});
  }, [data, r.gpa, r.percentage, r.passed, isGrade]);

  const downloadPdf = async () => {
    if (!sheetRef.current) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const img = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const m = 8;
      const w = pw - m * 2;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "JPEG", m, m, w, Math.min(h, ph - m * 2));
      pdf.save(`${data.studentName || "marksheet"}-marksheet.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" /> {t("ms.close")}
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
            <Printer className="h-4 w-4" /> {t("ms.print")}
          </button>
          <button onClick={downloadPdf} disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}>
            <Download className="h-4 w-4" /> {busy ? "..." : t("ms.download")}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          id="marksheet-print"
          ref={sheetRef}
          className="mx-auto w-[794px] max-w-none bg-white p-10 text-[#1a1a2e]"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          {/* decorative border */}
          <div className="border-[3px] border-double border-[#3730a3] p-6">
            {/* header */}
            <div className="flex items-center gap-5 border-b-2 border-[#3730a3] pb-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#3730a3] bg-[#eef2ff]">
                {data.instituteLogo ? (
                  <img src={data.instituteLogo} alt="logo" className="h-full w-full object-cover" />
                ) : (
                  <GraduationCap className="h-9 w-9 text-[#3730a3]" />
                )}
              </div>
              <div className="flex-1 text-center">
                <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-[#3730a3]">
                  {data.instituteName || "Institute Name"}
                </h1>
                <p className="mt-1 text-sm text-[#4b5563]">
                  {data.exam || "Annual Examination"} — {data.year || new Date().getFullYear()}
                </p>
                <p className="mt-2 inline-block rounded-full bg-[#eef2ff] px-4 py-1 text-sm font-bold uppercase tracking-widest text-[#3730a3]">
                  {t("ms.title")}
                </p>
              </div>
              <div className="grid h-24 w-20 shrink-0 place-items-center overflow-hidden rounded border-2 border-[#3730a3] bg-[#f8fafc]">
                {data.studentPhoto ? (
                  <img src={data.studentPhoto} alt="student" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-[#9ca3af]">PHOTO</span>
                )}
              </div>
            </div>

            {/* student info */}
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
              <Info label={t("ms.subject") === "Subject" ? "Student Name" : t("gen.studentName")} value={data.studentName} />
              <Info label={t("ms.roll")} value={data.roll} />
              <Info label={t("ms.reg")} value={data.reg} />
              <Info label={t("ms.class")} value={data.className} />
              <Info label={t("ms.faculty")} value={data.faculty} />
              {data.father && <Info label={t("ms.father")} value={data.father} />}
              {data.mother && <Info label={t("ms.mother")} value={data.mother} />}
              {data.dob && <Info label={t("ms.dob")} value={data.dob} />}
            </div>

            {/* marks table */}
            <table className="mt-5 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#3730a3] text-white">
                  <th className="border border-[#3730a3] px-2 py-2 text-left">{t("ms.sn")}</th>
                  <th className="border border-[#3730a3] px-2 py-2 text-left">{t("ms.subject")}</th>
                  <th className="border border-[#3730a3] px-2 py-2">{t("ms.full")}</th>
                  {!isGrade && <th className="border border-[#3730a3] px-2 py-2">{t("ms.pass")}</th>}
                  <th className="border border-[#3730a3] px-2 py-2">{t("ms.obtained")}</th>
                  {isGrade && <th className="border border-[#3730a3] px-2 py-2">{t("ms.grade")}</th>}
                </tr>
              </thead>
              <tbody>
                {r.perSubject.map((s, i) => (
                  <tr key={s.id} className={i % 2 ? "bg-[#f8fafc]" : "bg-white"}>
                    <td className="border border-[#c7d2fe] px-2 py-1.5">{i + 1}</td>
                    <td className="border border-[#c7d2fe] px-2 py-1.5 font-medium">{s.name}</td>
                    <td className="border border-[#c7d2fe] px-2 py-1.5 text-center">{s.full}</td>
                    {!isGrade && <td className="border border-[#c7d2fe] px-2 py-1.5 text-center">{s.pass}</td>}
                    <td className="border border-[#c7d2fe] px-2 py-1.5 text-center font-semibold">{s.obtained}</td>
                    {isGrade && (
                      <td className={`border border-[#c7d2fe] px-2 py-1.5 text-center font-bold ${s.grade === "NG" ? "text-red-600" : "text-[#3730a3]"}`}>
                        {s.grade}
                      </td>
                    )}
                  </tr>
                ))}
                <tr className="bg-[#eef2ff] font-bold">
                  <td className="border border-[#3730a3] px-2 py-2" colSpan={2}>{t("ms.total")}</td>
                  <td className="border border-[#3730a3] px-2 py-2 text-center">{r.totalFull}</td>
                  {!isGrade && <td className="border border-[#3730a3]" />}
                  <td className="border border-[#3730a3] px-2 py-2 text-center">{r.totalObtained}</td>
                  {isGrade && <td className="border border-[#3730a3] px-2 py-2 text-center">{r.finalGrade}</td>}
                </tr>
              </tbody>
            </table>

            {/* summary */}
            <div className="mt-4 grid grid-cols-4 gap-3 text-center text-sm">
              {isGrade ? (
                <Stat label={t("ms.gpa")} value={r.gpa.toFixed(2)} />
              ) : (
                <Stat label={t("ms.percentage")} value={r.percentage.toFixed(2) + "%"} />
              )}
              <Stat label={t("ms.grade")} value={r.finalGrade} />
              <Stat label={t("ms.division")} value={isGrade ? getGradeRemark(r.gpa) : r.division.split(" ")[0] + " " + (r.division.split(" ")[1] ?? "")} />
              <Stat
                label={t("ms.result")}
                value={r.passed ? t("result.pass") : t("result.fail")}
                highlight={r.passed ? "pass" : "fail"}
              />
            </div>

            {/* footer: signatures + qr */}
            <div className="mt-8 flex items-end justify-between">
              <div className="text-center">
                <div className="h-12 w-36 border-b border-[#1a1a2e]" />
                <p className="mt-1 text-xs">{t("ms.principal")}</p>
              </div>
              <div className="flex flex-col items-center">
                {qr && <img src={qr} alt="qr" className="h-16 w-16" />}
                <div className="mt-1 grid h-14 w-14 place-items-center rounded-full border border-dashed border-[#9ca3af] text-[8px] text-[#9ca3af]">
                  {t("ms.stamp")}
                </div>
              </div>
              <div className="text-center">
                <div className="h-12 w-36 border-b border-[#1a1a2e]" />
                <p className="mt-1 text-xs">{t("ms.controller")}</p>
              </div>
            </div>

            <p className="mt-4 text-right text-xs text-[#6b7280]">
              {t("ms.issueDate")}: {issueDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGradeRemark(gpa: number): string {
  if (gpa >= 3.6) return "Outstanding";
  if (gpa >= 3.2) return "Excellent";
  if (gpa >= 2.8) return "Very Good";
  if (gpa >= 2.0) return "Good";
  if (gpa >= 1.6) return "Satisfactory";
  return "—";
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <span className="font-semibold text-[#374151]">{label}:</span>
      <span className="text-[#111827]">{value || "—"}</span>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: "pass" | "fail" }) {
  const color =
    highlight === "pass" ? "text-green-600" : highlight === "fail" ? "text-red-600" : "text-[#3730a3]";
  return (
    <div className="rounded-lg border border-[#c7d2fe] bg-[#f8fafc] px-2 py-2">
      <div className="text-[11px] uppercase tracking-wide text-[#6b7280]">{label}</div>
      <div className={`text-base font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
