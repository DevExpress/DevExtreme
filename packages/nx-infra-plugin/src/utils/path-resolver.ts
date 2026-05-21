import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { isWindowsOS } from './common';

const ERROR_CONFIGURATIONS_NOT_FOUND = 'Project configurations not found in executor context';
const ERROR_PROJECT_NAME_NOT_FOUND = 'Project name not found in executor context';
const ERROR_PROJECT_NOT_FOUND = 'Project "{0}" not found in workspace';
const ERROR_MISSING_PATH_OPTION = 'Missing path option "{0}"';

export function resolveProjectPath(context: ExecutorContext): string {
  if (!context.projectsConfigurations) {
    throw new Error(ERROR_CONFIGURATIONS_NOT_FOUND);
  }

  if (!context.projectName) {
    throw new Error(ERROR_PROJECT_NAME_NOT_FOUND);
  }

  const project = context.projectsConfigurations.projects[context.projectName];
  if (!project) {
    throw new Error(ERROR_PROJECT_NOT_FOUND.replace('{0}', context.projectName));
  }

  return path.resolve(context.root, project.root);
}

export function resolveFromProject(context: ExecutorContext, relativePath: string): string {
  const projectRoot = resolveProjectPath(context);
  return path.join(projectRoot, relativePath);
}

export function resolveFromWorkspace(context: ExecutorContext, relativePath: string): string {
  return path.join(context.root, relativePath);
}

export function normalizeGlobPathForWindows(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

export function toPosixPath(absolutePath: string): string {
  return isWindowsOS() ? normalizeGlobPathForWindows(absolutePath) : absolutePath;
}

export function resolveOptionPaths<K extends string>(
  options: Partial<Record<K, string>>,
  projectRoot: string,
  keys: readonly K[],
  defaults?: Partial<Record<K, string>>,
): Record<K, string> {
  const out = {} as Record<K, string>;
  for (const key of keys) {
    const raw = options[key] ?? defaults?.[key];
    if (raw === undefined) {
      throw new Error(ERROR_MISSING_PATH_OPTION.replace('{0}', String(key)));
    }
    out[key] = path.resolve(projectRoot, raw);
  }
  return out;
}
