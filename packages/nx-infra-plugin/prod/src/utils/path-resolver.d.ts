import { ExecutorContext } from '@nx/devkit';
export declare function resolveProjectPath(context: ExecutorContext): string;
export declare function resolveFromProject(context: ExecutorContext, relativePath: string): string;
export declare function resolveFromWorkspace(context: ExecutorContext, relativePath: string): string;
