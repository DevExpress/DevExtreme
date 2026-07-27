export type CheckDeclarationsMode = 'jquery' | 'bundle' | 'modules' | 'public-modules';

export interface CheckDeclarationsExecutorSchema {
  mode: CheckDeclarationsMode;
  modulesMetadataFile?: string;
  tsBundleFile?: string;
  bundleArtifactPath?: string;
  modulesPattern?: string;
  entryOutputDir?: string;
  npmPackageDir?: string;
  internalPackage?: boolean;
  typescriptModule?: string;
  compilerOptions?: Record<string, unknown>;
}
