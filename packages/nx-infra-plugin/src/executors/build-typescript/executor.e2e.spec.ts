import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { BuildTypescriptExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

describe('BuildTypescriptExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-build-ts-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    const srcDir = path.join(projectDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    await writeFileText(
      path.join(srcDir, 'index.ts'),
      `export function hello(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n`,
    );

    await writeFileText(
      path.join(srcDir, 'utils.ts'),
      `export const add = (a: number, b: number): number => a + b;\n`,
    );

    fs.mkdirSync(path.join(srcDir, '__tests__'), { recursive: true });
    await writeFileText(
      path.join(srcDir, '__tests__', 'index.spec.ts'),
      `import { hello } from '../index';\ntest('hello', () => {});\n`,
    );

    await writeJson(path.join(projectDir, 'tsconfig.esm.json'), {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: './npm/esm',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
      include: ['src/**/*'],
      exclude: ['**/*.spec.ts', '**/__tests__/**'],
    });

    await writeJson(path.join(projectDir, 'tsconfig.json'), {
      compilerOptions: {
        target: 'ES2020',
        module: 'CommonJS',
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: './npm/cjs',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
      include: ['src/**/*'],
      exclude: ['**/*.spec.ts', '**/__tests__/**'],
    });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('ESM build', () => {
    it('should compile TypeScript to ESM successfully', async () => {
      const options: BuildTypescriptExecutorSchema = {
        module: 'esm',
        srcPattern: './src/**/*.{ts,tsx}',
        excludePattern: './src/**/__tests__/**/*',
        tsconfig: './tsconfig.esm.json',
        outDir: './npm/esm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const outDir = path.join(projectDir, 'npm', 'esm');

      expect(fs.existsSync(path.join(outDir, 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'utils.js'))).toBe(true);

      expect(fs.existsSync(path.join(outDir, 'index.d.ts'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'utils.d.ts'))).toBe(true);

      const indexContent = await readFileText(path.join(outDir, 'index.js'));
      expect(indexContent).toContain('export');
      expect(indexContent).not.toContain('module.exports');
    }, 10000);
  });

  describe('CJS build', () => {
    it('should compile TypeScript to CommonJS successfully', async () => {
      const options: BuildTypescriptExecutorSchema = {
        module: 'cjs',
        srcPattern: './src/**/*.{ts,tsx}',
        excludePattern: './src/**/__tests__/**/*',
        tsconfig: './tsconfig.json',
        outDir: './npm/cjs',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const outDir = path.join(projectDir, 'npm', 'cjs');

      expect(fs.existsSync(path.join(outDir, 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'utils.js'))).toBe(true);

      const indexContent = await readFileText(path.join(outDir, 'index.js'));
      expect(indexContent).toContain('exports');
      expect(indexContent).not.toContain('export function');
    }, 10000);
  });

  describe('Error handling', () => {
    it('should handle missing tsconfig file', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');

      fs.unlinkSync(path.join(projectDir, 'tsconfig.esm.json'));

      const options: BuildTypescriptExecutorSchema = {
        module: 'esm',
        tsconfig: './tsconfig.esm.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });

    it('should handle empty source directory', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');

      fs.rmSync(path.join(projectDir, 'src'), { recursive: true, force: true });
      fs.mkdirSync(path.join(projectDir, 'src'));

      const options: BuildTypescriptExecutorSchema = {
        module: 'esm',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
    });
  });
});
