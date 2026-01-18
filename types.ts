
export interface JsonNodeProps {
  data: any;
  label?: string;
  isLast?: boolean;
  depth?: number;
}

export type ViewMode = 'PRETTY' | 'TREE' | 'MODELS';

export type Language = 'KOTLIN' | 'JAVA' | 'TYPESCRIPT' | 'SWIFT' | 'PYTHON' | 'CSHARP';

export interface GeneratedClass {
  className: string;
  code: string;
}
