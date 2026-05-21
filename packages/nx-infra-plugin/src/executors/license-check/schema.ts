export interface LicenseEntry {
  name: string;
  homepageUrl: string;
  copyright: string;
  licenseType: string;
  licenseUrl: string;
}

export interface LicenseCheckExecutorSchema {
  files: string[];
  licenses: LicenseEntry[];
}
