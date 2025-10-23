import { ExecutorContext } from '@nx/devkit';
export declare function createTempDir(prefix: string): string;
export declare function cleanupTempDir(dirPath: string): void;
export interface MockContextOptions {
    root?: string;
    projectName?: string;
    projectRoot?: string;
    isVerbose?: boolean;
}
export declare function createMockContext(options?: MockContextOptions): ExecutorContext;
