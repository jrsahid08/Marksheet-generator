import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X, Moon, Sun, Globe, Check } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n, LANGUAGES, type Lang, type TransKey } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV: { to: string; key: TransKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/generator", key: "nav.generator" },
  { to: "/about", key: "nav.about" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 glass border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shadow-soft"
            style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline uppercase">{lang}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code as Lang)}>
                  <span className="mr-2">{l.flag}</span>
                  {l.label}
                  {lang === l.code && <Check className="ml-auto h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-border transition-all duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
