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

import React, { useState, useRef, useEffect } from "react";

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
  /** Dynamic fields from WP getFormSettings() */
  fields?: FormField[];
  /** Raw WordPress Fluent Form HTML */
  formHtml?: string;
  /** Submit button text override */
  submitLabel?: string;
  /** reCAPTCHA v2 site key */
  recaptchaSiteKey?: string;
  recaptchaEnabled?: boolean;
}

export default function ContactForm({
  fields,
  formHtml,
  submitLabel = "Send Message",
  recaptchaEnabled,
  recaptchaSiteKey,
  theme = "dark",
}: ContactFormProps & { theme?: "dark" | "light" }) {
  // Fallback static form state
  const [fallbackData, setFallbackData] = useState({ name: "", email: "", message: "" });

  // Dynamic fields state
  const [dynamicData, setDynamicData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<HTMLDivElement | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  // Build final fields list (inject reCAPTCHA field if enabled)
  const finalFields: FormField[] = fields ? [...fields] : [];
  const hasRecaptcha = finalFields.some((f) => f.type === "recaptcha");
  if (recaptchaEnabled && !hasRecaptcha && recaptchaSiteKey) {
    finalFields.push({ id: "recaptcha", label: "reCAPTCHA", type: "recaptcha", required: true });
  }

  // Load and render reCAPTCHA v2 widget
  useEffect(() => {
    const requiresRecaptcha = finalFields.some((f) => f.type === "recaptcha");
    if (!requiresRecaptcha || !recaptchaSiteKey) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!recaptchaRef.current || !window.grecaptcha?.render) return;
      if (
        renderedRef.current === recaptchaRef.current ||
        recaptchaRef.current.classList.contains("recaptcha-rendered") ||
        recaptchaRef.current.querySelector("iframe")
      ) return;

      try {
        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: recaptchaSiteKey,
          callback: (token: string) => {
            setDynamicData((prev) => ({ ...prev, "g-recaptcha-response": token }));
            setErrorMessage("");
          },
          "expired-callback": () => {
            setDynamicData((prev) => { const u = { ...prev }; delete u["g-recaptcha-response"]; return u; });
          },
          "error-callback": () => {
            setDynamicData((prev) => { const u = { ...prev }; delete u["g-recaptcha-response"]; return u; });
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
      window.onRecaptchaLoad = () => { if (isMounted) renderWidget(); };
      const scriptId = "google-recaptcha-script";
      if (!document.getElementById(scriptId)) {
        const s = document.createElement("script");
        s.id = scriptId;
        s.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        s.async = true;
        s.defer = true;
        document.body.appendChild(s);
      }
    }

    return () => { isMounted = false; };
  }, [finalFields, recaptchaSiteKey]);

  // ── Shared POST helper ──────────────────────────────────────────────────
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

  // ── MODE 1: Dynamic fields form ─────────────────────────────────────────
  const handleDynamicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (finalFields.some((f) => f.type === "recaptcha") && !dynamicData["g-recaptcha-response"]) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      setStatus("error");
      return;
    }

    try {
      await postContact(dynamicData);
      setStatus("success");
      const cleared: Record<string, string> = {};
      finalFields.forEach((f) => { cleared[f.id] = ""; });
      setDynamicData(cleared);
      if (window.grecaptcha && recaptchaWidgetId !== null) window.grecaptcha.reset(recaptchaWidgetId);
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  // ── MODE 2: Raw WP HTML form (Fluent Forms) ─────────────────────────────
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

  // ── MODE 3: Fallback hardcoded form ────────────────────────────────────
  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      await postContact({
        name: fallbackData.name,
        email: fallbackData.email,
        message: fallbackData.message,
      });
      setStatus("success");
      setFallbackData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  // ── Shared status messages ──────────────────────────────────────────────
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

  const inputClass = theme === "light"
    ? "w-full px-6 py-4 bg-[#f4f4f5] border-none rounded-[24px] text-text-primary placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#b6ef00)] transition-all text-[18px]"
    : "w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm";

  const textareaClass = theme === "light"
    ? "w-full px-6 py-4 bg-[#f4f4f5] border-none rounded-[24px] text-text-primary placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#b6ef00)] transition-all text-[18px] resize-y min-h-[150px]"
    : `${inputClass} resize-y min-h-[150px]`;

  const submitClass = theme === "light"
    ? "w-fit bg-[var(--color-brand-primary,#b6ef00)] hover:opacity-90 text-[#101010] font-normal py-4 px-10 rounded-full transition-all duration-200 text-[18px] cursor-pointer disabled:opacity-50"
    : "w-full bg-green-600 hover:bg-green-500 text-text-light font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const labelClass = theme === "light" 
    ? "sr-only" 
    : "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1";

  // ── Render MODE 1 ───────────────────────────────────────────────────────
  if (finalFields.length > 0) {
    const submitField = finalFields.find((f) => f.type === "custom_submit");
    const btnText = submitField?.label || submitLabel;

    return (
      <form onSubmit={handleDynamicSubmit} className="space-y-4 w-full" style={{ fontFamily: 'Federo, sans-serif' }}>
        {finalFields.map((field) => {
          if (field.type === "custom_submit") return null;

          if (field.type === "recaptcha") {
            return (
              <div key={field.id} className="space-y-1">
                <label className={labelClass}>{field.label}</label>
                <div ref={recaptchaRef} className="recaptcha-container" />
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-1">
              <label className={labelClass}>{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
              {field.type === "textarea" ? (
                <textarea
                  placeholder={`${field.placeholder || ""}${field.required ? " *" : ""}`}
                  value={dynamicData[field.id] || ""}
                  onChange={(e) => setDynamicData((p) => ({ ...p, [field.id]: e.target.value }))}
                  className={textareaClass}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={`${field.placeholder || ""}${field.required ? " *" : ""}`}
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

  // ── Render MODE 2 ───────────────────────────────────────────────────────
  if (formHtml) {
    return (
      <div className="w-full" ref={formRef}>
        <style dangerouslySetInnerHTML={{ __html: `
          .ff-el-group { margin-bottom: 12px; }
          .fluentform-wrapper input,
          .fluentform-wrapper textarea,
          .fluentform-wrapper select {
            width: 100%; padding: 12px 16px;
            background: #18181b; border: 1px solid #3f3f46;
            border-radius: 8px; color: #f4f4f5; font-size: 14px;
            transition: border-color .2s; outline: none;
          }
          .fluentform-wrapper input:focus,
          .fluentform-wrapper textarea:focus { border-color: #22c55e; }
          .fluentform-wrapper button[type="submit"] {
            width: 100%; background: #16a34a; color: #fff;
            padding: 12px 24px; border-radius: 8px;
            font-weight: 600; font-size: 14px; cursor: pointer;
            border: none; transition: background .2s;
          }
          .fluentform-wrapper button[type="submit"]:hover { background: #22c55e; }
          .fluentform-wrapper legend { display: none !important; }
          .ff-errors-in-stack, .text-danger { color: #f87171; font-size: 12px; }
        `}} />
        <div
          className="fluentform-wrapper"
          onSubmit={handleFluentSubmit as any}
          dangerouslySetInnerHTML={{ __html: formHtml }}
        />
        <StatusMessages />
      </div>
    );
  }

  // ── Render MODE 3: Fallback ─────────────────────────────────────────────
  return (
    <form onSubmit={handleFallbackSubmit} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className={labelClass}>Name</label>
        <input type="text" placeholder={theme === "light" ? "Name *" : "Your name"} value={fallbackData.name}
          onChange={(e) => setFallbackData((p) => ({ ...p, name: e.target.value }))}
          className={inputClass} required />
      </div>
      <div className="space-y-1">
        <label className={labelClass}>Email</label>
        <input type="email" placeholder={theme === "light" ? "Email *" : "your@email.com"} value={fallbackData.email}
          onChange={(e) => setFallbackData((p) => ({ ...p, email: e.target.value }))}
          className={inputClass} required />
      </div>
      {theme === "light" && (
        <div className="space-y-1">
          <label className={labelClass}>Company/Website</label>
          <input type="text" placeholder="Company/Website" value={(fallbackData as any).company || ""}
            onChange={(e) => setFallbackData((p) => ({ ...p, company: e.target.value }))}
            className={inputClass} />
        </div>
      )}
      <div className="space-y-1">
        <label className={labelClass}>Message</label>
        <textarea placeholder={theme === "light" ? "News" : "How can we help?"} value={fallbackData.message}
          onChange={(e) => setFallbackData((p) => ({ ...p, message: e.target.value }))}
          className={textareaClass} rows={theme === "light" ? 6 : 4} required />
      </div>
      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
      <StatusMessages />
    </form>
  );
}
