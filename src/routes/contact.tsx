import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MarkSheet Pro" },
      { name: "description", content: "Get in touch with the MarkSheet Pro team. Questions, feedback and support." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("contact.title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("contact.body")}</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We'll reply soon."); (e.target as HTMLFormElement).reset(); }}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <input required placeholder="Your name" maxLength={100}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <input required type="email" placeholder="Email address" maxLength={255}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <textarea required placeholder="Message" rows={4} maxLength={1000}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button className="w-full rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}>
            {t("contact.send")}
          </button>
        </form>
        <div className="space-y-4">
          {[
            [<Mail key="m" className="h-5 w-5" />, "Email", "saifsahidkhan08@gmail.com"],
            [<Phone key="p" className="h-5 w-5" />, "Phone", "+977 9700788717"],
            [<MapPin key="l" className="h-5 w-5" />, "Address", "Biratnagar, Nepal"],
          ].map(([icon, label, val], i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
              <div>
                <div className="text-xs text-muted-foreground">{label as string}</div>
                <div className="font-medium">{val as string}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
