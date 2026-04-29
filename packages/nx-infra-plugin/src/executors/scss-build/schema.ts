export interface ScssBuildExecutorSchema {
  mode: 'all' | 'ci';
  bundlesDir?: string;
  cssOutputDir?: string;
  devBundles?: string[];
}
