import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({
  code,
  onChangeCode,
  language,
  fontSize,
  minimapEnabled,
  wordWrap,
  tabSize,
  lineNumbers,
  theme = 'vs-dark',
  onCursorChange,
}) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position for status bar
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });

    // Custom dark theme tweaks
    monaco.editor.defineTheme('codelab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f97583', fontStyle: 'bold' },
        { token: 'string', foreground: '9ecbff' },
        { token: 'number', foreground: '79b8ff' },
        { token: 'type', foreground: 'b392f0' },
      ],
      colors: {
        'editor.background': '#0f141c',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#e6edf3',
        'editorIndentGuide.background': '#21262d',
        'editorIndentGuide.activeBackground': '#30363d',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#1b324b',
      },
    });

    monaco.editor.setTheme(theme === 'vs-dark' ? 'codelab-dark' : theme);
  };

  return (
    <div className="relative w-full h-full bg-[#0f141c] overflow-hidden flex flex-col">
      {/* Editor Header Bar / Tab */}
      <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0f141c] border-t-2 border-indigo-500 border-x border-[#30363d] rounded-t text-xs font-mono text-slate-200">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: language.color }}
            ></span>
            <span>{language.fileName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline-block font-mono bg-[#21262d] px-2 py-0.5 rounded text-slate-400 border border-[#30363d]">
            {language.name} ({language.version})
          </span>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={language.monacoId}
          value={code}
          theme="codelab-dark"
          onChange={(value) => onChangeCode(value || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex flex-col items-center justify-center h-full bg-[#0f141c] text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono">Initializing Monaco Editor...</span>
            </div>
          }
          options={{
            fontSize: fontSize || 14,
            minimap: { enabled: minimapEnabled },
            wordWrap: wordWrap ? 'on' : 'off',
            tabSize: tabSize || 4,
            lineNumbers: lineNumbers ? 'on' : 'off',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
            fontLigatures: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            automaticLayout: true,
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>
    </div>
  );
}
