import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Signup({ onNavigate }) {
  const [infoMessage, setInfoMessage] = useState('');

  const handleGoogleAuth = async () => {
    setInfoMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setInfoMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Brand Logo linking back to Home */}
      <div className="mb-8 text-center">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            Code<span className="text-indigo-400">Lab</span>
          </span>
        </button>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1.5">Welcome to CodeLab</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to start coding with CodeLab.
          </p>
        </div>

        {/* Informational Message Banner */}
        {infoMessage && (
          <div className="mb-5 p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-2.5 px-4 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] text-slate-200 hover:text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Log in
          </button>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-6">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
