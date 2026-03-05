import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { CreateDualModeManifestExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

describe('CreateDualModeManifest Executor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-dual-mode-manifest-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });

    const esmDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'esm');
    fs.mkdirSync(esmDir, { recursive: true });

    const cjsDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'cjs');
    fs.mkdirSync(cjsDir, { recursive: true });

    const srcDir = path.join(projectDir, 'js');
    fs.mkdirSync(srcDir, { recursive: true });

    await writeFileText(
      path.join(esmDir, 'core.js'),
      `export function coreFunction() { return 'core'; }`,
    );

    await writeFileText(
      path.join(esmDir, 'utils.js'),
      `export function utilFunction() { return 'util'; }`,
    );

    const esmSubDir = path.join(esmDir, 'ui');
    fs.mkdirSync(esmSubDir, { recursive: true });
    await writeFileText(path.join(esmSubDir, 'index.js'), `export { Button } from './button';`);
    await writeFileText(path.join(esmSubDir, 'button.js'), `export const Button = () => {};`);

    await writeFileText(
      path.join(cjsDir, 'core.js'),
      `"use strict"; module.exports.coreFunction = function() { return 'core'; };`,
    );
    await writeFileText(
      path.join(cjsDir, 'utils.js'),
      `"use strict"; module.exports.utilFunction = function() { return 'util'; };`,
    );

    const cjsSubDir = path.join(cjsDir, 'ui');
    fs.mkdirSync(cjsSubDir, { recursive: true });
    await writeFileText(
      path.join(cjsSubDir, 'index.js'),
      `"use strict"; var button = require('./button'); module.exports.Button = button.Button;`,
    );
    await writeFileText(
      path.join(cjsSubDir, 'button.js'),
      `"use strict"; module.exports.Button = function() {};`,
    );
    await writeFileText(
      path.join(srcDir, 'core.d.ts'),
      `export declare function coreFunction(): string;`,
    );

    const srcSubDir = path.join(srcDir, 'ui');
    fs.mkdirSync(srcSubDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Main functionality', () => {
    it('should create package.json files for each JS module', async () => {
      const options: CreateDualModeManifestExecutorSchema = {
        esmDir: './artifacts/transpiled-esm-npm/esm',
        cjsDir: './artifacts/transpiled-esm-npm/cjs',
        outputDir: './artifacts/transpiled-esm-npm',
        srcDir: './js',
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm');

      expect(fs.existsSync(path.join(outputDir, 'core', 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'utils', 'package.json'))).toBe(true);

      expect(fs.existsSync(path.join(outputDir, 'ui', 'package.json'))).toBe(true);

      expect(fs.existsSync(path.join(outputDir, 'ui', 'button', 'package.json'))).toBe(true);
    }, 30000);

    it('should include main, module, and sideEffects fields', async () => {
      const options: CreateDualModeManifestExecutorSchema = {
        esmDir: './artifacts/transpiled-esm-npm/esm',
        cjsDir: './artifacts/transpiled-esm-npm/cjs',
        outputDir: './artifacts/transpiled-esm-npm',
        srcDir: './js',
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const packageJson = JSON.parse(
        await readFileText(
          path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'core', 'package.json'),
        ),
      );

      expect(packageJson.main).toBeDefined();
      expect(packageJson.main).toContain('cjs');
      expect(packageJson.main).toContain('core.js');

      expect(packageJson.module).toBeDefined();
      expect(packageJson.module).toContain('esm');
      expect(packageJson.module).toContain('core.js');

      expect(packageJson.sideEffects).toBe(false);
    }, 30000);

    it('should include typings field when .d.ts file exists', async () => {
      const options: CreateDualModeManifestExecutorSchema = {
        esmDir: './artifacts/transpiled-esm-npm/esm',
        cjsDir: './artifacts/transpiled-esm-npm/cjs',
        outputDir: './artifacts/transpiled-esm-npm',
        srcDir: './js',
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const corePackageJson = JSON.parse(
        await readFileText(
          path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'core', 'package.json'),
        ),
      );
      expect(corePackageJson.typings).toBeDefined();
      expect(corePackageJson.typings).toContain('core.d.ts');

      const utilsPackageJson = JSON.parse(
        await readFileText(
          path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'utils', 'package.json'),
        ),
      );
      expect(utilsPackageJson.typings).toBeUndefined();
    }, 30000);
  });

  describe('Index file handling', () => {
    it('should place package.json in same directory for index.js files', async () => {
      const options: CreateDualModeManifestExecutorSchema = {
        esmDir: './artifacts/transpiled-esm-npm/esm',
        cjsDir: './artifacts/transpiled-esm-npm/cjs',
        outputDir: './artifacts/transpiled-esm-npm',
        srcDir: './js',
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const indexPackageJson = JSON.parse(
        await readFileText(
          path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'ui', 'package.json'),
        ),
      );

      expect(indexPackageJson.main).toBeDefined();
      expect(indexPackageJson.module).toBeDefined();
    }, 30000);
  });

  describe('Generated .d.ts files', () => {
    it('should include typings for generated .d.ts files', async () => {
      const options: CreateDualModeManifestExecutorSchema = {
        esmDir: './artifacts/transpiled-esm-npm/esm',
        cjsDir: './artifacts/transpiled-esm-npm/cjs',
        outputDir: './artifacts/transpiled-esm-npm',
        srcDir: './js',
        generatedDtsFiles: ['utils.d.ts'],
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const utilsPackageJson = JSON.parse(
        await readFileText(
          path.join(projectDir, 'artifacts', 'transpiled-esm-npm', 'utils', 'package.json'),
        ),
      );
      expect(utilsPackageJson.typings).toBeDefined();
      expect(utilsPackageJson.typings).toContain('utils.d.ts');
    }, 30000);
  });
});
