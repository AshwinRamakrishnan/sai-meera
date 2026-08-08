import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import Preloader from './components/layout/Preloader';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import CustomCursor from './components/layout/CustomCursor';
import Footer from './components/layout/Footer';

import './App.css';

// Lazy-load pages for code-splitting
const HomePage             = lazy(() => import('./pages/HomePage'));
const CategoryPage         = lazy(() => import('./pages/CategoryPage'));
const ProductsPage         = lazy(() => import('./pages/ProductsPage'));
const FlexBannersPage      = lazy(() => import('./pages/FlexBannersPage'));
const GreetingCardsPage    = lazy(() => import('./pages/GreetingCardsPage'));
const ContactPage          = lazy(() => import('./pages/ContactPage'));

// Page loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      background: '#0a0a0f',
    }}>
      <div style={{
        padding: '2rem 3rem',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        color: 'rgba(240,237,232,0.7)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
      }}>
        LOADING...
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const lenis = useLenis();

  // Scroll to hash on route change
  useEffect(() => {
    if (location.hash && lenis) {
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      }, 100);
    } else if (location.pathname !== '/' && lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location, lenis]);

  return (
    <MotionConfig reducedMotion="user">
      <Preloader isLoading={isLoading} onLoadComplete={() => setIsLoading(false)} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Canonical routes ── */}
            <Route path="/"                element={<HomePage />} />
            <Route path="/products"        element={<ProductsPage />} />
            <Route path="/products/:slug"  element={<CategoryPage />} />
            <Route path="/contact"         element={<ContactPage />} />

            {/* ── Legacy page routes (redirect to canonical) ── */}
            <Route path="/flex-banners"   element={<Navigate to="/products/flex-banner" replace />} />
            <Route path="/greeting-cards" element={<Navigate to="/products/greeting-card" replace />} />

            {/* ── Phase 2 invitation routes (backward compat redirects) ── */}
            <Route path="/invitations"              element={<Navigate to="/products?group=invitations" replace />} />
            <Route path="/invitations/wedding"      element={<Navigate to="/products/hindu-wedding" replace />} />
            <Route path="/invitations/engagement"   element={<Navigate to="/products/engagement" replace />} />
            <Route path="/invitations/baby-shower"  element={<Navigate to="/products/baby-shower" replace />} />
            <Route path="/invitations/valaikaapu"   element={<Navigate to="/products/valaikaapu" replace />} />

            {/* ── Catch-all: unknown routes → catalogue ── */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </MotionConfig>
  );
}

export default App;
