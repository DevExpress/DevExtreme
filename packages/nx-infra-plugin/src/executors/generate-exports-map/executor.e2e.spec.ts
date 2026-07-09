import * as path from 'path';
import * as fs from 'fs';
import executor from './executor';
import { GenerateExportsMapExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeJson, readJson } from '../../utils/file-operations';

async function createFixture(tempDir: string, shims: Record<string, object>) {
  const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');
  fs.mkdirSync(npmDir, { recursive: true });

  await writeJson(path.join(npmDir, 'package.json'), { name: 'test-pkg', version: '1.0.0' });

  for (const [shimRelPath, shimContent] of Object.entries(shims)) {
    const shimPath = path.join(npmDir, shimRelPath);
    fs.mkdirSync(path.dirname(shimPath), { recursive: true });
    await writeJson(shimPath, shimContent);
  }

  return npmDir;
}

describe('GenerateExportsMapExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(() => {
    tempDir = createTempDir('nx-exports-map-e2e-');
    context = createMockContext({ root: tempDir });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should add exports map to root package.json from shims', async () => {
    const npmDir = await createFixture(tempDir, {
      'events/package.json': {
        main: '../cjs/events/index.js',
        module: '../esm/events/index.js',
        typings: './index.d.ts',
      },
      'common/package.json': {
        main: '../cjs/common.js',
        module: '../esm/common.js',
        typings: '../common.d.ts',
      },
    });

    const options: GenerateExportsMapExecutorSchema = { npmDir: './npm' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const pkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    const exports = pkg['exports'] as Record<string, unknown>;

    expect(exports['./package.json']).toBe('./package.json');
    expect(exports['./events']).toEqual({
      import: './esm/events/index.js',
      require: './cjs/events/index.js',
      types: './events/index.d.ts',
    });
    expect(exports['./common']).toEqual({
      import: './esm/common.js',
      require: './cjs/common.js',
      types: './common.d.ts',
    });
  });

  it('should include asset wildcards', async () => {
    const npmDir = await createFixture(tempDir, {});

    const options: GenerateExportsMapExecutorSchema = {
      npmDir: './npm',
      assetWildcards: ['./dist/*', './localization/messages/*.json'],
    };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const pkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    const exports = pkg['exports'] as Record<string, unknown>;

    expect(exports['./dist/*']).toBe('./dist/*');
    expect(exports['./localization/messages/*.json']).toBe('./localization/messages/*.json');
  });

  it('should omit types when shim has no typings field', async () => {
    const npmDir = await createFixture(tempDir, {
      'aspnet/package.json': {
        main: '../cjs/aspnet.js',
        module: '../esm/aspnet.js',
      },
    });

    const options: GenerateExportsMapExecutorSchema = { npmDir: './npm' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const pkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    const exports = pkg['exports'] as Record<string, unknown>;

    expect(exports['./aspnet']).toEqual({
      import: './esm/aspnet.js',
      require: './cjs/aspnet.js',
    });
  });

  it('should handle deep subpaths', async () => {
    const npmDir = await createFixture(tempDir, {
      'common/core/events/core/events_engine/package.json': {
        main: '../../../../../cjs/common/core/events/core/events_engine.js',
        module: '../../../../../esm/common/core/events/core/events_engine.js',
        typings: '../events_engine.d.ts',
      },
    });

    const options: GenerateExportsMapExecutorSchema = { npmDir: './npm' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const pkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    const exports = pkg['exports'] as Record<string, unknown>;

    expect(exports['./common/core/events/core/events_engine']).toEqual({
      import: './esm/common/core/events/core/events_engine.js',
      require: './cjs/common/core/events/core/events_engine.js',
      types: './common/core/events/core/events_engine.d.ts',
    });
  });

  it('should preserve existing root package.json fields', async () => {
    const npmDir = await createFixture(tempDir, {});

    const options: GenerateExportsMapExecutorSchema = { npmDir: './npm' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const pkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    expect(pkg['name']).toBe('test-pkg');
    expect(pkg['version']).toBe('1.0.0');
    expect(pkg['exports']).toBeDefined();
  });
});
