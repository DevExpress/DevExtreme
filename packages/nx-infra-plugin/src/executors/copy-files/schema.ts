import type { ApplyLicenseHeadersOption } from '../add-license-headers/schema';

export type { ApplyLicenseHeadersOption };

export interface CopyFilesExecutorSchema {
  files: Array<{
    from: string;
    to: string;
    excludePatterns?: string[];
  }>;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}
