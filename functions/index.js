const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// ── Initialize Firebase Admin ────────────────────────────────────
initializeApp();
const db = getFirestore();

// ── Constants ────────────────────────────────────────────────────
const MAX_ENQUIRIES_PER_HOUR = 5;
const MAX_UPLOADS_PER_HOUR = 15;
const MAX_UPLOADS_PER_ENQUIRY = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ENQUIRY_UPLOAD_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const SIGNED_URL_EXPIRY_SECONDS = 15 * 60; // 15 minutes

const ALLOWED_MIME_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
  ["application/pdf", "pdf"],
]);

const VALID_SERVICES = new Set([
  "offset", "flex", "greeting", "photoshop", "invitations",
  "visiting-cards", "photo-frames", "stickers", "other",
]);

// Cloud Functions v2 region — closest to India
const REGION = "asia-south1";

// ── Email template ───────────────────────────────────────────────
const { buildEnquiryEmailHtml } = require("./emailTemplate");

// ── Validation helpers ───────────────────────────────────────────

/**
 * Validate and sanitize a string field.
 * @returns {string|null} sanitized value or null if invalid.
 */
function sanitizeString(value, maxLength) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/** Validate email format (RFC 5322 simplified). */
function isValidEmail(email) {
  // Intentionally strict: no IP literals, no quoted strings.
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
}

/** Validate phone: 10–15 digits, optional leading +, optional spaces/hyphens. */
function sanitizePhone(value) {
  if (typeof value !== "string") return null;
  const digits = value.replace(/[\s\-().+]/g, "");
  if (!/^\d{10,15}$/.test(digits)) return null;
  return value.trim();
}

// ── Rate Limiter (Firestore-based) ───────────────────────────────
/**
 * Server-side rate limiter using Firestore transactions.
 *
 * Identity: In Cloud Functions v2 (backed by Cloud Run), Google Cloud's
 * load balancer manages X-Forwarded-For. The leftmost IP in the chain
 * is the originating client IP, set by Google's infrastructure — not by
 * the client. We hash it before storage for privacy.
 *
 * This is combined with User-Agent as a secondary signal. While UA is
 * client-controlled, it adds entropy against casual abuse. The IP
 * component (infrastructure-provided) is the primary identity.
 *
 * The rate limit state is stored in Firestore with atomic transactions
 * to prevent TOCTOU races.
 */
function getClientIdentifier(req) {
  const xff = req.headers["x-forwarded-for"];
  const ip = xff ? xff.split(",")[0].trim() : req.ip || "unknown";
  const ua = (req.headers["user-agent"] || "").substring(0, 100);
  return crypto
    .createHash("sha256")
    .update(`${ip}|${ua}`)
    .digest("hex")
    .substring(0, 20);
}

/**
 * Check and increment rate limit. Returns true if allowed, false if blocked.
 * Uses Firestore transaction for atomicity.
 */
async function checkRateLimit(identifier, type, maxPerWindow) {
  const windowMs = 3600 * 1000; // 1 hour
  const docRef = db.collection("_rateLimits").doc(`${type}_${identifier}`);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    const now = Date.now();

    if (!doc.exists) {
      tx.set(docRef, { count: 1, windowStart: now, type });
      return true;
    }

    const data = doc.data();
    const elapsed = now - data.windowStart;

    if (elapsed > windowMs) {
      // Window expired — reset
      tx.set(docRef, { count: 1, windowStart: now, type });
      return true;
    }

    if (data.count >= maxPerWindow) {
      return false; // Rate limited
    }

    tx.update(docRef, { count: FieldValue.increment(1) });
    return true;
  });
}

// ── Firebase App Check ───────────────────────────────────────────
/**
 * App Check is DEFERRED for Phase 6.
 *
 * Why: App Check requires reCAPTCHA Enterprise provider configuration
 * in the Firebase Console + client-side SDK integration. This is a
 * console-side setup step that cannot be automated here.
 *
 * When enabled, add to each function's options:
 *   { enforceAppCheck: true }
 * and on the client:
 *   import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
 *   initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider('SITE_KEY') });
 *
 * For now, rate limiting + server-side validation provide abuse protection.
 * App Check should be enabled before production launch.
 */

