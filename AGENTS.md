# AGENTS.md — Website Template Agent Guide

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ
from your training data. **Read the relevant guide in `node_modules/next/dist/docs/` before
writing any code.** Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 1. Project Overview

This is a **clone-and-go WordPress-connected Next.js template**.
The idea: clone this repo, fill in `.env.local`, and immediately start building pages —
**ALL content comes from WordPress via WPGraphQL. Nothing is hardcoded in Next.js.**

**Stack:**
- Next.js 16 (App Router, TypeScript)
- React 19
- Tailwind CSS v4 (`@import "tailwindcss"` — NOT the v3 config file style)
- No component library — pure Tailwind utility classes only

---

## 2. ⚠️ THE GOLDEN RULE — ZERO HARDCODED CONTENT

> **EVERY piece of visible text, heading, paragraph, image URL, button label, link,
> phone number, address, and call-to-action MUST come from WordPress.**
> Next.js is ONLY the rendering/styling layer. WordPress is the CMS — the single
> source of truth for ALL content.

### What this means in practice

| ✅ CORRECT | ❌ WRONG |
|---|---|
| `<h1>{page.title}</h1>` | `<h1>Welcome to Our Agency</h1>` |
| `<p>{aboutData.description}</p>` | `<p>We build amazing websites...</p>` |
| `<Image src={page.featuredImage.node.sourceUrl} />` | `<Image src="/images/hero.jpg" />` |
| `<Link href={service.uri}>{service.title}</Link>` | `<Link href="/services">Our Services</Link>` |
| `<a href={contactData.phone.link}>{contactData.phone.text}</a>` | `<a href="tel:+1234567890">Call Us</a>` |
| Section headings from WP content parsing | Inline string literals in JSX |

### When you are given a screenshot or design mockup

1. **Identify every piece of text content** in the design (headings, paragraphs, button labels, phone numbers, addresses, image URLs, etc.)
2. **Create or update the corresponding WordPress page** with that content structured in proper HTML (h1–h6 headings, paragraphs, links, images)
3. **Write a GraphQL query** to fetch that content
4. **Parse the WordPress HTML** in Next.js to extract structured data into typed objects
5. **Render the parsed data** using Tailwind-styled components — NEVER paste the screenshot text as string literals

### Hardcoded content exceptions (ONLY these are allowed)

- **Loading/error states**: `"Loading..."`, `"WordPress Connection Needed"`, `"Page not found"`
- **Structural labels**: `aria-label`, `alt` text fallbacks when WP image has none
- **Layout metadata**: `app/layout.tsx` fallback `title` and `description` (overridden by page-level SEO)
- **Developer instructions**: Comments, console logs, error messages for developers
- **Form validation messages**: `"Please enter a valid email"`, `"This field is required"`

**Everything else → WordPress.**

---

## 3. Environment Variables

All environment variables are documented in `.env.example`.
**Never hardcode URLs or keys.** Always read from `process.env`.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` | ✅ | WordPress WPGraphQL endpoint (e.g. `https://yoursite.com/graphql`) |
| `NEXT_PUBLIC_WORDPRESS_REST_URL` | ✅ | WordPress base URL for REST API (e.g. `https://yoursite.com`) |
| `WORDPRESS_API_USERNAME` | optional | WordPress application password username (for auth-protected queries) |
| `WORDPRESS_API_PASSWORD` | optional | WordPress application password (for auth-protected queries) |
| `FIREBASE_PROJECT_ID` | optional | Firebase project (contact form fallback) |
| `FIREBASE_API_KEY` | optional | Firebase API key (contact form fallback) |
| `FIREBASE_COLLECTION` | optional | Firestore collection name (default: `submissions`) |

**Rules:**
- **Do NOT add hardcoded site URLs anywhere in source.** If you need a URL, add it to `.env.example` and read it from env.
- **When adding a new env var**, always update BOTH `.env.example` (with a placeholder value + comment) AND this table.
- **Never commit `.env.local`** — it is gitignored. Only `.env.example` is committed.

---

## 4. Data Fetching — GraphQL

### The core helper
All GraphQL calls go through `lib/graphql.ts → fetchGraphQL()`.

```ts
// CORRECT
import { fetchGraphQL } from "@/lib/graphql";
const data = await fetchGraphQL(`query { ... }`, { variable: value });

// WRONG — never call the WP endpoint directly from a page/component
const res = await fetch("https://somesite.com/graphql", ...);
```

