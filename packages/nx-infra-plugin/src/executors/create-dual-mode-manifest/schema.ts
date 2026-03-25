export interface CreateDualModeManifestExecutorSchema {
  esmDir: string;
  cjsDir: string;
  outputDir: string;
  srcDir: string;
  excludePatterns?: string[];
  generatedDtsFiles?: string[];
}
