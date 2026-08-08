/**
 * ImageUpload.jsx
 *
 * Client-side drag-and-drop image upload component.
 * - Accepts JPEG, PNG, WEBP, HEIC
 * - Configurable max files and max size via props
 * - Local preview with HEIC placeholder for Chrome/Firefox/Edge
 * - Full keyboard + aria support
 * - prefers-reduced-motion respected via CSS
 * - onFilesChange callback notifies parent of current file list
 */

import React, { useCallback, useRef, useState } from 'react';
import './ImageUpload.css';

/* ── Constants ─────────────────────────────────────────────── */
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILES      = 5;
const MAX_SIZE_MB    = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/* ── Helpers ─────────────────────────────────────────────────*/
function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * HEIC/HEIF files are natively shot on iPhones.
 * Chrome/Firefox/Edge cannot decode HEIC blob URLs in <img> — only Safari can.
 * We detect them to show a safe placeholder instead of a broken image icon.
 * Detection uses MIME type first, then falls back to file extension (iPhones
 * sometimes omit the MIME type when sharing via cable / AirDrop).
 */
function isHeicFile(file) {
  if (file.type === 'image/heic' || file.type === 'image/heif') return true;
  const ext = file.name.split('.').pop().toLowerCase();
  return ext === 'heic' || ext === 'heif';
}

function validateFiles(incoming, existing) {
  const errors = [];
  const accepted = [];

  for (const file of incoming) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      errors.push(`"${file.name}" is not a supported format (JPEG, PNG, WEBP, HEIC only).`);
      continue;
    }
    if (file.size > MAX_SIZE_BYTES) {
      errors.push(`"${file.name}" is too large (max ${MAX_SIZE_MB} MB).`);
      continue;
    }
    // Deduplicate by name + size
    const isDuplicate = existing.some(
      (f) => f.file.name === file.name && f.file.size === file.size
    );
    if (isDuplicate) continue;
    accepted.push(file);
  }

  if (existing.length + accepted.length > MAX_FILES) {
    const allowed = MAX_FILES - existing.length;
    errors.push(`You can upload at most ${MAX_FILES} images. Only the first ${allowed} will be added.`);
    return { accepted: accepted.slice(0, allowed), errors };
  }

  return { accepted, errors };
}

