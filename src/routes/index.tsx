import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, ArrowRight, GraduationCap, Award, FileText, Calculator,
  Moon, Languages, Layers,
} from "lucide-react";
import { useI18n, type TransKey } from "@/lib/i18n";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(60% 60% at 70% 20%, color-mix(in oklab, var(--primary) 18%, transparent), transparent)" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("hero.badge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/generator"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03]"
                style={{ background: "var(--gradient-primary)" }}>
                {t("hero.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary">
                {t("hero.secondary")}
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-0 -z-10 animate-float rounded-full opacity-40 blur-3xl"
              style={{ background: "var(--gradient-hero)" }} />
            <img src={heroImg} alt="Digital marksheet illustration" width={512} height={512}
              className="w-full max-w-md animate-float drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
          <Stat value={125000} suffix="+" labelKey="stats.marksheets" />
          <Stat value={3200} suffix="+" labelKey="stats.institutes" />
          <Stat value={100} suffix="%" labelKey="stats.accuracy" />
          <Stat value={3} suffix="" labelKey="stats.languages" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t("features.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("features.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Calculator />} titleKey="feature.grade.title" descKey="feature.grade.desc" />
          <Feature icon={<Layers />} titleKey="feature.subjects.title" descKey="feature.subjects.desc" />
          <Feature icon={<FileText />} titleKey="feature.pdf.title" descKey="feature.pdf.desc" />
          <Feature icon={<Award />} titleKey="feature.auto.title" descKey="feature.auto.desc" />
          <Feature icon={<Moon />} titleKey="feature.theme.title" descKey="feature.theme.desc" />
          <Feature icon={<Languages />} titleKey="feature.multi.title" descKey="feature.multi.desc" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-primary-foreground shadow-elegant"
          style={{ background: "var(--gradient-hero)" }}>
          <GraduationCap className="mx-auto h-12 w-12" />
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{t("home.ctaTitle")}</h2>
          <Link to="/generator"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-[1.03]">
            {t("home.ctaBtn")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, suffix, labelKey }: { value: number; suffix: string; labelKey: TransKey }) {
  const { t } = useI18n();
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1200, 1);
          setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl font-extrabold gradient-text sm:text-4xl">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{t(labelKey)}</div>
    </div>
  );
}

function Feature({ icon, titleKey, descKey }: { icon: React.ReactNode; titleKey: TransKey; descKey: TransKey }) {
  const { t } = useI18n();
  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">{t(titleKey)}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
    </div>
  );
}
