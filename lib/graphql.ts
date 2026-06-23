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
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
  if (!endpoint || endpoint.includes("your-wordpress-site.com")) {
    console.warn("WordPress GraphQL endpoint is not configured or is using placeholder. Skipping fetch.");
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Optional: WordPress Application Password auth
  const username = process.env.WORDPRESS_API_USERNAME;
  const password = process.env.WORDPRESS_API_PASSWORD;
  if (username && password) {
    const authString = Buffer.from(`${username}:${password}`).toString("base64");
    headers["Authorization"] = `Basic ${authString}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      // ISR: revalidate every 1s so WordPress edits appear almost instantly
      // while providing a tiny buffer against server rate limits.
      next: { revalidate: 1 },
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      console.warn("Non-JSON response from WPGraphQL:", text.substring(0, 200));
      return null;
    }

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("Failed to fetch from WPGraphQL:", error);
    return null;
  }
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
      menuItems(first: 50, where: { parentDatabaseId: 0 }) {
        nodes {
          id
          label
          uri
        }
      }
    }
  `);

  if (data?.menuItems?.nodes && data.menuItems.nodes.length > 0) {
    const uniqueItems: { id: string; label: string; uri: string }[] = [];
    const seen = new Set();
    
    for (const item of data.menuItems.nodes) {
      if (!seen.has(item.label)) {
        seen.add(item.label);
        uniqueItems.push(item);
      }
    }
    
    // WordPress returns them in reverse order when multiple menus are fetched without a location.
    // Reversing them restores the correct order: Startseite, Digitale Lösungen...
    return uniqueItems.reverse();
  }

  return [];
}

/**
 * Fetches projects from WordPress posts in the "projects" category.
 */
export async function getProjects() {
  const data = await fetchGraphQL(`
    query {
      posts(where: { categoryName: "projects" }) {
        nodes {
          title
          slug
          excerpt
          featuredImage { node { sourceUrl } }
        }
      }
    }
  `);
  
  if (!data?.posts?.nodes) return [];
  
  return data.posts.nodes.map((post: any) => ({
    title: decodeHtmlEntities(post.title),
    tags: decodeHtmlEntities(post.excerpt?.replace(/<[^>]*>?/gm, '') || "").trim(),
    link: `/projects/${post.slug}`,
    imageUrl: post.featuredImage?.node?.sourceUrl || ""
  }));
}

/**
 * Fetches testimonials from WordPress posts in the "testimonials" category.
 */
export async function getTestimonials() {
  const data = await fetchGraphQL(`
    query {
      posts(where: { categoryName: "testimonials" }) {
        nodes {
          title
          content
          excerpt
          featuredImage { node { sourceUrl } }
        }
      }
    }
  `);
  
  if (!data?.posts?.nodes) return [];
  
  return data.posts.nodes.map((post: any) => ({
    author: decodeHtmlEntities(post.title),
    role: decodeHtmlEntities(post.excerpt?.replace(/<[^>]*>?/gm, '') || "").trim(),
    text: decodeHtmlEntities(post.content?.replace(/<[^>]*>?/gm, '') || "").trim(),
    imageUrl: post.featuredImage?.node?.sourceUrl || ""
  }));
}

// ---------------------------------------------------------------------------
// Content parsers — utilities for extracting structured data from WordPress HTML
// ---------------------------------------------------------------------------

