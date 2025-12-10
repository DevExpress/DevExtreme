export interface BuildTypescriptExecutorSchema {
  module?: 'cjs' | 'esm';
  srcPattern?: string;
  excludePatterns?: string[];
  tsconfig?: string;
  outDir?: string;
}
