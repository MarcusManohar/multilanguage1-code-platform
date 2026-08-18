import React from 'react';

export default function StatusBar({
  language,
  isRunning,
  cursorPos,
  tabSize = 4,
}) {
  return (
    <footer className="h-6 bg-[#161b22] border-t border-[#30363d] px-3 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none shrink-0 z-10">
      {/* Left status items */}
      <div className="flex items-center gap-4">
        {/* Ready / Running indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
            }`}
          ></span>
          <span className={isRunning ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
            {isRunning ? 'Compiling...' : 'Ready'}
          </span>
        </div>

        {/* Selected Language indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: language.color }}
          ></span>
          <span>{language.name}</span>
        </div>
      </div>

      {/* Right status items */}
      <div className="flex items-center gap-4">
        {/* Line & Column */}
        <div className="text-slate-300">
          Ln {cursorPos?.lineNumber || 1}, Col {cursorPos?.column || 1}
        </div>

        {/* Indentation */}
        <div className="hidden md:inline-block text-slate-400">
          Spaces: {tabSize}
        </div>

        {/* Encoding */}
        <div className="text-slate-400">
          UTF-8
        </div>

        {/* Platform tag */}
        <div className="hidden lg:flex items-center gap-1 text-indigo-400 font-semibold">
          <span>CodeLab</span>
          <span className="text-[9px] bg-indigo-500/10 px-1 py-0.2 rounded border border-indigo-500/20">
            v1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
