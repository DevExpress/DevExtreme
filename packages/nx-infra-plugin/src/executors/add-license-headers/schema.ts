export interface AddLicenseHeadersExecutorSchema {
  targetDirectory?: string;
  packageJsonPath?: string;
  separatorBetweenBannerAndContent?: string;
  includePatterns?: string[];
  excludePatterns?: string[];
}
