/**
 * lib/design-system.ts
 *
 * Fetches design tokens from the WordPress Design System Settings plugin
 * and converts them into CSS custom properties for injection.
 *
 * AGENT RULES:
 * - This is the SINGLE SOURCE OF TRUTH for design system data fetching.
 * - Never call the /wp-json/design-system/v1/settings endpoint directly from a page or component.
 * - The REST endpoint is public (no auth required) — tokens are not sensitive.
 * - Revalidation is 60 seconds — design tokens change rarely.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DesignSystemBranding {
  logo_primary: string;
  logo_dark: string;
  logo_mobile: string;
  favicon: string;
  site_title: string;
  tagline: string;
  footer_copyright: string;
  social: {
    linkedin: string;
    instagram: string;
    twitter: string;
    youtube: string;
    facebook: string;
    tiktok: string;
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
}

export interface HeadingSettings {
  size_desktop: string;
  size_tablet: string;
  size_mobile: string;
  weight: string;
  line_height: string;
  letter_spacing: string;
  text_transform: string;
  color: string;
}

export interface DesignSystemTypography {
  font_primary: string;
  font_secondary: string;
  headings: {
    h1: HeadingSettings;
    h2: HeadingSettings;
    h3: HeadingSettings;
    h4: HeadingSettings;
    h5: HeadingSettings;
    h6: HeadingSettings;
  };
  body: {
    font_size: string;
    line_height: string;
    paragraph_spacing: string;
  };
  links: {
    color: string;
    hover_color: string;
    decoration: string;
  };
}

export interface ButtonVariant {
  bg: string;
  text: string;
  border_color: string;
  border_width: string;
  border_radius: string;
  padding_x: string;
  padding_y: string;
  hover_bg: string;
  hover_text: string;
  hover_border: string;
}

export interface DesignSystemColors {
  brand: {
    primary: string;
    secondary: string;
    accent: string;
  };
  backgrounds: {
    base: string;
    alternate: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface DesignSystemUI {
  buttons: {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    outline: ButtonVariant;
    text_only: ButtonVariant;
  };
  forms: {
    input_bg: string;
    border_color: string;
    border_radius: string;
    focus_color: string;
    placeholder_color: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface DesignSystemSettings {
  branding: DesignSystemBranding;
  typography: DesignSystemTypography;
  colors: DesignSystemColors;
  ui: DesignSystemUI;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

/**
 * Fetches the full design system settings from WordPress.
 * Returns null if the endpoint is unreachable or not configured.
 */