### Rules
- **Always use `fetchGraphQL`** — never call the endpoint inline.
- **Always add a new named function** in `lib/graphql.ts` for each page's data need (e.g., `getAboutPage()`).
- **Always fetch SEO fields** alongside content (`title`, `description`, `canonicalUrl`, `openGraph`).
- **Always include `featuredImage`** in queries — pages use featured images for hero/banner sections.
- **Revalidation is set to `1` second** — do not change this without a strong reason.
- **Pages are Server Components** — fetch data at the page level, pass as props to client components.
- **Always type your return values** — use `WordPressPage`, `WordPressService`, etc. interfaces defined in `lib/graphql.ts`.
- **Graceful null handling** — if WordPress is unreachable, `fetchGraphQL` returns `null`. Pages MUST handle `null` data gracefully with a "WordPress Connection Needed" message — NEVER fall back to hardcoded content.

### SEO field shape (expected from WPGraphQL + RankMath)

**Note:** We use RankMath, so the focus keyword field is `focusKeywords` (not `focuskw` which is Yoast). Ensure you map `seo.focusKeywords` to the Next.js `keywords` metadata array in all pages.

```graphql
seo {
  title
  description
  focusKeywords
  canonicalUrl
  robots
  openGraph {
    title
    description
    image { secureUrl }
  }
}
```

Use the shared `SEO_FIELDS` fragment exported from `lib/graphql.ts` in every query.

---

## 5. Content Architecture — WordPress → Next.js

### How content flows

```
WordPress Admin (CMS)
  ├── Pages → title, content (HTML), featuredImage, SEO fields
  ├── Posts (by category) → services, projects, testimonials, blog
  └── Menus → navigation items

        ↓ WPGraphQL

lib/graphql.ts (fetch + parse)
  ├── getHomePage() → home page content
  ├── getPageBySlug("about") → about page content
  ├── getHomePageData() → page + services + projects + testimonials
  └── getMenuItems() → navigation

        ↓ Props

app/page.tsx (Server Component — LAYOUT + STYLING ONLY)
  ├── Parses WP HTML into structured data objects
  ├── Passes data as props to section components
  └── Never contains visible text strings
```

### WordPress content structure for pages

Every page in WordPress should have its content structured in HTML with proper heading hierarchy.
The Next.js code then **parses this HTML** to extract structured fields.

**Example: WordPress "home" page content:**
```html
<div class="section-subtitle">Die Realität</div>
<div class="section-title"><span>Sieht gut aus</span> <br>reicht nicht</div>
<p>Viele Websites sehen gut aus – bringen aber keine Anfragen...</p>
<h5>2H Websolutions kümmert sich genau darum - Alles aus einer Hand</h5>
<a href="/about" class="button-1">Mehr über mich</a>
<a href="tel:+436764508579">+43 676 4508579</a>
```

**Next.js then parses this into a typed object:**
```ts
interface AboutSectionData {
  subtitle: string;       // extracted from .section-subtitle
  titleLine1: string;     // extracted from .section-title > span
  titleLine2: string;     // extracted from .section-title text after <br>
  description: string;    // extracted from <p>
  motto: string;          // extracted from <h5>
  btnText: string;        // extracted from <a.button-1>
  btnLink: string;        // href from <a.button-1>
  phoneText: string;      // text from tel: link
  phoneLink: string;      // href from tel: link
  imageUrl: string;       // from featured image or <img> in content
}
```

### Content parsing rules

- **Create an `extractXxxData(html: string)` function** for each section that needs structured data from WP HTML.
- **Use regex or DOM parsing** to extract fields — NEVER hardcode the values.
- **Always provide a "WordPress not connected" fallback** — show a clear message asking the user to set up WordPress. Do NOT provide hardcoded content fallbacks.
- **Parse errors should be surfaced** — if a regex fails to match, log a warning and render an empty/placeholder state, NOT hardcoded text.

### Handling missing WordPress data

