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

export interface LocalizationExecutorSchema {
  messagesDir?: string;
  messageTemplate?: string;
  messageOutputDir?: string;
  generatedTemplate?: string;
  cldrDataOutputDir?: string;
  defaultMessagesOutputDir?: string;
  lintGeneratedFiles?: boolean;
  skipCldrGeneration?: boolean;
  skipMessageGeneration?: boolean;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}
