/**
 * API helpers for communicating with Cloud Functions.
 *
 * All sensitive operations (enquiry creation, upload authorization)
 * go through Cloud Functions — never direct Firestore/Storage writes.
 *
 * The client never sees:
 *   - Firebase Admin credentials
 *   - Resend API key
 *   - Internal error details
 *   - Other users' data
 */

import { isFirebaseConfigured, FIREBASE_REGION } from './firebase';

const REQUEST_TIMEOUT_MS = 20_000; // 20 seconds

/**
 * Construct the Cloud Function URL.
 * In production, functions are at:
 *   https://{region}-{projectId}.cloudfunctions.net/{functionName}
 *
 * For local development with Firebase Emulator:
 *   http://localhost:5001/{projectId}/{region}/{functionName}
 */
function getFunctionUrl(functionName) {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  // Check for emulator
  if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
    return `http://localhost:5001/${projectId}/${FIREBASE_REGION}/${functionName}`;
  }

  return `https://${FIREBASE_REGION}-${projectId}.cloudfunctions.net/${functionName}`;
}

/**
 * Call a Cloud Function with JSON body.
 * Handles timeout, HTTP errors, and JSON parsing.
 * Never exposes raw error details to the caller.
 *
 * @param {string} functionName - Cloud Function name.
 * @param {Object} body - JSON body to send.
 * @returns {Promise<Object>} Parsed JSON response.
 * @throws {Error} With user-friendly message.
 */
async function callFunction(functionName, body) {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Please set up .env.local with your Firebase project credentials.'
    );
  }

  const url = getFunctionUrl(functionName);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      // Use server-provided error message (already generic) or fallback
      throw new Error(data.error || 'Request failed. Please try again.');
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    // Re-throw if it's our own error (from the !response.ok block)
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Network error
    throw new Error('Unable to connect. Please check your internet connection.');
  } finally {
    clearTimeout(timeout);
  }
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Submit a contact/enquiry form.
 * @param {Object} formData - { name, email, phone, company?, service, message, categorySlug? }
 * @returns {Promise<{ success: boolean, enquiryId: string }>}
 */
export async function submitEnquiry(formData) {
  return callFunction('submitEnquiry', formData);
}

/**
 * Request a signed upload URL for a file.
 * @param {string} enquiryId - ID from a successful submitEnquiry call.
 * @param {string} contentType - MIME type (e.g., 'image/jpeg').
 * @param {number} fileSize - File size in bytes.
 * @returns {Promise<{ success: boolean, uploadUrl: string, storagePath: string, expiresAt: number }>}
 */
export async function authorizeUpload(enquiryId, contentType, fileSize) {
  return callFunction('authorizeUpload', { enquiryId, contentType, fileSize });
}

/**
 * Upload a file to a signed URL.
 * Uses XMLHttpRequest for upload progress reporting.
 *
 * @param {string} uploadUrl - Signed URL from authorizeUpload.
 * @param {File} file - The file to upload.
 * @param {string} contentType - MIME type (must match what was authorized).
 * @param {Function} [onProgress] - Callback: (percent: number) => void
 * @returns {Promise<void>}
 */
export function uploadFile(uploadUrl, file, contentType, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error('Upload failed. Please try again.'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed. Please check your connection.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled.'));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(file);
  });
}