When WordPress data is `null` (endpoint not configured, page doesn't exist):

```tsx
// ✅ CORRECT — show connection message
if (!page) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-brand-green mb-4">WordPress Connection Needed</h1>
        <p className="text-zinc-400">
          Set your WordPress endpoint in <code>.env.local</code> and ensure a page
          with slug <code>"home"</code> exists in WordPress.
        </p>
      </div>
    </main>
  );
}

// ❌ WRONG — hardcoded fallback content
if (!page) {
  return <h1>Welcome to Our Amazing Agency</h1>;
}
```

---

## 6. WordPress Post Categories (Dynamic Content)

Use WordPress post categories to organize repeatable content types:

| Category Slug | Purpose | Used On |
|---|---|---|
| `services` or `leistungen` | Service offerings | Home page services section, services page |
| `projects` or `projekte` | Portfolio / case studies | Home page projects slider, portfolio page |
| `testimonials` or `kundenstimmen` | Client reviews | Home page testimonials section |
| `blog` | Blog posts | Blog listing page |

**Rules:**
- Query posts by category using `where: { categoryName: "services" }`.
- Support both English AND localized category slugs (e.g., `services` / `leistungen`).
- Use `title`, `content`, `excerpt`, and `featuredImage` from each post.
- **Never hardcode service names, project names, or testimonial text.**

---

## 7. Contact Form

### Architecture
```
Client: <ContactForm /> (components/ContactForm.tsx)
  ↓ POST /api/contact (JSON or x-www-form-urlencoded)
Server: app/api/contact/route.ts
  ↓ 1st try → WordPress REST API (/wp-json/firebase-form/v1/submit)
  ↓ fallback → Firestore REST API (if WP is unreachable)
```

### Rules
- **`ContactForm` is a client component** (`"use client"` at top). Never make it a server component.
- **Do not bypass `/api/contact`** — never POST directly to WordPress from the client (CORS, keys exposure).
- The contact route supports **3 form modes** — don't remove any of them:
  1. `fields` prop (array of field definitions from WP settings API)
  2. `formHtml` prop (raw WordPress Fluent Form HTML)
  3. Fallback hardcoded form (name / email / message)
- **reCAPTCHA** is optional and widget-rendered — do not remove the reCAPTCHA logic even if not used.
- The WordPress REST submit endpoint URL comes from `NEXT_PUBLIC_WORDPRESS_REST_URL` env var.
- **Form field labels** should come from WordPress settings API when available.

---

## 8. App Router Conventions

- **Server Components by default** — only add `"use client"` when you need browser APIs, state, or event handlers.
- **Metadata:** Export a `metadata` object or `generateMetadata` function from every page. When using dynamic metadata from WPGraphQL, ALWAYS map `seo.focusKeywords` to the `keywords` field:
  ```ts
  // ALWAYS use generateMetadata for pages with WordPress data
  export async function generateMetadata(): Promise<Metadata> {
    const page = await getAboutPage();
    return {
      title: page?.seo?.title || "Page Title",
      description: page?.seo?.description || "",
      keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
    };
  }
  ```
- **Route structure:** One folder = one page. Dynamic routes use `[slug]` folders.
- **API Routes:** Live in `app/api/<name>/route.ts`. Export named HTTP method handlers (`GET`, `POST`, etc.).
- **Images:** Always use `next/image` with `<Image>`. Never use raw `<img>` tags.
- **Links:** Always use `next/link` with `<Link>`. Never use raw `<a>` tags for internal navigation.
- **Remote images:** `next.config.ts` must have `images.remotePatterns` configured to allow WordPress domain images. Use wildcard `**` for flexibility across different WP hosts.

---

## 9. Tailwind v4 Rules

This project uses **Tailwind v4** — the API is different from v3.

| Feature | v3 (OLD — do NOT use) | v4 (correct) |
|---|---|---|
| Config file | `tailwind.config.js` | Does not exist — configure via CSS |
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Custom tokens | `theme.extend` in JS | `@theme inline { --color-x: ... }` in CSS |
| Arbitrary values | `bg-[#fff]` | same — still works |
| Dark mode | `darkMode: 'class'` in config | `@variant dark` in CSS |

**Do NOT create a `tailwind.config.js` or `tailwind.config.ts`** — it is not needed and will conflict.

Custom color tokens are defined in `app/globals.css` under `@theme inline`:
```css
@theme inline {
  --color-brand-green: #22c55e;
  --color-brand-dark: #0a0a0a;
}
```

Use them in classes like `bg-brand-green`, `text-brand-dark`.

---

## 10. Styling Rules

- **No inline `style={{}}` unless strictly necessary** (e.g., dynamic CSS custom properties like gradients). Use Tailwind classes.
- **No CSS Modules** — not set up, don't add them.
- **Green + black is the brand palette** — `emerald-*` and `green-*` Tailwind shades for accents, `zinc-900` / `black` for backgrounds. Customise the exact shades in `globals.css` `@theme inline` block.
- **Typography:** Inter (loaded via `next/font/google` in `layout.tsx`). Add other fonts (e.g., Federo, Barlow) in `layout.tsx` and register them as CSS variables in `globals.css`.
- **Animations:** Use Tailwind's built-in `animate-*` utilities. Do not install Framer Motion unless explicitly asked.
- **WordPress content styling:** Use the `.wp-content` class (defined in `globals.css`) when rendering raw WP HTML with `dangerouslySetInnerHTML`.

---

## 11. Component Architecture — ONE FILE PER COMPONENT

### Folder Structure

```
app/                        ← Pages (Server Components ONLY)
  layout.tsx                ← Root layout — NO client-side logic, injects design system CSS
  page.tsx                  ← Home page — fetches WP data, renders section components
  about/
    page.tsx                ← About page — fetches WP data, renders section components
  contact/
    page.tsx                ← Contact page
  services/
    page.tsx                ← Services listing page
    [slug]/
      page.tsx              ← Individual service page (dynamic route)
  api/
    contact/
      route.ts              ← Contact form API handler

components/                 ← Reusable UI components
  sections/                 ← Page section components (one per visual section)
    HeroSection.tsx          ← Hero banner section
    AboutSection.tsx         ← About / intro section
    ServicesSection.tsx      ← Services grid section
    ProjectsSection.tsx      ← Projects showcase section
    TestimonialsSection.tsx  ← Testimonials section
    CTASection.tsx           ← Call-to-action section
    MapSection.tsx           ← Google Maps embed section
  layout/                   ← Layout components
    Header.tsx               ← Site header / navigation
    Footer.tsx               ← Site footer
    ScrollToTop.tsx          ← Scroll-to-top button
  ui/                       ← Shared small UI components
    SectionBadge.tsx         ← Reusable subtitle badge (● LABEL)
    SectionTitle.tsx         ← Reusable section heading
    ProjectsSlider.tsx       ← Client component: project carousel
    TestimonialsSlider.tsx   ← Client component: testimonial carousel
  ContactForm.tsx            ← Client component: contact form

lib/
  graphql.ts                ← ALL WP data fetching — SINGLE SOURCE OF TRUTH
  design-system.ts          ← Design System Settings fetch + CSS generation
  types.ts                  ← Shared TypeScript interfaces for WP data

wordpress-plugins/          ← WordPress plugins to install on the WP site
  design-system-settings/   ← Design tokens admin panel + REST API
    design-system-settings.php ← Main plugin file
    admin.js                   ← Color picker, media uploader, tabs JS
    admin.css                  ← Admin page styling
  design-system-settings.zip   ← Ready-to-upload ZIP for WP Admin
```

### Critical rules for components

1. **One component per file** — every visual section gets its own `.tsx` file. No 500-line page files with inline sections.

2. **Section components receive ALL data via props** — they NEVER fetch data themselves. The page-level Server Component fetches and passes down.

   ```tsx
   // ✅ CORRECT — section receives props, no fetching
   interface HeroSectionProps {
     title: string;
     subtitle: string;
     backgroundImage: string;
   }
   export default function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
     return <section>...</section>;
   }

   // ❌ WRONG — section fetches its own data
   export default async function HeroSection() {
     const data = await getHomePage(); // NEVER do this in a component
   }
   ```

3. **Client components ONLY when needed** — `"use client"` is required ONLY for components using `useState`, `useEffect`, `useRef`, event handlers, or browser APIs (e.g., sliders, forms, scroll listeners). Everything else stays as Server Components.

4. **Props must be typed** — every component has an explicit TypeScript interface for its props. No `any` types.

5. **Consistent naming** — section components are named `XxxSection.tsx`, layout components are `Header.tsx`, `Footer.tsx`, small UI pieces go in `ui/`.

### When to create a new component

| Situation | Action |
|---|---|
| A visual section on the page (hero, about, services grid) | Create `components/sections/XxxSection.tsx` |
| Needs interactivity (slider, form, scroll handler) | Create as client component with `"use client"` |
| Reused across multiple pages (badge, section title) | Create in `components/ui/` |
| Header or footer | Create in `components/layout/` |
| Used in exactly one page, purely presentational, < 30 lines | Can stay inline in the page file |

---

## 12. Adding a New Page — Complete Workflow

### Step 1: Create the page in WordPress

Go to WordPress Admin → Pages → Add New:
- **Title**: The page heading (e.g., "About Us")
- **Slug**: URL-friendly name (e.g., `about`)
- **Content**: Structured HTML with proper headings (h1–h6), paragraphs, links, images
- **Featured Image**: Set a hero/banner image
- **SEO (RankMath)**: Fill in title, description, focus keywords

### Step 2: Add a GraphQL query function in `lib/graphql.ts`

```ts
/** About page */
export async function getAboutPage(): Promise<WordPressPage | null> {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "about" }) {
        nodes {
          id
          title
          slug
          content
          featuredImage {
            node { sourceUrl }
          }
          ${SEO_FIELDS}
        }
      }
    }
  `);
  return data?.pages?.nodes?.[0] ?? null;
}
```

### Step 3: Create section components

```tsx
// components/sections/AboutHeroSection.tsx
interface AboutHeroSectionProps {
  title: string;
  backgroundImage?: string;
}

