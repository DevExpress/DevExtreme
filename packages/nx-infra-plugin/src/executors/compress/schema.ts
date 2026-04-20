export interface CompressExecutorSchema {
  files: string[];
  mode: 'minify' | 'beautify';
  removeDebug?: boolean;
  eulaUrl?: string;
}
