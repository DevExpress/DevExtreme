export interface NpmAssembleExecutorSchema {
  transpiledDir: string;
  jsSrcDir: string;
  licenseSrcDir: string;
  npmBinDir: string;
  webpackConfig: string;
  artifactsDir: string;
  outputDir: string;
  licenseTemplateFile?: string;
  eulaUrl?: string;
}
