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

  it('should append extra exports after the generated entries', async () => {
    const result = await run({
      extraExports: {
        './dist/*': './dist/*',
        './*.d': { types: './*.d.ts' },
      },
    });
    expect(result.success).toBe(true);

    const keys = Object.keys(await readExports());
    expect(keys.slice(-2)).toEqual(['./dist/*', './*.d']);
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
