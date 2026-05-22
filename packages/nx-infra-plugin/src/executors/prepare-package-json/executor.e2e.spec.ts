import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { NpmPackageExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeJson, readFileText } from '../../utils';

describe('PreparePackageJsonExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-prepare-pkg-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(projectDir, { recursive: true });

    await writeJson(path.join(projectDir, 'package.json'), {
      name: '@devexpress/test-package',
      version: '1.0.0',
      description: 'Test package for prepare-package-json',
      main: './index.js',
      module: './esm/index.js',
      types: './index.d.ts',
      scripts: {
        build: 'tsc',
        test: 'jest',
      },
      publishConfig: {
        access: 'public',
        directory: 'npm',
        registry: 'https://registry.npmjs.org/',
      },
      dependencies: {
        react: '^18.0.0',
      },
      devDependencies: {
        typescript: '^4.9.0',
        jest: '^29.0.0',
      },
      keywords: ['test', 'package'],
      license: 'MIT',
      author: 'Test Author',
    });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should remove publishConfig by default and preserve all other fields', async () => {
    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distPackage = JSON.parse(
      await readFileText(path.join(projectDir, 'npm', 'package.json')),
    );

    expect(distPackage.publishConfig).toBeUndefined();
    expect(distPackage.name).toBe('@devexpress/test-package');
    expect(distPackage.version).toBe('1.0.0');
    expect(distPackage.description).toBe('Test package for prepare-package-json');
    expect(distPackage.main).toBe('./index.js');
    expect(distPackage.module).toBe('./esm/index.js');
    expect(distPackage.types).toBe('./index.d.ts');
    expect(distPackage.scripts).toEqual({ build: 'tsc', test: 'jest' });
    expect(distPackage.dependencies).toEqual({ react: '^18.0.0' });
    expect(distPackage.devDependencies).toEqual({ typescript: '^4.9.0', jest: '^29.0.0' });
    expect(distPackage.keywords).toEqual(['test', 'package']);
    expect(distPackage.license).toBe('MIT');
    expect(distPackage.author).toBe('Test Author');
  });

  it('should override name and version with setName and setVersion', async () => {
    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      setName: 'devextreme',
      setVersion: '1.2.3',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distPkg = JSON.parse(await readFileText(path.join(projectDir, 'npm', 'package.json')));

    expect(distPkg.name).toBe('devextreme');
    expect(distPkg.version).toBe('1.2.3');
  });

  it('should remove all specified fields via removeFields', async () => {
    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      removeFields: ['devDependencies', 'publishConfig', 'scripts'],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distPkg = JSON.parse(await readFileText(path.join(projectDir, 'npm', 'package.json')));

    expect(distPkg.devDependencies).toBeUndefined();
    expect(distPkg.publishConfig).toBeUndefined();
    expect(distPkg.scripts).toBeUndefined();
  });

  it('should read version from versionFrom file and apply it to the output', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    await writeJson(path.join(projectDir, 'version-source.json'), {
      name: 'workspace-root',
      version: '9.8.7',
    });

    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      versionFrom: './version-source.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const distPkg = JSON.parse(await readFileText(path.join(projectDir, 'npm', 'package.json')));

    expect(distPkg.version).toBe('9.8.7');
  });

  it('should apply renameInternalPattern after setName', async () => {
    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      setName: 'devextreme',
      renameInternalPattern: { find: '^devextreme(-.*)?$', replace: 'devextreme$1-internal' },
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distPkg = JSON.parse(await readFileText(path.join(projectDir, 'npm', 'package.json')));

    expect(distPkg.name).toBe('devextreme-internal');
  });

  it('should remove nothing when removeFields is an empty array', async () => {
    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      removeFields: [],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distPkg = JSON.parse(await readFileText(path.join(projectDir, 'npm', 'package.json')));

    expect(distPkg.publishConfig).toBeDefined();
  });

  it('should fail when versionFrom file has no version field', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    await writeJson(path.join(projectDir, 'no-version.json'), {
      name: 'workspace-root',
    });

    const options: NpmPackageExecutorSchema = {
      distDirectory: './npm',
      versionFrom: './no-version.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });
});
