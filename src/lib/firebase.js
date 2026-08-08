/**
 * Firebase client initialization — Modular SDK (tree-shakeable).
 *
 * Config is read from VITE_FIREBASE_* environment variables.
 * These are safe to expose in client code per Firebase's design:
 * security is enforced by Firestore/Storage rules and Cloud Functions,
 * not by hiding the API key.
 *
 * See: https://firebase.google.com/docs/projects/api-keys
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Check if Firebase is configured.
 * When .env.local is missing or empty, the app degrades gracefully
 * rather than crashing.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, db, storage };

/** Firebase region for Cloud Functions — must match functions/index.js */
export const FIREBASE_REGION = import.meta.env.VITE_FIREBASE_REGION || 'asia-south1';
