import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { BuildAngularLibraryExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson } from '../../utils';

describe('BuildAngularLibraryExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-build-angular-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const srcDir = path.join(projectDir, 'src');

    fs.mkdirSync(srcDir, { recursive: true });

    await writeFileText(path.join(srcDir, 'index.ts'), `export * from './test.module';\n`);

    await writeFileText(
      path.join(srcDir, 'test.module.ts'),
      `import { NgModule } from '@angular/core';\n\n@NgModule({})\nexport class TestModule {}\n`,
    );

    await writeJson(path.join(projectDir, 'ng-package.json'), {
      $schema: './node_modules/ng-packagr/ng-package.schema.json',
      lib: {
        entryFile: 'index.ts',
      },
      dest: './dist',
    });

    await writeJson(path.join(projectDir, 'tsconfig.lib.json'), {
      extends: './tsconfig.json',
      angularCompilerOptions: {
        annotateForClosureCompiler: true,
        skipTemplateCodegen: true,
        strictMetadataEmit: true,
      },
      compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        declaration: true,
        paths: {
          '@test/lib': ['./src/index.ts'],
          '@test/*': ['./src/*'],
        },
      },
      files: [],
    });

    await writeJson(path.join(projectDir, 'tsconfig.json'), {
      compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        lib: ['ES2022', 'dom'],
        declaration: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    });

    const binDir = path.join(projectDir, 'node_modules', '.bin');
    fs.mkdirSync(binDir, { recursive: true });

    const ngPackagrScript = path.join(binDir, 'ng-packagr');
    await writeFileText(
      ngPackagrScript,
      `#!/usr/bin/env node
// Mock ng-packagr that exits successfully
console.log('Mock ng-packagr build');
process.exit(0);
`,
    );

    fs.chmodSync(ngPackagrScript, '755');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Successful build', () => {
    it('should build Angular library successfully', async () => {
      const options: BuildAngularLibraryExecutorSchema = {
        project: './ng-package.json',
        tsConfig: './tsconfig.lib.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    }, 10000);

    it('should use default tsConfig when not specified', async () => {
      const options: BuildAngularLibraryExecutorSchema = {
        project: './ng-package.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    }, 10000);
  });

  describe('Error handling', () => {
    it('should fail when ng-package.json is missing', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      fs.unlinkSync(path.join(projectDir, 'ng-package.json'));

      const options: BuildAngularLibraryExecutorSchema = {
        project: './ng-package.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });

    it('should fail when tsconfig is missing', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      fs.unlinkSync(path.join(projectDir, 'tsconfig.lib.json'));

      const options: BuildAngularLibraryExecutorSchema = {
        project: './ng-package.json',
        tsConfig: './tsconfig.lib.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });

    it('should fail when ng-packagr build fails', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const ngPackagrScript = path.join(projectDir, 'node_modules', '.bin', 'ng-packagr');

      await writeFileText(
        ngPackagrScript,
        `#!/usr/bin/env node
// Mock ng-packagr that fails
console.error('Mock build failure');
process.exit(1);
`,
      );

      const options: BuildAngularLibraryExecutorSchema = {
        project: './ng-package.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });
  });
});
