
import React, { useState } from 'react';
import { JsonNodeProps } from '../types';

const JsonNode: React.FC<JsonNodeProps> = ({ data, label, isLast = true, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  const toggle = () => setIsOpen(!isOpen);

  const renderValue = (val: any) => {
    if (typeof val === 'string') return <span className="text-emerald-400">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-amber-400">{val}</span>;
    if (typeof val === 'boolean') return <span className="text-blue-400">{val.toString()}</span>;
    if (val === null) return <span className="text-gray-500">null</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="ml-4 flex items-start gap-2 py-0.5">
        {label && <span className="text-purple-400 font-medium">"{label}":</span>}
        {renderValue(data)}
        {!isLast && <span className="text-gray-400">,</span>}
      </div>
    );
  }

  const keys = Object.keys(data);
  const isEmpty = keys.length === 0;
  const opener = isArray ? '[' : '{';
  const closer = isArray ? ']' : '}';

  return (
    <div className={`ml-${depth === 0 ? 0 : 4} py-0.5`}>
      <div className="flex items-center cursor-pointer hover:bg-slate-800/50 rounded px-1 transition-colors" onClick={toggle}>
        <i className={`fas fa-chevron-right text-xs mr-2 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} text-slate-500`} />
        {label && <span className="text-purple-400 font-medium mr-2">"{label}":</span>}
        <span className="text-slate-400">{opener}</span>
        {!isOpen && <span className="mx-1 text-slate-500 italic text-xs">... {keys.length} items ...</span>}
        {!isOpen && <span className="text-slate-400">{closer}</span>}
      </div>

      {isOpen && (
        <div className="border-l border-slate-700 ml-2 pl-2">
          {keys.map((key, index) => (
            <JsonNode
              key={key}
              data={data[key]}
              label={isArray ? undefined : key}
              isLast={index === keys.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <div className="ml-5">
          <span className="text-slate-400">{closer}</span>
          {!isLast && <span className="text-gray-400">,</span>}
        </div>
      )}
    </div>
  );
};

export const JsonTreeView: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="code-font text-sm overflow-auto p-4 bg-slate-900 rounded-lg h-full select-none">
      <JsonNode data={data} />
    </div>
  );
};
