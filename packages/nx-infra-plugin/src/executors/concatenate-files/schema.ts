export interface TransformRule {
  find: string;
  replace: string;
  flags?: string;
}

export interface ConcatenateFilesExecutorSchema {
  sourceFiles: string[];
  outputFile: string;
  extractPattern?: string;
  extractPatternFlags?: string;
  header?: string;
  footer?: string;
  transforms?: TransformRule[];
  normalizeLineEndings?: boolean;
  separator?: string;
}
