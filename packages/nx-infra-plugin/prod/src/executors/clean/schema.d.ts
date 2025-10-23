export interface CleanExecutorSchema {
    targetDirectory?: string;
    excludePatterns?: string[];
    mode?: 'simple' | 'recursive' | 'shallow';
}
