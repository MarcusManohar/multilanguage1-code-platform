import React, { useState, useCallback, useId, useEffect } from 'react';
import { compareCodeWithAI, analyzeCodeWithAI } from '../services/analysis.service';

/**
 * Metric Progress Bar Component (for Similarity)
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
      {description && <p className="text-[10px] text-slate-500 leading-tight">{description}</p>}
    </div>
  );
}

/**
 * Overall Score Badge (for Similarity)
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
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Code Similarity</div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">{theme.label}</div>
      </div>
      <div className={`text-3xl font-extrabold font-mono ${theme.text}`}>{score}%</div>
    </div>
  );
}

const loadingMessages = ["🤖 Analyzing your code...", "🐛 Checking for bugs...", "💡 Preparing improvements..."];

export default function AnalysisPanel({ code, language, isRunning }) {
  const uid = useId();

  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' or 'similarity'

  // Analyze State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingIndex(0);
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Similarity State
  const [referenceCode, setReferenceCode] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState(null);
  const [compareError, setCompareError] = useState(null);

  const handleAnalyze = useCallback(async () => {
    if (isAnalyzing || isRunning) return;
    if (!code || !code.trim()) {
      setAnalysisError('Editor code is empty. Write or load some code in the editor before analyzing.');
      setAnalysisResult(null);
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const data = await analyzeCodeWithAI({ language: language.id, code });
      if (data?.aiReport?.error) {
        setAnalysisError(data.aiReport.error);
      }
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisError(err.message || 'AI Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, isRunning, code, language]);

  const handleCompare = useCallback(async () => {
    if (isComparing || isRunning) return;
    if (!code || !code.trim()) {
      setCompareError('Editor code is empty. Write or load some code in the editor before analyzing.');
      setCompareResult(null);
      return;
    }
    if (!referenceCode || !referenceCode.trim()) {
      setCompareError('Reference code is empty. Please enter or paste the reference / AI-generated code to compare.');
      setCompareResult(null);
      return;
    }
    setIsComparing(true);
    setCompareError(null);
    setCompareResult(null);
    try {
      const data = await compareCodeWithAI({
        language: language.id,
        studentCode: code,
        referenceCode,
      });
      setCompareResult(data);
    } catch (err) {
      setCompareError(err.message || 'AI-Enhanced Similarity analysis failed. Please try again.');
    } finally {
      setIsComparing(false);
    }
  }, [isComparing, isRunning, code, referenceCode, language]);

  const renderStatusCard = (statusObj) => {
    if (!statusObj) return null;
    const isError = statusObj.status === 'Has errors';
    const isWarning = statusObj.status === 'Mostly correct';

    const bg = isError ? 'bg-rose-500/10' : isWarning ? 'bg-amber-500/10' : 'bg-emerald-500/10';
    const border = isError ? 'border-rose-500/30' : isWarning ? 'border-amber-500/30' : 'border-emerald-500/30';
    const text = isError ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400';
    const icon = isError ? '❌' : isWarning ? '⚠️' : '✅';

    return (
      <div className={`p-4 rounded-xl border ${bg} ${border}`}>
        <div className="flex items-center gap-2 mb-1">
          <span>{icon}</span>
          <span className={`font-bold ${text}`}>{statusObj.status}</span>
        </div>
        <p className="text-xs text-slate-300">{statusObj.explanation}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-200 overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="h-9 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${activeTab === 'analyze' ? 'bg-[#30363d] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'}`}
          >
            🤖 AI Code Analysis
          </button>
          <button
            onClick={() => setActiveTab('similarity')}
            className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${activeTab === 'similarity' ? 'bg-[#30363d] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'}`}
          >
            Code Similarity
          </button>
        </div>

        {activeTab === 'analyze' ? (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all shadow-sm ${
              isAnalyzing || isRunning
                ? 'bg-cyan-800/50 text-cyan-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:shadow-cyan-600/50'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        ) : (
          <button
            onClick={handleCompare}
            disabled={isComparing || isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all shadow-sm ${
              isComparing || isRunning
                ? 'bg-cyan-800/50 text-cyan-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:shadow-cyan-600/50'
            }`}
          >
            {isComparing ? 'Comparing...' : 'Run Similarity Check'}
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        
        {/* Analyze Tab Content */}
        {activeTab === 'analyze' && (
          <div className="space-y-4 animate-fade-in">
            {analysisError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {analysisError}
              </div>
            )}
            
            {!analysisResult && !analysisError && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#21262d] flex items-center justify-center text-xl shadow-inner">
                  🤖
                </div>
                <div className="text-sm font-medium text-slate-300">AI Code Analysis</div>
                <div className="text-xs text-slate-500 max-w-[250px]">
                  Get instant feedback on your code quality, bugs, and improvements.
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                <div className="text-sm font-medium text-slate-300 animate-pulse">
                  {loadingMessages[loadingIndex]}
                </div>
              </div>
            )}

            {analysisResult?.aiReport?.report && !isAnalyzing && (
              <div className="space-y-3">
                {renderStatusCard(analysisResult.aiReport.report.overallStatus)}
                
                {/* Problems */}
                <div className={`p-3 rounded-lg border ${analysisResult.aiReport.report.problems.length > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className={`text-xs font-bold mb-2 flex items-center gap-1.5 ${analysisResult.aiReport.report.problems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <span>🐛</span> Problems
                  </div>
                  {analysisResult.aiReport.report.problems.length > 0 ? (
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                      {analysisResult.aiReport.report.problems.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-300">No major problems found.</p>
                  )}
                </div>

                {/* What It Does */}
                {analysisResult.aiReport.report.whatItDoes && (
                  <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d]">
                    <div className="text-xs font-bold mb-2 text-indigo-400 flex items-center gap-1.5">
                      <span>📖</span> What Your Code Does
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {analysisResult.aiReport.report.whatItDoes}
                    </p>
                  </div>
                )}

                {/* Improvements */}
                {analysisResult.aiReport.report.improvements?.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="text-xs font-bold mb-2 text-amber-400 flex items-center gap-1.5">
                      <span>💡</span> Improvements
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {analysisResult.aiReport.report.improvements.map((imp, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                          <span className="font-semibold text-amber-300">• {imp.suggestion}</span>
                          <span className="pl-3 opacity-80">{imp.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Test Cases */}
                  {analysisResult.aiReport.report.testCases?.length > 0 && (
                    <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d]">
                      <div className="text-xs font-bold mb-2 text-cyan-400 flex items-center gap-1.5">
                        <span>🧪</span> Test Cases
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {analysisResult.aiReport.report.testCases.map((tc, i) => (
                          <li key={i} className="border-l-2 border-cyan-500/50 pl-2">
                            <div className="font-semibold">{tc.description}</div>
                            <div className="opacity-80">Expects: {tc.expectedResult}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Performance */}
                  {analysisResult.aiReport.report.performance?.meaningful && (
                    <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d]">
                      <div className="text-xs font-bold mb-2 text-purple-400 flex items-center gap-1.5">
                        <span>⚡</span> Performance
                      </div>
                      <p className="text-xs text-slate-300">
                        {analysisResult.aiReport.report.performance.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Beginner Tip */}
                {analysisResult.aiReport.report.beginnerTip && (
                  <div className="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-center">
                    <div className="text-xs font-bold text-indigo-300 mb-1">🎯 Quick Tip</div>
                    <p className="text-[11px] text-indigo-200">
                      {analysisResult.aiReport.report.beginnerTip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Similarity Tab Content */}
        {activeTab === 'similarity' && (
          <div className="space-y-4 animate-fade-in">
            {compareError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {compareError}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor={`${uid}-ref-code`} className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Reference Code ({language.name})
              </label>
              <textarea
                id={`${uid}-ref-code`}
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Paste code to compare against editor..."
                rows={4}
                className="w-full bg-[#161b22] text-slate-200 text-xs font-mono border border-[#30363d] rounded-lg p-3 focus:border-cyan-500 custom-scrollbar min-h-[85px]"
              />
            </div>

            {compareResult?.similarity && (
              <div className="space-y-4 border-t border-[#30363d] pt-4">
                <div className="space-y-3">
                  <OverallScoreBadge score={compareResult.similarity.overall} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <SimilarityMeter label="Lexical" value={compareResult.similarity.lexical} />
                    <SimilarityMeter label="Structural" value={compareResult.similarity.structural} />
                    <SimilarityMeter label="Control Flow" value={compareResult.similarity.controlFlow} />
                    <SimilarityMeter label="Complexity" value={compareResult.similarity.complexity} />
                  </div>
                </div>

                {compareResult.aiReport?.report && (
                  <div className="space-y-3 border-t border-[#30363d] pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">AI-Enhanced Similarity</div>
                    <div className="bg-[#161b22] p-3.5 rounded-lg border border-[#30363d] text-xs text-slate-300">
                      <p className="font-semibold text-slate-200 mb-1">Summary</p>
                      <p>{compareResult.aiReport.report.summary}</p>
                    </div>
                  </div>
                )}
                <div className="text-[10px] text-slate-500 italic text-center">
                  Similarity analysis is an analytical signal and does not by itself establish AI use or academic misconduct.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
