
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, GeneratedClass, Language, ThemeType } from './types';
import { JsonTreeView } from './components/JsonTreeView';
import { ModelOutput } from './components/ModelOutput';
import { ModelGenerator } from './services/modelGenerators';
import { THEMES } from './constants/themes';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "status": "success",\n  "data": {\n    "id": 101,\n    "title": "Build Great Software",\n    "is_active": true,\n    "author": {\n      "name": "Jane Doe",\n      "email": "jane@example.com"\n    },\n    "tags": ["tech", "react", "kotlin"]\n  }\n}');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('PRETTY');
  const [targetLang, setTargetLang] = useState<Language>('KOTLIN');
  const [themeType, setThemeType] = useState<ThemeType>('NEXUS');
  const [generatedClasses, setGeneratedClasses] = useState<GeneratedClass[]>([]);
  const [isFixing, setIsFixing] = useState<boolean>(false);

  const currentTheme = THEMES[themeType];
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

  const handleFix = async () => {
    if (!jsonInput.trim()) return;
    
    setIsFixing(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Repair this broken JSON and return ONLY the valid, correctly structured JSON string. Do not wrap in markdown code blocks. Correct missing quotes, trailing commas, or incorrect brackets:\n\n${jsonInput}`,
        config: {
          systemInstruction: "You are a professional JSON repair engine. Your only output must be valid JSON text. No explanations, no markdown.",
          temperature: 0.1,
        },
      });

      const fixed = response.text?.trim() || "";
      // Clean up in case the model added markdown blocks despite instructions
      const cleaned = fixed.replace(/^```json\s*|```$/g, '').trim();
      
      // Try to parse it to confirm it's valid now
      JSON.parse(cleaned);
      
      setJsonInput(cleaned);
      setError(null);
    } catch (e: any) {
      setError("AI was unable to repair this JSON: " + e.message);
    } finally {
      setIsFixing(false);
    }
  };

  const clearInput = () => {
    setJsonInput('');
    setParsedJson(null);
    setGeneratedClasses([]);
  };

  const languages: { id: Language; label: string }[] = [
    { id: 'KOTLIN', label: 'Kotlin' },
    { id: 'JAVA', label: 'Java' },
    { id: 'TYPESCRIPT', label: 'TypeScript' },
    { id: 'SWIFT', label: 'Swift' },
    { id: 'PYTHON', label: 'Python' },
    { id: 'CSHARP', label: 'C#' },
  ];

  const themeOptions: { id: ThemeType; label: string }[] = [
    { id: 'NEXUS', label: 'Nexus' },
    { id: 'MONOKAI', label: 'Monokai' },
    { id: 'DRACULA', label: 'Dracula' },
    { id: 'SOLARIZED', label: 'Solarized' },
    { id: 'LIGHT', label: 'Light' },
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
              <button 
                onClick={handleFix}
                disabled={isFixing}
                className={`p-2 rounded-lg transition-colors ${isFixing ? 'text-indigo-500 bg-slate-700 animate-pulse' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700'}`}
                title="AI Smart Fix (Repair Malformed JSON)"
              >
                <i className={`fas ${isFixing ? 'fa-circle-notch fa-spin' : 'fa-wrench'}`} />
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
              className={`w-full h-full bg-transparent p-6 text-slate-200 focus:outline-none resize-none code-font text-sm leading-relaxed transition-opacity ${isFixing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
              spellCheck={false}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here (it can even be slightly broken)...'
            />
            {isFixing && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest animate-pulse">AI Repairing...</p>
                </div>
              </div>
            )}
            {error && !isFixing && (
              <div className="absolute bottom-4 left-4 right-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 z-10">
                <div className="flex items-start gap-3">
                  <i className="fas fa-exclamation-circle text-rose-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-rose-500">JSON Error Detected</p>
                    <p className="text-xs text-rose-400 mt-1 font-mono break-all">{error}</p>
                    <button 
                      onClick={handleFix}
                      className="mt-2 text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1 rounded-md border border-rose-500/30 transition-all uppercase font-bold"
                    >
                      Attempt AI Auto-Fix
                    </button>
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

            <div className="flex items-center gap-2">
              {(viewMode === 'PRETTY' || viewMode === 'TREE') && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Theme</span>
                  <select 
                    value={themeType}
                    onChange={(e) => setThemeType(e.target.value as ThemeType)}
                    className="bg-slate-700 text-slate-200 text-[10px] font-bold py-1 px-2 rounded-md border border-slate-600 focus:outline-none"
                  >
                    {themeOptions.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {viewMode === 'MODELS' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Language</span>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value as Language)}
                    className="bg-slate-700 text-slate-200 text-[10px] font-bold py-1 px-2 rounded-md border border-slate-600 focus:outline-none"
                  >
                    {languages.map(l => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {viewMode === 'PRETTY' && parsedJson && (
                <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2))}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Copy JSON"
                >
                  <i className="fas fa-copy text-xs" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {!parsedJson && !error ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <i className="fas fa-terminal text-6xl opacity-20" />
                <p className="font-medium tracking-tight">Paste your data to start</p>
              </div>
            ) : parsedJson ? (
              <div className="h-full">
                {viewMode === 'PRETTY' && (
                  <div className={`h-full overflow-auto p-6 code-font text-sm ${currentTheme.bg} transition-colors duration-300`}>
                    <pre className={currentTheme.text}>
                      {JSON.stringify(parsedJson, null, 2)}
                    </pre>
                  </div>
                )}
                {viewMode === 'TREE' && (
                  <JsonTreeView data={parsedJson} theme={currentTheme} />
                )}
                {viewMode === 'MODELS' && (
                  <ModelOutput classes={generatedClasses} language={targetLang} />
                )}
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-600/40 p-10 text-center">
                <i className="fas fa-robot text-7xl mb-6 animate-bounce" />
                <p className="font-bold uppercase tracking-widest text-slate-500">Format Incorrect</p>
                <p className="text-xs mt-2 text-slate-600">This JSON is invalid. Use the "Smart Fix" wrench button above to repair it automatically using AI.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between uppercase tracking-widest font-bold shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             UI: {viewMode}
          </span>
          <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
             Lang: {targetLang}
          </span>
          <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
             Theme: {themeType}
          </span>
        </div>
        <div className="flex gap-4 opacity-50">
          <span>Nexus Engine v2.5</span>
          <span>Open Source</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
