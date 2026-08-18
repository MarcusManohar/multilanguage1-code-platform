import React, { useState } from 'react';

export default function ConsolePanel({
  activeTab,
  onTabChange,
  stdin,
  onChangeStdin,
  stdout,
  stderr,
  onClearOutput,
  isRunning,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let contentToCopy = '';
    if (activeTab === 'input') contentToCopy = stdin;
    else if (activeTab === 'output') contentToCopy = stdout;
    else if (activeTab === 'errors') contentToCopy = stderr;

    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`bg-[#0d1117] border-t border-[#30363d] flex flex-col transition-all duration-200 select-none ${
        isExpanded ? 'h-72' : 'h-48'
      }`}
    >
      {/* Console Header & Tabs */}
      <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3 shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          {/* Input Tab */}
          <button
            onClick={() => onTabChange('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
              activeTab === 'input'
                ? 'bg-[#0d1117] text-white border-t-2 border-indigo-500 border-x border-[#30363d]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
            }`}
          >
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Input</span>
            {stdin.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            )}
          </button>

          {/* Output Tab */}
          <button
            onClick={() => onTabChange('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
              activeTab === 'output'
                ? 'bg-[#0d1117] text-white border-t-2 border-emerald-500 border-x border-[#30363d]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
            }`}
          >
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Output</span>
            {stdout && stdout !== 'Run your code to see the output here.' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          {/* Errors Tab */}
          <button
            onClick={() => onTabChange('errors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
              activeTab === 'errors'
                ? 'bg-[#0d1117] text-white border-t-2 border-rose-500 border-x border-[#30363d]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
            }`}
          >
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Errors</span>
            {stderr && stderr !== 'No errors.' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            )}
          </button>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy current tab text"
            className="p-1 rounded hover:text-white hover:bg-[#21262d] transition-colors"
          >
            {copied ? (
              <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>
            ) : (
              <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={onClearOutput}
            title="Clear output"
            className="p-1 rounded hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse panel' : 'Expand panel'}
            className="p-1 rounded hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Console Content Area */}
      <div className="flex-1 overflow-hidden p-3 bg-[#0d1117] font-mono text-xs select-text">
        {/* Input Stdin Tab */}
        {activeTab === 'input' && (
          <div className="h-full flex flex-col">
            <label className="text-[11px] text-slate-500 mb-1 font-sans">
              Provide Standard Input (stdin) for your program:
            </label>
            <textarea
              value={stdin}
              onChange={(e) => onChangeStdin(e.target.value)}
              placeholder="e.g. 5&#10;1 2 3 4 5"
              className="flex-1 w-full p-2.5 bg-[#161b22] text-slate-200 border border-[#30363d] rounded-md resize-none focus:outline-none focus:border-indigo-500 font-mono text-xs custom-scrollbar"
            />
          </div>
        )}

        {/* Output Stdout Tab */}
        {activeTab === 'output' && (
          <div className="h-full overflow-y-auto custom-scrollbar text-slate-300">
            {isRunning ? (
              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing code in isolated environment...</span>
              </div>
            ) : stdout === 'Run your code to see the output here.' ? (
              <span className="text-slate-500 italic">{stdout}</span>
            ) : (
              <pre className="whitespace-pre-wrap font-mono leading-relaxed text-emerald-300">
                {stdout}
              </pre>
            )}
          </div>
        )}

        {/* Errors Stderr Tab */}
        {activeTab === 'errors' && (
          <div className="h-full overflow-y-auto custom-scrollbar text-slate-300">
            {stderr === 'No errors.' ? (
              <span className="text-slate-500 italic">{stderr}</span>
            ) : (
              <pre className="whitespace-pre-wrap font-mono leading-relaxed text-rose-400">
                {stderr}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
