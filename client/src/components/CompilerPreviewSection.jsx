import React from 'react';

export default function CompilerPreviewSection({ onNavigate }) {
  return (
    <section className="py-20 bg-[#0d1117] border-t border-[#21262d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-2">
            IDE Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Your Entire Coding Workspace.
          </h2>
          <p className="text-base text-slate-400">
            Everything you need to write, test, and experiment with code — right in your browser.
          </p>
        </div>

        {/* Large Compiler Mockup */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0f141c] border border-[#30363d] shadow-2xl overflow-hidden">
          {/* Top Bar */}
          <div className="h-12 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
                <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
                <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 ml-2">
                <span className="font-bold text-white">CodeLab</span>
                <span className="text-slate-500">/</span>
                <span className="text-indigo-400">workspace</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/compiler')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <svg className="w-3 h-3 fill-current" width="12" height="12" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Run Code</span>
            </button>
          </div>

          {/* Body: Sidebar + Editor + Console Preview */}
          <div className="flex flex-col md:flex-row h-96">
            {/* Sidebar Preview */}
            <div className="hidden md:block w-48 bg-[#0d1117] border-r border-[#30363d] p-3 text-xs">
              <div className="text-[10px] uppercase font-semibold text-slate-500 mb-2">Languages</div>
              <div className="space-y-1">
                <div className="px-2.5 py-1.5 rounded bg-[#1f242c] text-indigo-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00599C]"></span>
                  <span>C++ (main.cpp)</span>
                </div>
                <div className="px-2.5 py-1.5 text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3776AB]"></span>
                  <span>Python (main.py)</span>
                </div>
                <div className="px-2.5 py-1.5 text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EA2D2E]"></span>
                  <span>Java (Main.java)</span>
                </div>
                <div className="px-2.5 py-1.5 text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F7DF1E]"></span>
                  <span>JS (index.js)</span>
                </div>
              </div>
            </div>

            {/* Editor & Console Preview Area */}
            <div className="flex-1 flex flex-col bg-[#0f141c]">
              {/* Code Area */}
              <div className="flex-1 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-hidden">
                <div className="text-pink-400 font-semibold">#include &lt;iostream&gt;</div>
                <div className="text-pink-400 font-semibold">#include &lt;vector&gt;</div>
                <div className="text-pink-400 font-semibold">#include &lt;numeric&gt;</div>
                <div className="text-slate-500 mt-1">// Competitive coding & algorithm testing</div>
                <div className="text-purple-400 font-semibold mt-1">int <span className="text-blue-400">main</span>() &#123;</div>
                <div className="pl-4 text-slate-300">std::vector&lt;<span className="text-purple-400">int</span>&gt; nums = &#123;10, 20, 30, 40, 50&#125;;</div>
                <div className="pl-4 text-cyan-400">std::cout &lt;&lt; <span className="text-emerald-300">"Total sum: "</span> &lt;&lt; std::accumulate(nums.begin(), nums.end(), 0) &lt;&lt; <span className="text-emerald-300">"\n"</span>;</div>
                <div className="pl-4 text-pink-400">return <span className="text-amber-400">0</span>;</div>
                <div>&#125;</div>
              </div>

              {/* Console Tabs Preview */}
              <div className="h-32 bg-[#0d1117] border-t border-[#30363d] p-3 text-xs font-mono">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#21262d] text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Output
                  </span>
                  <span>•</span>
                  <span>Input (stdin)</span>
                  <span>•</span>
                  <span>Errors (0)</span>
                </div>
                <div className="text-emerald-300">
                  Total sum: 150
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">
                  [Process finished with exit code 0 • Execution time: 0.38s]
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('/compiler')}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all inline-flex items-center gap-2 active:scale-95"
          >
            <span>Open Compiler</span>
            <svg className="w-4 h-4" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
