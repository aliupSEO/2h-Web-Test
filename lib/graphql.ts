/**
 * lib/graphql.ts
 *
 * Single source of truth for all WordPress data fetching.
 *
 * AGENT RULES:
 * - Always add new page queries as named export functions here.
 * - Never call the WP GraphQL endpoint directly from a page or component.
 * - Always include SEO fields (title, description, canonicalUrl, openGraph).
 * - revalidate is intentionally set to 1s — do not increase without good reason.
 */

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------

export async function fetchGraphQL(query: string, variables: Record<string, unknown> = {}) {
  const endpoint =
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
    (() => {
      throw new Error(
        "NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is not set. Add it to .env.local"
      );
    })();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    // ISR: revalidate every 1s so WordPress edits appear almost instantly
    // while providing a tiny buffer against server rate limits.
    next: { revalidate: 1 },
  });

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON response from WPGraphQL:", text.substring(0, 500));
    throw new Error(`Expected JSON from GraphQL endpoint but got HTML. Status: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error("GraphQL query returned errors — check the WP server logs.");
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// SEO fragment (reuse this in every query that needs SEO)
// ---------------------------------------------------------------------------

export const SEO_FIELDS = `
  seo {
    title
    description
    focusKeywords
    canonicalUrl
    robots
    openGraph {
      title
      description
      image {
        secureUrl
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Page query helpers
//
// AGENTS: Add new functions here following the same pattern.
// Each function fetches ONE page's content + SEO.
// ---------------------------------------------------------------------------

/** Home page (WordPress page with slug "home" or front page) */
export async function getHomePage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "home" }) {
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

/** Generic page by slug — use this for any page not needing custom logic */
export async function getPageBySlug(slug: string) {
  const data = await fetchGraphQL(
    `
    query GetPageBySlug($name: String!) {
      pages(where: { name: $name }) {
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
  `,
    { name: slug }
  );
  return data?.pages?.nodes?.[0] ?? null;
}

/** Contact page */
export async function getContactPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "contact" }) {
        nodes {
          id
          title
          content
          ${SEO_FIELDS}
        }
      }
    }
  `);
  return data?.pages?.nodes?.[0] ?? null;
}

/** About page */
export async function getAboutPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "about" }) {
        nodes {
          id
          title
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

// ---------------------------------------------------------------------------
// WordPress REST API helpers (non-GraphQL)
// ---------------------------------------------------------------------------

/**
 * Fetches contact form field definitions from the custom firebase-form plugin.
 * Returns null if the plugin isn't installed or the request fails.
 */
export async function getFormSettings() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_WORDPRESS_REST_URL not set — skipping form settings fetch.");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/wp-json/firebase-form/v1/settings`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }, // form config changes rarely
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching form settings:", error);
    return null;
  }
}

/**
 * Fetches the primary menu items from WPGraphQL.
 * Falls back to top-level pages if no menu items are registered.
 */
export async function getMenuItems() {
  const data = await fetchGraphQL(`
    query {
      menuItems(first: 10) {
        nodes {
          id
          label
          uri
        }
      }
    }
  `);

  if (data?.menuItems?.nodes && data.menuItems.nodes.length > 0) {
    return data.menuItems.nodes;
  }

  // Fallback: top-level pages as nav items
  const pagesData = await fetchGraphQL(`
    query {
      pages(first: 5) {
        nodes {
          id
          title
          uri
        }
      }
    }
  `);

  return (
    pagesData?.pages?.nodes?.map((page: { id: string; title: string; uri: string }) => ({
      id: page.id,
      label: page.title,
      uri: page.uri,
    })) ?? []
  );
}
