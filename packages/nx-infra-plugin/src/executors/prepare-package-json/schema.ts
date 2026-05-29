export interface RenameInternalPattern {
  find: string;
  replace: string;
}

export interface NpmPackageExecutorSchema {
  sourcePackageJson?: string;
  distDirectory?: string;
  outputFileName?: string;
  setName?: string;
  setVersion?: string;
  versionFrom?: string;
  removeFields?: string[];
  renameInternalPattern?: RenameInternalPattern;
}
