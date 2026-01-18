
export interface JsonNodeProps {
  data: any;
  label?: string;
  isLast?: boolean;
  depth?: number;
}

export type ViewMode = 'PRETTY' | 'TREE' | 'KOTLIN';

export interface GeneratedClass {
  className: string;
  code: string;
}
