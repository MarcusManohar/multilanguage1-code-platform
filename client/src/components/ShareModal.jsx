import React, { useState } from 'react';

export default function ShareModal({
  isOpen,
  onClose,
  language,
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/?lang=${language.id}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <h3 className="text-base font-semibold text-white">Share Code Snippet</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Anyone with this link will be able to view and run this {language.name} code snippet in CodeLab.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors shrink-0 shadow-sm"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">File Type</span>
            <span className="font-mono text-indigo-400">{language.fileName} ({language.name})</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d1117] border-t border-[#30363d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