export default function AboutHeroSection({ title, backgroundImage }: AboutHeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center ...">
      {backgroundImage && <Image src={backgroundImage} alt={title} fill className="object-cover" />}
      <h1 className="text-5xl font-bold">{title}</h1>
    </section>
  );
}
```

### Step 4: Create the page file `app/about/page.tsx`

```tsx
import { getAboutPage } from "@/lib/graphql";
import { Metadata } from "next";
import AboutHeroSection from "@/components/sections/AboutHeroSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return {
    title: page?.seo?.title,
    description: page?.seo?.description,
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
        <div className="text-center">
          <h1 className="text-2xl text-brand-green mb-4">WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Ensure a page with slug <code>"about"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <AboutHeroSection
        title={page.title}
        backgroundImage={page.featuredImage?.node?.sourceUrl}
      />
      {/* More sections, all receiving WP data as props */}
    </main>
  );
}
```

### Step 5: Add navigation link

Update Header component to include the new page. Navigation items should come from WordPress menu via `getMenuItems()`.

---

## 13. next.config.ts — Remote Images

WordPress serves images from its own domain. The Next.js config MUST allow remote image patterns:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
```

**Do NOT forget this.** Without it, `<Image src={wpImageUrl} />` will throw a runtime error.

---

## 14. What NOT to Do

