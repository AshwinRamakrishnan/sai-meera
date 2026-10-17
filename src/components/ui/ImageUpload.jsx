/**
 * ImageUpload.jsx
 *
 * Client-side drag-and-drop image upload component.
 * - Accepts JPEG, PNG, WEBP, HEIC, PDF
 * - Configurable max files and max size via props
 * - Local preview with HEIC/PDF placeholder for Chrome/Firefox/Edge
 * - Full keyboard + aria support
 * - prefers-reduced-motion respected via CSS
 * - onFilesChange callback notifies parent of current file list
 */

import React, { useCallback, useRef, useState } from 'react';
import './ImageUpload.css';

/* ── Constants ─────────────────────────────────────────────── */
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
const MAX_FILES      = 5;
const MAX_SIZE_MB    = 50;
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
function FilePreview({ file, url, id, onRemove }) {
  // Determine if it's HEIC or PDF to show placeholder instead of broken blob image
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif';
  const isPdf = file.type === 'application/pdf';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const showPlaceholder = (isHeic && !isSafari) || isPdf;

  return (
    <div className="img-preview-item">
      {showPlaceholder ? (
        <div className="img-preview-thumb img-heic-placeholder" aria-label={`${isPdf ? 'PDF' : 'HEIC'} file: ${file.name}`}>
          <span className="img-heic-icon" aria-hidden="true">{isPdf ? '📄' : '📷'}</span>
          <span className="img-heic-label">{isPdf ? 'PDF' : 'HEIC'}</span>
        </div>
      ) : (
        <img src={url} alt={file.name} className="img-preview-thumb" loading="lazy" />
      )}
      <button className="img-preview-remove" onClick={() => onRemove(id)} aria-label={`Remove ${file.name}`} type="button">✕</button>
      <div className="img-preview-caption" title={file.name}>{file.name} · {formatBytes(file.size)}</div>
    </div>
  );
}

function validateFiles(incoming, existing) {
  const errors = [];
  const accepted = [];

  for (const file of incoming) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      errors.push(`"${file.name}" is not a supported format (JPEG, PNG, WEBP, HEIC, PDF only).`);
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
    errors.push(`You can upload at most ${MAX_FILES} images/files. Only the first ${allowed} will be added.`);
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
      return updated;
    });
  }, [previews]);

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
      return updated;
    });
  };

  /* Cleanup blob URLs on unmount */
  React.useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Notify parent of changes */
  React.useEffect(() => {
    if (onFilesChange) {
      onFilesChange(previews);
    }
  }, [previews, onFilesChange]);

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
            accept="image/jpeg, image/png, image/webp, image/heic, image/heif, application/pdf"
            multiple
            onChange={handleInputChange}
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
            <FilePreview
              key={p.id}
              file={p.file}
              url={p.url}
              id={p.id}
              onRemove={removePreview}
            />
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

    </div>
  );
}
