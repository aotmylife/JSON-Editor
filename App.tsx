
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, GeneratedClass, Language } from './types';
import { JsonTreeView } from './components/JsonTreeView';
import { ModelOutput } from './components/ModelOutput';
import { ModelGenerator } from './services/modelGenerators';

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "status": "success",\n  "data": {\n    "id": 101,\n    "title": "Build Great Software",\n    "is_active": true,\n    "author": {\n      "name": "Jane Doe",\n      "email": "jane@example.com"\n    },\n    "tags": ["tech", "react", "kotlin"]\n  }\n}');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('PRETTY');
  const [targetLang, setTargetLang] = useState<Language>('KOTLIN');
  const [generatedClasses, setGeneratedClasses] = useState<GeneratedClass[]>([]);

  const generator = new ModelGenerator();

  const handleProcess = useCallback(() => {
    try {
      if (!jsonInput.trim()) {
        setParsedJson(null);
        setError(null);
        return;
      }
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setError(null);
      
      const gClasses = generator.generate(parsed, targetLang);
      setGeneratedClasses(gClasses);
    } catch (e: any) {
      setError(e.message);
      setParsedJson(null);
    }
  }, [jsonInput, targetLang]);

  useEffect(() => {
    handleProcess();
  }, [handleProcess]);

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
      setJsonInput(formatted);
    } catch (e: any) {
      setError("Cannot format invalid JSON: " + e.message);
    }
  };

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(jsonInput));
      setJsonInput(minified);
    } catch (e: any) {
      setError("Cannot minify invalid JSON: " + e.message);
    }
  };

  const clearInput = () => {
    setJsonInput('');
    setParsedJson(null);
    setGeneratedClasses([]);
  };

  const languages: { id: Language; label: string; icon: string }[] = [
    { id: 'KOTLIN', label: 'Kotlin', icon: 'fa-android' },
    { id: 'JAVA', label: 'Java', icon: 'fa-java' },
    { id: 'TYPESCRIPT', label: 'TypeScript', icon: 'fa-js' },
    { id: 'SWIFT', label: 'Swift', icon: 'fa-swift' },
    { id: 'PYTHON', label: 'Python', icon: 'fa-python' },
    { id: 'CSHARP', label: 'C#', icon: 'fa-hashtag' },
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-project-diagram text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">JSON Nexus</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Formatter & Multi-Lang Architect</p>
          </div>
        </div>
        
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setViewMode('PRETTY')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'PRETTY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-align-left mr-2" /> Pretty
          </button>
          <button 
            onClick={() => setViewMode('TREE')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'TREE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-tree mr-2" /> Tree
          </button>
          <button 
            onClick={() => setViewMode('MODELS')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'MODELS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-code mr-2" /> Models
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Pane: Editor */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Input JSON</span>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={handleFormat}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Format JSON (Pretty)"
              >
                <i className="fas fa-magic" />
              </button>
              <button 
                onClick={handleMinify}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Minify JSON (Remove Spaces)"
              >
                <i className="fas fa-compress-arrows-alt" />
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
              <button 
                onClick={clearInput}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Clear"
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            <textarea
              className="w-full h-full bg-transparent p-6 text-slate-200 focus:outline-none resize-none code-font text-sm leading-relaxed"
              spellCheck={false}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here...'
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                  <i className="fas fa-exclamation-circle text-rose-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-rose-500">Invalid JSON Structure</p>
                    <p className="text-xs text-rose-400 mt-1 font-mono break-all">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Visualization / Output */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
             <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${viewMode === 'MODELS' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                {viewMode === 'MODELS' ? 'Model Generator' : 'Data View'}
              </span>
            </div>

            {viewMode === 'MODELS' && (
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as Language)}
                className="bg-slate-700 text-slate-200 text-xs font-bold py-1 px-3 rounded-md border border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            )}

            {viewMode === 'PRETTY' && parsedJson && (
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2))}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700 px-2 py-1 rounded"
              >
                <i className="fas fa-copy" /> Copy
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {!parsedJson && !error ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <i className="fas fa-terminal text-6xl opacity-20" />
                <p className="font-medium">Waiting for input...</p>
              </div>
            ) : parsedJson ? (
              <div className="h-full">
                {viewMode === 'PRETTY' && (
                  <pre className="h-full overflow-auto p-6 code-font text-sm text-emerald-100 bg-[#0d1117]">
                    {JSON.stringify(parsedJson, null, 2)}
                  </pre>
                )}
                {viewMode === 'TREE' && (
                  <JsonTreeView data={parsedJson} />
                )}
                {viewMode === 'MODELS' && (
                  <ModelOutput classes={generatedClasses} language={targetLang} />
                )}
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <i className="fas fa-bug text-6xl opacity-20" />
                <p className="font-medium italic">Fix JSON errors to continue</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between uppercase tracking-widest font-bold">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             UI: {viewMode}
          </span>
          <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
             Lang: {targetLang}
          </span>
        </div>
        <div className="flex gap-4 opacity-50">
          <span>Engine v2.0</span>
          <span>Open Source</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
