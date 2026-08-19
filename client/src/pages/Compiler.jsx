import React, { useState, useEffect, useCallback } from 'react';
import CompilerNavbar from '../components/CompilerNavbar';
import Sidebar from '../components/Sidebar';
import CodeEditor from '../components/CodeEditor';
import ConsolePanel from '../components/ConsolePanel';
import EvaluationPanel from '../components/EvaluationPanel';
import AnalysisPanel from '../components/AnalysisPanel';
import StatusBar from '../components/StatusBar';
import SettingsModal from '../components/SettingsModal';
import ShareModal from '../components/ShareModal';
import Toast from '../components/Toast';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';
import { runCode } from '../services/execution.service';

export default function Compiler({ onNavigate, initialLanguageId }) {
  // Determine initial language (support ?lang= query or default)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (initialLanguageId) {
      const found = LANGUAGES.find((l) => l.id === initialLanguageId);
      if (found) return found;
    }
    return DEFAULT_LANGUAGE;
  });

  // Code state per language
  const [codes, setCodes] = useState(() => {
    const initial = {};
    LANGUAGES.forEach((lang) => {
      initial[lang.id] = lang.starterCode;
    });
    return initial;
  });

  // Console State
  const [activeConsoleTab, setActiveConsoleTab] = useState('output');
  const [stdin, setStdin] = useState('');
  const [stdout, setStdout] = useState('Run your code to see the output here.');
  const [stderr, setStderr] = useState('No errors.');
  const [isRunning, setIsRunning] = useState(false);

  // Editor Preferences State
  const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });
  const [settings, setSettings] = useState({
    fontSize: 14,
    tabSize: 4,
    minimapEnabled: true,
    wordWrap: false,
    lineNumbers: true,
  });

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toast, setToast] = useState(null);
  // Bottom panel mode: 'console' | 'evaluate' | 'analyze'
  const [bottomPanel, setBottomPanel] = useState('console');

  // Recent files tracking
  const [recentFiles, setRecentFiles] = useState(() => {
    return LANGUAGES.map((lang) => ({
      id: lang.id,
      name: lang.name,
      fileName: lang.fileName,
      editedAt: 'Default',
    }));
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Update initial language if prop changes
  useEffect(() => {
    if (initialLanguageId) {
      const found = LANGUAGES.find((l) => l.id === initialLanguageId);
      if (found && found.id !== currentLanguage.id) {
        setCurrentLanguage(found);
      }
    }
  }, [initialLanguageId, currentLanguage.id]);

  // Update current code
  const handleCodeChange = (newCode) => {
    setCodes((prev) => ({
      ...prev,
      [currentLanguage.id]: newCode,
    }));
  };

  // Language Change
  const handleSelectLanguage = (lang) => {
    setCurrentLanguage(lang);
    showToast(`Switched to ${lang.name}`, 'info');
  };

  // New File / Reset Code
  const handleNewFile = () => {
    const defaultTemplate = currentLanguage.starterCode;
    setCodes((prev) => ({
      ...prev,
      [currentLanguage.id]: defaultTemplate,
    }));
    showToast(`Reset ${currentLanguage.name} code to default template`, 'info');
  };

  // Run Code logic connecting to backend execution endpoint
  const handleRunCode = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setActiveConsoleTab('output');

    const codeToRun = codes[currentLanguage.id] || '';

    if (!codeToRun.trim()) {
      setStdout('');
      setStderr('⚠️ No code\n\nPlease enter some code before running.');
      setActiveConsoleTab('errors');
      setIsRunning(false);
      return;
    }

    try {
      const response = await runCode({
        language: currentLanguage.id,
        code: codeToRun,
        stdin,
      });

      const { success, output, error, exitCode, executionTime } = response;

      if (output !== undefined && output !== null && output !== '') {
        setStdout(output);
      } else if (success) {
        setStdout('(Program executed successfully with no output)');
      } else {
        setStdout('(No standard output)');
      }

      if (error !== undefined && error !== null && error !== '') {
        setStderr(error);
        if (!output || !success) {
          setActiveConsoleTab('errors');
        }
      } else {
        setStderr('No errors.');
      }

      if (success) {
        showToast(
          `Execution complete (${executionTime || '0.00'}s)`,
          'success'
        );
      } else {
        showToast(
          `Execution finished with exit code ${exitCode ?? 1}`,
          'error'
        );
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to execute code';
      setStderr(errorMsg);
      setActiveConsoleTab('errors');
      showToast(errorMsg, 'error');
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, codes, currentLanguage.id, stdin, showToast]);


  // Save Code logic
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('codelab_snippets', JSON.stringify(codes));
      // Update recent file edited time
      setRecentFiles((prev) =>
        prev.map((item) =>
          item.id === currentLanguage.id
            ? { ...item, editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : item
        )
      );
      showToast('All code snippets saved successfully!', 'success');
    } catch {
      showToast('Failed to save to local storage', 'error');
    }
  }, [codes, currentLanguage.id, showToast]);

  // Share Code logic
  const handleShare = () => {
    setIsShareOpen(true);
  };

  // Clear Output
  const handleClearOutput = () => {
    if (activeConsoleTab === 'output') {
      setStdout('Run your code to see the output here.');
    } else if (activeConsoleTab === 'errors') {
      setStderr('No errors.');
    } else if (activeConsoleTab === 'input') {
      setStdin('');
    }
    showToast('Console cleared', 'info');
  };

  // Keyboard Shortcuts (Ctrl+S for save, F5 or Ctrl+Enter for run)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunCode, handleSave]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Compiler Navbar */}
      <CompilerNavbar
        currentLanguage={currentLanguage}
        isRunning={isRunning}
        onRunCode={handleRunCode}
        onSave={handleSave}
        onShare={handleShare}
        onOpenSettings={() => setIsSettingsOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={onNavigate}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          currentLanguage={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
          onNewFile={handleNewFile}
          recentFiles={recentFiles}
          onSelectRecentFile={handleSelectLanguage}
        />

        {/* Center/Right: Code Editor + Bottom Panel */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Editor Container (occupies most of screen) */}
          <div className="flex-1 min-h-0 relative">
            <CodeEditor
              code={codes[currentLanguage.id] || ''}
              onChangeCode={handleCodeChange}
              language={currentLanguage}
              fontSize={settings.fontSize}
              minimapEnabled={settings.minimapEnabled}
              wordWrap={settings.wordWrap}
              tabSize={settings.tabSize}
              lineNumbers={settings.lineNumbers}
              onCursorChange={setCursorPos}
            />
          </div>

          {/* Bottom Area: Panel Mode Switcher + Panel */}
          <div
            className={`bg-[#0d1117] border-t border-[#30363d] flex flex-col transition-all duration-200 ${
              bottomPanel === 'evaluate' || bottomPanel === 'analyze' ? 'h-80' : 'h-48'
            }`}
          >
            {/* Mode Tab Bar */}
            <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center gap-0.5 px-2 shrink-0">
              <button
                id="bottom-tab-console"
                onClick={() => setBottomPanel('console')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-t-md transition-colors ${
                  bottomPanel === 'console'
                    ? 'bg-[#0d1117] text-white border-t-2 border-indigo-500 border-x border-[#30363d]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Console
              </button>

              <button
                id="bottom-tab-evaluate"
                onClick={() => setBottomPanel('evaluate')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-t-md transition-colors ${
                  bottomPanel === 'evaluate'
                    ? 'bg-[#0d1117] text-white border-t-2 border-indigo-500 border-x border-[#30363d]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evaluate
              </button>

              <button
                id="bottom-tab-analyze"
                onClick={() => setBottomPanel('analyze')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-t-md transition-colors ${
                  bottomPanel === 'analyze'
                    ? 'bg-[#0d1117] text-white border-t-2 border-cyan-500 border-x border-[#30363d]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analyze
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {bottomPanel === 'console' && (
                <ConsolePanel
                  activeTab={activeConsoleTab}
                  onTabChange={setActiveConsoleTab}
                  stdin={stdin}
                  onChangeStdin={setStdin}
                  stdout={stdout}
                  stderr={stderr}
                  onClearOutput={handleClearOutput}
                  isRunning={isRunning}
                  embedded
                />
              )}
              {bottomPanel === 'evaluate' && (
                <EvaluationPanel
                  code={codes[currentLanguage.id] || ''}
                  language={currentLanguage}
                  isRunning={isRunning}
                />
              )}
              {bottomPanel === 'analyze' && (
                <AnalysisPanel
                  code={codes[currentLanguage.id] || ''}
                  language={currentLanguage}
                  isRunning={isRunning}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        language={currentLanguage}
        isRunning={isRunning}
        cursorPos={cursorPos}
        tabSize={settings.tabSize}
      />

      {/* Modals & Toast */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        language={currentLanguage}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
