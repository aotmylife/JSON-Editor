
import { ThemeType, ThemeColors } from '../types';

export const THEMES: Record<ThemeType, ThemeColors> = {
  NEXUS: {
    bg: 'bg-slate-900',
    text: 'text-emerald-100',
    string: 'text-emerald-400',
    number: 'text-amber-400',
    boolean: 'text-blue-400',
    null: 'text-gray-500',
    key: 'text-purple-400',
    bracket: 'text-slate-400',
    collapsed: 'text-slate-500',
    border: 'border-slate-700'
  },
  MONOKAI: {
    bg: 'bg-[#272822]',
    text: 'text-[#f8f8f2]',
    string: 'text-[#e6db74]',
    number: 'text-[#ae81ff]',
    boolean: 'text-[#ae81ff]',
    null: 'text-[#ae81ff]',
    key: 'text-[#f92672]',
    bracket: 'text-[#f8f8f2]',
    collapsed: 'text-[#75715e]',
    border: 'border-[#3e3d32]'
  },
  DRACULA: {
    bg: 'bg-[#282a36]',
    text: 'text-[#f8f8f2]',
    string: 'text-[#f1fa8c]',
    number: 'text-[#bd93f9]',
    boolean: 'text-[#bd93f9]',
    null: 'text-[#6272a4]',
    key: 'text-[#ff79c6]',
    bracket: 'text-[#f8f8f2]',
    collapsed: 'text-[#6272a4]',
    border: 'border-[#44475a]'
  },
  SOLARIZED: {
    bg: 'bg-[#002b36]',
    text: 'text-[#839496]',
    string: 'text-[#2aa198]',
    number: 'text-[#d33682]',
    boolean: 'text-[#d33682]',
    null: 'text-[#586e75]',
    key: 'text-[#268bd2]',
    bracket: 'text-[#93a1a1]',
    collapsed: 'text-[#586e75]',
    border: 'border-[#073642]'
  },
  LIGHT: {
    bg: 'bg-white',
    text: 'text-slate-900',
    string: 'text-emerald-600',
    number: 'text-amber-600',
    boolean: 'text-blue-600',
    null: 'text-slate-400',
    key: 'text-purple-600',
    bracket: 'text-slate-500',
    collapsed: 'text-slate-400',
    border: 'border-slate-200'
  }
};
