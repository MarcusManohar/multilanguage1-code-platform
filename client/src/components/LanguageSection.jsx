import React from 'react';
import { LANGUAGES } from '../constants/languages';

export default function LanguageSection({ onNavigate }) {
  return (
    <section id="languages" className="py-20 bg-[#0d1117] border-t border-[#21262d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-2">
            Multi-Language Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            One Platform. Every Language.
          </h2>
          <p className="text-base text-slate-400">
            Write code in the language you already know — or explore something new.
          </p>
        </div>

        {/* Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className="bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Icon + Version */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border transition-transform group-hover:scale-105"
                      style={{
                        color: lang.color,
                        backgroundColor: lang.bgColor,
                        borderColor: `${lang.color}40`,
                      }}
                    >
                      {lang.name === 'C++' ? 'C++' : lang.name === 'JavaScript' ? 'JS' : lang.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {lang.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        {lang.fileName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-[#0d1117] px-2.5 py-1 rounded-md border border-[#30363d]">
                    {lang.version}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {lang.description}
                </p>
              </div>

              {/* Try It CTA */}
              <button
                onClick={() => onNavigate(`/compiler?lang=${lang.id}`)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-[#21262d] hover:bg-indigo-600 hover:text-white border border-[#30363d] hover:border-indigo-500 transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
              >
                <span>Try {lang.name}</span>
                <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
