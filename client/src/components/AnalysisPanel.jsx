import React, { useState, useCallback, useId } from 'react';
import { compareCodeWithAI } from '../services/analysis.service';

/**
 * Metric Progress Bar Component
 */
function SimilarityMeter({ label, value, description }) {
  const getBarColor = (val) => {
    if (val >= 80) return 'bg-emerald-500 text-emerald-400';
    if (val >= 50) return 'bg-amber-500 text-amber-400';
    return 'bg-rose-500 text-rose-400';
  };

  const colorClass = getBarColor(value);

  return (
    <div className="space-y-1.5 bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <span className={`font-mono font-bold ${colorClass.split(' ')[1]}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[0]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {description && (
        <p className="text-[10px] text-slate-500 leading-tight">{description}</p>
      )}
    </div>
  );
}

/**
 * Overall Score Badge
 */
function OverallScoreBadge({ score }) {
  const getScoreTheme = (val) => {
    if (val >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'High Similarity' };
    if (val >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Moderate Similarity' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'Low Similarity' };
  };

  const theme = getScoreTheme(score);

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${theme.bg} ${theme.border}`}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Overall Code Similarity
        </div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">
          {theme.label}
        </div>
      </div>
      <div className={`text-3xl font-extrabold font-mono ${theme.text}`}>
        {score}%
      </div>
    </div>
  );
}

export default function AnalysisPanel({ code, language, isRunning }) {
  const uid = useId();

  const [referenceCode, setReferenceCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = useCallback(async () => {
    if (isAnalyzing || isRunning) return;

    if (!code || !code.trim()) {
      setError('Editor code is empty. Write or load some code in the editor before analyzing.');
      setResult(null);
      return;
    }

    if (!referenceCode || !referenceCode.trim()) {
      setError('Reference code is empty. Please enter or paste the reference / AI-generated code to compare.');
      setResult(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareCodeWithAI({
        language: language.id,
        studentCode: code,
        referenceCode,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'AI-Enhanced Similarity analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, isRunning, code, referenceCode, language]);

  const aiReport = result?.aiReport?.report;
  const aiModel = result?.aiReport?.model;

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-200 overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="h-9 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Code Similarity & AI Analysis
          <span className="ml-1 text-[10px] text-slate-500 font-normal">
            ({language.name})
          </span>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleCompare}
          disabled={isAnalyzing || isRunning}
          id={`${uid}-analyze-btn`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shadow-sm ${
            isAnalyzing || isRunning
              ? 'bg-cyan-800/50 text-cyan-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:shadow-cyan-600/50'
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing with AI...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run AI Analysis
            </>
          )}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/8 border border-rose-500/20 text-rose-400 text-xs">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Reference Code Editor Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <label
              htmlFor={`${uid}-ref-code`}
              className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Reference / AI-Generated Code ({language.name})
            </label>
            <span className="text-[10px] text-slate-500">
              Paste code to compare against editor
            </span>
          </div>
          <textarea
            id={`${uid}-ref-code`}
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder={`Paste reference or AI-generated ${language.name} code here...`}
            rows={4}
            className="w-full bg-[#161b22] text-slate-200 text-xs font-mono border border-[#30363d] rounded-lg p-3 resize-y focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600 custom-scrollbar min-h-[85px]"
          />
        </div>

        {/* Analysis Results View */}
        {result && result.similarity && (
          <div className="space-y-4 border-t border-[#30363d] pt-4">
            {/* Section 1: Deterministic Similarity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Deterministic Similarity Metrics
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Algorithm Engine v2.0
                </span>
              </div>

              {/* Overall Score Badge */}
              <OverallScoreBadge score={result.similarity.overall} />

              {/* 4 Metric Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <SimilarityMeter
                  label="Lexical Similarity"
                  value={result.similarity.lexical}
                  description="Token sequences, keywords, operators, and literal patterns"
                />
                <SimilarityMeter
                  label="Structural Similarity"
                  value={result.similarity.structural}
                  description="Abstract Syntax Tree hierarchy, node distributions, and nesting"
                />
                <SimilarityMeter
                  label="Control Flow Similarity"
                  value={result.similarity.controlFlow}
                  description="Branching logic, loops, function definitions, and conditions"
                />
                <SimilarityMeter
                  label="Complexity Similarity"
                  value={result.similarity.complexity}
                  description="Cyclomatic complexity, volume, and statement density"
                />
              </div>
            </div>

            {/* Section 2: AI-Enhanced Code Analysis */}
            <div className="space-y-3 border-t border-[#30363d] pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI-Enhanced Code Analysis
                </div>
                {aiModel && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 font-mono">
                    {aiModel}
                  </span>
                )}
              </div>

              {aiReport && (
                <div className="space-y-3">
                  {/* Summary & Interpretation */}
                  <div className="bg-[#161b22] p-3.5 rounded-lg border border-[#30363d] space-y-2">
                    <div className="text-xs font-semibold text-slate-200">
                      Summary
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiReport.summary}
                    </p>
                    {aiReport.similarityInterpretation && (
                      <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-[#30363d]/60">
                        {aiReport.similarityInterpretation}
                      </p>
                    )}
                  </div>

                  {/* Shared Features & Differences Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Shared Features */}
                    <div className="bg-[#161b22] p-3.5 rounded-lg border border-[#30363d] space-y-2">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Shared Features
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {(aiReport.sharedFeatures || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400/80 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Differences */}
                    <div className="bg-[#161b22] p-3.5 rounded-lg border border-[#30363d] space-y-2">
                      <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Differences
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {(aiReport.differences || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400/80 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Technical Observations */}
                  {aiReport.technicalObservations && aiReport.technicalObservations.length > 0 && (
                    <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] space-y-1.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Technical Observations
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {aiReport.technicalObservations.map((obs, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400/80">•</span>
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Assessment */}
                  <div className="bg-[#1a2030] p-3.5 rounded-lg border border-[#30363d] space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200">
                      Assessment
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiReport.assessment}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Official Academic Disclaimer */}
            <div className="p-2.5 rounded-md bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 italic text-center">
              Similarity analysis is an analytical signal and does not by itself establish AI use or academic misconduct.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
