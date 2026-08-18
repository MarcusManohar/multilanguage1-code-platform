import React from 'react';

export default function HeroSection({ onNavigate }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm shadow-indigo-500/10">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span>YOUR CODING LAB, ONLINE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Code.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Compile.
            </span>{' '}
            Create.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto font-normal">
            Write, run, test, and experiment across multiple programming languages in one powerful online workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/compiler')}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Coding</span>
              <svg className="w-4 h-4" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto px-7 py-3.5 text-base font-medium text-slate-200 hover:text-white bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-xl transition-all shadow-sm active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero Product Visual (Floating IDE Mockup + Floating Cards) */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main IDE Window */}
          <div className="rounded-2xl bg-[#0f141c] border border-[#30363d] shadow-2xl shadow-black/80 overflow-hidden relative backdrop-blur-xl">
            {/* Window Title Bar */}
            <div className="h-11 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="ml-3 flex items-center gap-2 px-3 py-1 bg-[#0f141c] border-t-2 border-indigo-500 border-x border-[#30363d] rounded-t text-xs font-mono text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-[#00599C]"></span>
                  <span>main.cpp</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-[#21262d] px-2.5 py-0.5 rounded border border-[#30363d]">
                  <span>C++ (GCC 13.2)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold shadow-sm">
                  <svg className="w-3 h-3 fill-current" width="12" height="12" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Run</span>
                </div>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto select-none">
              <div className="flex gap-4">
                {/* Line numbers */}
                <div className="text-slate-600 text-right select-none font-mono flex flex-col gap-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                </div>

                {/* Syntax highlighted code */}
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="text-pink-400 font-semibold">#include</span>{' '}
                    <span className="text-indigo-300">&lt;iostream&gt;</span>
                  </div>
                  <div className="text-slate-500">&nbsp;</div>
                  <div>
                    <span className="text-purple-400 font-semibold">int</span>{' '}
                    <span className="text-blue-400">main</span>() &#123;
                  </div>
                  <div className="pl-6">
                    <span className="text-cyan-400">std</span>::
                    <span className="text-slate-200">cout</span> &lt;&lt;{' '}
                    <span className="text-emerald-300">"Hello, CodeLab!"</span>;
                  </div>
                  <div className="pl-6">
                    <span className="text-pink-400 font-semibold">return</span>{' '}
                    <span className="text-amber-400">0</span>;
                  </div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>

            {/* Output Panel inside IDE Mockup */}
            <div className="border-t border-[#30363d] bg-[#0d1117] p-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-[#21262d] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-slate-200">Output</span>
                </div>
                <span className="text-emerald-400 font-medium">Exit code: 0 (Success)</span>
              </div>
              <div className="font-mono text-xs text-emerald-300 bg-[#161b22] p-3 rounded border border-[#21262d]">
                Hello, CodeLab!
              </div>
            </div>
          </div>

          {/* Floating UI Badges/Cards around IDE */}
          {/* Card 1: Top Right - Code Executed */}
          <div className="hidden sm:flex absolute -top-5 -right-6 items-center gap-2 px-3.5 py-2 bg-[#161b22]/90 border border-emerald-500/40 rounded-xl shadow-xl backdrop-blur-md animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <div className="text-xs font-semibold text-emerald-200">Code executed</div>
          </div>

          {/* Card 2: Right Middle - Execution Speed */}
          <div className="hidden md:flex absolute top-1/2 -right-10 items-center gap-2.5 px-3.5 py-2 bg-[#161b22]/90 border border-indigo-500/40 rounded-xl shadow-xl backdrop-blur-md">
            <span className="text-amber-400 text-xs">⚡</span>
            <div className="text-xs font-mono font-medium text-slate-200">0.42s execution</div>
          </div>

          {/* Card 3: Top Left - Language Tag */}
          <div className="hidden md:flex absolute -top-4 -left-6 items-center gap-2 px-3.5 py-2 bg-[#161b22]/90 border border-[#30363d] rounded-xl shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00599C]"></span>
            <span className="text-xs font-mono text-slate-200">C++ • GCC 13.2</span>
          </div>

          {/* Card 4: Bottom Left - Fast Terminal Output */}
          <div className="hidden sm:flex absolute -bottom-5 -left-6 items-center gap-2 px-3.5 py-2 bg-[#161b22]/90 border border-cyan-500/30 rounded-xl shadow-xl backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <div className="text-xs font-mono text-cyan-200">Output: Hello, CodeLab!</div>
          </div>
        </div>
      </div>
    </section>
  );
}
