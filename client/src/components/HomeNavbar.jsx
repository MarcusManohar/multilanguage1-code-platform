import React, { useState } from 'react';

export default function HomeNavbar({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0d1117]/85 backdrop-blur-md border-b border-[#30363d]/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <button
          onClick={(e) => handleNav('/', e)}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Code<span className="text-indigo-400">Lab</span>
          </span>
        </button>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={(e) => handleNav('/', e)}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={(e) => handleNav('/compiler', e)}
            className="hover:text-indigo-400 text-indigo-300 transition-colors flex items-center gap-1"
          >
            <span>Compiler</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Live
            </span>
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
        </div>

        {/* Right: Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={(e) => handleNav('/login', e)}
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors"
          >
            Log In
          </button>
          <button
            onClick={(e) => handleNav('/signup', e)}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] focus:outline-none"
          >
            <svg className="w-6 h-6" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#30363d] bg-[#161b22] px-4 pt-2 pb-5 space-y-3 animate-fade-in">
          <div className="space-y-1">
            <button
              onClick={(e) => handleNav('/', e)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-[#21262d] rounded-md"
            >
              Home
            </button>
            <button
              onClick={(e) => handleNav('/compiler', e)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-indigo-300 hover:bg-[#21262d] rounded-md flex items-center justify-between"
            >
              <span>Compiler</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Live</span>
            </button>
            <button
              onClick={(e) => scrollToSection('languages', e)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-[#21262d] rounded-md"
            >
              Languages
            </button>
            <button
              onClick={(e) => scrollToSection('features', e)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-[#21262d] rounded-md"
            >
              About
            </button>
          </div>
          <div className="pt-3 border-t border-[#30363d] flex flex-col gap-2">
            <button
              onClick={(e) => handleNav('/login', e)}
              className="w-full py-2 text-sm font-medium text-slate-300 bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-colors text-center"
            >
              Log In
            </button>
            <button
              onClick={(e) => handleNav('/signup', e)}
              className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-center shadow-md shadow-indigo-600/30"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