/**
 * Decode common HTML entities returned by WordPress REST/GraphQL.
 * WordPress content often contains encoded curly quotes, dashes, and ampersands.
 * Use this when extracting text from WordPress HTML for display.
 */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8217;/g, "\u2019")  // right single quote / apostrophe '
    .replace(/&#8216;/g, "\u2018")  // left single quote '
    .replace(/&#8220;/g, "\u201C")  // left double quote "
    .replace(/&#8221;/g, "\u201D")  // right double quote "
    .replace(/&#8211;/g, "\u2013")  // en dash –
    .replace(/&#8212;/g, "\u2014")  // em dash —
    .replace(/&#038;/g,  "&")       // ampersand
    .replace(/&amp;/g,   "&")
    .replace(/&lt;/g,    "<")
    .replace(/&gt;/g,    ">")
    .replace(/&quot;/g,  '"');
}

export interface HeroSectionData {
  subtitle: string;
  title: string;
  btnText: string;
  btnLink: string;
}

export function extractHeroSectionData(html: string): HeroSectionData | null {
  if (!html?.includes('hero-section')) return null;

  const subtitleMatch = html.match(/<div class="hero-subtitle">([\s\S]*?)<\/div>/);
  const titleMatch = html.match(/<div class="hero-title">([\s\S]*?)<\/div>/);
  const btnMatch = html.match(/<a class="hero-button" href="([\s\S]*?)">([\s\S]*?)<\/a>/);

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2] || ""),
  };
}

export interface AboutSectionData {
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  motto: string;
  btnText: string;
  btnLink: string;
  phoneText: string;
  phoneLink: string;
  imageUrl: string;
}

export function extractAboutSectionData(html: string): AboutSectionData | null {
  if (!html?.includes('about-section')) return null;
  
  const sectionHtml = html.split('<div class="about-section">')[1] || html;
  const extract = (regex: RegExp) => (sectionHtml.match(regex)?.[1] || "").trim();
  
  return {
    subtitle: decodeHtmlEntities(extract(/<div class="section-subtitle">(.*?)<\/div>/)),
    titleLine1: decodeHtmlEntities(extract(/<div class="section-title">\s*(?:<span>)?(.*?)(?:<\/span>)?\s*<br/i)),
    titleLine2: decodeHtmlEntities(extract(/<div class="section-title">.*?<br\s*\/?>\s*(.*?)<\/div>/i)),
    description: decodeHtmlEntities(extract(/<p class="description">(.*?)<\/p>/) || extract(/<p>(.*?)<\/p>/)),
    motto: decodeHtmlEntities(extract(/<h5 class="motto">(.*?)<\/h5>/) || extract(/<h5>(.*?)<\/h5>/)),
    btnText: decodeHtmlEntities(extract(/<a class="button-link"[^>]*>(.*?)<\/a>/) || extract(/<a class="button-1"[^>]*>(.*?)<\/a>/)),
    btnLink: extract(/<a class="button-link"[^>]*href="(.*?)"/) || extract(/<a class="button-1"[^>]*href="(.*?)"/),
    phoneText: decodeHtmlEntities(extract(/<a class="phone-link"[^>]*>(.*?)<\/a>/) || extract(/<a href="tel:[^>]*>(.*?)<\/a>/)),
    phoneLink: extract(/<a class="phone-link"[^>]*href="(.*?)"/) || extract(/<a href="(tel:.*?)"/),
    imageUrl: extract(/<img[^>]*class="about-image"[^>]*src="(.*?)"/) || extract(/<img[^>]*src="(.*?)"/),
  };
}

export interface ServiceItemData {
  title: string;
  description: string;
  link: string;
}

export interface ServicesSectionData {
  subtitle: string;
  title: string;
  services: ServiceItemData[];
}

export function extractServicesSectionData(html: string): ServicesSectionData | null {
  if (!html?.includes('services-section')) return null;

  const subtitleMatch = html.match(/<div class="services-section">[\s\S]*?<div class="section-subtitle">(.*?)<\/div>/);
  const titleMatch = html.match(/<div class="services-section">[\s\S]*?<div class="section-title">(.*?)<\/div>/);

  const services: ServiceItemData[] = [];
  const itemRegex = /<div class="service-item">[\s\S]*?<h5 class="service-title">(.*?)<\/h5>[\s\S]*?<p class="service-desc">(.*?)<\/p>[\s\S]*?<a class="service-link" href="(.*?)">/g;
  
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    services.push({
      title: decodeHtmlEntities(match[1]),
      description: decodeHtmlEntities(match[2]),
      link: match[3]
    });
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    services
  };
}

export interface ProjectItemData {
  tags: string;
  title: string;
  link: string;
  imageUrl: string;
}

export interface ProjectsSectionData {
  subtitle: string;
  title: string;
  projects: ProjectItemData[];
}

export function extractProjectsSectionData(html: string): ProjectsSectionData | null {
  if (!html?.includes('projects-section')) return null;

  const subtitleMatch = html.match(/<div class="projects-section">[\s\S]*?<div class="section-subtitle">(.*?)<\/div>/);
  const titleMatch = html.match(/<div class="projects-section">[\s\S]*?<div class="section-title">(.*?)<\/div>/);

  const projects: ProjectItemData[] = [];
  const itemRegex = /<div class="project-item">[\s\S]*?<h6 class="project-tags">(.*?)<\/h6>[\s\S]*?<h3 class="project-title">(.*?)<\/h3>[\s\S]*?<a class="project-link" href="(.*?)">[\s\S]*?<img[^>]*class="project-image"[^>]*src="(.*?)"/g;
  
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    projects.push({
      tags: decodeHtmlEntities(match[1]),
      title: decodeHtmlEntities(match[2]),
      link: match[3],
      imageUrl: match[4]
    });
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    projects
  };
}

export interface TestimonialItemData {
  text: string;
  author: string;
  role: string;
  imageUrl: string;
}

export interface TestimonialsSectionData {
  subtitle: string;
  title: string;
  testimonials: TestimonialItemData[];
}

export function extractTestimonialsSectionData(html: string): TestimonialsSectionData | null {
  if (!html?.includes('testimonials-section')) return null;

  const subtitleMatch = html.match(/<div class="testimonials-section">[\s\S]*?<div class="section-subtitle">(.*?)<\/div>/);
  const titleMatch = html.match(/<div class="testimonials-section">[\s\S]*?<div class="section-title">(.*?)<\/div>/);

  const testimonials: TestimonialItemData[] = [];
  const itemRegex = /<div class="testimonial-item">[\s\S]*?<p class="testimonial-text">(.*?)<\/p>[\s\S]*?<h6 class="testimonial-author">(.*?)<\/h6>[\s\S]*?<p class="testimonial-role">(.*?)<\/p>[\s\S]*?<img[^>]*class="testimonial-image"[^>]*src="(.*?)"/g;
  
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    testimonials.push({
      text: decodeHtmlEntities(match[1]),
      author: decodeHtmlEntities(match[2]),
      role: decodeHtmlEntities(match[3]),
      imageUrl: match[4]
    });
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    testimonials
  };
}

export interface NextStepSectionData {
  title: string;
  description: string;
  btnText: string;
  btnLink: string;
  features: string[];
  imageUrl: string;
}

export function extractNextStepSectionData(html: string): NextStepSectionData | null {
  if (!html?.includes('next-step-section')) return null;

  const sectionHtml = html.split('<div class="next-step-section">')[1] || html;

  const titleMatch = sectionHtml.match(/<h2 class="section-title">([\s\S]*?)<\/h2>/);
  const descMatch = sectionHtml.match(/<p class="description">([\s\S]*?)<\/p>/);
  const btnMatch = sectionHtml.match(/<a class="button-link" href="(.*?)">(.*?)<\/a>/);
  
  // Try to find an image inside next-step-section with the specific class first
  let imgMatch = sectionHtml.match(/<div class="next-step-section">[\s\S]*?<img[^>]*class="next-step-image"[^>]*src="(.*?)"/);
  
  // Fallback: Find any image that appears in the section HTML
  if (!imgMatch) {
    imgMatch = sectionHtml.match(/<img[^>]*src="(.*?)"/);
  }

  const features: string[] = [];
  const itemRegex = /<div class="feature-item">(.*?)<\/div>/g;
  
  let match;
  while ((match = itemRegex.exec(sectionHtml)) !== null) {
    // Strip any HTML tags that might have accidentally been placed inside the feature item (e.g. images)
    const rawText = match[1].replace(/<[^>]*>?/gm, '').trim();
    if (rawText) {
      features.push(decodeHtmlEntities(rawText));
    }
  }

  return {
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    description: decodeHtmlEntities(descMatch?.[1] || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2] || ""),
    features,
    imageUrl: imgMatch?.[1] || "",
  };
}

