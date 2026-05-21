export interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

export interface TsConfig {
  compilerOptions?: CompilerOptions;
  extends?: string;
  include?: string[];
  exclude?: string[];
  files?: string[];
  references?: Array<{ path: string }>;
}

export interface CompilerOptions {
  target?: string;
  module?: string;
  lib?: string[];
  outDir?: string;
  rootDir?: string;
  declaration?: boolean;
  declarationMap?: boolean;
  sourceMap?: boolean;
  strict?: boolean;
  esModuleInterop?: boolean;
  skipLibCheck?: boolean;
  forceConsistentCasingInFileNames?: boolean;
  resolveJsonModule?: boolean;
  jsx?: string;
  paths?: Record<string, string[]>;
  [key: string]: any;
}

export type PackParam = [string, string[]?, string?];

export interface TemplateData {
  pkg: {
    name: string;
    version: string;
    [key: string]: any;
  };
  date: string;
  year: number;
  [key: string]: any;
}

export interface FileCopyOperation {
  from: string;
  to: string;
}

export interface SubmoduleConfig {
  folder: string;
  moduleFileNames?: string[];
  moduleFilePath?: string;
}
