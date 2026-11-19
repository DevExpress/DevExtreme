export type ExportsTarget = string | { [condition: string]: string };

export interface GenerateExportsMapExecutorSchema {
  packageDir: string;
  ignore?: string[];
  declarationImports?: boolean;
  directoryIndexes?: string[];
  directoryIndexTypesFrom?: Record<string, string>;
  extraExports?: Record<string, ExportsTarget>;
}