export interface FooterColumnLink {
  label: string;
  url: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterColumnLink[];
}

export interface FooterSectionData {
  btnText: string;
  btnLink: string;
  column2: FooterColumnData;
  column3: FooterColumnData;
  gameTitle: string;
}

export function extractFooterSectionData(html: string): FooterSectionData | null {
  if (!html?.includes('footer-section')) return null;

  const btnMatch = html.match(/<a class="footer-btn" href="(.*?)">(.*?)<\/a>/);
  
  const col2Title = html.match(/<div class="footer-col-2">[\s\S]*?<h4 class="footer-heading">(.*?)<\/h4>/);
  const col2Links: FooterColumnLink[] = [];
  const col2HtmlMatch = html.match(/<div class="footer-col-2">([\s\S]*?)<\/div>/);
  if (col2HtmlMatch) {
    const linkRegex = /<a class="footer-link" href="(.*?)">(.*?)<\/a>/g;
    let match;
    while ((match = linkRegex.exec(col2HtmlMatch[1])) !== null) {
      col2Links.push({ url: match[1], label: decodeHtmlEntities(match[2]) });
    }
  }

  const col3Title = html.match(/<div class="footer-col-3">[\s\S]*?<h4 class="footer-heading">(.*?)<\/h4>/);
  const col3Links: FooterColumnLink[] = [];
  const col3HtmlMatch = html.match(/<div class="footer-col-3">([\s\S]*?)<\/div>/);
  if (col3HtmlMatch) {
    const linkRegex = /<a class="footer-link" href="(.*?)">(.*?)<\/a>/g;
    let match;
    while ((match = linkRegex.exec(col3HtmlMatch[1])) !== null) {
      col3Links.push({ url: match[1], label: decodeHtmlEntities(match[2]) });
    }
  }

  const gameTitle = html.match(/<div class="footer-col-4">[\s\S]*?<h4 class="footer-heading">(.*?)<\/h4>/);

  return {
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2] || ""),
    column2: {
      title: decodeHtmlEntities(col2Title?.[1] || ""),
      links: col2Links
    },
    column3: {
      title: decodeHtmlEntities(col3Title?.[1] || ""),
      links: col3Links
    },
    gameTitle: decodeHtmlEntities(gameTitle?.[1] || "")
  };
}

export async function getFooterData() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "footer" }) {
        nodes {
          content
        }
      }
    }
  `);
  const html = data?.pages?.nodes?.[0]?.content;
  if (!html) return null;
  return extractFooterSectionData(html);
}
