import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { PrepareSubmodulesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
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
      `export { Button } from "./button";\nexport { Grid } from "./data/grid";\nexport { Chart } from "./viz/chart";`,
    );

    await writeFileText(path.join(npmDir, 'esm', 'button.js'), 'export const Button = () => {};');
    fs.mkdirSync(path.join(npmDir, 'esm', 'data'), { recursive: true });
    await writeFileText(
      path.join(npmDir, 'esm', 'data', 'grid.js'),
      'export const Grid = () => {};',
    );
    fs.mkdirSync(path.join(npmDir, 'esm', 'viz'), { recursive: true });
    await writeFileText(
      path.join(npmDir, 'esm', 'viz', 'chart.js'),
      'export const Chart = () => {};',
    );

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
    it('should generate package.json files for top-level modules with correct relative paths', async () => {
      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');
      const buttonPkg = JSON.parse(await readFileText(path.join(npmDir, 'button', 'package.json')));

      expect(buttonPkg.sideEffects).toBe(false);
      expect(buttonPkg.main).toBe('../cjs/button.js');
      expect(buttonPkg.module).toBe('../esm/button.js');
      expect(buttonPkg.typings).toBe('../cjs/button.d.ts');
    });

    it('should discover nested module exports from the ESM index file', async () => {
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

    it('should pick up additional submodules added to the ESM index file', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      await writeFileText(path.join(npmDir, 'esm', 'custom.js'), 'export const Custom = {};');
      await writeFileText(path.join(npmDir, 'cjs', 'custom.js'), 'module.exports = {};');

      const esmIndex = await readFileText(path.join(npmDir, 'esm', 'index.js'));
      await writeFileText(
        path.join(npmDir, 'esm', 'index.js'),
        esmIndex + '\nexport { Custom } from "./custom";',
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

    it('should generate package.json files for explicit submoduleFolders entries', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      fs.mkdirSync(path.join(npmDir, 'esm', 'common'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'esm', 'common', 'index.js'),
        'export * from "./core";',
      );
      fs.mkdirSync(path.join(npmDir, 'esm', 'common', 'core'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'esm', 'common', 'core', 'index.js'),
        'export class Component {}',
      );

      fs.mkdirSync(path.join(npmDir, 'cjs', 'common'), { recursive: true });
      await writeFileText(path.join(npmDir, 'cjs', 'common', 'index.js'), 'module.exports = {};');
      fs.mkdirSync(path.join(npmDir, 'cjs', 'common', 'core'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'cjs', 'common', 'core', 'index.js'),
        'module.exports = {};',
      );

      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
        submoduleFolders: [['common'], ['common/core']],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      expect(fs.existsSync(path.join(npmDir, 'common', 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'common', 'core', 'package.json'))).toBe(true);
    });
  });

  describe('Package.json content validation', () => {
    it('should generate correct paths for nested folder modules with index.js', async () => {
      const npmDir = path.join(tempDir, 'packages', 'test-package', 'npm');

      fs.mkdirSync(path.join(npmDir, 'esm', 'common', 'core'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'esm', 'common', 'core', 'index.js'),
        'export class Component {}',
      );
      fs.mkdirSync(path.join(npmDir, 'cjs', 'common', 'core'), { recursive: true });
      await writeFileText(
        path.join(npmDir, 'cjs', 'common', 'core', 'index.js'),
        'module.exports = {};',
      );

      const options: PrepareSubmodulesExecutorSchema = {
        distDirectory: './npm',
        submoduleFolders: [['common/core']],
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const commonCorePkg = JSON.parse(
        await readFileText(path.join(npmDir, 'common', 'core', 'package.json')),
      );

      expect(commonCorePkg.main).toBe('../../cjs/common/core/index.js');
      expect(commonCorePkg.module).toBe('../../esm/common/core/index.js');
      expect(commonCorePkg.typings).toBe('../../cjs/common/core/index.d.ts');
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
      const firstPkg = JSON.parse(await readFileText(path.join(npmDir, 'button', 'package.json')));

      const result2 = await executor(options, context);
      expect(result2.success).toBe(true);

      const secondPkg = JSON.parse(await readFileText(path.join(npmDir, 'button', 'package.json')));

      expect(secondPkg).toEqual(firstPkg);
    });
  });
});
