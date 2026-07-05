import { Link } from "@tanstack/react-router";
import { GraduationCap, Github, Instagram, Linkedin, Facebook } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="no-print border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">{t("brand")}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <div className="mt-4 flex gap-2">
            {[
              [Facebook, "Facebook", "https://www.facebook.com/share/1Chy5Jhsds/?mibextid=wwXIfr"],
              [Instagram, "Instagram", "https://www.instagram.com/jr.sahid_08?igsh=Z3g5bng4NWV0aGUw&utm_source=qr"],
              [Linkedin, "LinkedIn", "https://www.linkedin.com/in/sahid-khan-8b061541a/"],
              [Github, "GitHub", "https://github.com/jrsahid08"],
            ].map(([Icon, label, href], i) => (
              <a key={i} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.product")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/generator" className="hover:text-foreground">{t("nav.generator")}</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">{t("nav.faq")}</Link></li>
            <li><Link to="/help" className="hover:text-foreground">{t("nav.help")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.company")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("footer.feedback")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.legal")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
      </div>
    </footer>
  );
}
