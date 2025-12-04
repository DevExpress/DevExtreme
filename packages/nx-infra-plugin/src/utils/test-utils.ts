import { ExecutorContext, ProjectGraph } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function createTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function cleanupTempDir(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

export interface MockContextOptions {
  root?: string;
  projectName?: string;
  projectRoot?: string;
  isVerbose?: boolean;
  nxJsonConfiguration?: Record<string, unknown>;
  projectGraph?: Record<string, unknown>;
}

export function createMockContext(options: MockContextOptions = {}): ExecutorContext {
  const {
    root = '/tmp/test',
    projectName = 'test-lib',
    projectRoot = 'packages/test-lib',
    isVerbose = false,
    nxJsonConfiguration = {},
  } = options;

  const projectGraph: ProjectGraph = {
    nodes: {
      [projectName]: {
        name: projectName,
        type: 'lib',
        data: {
          root: projectRoot,
          targets: {},
        },
      },
    },
    externalNodes: {},
    dependencies: {},
  };

  return {
    root,
    cwd: root,
    isVerbose,
    projectName,
    projectsConfigurations: {
      projects: {
        [projectName]: { root: projectRoot },
      },
      version: 2,
    },
    nxJsonConfiguration,
    projectGraph,
  };
}
