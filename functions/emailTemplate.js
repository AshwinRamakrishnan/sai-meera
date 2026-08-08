/**
 * Email template for enquiry notifications.
 * Pure HTML with inline CSS (email-client safe — no external stylesheets).
 * Never renders client-provided data as raw HTML — all values are text-escaped.
 */

/**
 * Escape HTML entities to prevent XSS in email content.
 * @param {string} str - Raw string from user input.
 * @returns {string} HTML-safe string.
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the notification email HTML for a new enquiry.
 * @param {Object} data - Enquiry data (server-validated).
 * @returns {string} Complete HTML email string.
 */
function buildEnquiryEmailHtml(data) {
  const {
    name,
    email,
    phone,
    company,
    service,
    message,
    categorySlug,
    enquiryId,
  } = data;

  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry — Sai Meera</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#09090b,#1a1a2e);padding:28px 32px;">
              <h1 style="margin:0;color:#f5a623;font-size:20px;font-weight:700;letter-spacing:0.5px;">
                🖨️ New Enquiry Received
              </h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">
                ${escapeHtml(now)} · Ref: ${escapeHtml(enquiryId)}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Name</span><br>
                    <span style="color:#111827;font-size:15px;font-weight:600;">${escapeHtml(name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Email</span><br>
                    <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;font-size:15px;text-decoration:none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Phone</span><br>
                    <a href="tel:${escapeHtml(phone)}" style="color:#2563eb;font-size:15px;text-decoration:none;">${escapeHtml(phone)}</a>
                  </td>
                </tr>
                ${company ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Company</span><br>
                    <span style="color:#111827;font-size:15px;">${escapeHtml(company)}</span>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Service</span><br>
                    <span style="display:inline-block;padding:3px 10px;background:#f5a623;color:#000;border-radius:4px;font-size:13px;font-weight:600;">${escapeHtml(service)}</span>
                    ${categorySlug ? `<span style="margin-left:8px;color:#6b7280;font-size:13px;">(${escapeHtml(categorySlug)})</span>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Message</span><br>
                    <p style="margin:6px 0 0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                This notification was sent from the Sai Meera website contact form.<br>
                Do not reply to this email — respond directly to the customer's email or phone above.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildEnquiryEmailHtml };
