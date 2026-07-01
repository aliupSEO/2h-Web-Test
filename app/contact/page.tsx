import { Metadata } from "next";
import { getPageBySlug, extractKontaktPageData } from "@/lib/graphql";
import ContactPageSection from "@/components/sections/ContactPageSection";

export const revalidate = 1;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("kontakt");
  return {
    title: page?.seo?.title || "Kontakt - 2H Web Solutions",
    description: page?.seo?.description || "Lassen Sie uns Ihr Projekt besprechen. In einem kurzen Gespräch wird klar, wo aktuell Potenzial liegt.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug("kontakt");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-dark text-text-light pt-32">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-brand-green mb-4">WordPress Connection Needed</h1>
          <p className="text-text-secondary">
            Ensure a page with slug <code>"kontakt"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const contactData = page.content ? extractKontaktPageData(page.content) : null;
  
  if (contactData) {
    // Use the HTML parsed image, fallback to featuredImage, fallback to openGraph image
    contactData.imageUrl = contactData.imageUrl || page.featuredImage?.node?.sourceUrl || page.seo?.openGraph?.image?.secureUrl || "";
  }

  return (
    <main className="min-h-screen bg-white text-text-primary">
      {contactData && <ContactPageSection data={contactData} />}
    </main>
  );
}
