export interface DtsBundleExecutorSchema {
  bundleSources: string[];
  artifactPath: string;
  packagePath: string;
  licenseTemplateFile?: string;
  eulaUrl?: string;
}
