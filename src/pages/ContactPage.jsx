import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { submitEnquiry, authorizeUpload, uploadFile } from '../lib/api';
import { isFirebaseConfigured } from '../lib/firebase';
import ImageUpload from '../components/ui/ImageUpload';
import './ContactPage.css';

/* ── Helper: file MIME → allowed? ── */
function isAllowedMime(type) {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(type);
}

const ContactPage = () => {
  // ── Form state ──
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type: 'success'|'error', message, enquiryId? }

  // ── Upload state (shown after successful enquiry submission) ──
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({}); // { fileId: percent }
  const [uploadResult, setUploadResult] = useState(null);

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ── Form submission → Cloud Function ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

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
    if (!submitResult?.enquiryId || uploadFiles.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    const enquiryId = submitResult.enquiryId;
    let successCount = 0;
    let lastError = null;

    for (const fileObj of uploadFiles) {
      const file = fileObj.file;
      const fileId = fileObj.id;

      // Client-side pre-check (server re-validates everything)
      if (!isAllowedMime(file.type)) {
        setUploadProgress(prev => ({ ...prev, [fileId]: -1 }));
        continue;
      }

      try {
        // Step 1: Get signed upload URL from Cloud Function
        setUploadProgress(prev => ({ ...prev, [fileId]: 5 }));
        const auth = await authorizeUpload(enquiryId, file.type, file.size);

        // Step 2: PUT file to signed URL with progress tracking
        await uploadFile(auth.uploadUrl, file, file.type, (percent) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: percent }));
        });

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

                {/* Firebase not configured warning */}
                {!isFirebaseConfigured && (
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
                  disabled={isSubmitting || !isFirebaseConfigured}>
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
                    Upload your design files, reference images, or artwork. Max 5 files, 10 MB each.
                    Accepted: JPG, PNG, WebP, HEIC.
                  </p>
                  <ImageUpload
                    onFilesChange={handleFilesSelected}
                    maxFiles={5}
                    maxSizeMb={10}
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
                    </>
                  )}
                </div>

                <button className="submit-btn secondary-btn"
                  onClick={() => {
                    setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
                    setSubmitResult(null);
                    setUploadFiles([]);
                    setUploadProgress({});
                    setUploadResult(null);
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
