export interface CompressExecutorSchema {
  files: string[];
  mode: 'minify' | 'beautify' | 'strip-only';
  removeDebug?: boolean;
  eulaUrl?: string;
}
