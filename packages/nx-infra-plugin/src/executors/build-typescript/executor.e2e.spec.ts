import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { BuildTypescriptExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

describe('BuildTypescriptExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-build-ts-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');

    const srcDir = path.join(projectDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    const utilsDir = path.join(srcDir, 'utils');
    fs.mkdirSync(utilsDir, { recursive: true });

    await writeFileText(
      path.join(utilsDir, 'index.ts'),
      `export const add = (a: number, b: number): number => a + b;\n`,
    );

    await writeFileText(
      path.join(srcDir, 'index.ts'),
      `import { add } from '@lib/utils';\nexport function hello(name: string): string {\n  return \`Hello, \${name}! Sum: \${add(1, 2)}\`;\n}\n`,
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
        baseUrl: './src',
        paths: {
          '@lib/*': ['./*'],
        },
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
        baseUrl: './src',
        paths: {
          '@lib/*': ['./*'],
        },
      },
      include: ['src/**/*'],
      exclude: ['**/*.spec.ts', '**/__tests__/**'],
    });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe.each([
    {
      moduleType: 'esm' as const,
      tsconfig: './tsconfig.esm.json',
      outDir: './npm/esm',
      expectedExport: 'export',
      unexpectedExport: 'module.exports',
    },
    {
      moduleType: 'cjs' as const,
      tsconfig: './tsconfig.json',
      outDir: './npm/cjs',
      expectedExport: 'exports',
      unexpectedExport: 'export function',
    },
  ])('$moduleType build', ({ moduleType, tsconfig, outDir, expectedExport, unexpectedExport }) => {
    it('should compile and exclude test files', async () => {
      const options: BuildTypescriptExecutorSchema = {
        module: moduleType,
        srcPattern: './src/**/*.{ts,tsx}',
        excludePatterns: ['./src/**/__tests__/**/*'],
        tsconfig,
        outDir,
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, outDir.replace('./', ''));

      expect(fs.existsSync(path.join(outputDir, 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'utils', 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'index.d.ts'))).toBe(true);

      expect(fs.existsSync(path.join(outputDir, '__tests__'))).toBe(false);

      const indexContent = await readFileText(path.join(outputDir, 'index.js'));
      expect(indexContent).toContain(expectedExport);
      expect(indexContent).not.toContain(unexpectedExport);

      expect(indexContent).toContain('@lib/utils');
    }, 10000);

    it('should resolve path aliases when resolvePaths is enabled', async () => {
      const options: BuildTypescriptExecutorSchema = {
        module: moduleType,
        srcPattern: './src/**/*.{ts,tsx}',
        excludePatterns: ['./src/**/__tests__/**/*'],
        tsconfig,
        outDir,
        resolvePaths: true,
        resolvePathsBaseDir: './src',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, outDir.replace('./', ''));
      const indexContent = await readFileText(path.join(outputDir, 'index.js'));

      expect(indexContent).not.toContain('@lib/utils');
      expect(indexContent).toContain('./utils');
    }, 10000);
  });

  describe('Error handling', () => {
    it('should fail when tsconfig is missing', async () => {
      fs.unlinkSync(path.join(projectDir, 'tsconfig.esm.json'));

      const result = await executor({ tsconfig: './tsconfig.esm.json' }, context);

      expect(result.success).toBe(false);
    });

    it('should fail when no files match pattern', async () => {
      const result = await executor({ srcPattern: './nonexistent/**/*.ts' }, context);

      expect(result.success).toBe(false);
    });

    it('should fail when resolvePaths is true but resolvePathsBaseDir is missing', async () => {
      const result = await executor({ resolvePaths: true }, context);

      expect(result.success).toBe(false);
    });
  });

  describe('watch mode', () => {
    async function waitFor(predicate: () => boolean, timeoutMs = 20000): Promise<void> {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (predicate()) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error('waitFor timed out');
    }

    it('emits to outDir with alias resolution and stops on SIGINT', async () => {
      const options: BuildTypescriptExecutorSchema = {
        module: 'esm',
        tsconfig: './tsconfig.esm.json',
        outDir: './npm/esm-watch',
        resolvePaths: true,
        resolvePathsBaseDir: './src',
        watch: true,
      };

      const outIndex = path.join(projectDir, 'npm', 'esm-watch', 'index.js');

      const originalOnce = process.once;
      let stopWatch: (() => void) | undefined;
      let run: Promise<{ success: boolean }> | undefined;

      (process as unknown as { once: typeof process.once }).once = ((
        event: string,
        handler: () => void,
      ) => {
        if (event === 'SIGINT' || event === 'SIGTERM') {
          stopWatch = handler;
          return process;
        }
        return originalOnce.call(process, event, handler as never);
      }) as typeof process.once;

      try {
        run = executor(options, context);

        await waitFor(() => fs.existsSync(outIndex));
        const indexContent = await readFileText(outIndex);
        expect(indexContent).not.toContain('@lib/utils');

        stopWatch?.();
        stopWatch = undefined;

        expect((await run).success).toBe(true);
        run = undefined;
      } finally {
        stopWatch?.();
        if (run) {
          await run;
        }
        (process as unknown as { once: typeof process.once }).once = originalOnce;
      }
    }, 30000);
  });
});
