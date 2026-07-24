"use client";

/**
 * components/ContactForm.tsx
 *
 * Client-side contact form component.
 *
 * AGENT RULES:
 * - This is ALWAYS a client component ("use client"). Do not remove that directive.
 * - Never POST directly to WordPress from here — always go through /api/contact.
 * - Supports 3 modes (in priority order):
 *     1. `fields` prop  — dynamic field array from WP getFormSettings()
 *     2. `formHtml` prop — raw WordPress Fluent Form HTML
 *     3. Fallback — hardcoded name/email/message form
 * - Do not remove reCAPTCHA logic even if currently unused.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface ContactFormProps {
  fields?: FormField[];
  formHtml?: string;
  submitLabel?: string;
  recaptchaSiteKey?: string;
  recaptchaEnabled?: boolean;
  recaptchaType?: string;
}

const SKIP_FIELD_TYPES = new Set([
  "custom_submit",
  "section_break",
  "html",
  "shortcode",
  "hidden",
  "action_hook",
  "form_step",
]);

function fieldLooksLikeRecaptcha(f: FormField, allowFieldLabel: boolean): boolean {
  const type = (f.type || "").toLowerCase();
  const id = (f.id || "").toLowerCase();
  const label = (f.label || "").trim();
  const placeholder = (f.placeholder || "").trim();

  if (type === "recaptcha") return true;
  if (id.includes("recaptcha")) return true;
  if (/recaptcha/i.test(label)) return true;
  if (allowFieldLabel && (label === "Field Label" || placeholder === "Field Label")) return true;
  return false;
}

export default function ContactForm({
  fields,
  formHtml,
  submitLabel = "Send Message",
  recaptchaEnabled,
  recaptchaSiteKey,
  recaptchaType = "v2",
  theme = "dark",
}: ContactFormProps & { theme?: "dark" | "light" }) {
  const [fallbackData, setFallbackData] = useState({ name: "", email: "", message: "" });
  const [dynamicData, setDynamicData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Client-side settings (fills gaps when SSR missed keys / type)
  const [clientSiteKey, setClientSiteKey] = useState("");
  const [clientRecaptchaType, setClientRecaptchaType] = useState("");
  const [clientEnabled, setClientEnabled] = useState(false);
  const [clientFields, setClientFields] = useState<FormField[] | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<HTMLDivElement | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  const siteKey = (clientSiteKey || recaptchaSiteKey || "").trim();
  const activeType = (clientRecaptchaType || recaptchaType || "v2").toLowerCase();
  const isV3 = activeType === "v3";
  const enabled = !!(recaptchaEnabled || clientEnabled);

  // Hydrate reCAPTCHA settings from WordPress on the client (fixes missing SSR keys)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;
    if (!base) return;

    let cancelled = false;
    const url = `${base.replace(/\/$/, "")}/wp-json/firebase-form/v1/settings?_ts=${Date.now()}`;

    fetch(url, { method: "GET", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.recaptcha_site_key) setClientSiteKey(String(data.recaptcha_site_key));
        if (data.recaptcha_type) setClientRecaptchaType(String(data.recaptcha_type));
        if (data.recaptcha_enabled) setClientEnabled(true);
        if (Array.isArray(data.fields) && data.fields.length > 0) {
          setClientFields(
            data.fields.map((f: FormField) => ({
              id: f.id || "",
              label: f.label || "",
              type: f.type || "text",
              placeholder: f.placeholder || "",
              required: !!f.required,
            }))
          );
        }
      })
      .catch((err) => console.error("Client form settings fetch failed:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const sourceFields = clientFields && clientFields.length > 0 ? clientFields : fields || [];

  const finalFields: FormField[] = useMemo(() => {
    const rawHasRecaptcha = sourceFields.some((f) => fieldLooksLikeRecaptcha(f, false));
    const allowFieldLabel = rawHasRecaptcha || enabled || !!siteKey;

    const mapped = sourceFields.map((f) =>
      fieldLooksLikeRecaptcha(f, allowFieldLabel)
        ? { ...f, type: "recaptcha", placeholder: "" }
        : { ...f, type: (f.type || "text").toLowerCase() }
    );

    const hasRecaptcha = mapped.some((f) => f.type === "recaptcha");
    if ((enabled || !!siteKey) && !hasRecaptcha && siteKey) {
      mapped.push({ id: "recaptcha", label: "reCAPTCHA", type: "recaptcha", required: true });
    }
    return mapped;
  }, [sourceFields, enabled, siteKey]);

  const requiresRecaptcha = finalFields.some((f) => f.type === "recaptcha") || enabled;

  // Load Google script + render v2 widget (v3 stays invisible until submit)
  useEffect(() => {
    if (!requiresRecaptcha || !siteKey) return;

    let isMounted = true;

    const loadScript = (src: string, id: string) => {
      if (document.getElementById(id)) return;
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    };

    if (isV3) {
      loadScript(
        `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`,
        "google-recaptcha-v3-script"
      );
      return;
    }

    const renderWidget = () => {
      if (!recaptchaRef.current || !window.grecaptcha?.render) return;
      if (
        renderedRef.current === recaptchaRef.current ||
        recaptchaRef.current.classList.contains("recaptcha-rendered") ||
        recaptchaRef.current.querySelector("iframe")
      ) {
        return;
      }

      try {
        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setDynamicData((prev) => ({ ...prev, "g-recaptcha-response": token }));
            setErrorMessage("");
          },
          "expired-callback": () => {
            setDynamicData((prev) => {
              const u = { ...prev };
              delete u["g-recaptcha-response"];
              return u;
            });
          },
          "error-callback": () => {
            setDynamicData((prev) => {
              const u = { ...prev };
              delete u["g-recaptcha-response"];
              return u;
            });
            setErrorMessage("reCAPTCHA error. Please reload and try again.");
          },
        });
        recaptchaRef.current.classList.add("recaptcha-rendered");
        renderedRef.current = recaptchaRef.current;
        if (isMounted) setRecaptchaWidgetId(widgetId);
      } catch (err) {
        console.error("Failed to render reCAPTCHA:", err);
      }
    };

    if (window.grecaptcha?.render) {
      setTimeout(renderWidget, 100);
    } else {
      window.onRecaptchaLoad = () => {
        if (isMounted) renderWidget();
      };
      loadScript(
        "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit",
        "google-recaptcha-script"
      );
    }

    return () => {
      isMounted = false;
    };
  }, [requiresRecaptcha, siteKey, isV3]);

  async function postContact(body: Record<string, string>) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || "Something went wrong.");
    }
    return res.json();
  }

  async function getRecaptchaToken(): Promise<string | null> {
    if (!requiresRecaptcha) return null;
    if (!siteKey) {
      throw new Error("reCAPTCHA Site Key is missing. Save it in WordPress → reCAPTCHA settings.");
    }

    if (isV3) {
      // Wait for grecaptcha
      await new Promise<void>((resolve, reject) => {
        let tries = 0;
        const wait = () => {
          if (window.grecaptcha?.execute) resolve();
          else if (tries++ > 50) reject(new Error("reCAPTCHA failed to load. Please refresh."));
          else setTimeout(wait, 100);
        };
        wait();
      });
      await new Promise<void>((resolve) => window.grecaptcha.ready(() => resolve()));
      const token = await window.grecaptcha.execute(siteKey, { action: "contact" });
      return token || null;
    }

    return dynamicData["g-recaptcha-response"] || null;
  }

  const handleDynamicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const payload: Record<string, string> = { ...dynamicData };

      // Never submit the fake "Field Label" text value as a form answer
      finalFields.forEach((f) => {
        if (f.type === "recaptcha") delete payload[f.id];
      });

      if (requiresRecaptcha) {
        const token = await getRecaptchaToken();
        if (!token) {
          setErrorMessage(
            isV3
              ? "reCAPTCHA verification failed. Please try again."
              : "Please complete the reCAPTCHA verification."
          );
          setStatus("error");
          return;
        }
        payload["g-recaptcha-response"] = token;
      }

      await postContact(payload);
      setStatus("success");
      const cleared: Record<string, string> = {};
      finalFields.forEach((f) => {
        cleared[f.id] = "";
      });
      setDynamicData(cleared);
      if (!isV3 && window.grecaptcha && recaptchaWidgetId !== null) {
        window.grecaptcha.reset(recaptchaWidgetId);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const handleFluentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const serialized = new URLSearchParams(data as any).toString();
    const submitData = new URLSearchParams();
    submitData.append("action", "fluentform_submit");
    submitData.append("form_id", (data.get("form_id") as string) || "1");
    submitData.append("data", serialized);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: submitData.toString(),
      });
      const result = await res.json();
      if (result.success || result.insert_id) {
        setStatus("success");
        form.reset();
      } else {
        throw new Error(result.error || "Submission failed.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      await postContact({
        name: fallbackData.name,
        email: fallbackData.email,
        message: fallbackData.message,
        company: (fallbackData as any).company || "",
        company_website: (fallbackData as any).company || "",
        nachricht: fallbackData.message,
      });
      setStatus("success");
      setFallbackData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const StatusMessages = () => (
    <div className="mt-3">
      {status === "success" && (
        <p className="text-green-400 text-sm font-medium">✓ Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">{errorMessage || "Something went wrong. Please try again."}</p>
      )}
    </div>
  );

  const inputClass =
    theme === "light"
      ? "w-full px-6 py-4 bg-[#f4f4f5] border-none rounded-[24px] text-text-primary placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#b6ef00)] transition-all text-[18px]"
      : "w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm";

  const textareaClass =
    theme === "light"
      ? "w-full px-6 py-4 bg-[#f4f4f5] border-none rounded-[24px] text-text-primary placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#b6ef00)] transition-all text-[18px] resize-y min-h-[150px]"
      : `${inputClass} resize-y min-h-[150px]`;

  const submitClass =
    theme === "light"
      ? "w-fit bg-[var(--color-brand-primary,#b6ef00)] hover:opacity-90 text-[var(--color-brand-secondary,#101010)] font-normal py-4 px-10 rounded-full transition-all duration-200 text-[18px] cursor-pointer disabled:opacity-50"
      : "w-full bg-green-600 hover:bg-green-500 text-text-light font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const labelClass =
    theme === "light"
      ? "sr-only"
      : "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1";

  if (finalFields.length > 0) {
    const submitField = finalFields.find((f) => f.type === "custom_submit");
    const btnText = submitField?.label || submitLabel;

    return (
      <form onSubmit={handleDynamicSubmit} className="space-y-4 w-full" style={{ fontFamily: "Federo, sans-serif" }}>
        {finalFields.map((field) => {
          const fieldType = (field.type || "text").toLowerCase();
          if (SKIP_FIELD_TYPES.has(fieldType)) return null;

          // Never render reCAPTCHA as a text input
          if (fieldType === "recaptcha") {
            if (isV3) return null; // invisible
            return (
              <div key={field.id} className="space-y-2">
                {siteKey ? (
                  <div ref={recaptchaRef} className="recaptcha-container" />
                ) : (
                  <p className="text-sm text-red-500">
                    reCAPTCHA Site Key is missing. Add it in WordPress → reCAPTCHA settings, then refresh.
                  </p>
                )}
              </div>
            );
          }

          const placeholderBase = field.placeholder || field.label || "";
          const placeholder = `${placeholderBase}${field.required ? " *" : ""}`;
          const inputType = ["email", "tel", "url", "number", "date", "password"].includes(fieldType)
            ? fieldType
            : "text";

          return (
            <div key={field.id} className="space-y-1">
              <label className={labelClass}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {fieldType === "textarea" ? (
                <textarea
                  placeholder={placeholder}
                  value={dynamicData[field.id] || ""}
                  onChange={(e) => setDynamicData((p) => ({ ...p, [field.id]: e.target.value }))}
                  className={textareaClass}
                  required={field.required}
                />
              ) : (
                <input
                  type={inputType}
                  placeholder={placeholder}
                  value={dynamicData[field.id] || ""}
                  onChange={(e) => setDynamicData((p) => ({ ...p, [field.id]: e.target.value }))}
                  className={inputClass}
                  required={field.required}
                />
              )}
            </div>
          );
        })}
        <button type="submit" disabled={status === "loading"} className={submitClass}>
          {status === "loading" ? "Sending…" : btnText}
        </button>
        <StatusMessages />
      </form>
    );
  }

  if (formHtml) {
    return (
      <div className="w-full" ref={formRef}>
        <div
          className="fluentform-wrapper"
          onSubmit={handleFluentSubmit as any}
          dangerouslySetInnerHTML={{ __html: formHtml }}
        />
        <StatusMessages />
      </div>
    );
  }

  return (
    <form onSubmit={handleFallbackSubmit} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className={labelClass}>Name</label>
        <input
          type="text"
          placeholder={theme === "light" ? "Name *" : "Your name"}
          value={fallbackData.name}
          onChange={(e) => setFallbackData((p) => ({ ...p, name: e.target.value }))}
          className={inputClass}
          required
        />
      </div>
      <div className="space-y-1">
        <label className={labelClass}>Email</label>
        <input
          type="email"
          placeholder={theme === "light" ? "Email *" : "your@email.com"}
          value={fallbackData.email}
          onChange={(e) => setFallbackData((p) => ({ ...p, email: e.target.value }))}
          className={inputClass}
          required
        />
      </div>
      {theme === "light" && (
        <div className="space-y-1">
          <label className={labelClass}>Company/Website</label>
          <input
            type="text"
            placeholder="Company/Website"
            value={(fallbackData as any).company || ""}
            onChange={(e) => setFallbackData((p) => ({ ...p, company: e.target.value }))}
            className={inputClass}
          />
        </div>
      )}
      <div className="space-y-1">
        <label className={labelClass}>Message</label>
        <textarea
          placeholder={theme === "light" ? "News" : "How can we help?"}
          value={fallbackData.message}
          onChange={(e) => setFallbackData((p) => ({ ...p, message: e.target.value }))}
          className={textareaClass}
          rows={theme === "light" ? 6 : 4}
          required
        />
      </div>
      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
      <StatusMessages />
    </form>
  );
}
