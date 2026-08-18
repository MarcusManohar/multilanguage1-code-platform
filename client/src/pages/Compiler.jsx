import React, { useState, useEffect, useCallback } from 'react';
import CompilerNavbar from '../components/CompilerNavbar';
import Sidebar from '../components/Sidebar';
import CodeEditor from '../components/CodeEditor';
import ConsolePanel from '../components/ConsolePanel';
import StatusBar from '../components/StatusBar';
import SettingsModal from '../components/SettingsModal';
import ShareModal from '../components/ShareModal';
import Toast from '../components/Toast';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';

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

  // Run Code logic (Mock / Hackathon preview)
  const handleRunCode = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setActiveConsoleTab('output');

    setTimeout(() => {
      setIsRunning(false);
      setStdout('Code execution will be connected to the backend in the next stage.');
      setStderr('No errors.');
      showToast('Execution preview complete', 'success');
    }, 700);
  }, [isRunning, showToast]);

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

        {/* Center/Right: Code Editor + Console */}
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

          {/* Bottom Console Panel */}
          <ConsolePanel
            activeTab={activeConsoleTab}
            onTabChange={setActiveConsoleTab}
            stdin={stdin}
            onChangeStdin={setStdin}
            stdout={stdout}
            stderr={stderr}
            onClearOutput={handleClearOutput}
            isRunning={isRunning}
          />
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
