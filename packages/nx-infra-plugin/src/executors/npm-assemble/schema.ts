export interface NpmAssembleMetadataFile {
  from: string;
  to: string;
}

export interface NpmAssembleFlattenStep {
  from: string;
  to: string;
}

export interface NpmAssembleRename {
  fromGlob: string;
  toBasename: string;
}

export interface NpmAssembleExecutorSchema {
  transpiledDir: string;
  jsSrcDir: string;
  licenseSrcDir: string;
  npmBinDir: string;
  webpackConfig: string;
  artifactsDir: string;
  outputDir: string;
  srcExcludes?: string[];
  distExcludes?: string[];
  nestedPackageJsonExcludes?: string[];
  excludeLicenseValidator?: string;
  renameLicenseValidator?: NpmAssembleRename;
  licenseTemplateFile?: string;
  eulaUrl?: string;
  metadataFiles?: NpmAssembleMetadataFile[];
  flatten?: NpmAssembleFlattenStep[];
}
