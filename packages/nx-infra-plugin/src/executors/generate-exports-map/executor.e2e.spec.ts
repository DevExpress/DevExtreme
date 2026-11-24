import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { GenerateExportsMapExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { readJson, writeFileText } from '../../utils';

describe('GenerateExportsMapExecutor E2E', () => {
  let tempDir: string;
  let packageDir: string;
  let context = createMockContext();

  const write = (relativePath: string, content = ''): Promise<void> =>
    writeFileText(path.join(packageDir, relativePath), content);

  const writeJsonFile = (relativePath: string, data: object): Promise<void> =>
    write(relativePath, JSON.stringify(data));

  const run = (options: Partial<GenerateExportsMapExecutorSchema> = {}) =>
    executor({ packageDir: './npm', ignore: ['esm', 'cjs', 'bundles'], ...options }, context);

  const readExports = async (): Promise<Record<string, unknown>> =>
    (
      await readJson<Record<string, Record<string, unknown>>>(path.join(packageDir, 'package.json'))
    )['exports'];

  beforeEach(async () => {
    tempDir = createTempDir('nx-generate-exports-map-e2e-');
    context = createMockContext({ root: tempDir });
    packageDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

    await writeJsonFile('package.json', {
      name: 'test-lib',
      version: '1.0.0',
      types: './bundles/all.d.ts',
    });
    await write('bundles/all.d.ts');

    await writeJsonFile('ui/button/package.json', {
      sideEffects: false,
      main: '../../cjs/ui/button.js',
      module: '../../esm/ui/button.js',
      typings: '../button.d.ts',
    });
    await write('cjs/ui/button.js');
    await write('esm/ui/button.js');
    await write('ui/button.d.ts');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should export every stub with types, module, import, require and default conditions', async () => {
    const result = await run();
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['.']).toEqual({ types: './bundles/all.d.ts' });
    expect(exportsMap['./package.json']).toBe('./package.json');
    expect(exportsMap['./ui/button']).toEqual({
      types: './ui/button.d.ts',
      module: './esm/ui/button.js',
      import: './esm/ui/button.js',
      require: './cjs/ui/button.js',
      default: './esm/ui/button.js',
    });
    expect(Object.keys(exportsMap['./ui/button'] as object)[0]).toBe('types');
  });

  it('should export declarations without a stub as type-only modules', async () => {
    await write('ui/button_types.d.ts');
    await write('data/index.d.ts');
    await write('esm/ui/ignored.d.ts');

    const result = await run();
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['./ui/button_types']).toEqual({ types: './ui/button_types.d.ts' });
    expect(exportsMap['./data']).toEqual({ types: './data/index.d.ts' });
    expect(exportsMap['./esm/ui/ignored']).toBeUndefined();
  });

  it('should export a folder index declaration under its explicit index path', async () => {
    await writeJsonFile('events/package.json', {
      main: '../cjs/events/index.js',
      module: '../esm/events/index.js',
      typings: './index.d.ts',
    });
    await write('cjs/events/index.js');
    await write('esm/events/index.js');
    await write('events/index.d.ts');
    await write('core/index.d.ts');
    await write('data.d.ts');
    await write('data/index.d.ts');

    const result = await run();
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['./events/index']).toEqual(exportsMap['./events']);
    expect(exportsMap['./core/index']).toEqual({ types: './core/index.d.ts' });
    expect(exportsMap['./data']).toEqual({ types: './data.d.ts' });
    expect(exportsMap['./data/index']).toEqual({ types: './data/index.d.ts' });
  });

  it('should append extra exports after the generated entries', async () => {
    const result = await run({
      extraExports: {
        './dist/*': './dist/*',
        './scss/*': './scss/*',
      },
    });
    expect(result.success).toBe(true);

    const keys = Object.keys(await readExports());
    expect(keys.slice(-2)).toEqual(['./dist/*', './scss/*']);
  });

  it('should add .d type imports per folder and per root declaration when declarationImports is set', async () => {
    await write('common.d.ts');
    await write('ui/button_types.d.ts');
    await write('viz/core/utils.d.ts');
    await write('esm/ui/ignored.d.ts');

    const result = await run({ declarationImports: true });
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['./common.d']).toEqual({ types: './common.d.ts' });
    expect(exportsMap['./ui/*.d']).toEqual({ types: './ui/*.d.ts' });
    expect(exportsMap['./viz/*.d']).toEqual({ types: './viz/*.d.ts' });
    expect(exportsMap['./esm/*.d']).toBeUndefined();
    // A './*' pattern makes Node warn (DEP0155) on every 'test-lib/' request
    expect(Object.keys(exportsMap).filter((key) => key.startsWith('./*'))).toEqual([]);
  });

  it('should not add .d type imports by default', async () => {
    await write('common.d.ts');

    const result = await run();
    expect(result.success).toBe(true);

    const keys = Object.keys(await readExports());
    expect(keys.filter((key) => key.endsWith('.d'))).toEqual([]);
  });

  it('should map folder modules in directoryIndexes folders to their index.js', async () => {
    await write('esm/ui/list/index.js');
    await write('cjs/ui/list/index.js');
    await write('cjs/grids/utils.js');
    await write('cjs/grids/utils/index.js');
    await write('esm/ui/menu.js');

    const result = await run({
      directoryIndexes: ['esm', 'cjs'],
      extraExports: { './esm/*': './esm/*.js', './cjs/*': './cjs/*.js' },
    });
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['./esm/ui/list']).toBe('./esm/ui/list/index.js');
    expect(exportsMap['./cjs/ui/list']).toBe('./cjs/ui/list/index.js');
    // The sibling file wins over the folder, so the folder stays on the './cjs/*' pattern
    expect(exportsMap['./cjs/grids/utils']).toBeUndefined();
    expect(exportsMap['./esm/ui/menu']).toBeUndefined();
  });

  it('should add types to folder entries from the folder or from directoryIndexTypesFrom', async () => {
    await write('esm/common/index.js');
    await write('cjs/common/index.js');
    await write('cjs/common/index.d.ts');

    const result = await run({
      directoryIndexes: ['esm', 'cjs'],
      directoryIndexTypesFrom: { esm: 'cjs' },
    });
    expect(result.success).toBe(true);

    const exportsMap = await readExports();
    expect(exportsMap['./esm/common']).toEqual({
      types: './cjs/common/index.d.ts',
      default: './esm/common/index.js',
    });
    expect(exportsMap['./cjs/common']).toEqual({
      types: './cjs/common/index.d.ts',
      default: './cjs/common/index.js',
    });
  });

  it('should not map folder modules by default', async () => {
    await write('esm/ui/list/index.js');

    const result = await run();
    expect(result.success).toBe(true);

    expect((await readExports())['./esm/ui/list']).toBeUndefined();
  });

  describe('package with a root module', () => {
    beforeEach(async () => {
      await writeJsonFile('package.json', {
        name: 'test-lib',
        version: '1.0.0',
        main: './cjs/index.js',
        module: './esm/index.js',
        types: './cjs/index.d.ts',
      });
      await write('cjs/index.js');
      await write('cjs/index.d.ts');
      await write('esm/index.js');
      await writeJsonFile('ui/button/package.json', {
        main: '../../cjs/ui/button.js',
        module: '../../esm/ui/button.js',
        typings: '../../cjs/ui/button.d.ts',
      });
      await write('cjs/ui/button.d.ts');
    });

    it('should export the root module from main, module and types', async () => {
      const result = await run();
      expect(result.success).toBe(true);

      expect((await readExports())['.']).toEqual({
        types: './cjs/index.d.ts',
        module: './esm/index.js',
        import: './esm/index.js',
        require: './cjs/index.js',
        default: './esm/index.js',
      });
    });
  });

  it('should fail when an entry points to a missing file', async () => {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);
    await writeJsonFile('ui/menu/package.json', {
      main: '../../cjs/ui/menu.js',
      module: '../../esm/ui/menu.js',
    });

    const result = await run();

    expect(result.success).toBe(false);
    errorSpy.mockRestore();
  });
});
