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

/** Digitale Lösungen page */
export async function getDigitaleLosungenPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "digitale-losungen-2" }) {
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
          childItems {
            nodes {
              id
              label
              uri
            }
          }
        }
      }
    }
  `);

  if (data?.menuItems?.nodes && data.menuItems.nodes.length > 0) {
    const uniqueItems: { id: string; label: string; uri: string; childItems?: any }[] = [];
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
    .replace(/&quot;/g,  '"')
    .replace(/&nbsp;/gi, " ");
}

export interface HeroSectionData {
  subtitle: string;
  title: string;
  btnText: string;
  btnLink: string;
}

export function extractHeroSectionData(html: string): HeroSectionData | null {
  const sectionHtml = html.split('<!-- ABOUT SECTION -->')[0] || html;
  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="hero-subtitle">([\s\S]*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || sectionHtml.match(/<div class="hero-title">([\s\S]*?)<\/div>/i);
  const btnMatch = sectionHtml.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i) || sectionHtml.match(/<a class="hero-button" href="([\s\S]*?)">([\s\S]*?)<\/a>/i);

  if (!titleMatch && !subtitleMatch) return null;

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2]?.replace(/<[^>]*>?/gm, '').trim() || ""),
  };
}

export interface DigitaleHeroSectionData {
  subtitle: string;
  title: string;
  description: string;
  btnText: string;
  btnLink: string;
  imageUrl: string;
}

export function extractDigitaleHeroSectionData(html: string): DigitaleHeroSectionData | null {
  // Try to isolate the hero section (everything before the first <h3> or <h2>)
  const heroHtml = html.split(/<h[23]/i)[0] || html;

  // Subtitle can be an <h6> or the first <li> in a list
  const subtitleMatch = heroHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || heroHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
  const titleMatch = heroHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  // Find paragraphs that DO NOT contain links for the description
  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(heroHtml)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }

  const btnMatch = heroHtml.match(/<a[^>]*href="(.*?)"[^>]*>([\s\S]*?)<\/a>/i);
  const imgMatch = heroHtml.match(/<img[^>]*src="(.*?)"/i);

  if (!titleMatch) return null;

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || "DIGITALE"),
    title: decodeHtmlEntities(titleMatch?.[1] || "LÖSUNGEN"),
    description: decodeHtmlEntities(description),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2].replace(/<[^>]*>?/gm, '').trim() || ""),
    imageUrl: imgMatch?.[1] || "",
  };
}

export function extractDigitaleNextStepSectionData(html: string): NextStepSectionData | null {
  const h2Index = html.search(/<h2[^>]*>/i);
  if (h2Index === -1) return null;

  const beforeH2 = html.substring(0, h2Index);
  const afterH2 = html.substring(h2Index);

  const titleMatch = afterH2.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!titleMatch) return null;

  // Subtitle is usually the last <h6> or .section-subtitle before the <h2>
  let subtitleText = "";
  const h6Matches = [...beforeH2.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
  const divMatches = [...beforeH2.matchAll(/<div[^>]*class="section-subtitle"[^>]*>([\s\S]*?)<\/div>/gi)];
  const pMatches = [...beforeH2.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const liMatches = [...beforeH2.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  
  if (h6Matches.length > 0) {
    subtitleText = h6Matches[h6Matches.length - 1][1];
  } else if (divMatches.length > 0) {
    subtitleText = divMatches[divMatches.length - 1][1];
  } else if (liMatches.length > 0) {
    subtitleText = liMatches[liMatches.length - 1][1];
  } else if (pMatches.length > 0) {
    subtitleText = pMatches[pMatches.length - 1][1];
  }
  
  // Description is the first paragraph after the <h2>
  const descMatch = afterH2.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  
  // Button is the first link after the <h2>
  const btnMatch = afterH2.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
  
  // Image could be right before <h2> (Cover block) or after. 
  // Check after <h2> first, if not found, get the last image before <h2>.
  let imgMatch = afterH2.match(/<img[^>]*src=["'](.*?)["']/i);
  if (!imgMatch) {
    const beforeImages = [...beforeH2.matchAll(/<img[^>]*src=["'](.*?)["']/gi)];
    if (beforeImages.length > 0) {
      imgMatch = beforeImages[beforeImages.length - 1];
    }
  }

  const features: string[] = [];
  const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = listRegex.exec(afterH2)) !== null) {
    features.push(decodeHtmlEntities(match[1].replace(/<[^>]*>?/gm, '').trim()));
  }

  return {
    subtitle: decodeHtmlEntities(subtitleText?.replace(/<[^>]*>?/gm, '') || "Nächster Schritt"),
    title: decodeHtmlEntities(titleMatch?.[1]?.replace(/<[^>]*>?/gm, '') || ""),
    description: decodeHtmlEntities(descMatch?.[1]?.replace(/<[^>]*>?/gm, '') || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2]?.replace(/<[^>]*>?/gm, '') || ""),
    features,
    imageUrl: imgMatch?.[1] || "",
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
  let sectionHtml = html;
  if (html.includes('<!-- ABOUT SECTION -->')) {
    sectionHtml = html.split('<!-- ABOUT SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('about-section')) {
    sectionHtml = html.split('<div class="about-section">')[1] || html;
  } else {
    return null;
  }

  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="section-subtitle">(.*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">([\s\S]*?)<\/div>/i);
  
  const titleText = titleMatch?.[1] || "";
  let titleLine1 = titleText;
  let titleLine2 = "";
  if (titleText.toLowerCase().includes('<br')) {
      const parts = titleText.split(/<br\s*\/?>/i);
      titleLine1 = parts[0].replace(/<\/?span>/g, '').trim();
      titleLine2 = parts[1].trim();
  } else {
      const parts = titleText.split('<br');
      titleLine1 = parts[0].replace(/<\/?span>/g, '').trim();
  }

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }
  if (!description) {
      description = sectionHtml.match(/<p class="description">(.*?)<\/p>/i)?.[1] || "";
  }

  const mottoMatch = sectionHtml.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i);
  
  const links = [...sectionHtml.matchAll(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  let btnLink = "", btnText = "", phoneLink = "", phoneText = "";
  for (const match of links) {
      if (match[1].startsWith('tel:')) {
          phoneLink = match[1];
          phoneText = match[2].replace(/<[^>]*>?/gm, '').trim();
      } else if (!btnLink) {
          btnLink = match[1];
          btnText = match[2].replace(/<[^>]*>?/gm, '').trim();
      }
  }

  const imgMatch = sectionHtml.match(/<img[^>]*src=["'](.*?)["']/i);

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    titleLine1: decodeHtmlEntities(titleLine1),
    titleLine2: decodeHtmlEntities(titleLine2),
    description: decodeHtmlEntities(description),
    motto: decodeHtmlEntities(mottoMatch?.[1] || ""),
    btnText: decodeHtmlEntities(btnText),
    btnLink: btnLink,
    phoneText: decodeHtmlEntities(phoneText),
    phoneLink: phoneLink,
    imageUrl: imgMatch?.[1] || "",
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
  let sectionHtml = html;
  if (html.includes('<!-- SERVICES SECTION -->')) {
    sectionHtml = html.split('<!-- SERVICES SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('services-section')) {
    sectionHtml = html.split('<div class="services-section">')[1] || html;
  } else {
    return null;
  }

  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="section-subtitle">(.*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);

  const services: ServiceItemData[] = [];
  const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  
  if (h3Matches.length > 0) {
      for (let i = 0; i < h3Matches.length; i++) {
          const startIndex = h3Matches[i].index + h3Matches[i][0].length;
          const endIndex = i + 1 < h3Matches.length ? h3Matches[i+1].index : sectionHtml.length;
          const block = sectionHtml.substring(startIndex, endIndex);
          
          let desc = "";
          const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
          let pMatch;
          while ((pMatch = pRegex.exec(block)) !== null) {
            if (!pMatch[1].includes('<a')) {
              desc = pMatch[1];
              break;
            }
          }
          
          const aMatch = block.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
          
          services.push({
              title: decodeHtmlEntities(h3Matches[i][1]),
              description: decodeHtmlEntities(desc),
              link: aMatch ? aMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="service-item">[\s\S]*?<h5 class="service-title">(.*?)<\/h5>[\s\S]*?<p class="service-desc">(.*?)<\/p>[\s\S]*?<a class="service-link" href="(.*?)">/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        services.push({
          title: decodeHtmlEntities(match[1]),
          description: decodeHtmlEntities(match[2]),
          link: match[3]
        });
      }
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
  let sectionHtml = html;
  if (html.includes('<!-- PROJECTS SECTION -->')) {
    sectionHtml = html.split('<!-- PROJECTS SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('projects-section')) {
    sectionHtml = html.split('<div class="projects-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  const subtitleMatch = beforeH2.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || beforeH2.match(/<div class="section-subtitle">(.*?)<\/div>/i);

  const projects: ProjectItemData[] = [];
  const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  
  if (h3Matches.length > 0) {
      for (let i = 0; i < h3Matches.length; i++) {
          const title = h3Matches[i][1];
          const prevIndex = i > 0 ? (h3Matches[i-1].index! + h3Matches[i-1][0].length) : (titleMatch?.index !== undefined ? titleMatch.index + titleMatch[0].length : 0);
          const blockBefore = sectionHtml.substring(prevIndex, h3Matches[i].index!);
          const tagsMatches = [...blockBefore.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
          const tags = tagsMatches.length > 0 ? tagsMatches[tagsMatches.length - 1][1] : "";
          
          const startIndex = h3Matches[i].index! + h3Matches[i][0].length;
          const endIndex = i + 1 < h3Matches.length ? h3Matches[i+1].index! : sectionHtml.length;
          const blockAfter = sectionHtml.substring(startIndex, endIndex);
          
          const aMatch = blockAfter.match(/<a[^>]*href=["'](.*?)["']/i);
          const imgMatch = blockAfter.match(/<img[^>]*src=["'](.*?)["']/i);
          
          projects.push({
              title: decodeHtmlEntities(title),
              tags: decodeHtmlEntities(tags),
              link: aMatch ? aMatch[1] : "",
              imageUrl: imgMatch ? imgMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="project-item">[\s\S]*?<h6 class="project-tags">(.*?)<\/h6>[\s\S]*?<h3 class="project-title">(.*?)<\/h3>[\s\S]*?<a class="project-link" href="(.*?)">[\s\S]*?<img[^>]*class="project-image"[^>]*src="(.*?)"/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        projects.push({
          tags: decodeHtmlEntities(match[1]),
          title: decodeHtmlEntities(match[2]),
          link: match[3],
          imageUrl: match[4]
        });
      }
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
  let sectionHtml = html;
  if (html.includes('<!-- TESTIMONIALS SECTION -->')) {
    sectionHtml = html.split('<!-- TESTIMONIALS SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('testimonials-section')) {
    sectionHtml = html.split('<div class="testimonials-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  const subtitleMatch = beforeH2.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || beforeH2.match(/<div class="section-subtitle">(.*?)<\/div>/i);

  const testimonials: TestimonialItemData[] = [];
  const afterH2Str = titleMatch && titleMatch.index !== undefined ? sectionHtml.substring(titleMatch.index + titleMatch[0].length) : sectionHtml;
  const h6Matches = [...afterH2Str.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)]; 
  
  if (h6Matches.length > 0 && html.includes('<!-- TESTIMONIALS SECTION -->')) {
      for (let i = 0; i < h6Matches.length; i++) {
          const author = h6Matches[i][1];
          const prevIndex = i > 0 ? h6Matches[i-1].index! + h6Matches[i-1][0].length : 0;
          const blockBefore = afterH2Str.substring(prevIndex, h6Matches[i].index!);
          const pMatches = [...blockBefore.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
          let text = "";
          for (let j = pMatches.length - 1; j >= 0; j--) {
             if (!pMatches[j][1].includes('<img') && !pMatches[j][1].includes('<a')) {
                 text = pMatches[j][1];
                 break;
             }
          }
          
          const startIndex = h6Matches[i].index! + h6Matches[i][0].length;
          const endIndex = i + 1 < h6Matches.length ? h6Matches[i+1].index! : afterH2Str.length;
          const blockAfter = afterH2Str.substring(startIndex, endIndex);
          
          const roleMatch = blockAfter.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          const imgMatch = blockAfter.match(/<img[^>]*src=["'](.*?)["']/i);
          
          testimonials.push({
              author: decodeHtmlEntities(author),
              text: decodeHtmlEntities(text),
              role: decodeHtmlEntities(roleMatch ? roleMatch[1] : ""),
              imageUrl: imgMatch ? imgMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="testimonial-item">[\s\S]*?<p class="testimonial-text">(.*?)<\/p>[\s\S]*?<h6 class="testimonial-author">(.*?)<\/h6>[\s\S]*?<p class="testimonial-role">(.*?)<\/p>[\s\S]*?<img[^>]*class="testimonial-image"[^>]*src="(.*?)"/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        testimonials.push({
          text: decodeHtmlEntities(match[1]),
          author: decodeHtmlEntities(match[2]),
          role: decodeHtmlEntities(match[3]),
          imageUrl: match[4]
        });
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    testimonials
  };
}

export interface NextStepSectionData {
  subtitle: string;
  title: string;
  description: string;
  btnText: string;
  btnLink: string;
  features: string[];
  imageUrl: string;
}

export function extractNextStepSectionData(html: string): NextStepSectionData | null {
  let sectionHtml = html;
  if (html.includes('<!-- NEXT STEP SECTION -->')) {
    sectionHtml = html.split('<!-- NEXT STEP SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('next-step-section')) {
    sectionHtml = html.split('<div class="next-step-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<h2 class="section-title">([\s\S]*?)<\/h2>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch && titleMatch.index !== undefined) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  
  let subtitleText = "";
  const h6Matches = [...beforeH2.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
  const divMatches = [...beforeH2.matchAll(/<div[^>]*class="section-subtitle"[^>]*>([\s\S]*?)<\/div>/gi)];
  const liMatches = [...beforeH2.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  
  if (h6Matches.length > 0) {
    subtitleText = h6Matches[h6Matches.length - 1][1];
  } else if (divMatches.length > 0) {
    subtitleText = divMatches[divMatches.length - 1][1];
  } else if (liMatches.length > 0) {
    subtitleText = liMatches[liMatches.length - 1][1];
  }

  const afterH2 = titleMatch && titleMatch.index !== undefined ? sectionHtml.substring(titleMatch.index + titleMatch[0].length) : sectionHtml;

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(afterH2)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }
  if (!description) {
      description = afterH2.match(/<p class="description">([\s\S]*?)<\/p>/i)?.[1] || "";
  }

  const btnMatch = afterH2.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
  let imgMatch = afterH2.match(/<img[^>]*src=["'](.*?)["']/i);
  if (!imgMatch) {
    const beforeImages = [...beforeH2.matchAll(/<img[^>]*src=["'](.*?)["']/gi)];
    if (beforeImages.length > 0) {
      imgMatch = beforeImages[beforeImages.length - 1];
    }
  }

  const features: string[] = [];
  if (sectionHtml.includes('<li')) {
      const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      while ((match = listRegex.exec(afterH2)) !== null) {
        features.push(decodeHtmlEntities(match[1].replace(/<[^>]*>?/gm, '').trim()));
      }
  } else {
      const itemRegex = /<div class="feature-item">(.*?)<\/div>/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        const rawText = match[1].replace(/<[^>]*>?/gm, '').trim();
        const decoded = decodeHtmlEntities(rawText).trim();
        if (decoded && decoded !== '') {
          features.push(decoded);
        }
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleText || "Nächster Schritt"),
    title: decodeHtmlEntities(titleMatch?.[1]?.replace(/<[^>]*>?/gm, '') || ""),
    description: decodeHtmlEntities(description?.replace(/<[^>]*>?/gm, '') || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2]?.replace(/<[^>]*>?/gm, '') || ""),
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

export interface DigitaleServiceData {
  title: string;
  link: string;
  imageUrl: string;
}

export function extractDigitaleServicesData(html: string): DigitaleServiceData[] {
  const parts = html.split(/Kostenloses Erstgespräch vereinbaren.*?<\/p>/i);
  const servicesHtml = parts.length > 1 ? parts[1].split(/<h2[^>]*>Kein großer Aufwand/i)[0] : "";

  const services: DigitaleServiceData[] = [];
  
  // Look for an optional image, followed by a heading/paragraph containing an <a> tag
  const regex = /(?:<figure[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<\/figure>\s*)?(?:<h3[^>]*>|<p[^>]*>)([\s\S]*?)(?:<\/h3>|<\/p>)/gi;

  let match;
  while ((match = regex.exec(servicesHtml)) !== null) {
    const imageUrl = match[1] || "";
    const innerHtml = match[2];
    
    if (!innerHtml.includes('<a')) continue;
    
    const linkMatch = innerHtml.match(/href="([^"]+)"/i);
    const link = linkMatch ? linkMatch[1] : "";
    
    let title = innerHtml.replace(/<a[^>]*><\/a>/g, '');
    title = title.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    title = title.replace(/&amp;/g, '&');
    
    if (title) {
      services.push({ title, link, imageUrl });
    }
  }

  return services;
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

// ---------------------------------------------------------------------------
// Wir Page specific helpers
// ---------------------------------------------------------------------------

/** Wir page (WordPress page with slug "wir") */
export async function getWirPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "wir" }) {
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

export interface TeamMemberData {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface TeamSectionData {
  title: string;
  members: TeamMemberData[];
}

export function extractTeamSectionData(html: string): TeamSectionData | null {
  if (!html?.includes('team-section')) return null;

  const titleMatch = html.match(/<div class="team-section">[\s\S]*?<h2 class="section-title">(.*?)<\/h2>/);
  const members: TeamMemberData[] = [];
  const memberRegex = /<div class="team-member">[\s\S]*?<h5 class="member-name">(.*?)<\/h5>[\s\S]*?<p class="member-role">(.*?)<\/p>[\s\S]*?<p class="member-bio">(.*?)<\/p>[\s\S]*?<img[^>]*class="member-image"[^>]*src="(.*?)"/g;

  let match;
  while ((match = memberRegex.exec(html)) !== null) {
    members.push({
      name: decodeHtmlEntities(match[1]),
      role: decodeHtmlEntities(match[2]),
      bio: decodeHtmlEntities(match[3]),
      imageUrl: match[4]
    });
  }

  return {
    title: decodeHtmlEntities(titleMatch?.[1] || "Starke Partner"),
    members
  };
}

export interface OfficeSectionData {
  title: string;
  description: string;
  imageUrl: string;
}

export function extractOfficeSectionData(html: string): OfficeSectionData | null {
  if (!html?.includes('office-section')) return null;

  const sectionHtml = html.split('<div class="office-section">')[1] || html;
  const titleMatch = sectionHtml.match(/<h2 class="section-title">([\s\S]*?)<\/h2>/);
  const descMatch = sectionHtml.match(/<p class="description">([\s\S]*?)<\/p>/);
  const imgMatch = sectionHtml.match(/<img[^>]*class="office-image"[^>]*src="(.*?)"/);

  return {
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    description: decodeHtmlEntities(descMatch?.[1] || ""),
    imageUrl: imgMatch?.[1] || ""
  };
}

