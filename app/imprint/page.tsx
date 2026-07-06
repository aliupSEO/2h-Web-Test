import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/graphql";

// Fetch SEO data
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("imprint");
  return {
    title: page?.seo?.title || "Imprint",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function ImprintPage() {
  const page = await getPageBySlug("imprint");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-dark text-[var(--color-text-light,#ffffff)]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-brand-green mb-4">WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Ensure a page with slug <code>"imprint"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
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
            {page.seo?.title?.split(" - ")[0] || page.title || "Impressum"}
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
            .imprint-content { color: #4b5563 !important; }
            .imprint-content h1, .imprint-content h2, .imprint-content h3, .imprint-content h4, .imprint-content h5, .imprint-content h6 { color: #111827 !important; display: none; /* Hide WP headings since we have page header */ }
            .imprint-content strong { color: #374151 !important; font-weight: 600 !important; }
            .imprint-content a { color: var(--color-brand-primary, #b6ef00) !important; text-decoration: none !important; }
            .imprint-content a:hover { opacity: 0.8 !important; }
          `}} />
          
          {/* Render standard WP content with standard styles */}
          <div 
            className="wp-content imprint-content"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </main>
  );
}
