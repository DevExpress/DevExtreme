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

  describe('Simple mode', () => {
    beforeEach(async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const npmDir = path.join(projectDir, 'npm');

      fs.mkdirSync(npmDir, { recursive: true });

      await writeFileText(path.join(npmDir, 'index.js'), 'export const foo = "bar";');
      await writeFileText(path.join(npmDir, 'package.json'), '{"name": "test"}');
      await writeFileText(path.join(npmDir, 'README.md'), '# Test');

      fs.mkdirSync(path.join(npmDir, 'esm'), { recursive: true });
      await writeFileText(path.join(npmDir, 'esm', 'index.js'), 'export * from "./foo";');

      fs.mkdirSync(path.join(npmDir, 'cjs'), { recursive: true });
      await writeFileText(path.join(npmDir, 'cjs', 'index.js'), 'module.exports = {};');

      fs.mkdirSync(path.join(npmDir, 'components', 'button'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'components', 'button', 'index.js'),
        'export const Button = {};',
      );
    });

    it('should delete the entire directory', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
        mode: 'simple',
      };

      const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

      expect(fs.existsSync(npmDir)).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'index.js'))).toBe(true);

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(npmDir)).toBe(false);
    });

    it('should delete all files and subdirectories recursively', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
        mode: 'simple',
      };

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const npmDir = path.join(projectDir, 'npm');

      expect(fs.existsSync(path.join(npmDir, 'esm', 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'cjs', 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'components', 'button', 'index.js'))).toBe(true);

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
        mode: 'simple',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    });

    it('should not affect other directories', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');

      const srcDir = path.join(projectDir, 'src');
      const distDir = path.join(projectDir, 'dist');

      await writeFileText(path.join(srcDir, 'index.ts'), 'export const foo = "bar";');

      fs.mkdirSync(distDir);
      await writeFileText(path.join(distDir, 'output.js'), 'compiled');

      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
        mode: 'simple',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(projectDir, 'npm'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'output.js'))).toBe(true);
    });

    it('should use simple mode by default', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './npm',
      };

      const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

      expect(fs.existsSync(npmDir)).toBe(true);

      const result = await executor(options, context);

      expect(result.success).toBe(true);
      expect(fs.existsSync(npmDir)).toBe(false);
    });
  });

  describe('Recursive mode', () => {
    beforeEach(async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      await writeFileText(path.join(srcDir, 'button.tsx'), 'export const Button = () => {};');
      await writeFileText(path.join(srcDir, 'text-box.tsx'), 'export const TextBox = () => {};');
      await writeFileText(path.join(srcDir, 'index.ts'), 'export * from "./button";');

      fs.mkdirSync(path.join(srcDir, 'core'), { recursive: true });
      await writeFileText(path.join(srcDir, 'core', 'component.tsx'), 'export class Component {}');
      await writeFileText(path.join(srcDir, 'core', 'config.tsx'), 'export class Config {}');

      fs.mkdirSync(path.join(srcDir, 'data'), { recursive: true });
      await writeFileText(path.join(srcDir, 'data', 'grid.tsx'), 'export const Grid = () => {};');
    });

    it('should clean all files in target directory', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
        mode: 'recursive',
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(true);

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(false);
    });

    it('should preserve excluded directories', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
        mode: 'recursive',
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'core', 'config.tsx'))).toBe(true);
    });

    it('should clean nested directories', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
        mode: 'recursive',
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      expect(fs.existsSync(path.join(srcDir, 'data', 'grid.tsx'))).toBe(true);

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);
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
        mode: 'recursive',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'types', 'index.d.ts'))).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);
    });

    it('should handle nested exclude patterns', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      fs.mkdirSync(path.join(srcDir, 'core', 'internal'), { recursive: true });
      await writeFileText(
        path.join(srcDir, 'core', 'internal', 'impl.tsx'),
        'export const impl = {};',
      );

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core'],
        mode: 'recursive',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'internal', 'impl.tsx'))).toBe(true);
    });

    it('should clean all files when no exclude patterns specified', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        mode: 'recursive',
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'core'))).toBe(false);
    });

    it('should handle absolute exclude paths', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');
      const absoluteCorePath = path.join(srcDir, 'core');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: [absoluteCorePath],
        mode: 'recursive',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
    });
  });

  describe('Shallow mode', () => {
    beforeEach(async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      await writeFileText(path.join(srcDir, 'button.tsx'), 'export const Button = () => {};');
      await writeFileText(path.join(srcDir, 'text-box.tsx'), 'export const TextBox = () => {};');
      await writeFileText(path.join(srcDir, 'index.ts'), 'export * from "./button";');

      fs.mkdirSync(path.join(srcDir, 'core'), { recursive: true });
      await writeFileText(path.join(srcDir, 'core', 'component.tsx'), 'export class Component {}');
      await writeFileText(path.join(srcDir, 'core', 'config.tsx'), 'export class Config {}');

      fs.mkdirSync(path.join(srcDir, 'common'), { recursive: true });
      await writeFileText(path.join(srcDir, 'common', 'utils.ts'), 'export const utils = {};');

      fs.mkdirSync(path.join(srcDir, 'data'), { recursive: true });
      await writeFileText(path.join(srcDir, 'data', 'grid.tsx'), 'export const Grid = () => {};');
    });

    it('should remove only first-level items', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core', './src/common'],
        mode: 'shallow',
      };

      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(true);

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'index.ts'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'core'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'core', 'config.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
    });

    it('should preserve specific files at root level', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');
      const indexPath = path.join(srcDir, 'index.ts');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core', './src/common', indexPath],
        mode: 'shallow',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(indexPath)).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(false);

      expect(fs.existsSync(path.join(srcDir, 'core'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common'))).toBe(true);
    });

    it('should handle non-existent directory', async () => {
      const options: CleanExecutorSchema = {
        targetDirectory: './nonexistent',
        excludePatterns: [],
        mode: 'shallow',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    });

    it('should remove all items when no exclusions', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        mode: 'shallow',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'core'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'common'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);
    });

    it('should handle relative exclude paths', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: ['./src/core', './src/common'],
        mode: 'shallow',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
    });

    it('should handle absolute path exclusions', async () => {
      const srcDir = path.join(tempDir, 'packages', 'test-lib', 'src');

      const coreDir = path.join(srcDir, 'core');
      const commonDir = path.join(srcDir, 'common');
      const indexFile = path.join(srcDir, 'index.ts');

      const options: CleanExecutorSchema = {
        targetDirectory: './src',
        excludePatterns: [coreDir, commonDir, indexFile],
        mode: 'shallow',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(coreDir)).toBe(true);
      expect(fs.existsSync(commonDir)).toBe(true);
      expect(fs.existsSync(indexFile)).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'button.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'text-box.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'data'))).toBe(false);
    });
  });
});
