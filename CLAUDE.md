@AGENTS.md

Please refer to `AGENTS.md` for ALL architectural rules. Key points:

1. **ZERO hardcoded content** — every heading, paragraph, image, button label comes from WordPress via GraphQL. NEVER paste text from screenshots into JSX.
2. **SEO from WordPress** — use `generateMetadata()` with RankMath `focusKeywords` mapping on every page.
3. **One component per file** — sections go in `components/sections/`, layout in `components/layout/`, small UI in `components/ui/`.
4. **Data fetching in `lib/graphql.ts` ONLY** — pages are Server Components that pass WP data as props to components.
5. **Tailwind v4** — no `tailwind.config.js`. Configure via CSS `@theme inline` in `globals.css`.
6. **Null = show error** — if WordPress data is null, show "WordPress Connection Needed". NEVER fall back to hardcoded content.
7. **Design System Settings** — colors, typography, buttons, and branding come from WordPress via `lib/design-system.ts`. Use CSS variables (`var(--btn-primary-bg)`, `var(--shadow-medium)`, etc.) instead of hardcoded hex values. Install the plugin from `wordpress-plugins/design-system-settings.zip`.

