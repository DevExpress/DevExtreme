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

export interface CopyFilesExecutorSchema {
  files: Array<{
    from: string;
    to: string;
    excludePatterns?: string[];
  }>;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}
