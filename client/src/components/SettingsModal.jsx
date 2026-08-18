import React from 'react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-base font-semibold text-white">Editor Settings</h3>
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

        {/* Settings Body */}
        <div className="p-5 space-y-4 text-sm text-slate-200">
          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Font Size</div>
              <div className="text-xs text-slate-400">Editor typography scale</div>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="bg-[#0d1117] border border-[#30363d] text-white text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="12">12 px (Compact)</option>
              <option value="14">14 px (Default)</option>
              <option value="16">16 px (Medium)</option>
              <option value="18">18 px (Large)</option>
              <option value="20">20 px (Extra Large)</option>
            </select>
          </div>

          {/* Tab Size */}
          <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
            <div>
              <div className="font-medium text-white">Tab Spacing</div>
              <div className="text-xs text-slate-400">Number of spaces per indent</div>
            </div>
            <select
              value={settings.tabSize}
              onChange={(e) => onUpdateSettings({ tabSize: Number(e.target.value) })}
              className="bg-[#0d1117] border border-[#30363d] text-white text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>

          {/* Minimap Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
            <div>
              <div className="font-medium text-white">Minimap</div>
              <div className="text-xs text-slate-400">Show code outline overview on right</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ minimapEnabled: !settings.minimapEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.minimapEnabled ? 'bg-indigo-600' : 'bg-[#21262d] border border-[#30363d]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.minimapEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Word Wrap Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
            <div>
              <div className="font-medium text-white">Word Wrap</div>
              <div className="text-xs text-slate-400">Wrap long lines to editor viewport</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ wordWrap: !settings.wordWrap })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.wordWrap ? 'bg-indigo-600' : 'bg-[#21262d] border border-[#30363d]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.wordWrap ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Line Numbers Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
            <div>
              <div className="font-medium text-white">Line Numbers</div>
              <div className="text-xs text-slate-400">Display gutter line numbers</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ lineNumbers: !settings.lineNumbers })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.lineNumbers ? 'bg-indigo-600' : 'bg-[#21262d] border border-[#30363d]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.lineNumbers ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d1117] border-t border-[#30363d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
