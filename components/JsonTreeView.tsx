
import React, { useState } from 'react';
import { JsonNodeProps, ThemeColors } from '../types';

const JsonNode: React.FC<JsonNodeProps> = ({ data, label, isLast = true, depth = 0, theme }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  const toggle = () => setIsOpen(!isOpen);

  const renderValue = (val: any) => {
    if (typeof val === 'string') return <span className={theme.string}>"{val}"</span>;
    if (typeof val === 'number') return <span className={theme.number}>{val}</span>;
    if (typeof val === 'boolean') return <span className={theme.boolean}>{val.toString()}</span>;
    if (val === null) return <span className={theme.null}>null</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="ml-4 flex items-start gap-2 py-0.5">
        {label && <span className={`${theme.key} font-medium`}>"{label}":</span>}
        {renderValue(data)}
        {!isLast && <span className={theme.bracket}>,</span>}
      </div>
    );
  }

  const keys = Object.keys(data);
  const opener = isArray ? '[' : '{';
  const closer = isArray ? ']' : '}';

  return (
    <div className={`ml-${depth === 0 ? 0 : 4} py-0.5`}>
      <div className="flex items-center cursor-pointer hover:bg-black/10 rounded px-1 transition-colors" onClick={toggle}>
        <i className={`fas fa-chevron-right text-[10px] mr-2 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${theme.collapsed}`} />
        {label && <span className={`${theme.key} font-medium mr-2`}>"{label}":</span>}
        <span className={theme.bracket}>{opener}</span>
        {!isOpen && <span className={`mx-1 ${theme.collapsed} italic text-xs`}>... {keys.length} items ...</span>}
        {!isOpen && <span className={theme.bracket}>{closer}</span>}
      </div>

      {isOpen && (
        <div className={`border-l ${theme.border} ml-2 pl-2`}>
          {keys.map((key, index) => (
            <JsonNode
              key={key}
              data={data[key]}
              label={isArray ? undefined : key}
              isLast={index === keys.length - 1}
              depth={depth + 1}
              theme={theme}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <div className="ml-5">
          <span className={theme.bracket}>{closer}</span>
          {!isLast && <span className={theme.bracket}>,</span>}
        </div>
      )}
    </div>
  );
};

export const JsonTreeView: React.FC<{ data: any; theme: ThemeColors }> = ({ data, theme }) => {
  return (
    <div className={`code-font text-sm overflow-auto p-4 ${theme.bg} rounded-lg h-full select-none transition-colors duration-300`}>
      <JsonNode data={data} theme={theme} />
    </div>
  );
};
