@AGENTS.md

Please refer to `AGENTS.md` for ALL architectural rules. Key points:

## ⛔ TWO UNBREAKABLE RULES

### RULE 1: ZERO HARDCODED CONTENT
Every heading, paragraph, image, button label, phone number, and CTA comes from WordPress via GraphQL (`lib/graphql.ts`). NEVER paste text from screenshots into JSX. If WordPress data is null, show "WordPress Connection Needed" and TELL THE USER in chat that the WP page needs to be created. NEVER fall back to hardcoded content.

### RULE 2: ZERO HARDCODED STYLES
ALL colors MUST use CSS variables from the Design System Settings plugin:
- Colors: `style={{ color: "var(--color-text-primary, #f4f4f5)" }}`
- Backgrounds: `style={{ background: "var(--color-bg-dark, #0a0a0a)" }}`
- Borders: `style={{ borderColor: "var(--color-brand-border, #1f2937)" }}`
- Buttons: Use `btn-primary`, `btn-secondary`, `btn-outline`, or `btn-text-only` utility classes
- ❌ NEVER use `text-white`, `bg-black`, `bg-green-500`, `text-zinc-400`, or any hardcoded color Tailwind class
- ✅ Tailwind is fine for non-color properties: layout, spacing, typography size, responsive, effects

## Other Key Rules

1. **SEO from WordPress** — use `generateMetadata()` with RankMath `focusKeywords` mapping on every page.
2. **One component per file** — sections go in `components/sections/`, layout in `components/layout/`, small UI in `components/ui/`.
3. **Data fetching in `lib/graphql.ts` ONLY** — pages are Server Components that pass WP data as props to components.
4. **Tailwind v4** — no `tailwind.config.js`. Configure via CSS `@theme inline` in `globals.css`.
5. **Design System Settings** — colors, typography, buttons, and branding come from WordPress via `lib/design-system.ts`. Install the plugin from `wordpress-plugins/design-system-settings.zip`.
6. **STOP-AND-TELL** — if you encounter issues (missing WP page, GraphQL errors, missing content), TELL THE USER in chat. Do NOT silently hardcode fallbacks.
