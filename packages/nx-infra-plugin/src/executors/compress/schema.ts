import type { ApplyLicenseHeadersOption } from '../add-license-headers/schema';

export type CompressModeName = 'minify' | 'beautify' | 'strip-debug' | 'normalize';

export type CompressMode =
  | CompressModeName
  | {
      name: 'minify' | 'beautify';
      eulaUrl?: string;
      trailingNewline?: boolean;
    }
  | {
      name: 'strip-debug' | 'normalize';
      trailingNewline?: boolean;
    };

export interface CompressExecutorSchema {
  files: string[];
  mode: CompressMode;
  exclude?: string[];
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}
