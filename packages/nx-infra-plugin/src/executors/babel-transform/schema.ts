export interface BabelTransformAsset {
  from: string;
  to: string;
}

export interface BabelTransformExecutorSchema {
  babelConfigPath: string;
  configKey: string;
  sourcePattern: string;
  excludePatterns?: string[];
  outDir: string;
  removeDebug?: boolean;
  renameExtensions?: Record<string, string>;
  copyAssets?: BabelTransformAsset[];
}
