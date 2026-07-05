import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MarkSheet Pro" },
      { name: "description", content: "MarkSheet Pro privacy policy. All data is processed locally in your browser and never uploaded." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose-sm">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>MarkSheet Pro is built with privacy first. All information you enter — student details, photos, logos and marks — is processed entirely within your browser.</p>
        <p><strong className="text-foreground">No data collection.</strong> We do not upload, store, or transmit your data to any server. Drafts are saved only in your browser's local storage on your own device.</p>
        <p><strong className="text-foreground">No tracking.</strong> We do not use third-party advertising trackers to profile you.</p>
        <p><strong className="text-foreground">Your control.</strong> Clearing your browser storage removes all saved drafts permanently.</p>
      </div>
    </div>
  );
}
