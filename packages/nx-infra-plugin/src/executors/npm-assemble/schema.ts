export interface NpmAssembleMetadataFile {
  from: string;
  to: string;
}

export interface NpmAssembleFlattenStep {
  from: string;
  to: string;
}

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
  metadataFiles?: NpmAssembleMetadataFile[];
  flatten?: NpmAssembleFlattenStep[];
}
