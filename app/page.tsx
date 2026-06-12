/**
 * app/page.tsx — Template Splash Screen
 *
 * This is the STARTING POINT of the template.
 * Replace this entire file with your actual home page content.
 *
 * To fetch content from WordPress:
 *   import { getHomePage } from "@/lib/graphql";
 *   const page = await getHomePage();
 */

export const metadata = {
  title: "Template Ready | WordPress + Next.js Starter",
  description: "A clone-and-go Next.js template connected to WordPress via WPGraphQL.",
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-dark relative overflow-hidden px-6">
      {/* Radial glow behind content */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">

        {/* Pulsing badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 bg-green-950 border border-green-700 text-green-400 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
          <span
            className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-75"
            aria-hidden="true"
          />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 flex-shrink-0" />
          Template is ready
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
          2h Web Template
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
            }}
          >
            Ready to Build
          </span>
        </h1>

        {/* Sub-description */}
        <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mb-10">
          WordPress content connected via WPGraphQL. Contact form wired up.{" "}
          <strong className="text-zinc-200">Just set your env vars and start building.</strong>
        </p>

        {/* Step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10">
          {[
            {
              step: "01",
              title: "Set env vars",
              body: "Copy .env.example → .env.local and add your WordPress URL.",
            },
            {
              step: "02",
              title: "Add your pages",
              body: "Add query functions in lib/graphql.ts and create page folders.",
            },
            {
              step: "03",
              title: "Deploy",
              body: "Push to Vercel or any Node host. ISR keeps content fresh.",
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-left hover:border-green-800 transition-colors"
            >
              <span className="text-xs font-mono text-green-500 font-bold">{step}</span>
              <h2 className="text-white font-semibold text-sm">{title}</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Quick-start code block */}
        <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-left font-mono text-sm">
          <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wider">Quick start</p>
          <p className="text-zinc-400">
            <span className="text-green-500">$</span>{" "}
            <span className="text-zinc-200">cp .env.example .env.local</span>
          </p>
          <p className="text-zinc-400 mt-1">
            <span className="text-green-500">$</span>{" "}
            <span className="text-zinc-200">
              echo &apos;NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://yoursite.com/graphql&apos; &gt;&gt; .env.local
            </span>
          </p>
          <p className="text-zinc-400 mt-1">
            <span className="text-green-500">$</span>{" "}
            <span className="text-zinc-200">npm run dev</span>
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-zinc-600 text-xs">
          Delete this file and replace with your real homepage.{" "}
          <span className="text-zinc-500">See AGENTS.md for conventions.</span>
        </p>
      </div>
    </main>
  );
}
