
import React from 'react';
import { GeneratedClass } from '../types';

interface Props {
  classes: GeneratedClass[];
}

export const KotlinOutput: React.FC<Props> = ({ classes }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
        <i className="fas fa-code-branch text-4xl mb-2" />
        <p>No Kotlin classes generated yet.</p>
        <p className="text-sm">Enter valid JSON to architect models.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-auto h-full p-4">
      {classes.map((cls, idx) => (
        <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <span className="text-blue-400 font-semibold text-sm">
              <i className="fas fa-file-code mr-2" />
              {cls.className}.kt
            </span>
            <button
              onClick={() => copyToClipboard(cls.code)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <i className="fas fa-copy" />
              Copy
            </button>
          </div>
          <pre className="p-4 code-font text-xs overflow-x-auto text-emerald-100 leading-relaxed">
            {cls.code}
          </pre>
        </div>
      ))}
    </div>
  );
};
