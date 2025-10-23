import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { NpmPackageExecutorSchema } from './schema';
import {
  createTempDir,
  cleanupTempDir,
  createMockContext,
} from '../../utils/test-utils';
import { writeJson, readFileText } from '../../utils';

describe('PreparePackageJsonExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-prepare-pkg-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(projectDir, { recursive: true });

    await writeJson(
      path.join(projectDir, 'package.json'),
      {
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
      }
    );
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('publishConfig removal', () => {
    it('should remove publishConfig from package.json', async () => {
      const options: NpmPackageExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const distPackageJson = path.join(projectDir, 'npm', 'package.json');
      const distPackage = JSON.parse(await readFileText(distPackageJson));

      expect(distPackage.publishConfig).toBeUndefined();
    });

    it('should preserve all other fields when removing publishConfig', async () => {
      const options: NpmPackageExecutorSchema = {
        distDirectory: './npm',
      };

      await executor(options, context);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const distPackageJson = path.join(projectDir, 'npm', 'package.json');
      const distPackage = JSON.parse(await readFileText(distPackageJson));

      expect(distPackage.name).toBe('@devexpress/test-package');
      expect(distPackage.version).toBe('1.0.0');
      expect(distPackage.description).toBe('Test package for prepare-package-json');
      expect(distPackage.main).toBe('./index.js');
      expect(distPackage.module).toBe('./esm/index.js');
      expect(distPackage.types).toBe('./index.d.ts');
      expect(distPackage.scripts).toEqual({
        build: 'tsc',
        test: 'jest',
      });
      expect(distPackage.dependencies).toEqual({
        react: '^18.0.0',
      });
      expect(distPackage.devDependencies).toEqual({
        typescript: '^4.9.0',
        jest: '^29.0.0',
      });
      expect(distPackage.keywords).toEqual(['test', 'package']);
      expect(distPackage.license).toBe('MIT');
      expect(distPackage.author).toBe('Test Author');
    });
  });
});
