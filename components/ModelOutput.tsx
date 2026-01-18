
import React from 'react';
import { GeneratedClass, Language } from '../types';

interface Props {
  classes: GeneratedClass[];
  language: Language;
}

export const ModelOutput: React.FC<Props> = ({ classes, language }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
        <i className="fas fa-code-branch text-4xl mb-2" />
        <p>No {language} classes generated yet.</p>
        <p className="text-sm">Enter valid JSON to architect models.</p>
      </div>
    );
  }

  const getLangIcon = () => {
    switch (language) {
      case 'KOTLIN': return 'fa-brands fa-android text-emerald-400';
      case 'JAVA': return 'fa-brands fa-java text-orange-400';
      case 'TYPESCRIPT': return 'fa-brands fa-js text-blue-400';
      case 'SWIFT': return 'fa-brands fa-swift text-orange-500';
      case 'PYTHON': return 'fa-brands fa-python text-blue-500';
      case 'CSHARP': return 'fa-solid fa-code text-purple-400';
      default: return 'fa-file-code text-blue-400';
    }
  };

  return (
    <div className="space-y-6 overflow-auto h-full p-4">
      {classes.map((cls, idx) => (
        <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <span className="text-slate-200 font-semibold text-sm flex items-center gap-2">
              <i className={`${getLangIcon()}`} />
              {cls.className}{language === 'TYPESCRIPT' ? '.ts' : language === 'SWIFT' ? '.swift' : language === 'PYTHON' ? '.py' : language === 'CSHARP' ? '.cs' : '.java'}
            </span>
            <button
              onClick={() => copyToClipboard(cls.code)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors bg-slate-700 px-2 py-1 rounded"
            >
              <i className="fas fa-copy" />
              Copy
            </button>
          </div>
          <pre className="p-4 code-font text-xs overflow-x-auto text-emerald-100 leading-relaxed bg-[#0d1117]">
            {cls.code}
          </pre>
        </div>
      ))}
    </div>
  );
};
