
export interface JsonNodeProps {
  data: any;
  label?: string;
  isLast?: boolean;
  depth?: number;
  theme: ThemeColors;
}

export type ViewMode = 'PRETTY' | 'TREE' | 'MODELS';

export type Language = 'KOTLIN' | 'JAVA' | 'TYPESCRIPT' | 'SWIFT' | 'PYTHON' | 'CSHARP';

export type ThemeType = 'NEXUS' | 'MONOKAI' | 'DRACULA' | 'SOLARIZED' | 'LIGHT';

export interface ThemeColors {
  bg: string;
  text: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  key: string;
  bracket: string;
  collapsed: string;
  border: string;
}

export interface GeneratedClass {
  className: string;
  code: string;
}
