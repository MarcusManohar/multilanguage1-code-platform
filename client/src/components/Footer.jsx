import React from 'react';

export default function Footer({ onNavigate }) {
  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0b0e14] border-t border-[#21262d] py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg text-white">
                Code<span className="text-indigo-400">Lab</span>
              </div>
              <div className="text-xs text-slate-500">Code. Compile. Create.</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/compiler')}
              className="hover:text-indigo-400 text-indigo-300 transition-colors"
            >
              Compiler
            </button>
            <button
              onClick={(e) => scrollToSection('languages', e)}
              className="hover:text-white transition-colors"
            >
              Languages
            </button>
            <button
              onClick={(e) => scrollToSection('features', e)}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="hover:text-white transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 text-center md:text-right">
            © 2026 CodeLab. Built for developers.
          </div>
        </div>
      </div>
    </footer>
  );
}
