import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Preloader from './components/layout/Preloader';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import CustomCursor from './components/layout/CustomCursor';
import Footer from './components/layout/Footer';

import './App.css';

// Lazy-load pages for code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const InvitationsPage = lazy(() => import('./pages/InvitationsPage'));
const FlexBannersPage = lazy(() => import('./pages/FlexBannersPage'));
const GreetingCardsPage = lazy(() => import('./pages/GreetingCardsPage'));

const ContactPage = lazy(() => import('./pages/ContactPage'));

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
      // Small delay to ensure the page is rendered (especially after Suspense)
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      }, 100);
    } else if (location.pathname !== '/' && lenis) {
      // Scroll to top when navigating to a new page without a hash
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location, lenis]);

  return (
    <>
      <Preloader isLoading={isLoading} onLoadComplete={() => setIsLoading(false)} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/invitations" element={<InvitationsPage />} />
            <Route path="/flex-banners" element={<FlexBannersPage />} />
            <Route path="/greeting-cards" element={<GreetingCardsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
