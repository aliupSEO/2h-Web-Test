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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GraphQL Error:", errorText);
      throw new Error(`GraphQL Error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL JSON Errors:", json.errors);
      throw new Error("GraphQL JSON Errors");
    }

    return json.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
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
    const reversedItems = uniqueItems.reverse();
    for (const item of reversedItems) {
      if (item.childItems?.nodes) {
        item.childItems.nodes.reverse();
      }
    }
    return reversedItems;
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
  descriptionHtml?: string;
  description?: string;
  btnText: string;
  btnLink: string;
}

export function extractHeroSectionData(html: string): HeroSectionData | null {
  const sectionHtml = html.split('<!-- ABOUT SECTION -->')[0] || html;
  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="hero-subtitle">([\s\S]*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || sectionHtml.match(/<div class="hero-title">([\s\S]*?)<\/div>/i);
  const btnMatch = sectionHtml.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i) || sectionHtml.match(/<a class="hero-button" href="([\s\S]*?)">([\s\S]*?)<\/a>/i);

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
    if (!pMatch[1].includes('<a')) {
      // Strip actual HTML comments and encoded HTML comments to see if there's real text
      const cleanText = pMatch[1]
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/&lt;!--[\s\S]*?--&gt;/g, '')
        .trim();
      
      if (cleanText.length > 0) {
        description = cleanText;
        break;
      }
    }
  }

  if (!titleMatch && !subtitleMatch) return null;

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    description: decodeHtmlEntities(description),
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
  contentHtml?: string;
  list1?: string[];
  motto: string;
  list2?: string[];
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
  
  let list1: string[] = [];
  let list2: string[] = [];
  const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  const lists = [...sectionHtml.matchAll(ulRegex)];
  const extractLis = (ulHtml: string) => {
    return [...ulHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => decodeHtmlEntities(m[1].replace(/<[^>]*>?/gm, '').trim()));
  };
  if (lists.length > 0) {
    list1 = extractLis(lists[0][1]);
  }
  if (lists.length > 1) {
    list2 = extractLis(lists[1][1]);
  }

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
    list1: list1,
    motto: decodeHtmlEntities(mottoMatch?.[1] || ""),
    list2: list2,
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
  imageUrl?: string;
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

  let subtitleMatch = sectionHtml.match(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/i) || sectionHtml.match(/<div class="section-subtitle">([\s\S]*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/i) || sectionHtml.match(/<div class="section-title">([\s\S]*?)<\/div>/i);

  const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  
  let subtitleText = subtitleMatch ? subtitleMatch[1].trim() : "";

  // Fallback: If no h4-h6 or section-subtitle (or if it's empty), use the first paragraph after the title
  if (!subtitleText) {
    const titleEndIndex = titleMatch && titleMatch.index !== undefined ? titleMatch.index + titleMatch[0].length : 0;
    const firstServiceIndex = h3Matches.length > 0 && h3Matches[0].index !== undefined
      ? h3Matches[0].index 
      : (sectionHtml.indexOf('<div class="service-item">') > -1 ? sectionHtml.indexOf('<div class="service-item">') : sectionHtml.length);
    
    const searchArea = sectionHtml.substring(titleEndIndex, firstServiceIndex);
    const pMatch = searchArea.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      subtitleText = pMatch[1].trim();
    }
  }

  const services: ServiceItemData[] = [];
  
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

  const imgMatch = sectionHtml.match(/<img[^>]*src=["'](.*?)["']/i);
  let imgUrl = imgMatch ? imgMatch[1] : undefined;
  if (imgUrl) {
    // Remove WP size suffixes like -300x200 to get the full-res image
    imgUrl = imgUrl.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
  }

  return {
    subtitle: decodeHtmlEntities(subtitleText || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    services,
    imageUrl: imgUrl
  };
}

export interface TeamMemberData {
  title: string;
  paragraphs: string[];
  bio: string;
  image: string;
}

export interface TeamSectionData {
  members: TeamMemberData[];
}

export function extractTeamSectionData(html: string): TeamSectionData | null {
  const teamSection = html.split('<div class="team-section">')[1]?.split('MITTEN IN WIEN-MARIAHILF')[0];
  if (!teamSection) return null;

  const chunks = teamSection.split('<h2 class="elementor-heading-title elementor-size-default">');
  chunks.shift(); // remove the part before the first h2

  const members = chunks.map(chunk => {
    const titleMatch = chunk.match(/^(.*?)<\/h2>/);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : '';

    const paragraphs = [...chunk.matchAll(/<p[^>]*>(.*?)<\/p>/gi)]
      .map(m => decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').trim()))
      .filter(text => text && !text.includes('Gründer') && !text.includes('Externer Partner') && text !== '&nbsp;');

    const bioMatch = chunk.match(/<p class="member-bio">(.*?)<\/p>/) || chunk.match(/<figcaption[^>]*>(.*?)<\/figcaption>/);
    const bio = bioMatch ? decodeHtmlEntities(bioMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    
    const imgMatch = chunk.match(/<img[^>]*src=["'](.*?)["']/);
    let image = imgMatch ? imgMatch[1] : '';
    if (image) {
      image = image.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
    }

    return { title, paragraphs, bio, image };
  }).filter(m => m.title); // filter out empty remaining chunks

  return { members };
}

export interface OfficeSectionData {
  title: string;
  paragraphs: string[];
  imageUrl: string;
}

export function extractOfficeSectionData(html: string): OfficeSectionData | null {
  const titleMatch = html.match(/<h2 class="elementor-heading-title elementor-size-default">MITTEN IN WIEN-MARIAHILF ZU HAUSE<\/h2>/);
  if (!titleMatch) return null;

  const sectionHtml = html.split('<h2 class="elementor-heading-title elementor-size-default">MITTEN IN WIEN-MARIAHILF ZU HAUSE</h2>')[1]?.split('<!-- NEXT STEP SECTION -->')[0] || '';

  const paragraphs = [...sectionHtml.matchAll(/<p[^>]*>(.*?)<\/p>/gi)]
    .map(m => decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').trim()))
    .filter(text => text && !text.includes('<img'));

  const imgMatch = sectionHtml.match(/<img[^>]*src=["'](.*?)["']/);
  let imageUrl = imgMatch ? imgMatch[1] : '';
  if (imageUrl) {
    imageUrl = imageUrl.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
  }

  return {
    title: "MITTEN IN WIEN-MARIAHILF ZU HAUSE",
    paragraphs,
    imageUrl
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

export interface PortfolioItemData {
  imageUrl: string;
  title: string;
  link?: string;
}

export interface PortfolioPageData {
  subtitle: string;
  title: string;
  description: string;
  items: PortfolioItemData[];
  imageUrl?: string;
}

export function extractPortfolioPageData(html: string): PortfolioPageData | null {
  const h2Index = html.search(/<h2[^>]*>/i);
  if (h2Index === -1) return null;

  const beforeH2 = html.substring(0, h2Index);
  const afterH2 = html.substring(h2Index);

  const titleMatch = afterH2.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!titleMatch) return null;

  let subtitleText = "";
  const h6Matches = [...beforeH2.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
  const divMatches = [...beforeH2.matchAll(/<div[^>]*class="section-subtitle"[^>]*>([\s\S]*?)<\/div>/gi)];
  if (h6Matches.length > 0) {
    subtitleText = h6Matches[h6Matches.length - 1][1];
  } else if (divMatches.length > 0) {
    subtitleText = divMatches[divMatches.length - 1][1];
  }

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(afterH2)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }

  const items: PortfolioItemData[] = [];
  
  // Split by either wrapper class
  const parts = html.split(/<div class="(?:portfolio-item|item)">/i);
  parts.shift(); // Remove content before first wrapper
  
  parts.forEach(part => {
    const imgMatch = part.match(/<img[^>]*?src=["'](.*?)["']/i);
    const itemTitleMatch = part.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
    const linkMatch = part.match(/<a[^>]*?href=["'](.*?)["']/i);
    
    if (imgMatch) {
      let rawTitle = itemTitleMatch ? itemTitleMatch[1] : '';
      // Clean up title (remove spans, decode entities)
      rawTitle = decodeHtmlEntities(rawTitle.replace(/<[^>]*>?/gm, '')).trim();
      
      // Fallback for missing title if image has name (like shimale)
      if (!rawTitle) {
        if (imgMatch[1].toLowerCase().includes('shimale')) {
          rawTitle = 'Shimale Peleg';
        }
      }
      
      items.push({
        imageUrl: imgMatch[1].replace(/-\d+x\d+(?=\.[a-zA-Z]+(?:$|\?))/i, ''),
        title: rawTitle,
        link: linkMatch ? linkMatch[1] : undefined
      });
    }
  });

  return {
    subtitle: decodeHtmlEntities(subtitleText?.replace(/<[^>]*>?/gm, '') || ""),
    title: decodeHtmlEntities(titleMatch?.[1]?.replace(/<[^>]*>?/gm, '') || ""),
    description: decodeHtmlEntities(description),
    items
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
  } else if (html.match(/KUNDENSTIMMEN/i)) {
    const match = html.match(/KUNDENSTIMMEN/i);
    sectionHtml = html.substring(Math.max(0, match!.index! - 500));
    const nextSectionIdx = sectionHtml.indexOf('<section', 10);
    if (nextSectionIdx !== -1) sectionHtml = sectionHtml.substring(0, nextSectionIdx);
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
  
  if (h6Matches.length > 0) {
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
  } else if (html.match(/Wie viele Anfragen/i)) {
    const match = html.match(/Wie viele Anfragen/i);
    sectionHtml = html.substring(Math.max(0, match!.index! - 500));
    const nextSectionIdx = sectionHtml.indexOf('<section', 10);
    if (nextSectionIdx !== -1) sectionHtml = sectionHtml.substring(0, nextSectionIdx);
  } else if (html.match(/Was ist bei Ihnen/i)) {
    const match = html.match(/Was ist bei Ihnen/i);
    sectionHtml = html.substring(Math.max(0, match!.index! - 500));
    const nextSectionIdx = sectionHtml.indexOf('<section', 10);
    if (nextSectionIdx !== -1) sectionHtml = sectionHtml.substring(0, nextSectionIdx);
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
    const divMatch = afterH2.match(/<div class="elementor-widget-container">([^<]+)<\/div>/i);
    if (divMatch && divMatch[1].trim().length > 10) {
      description = divMatch[1].trim();
    }
  }
  if (!description) {
      description = afterH2.match(/<p class="description">([\s\S]*?)<\/p>/i)?.[1] || "";
  }
  if (!description) {
      const divHeadingMatch = afterH2.match(/<div[^>]*elementor-heading-title[^>]*>([\s\S]*?)<\/div>/i);
      if (divHeadingMatch && divHeadingMatch[1].trim().length > 10) {
          description = divHeadingMatch[1].trim();
      }
  }

  const btnMatch = afterH2.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
  let imgMatch = afterH2.match(/<img[^>]*src=["'](.*?)["']/i);
  if (!imgMatch) {
    const beforeImages = [...beforeH2.matchAll(/<img[^>]*src=["'](.*?)["']/gi)];
    if (beforeImages.length > 0) {
      imgMatch = beforeImages[beforeImages.length - 1];
    }
  }

  let imageUrl = imgMatch?.[1] || "";
  if (imageUrl) {
      imageUrl = imageUrl.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
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
    imageUrl: imageUrl,
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



export interface ContactPageData {
  imageUrl?: string;
  subtitle: string;
  title: string;
  description: string;
  emailTitle?: string;
  email: string;
  phoneTitle?: string;
  phone: string;
  addressTitle?: string;
  address: string;
  locationTitle?: string;
  location?: string;
  formTitle?: string;
  mapTitle?: string;
  submitLabel?: string;
  fields?: { id: string; label: string; type: string; required?: boolean; placeholder?: string; }[];
}

export function extractKontaktPageData(html: string): ContactPageData {
  const fields: { id: string; label: string; type: string; required?: boolean; placeholder?: string; }[] = [];
  
  // Extract fields from fluent forms structure or similar
  const groupRegex = /<div class="ff-form-group">([\s\S]*?)<\/div>/gi;
  let submitLabel = "Send Message";
  let match;
  while ((match = groupRegex.exec(html)) !== null) {
    const groupHtml = match[1];
    if (groupHtml.includes('type="submit"')) {
      const btnMatch = groupHtml.match(/<button[^>]*type=["']submit["'][^>]*>([\s\S]*?)<\/button>/i);
      if (btnMatch) submitLabel = btnMatch[1].trim();
      continue;
    }
    
    const labelMatch = groupHtml.match(/<label[^>]*>([\s\S]*?)<\/label>/i);
    let label = labelMatch ? labelMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
    label = label.replace(/\*$/, '').trim(); 
    const required = groupHtml.includes('required');
    
    let type = "text";
    let id = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let placeholder = label;
    
    if (groupHtml.includes('<textarea')) {
      type = "textarea";
      const nameMatch = groupHtml.match(/<textarea[^>]*name=["'](.*?)["']/i);
      if (nameMatch) id = nameMatch[1];
      const placeholderMatch = groupHtml.match(/<textarea[^>]*placeholder=["'](.*?)["']/i);
      if (placeholderMatch) placeholder = placeholderMatch[1];
    } else {
      const inputMatch = groupHtml.match(/<input[^>]*type=["'](.*?)["'][^>]*name=["'](.*?)["']/i);
      if (inputMatch) {
        type = inputMatch[1];
        id = inputMatch[2];
      }
      const placeholderMatch = groupHtml.match(/<input[^>]*placeholder=["'](.*?)["']/i);
      if (placeholderMatch) placeholder = placeholderMatch[1];
    }
    
    if (label || placeholder) {
      fields.push({ id, label: label || placeholder, type, required, placeholder });
    }
  }

  // Parse structured data from WP HTML
  const getMatch = (regex: RegExp) => {
    const m = html.match(regex);
    return m ? decodeHtmlEntities(m[1].replace(/<[^>]*>?/gm, '').trim()) : undefined;
  };

  const subtitle = getMatch(/<div class="section-subtitle"[^>]*>([\s\S]*?)<\/div>/i) || "Kontakt";
  const title = getMatch(/<h1 class="section-title"[^>]*>([\s\S]*?)<\/h1>/i) || "Lass uns über dein Projekt sprechen";
  const description = getMatch(/<p class="section-desc"[^>]*>([\s\S]*?)<\/p>/i) || "Wir freuen uns auf deine Nachricht.";
  
  const imgMatch = html.match(/<div class="contact-image"[^>]*>[\s\S]*?<img[^>]*src=["'](.*?)["']/i) || html.match(/<img[^>]*src=["'](.*?)["']/i);
  const imageUrl = imgMatch ? imgMatch[1] : undefined;

  const emailTitle = getMatch(/<div class="contact-method email"[^>]*>[\s\S]*?<h5[^>]*>([\s\S]*?)<\/h5>/i) || "e-Mail";
  const email = getMatch(/<div class="contact-method email"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || "office@2h-websolutions.at";

  let locationTitle = getMatch(/<div class="contact-method location"[^>]*>[\s\S]*?<h5[^>]*>([\s\S]*?)<\/h5>/i);
  const address = getMatch(/<div class="contact-method location"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || "Wien, Österreich";

  const phoneTitle = getMatch(/<div class="contact-method phone"[^>]*>[\s\S]*?<h5[^>]*>([\s\S]*?)<\/h5>/i) || "Einfach anrufen";
  const phone = getMatch(/<div class="contact-method phone"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || "+43 676 450 85 79";

  let formTitle = getMatch(/<div class="contact-form"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);
  let mapTitle = undefined;

  // Fallback for unstructured text added via Gutenberg paragraphs at the end of the content
  const allParagraphs = Array.from(html.matchAll(/<p class="wp-block-paragraph">([\s\S]*?)<\/p>/gi))
    .map(m => decodeHtmlEntities(m[1].replace(/<[^>]*>?/gm, '').trim()))
    .filter(Boolean);
    
  if (allParagraphs.length >= 2) {
    if (!formTitle) formTitle = allParagraphs[allParagraphs.length - 2];
    mapTitle = allParagraphs[allParagraphs.length - 1];
  }
  
  // Set defaults if still empty
  locationTitle = locationTitle || "Der Standort";

  return {
    subtitle,
    title,
    description,
    emailTitle,
    email,
    locationTitle,
    address,
    location: address,
    phoneTitle,
    phone,
    formTitle,
    mapTitle,
    submitLabel,
    imageUrl,
    fields: fields.length > 0 ? fields : undefined
  };
}

export interface SeoHeroData {
  subtitle: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  bulletPoints?: string[];
  tickerText?: string;
}

export interface SeoSectionData {
  type: string;
  data?: any;
  html?: string;
}



export interface SeoPageData {
  heroData: SeoHeroData;
  sections: SeoSectionData[];
}

export function extractSeoPageData(html: string): SeoPageData {
  let content = html;
  
  // Convert Elementor icon list widgets into standard section subtitles (safely consuming all trailing closing divs up to the next h2)
  content = content.replace(/<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?(?=<h2)/gi, '<div class="section-subtitle">$1</div>\n');
  
  if (html.includes('class="next-step-section"')) {
    const parts = html.split(/<div[^>]*class="next-step-section"[^>]*>/);
    content = parts[0];
  }

  // Support for Elementor icon-list widgets used as subtitles
  content = content.replace(/<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/div>/gi, '<div class="section-subtitle">$1</div>');

  let heroData: SeoHeroData = {} as any;
  const sections: SeoSectionData[] = [];
  
  const h2Split = content.split(/(?=<h2)/i);
  if (h2Split.length > 0) {
    const heroHtml = h2Split[0];
    content = content.substring(heroHtml.length);

    const titleMatch = heroHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pMatch = heroHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const btnMatch = heroHtml.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
    
    const allParagraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatchItem;
    while ((pMatchItem = pRegex.exec(heroHtml)) !== null) {
      allParagraphs.push(pMatchItem[1]);
    }
    const tickerTextRaw = allParagraphs.length >= 3 ? allParagraphs[allParagraphs.length - 1] : "";
    const tickerText = tickerTextRaw.replace(/<[^>]*>?/gm, '').trim();
    
    const bulletPoints: string[] = [];
    const ulMatch = heroHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ulMatch) {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      while ((match = liRegex.exec(ulMatch[1])) !== null) {
        bulletPoints.push(match[1].trim().replace(/&amp;/g, '&').replace(/<[^>]*>?/gm, ''));
      }
    }
    
    heroData = {
      subtitle: "Service",
      title: titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
      description: pMatch ? pMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
      ctaText: btnMatch ? btnMatch[2].replace(/<[^>]*>?/gm, '').trim() : "",
      ctaLink: btnMatch ? btnMatch[1].trim() : "",
      bulletPoints,
      tickerText
    };
  }

  const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;
  const blocksSplit = content.match(sectionRegex) || [];
  
  for (const blockHtml of blocksSplit) {
    let h2Match = blockHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    let title = h2Match ? h2Match[1].replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim() : "";
    
    const hasImg = /<img/i.test(blockHtml);
    const h3Matches = [...blockHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
    
    if (h3Matches.length > 1) {
      if (/faq|fragen/i.test(title)) {
        sections.push({
          type: "faq",
          data: {
            title: title,
            subtitle: "FAQ",
            faqs: h3Matches.map(m => ({ question: m[1].replace(/<[^>]*>?/gm, '').trim(), answer: m[2].replace(/<[^>]*>?/gm, '').trim() }))
          }
        });
      } else if (/warum|vorteil/i.test(title)) {
        sections.push({
          type: "benefits",
          data: {
            title: title,
            subtitle: "Deine Vorteile",
            items: h3Matches.map(m => ({ title: m[1].replace(/<[^>]*>?/gm, '').trim(), description: m[2].replace(/<[^>]*>?/gm, '').trim() }))
          }
        });
      } else if (/Google setzt/i.test(title)) {
        const headings = [...blockHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
        const subtitle = headings.length > 0 ? headings[0][1].replace(/<[^>]*>?/gm, '').trim() : "";
        const motto = headings.length > 1 ? headings[1][1].replace(/<[^>]*>?/gm, '').trim() : "";
        
        let description = "";
        const descMatch = blockHtml.match(/<div[^>]*elementor-heading-title[^>]*data-ninja-font="barlow[^>]*>([\s\S]*?)<\/div>/i);
        if (descMatch) {
          description = descMatch[1].replace(/<[^>]*>?/gm, '').trim();
        } else {
          const pMatch = blockHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          if (pMatch) description = pMatch[1].replace(/<[^>]*>?/gm, '').trim();
        }
        
        const ulMatch = blockHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
        const listItems: string[] = [];
        if (ulMatch) {
          const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
          let match;
          while ((match = liRegex.exec(ulMatch[1])) !== null) {
            listItems.push(match[1].replace(/<[^>]*>?/gm, '').trim());
          }
        }
        
        const imgMatch = blockHtml.match(/<img[^>]+src="([^">]+)"/i);
        let imageUrl = imgMatch ? imgMatch[1] : "";
        imageUrl = imageUrl.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
        
        sections.push({
          type: "googleFeature",
          data: {
            title: title,
            subtitle: subtitle,
            description: description,
            motto: motto,
            items: listItems,
            imageUrl: imageUrl
          }
        });
      } else if (/baustein/i.test(title)) {
         sections.push({
          type: "buildingBlocks",
          data: {
            title: title,
            subtitle: "Deine Bausteine",
            blocks: h3Matches.map(m => ({ title: m[1].replace(/<[^>]*>?/gm, '').trim(), description: m[2].replace(/<[^>]*>?/gm, '').trim() }))
          }
        });
      } else {
         sections.push({ type: "generic", html: blockHtml });
      }
    } else if (/weitere leistungen/i.test(title)) {
       const imgMatch = blockHtml.match(/<img[^>]*src=["'](.*?)["']/i);
       const ulMatch = blockHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
       const items: string[] = [];
       if (ulMatch) {
         const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
         let match;
         while ((match = liRegex.exec(ulMatch[1])) !== null) {
           items.push(match[1].replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim());
         }
       }
       const pMatch = blockHtml.match(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
       
       sections.push({
          type: "weitereLeistungen",
          data: {
            title: title,
            description: pMatch ? pMatch[1].replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim() : "",
            imageUrl: imgMatch ? imgMatch[1] : "",
            items: items
          }
       });
    } else if (hasImg) {
      const imgMatch = blockHtml.match(/<img[^>]*src=["'](.*?)["']/i);
      const ulMatch = blockHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
      const items: string[] = [];
      if (ulMatch) {
        const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        let match;
        while ((match = liRegex.exec(ulMatch[1])) !== null) {
          items.push(match[1].replace(/<[^>]*>?/gm, '').trim());
        }
      }
      let pDesc = "";
      const pMatch = blockHtml.match(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
      if (pMatch) {
        pDesc = pMatch[1].replace(/<[^>]*>?/gm, '').trim();
      } else {
        const anyPMatch = blockHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        if (anyPMatch) pDesc = anyPMatch[1].replace(/<[^>]*>?/gm, '').trim();
      }
      
      const mottoMatch = blockHtml.match(/<h[3456][^>]*>([\s\S]*?)<\/h[3456]>/i) || blockHtml.match(/<p[^>]*><strong>([\s\S]*?)<\/strong><\/p>/i);
      let motto = mottoMatch ? mottoMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
      if (!motto && items.length > 0) motto = "TYPISCHE PROBLEME:";

      sections.push({
         type: "about",
         data: {
           titleLine1: title,
           titleLine2: "",
           subtitle: "",
           description: pDesc,
           motto: motto,
           list1: items,
           list2: [],
           imageUrl: imgMatch ? imgMatch[1] : "",
           btnText: "",
           btnLink: "",
           phoneText: "",
           phoneLink: ""
         }
      });
    } else if (/<ul/i.test(blockHtml)) {
      const ulMatch = blockHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
      const items: string[] = [];
      if (ulMatch) {
        const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        let match;
        while ((match = liRegex.exec(ulMatch[1])) !== null) {
          items.push(match[1].replace(/<[^>]*>?/gm, '').trim());
        }
      }
      
      let pDesc = "";
      const pMatch = blockHtml.match(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
      if (pMatch) {
        pDesc = pMatch[1].replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim();
      } else {
        const anyPMatch = blockHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        if (anyPMatch) pDesc = anyPMatch[1].replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim();
      }

      let subtitleMatch = blockHtml.match(/<h[56][^>]*>([\s\S]*?)<\/h[56]>/i) || blockHtml.match(/<div class="section-subtitle">([\s\S]*?)<\/div>/i);
      let subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "⚠️ WP MISSING: Add <div class=\"section-subtitle\"> above h2";

      sections.push({
        type: "benefits",
        data: {
          title: title,
          subtitle: subtitle,
          description: pDesc,
          benefits: items
        }
      });
    } else {
       sections.push({ type: "generic", html: blockHtml });
    }
  }

  return { heroData, sections };
}
