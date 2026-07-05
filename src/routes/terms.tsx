import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — MarkSheet Pro" },
      { name: "description", content: "Terms and conditions for using MarkSheet Pro, the free student marksheet generator." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Terms & Conditions</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>By using MarkSheet Pro you agree to these terms. The tool is provided free of charge, "as is", without warranties of any kind.</p>
        <p><strong className="text-foreground">Responsible use.</strong> You are responsible for the accuracy of the data you enter and for how generated marksheets are used. Do not use this tool to create fraudulent or misleading documents.</p>
        <p><strong className="text-foreground">No liability.</strong> We are not liable for any consequences arising from the use of generated documents or calculation results.</p>
        <p><strong className="text-foreground">Intellectual property.</strong> Marksheets you generate belong to you. The application design and code remain the property of MarkSheet Pro.</p>
      </div>
    </div>
  );
}
