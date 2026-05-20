import type { ApplyLicenseHeadersOption } from '../add-license-headers/schema';

export type { ApplyLicenseHeadersOption };

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
