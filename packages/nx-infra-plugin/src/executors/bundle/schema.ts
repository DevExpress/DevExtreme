export interface BundleLicenseHeadersOption {
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
}

export interface BundleExecutorSchema {
  entries: string[];
  sourceDir: string;
  outDir: string;
  mode: 'debug' | 'production';
  webpackConfigPath?: string;
  sourceMap?: boolean;
  applyLicenseHeaders?: BundleLicenseHeadersOption;
}