export async function getDesignSystemSettings(): Promise<DesignSystemSettings | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_WORDPRESS_REST_URL not set — skipping design system fetch.");
    return null;
  }

  try {
    // Generate a cache buster that changes every second to bypass the host Nginx proxy cache,
    // while allowing Next.js to share the response within the 1-second revalidation period.
    const cacheBuster = Math.floor(Date.now() / 1000);
    const res = await fetch(`${baseUrl}/wp-json/design-system/v1/settings?t=${cacheBuster}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 1 },
    });

    if (!res.ok) {
      console.warn(`Design System REST API returned ${res.status}`);
      return null;
    }

    const data: DesignSystemSettings = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch design system settings:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// CSS custom property generator
// ---------------------------------------------------------------------------

/**
 * Converts design system settings into a CSS string of custom properties.
 * This string is injected as a <style> tag in the root layout to override
 * the hardcoded defaults in globals.css.
 */
export function getDesignSystemCSS(settings: DesignSystemSettings): string {
  const { colors, typography, ui } = settings;

  const lines: string[] = [];

  // Generate Google Fonts @import if valid fonts are specified
  const extractFont = (fontString: string) => {
    if (!fontString) return null;
    const font = fontString.split(',')[0].replace(/['"]/g, '').trim();
    if (font && !['sans-serif', 'serif', 'monospace', 'system-ui'].includes(font.toLowerCase())) {
      return font.replace(/ /g, '+');
    }
    return null;
  };
  
  const primaryFont = extractFont(typography.font_primary);
  const secondaryFont = extractFont(typography.font_secondary);
  const fontsToLoad = new Set<string>();
  
  if (primaryFont) fontsToLoad.add(`${primaryFont}:300,400,500,600,700`);
  if (secondaryFont) fontsToLoad.add(`${secondaryFont}:300,400,500,600,700`);
  
  if (fontsToLoad.size > 0) {
    const families = Array.from(fontsToLoad).join('|');
    lines.push(`@import url('https://fonts.googleapis.com/css?family=${families}&display=swap');\n`);
  }

  lines.push(":root {");

  // ── Brand Colors ────────────────────────────────────────────────
  lines.push("  /* Brand Colors */");
  lines.push(`  --color-brand-primary: ${colors.brand.primary};`);
  lines.push(`  --color-brand-secondary: ${colors.brand.secondary};`);
  lines.push(`  --color-brand-accent: ${colors.brand.accent};`);

  // Map to existing Tailwind tokens for backward compatibility
  lines.push(`  --color-brand-green: ${colors.brand.primary};`);
  lines.push(`  --color-brand-dark: ${colors.brand.secondary};`);

  // ── Background Colors ──────────────────────────────────────────
  lines.push("  /* Background Colors */");
  lines.push(`  --background: ${colors.backgrounds.base};`);
  lines.push(`  --color-bg-base: ${colors.backgrounds.base};`);
  lines.push(`  --color-bg-primary: ${colors.backgrounds.base};`);
  lines.push(`  --color-bg-alternate: ${colors.backgrounds.alternate};`);
  lines.push(`  --color-bg-dark: ${colors.backgrounds.dark};`);
  lines.push(`  --color-brand-card: ${colors.backgrounds.alternate};`);

  // ── Text Colors ────────────────────────────────────────────────
  lines.push("  /* Text Colors */");
  lines.push(`  --foreground: ${colors.text.primary};`);
  lines.push(`  --color-text-primary: ${colors.text.primary};`);
  lines.push(`  --color-text-secondary: ${colors.text.secondary};`);
  lines.push(`  --color-text-light: ${colors.text.light};`);
  lines.push(`  --color-brand-muted: ${colors.text.secondary};`);

  // ── Semantic Colors ────────────────────────────────────────────
  lines.push("  /* Semantic Colors */");
  lines.push(`  --color-success: ${colors.semantic.success};`);
  lines.push(`  --color-warning: ${colors.semantic.warning};`);
  lines.push(`  --color-error: ${colors.semantic.error};`);
  lines.push(`  --color-info: ${colors.semantic.info};`);

  // ── Typography ─────────────────────────────────────────────────
  lines.push("  /* Typography */");
  lines.push(`  --font-family-primary: ${typography.font_primary}, system-ui, sans-serif;`);
  lines.push(`  --font-family-secondary: ${typography.font_secondary}, system-ui, sans-serif;`);
  lines.push(`  --body-font-size: ${typography.body.font_size};`);
  lines.push(`  --body-line-height: ${typography.body.line_height};`);
  lines.push(`  --body-paragraph-spacing: ${typography.body.paragraph_spacing};`);
  lines.push(`  --link-color: ${typography.links.color};`);
  lines.push(`  --link-hover-color: ${typography.links.hover_color};`);
  lines.push(`  --link-decoration: ${typography.links.decoration};`);

  // Heading variables
  const headingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  for (const h of headingLevels) {
    const hd = typography.headings[h];
    lines.push(`  /* ${h.toUpperCase()} */`);
    lines.push(`  --${h}-size-desktop: ${hd.size_desktop};`);
    lines.push(`  --${h}-size-tablet: ${hd.size_tablet};`);
    lines.push(`  --${h}-size-mobile: ${hd.size_mobile};`);
    lines.push(`  --${h}-weight: ${hd.weight};`);
    lines.push(`  --${h}-line-height: ${hd.line_height};`);
    lines.push(`  --${h}-letter-spacing: ${hd.letter_spacing};`);
    lines.push(`  --${h}-text-transform: ${hd.text_transform};`);
    if (hd.color) {
      lines.push(`  --${h}-color: ${hd.color};`);
    }
  }

  // ── Button Variants ────────────────────────────────────────────
  const buttonVariants = ["primary", "secondary", "outline", "text_only"] as const;
  for (const v of buttonVariants) {
    const btn = ui?.buttons?.[v] || ({} as any);
    const prefix = `--btn-${v.replace("_", "-")}`;
    lines.push(`  /* Button: ${v} */`);
    
    // If the plugin lacks a Buttons UI, it might send garbage defaults.
    // For primary buttons, force the background to brand primary.
    if (v === "primary") {
      lines.push(`  ${prefix}-bg: ${colors.brand.primary};`);
      lines.push(`  ${prefix}-text: #000000;`);
      lines.push(`  ${prefix}-border-radius: 9999px;`);
      lines.push(`  ${prefix}-hover-bg: ${colors.brand.accent || colors.brand.primary};`);
    } else {
      lines.push(`  ${prefix}-bg: ${btn.bg || "transparent"};`);
      lines.push(`  ${prefix}-text: ${btn.text || "inherit"};`);
      lines.push(`  ${prefix}-border-radius: ${btn.border_radius || "9999px"};`);
      lines.push(`  ${prefix}-hover-bg: ${btn.hover_bg || "transparent"};`);
    }
    
    lines.push(`  ${prefix}-border-color: ${btn.border_color || "transparent"};`);
    lines.push(`  ${prefix}-border-width: ${btn.border_width || "0px"};`);
    lines.push(`  ${prefix}-padding-x: ${btn.padding_x || "24px"};`);
    lines.push(`  ${prefix}-padding-y: ${btn.padding_y || "10px"};`);
    lines.push(`  ${prefix}-hover-text: ${btn.hover_text || "inherit"};`);
    lines.push(`  ${prefix}-hover-border: ${btn.hover_border || "transparent"};`);
  }

  // ── Forms ──────────────────────────────────────────────────────
  lines.push("  /* Form Inputs */");
  lines.push(`  --input-bg: ${ui.forms.input_bg};`);
  lines.push(`  --input-border-color: ${ui.forms.border_color};`);
  lines.push(`  --input-border-radius: ${ui.forms.border_radius};`);
  lines.push(`  --input-focus-color: ${ui.forms.focus_color};`);
  lines.push(`  --input-placeholder-color: ${ui.forms.placeholder_color};`);
  lines.push(`  --color-brand-border: ${ui.forms.border_color};`);

  // ── Shadows ────────────────────────────────────────────────────
  lines.push("  /* Shadows */");
  lines.push(`  --shadow-small: ${ui.shadows.small};`);
  lines.push(`  --shadow-medium: ${ui.shadows.medium};`);
  lines.push(`  --shadow-large: ${ui.shadows.large};`);

  lines.push("}");

  // ── Responsive heading sizes ───────────────────────────────────
  lines.push("");
  lines.push("/* Responsive heading sizes — tablet */");
  lines.push("@media (max-width: 1024px) {");
  lines.push("  :root {");
  for (const h of headingLevels) {
    lines.push(`    --${h}-size: var(--${h}-size-tablet);`);
  }
  lines.push("  }");
  lines.push("}");

  lines.push("");
  lines.push("/* Responsive heading sizes — mobile */");
  lines.push("@media (max-width: 640px) {");
  lines.push("  :root {");
  for (const h of headingLevels) {
    lines.push(`    --${h}-size: var(--${h}-size-mobile);`);
  }
  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}
