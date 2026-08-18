import React from 'react';

export default function CompilerNavbar({
  currentLanguage,
  isRunning,
  onRunCode,
  onSave,
  onShare,
  onOpenSettings,
  sidebarOpen,
  onToggleSidebar,
  onNavigate,
}) {
  return (
    <header className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 select-none shrink-0 z-30">
      {/* Left: Brand + Home Navigation + Sidebar Toggle + Active File */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          className={`p-1.5 rounded-md transition-colors focus:outline-none ${
            sidebarOpen ? 'text-indigo-400 bg-[#21262d]' : 'text-slate-400 hover:text-white hover:bg-[#21262d]'
          }`}
        >
          <svg className="w-5 h-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo linking to Home */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 focus:outline-none group"
          title="Back to CodeLab Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">
              Code<span className="text-indigo-400">Lab</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Compiler
            </span>
          </div>
        </button>

        {/* Back to Home Link */}
        <button
          onClick={() => onNavigate('/')}
          className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-[#21262d] transition-colors"
        >
          <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Home</span>
        </button>

        {/* Active file pill */}
        <div className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363d] text-xs text-slate-300">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentLanguage.color }}
          ></span>
          <span className="font-mono font-medium">{currentLanguage.fileName}</span>
        </div>
      </div>

      {/* Right: Actions (Save, Share, Settings, Run) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Save Button */}
        <button
          onClick={onSave}
          title="Save code locally (Ctrl+S)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          title="Share code snippet"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Editor Settings"
          className="p-2 text-slate-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Run Code Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md shadow-lg transition-all focus:outline-none ${
            isRunning
              ? 'bg-emerald-700/60 text-emerald-200 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin text-emerald-200" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-current" width="14" height="14" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Run Code</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-emerald-800/60 text-emerald-200 rounded border border-emerald-500/40">
                F5
              </kbd>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
