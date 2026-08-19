import React, { useState, useEffect, useCallback } from 'react';
import Home from './pages/Home';
import Compiler from './pages/Compiler';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  // Parse path & params from window.location
  const parseLocation = useCallback(() => {
    const pathname = window.location.pathname || '/';
    const searchParams = new URLSearchParams(window.location.search);
    const lang = searchParams.get('lang');

    // Normalize route
    let route = pathname;
    if (pathname.endsWith('/') && pathname.length > 1) {
      route = pathname.slice(0, -1);
    }

    return {
      route: route || '/',
      params: { lang },
    };
  }, []);

  const [locationState, setLocationState] = useState(parseLocation);

  // Custom navigate function for clean SPA routing without extra dependencies
  const navigate = useCallback((url) => {
    const targetUrl = new URL(url, window.location.origin);
    const pathname = targetUrl.pathname || '/';
    const lang = targetUrl.searchParams.get('lang');

    let normalizedRoute = pathname;
    if (pathname.endsWith('/') && pathname.length > 1) {
      normalizedRoute = pathname.slice(0, -1);
    }

    window.history.pushState({}, '', url);
    setLocationState({
      route: normalizedRoute || '/',
      params: { lang },
    });

    window.scrollTo(0, 0);
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setLocationState(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseLocation]);

  // Route matching
  const { route, params } = locationState;

  const renderRoute = () => {
    if (route === '/compiler') {
      return <Compiler onNavigate={navigate} initialLanguageId={params.lang} />;
    }
    if (route === '/login') {
      return <Login onNavigate={navigate} />;
    }
    if (route === '/signup') {
      return <Signup onNavigate={navigate} />;
    }
    return <Home onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      {renderRoute()}
    </AuthProvider>
  );
}
