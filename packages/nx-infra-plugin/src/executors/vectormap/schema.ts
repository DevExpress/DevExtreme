export interface ApplyLicenseHeadersOption {
  licenseTemplateFile?: string;
  mode?: 'eula' | 'mit';
  eulaUrl?: string;
  version?: string;
  commentType?: '!' | '*';
  separator?: string;
  prependAfterLicense?: string;
  filenameMode?: 'relative' | 'basename';
  includePatterns?: readonly string[];
  excludePatterns?: readonly string[];
  targetSubdir?: string;
}

export interface VectormapExecutorSchema {
  sourceDir: string;
  settingsFile: string;
  sourcesDir: string;
  sourcesSettingsFile: string;
  utilsOutDir: string;
  dataOutDir: string;
  utilsTemplatePath: string;
  dataTemplatePath: string;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}
