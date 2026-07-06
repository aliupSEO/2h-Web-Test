import { Metadata } from "next";
import { getPageBySlug } from "@/lib/graphql";

// Fetch SEO data
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("data-protection");
  return {
    title: page?.seo?.title || "Data Protection",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function DataProtectionPage() {
  const page = await getPageBySlug("data-protection");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light,#ffffff)] text-[var(--color-brand-secondary,#000000)]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-[var(--color-brand-secondary,#000000)] mb-4">WordPress Connection Needed</h1>
          <p className="text-gray-600">
            Ensure a page with slug <code>"data-protection"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  let contentHtml = page.content;
  
  // Find the Table of contents list and wrap it in an accordion
  const tocListMatch = contentHtml.match(/<ol class="wp-block-list">[\s\S]*?<\/ol>/);
  if (tocListMatch) {
    const listHtml = tocListMatch[0];
    const accordionHtml = `
      <details class="legal-toc-wrapper">
        <summary class="legal-toc-summary">Table of contents</summary>
        <div class="legal-toc-content">
          ${listHtml}
        </div>
      </details>
    `;
    // Replace the ol with the accordion
    contentHtml = contentHtml.replace(listHtml, accordionHtml);
    
    // Remove all the standalone "Table of contents" h2 tags since they are now in the summary
    contentHtml = contentHtml.replace(/<h2[^>]*>Table of contents<\/h2>/gi, "");
  }

  return (
    <main 
      className="min-h-screen flex flex-col pt-32 pb-24 relative bg-[var(--color-bg-light,#ffffff)]"
    >
      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 md:mb-16 text-center animate-fade-slide-up">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 tracking-tight text-[var(--color-brand-secondary,#000000)] uppercase"
            style={{ fontFamily: 'var(--font-federo)' }}
          >
            {page.seo?.title?.split(" - ")[0] || page.title || "Datenschutz"}
          </h1>
        </div>

        {/* Content */}
        <div 
          className="animate-fade-slide-up"
          style={{ 
            animationDelay: "150ms",
            animationFillMode: "both"
          }}
        >
          {/* Override global wp-content colors for the white background */}
          <style dangerouslySetInnerHTML={{__html: `
            .legal-content { color: #4b5563 !important; }
            
            /* Show and style WP headings */
            .legal-content h1, .legal-content h2, .legal-content h3, .legal-content h4, .legal-content h5, .legal-content h6 {
              color: #111827 !important;
              font-family: var(--font-federo), serif !important;
              font-weight: normal !important;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
            }
            .legal-content h2 { font-size: 2.25rem; }
            .legal-content h3 { font-size: 1.75rem; }
            
            /* Hide the very first h1 (Privacy Policy) since it's already shown in the page header */
            .legal-content > h1:first-child { display: none !important; }

            /* Style the Table of Contents as the green banner */
            .legal-content h2:contains('Table of contents'),
            .legal-content h2:has(+ h2:contains('Table of contents')) {
              display: none !important; /* We will use a custom wrapper if possible, or style the list */
            }

            .legal-content strong { color: #374151 !important; font-weight: 600 !important; }
            .legal-content a { color: var(--color-brand-primary, #b6ef00) !important; text-decoration: none !important; }
            .legal-content a:hover { opacity: 0.8 !important; }
            
            /* Style the TOC block */
            .legal-toc-wrapper {
              background-color: var(--color-brand-primary, #b6ef00);
              color: #111827;
              padding: 0;
              margin-bottom: 3rem;
              border-radius: 4px;
            }
            .legal-toc-summary {
              font-weight: 600;
              padding: 1rem 1.5rem;
              cursor: pointer;
              display: flex;
              justify-content: space-between;
              align-items: center;
              list-style: none; /* Hide default arrow */
            }
            .legal-toc-summary::-webkit-details-marker {
              display: none;
            }
            .legal-toc-summary:after {
              content: '▼';
              font-size: 0.8rem;
              transition: transform 0.2s;
            }
            details[open] .legal-toc-summary:after {
              transform: rotate(180deg);
            }
            .legal-toc-content {
              padding: 0 1.5rem 1.5rem 1.5rem;
            }
            .legal-toc-content ol {
              margin: 0;
              padding-left: 1.5rem;
            }
            .legal-toc-content li {
              margin-bottom: 0.5rem;
            }
            .legal-toc-content a {
              color: #111827 !important;
              font-weight: 500;
            }
            .legal-toc-content a:hover {
              text-decoration: underline !important;
            }
          `}} />
          
          {/* Render standard WP content with standard styles */}
          <div 
            className="wp-content legal-content"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            dangerouslySetInnerHTML={{ __html: contentHtml }} 
          />
        </div>
      </div>
    </main>
  );
}