### Content rules (MOST IMPORTANT)
- ❌ **NEVER hardcode headings, paragraphs, button labels, or ANY visible text in JSX** — all text comes from WordPress
- ❌ **NEVER paste text from a screenshot directly into JSX** — create it in WordPress first, then fetch via GraphQL
- ❌ **NEVER use hardcoded image paths** (`/images/hero.jpg`) — images come from WordPress media library via `featuredImage.node.sourceUrl`
- ❌ **NEVER hardcode phone numbers, emails, addresses, or URLs** — these come from WordPress page content or env vars
- ❌ **NEVER create "fallback content" with real business text** — if WP is down, show "WordPress Connection Needed", NOT fake content
- ❌ **NEVER put section heading text (e.g., "Our Services", "Testimonials") as string literals** — fetch section labels from WordPress

### Code rules
- ❌ Do NOT install `axios` — use native `fetch`
- ❌ Do NOT use `getServerSideProps` or `getStaticProps` — this is App Router, not Pages Router
- ❌ Do NOT create `pages/` directory — it will conflict with App Router
- ❌ Do NOT use `className` with template literals for Tailwind classes — Tailwind's JIT scanner won't pick them up reliably:
  ```ts
  // WRONG
  const color = isDark ? "bg-zinc-900" : "bg-white";
  className={`${color} p-4`}

  // CORRECT — conditionally apply full classes
  className={isDark ? "bg-zinc-900 p-4" : "bg-white p-4"}
  ```
