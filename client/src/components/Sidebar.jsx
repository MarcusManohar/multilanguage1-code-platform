import React from 'react';
import { LANGUAGES } from '../constants/languages';

export default function Sidebar({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onNewFile,
  recentFiles,
  onSelectRecentFile,
}) {
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-20 w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
      }`}
      style={{ top: '3.5rem' }}
    >
      {/* Top Action: New File / Reset */}
      <div className="p-3 border-b border-[#30363d]">
        <button
          onClick={onNewFile}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-all shadow-sm active:scale-[0.98]"
        >
          <svg className="w-4 h-4" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New File / Reset Code</span>
        </button>
      </div>

      {/* Language Selector Section */}
      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 px-2">
          Languages
        </div>
        <div className="space-y-1">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1f242c] text-white border border-[#383e4a] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border"
                    style={{
                      color: lang.color,
                      backgroundColor: lang.bgColor,
                      borderColor: `${lang.color}33`,
                    }}
                  >
                    {lang.name === 'C++' ? 'C++' : lang.name === 'JavaScript' ? 'JS' : lang.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className={isSelected ? 'text-white font-semibold' : 'text-slate-300'}>
                      {lang.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {lang.fileName}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {lang.version}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recent Files Section */}
        <div className="mt-6 pt-4 border-t border-[#21262d]">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 px-2 flex items-center justify-between">
            <span>Recent Files</span>
            <span className="text-[10px] text-slate-500">Auto-saved</span>
          </div>

          <div className="space-y-1">
            {recentFiles.map((file) => {
              const isSelected = currentLanguage.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => onSelectRecentFile(file)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#1f242c] text-indigo-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-mono text-[11px] truncate">{file.fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {file.editedAt || 'Saved'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info card at bottom of sidebar */}
        <div className="mt-6 p-3 rounded-lg bg-[#161b22] border border-[#30363d] text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium mb-1">
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Pro Tip</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[10px]">
            Press <kbd className="px-1 py-0.5 bg-[#21262d] rounded text-slate-300 font-mono text-[9px] border border-[#30363d]">Ctrl + S</kbd> to save or click <strong className="text-emerald-400">Run Code</strong> to test your syntax.
          </p>
        </div>
      </div>
    </aside>
  );
}
