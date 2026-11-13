export type ExportsTarget = string | { [condition: string]: string };

export interface GenerateExportsMapExecutorSchema {
  packageDir: string;
  ignore?: string[];
  extraExports?: Record<string, ExportsTarget>;
}
