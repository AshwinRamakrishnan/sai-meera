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

import { supabase, isSupabaseConfigured } from './supabase';

async function invokeFunction(functionName, body) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.');
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: body,
  });

  if (error) {
    // Attempt to parse standard Edge Function error format
    let errorMessage = 'Request failed. Please try again.';
    try {
      const errObj = JSON.parse(error.message);
      if (errObj.error) errorMessage = errObj.error;
    } catch (e) {
      errorMessage = error.message || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Edge Functions without an explicit Content-Type: application/json header
  // will be returned as a raw string by the Supabase client.
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  return data;
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Submit a contact/enquiry form.
 * @param {Object} formData - { name, email, phone, company?, service, message, categorySlug? }
 * @returns {Promise<{ success: boolean, enquiryId: string }>}
 */
export async function submitEnquiry(formData) {
  return invokeFunction('submit-enquiry', formData);
}

/**
 * Request a signed upload URL for a file.
 * @param {string} enquiryId - ID from a successful submitEnquiry call.
 * @param {string} contentType - MIME type (e.g., 'image/jpeg').
 * @param {number} fileSize - File size in bytes.
 * @returns {Promise<{ success: boolean, uploadUrl: string, storagePath: string, expiresAt: number }>}
 */
export async function authorizeUpload(enquiryId, file) {
  return invokeFunction('authorize-upload', { 
    enquiryId, 
    fileName: file.name,
    contentType: file.type, 
    fileSize: file.size 
  });
}

/**
 * Upload a file to a signed URL.
 * Uses XMLHttpRequest for upload progress reporting.
 *
 * @param {Object} authData - The authorization object { signedUrl, token }
 * @param {File} file - The file to upload.
 * @param {string} contentType - MIME type (must match what was authorized).
 * @param {Function} [onProgress] - Callback: (percent: number) => void
 * @returns {Promise<void>}
 */
export function uploadFile(authData, file, contentType, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      console.log('[UPLOAD 8] XHR status:', xhr.status);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      console.error('[UPLOAD 8] XHR network error');
      reject(new Error('Upload failed. Please check your connection.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled.'));
    });

    console.log('[UPLOAD 7] XHR PUT started to:', authData.signedUrl);
    xhr.open('PUT', authData.signedUrl, true);
    
    // Supabase createSignedUploadUrl requires the token in the Authorization header
    if (authData.token) {
      xhr.setRequestHeader('Authorization', `Bearer ${authData.token}`);
    }
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.send(file);
  });
}

// ── Razorpay Payment API ─────────────────────────────────────────

/**
 * Create a Razorpay order via Edge Function.
 * The server looks up the price — never send a raw amount.
 *
 * @param {string} enquiryId - UUID from a successful submitEnquiry call.
 * @param {string} categorySlug - Product slug (e.g. 'hindu-wedding').
 * @param {string} tier - Pricing tier name (e.g. 'Premium').
 * @param {number} quantity - Number of units.
 * @returns {Promise<{ success, orderId, razorpayOrderId, amount, currency, key, description }>}
 */
export async function createRazorpayOrder(enquiryId, categorySlug, tier, quantity) {
  return invokeFunction('create-razorpay-order', {
    enquiryId, categorySlug, tier, quantity,
  });
}

/**
 * Verify a Razorpay payment signature server-side.
 *
 * @param {string} razorpay_order_id
 * @param {string} razorpay_payment_id
 * @param {string} razorpay_signature
 * @returns {Promise<{ success, paymentId }>}
 */
export async function verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  return invokeFunction('verify-razorpay-payment', {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
  });
}
