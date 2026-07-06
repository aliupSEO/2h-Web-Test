/**
 * lib/types.ts
 *
 * Shared TypeScript interfaces for WordPress data shapes.
 * All data returned by lib/graphql.ts should use these types.
 *
 * AGENT RULES:
 * - Add new interfaces here when querying new WordPress content types.
 * - Always type component props using these interfaces.
 * - Never use `any` — if the shape is unknown, create a proper interface.
 */

// ---------------------------------------------------------------------------
// WordPress SEO (RankMath via WPGraphQL bridge)
// ---------------------------------------------------------------------------

export interface WordPressSEO {
  title?: string;
  description?: string;
  focusKeywords?: string;
  canonicalUrl?: string;
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: {
      secureUrl?: string;
    };
  };
}

// ---------------------------------------------------------------------------
// WordPress Featured Image
// ---------------------------------------------------------------------------

export interface WordPressFeaturedImage {
  node: {
    sourceUrl: string;
  };
}

// ---------------------------------------------------------------------------
// WordPress Page
// ---------------------------------------------------------------------------

export interface WordPressPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: WordPressFeaturedImage | null;
  seo?: WordPressSEO | null;
}

// ---------------------------------------------------------------------------
// WordPress Post (services, projects, testimonials, blog)
// ---------------------------------------------------------------------------

export interface WordPressPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImage?: WordPressFeaturedImage | null;
  seo?: WordPressSEO | null;
}

// ---------------------------------------------------------------------------
// WordPress Menu Item
// ---------------------------------------------------------------------------

export interface WordPressMenuItem {
  id: string;
  label: string;
  uri: string;
}
