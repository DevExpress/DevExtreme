export interface CompressExecutorSchema {
  files: string[];
  mode: 'minify' | 'beautify' | 'strip-debug' | 'normalize';
  eulaUrl?: string;
  exclude?: string[];
}
