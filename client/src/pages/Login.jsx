import React, { useState } from 'react';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setInfoMessage('Authentication will be connected with Supabase.');
  };

  const handleGoogleAuth = () => {
    setInfoMessage('Google OAuth will be connected with Supabase.');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMessage('Password recovery will be connected with Supabase.');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

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

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Log in to continue coding with CodeLab.
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-[0.98] mt-2"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#30363d]"></div>
          </div>
          <span className="relative px-3 bg-[#161b22] text-slate-500 text-xs uppercase tracking-wider">
            Or
          </span>
        </div>

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
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Sign up
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
