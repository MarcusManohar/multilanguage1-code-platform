import React from 'react';
import HomeNavbar from '../components/HomeNavbar';
import HeroSection from '../components/HeroSection';
import LanguageSection from '../components/LanguageSection';
import FeaturesSection from '../components/FeaturesSection';
import CompilerPreviewSection from '../components/CompilerPreviewSection';
import Footer from '../components/Footer';

export default function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Glass Navbar */}
      <HomeNavbar onNavigate={onNavigate} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onNavigate={onNavigate} />

        {/* Languages Showcase Section */}
        <LanguageSection onNavigate={onNavigate} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Large Compiler Preview Section */}
        <CompilerPreviewSection onNavigate={onNavigate} />

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-b from-[#0d1117] via-[#161b22] to-[#0d1117] border-t border-[#21262d] relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to start coding?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl mx-auto">
              Open your workspace and start building across C++, Python, Java, C, and JavaScript today.
            </p>
            <button
              onClick={() => onNavigate('/compiler')}
              className="px-9 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2"
            >
              <span>Start Coding</span>
              <svg className="w-4 h-4" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
