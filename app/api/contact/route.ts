import { NextResponse } from "next/server";

/**
 * app/api/contact/route.ts
 *
 * Contact form submission handler.
 *
 * Flow:
 *   1. Parse request body (JSON or x-www-form-urlencoded / Fluent Forms)
 *   2. POST to WordPress REST API → /wp-json/firebase-form/v1/submit
 *   3. If WP is unreachable → fallback: call submitContact Cloud Function
 *      → clients/{FIREBASE_CLIENT_ID}/contacts/{autoId}
 *
 * AGENT RULES:
 * - WordPress REST base URL comes from NEXT_PUBLIC_WORDPRESS_REST_URL env var.
 * - Firebase env vars are optional — fallback skips if not set.
 * - Never expose FIREBASE_SERVER_SECRET (or any Firebase secrets) to the client.
 * - Do not write soft-delete fields — Cloud Function owns those.
 * - Do not change the response shape { success: boolean } — ContactForm depends on it.
 */

const INTERNAL_FIELD_KEYS = new Set([
  "clientId",
  "serverSecret",
  "name",
  "email",
  "message",
]);

function isStrippedFieldKey(key: string): boolean {
  const lower = key.toLowerCase();
  if (key.startsWith("_")) return true;
  if (lower.includes("recaptcha")) return true;
  if (lower === "g-recaptcha-response") return true;
  return false;
}

// ---------------------------------------------------------------------------
// Firebase submitContact fallback (used only when WordPress is unreachable)
// ---------------------------------------------------------------------------
async function saveViaSubmitContact(
  fields: Record<string, string>
): Promise<boolean> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientId = process.env.FIREBASE_CLIENT_ID;
  const serverSecret = process.env.FIREBASE_SERVER_SECRET;
  const region = process.env.FIREBASE_FUNCTIONS_REGION || "europe-west3";
  const functionUrl =
    process.env.FIREBASE_SUBMIT_FUNCTION_URL ||
    (projectId
      ? `https://${region}-${projectId}.cloudfunctions.net/submitContact`
      : "");

  if (!projectId || !clientId || !serverSecret || !functionUrl) {
    console.warn(
      "Firebase submitContact env vars not set — skipping Cloud Function fallback."
    );
    return false;
  }

  const name = fields.name?.trim();
  const email = fields.email?.trim();
  const message = fields.message?.trim();

  if (!name || !email || !message) {
    console.error(
      "submitContact requires name, email, and message — missing required fields."
    );
    return false;
  }

  const extras: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === "") continue;
    if (isStrippedFieldKey(key)) continue;
    if (INTERNAL_FIELD_KEYS.has(key)) continue;
    extras[key] = String(value);
  }

  try {
    const res = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          clientId,
          serverSecret,
          name,
          email,
          message,
          ...extras,
        },
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.error) {
      console.error("submitContact failed:", data?.error || data || res.status);
      return false;
    }

    console.log("Form submission saved via submitContact Cloud Function.");
    return true;
  } catch (err) {
    console.error("submitContact error:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let fields: Record<string, string> = {};

    // ── Parse body ──────────────────────────────────────────────────────────
    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Fluent Forms format: body = "action=...&form_id=...&data=<url-encoded-fields>"
      const bodyText = await request.text();
      const params = new URLSearchParams(bodyText);
      const rawData = new URLSearchParams(params.get("data") || "");

      for (const [key, value] of rawData.entries()) {
        // Skip internal Fluent Forms metadata keys
        if (key.startsWith("_") || key === "action") continue;
        
        // Retain form_id
        if (key === "form_id") {
            fields["form_id"] = value;
            continue;
        }

        // Unwrap bracket notation: fields[name][0] → name
        let cleanKey = key;
        if (key.includes("[") && key.includes("]")) {
          const matches = [...key.matchAll(/\[(.*?)\]/g)];
          if (matches.length > 0) cleanKey = matches[matches.length - 1][1] || key;
        }

        // Normalise common field name aliases
        if (cleanKey === "input_text") cleanKey = "name";
        if (cleanKey === "input_text_1") cleanKey = "address";
        if (cleanKey === "input_text_2") cleanKey = "plz_ort";
        if (cleanKey === "adresse") cleanKey = "address";
        if (cleanKey === "plzOrt") cleanKey = "plz_ort";

        fields[cleanKey] = value;
      }
    } else {
      // JSON format — used by our ContactForm component (modes 1 & 3)
      const body = await request.json();
      fields = { ...body };
      
      if (body.form_id) {
          fields.form_id = body.form_id;
      }

      // Auto-detect common field names for WP DB compatibility
      if (!fields.email) {
        const k = Object.keys(body).find((k) => /email|mail/i.test(k));
        if (k) fields.email = body[k];
      }
      if (!fields.name) {
        const k = Object.keys(body).find((k) => /name/i.test(k));
        if (k) fields.name = body[k];
      }
      if (!fields.message) {
        const k = Object.keys(body).find((k) => /message|nachricht|msg/i.test(k));
        if (k) fields.message = body[k];
      }
    }

    console.log("Contact form submission fields:", fields);

    // ── 1. Try WordPress REST API ───────────────────────────────────────────
    const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;
    let wpSuccess = false;
    let wpErrorMsg = "";

    if (wpBaseUrl) {
      try {
        const wpRes = await fetch(`${wpBaseUrl}/wp-json/firebase-form/v1/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(fields),
        });

        const wpData = await wpRes.json();

        if (wpRes.ok && wpData.success) {
          wpSuccess = true;
          console.log("Submission forwarded to WordPress successfully.");
          return NextResponse.json({ success: true, ...wpData });
        } else {
          wpErrorMsg = wpData.message || "WordPress REST API rejected the submission.";
          console.warn("WordPress rejected submission:", wpData);

          // Do not fall through to Firebase for validation/reCAPTCHA errors
          const isClientError =
            wpRes.status === 400 ||
            wpRes.status === 403 ||
            (typeof wpData.code === "string" && wpData.code.includes("recaptcha"));

          if (isClientError) {
            return NextResponse.json({ success: false, error: wpErrorMsg }, { status: wpRes.status });
          }
        }
      } catch (wpErr: any) {
        wpErrorMsg = wpErr.message || "WordPress server unreachable.";
        console.error("WordPress REST API error:", wpErr);
      }
    } else {
      wpErrorMsg = "NEXT_PUBLIC_WORDPRESS_REST_URL not configured.";
      console.warn(wpErrorMsg);
    }

    // ── 2. submitContact Cloud Function fallback ────────────────────────────
    if (!wpSuccess) {
      console.log("Falling back to submitContact Cloud Function…");
      const ok = await saveViaSubmitContact(fields);
      if (ok) {
        return NextResponse.json({
          success: true,
          message: "Saved via submitContact (WordPress sync was bypassed).",
          warning: wpErrorMsg,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Form submission failed. WordPress and Firebase fallback both unavailable.",
          warning: wpErrorMsg,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
