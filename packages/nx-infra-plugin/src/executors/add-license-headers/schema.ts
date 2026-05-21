export interface AddLicenseHeadersExecutorSchema {
  targetDirectory?: string;
  packageJsonPath?: string;
  separatorBetweenBannerAndContent?: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  licenseTemplateFile?: string;
  eulaUrl?: string;
  prependAfterLicense?: string;
  version?: string;
  commentType?: '!' | '*';
  mode?: 'eula' | 'mit';
}

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
