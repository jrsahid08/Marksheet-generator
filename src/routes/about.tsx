import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MarkSheet Pro" },
      { name: "description", content: "MarkSheet Pro is a free browser-based tool for creating professional digital student marksheets with automatic calculations." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("about.title")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("about.body")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["100% Free", "No account, no fees, no watermarks."],
          ["Private", "Your data stays in your browser."],
          ["Professional", "Real school & university layouts."],
        ].map(([h, d]) => (
          <div key={h} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-display font-bold gradient-text">{h}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
