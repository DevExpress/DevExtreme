import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { PrepareSubmodulesExecutorSchema } from './schema';
import {
  createTempDir,
  cleanupTempDir,
  createMockContext,
} from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

describe('PrepareSubmodulesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-prepare-submodules-e2e-');
    context = createMockContext({
      root: tempDir,
      projectName: 'test-package',
      projectRoot: 'packages/test-package',
    });

    const projectDir = path.join(tempDir, 'packages', 'test-package');
    const npmDir = path.join(projectDir, 'npm');

    fs.mkdirSync(path.join(npmDir, 'esm'), { recursive: true });
    fs.mkdirSync(path.join(npmDir, 'cjs'), { recursive: true });

    await writeFileText(
      path.join(npmDir, 'esm', 'index.js'),
      `export { Button } from "./button";\nexport { Grid } from "./data/grid";\nexport { Chart } from "./viz/chart";`
    );

    await writeFileText(path.join(npmDir, 'esm', 'button.js'), 'export const Button = () => {};');
    fs.mkdirSync(path.join(npmDir, 'esm', 'data'), { recursive: true });
    await writeFileText(path.join(npmDir, 'esm', 'data', 'grid.js'), 'export const Grid = () => {};');
    fs.mkdirSync(path.join(npmDir, 'esm', 'viz'), { recursive: true });
    await writeFileText(path.join(npmDir, 'esm', 'viz', 'chart.js'), 'export const Chart = () => {};');

    await writeFileText(path.join(npmDir, 'cjs', 'index.js'), 'module.exports = {};');
    await writeFileText(path.join(npmDir, 'cjs', 'button.js'), 'module.exports = {};');
    fs.mkdirSync(path.join(npmDir, 'cjs', 'data'), { recursive: true });
    await writeFileText(path.join(npmDir, 'cjs', 'data', 'grid.js'), 'module.exports = {};');
    fs.mkdirSync(path.join(npmDir, 'cjs', 'viz'), { recursive: true });
    await writeFileText(path.join(npmDir, 'cjs', 'viz', 'chart.js'), 'module.exports = {};');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Basic functionality', () => {
    it('should generate package.json files for discovered modules', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      const buttonPkgPath = path.join(npmDir, 'button', 'package.json');
      expect(fs.existsSync(buttonPkgPath)).toBe(true);

      const buttonPkg = JSON.parse(await readFileText(buttonPkgPath));
      expect(buttonPkg).toMatchObject({
        sideEffects: false,
        main: expect.stringContaining('cjs/button.js'),
        module: expect.stringContaining('esm/button.js'),
        typings: expect.stringContaining('cjs/button.d.ts'),
      });
    });

    it('should handle nested module structures', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      const gridPkgPath = path.join(npmDir, 'grid', 'package.json');
      expect(fs.existsSync(gridPkgPath)).toBe(true);

      const gridPkg = JSON.parse(await readFileText(gridPkgPath));
      expect(gridPkg.module).toContain('esm/data/grid.js');
    });

    it('should work with custom submodule files', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      await writeFileText(path.join(npmDir, 'esm', 'custom.js'), 'export const Custom = {};');
      await writeFileText(path.join(npmDir, 'cjs', 'custom.js'), 'module.exports = {};');

      const esmIndex = await readFileText(path.join(npmDir, 'esm', 'index.js'));
      await writeFileText(
        path.join(npmDir, 'esm', 'index.js'),
        esmIndex + '\nexport { Custom } from "./custom";'
      );

      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const customPkgPath = path.join(npmDir, 'custom', 'package.json');
      expect(fs.existsSync(customPkgPath)).toBe(true);

      const customPkg = JSON.parse(await readFileText(customPkgPath));
      expect(customPkg.module).toBe('../esm/custom.js');
    });

    it('should handle devextreme-react-like structure', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      fs.mkdirSync(path.join(npmDir, 'esm', 'common'), { recursive: true });
      await writeFileText(path.join(npmDir, 'esm', 'common', 'index.js'), 'export * from "./core";');
      fs.mkdirSync(path.join(npmDir, 'esm', 'common', 'core'), { recursive: true });
      await writeFileText(path.join(npmDir, 'esm', 'common', 'core', 'index.js'), 'export class Component {}');

      fs.mkdirSync(path.join(npmDir, 'cjs', 'common'), { recursive: true });
      await writeFileText(path.join(npmDir, 'cjs', 'common', 'index.js'), 'module.exports = {};');
      fs.mkdirSync(path.join(npmDir, 'cjs', 'common', 'core'), { recursive: true });
      await writeFileText(path.join(npmDir, 'cjs', 'common', 'core', 'index.js'), 'module.exports = {};');

      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
        submoduleFolders: [
          ['common'],
          ['common/core'],
        ],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(npmDir, 'common', 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'common', 'core', 'package.json'))).toBe(true);
    });
  });

  describe('Package.json content validation', () => {
    it('should generate correct relative paths for top-level modules', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      await executor(options, context);

      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');
      const buttonPkg = JSON.parse(
        await readFileText(path.join(npmDir, 'button', 'package.json'))
      );

      expect(buttonPkg.main).toBe('../cjs/button.js');
      expect(buttonPkg.module).toBe('../esm/button.js');
      expect(buttonPkg.typings).toBe('../cjs/button.d.ts');
    });
  });

  describe('Error handling', () => {
    it('should handle missing dist directory gracefully', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './nonexistent',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle empty ESM index file', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');
      await writeFileText(path.join(npmDir, 'esm', 'index.js'), '');

      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple runs idempotently', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result1 = await executor(options, context);
      expect(result1.success).toBe(true);

      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');
      const firstPkg = JSON.parse(
        await readFileText(path.join(npmDir, 'button', 'package.json'))
      );

      const result2 = await executor(options, context);
      expect(result2.success).toBe(true);

      const secondPkg = JSON.parse(
        await readFileText(path.join(npmDir, 'button', 'package.json'))
      );

      expect(secondPkg).toEqual(firstPkg);
    });
  });
});
