export enum ViewMode {
  HOME = 'HOME',
  ANALYSIS = 'ANALYSIS',
  PLOTTING = 'PLOTTING'
}

export enum WorkflowType {
  BULK_RNA = 'BULK_RNA',
  SINGLE_CELL = 'SINGLE_CELL',
  DIFF_EXPRESSION = 'DIFF_EXPRESSION'
}

export enum StatMethod {
  DESEQ2 = 'DESeq2',
  T_TEST = 'T-Test',
  WILCOX = 'Wilcoxon',
  MANN_WHITNEY = 'Mann-Whitney U'
}

export interface AnalysisConfig {
  workflow: WorkflowType;
  // Bulk & Single Cell params
  projectPath?: string;
  tools?: string[]; // e.g., ['fastqc', 'star']
  // Diff Exp params
  pValueThreshold?: number;
  log2fcThreshold?: number;
  statMethod?: StatMethod;
  groupingPath?: string;
}

export interface AnalysisResult {
  markdown: string;
  files?: Array<{ name: string; type: string; size: string }>;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR';
}

export enum PlotType {
  SCATTER = 'SCATTER',
  BAR = 'BAR',
  LINE = 'LINE',
  AREA = 'AREA'
}

export interface DataPoint {
  name: string;
  x?: number;
  y?: number;
  value?: number;
  category?: string;
  [key: string]: string | number | undefined;
}