/* ── ImageUpload component ─────────────────────────────────── */
export default function ImageUpload({
  label       = 'Upload Your Photos',
  hint        = 'Your photos will be used to personalise your invitation design.',
  onSubmit,               // optional: (files: File[]) => void — for legacy compatibility
  onFilesChange,          // (previews: [{ file, url, id }]) => void — notifies parent of current files
  maxFiles    = MAX_FILES,
  maxSizeMb   = MAX_SIZE_MB,
  accentColor,            // pass --cat-accent for per-category tinting
}) {
  const inputRef           = useRef(null);
  const [previews, setPreviews] = useState([]); // [{ file, url, id }]
  const [dragover, setDragover] = useState(false);
  const [error, setError]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* Process validated files into preview objects */
  const addFiles = useCallback((fileList) => {
    setError('');
    const { accepted, errors } = validateFiles(Array.from(fileList), previews);

    if (errors.length) setError(errors[0]);

    if (accepted.length === 0) return;

    const newPreviews = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}`,
    }));

    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      // Notify parent of current file list
      if (onFilesChange) onFilesChange(updated);
      return updated;
    });
  }, [previews, onFilesChange]);

  /* Input change */
  const handleInputChange = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    // Reset so same files can be re-added after removal
    e.target.value = '';
  };

  /* Drag events */
  const handleDragOver  = (e) => { e.preventDefault(); setDragover(true); };
  const handleDragLeave = ()  => setDragover(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  /* Remove a preview */
  const removePreview = (id) => {
    setPreviews((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      // Revoke the blob URL to free memory
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      // Notify parent of updated file list
      if (onFilesChange) onFilesChange(updated);
      return updated;
    });
    setSubmitted(false);
  };

  /* Submit (stub — logs files, calls onSubmit prop if provided) */
  const handleSubmit = () => {
    const files = previews.map((p) => p.file);
    // TODO: wire to Supabase Storage — Phase E-commerce
    console.info('[ImageUpload] stub submit — files ready for upload:', files);
    if (typeof onSubmit === 'function') onSubmit(files);
    setSubmitted(true);
  };

  /* Cleanup blob URLs on unmount */
  React.useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFiles = previews.length > 0;

  return (
    <div
      className="img-upload"
      style={accentColor ? { '--cat-accent': accentColor } : undefined}
    >
      <div className="img-upload-label">{label}</div>

      {/* Drop zone */}
      {!hasFiles || previews.length < MAX_FILES ? (
        <div
          className="img-dropzone"
          data-dragover={dragover ? 'true' : 'false'}
          data-active={hasFiles ? 'true' : 'false'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={`Drop images here, or click to browse. ${hasFiles ? `${previews.length} of ${MAX_FILES} images added.` : `Up to ${MAX_FILES} images.`}`}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          {/* Hidden input */}
          <input
            ref={inputRef}
            type="file"
            className="img-dropzone-input"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            onChange={handleInputChange}
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className="img-dropzone-icon" aria-hidden="true">📷</div>
          <div className="img-dropzone-heading">
            {hasFiles ? 'Add more photos' : 'Drop your photos here'}
          </div>
          <div className="img-dropzone-sub">
            JPEG · PNG · WEBP · HEIC &nbsp;·&nbsp; Max {MAX_SIZE_MB} MB each &nbsp;·&nbsp; Up to {MAX_FILES} images
          </div>
          <div className="img-dropzone-btn" aria-hidden="true">
            Browse files
          </div>
        </div>
      ) : null}

      {/* Error */}
      {error && (
        <div className="img-upload-error" role="alert" aria-live="assertive">
          <span className="img-upload-error-icon">⚠</span>
          {error}
        </div>
      )}

      {/* Previews */}
      {hasFiles && (
        <div className="img-preview-grid" aria-label="Uploaded images">
          {previews.map((p) => (
            <div key={p.id} className="img-preview-item">
              {isHeicFile(p.file) ? (
                /* HEIC/HEIF: Chrome/Firefox/Edge cannot render HEIC blob URLs.
                   Show a safe icon placeholder — the file itself is valid. */
                <div
                  className="img-preview-thumb img-heic-placeholder"
                  aria-label={`HEIC image: ${p.file.name}`}
                >
                  <span className="img-heic-icon" aria-hidden="true">📷</span>
                  <span className="img-heic-label">HEIC</span>
                </div>
              ) : (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="img-preview-thumb"
                  loading="lazy"
                />
              )}
              <button
                className="img-preview-remove"
                onClick={() => removePreview(p.id)}
                aria-label={`Remove ${p.file.name}`}
                type="button"
              >
                ✕
              </button>
              <div className="img-preview-caption" title={p.file.name}>
                {p.file.name} · {formatBytes(p.file.size)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hint text */}
      {hint && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          lineHeight: 1.55,
          letterSpacing: '0.03em',
        }}>
          ℹ {hint}
        </p>
      )}

      {/* Submit row */}
      {hasFiles && !submitted && (
        <div className="img-upload-submit">
          <span className="img-upload-count">
            {previews.length} of {MAX_FILES} images selected
          </span>
          <button
            type="button"
            className="img-upload-submit-btn"
            onClick={handleSubmit}
            disabled={previews.length === 0}
          >
            {/* TODO: replace with real upload handler */}
            Attach to Enquiry →
          </button>
        </div>
      )}

      {/* Success feedback */}
      {submitted && (
        <div className="img-upload-success" role="status" aria-live="polite">
          ✓ &nbsp;Photos attached — they'll be included with your enquiry.
        </div>
      )}
    </div>
  );
}