- ❌ Do NOT add `"use client"` to `app/layout.tsx` — it breaks streaming/metadata
- ❌ Do NOT fetch data inside client components — data fetching belongs in server components or API routes
- ❌ Do NOT commit `.env.local` — it is gitignored; only `.env.example` is committed
- ❌ Do NOT use `any` type without a comment explaining why
- ❌ Do NOT create `tailwind.config.js` or `tailwind.config.ts` — Tailwind v4 does not use config files
- ❌ Do NOT put multiple sections inline in a single page file — extract each to `components/sections/`
- ❌ Do NOT use raw `<img>` tags — always use `next/image` `<Image>`
- ❌ Do NOT use raw `<a>` tags for internal links — always use `next/link` `<Link>`

---

## 15. Error Handling & Troubleshooting

### When things go wrong, SHOW the error — never hide it behind hardcoded content

| Problem | What to show | What NOT to do |
|---|---|---|
| WordPress unreachable | "WordPress Connection Needed" + setup instructions | Silently render hardcoded fallback page |
| Page slug not found in WP | "Page not found — create a page with slug `xyz` in WordPress" | Render a fake page with hardcoded text |
| GraphQL returns errors | Log the error, show a user-friendly error state | Ignore the error and show stale/hardcoded data |
| Featured image missing | Render section without image (no broken image icon) | Use a hardcoded placeholder image URL |
| SEO fields null | Use `page.title` as fallback for `seo.title` | Hardcode an SEO title |
| Env var missing | `fetchGraphQL` throws/warns clearly about which var is missing | Silently fail or use a default URL |

### Console logging
- **Always log GraphQL errors** with `console.error` — agents debugging later need to see what went wrong.
- **Log warnings** when optional data is missing (e.g., "No featured image found for page X").
- **Never swallow errors silently** — if something fails, it should be visible in the terminal/console.

---

## 16. WordPress Plugin Requirements

For this template to work, the WordPress site needs:
- **WPGraphQL** plugin (provides the `/graphql` endpoint)
- **RankMath** + **WPGraphQL for Rank Math SEO** bridge plugin (do NOT use the generic Yoast WPGraphQL SEO plugin)
- **firebase-form** custom plugin (provides `/wp-json/firebase-form/v1/submit` and `/wp-json/firebase-form/v1/settings`)
- **Design System Settings** plugin (provides `/wp-json/design-system/v1/settings` — manages branding, typography, colors, and UI tokens)

Plugin installation priority:
1. **WPGraphQL** — required for any content to appear
2. **Design System Settings** — install from `wordpress-plugins/design-system-settings.zip` in this repo
3. **RankMath + bridge** — required for SEO fields
4. **firebase-form** — required for contact form to save to WordPress

If plugins aren't installed:
- No WPGraphQL → site shows "WordPress Connection Needed"
- No Design System Settings → site uses hardcoded CSS defaults from `globals.css` (works fine)
- No RankMath → SEO fields will be null
- No firebase-form → contact form falls back to Firestore

---

## 17. Design System Settings Plugin

### Overview

The **Design System Settings** plugin (`wordpress-plugins/design-system-settings/`) provides a centralized WordPress admin page (Settings → Design System) where you configure the site's visual identity. All settings are exposed via a public REST API that the Next.js frontend consumes.

### Admin Page — 4 Tabs

| Tab | Settings |
|---|---|
| **Branding** | Logos (primary, dark, mobile, favicon), Site Title, Tagline, Footer Copyright, Social URLs (LinkedIn, Instagram, X, YouTube, Facebook, TikTok) |
| **Typography** | Primary/Secondary Font Family, H1–H6 settings (size desktop/tablet/mobile, weight, line-height, letter-spacing, text-transform, color), Body text (size, line-height, spacing), Link styles (color, hover, decoration) |
| **Colors** | Brand (primary, secondary, accent), Backgrounds (base, alternate, dark), Text (primary, secondary, light), Semantic (success, warning, error, info) |
| **UI Elements** | Button variants (primary, secondary, outline, text-only) with hover states, Form inputs (bg, border, radius, focus, placeholder), Shadows (small, medium, large) |

### REST API

```
GET /wp-json/design-system/v1/settings
```

- **Public** (no authentication required) — design tokens are not sensitive
- Returns the full settings object as JSON
- Used by `lib/design-system.ts` to generate CSS custom properties

### How it integrates with Next.js

