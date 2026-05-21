import type { ApplyLicenseHeadersOption } from '../add-license-headers/schema';

export type { ApplyLicenseHeadersOption };

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
