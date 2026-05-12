export interface BundleExecutorSchema {
  entries: string[];
  sourceDir: string;
  outDir: string;
  mode: 'debug' | 'production';
  webpackConfigPath?: string;
  sourceMap?: boolean;
}
