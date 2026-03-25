import { ExecutorContext } from '@nx/devkit';
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
}

export function createMockContext(options: MockContextOptions = {}): ExecutorContext {
  const {
    root = '/tmp/test',
    projectName = 'test-lib',
    projectRoot = 'packages/test-lib',
    isVerbose = false,
  } = options;

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
    nxJsonConfiguration: {},
    projectGraph: {
      nodes: {
        [projectName]: {
          name: projectName,
          type: 'lib',
          data: { root: projectRoot },
        },
      },
      dependencies: {},
    },
  };
}

export function findWorkspaceRoot(): string {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, 'nx.json'))
      || fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error('Could not find workspace root');
}
