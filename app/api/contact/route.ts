import { NextResponse } from "next/server";

/**
 * app/api/contact/route.ts
 *
 * Contact form submission handler.
 *
 * Flow:
 *   1. Parse request body (JSON or x-www-form-urlencoded / Fluent Forms)
 *   2. POST to WordPress REST API → /wp-json/firebase-form/v1/submit
 *   3. If WP is unreachable → fallback: write directly to Firestore via REST
 *
 * AGENT RULES:
 * - WordPress REST base URL comes from NEXT_PUBLIC_WORDPRESS_REST_URL env var.
 * - Firebase env vars are optional — fallback silently skips if not set.
 * - Never expose Firebase keys on the client side.
 * - Do not change the response shape { success: boolean } — the ContactForm component depends on it.
 */

// ---------------------------------------------------------------------------
// Firestore fallback (used only when WordPress is unreachable)
// ---------------------------------------------------------------------------
async function saveToFirestoreBackup(fields: Record<string, string>) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  const collection = process.env.FIREBASE_COLLECTION || "submissions";

  if (!projectId || !apiKey) {
    console.warn("Firebase env vars not set — skipping Firestore fallback.");
    return;
  }

  const firestoreFields: Record<string, { stringValue: string }> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value != null) {
      firestoreFields[key] = { stringValue: String(value) };
    }
  }
  firestoreFields["submitted_at"] = { stringValue: new Date().toISOString() };

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: firestoreFields }),
      }
    );

    if (!res.ok) {
      console.error("Firestore backup failed:", await res.text());
    } else {
      console.log("Form submission backed up to Firestore.");
    }
  } catch (err) {
    console.error("Firestore backup error:", err);
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
        if (key.startsWith("_") || ["action", "form_id"].includes(key)) continue;

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

      // Auto-detect common field names for WP DB compatibility
      if (!fields.email) {
        const k = Object.keys(body).find((k) => /email|mail/i.test(k));
        if (k) fields.email = body[k];
      }
      if (!fields.name) {
        const k = Object.keys(body).find((k) => /name/i.test(k));
        if (k) fields.name = body[k];
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

          // Do not fall through to Firestore for validation/reCAPTCHA errors
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

    // ── 2. Firestore fallback ───────────────────────────────────────────────
    if (!wpSuccess) {
      console.log("Falling back to Firestore direct write…");
      await saveToFirestoreBackup(fields);
      return NextResponse.json({
        success: true,
        message: "Saved to Firestore (WordPress sync was bypassed).",
        warning: wpErrorMsg,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
