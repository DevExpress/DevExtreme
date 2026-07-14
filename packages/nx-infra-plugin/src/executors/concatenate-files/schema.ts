export interface TransformRule {
  find: string;
  replace: string;
  flags?: string;
}

export interface ConcatenatePass {
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

export interface ConcatenateFilesExecutorSchema extends ConcatenatePass {
  additionalPasses?: ConcatenatePass[];
  watch?: boolean;
  watchPaths?: string[];
}