```
WordPress Admin → Settings → Design System → Save
    ↓
wp_options (ds_settings)
    ↓
GET /wp-json/design-system/v1/settings (public REST API)
    ↓
lib/design-system.ts → getDesignSystemSettings() (fetched in layout.tsx, 60s cache)
    ↓
getDesignSystemCSS() → generates CSS custom properties string
    ↓
layout.tsx → <style id="design-system-tokens"> injected in <head>
    ↓
Overrides defaults in globals.css → components use the tokens
```

### Data fetching rules

- **Always use `getDesignSystemSettings()`** from `lib/design-system.ts` — never call the endpoint directly.
- **Fetch in `layout.tsx` only** — the root layout injects tokens globally. Individual pages do NOT need to fetch design settings.
- **For branding data** (logos, social URLs, footer text), fetch `getDesignSystemSettings()` in the component that needs it (e.g., Header, Footer) OR pass it down from layout.
- **Revalidation is 60 seconds** — design tokens change rarely.
- **Null-safe** — if the plugin isn't installed, `getDesignSystemSettings()` returns `null` and the hardcoded defaults in `globals.css` are used.

### CSS custom properties injected

The plugin injects these CSS variables (among others) that components should reference:

```css
/* Colors */
--color-brand-primary       /* Maps to brand primary color */
--color-brand-green          /* Backward-compatible alias */
--background                 /* Base background */
--foreground                 /* Primary text */
--color-bg-alternate         /* Alternate section background */
--color-brand-muted          /* Secondary/muted text */

/* Typography */
--body-font-size
--body-line-height
--link-color
--link-hover-color
--h1-size-desktop, --h1-size-tablet, --h1-size-mobile
--h1-weight, --h1-line-height, --h1-letter-spacing
/* ... same pattern for h2–h6 */

/* Buttons */
--btn-primary-bg, --btn-primary-text, --btn-primary-border-radius
--btn-primary-hover-bg, --btn-primary-hover-text
/* ... same pattern for secondary, outline, text-only */

/* Forms */
--input-bg, --input-border-color, --input-border-radius
--input-focus-color, --input-placeholder-color

/* Shadows */
--shadow-small, --shadow-medium, --shadow-large
```

### Using design tokens in components

```tsx
// ✅ CORRECT — use CSS variables
<button className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] 
  rounded-[var(--btn-primary-border-radius)] 
  hover:bg-[var(--btn-primary-hover-bg)]">
  {label}
</button>

// ✅ ALSO CORRECT — use the Tailwind token aliases
<div className="bg-brand-green text-brand-dark">{content}</div>

// ❌ WRONG — hardcoded colors
<button className="bg-green-500 text-black hover:bg-green-400">{label}</button>
```

### Installation (for new projects)

1. Go to WordPress Admin → Plugins → Add New → Upload Plugin
2. Upload `wordpress-plugins/design-system-settings.zip`
3. Activate the plugin
4. Go to Settings → Design System
5. Fill in all 4 tabs and save
6. Verify: visit `https://your-site.com/wp-json/design-system/v1/settings`

---

## 18. Quick Reference — Agent Checklist

Before submitting any code, verify:

- [ ] **No hardcoded visible text** — every string rendered to the user comes from WordPress
- [ ] **GraphQL query exists** in `lib/graphql.ts` for the page's data needs
- [ ] **SEO fields fetched** — `generateMetadata()` maps `seo.title`, `seo.description`, `seo.focusKeywords`
- [ ] **Null handled gracefully** — page shows "WordPress Connection Needed" when data is `null`
- [ ] **One component per file** — sections are in `components/sections/`, not inline
- [ ] **Components receive data via props** — no data fetching inside components
- [ ] **`"use client"` only where needed** — forms, sliders, scroll handlers
- [ ] **Images use `<Image>`** from `next/image`
- [ ] **Internal links use `<Link>`** from `next/link`
- [ ] **No `tailwind.config.js`** — Tailwind v4 is configured via CSS
- [ ] **`.env.example` updated** if new env vars were added
- [ ] **`next.config.ts` has remote image patterns** configured
- [ ] **Design tokens used** — colors, borders, shadows reference CSS variables from `globals.css` / design system, NOT hardcoded hex values
- [ ] **Branding data from WP** — logos, social URLs, footer copyright come from `getDesignSystemSettings()`, NOT hardcoded
