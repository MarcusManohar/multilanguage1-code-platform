import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgGlow: 'from-amber-500/10',
      title: '⚡ Fast Execution',
      description: 'Run your programs quickly and get results without leaving your browser.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bgGlow: 'from-emerald-500/10',
      title: '🔒 Secure Execution',
      description: 'Code execution will run inside an isolated environment.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      bgGlow: 'from-indigo-500/10',
      title: '🧑‍💻 Powerful Editor',
      description: 'Write code using a professional Monaco-based editor.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-cyan-400" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      bgGlow: 'from-cyan-500/10',
      title: '💾 Save & Share',
      description: 'Save your programs and share code with others.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#0f141c] border-t border-[#21262d] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-indigo-500/5 blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-2">
            Built for High Performance
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Everything You Need to Code
          </h2>
          <p className="text-base text-slate-400">
            A complete suite of modern developer tools packed into a lightweight online browser workspace.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-7 hover:border-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex gap-5 items-start"
            >
              <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
