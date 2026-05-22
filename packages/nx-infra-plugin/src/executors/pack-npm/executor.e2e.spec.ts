import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import executor from './executor';
import { PackNpmExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson } from '../../utils';

const PACKAGE_NAME = 'test-package';
const PACKAGE_VERSION = '1.0.0';
const EXPECTED_TARBALL_NAME = `${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz`;
const NPM_DIR_NAME = 'npm';
const PROJECT_NAME = 'test-lib';
const PACKAGES_DIR = 'packages';

describe('PackNpmExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let pnpmAvailable: boolean;

  beforeAll(() => {
    try {
      execSync('pnpm --version', { stdio: 'ignore' });
      pnpmAvailable = true;
    } catch {
      pnpmAvailable = false;
    }
  });

  beforeEach(async () => {
    if (!pnpmAvailable) {
      return;
    }

    tempDir = createTempDir('nx-pack-e2e-');

    await writeFileText(
      path.join(tempDir, 'pnpm-workspace.yaml'),
      `packages:\n  - '${PACKAGES_DIR}/*'\n`,
    );

    await writeJson(path.join(tempDir, 'package.json'), {
      name: 'test-workspace',
      version: '1.0.0',
      private: true,
    });

    const projectDir = path.join(tempDir, PACKAGES_DIR, PROJECT_NAME);
    const npmDir = path.join(projectDir, NPM_DIR_NAME);

    fs.mkdirSync(npmDir, { recursive: true });

    await writeJson(path.join(projectDir, 'package.json'), {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      description: 'Test package for pnpm pack',
      main: './npm/index.js',
      publishConfig: {
        directory: NPM_DIR_NAME,
        linkDirectory: true,
      },
    });

    await writeJson(path.join(npmDir, 'package.json'), {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      description: 'Test package for pnpm pack',
      main: './index.js',
    });

    await writeFileText(path.join(npmDir, 'index.js'), 'module.exports = { test: true };');

    context = createMockContext({
      root: tempDir,
      projectName: PROJECT_NAME,
      projectRoot: path.join(PACKAGES_DIR, PROJECT_NAME),
    });
  });

  afterEach(() => {
    if (!pnpmAvailable || !tempDir) {
      return;
    }

    cleanupTempDir(tempDir);
  });

  it('should create tarball in publishConfig.directory (like wrapper packages)', async () => {
    if (!pnpmAvailable) {
      console.log('Skipping test: pnpm not available');
      return;
    }

    const options: PackNpmExecutorSchema = {};

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, PACKAGES_DIR, PROJECT_NAME);
    const expectedTarballPath = path.join(projectDir, NPM_DIR_NAME, EXPECTED_TARBALL_NAME);

    expect(fs.existsSync(expectedTarballPath)).toBe(true);

    const tarballStat = fs.statSync(expectedTarballPath);
    expect(tarballStat.isFile()).toBe(true);
    expect(tarballStat.size).toBeGreaterThan(0);
  });
});
