import React, { useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle, AlertCircle, CreditCard, IndianRupee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { submitEnquiry, authorizeUpload, uploadFile } from '../lib/api';
import { useRazorpayCheckout } from '../hooks/useRazorpayCheckout';
import { isSupabaseConfigured } from '../lib/supabase';
import { ALL_CATEGORIES } from '../data/categories';
import ImageUpload from '../components/ui/ImageUpload';
import './ContactPage.css';

/* ── Helper: parse price string like '₹8' or '₹1.50' or 'Get a Quote' ── */
function parsePriceRupees(priceStr) {
  if (typeof priceStr !== 'string') return null;
  const cleaned = priceStr.replace(/[₹,\s]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

/* ── Helper: check if a category has any payable tiers ── */
function hasPayableTiers(category) {
  if (!category?.pricing) return false;
  return category.pricing.some(t => parsePriceRupees(t.price) !== null);
}

/* ── Helper: parse minQty string like 'Min 50' or 'Min 1 sqft' ── */
function parseMinQty(minQtyStr) {
  if (typeof minQtyStr !== 'string') return 1;
  const match = minQtyStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/* ── Helper: file MIME → allowed? ── */
function isAllowedMime(type) {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'].includes(type);
}

const ContactPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rawCategory = searchParams.get('category') || '';

  // Map URL category slugs to the exact string expected by the backend VALID_SERVICES
  const categoryMap = {
    'offset-printing': 'offset',
    'flex-banners': 'flex',
    'wedding-cards': 'invitations',
    'greeting-cards': 'greeting',
    'visiting-cards': 'visiting-cards',
    'photo-frames': 'photo-frames',
    'stickers-labels': 'stickers',
    'photoshop-editing': 'photoshop'
  };
  const initialCategory = categoryMap[rawCategory] || '';

  // ── Form state ──
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service: initialCategory, message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type: 'success'|'error', message, enquiryId? }

  // ── Upload state (shown after successful enquiry submission) ──
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({}); // { fileId: percent }
  const [uploadResult, setUploadResult] = useState(null);

  // ── Payment state ──
  const [paymentCategorySlug, setPaymentCategorySlug] = useState(rawCategory || '');
  const [paymentTier, setPaymentTier] = useState('');
  const [paymentQuantity, setPaymentQuantity] = useState('');

  const {
    initiateCheckout,
    paymentLoading,
    paymentError,
    paymentSuccess,
    paymentId,
    setPaymentError,
    setPaymentStatus
  } = useRazorpayCheckout();

  // Map hook states to the old UI status
  const paymentStatus = paymentSuccess ? 'success' : (paymentError ? 'failed' : (paymentLoading ? 'processing' : null));

  const formRef = useRef(null);

  // ── Derived: selected payment category and its tiers ──
  const selectedPaymentCategory = useMemo(
    () => ALL_CATEGORIES.find(c => c.slug === paymentCategorySlug) || null,
    [paymentCategorySlug]
  );
  const payableTiers = useMemo(() => {
    if (!selectedPaymentCategory?.pricing) return [];
    return selectedPaymentCategory.pricing.filter(t => parsePriceRupees(t.price) !== null);
  }, [selectedPaymentCategory]);
  const isQuoteOnly = selectedPaymentCategory && !hasPayableTiers(selectedPaymentCategory);

  // ── Derived: estimated price for display ──
  const estimatedPrice = useMemo(() => {
    if (!paymentTier || !paymentQuantity) return null;
    const tier = payableTiers.find(t => t.name === paymentTier);
    if (!tier) return null;
    const price = parsePriceRupees(tier.price);
    if (price === null) return null;
    const qty = parseInt(paymentQuantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) return null;
    return price * qty;
  }, [paymentTier, paymentQuantity, payableTiers]);

  // ── All categories that have at least some pricing ──
  const payableCategories = useMemo(
    () => ALL_CATEGORIES.filter(c => c.pricing && c.pricing.length > 0),
    []
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ── Form submission → Cloud Function ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    if (!isSupabaseConfigured) {
      setSubmitResult({
        type: 'error',
        message: 'Backend is not configured. Please contact support.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        service: formData.service,
        message: formData.message,
      });

      setSubmitResult({
        type: 'success',
        message: 'Your enquiry has been submitted successfully! We\'ll get back to you soon.',
        enquiryId: result.enquiryId,
      });
    } catch (err) {
      setSubmitResult({
        type: 'error',
        message: err.message || 'Submission failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── File upload after enquiry is created ──
  const handleFilesSelected = (files) => {
    setUploadFiles(files);
  };

  const handleUploadSubmit = async () => {
    console.log('[UPLOAD 1] Upload Files clicked');
    console.log('[UPLOAD 2] files count:', uploadFiles?.length);
    console.log('[UPLOAD 3] enquiryId:', submitResult?.enquiryId);

    if (!submitResult?.enquiryId || uploadFiles.length === 0) {
      console.error('Upload early return: missing enquiryId or empty uploadFiles');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    const enquiryId = submitResult.enquiryId;
    let successCount = 0;
    let lastError = null;

    for (const fileObj of uploadFiles) {
      const file = fileObj.file;
      const fileId = fileObj.id;

      // Skip files that are already successfully uploaded
      if (uploadProgress[fileId] === 100) {
        successCount++;
        continue;
      }

      // Client-side pre-check (server re-validates everything)
      if (!isAllowedMime(file.type)) {
        setUploadProgress(prev => ({ ...prev, [fileId]: -1 }));
        continue;
      }

      try {
        // Step 1: Get signed upload URL from Cloud Function
        setUploadProgress(prev => ({ ...prev, [fileId]: 5 }));
        
        console.log('[UPLOAD 4] starting authorizeUpload:', file.name);
        const auth = await authorizeUpload(enquiryId, file);
        console.log('[UPLOAD 5] authorize-upload response:', auth);

        if (!auth.success || !auth.signedUrl) {
          throw new Error('Could not authorize upload for ' + file.name + ' - Response: ' + JSON.stringify(auth));
        }

        // Step 2: PUT file to signed URL with progress tracking
        console.log('[UPLOAD 6] starting uploadFile:', file.name);
        await uploadFile(auth, file, file.type, (percent) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: percent }));
        });
        console.log('[UPLOAD 9] upload completed for:', file.name);

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        successCount++;
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err.message);
        setUploadProgress(prev => ({ ...prev, [fileId]: -1 }));
        lastError = err.message;
      }
    }

    setIsUploading(false);

    if (successCount === uploadFiles.length) {
      setUploadResult({ type: 'success', message: `${successCount} file(s) uploaded successfully.` });
    } else if (successCount > 0) {
      setUploadResult({ type: 'warning', message: `${successCount}/${uploadFiles.length} files uploaded. Some failed — please retry.` });
    } else {
      setUploadResult({ type: 'error', message: lastError || 'Upload failed. Please try again.' });
    }
  };

  // ── Razorpay payment handler ──
  const handlePayNow = async () => {
    if (!submitResult?.enquiryId || !paymentCategorySlug || !paymentTier || !paymentQuantity) return;

    const qty = parseInt(paymentQuantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) {
      setPaymentError('Please enter a valid quantity.');
      return;
    }

    // Validate minimum quantity client-side (server re-validates)
    const tier = payableTiers.find(t => t.name === paymentTier);
    if (tier) {
      const minQty = parseMinQty(tier.minQty);
      if (qty < minQty) {
        setPaymentError(`Minimum quantity for ${paymentTier} is ${minQty}.`);
        return;
      }
    }

    setPaymentStatus(null);
    setPaymentError('');

    try {
      await initiateCheckout({
        enquiryId: submitResult.enquiryId,
        categorySlug: paymentCategorySlug,
        tier: paymentTier,
        quantity: qty,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        accentColor: '#00d4ff'
      });
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const isSuccess = submitResult?.type === 'success';

  return (
    <div className="contact-container">
      <Helmet>
        <title>Contact Us — Sai Meera Printing</title>
        <meta name="description" content="Get in touch with Sai Meera for a free quote on offset printing, flex banners, invitations, greeting cards, or photoshop editing services in Chennai." />
        <meta property="og:title" content="Contact Sai Meera Printing" />
        <meta property="og:description" content="Reach out for a free quote on premium printing services — invitations, banners, cards, and more." />
      </Helmet>
      <section className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">Have a project in mind? Let's bring your ideas to life with our premium printing solutions.</p>
      </section>

      <section className="contact-content">
        <div className="contact-grid">
          {/* Left: Contact Form */}
          <div className="contact-form-wrapper">
            {!isSuccess ? (
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <h2 className="form-title">Send us a message</h2>

                {/* Supabase not configured warning */}
                {!isSupabaseConfigured && (
                  <div className="form-alert form-alert-warning">
                    <AlertCircle size={16} />
                    <span>Backend not configured. Form submissions are disabled until .env.local is set up.</span>
                  </div>
                )}

                {/* Error message */}
                {submitResult?.type === 'error' && (
                  <div className="form-alert form-alert-error">
                    <AlertCircle size={16} />
                    <span>{submitResult.message}</span>
                  </div>
                )}

                <div className="input-group">
                  <div className="input-field">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your Name" required
                      value={formData.name} onChange={handleChange} maxLength={200}
                      disabled={isSubmitting} />
                  </div>
                  <div className="input-field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="you@example.com" required
                      value={formData.email} onChange={handleChange} maxLength={320}
                      disabled={isSubmitting} />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-field">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="+91 98765 43210" required
                      value={formData.phone} onChange={handleChange} maxLength={20}
                      disabled={isSubmitting} />
                  </div>
                  <div className="input-field">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" placeholder="Your Company"
                      value={formData.company} onChange={handleChange} maxLength={200}
                      disabled={isSubmitting} />
                  </div>
                </div>
                <div className="input-field full-width">
                  <label htmlFor="service">Service Required</label>
                  <select id="service" value={formData.service} onChange={handleChange} required
                    disabled={isSubmitting}>
                    <option value="" disabled>Select a service</option>
                    <option value="offset">Offset Printing</option>
                    <option value="flex">Flex Printing</option>
                    <option value="invitations">Invitations</option>
                    <option value="greeting">Greeting Cards</option>
                    <option value="visiting-cards">Visiting Cards</option>
                    <option value="photo-frames">Photo Frames</option>
                    <option value="stickers">Stickers & Labels</option>
                    <option value="photoshop">Photoshop Editing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-field full-width">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" placeholder="Tell us about your project..." required
                    value={formData.message} onChange={handleChange} maxLength={5000}
                    disabled={isSubmitting}></textarea>
                </div>
                <button type="submit" className="submit-btn"
                  disabled={isSubmitting || !isSupabaseConfigured}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spin-icon" />
                      Submitting...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            ) : (
              /* ── Success state: show confirmation + optional upload ── */
              <div className="contact-form success-state">
                <div className="success-card">
                  <CheckCircle size={48} className="success-icon" />
                  <h2 className="form-title">Enquiry Submitted!</h2>
                  <p className="success-message">{submitResult.message}</p>
                  <p className="success-ref">Reference: <strong>{submitResult.enquiryId}</strong></p>
                </div>

                {/* Optional: attach design files */}
                <div className="upload-section">
                  <h3 className="upload-heading">Attach Design Files (Optional)</h3>
                  <p className="upload-desc">
                    Upload your design files, reference images, or artwork. Max 5 files, 50 MB each.
                    Accepted: JPG, PNG, WebP, HEIC.
                  </p>
                  <ImageUpload
                    onFilesChange={handleFilesSelected}
                    maxFiles={5}
                    maxSizeMb={50}
                  />

                  {uploadFiles.length > 0 && (
                    <>
                      {/* Per-file progress */}
                      {Object.keys(uploadProgress).length > 0 && (
                        <div className="upload-progress-list">
                          {uploadFiles.map(f => {
                            const pct = uploadProgress[f.id];
                            const isFailed = pct === -1;
                            const isDone = pct === 100;
                            return (
                              <div key={f.id} className={`upload-progress-item ${isFailed ? 'failed' : isDone ? 'done' : ''}`}>
                                <span className="upload-file-name">{f.file.name}</span>
                                {isFailed ? (
                                  <span className="upload-status error">Failed</span>
                                ) : isDone ? (
                                  <span className="upload-status success">Done</span>
                                ) : pct !== undefined ? (
                                  <span className="upload-status">{pct}%</span>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {uploadResult && (
                        <div className={`form-alert form-alert-${uploadResult.type === 'success' ? 'success' : 'error'}`}>
                          {uploadResult.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          <span>{uploadResult.message}</span>
                        </div>
                      )}

                      {/* Upload Files button - only show if there are pending files */}
                      {uploadFiles.some(f => uploadProgress[f.id] !== 100) && (
                        <button
                          className="submit-btn upload-btn-submit"
                          onClick={handleUploadSubmit}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 size={18} className="spin-icon" />
                              Uploading...
                            </>
                          ) : 'Upload Files'}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* ── Payment Section ── */}
                <div className="payment-section">
                  <h3 className="upload-heading"><CreditCard size={18} /> Make a Payment (Optional)</h3>

                  {paymentStatus === 'success' ? (
                    <div className="form-alert form-alert-success payment-success-alert">
                      <CheckCircle size={18} />
                      <div>
                        <strong>Payment Successful!</strong>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Payment ID: {paymentId}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="upload-desc">
                        Select your product, tier, and quantity to pay online. The price is calculated by our server.
                      </p>

                      {/* Product selector */}
                      <div className="payment-fields">
                        <div className="input-field">
                          <label htmlFor="paymentCategory">Product</label>
                          <select
                            id="paymentCategory"
                            value={paymentCategorySlug}
                            onChange={(e) => {
                              setPaymentCategorySlug(e.target.value);
                              setPaymentTier('');
                              setPaymentError(null);
                            }}
                          >
                            <option value="" disabled>Select a product</option>
                            {payableCategories.map(c => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Tier selector */}
                        {selectedPaymentCategory && !isQuoteOnly && (
                          <div className="input-field">
                            <label htmlFor="paymentTier">Tier</label>
                            <select
                              id="paymentTier"
                              value={paymentTier}
                              onChange={(e) => {
                                setPaymentTier(e.target.value);
                                setPaymentError(null);
                              }}
                            >
                              <option value="" disabled>Select tier</option>
                              {payableTiers.map(t => (
                                <option key={t.name} value={t.name}>
                                  {t.name} — {t.price}{t.unit} ({t.minQty})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Quantity input */}
                        {paymentTier && (
                          <div className="input-field">
                            <label htmlFor="paymentQty">Quantity</label>
                            <input
                              type="number"
                              id="paymentQty"
                              placeholder={`Min ${parseMinQty(payableTiers.find(t => t.name === paymentTier)?.minQty)}`}
                              min="1"
                              value={paymentQuantity}
                              onChange={(e) => {
                                setPaymentQuantity(e.target.value);
                                setPaymentError(null);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Estimated price display */}
                      {estimatedPrice !== null && (
                        <div className="payment-estimate">
                          <IndianRupee size={14} />
                          <span>Estimated total: <strong>₹{estimatedPrice.toLocaleString('en-IN')}</strong></span>
                          <span className="estimate-note">(final amount confirmed by server)</span>
                        </div>
                      )}

                      {/* Quote-only message */}
                      {isQuoteOnly && (
                        <div className="form-alert form-alert-warning">
                          <AlertCircle size={16} />
                          <span>This product requires a custom quote. Our team will contact you with pricing.</span>
                        </div>
                      )}

                      {/* Payment error */}
                      {paymentError && (
                        <div className="form-alert form-alert-error">
                          <AlertCircle size={16} />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      {/* Pay Now button */}
                      {paymentTier && paymentQuantity && !isQuoteOnly && (
                        <button
                          type="button"
                          className="submit-btn pay-btn"
                          onClick={handlePayNow}
                          disabled={paymentStatus === 'processing'}
                        >
                          {paymentStatus === 'processing' ? (
                            <>
                              <Loader2 size={18} className="spin-icon" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard size={18} />
                              Pay Now{estimatedPrice ? ` — ₹${estimatedPrice.toLocaleString('en-IN')}` : ''}
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>

                <button type="button" className="submit-btn secondary-btn"
                  onClick={() => {
                    setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
                    setSubmitResult(null);
                    setUploadFiles([]);
                    setUploadProgress({});
                    setUploadResult(null);
                    setPaymentCategorySlug('');
                    setPaymentTier('');
                    setPaymentQuantity('');
                    setPaymentStatus(null);
                    setPaymentId(null);
                    setPaymentError(null);
                  }}>
                  Submit Another Enquiry
                </button>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="contact-info-wrapper">
            <div className="info-card">
              <div className="icon-wrapper">
                <MapPin size={24} />
              </div>
              <div className="card-content">
                <h3>Office Location</h3>
                {/* TODO: Replace with real address */}
                <p>Triplicane, Chennai, Tamil Nadu</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-wrapper">
                <Phone size={24} />
              </div>
              <div className="card-content">
                <h3>Direct Lines</h3>
                {/* TODO: Replace with real phone numbers */}
                <p>Sales: +91 98765 43210<br />Support: +91 98765 43211</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-wrapper">
                <Mail size={24} />
              </div>
              <div className="card-content">
                <h3>Email Us</h3>
                {/* TODO: Replace with real email addresses */}
                <p>print@saimeera.in<br />quotes@saimeera.in</p>
              </div>
            </div>

            <div className="info-card business-hours">
              <div className="icon-wrapper">
                <Clock size={24} />
              </div>
              <div className="card-content">
                <h3>Business Hours</h3>
                <p>Monday - Saturday: 9:00 AM to 8:00 PM</p>
                <p className="closed">Sunday: Closed</p>
              </div>
            </div>

            <div className="map-placeholder">
              <div className="map-text">Interactive Map Here</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
