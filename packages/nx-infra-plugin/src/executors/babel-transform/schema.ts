export interface BabelTransformExecutorSchema {
  babelConfigPath: string;
  configKey: string;
  sourcePattern: string;
  excludePatterns?: string[];
  outDir: string;
  removeDebug?: boolean;
  renameExtensions?: Record<string, string>;
}