// ══════════════════════════════════════════════════════════════════
//  FUNCTION 1: submitEnquiry
// ══════════════════════════════════════════════════════════════════
exports.submitEnquiry = onRequest(
  {
    region: REGION,
    cors: true,
    // secrets: ["RESEND_API_KEY"],  // Uncomment when Resend is configured
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (req, res) => {
    // ── Method check ──
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed." });
    }

    try {
      // ── Rate limit ──
      const clientId = getClientIdentifier(req);
      const allowed = await checkRateLimit(clientId, "enquiry", MAX_ENQUIRIES_PER_HOUR);
      if (!allowed) {
        return res.status(429).json({
          error: "Too many submissions. Please try again later.",
        });
      }

      // ── Parse and validate body ──
      const body = req.body || {};

      const name = sanitizeString(body.name, 200);
      if (!name) {
        return res.status(400).json({ error: "Invalid submission." });
      }

      const email = sanitizeString(body.email, 320);
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid submission." });
      }

      const phone = sanitizePhone(body.phone);
      if (!phone) {
        return res.status(400).json({ error: "Invalid submission." });
      }

      const service = sanitizeString(body.service, 50);
      if (!service || !VALID_SERVICES.has(service)) {
        return res.status(400).json({ error: "Invalid submission." });
      }

      const message = sanitizeString(body.message, 5000);
      if (!message) {
        return res.status(400).json({ error: "Invalid submission." });
      }

      // Optional fields
      const company = sanitizeString(body.company, 200) || null;
      const categorySlug = sanitizeString(body.categorySlug, 100) || null;

      // ── Create Firestore document ──
      const enquiryData = {
        name,
        email,
        phone,
        company,
        service,
        message,
        categorySlug,
        status: "new",
        uploadPaths: [],
        uploadCount: 0,
        clientIdHash: clientId, // For server-side correlation, never sent to client
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection("enquiries").add(enquiryData);

      // ── Send notification email via Resend ──
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const { Resend } = require("resend");
          const resend = new Resend(resendApiKey);

          const notificationEmail = process.env.NOTIFICATION_EMAIL || "print@saimeera.in";
          const html = buildEnquiryEmailHtml({
            name, email, phone, company, service, message,
            categorySlug, enquiryId: docRef.id,
          });

          await resend.emails.send({
            from: "Sai Meera Website <noreply@saimeera.in>",
            to: notificationEmail,
            subject: `New Enquiry: ${service} — ${name}`,
            html,
          });
        }
        // If RESEND_API_KEY is not set, silently skip email.
        // Enquiry is still saved to Firestore.
      } catch (emailErr) {
        // Email failure must not fail the enquiry submission.
        // Log for monitoring but don't expose to client.
        console.error("Email notification failed:", emailErr.message);
      }

      // ── Success response — generic, no internal details ──
      return res.status(201).json({
        success: true,
        enquiryId: docRef.id,
      });
    } catch (err) {
      console.error("submitEnquiry error:", err);
      // Generic error — never expose internal details to client
      return res.status(500).json({
        error: "Submission failed. Please try again later.",
      });
    }
  }
);

