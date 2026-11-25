import "server-only";
import crypto from "node:crypto";
import { forms, type FormId, type Values } from "./validation";

/**
 * Delivers a validated submission to the configured destinations.
 *
 *   FORMS_WEBHOOK_URL     — CRM / automation webhook (JSON POST)
 *   FORMS_WEBHOOK_SECRET  — optional; adds X-Axtara-Signature: sha256=<hmac of body>
 *   RESEND_API_KEY        — email delivery via the Resend REST API
 *   FORMS_EMAIL_TO        — comma-separated recipients
 *   FORMS_EMAIL_FROM      — verified sender, e.g. "Axtara Website <forms@yourdomain>"
 *
 * Success is reported only if at least one configured destination accepted
 * the submission. With nothing configured the result is "not_configured".
 */
export type DeliveryResult = { status: "delivered"; channels: string[] } | { status: "not_configured" } | { status: "failed"; reason: string };

export function deliveryConfigured(): boolean {
  return Boolean(process.env.FORMS_WEBHOOK_URL || (process.env.RESEND_API_KEY && process.env.FORMS_EMAIL_TO && process.env.FORMS_EMAIL_FROM));
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function deliver(form: FormId, values: Values, meta: { page?: string; receivedAt: string }): Promise<DeliveryResult> {
  if (!deliveryConfigured()) return { status: "not_configured" };

  const payload = { form, subject: forms[form].subject, fields: values, meta };
  const channels: string[] = [];
  const failures: string[] = [];

  if (process.env.FORMS_WEBHOOK_URL) {
    try {
      const body = JSON.stringify(payload);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.FORMS_WEBHOOK_SECRET) {
        headers["X-Axtara-Signature"] = "sha256=" + crypto.createHmac("sha256", process.env.FORMS_WEBHOOK_SECRET).update(body).digest("hex");
      }
      const res = await fetch(process.env.FORMS_WEBHOOK_URL, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
      if (res.ok) channels.push("webhook");
      else failures.push(`webhook ${res.status}`);
    } catch (e) {
      failures.push(`webhook ${(e as Error).name}`);
    }
  }

  if (process.env.RESEND_API_KEY && process.env.FORMS_EMAIL_TO && process.env.FORMS_EMAIL_FROM) {
    const rows = forms[form].fields
      .map((f) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(f.label)}</td><td style="padding:4px 0">${esc(values[f.name] || "—").replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.FORMS_EMAIL_FROM,
          to: process.env.FORMS_EMAIL_TO.split(",").map((s) => s.trim()).filter(Boolean),
          reply_to: values.email || undefined,
          subject: `[Axtara] ${forms[form].subject}${values.company ? ` — ${values.company}` : ""}`,
          html: `<table style="font:14px/1.5 sans-serif">${rows}</table><p style="color:#888;font:12px sans-serif">Received ${esc(meta.receivedAt)}${meta.page ? ` from ${esc(meta.page)}` : ""}</p>`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) channels.push("email");
      else failures.push(`email ${res.status}`);
    } catch (e) {
      failures.push(`email ${(e as Error).name}`);
    }
  }

  if (channels.length) return { status: "delivered", channels };
  return { status: "failed", reason: failures.join(", ") || "unknown" };
}
