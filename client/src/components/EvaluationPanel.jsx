import React, { useState, useCallback, useId } from 'react';
import { evaluateCode } from '../services/evaluation.service';

const MAX_TEST_CASES = 20;

const initialTestCase = (id) => ({ id, input: '', expectedOutput: '' });

/**
 * Failure reason badge styling
 */
const REASON_STYLES = {
  Accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  'Wrong Answer': 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  'Compilation Error': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Runtime Error': 'bg-orange-500/10 text-orange-400 border-orange-500/25',
  'Time Limit Exceeded': 'bg-purple-500/10 text-purple-400 border-purple-500/25',
};

function StatusBadge({ reason }) {
  const style = REASON_STYLES[reason] || 'bg-slate-500/10 text-slate-400 border-slate-500/25';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide ${style}`}
    >
      {reason || 'Unknown'}
    </span>
  );
}

function ScoreRing({ score }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score === 100 ? '#34d399' : score >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#21262d" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{score}%</span>
    </div>
  );
}

export default function EvaluationPanel({ code, language, isRunning }) {
  const uid = useId();

  const [testCases, setTestCases] = useState([initialTestCase(1)]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addTestCase = () => {
    if (testCases.length >= MAX_TEST_CASES) return;
    const nextId = Math.max(0, ...testCases.map((t) => t.id)) + 1;
    setTestCases((prev) => [...prev, initialTestCase(nextId)]);
  };

  const removeTestCase = (id) => {
    setTestCases((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTestCase = (id, field, value) => {
    setTestCases((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleEvaluate = useCallback(async () => {
    if (isEvaluating || isRunning) return;
    if (!code || !code.trim()) {
      setError('⚠️ No code\nPlease enter some code before running.');
      setResult(null);
      return;
    }
    if (testCases.length === 0) {
      setError('Add at least one test case before evaluating.');
      setResult(null);
      return;
    }

    setIsEvaluating(true);
    setError(null);
    setResult(null);
    setExpandedIds(new Set());

    try {
      const evalResult = await evaluateCode({
        language: language.id,
        code,
        testCases: testCases.map((tc) => ({
          id: tc.id,
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
        })),
      });
      setResult(evalResult);

      // Auto-expand failed test cases
      const failedIds = new Set(
        (evalResult.testCases || [])
          .filter((tc) => !tc.passed)
          .map((tc) => tc.id)
      );
      setExpandedIds(failedIds);
    } catch (err) {
      setError(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  }, [isEvaluating, isRunning, code, language, testCases]);

  const scoreColor =
    result?.score === 100
      ? 'text-emerald-400'
      : result?.score >= 60
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-9 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Evaluate
          <span className="ml-1 text-[10px] text-slate-500 font-normal">
            {testCases.length}/{MAX_TEST_CASES} test cases
          </span>
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating || isRunning}
          id={`${uid}-evaluate-btn`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shadow-sm ${
            isEvaluating || isRunning
              ? 'bg-indigo-700/50 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50'
          }`}
        >
          {isEvaluating ? (
            <>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Evaluating...
            </>
          ) : (
            <>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Evaluate Code
            </>
          )}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-4">

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/8 border border-rose-500/20 text-rose-400 text-xs">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Evaluation Result */}
          {result && (
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
              {/* Summary row */}
              <div className="flex items-center gap-4 p-4 border-b border-[#30363d]">
                <ScoreRing score={result.score} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1">
                    Evaluation Complete
                  </div>
                  <div className={`text-2xl font-extrabold ${scoreColor}`}>
                    {result.score}%
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {result.passed} / {result.total} test cases passed
                    <span className="mx-2 text-slate-600">•</span>
                    {result.totalExecutionTime}s total
                  </div>
                </div>

                {/* Pass/Fail pill bar */}
                <div className="hidden sm:flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    {result.passed} Passed
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    {result.total - result.passed} Failed
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#21262d]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${result.score}%`,
                    background:
                      result.score === 100
                        ? '#34d399'
                        : result.score >= 60
                        ? '#f59e0b'
                        : '#f43f5e',
                  }}
                />
              </div>

              {/* Test case results list */}
              <div className="divide-y divide-[#21262d]">
                {(result.testCases || []).map((tc, idx) => {
                  const isExpanded = expandedIds.has(tc.id);
                  return (
                    <div key={tc.id} className="group">
                      <button
                        onClick={() => toggleExpand(tc.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#21262d] transition-colors"
                        id={`${uid}-tc-${tc.id}`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            tc.passed ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                          }`}
                        >
                          {tc.passed ? (
                            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>

                        {/* Label */}
                        <span className="text-xs font-medium text-slate-300 flex-1">
                          Test {tc.id !== undefined ? tc.id : idx + 1}
                        </span>

                        {/* Time */}
                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                          {tc.executionTime}s
                        </span>

                        {/* Status badge */}
                        {tc.passed ? (
                          <StatusBadge reason="Accepted" />
                        ) : (
                          <StatusBadge reason={tc.failureReason || 'Wrong Answer'} />
                        )}

                        {/* Expand chevron */}
                        <svg
                          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="px-4 pb-3 bg-[#0d1117] border-t border-[#21262d] space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                                Expected Output
                              </div>
                              <pre className="font-mono text-xs text-emerald-300 bg-[#0f2b1d] border border-emerald-900/40 rounded-md px-2.5 py-2 whitespace-pre overflow-x-auto min-h-[2rem] custom-scrollbar">
                                {tc.expectedOutput || '(empty)'}
                              </pre>
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                                Actual Output
                              </div>
                              <pre
                                className={`font-mono text-xs border rounded-md px-2.5 py-2 whitespace-pre overflow-x-auto min-h-[2rem] custom-scrollbar ${
                                  tc.passed
                                    ? 'text-emerald-300 bg-[#0f2b1d] border-emerald-900/40'
                                    : 'text-rose-300 bg-[#2b0f0f] border-rose-900/40'
                                }`}
                              >
                                {tc.actualOutput || '(empty)'}
                              </pre>
                            </div>
                          </div>

                          {tc.error && (
                            <div className="min-w-0">
                              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                                Error
                              </div>
                              <pre className="font-mono text-xs text-amber-300 bg-amber-950/30 border border-amber-900/30 rounded-md px-2.5 py-2 whitespace-pre overflow-x-auto max-h-24 overflow-y-auto custom-scrollbar">
                                {tc.error}
                              </pre>
                            </div>
                          )}

                          <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-0.5">
                            <span>⏱ {tc.executionTime}s</span>
                            {tc.memory && tc.memory !== '0' && (
                              <span>🧠 {(parseInt(tc.memory, 10) / 1024).toFixed(1)} MB</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Test Case Editor */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-0.5">
              Test Cases
            </div>

            {testCases.map((tc, idx) => (
              <div
                key={tc.id}
                className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden"
              >
                {/* Test case header */}
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#30363d] bg-[#1a2030]">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/15 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-indigo-400">{idx + 1}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Test Case {idx + 1}</span>
                  <div className="flex-1" />
                  {testCases.length > 1 && (
                    <button
                      onClick={() => removeTestCase(tc.id)}
                      title="Remove test case"
                      className="p-0.5 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Test case body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#30363d]">
                  {/* Input */}
                  <div className="p-2.5">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Input (stdin)
                    </label>
                    <textarea
                      id={`${uid}-tc-input-${tc.id}`}
                      value={tc.input}
                      onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                      placeholder="e.g. 5"
                      rows={3}
                      className="w-full bg-[#0d1117] text-slate-200 text-xs font-mono border border-[#30363d] rounded-md px-2.5 py-2 resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700 custom-scrollbar"
                    />
                  </div>
                  {/* Expected Output */}
                  <div className="p-2.5">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Expected Output
                    </label>
                    <textarea
                      id={`${uid}-tc-expected-${tc.id}`}
                      value={tc.expectedOutput}
                      onChange={(e) => updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                      placeholder="e.g. 10"
                      rows={3}
                      className="w-full bg-[#0d1117] text-slate-200 text-xs font-mono border border-[#30363d] rounded-md px-2.5 py-2 resize-none focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-700 custom-scrollbar"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add test case button */}
            {testCases.length < MAX_TEST_CASES && (
              <button
                onClick={addTestCase}
                id={`${uid}-add-tc-btn`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-[#30363d] text-xs text-slate-500 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 group-hover:scale-110"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Test Case
                <span className="text-[10px] text-slate-600">
                  ({testCases.length}/{MAX_TEST_CASES})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