// ══════════════════════════════════════════════════════════════════
//  FUNCTION 2: authorizeUpload
// ══════════════════════════════════════════════════════════════════
exports.authorizeUpload = onRequest(
  {
    region: REGION,
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 15,
  },
  async (req, res) => {
    // ── Method check ──
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed." });
    }

    try {
      // ── Rate limit ──
      const clientId = getClientIdentifier(req);
      const allowed = await checkRateLimit(clientId, "upload", MAX_UPLOADS_PER_HOUR);
      if (!allowed) {
        return res.status(429).json({
          error: "Too many upload requests. Please try again later.",
        });
      }

      const body = req.body || {};

      // ── Validate enquiryId ──
      const enquiryId = sanitizeString(body.enquiryId, 30);
      if (!enquiryId || !/^[a-zA-Z0-9]+$/.test(enquiryId)) {
        return res.status(400).json({ error: "Invalid request." });
      }

      // ── Validate contentType ──
      const contentType = sanitizeString(body.contentType, 50);
      if (!contentType || !ALLOWED_MIME_TYPES.has(contentType)) {
        return res.status(400).json({ error: "Invalid file type." });
      }

      // ── Validate declared file size ──
      const fileSize = Number(body.fileSize);
      if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "File too large." });
      }

      // ── Verify enquiry exists and is recent ──
      const enquiryRef = db.collection("enquiries").doc(enquiryId);
      const enquiryDoc = await enquiryRef.get();

      if (!enquiryDoc.exists) {
        return res.status(400).json({ error: "Invalid request." });
      }

      const enquiryData = enquiryDoc.data();

      // Check upload window — enquiry must be < 30 minutes old
      const createdAt = enquiryData.createdAt;
      if (createdAt) {
        const ageMs = Date.now() - createdAt.toMillis();
        if (ageMs > ENQUIRY_UPLOAD_WINDOW_MS) {
          return res.status(400).json({
            error: "Upload window has expired. Please submit a new enquiry.",
          });
        }
      }

      // ── Check upload count ──
      const currentCount = enquiryData.uploadCount || 0;
      if (currentCount >= MAX_UPLOADS_PER_ENQUIRY) {
        return res.status(400).json({
          error: `Maximum ${MAX_UPLOADS_PER_ENQUIRY} files allowed per enquiry.`,
        });
      }

      // ── Generate safe storage path ──
      // Server-generated UUID filename — client filename is NEVER used.
      // Extension derived from validated MIME type, not client input.
      const ext = ALLOWED_MIME_TYPES.get(contentType);
      const uuid = crypto.randomUUID();
      const storagePath = `enquiry-uploads/${enquiryId}/${uuid}.${ext}`;

      // Path traversal prevention: all components are server-generated or
      // validated (enquiryId is alphanumeric, uuid is from crypto, ext is
      // from a fixed allowlist). No client strings in the path.

      // ── B2 Client Configuration ──
      const b2Endpoint = process.env.B2_ENDPOINT;
      const b2Region = process.env.B2_REGION;
      const b2Bucket = process.env.B2_BUCKET;
      const b2AccessKeyId = process.env.B2_APPLICATION_KEY_ID;
      const b2SecretAccessKey = process.env.B2_APPLICATION_KEY;

      if (!b2Endpoint || !b2Region || !b2Bucket || !b2AccessKeyId || !b2SecretAccessKey) {
        console.error("Missing B2 configuration in environment secrets.");
        return res.status(500).json({ error: "Storage configuration error." });
      }

      const s3Client = new S3Client({
        endpoint: b2Endpoint,
        region: b2Region,
        credentials: {
          accessKeyId: b2AccessKeyId,
          secretAccessKey: b2SecretAccessKey,
        },
        // B2 S3 API may not support AWS-specific checksums
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
      });

      // ── Generate signed upload URL ──
      const command = new PutObjectCommand({
        Bucket: b2Bucket,
        Key: storagePath,
        ContentType: contentType,
        ContentLength: fileSize,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
      });
      const expiresAt = Date.now() + (SIGNED_URL_EXPIRY_SECONDS * 1000);

      // ── Atomically increment upload count ──
      await enquiryRef.update({
        uploadCount: FieldValue.increment(1),
        uploadPaths: FieldValue.arrayUnion(storagePath),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return res.status(200).json({
        success: true,
        uploadUrl,
        storagePath,
        expiresAt,
      });
    } catch (err) {
      console.error("authorizeUpload error:", err);
      return res.status(500).json({
        error: "Upload authorization failed. Please try again.",
      });
    }
  }
);
