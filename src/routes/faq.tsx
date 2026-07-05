import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — MarkSheet Pro" },
      { name: "description", content: "Frequently asked questions about generating student marksheets, PDF export, grading and privacy with MarkSheet Pro." },
    ],
  }),
  component: Faq,
});

const FAQS = [
  ["Is MarkSheet Pro free to use?", "Yes. It is completely free with no sign-up, no watermarks and no hidden fees."],
  ["Where is my data stored?", "Everything runs locally in your browser. Your data and drafts are saved only on your device and never uploaded."],
  ["What is the difference between grade and percentage mode?", "Grade mode converts marks into letter grades and computes GPA. Percentage mode shows obtained/full marks with percentage and division."],
  ["Can I add custom subjects?", "Yes. You can add unlimited custom subjects, edit full/pass/obtained marks, reorder and delete them."],
  ["How do I download a PDF?", "Generate the marksheet, then click Download PDF for a high-quality A4 file, or Print for a print-friendly version."],
  ["Can I change the grading scale?", "The default scale (A+ to NG) is defined in the app and can be customized in the code for your institution."],
];

function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("faq.title")}</h1>
      <div className="mt-8 space-y-3">
        {FAQS.map(([q, a], i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold">
              {q}
              <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-muted-foreground">{a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
