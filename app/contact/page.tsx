import { Metadata } from "next";
import { getPageBySlug, extractKontaktPageData, getFormSettings } from "@/lib/graphql";
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
  const formSettings = await getFormSettings();

  if (contactData) {
    // Use the HTML parsed image, fallback to featuredImage, fallback to openGraph image
    contactData.imageUrl = contactData.imageUrl || page.featuredImage?.node?.sourceUrl || page.seo?.openGraph?.image?.secureUrl || "";

    // Prefer live form builder fields from the plugin (correct types like recaptcha)
    if (formSettings?.fields && Array.isArray(formSettings.fields) && formSettings.fields.length > 0) {
      contactData.fields = formSettings.fields.map((f: {
        id?: string;
        label?: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
      }) => ({
        id: f.id || "",
        label: f.label || "",
        type: f.type || "text",
        placeholder: f.placeholder || "",
        required: !!f.required,
      }));

      const submitField = formSettings.fields.find(
        (f: { type?: string }) => f.type === "custom_submit"
      );
      if (submitField?.label) {
        contactData.submitLabel = submitField.label;
      }
    }

    contactData.recaptchaEnabled = !!formSettings?.recaptcha_enabled;
    contactData.recaptchaSiteKey = formSettings?.recaptcha_site_key || "";
    contactData.recaptchaType = formSettings?.recaptcha_type || "v2";

    // Always normalize reCAPTCHA fields (do not require site key for type fix)
    if (contactData.fields) {
      const hasRc = contactData.fields.some(
        (f) =>
          (f.type || "").toLowerCase() === "recaptcha" ||
          (f.id || "").toLowerCase().includes("recaptcha")
      );
      contactData.fields = contactData.fields.map((f) => {
        const label = (f.label || "").trim();
        const type = (f.type || "").toLowerCase();
        const id = (f.id || "").toLowerCase();
        if (
          type === "recaptcha" ||
          id.includes("recaptcha") ||
          /recaptcha/i.test(label) ||
          ((hasRc || contactData.recaptchaEnabled || !!contactData.recaptchaSiteKey) &&
            label === "Field Label")
        ) {
          return { ...f, type: "recaptcha", placeholder: "" };
        }
        return f;
      });
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-light,#ffffff)] text-text-primary">
      {contactData && <ContactPageSection data={contactData} />}
    </main>
  );
}
