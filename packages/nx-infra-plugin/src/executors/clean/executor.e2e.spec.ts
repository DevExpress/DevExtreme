import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { CleanExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText } from '../../utils';

describe('CleanExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(() => {
    tempDir = createTempDir('nx-clean-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const srcDir = path.join(projectDir, 'src');

    fs.mkdirSync(srcDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Complete removal (no exclusions)', () => {
    beforeEach(async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const npmDir = path.join(projectDir, 'npm');

      fs.mkdirSync(npmDir, { recursive: true });

      await writeFileText(path.join(npmDir, 'index.js'), 'export const foo = "bar";');

      fs.mkdirSync(path.join(npmDir, 'esm'), { recursive: true });
      await writeFileText(path.join(npmDir, 'esm', 'index.js'), 'export * from "./foo";');

      fs.mkdirSync(path.join(npmDir, 'components', 'button'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'components', 'button', 'index.js'),
        'export const Button = {};',
      );
    });

    it('should delete the entire directory recursively', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
      };

      const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(npmDir)).toBe(false);
    });

    it('should succeed when directory does not exist', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const npmDir = path.join(projectDir, 'npm');

      fs.rmSync(npmDir, { recursive: true, force: true });

      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    });

    it('should not affect sibling directories outside target', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');

      const srcDir = path.join(projectDir, 'src');
      const distDir = path.join(projectDir, 'dist');

      await writeFileText(path.join(srcDir, 'index.ts'), 'export const foo = "bar";');

      fs.mkdirSync(distDir);
      await writeFileText(path.join(distDir, 'output.js'), 'compiled');

      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(projectDir, 'npm'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'output.js'))).toBe(true);
    });
  });

  describe('Selective cleaning (with exclusions)', () => {
    beforeEach(async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      await writeFileText(path.join(srcDir, 'button.tsx'), 'export const Button = () => {};');
      await writeFileText(path.join(srcDir, 'text-box.tsx'), 'export const TextBox = () => {};');
      await writeFileText(path.join(srcDir, 'index.ts'), 'export * from "./button";');

      fs.mkdirSync(path.join(srcDir, 'core'), { recursive: true });
      await writeFileText(path.join(srcDir, 'core', 'component.tsx'), 'export class Component {}');

      fs.mkdirSync(path.join(srcDir, 'data'), { recursive: true });
      await writeFileText(path.join(srcDir, 'data', 'grid.tsx'), 'export const Grid = () => {};');
    });

    it('should clean non-excluded files and preserve excluded directory contents', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
    });

    it('should preserve multiple excluded directories', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      fs.mkdirSync(path.join(srcDir, 'common'), { recursive: true });
      await writeFileText(path.join(srcDir, 'common', 'utils.ts'), 'export const utils = {};');

      fs.mkdirSync(path.join(srcDir, 'types'), { recursive: true });
      await writeFileText(path.join(srcDir, 'types', 'index.d.ts'), 'export type Foo = string;');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core', './src/common', './src/types'],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'types', 'index.d.ts'))).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);
    });

    it('should preserve descendants of excluded directories', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      fs.mkdirSync(path.join(srcDir, 'core', 'internal'), { recursive: true });
      await writeFileText(
        path.join(srcDir, 'core', 'internal', 'impl.tsx'),
        'export const impl = {};',
      );

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'internal', 'impl.tsx'))).toBe(true);
    });

    it('should handle absolute exclude paths', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');
      const absoluteCorePath = path.join(srcDir, 'core');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: [absoluteCorePath],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
    });

    it('should preserve specific files and their parent directories', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      fs.mkdirSync(path.join(srcDir, 'ui', 'popup', 'service'), { recursive: true });
      fs.mkdirSync(path.join(srcDir, 'ui', 'button'), { recursive: true });

      await writeFileText(
        path.join(srcDir, 'ui', 'popup', 'service', 'test.ts'),
        'export const service = {};',
      );
      await writeFileText(
        path.join(srcDir, 'ui', 'popup', 'index.ts'),
        'export * from "./service";',
      );
      await writeFileText(
        path.join(srcDir, 'ui', 'button', 'index.ts'),
        'export const Button = {};',
      );

      const options: CleanExecutorSchema = {
        targetDirectory: './src/ui',
        excludePatterns: ['./src/ui/popup/service', './src/ui/popup/index.ts'],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'ui', 'popup', 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'ui', 'popup', 'service', 'test.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'ui', 'popup'))).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'ui', 'button'))).toBe(false);
    });

    it('should preserve only first-level items when top-level dirs are excluded', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      fs.mkdirSync(path.join(srcDir, 'common'), { recursive: true });
      await writeFileText(path.join(srcDir, 'common', 'utils.ts'), 'export const utils = {};');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core', './src/common'],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
    });
  });
});
