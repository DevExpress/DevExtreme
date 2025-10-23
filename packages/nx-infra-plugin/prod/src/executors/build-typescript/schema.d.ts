export interface BuildTypescriptExecutorSchema {
    module?: 'cjs' | 'esm';
    srcPattern?: string;
    excludePattern?: string;
    tsconfig?: string;
    outDir?: string;
}
