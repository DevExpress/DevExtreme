import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { ConcatenateFilesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

type WatchHandler = (event: string, file: string) => void;

function getWatchHandler(): WatchHandler | undefined {
  return (globalThis as unknown as { __concatWatchHandler?: WatchHandler }).__concatWatchHandler;
}

// Mock chokidar so the executor's projectRequire('chokidar') resolves; the mock captures
// the change handler on globalThis so the test can drive a rebuild deterministically.
function writeChokidarMock(projectRoot: string): void {
  const chokidarDir = path.join(projectRoot, 'node_modules', 'chokidar');
  fs.mkdirSync(chokidarDir, { recursive: true });
  fs.writeFileSync(path.join(chokidarDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
  fs.writeFileSync(
    path.join(chokidarDir, 'index.js'),
    [
      'module.exports = {',
      '  watch: function watch() {',
      '    return {',
      '      on: function on(event, handler) { globalThis.__concatWatchHandler = handler; return this; },',
      '      close: function close() { return Promise.resolve(); },',
      '    };',
      '  },',
      '};',
      '',
    ].join('\n'),
  );
}

async function waitFor(
  predicate: () => Promise<boolean> | boolean,
  timeoutMs = 3000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error('waitFor timed out');
}

describe('ConcatenateFilesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-concatenate-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should handle devextreme-bundler-config use case', async () => {
    const partsDir = path.join(projectDir, 'build', 'gulp', 'bundler-config');
    fs.mkdirSync(partsDir, { recursive: true });

    await writeFileText(
      path.join(partsDir, '01-header.js'),
      `// Some preamble to ignore\r\n/// BUNDLER_PARTS\r\n    const VERSION = '24.2';\r\n/// BUNDLER_PARTS_END\r\n// trailing code`,
    );

    await writeFileText(
      path.join(partsDir, '02-core.js'),
      `/// BUNDLER_PARTS\r\n    require('./ui/core');\r\n    require('./ui/widgets');\r\n/// BUNDLER_PARTS_END`,
    );

    await writeFileText(
      path.join(partsDir, '03-footer.js'),
      `/// BUNDLER_PARTS\r\n    module.exports = DevExpress;\r\n/// BUNDLER_PARTS_END`,
    );

    const options: ConcatenateFilesExecutorSchema = {
      sourceFiles: [
        './build/gulp/bundler-config/01-header.js',
        './build/gulp/bundler-config/02-core.js',
        './build/gulp/bundler-config/03-footer.js',
      ],
      outputFile: './artifacts/js/bundler-config.js',
      header: '/* DevExtreme Bundler Config */\n/* Generated file - do not edit */\n\n',
      footer: '\n\n/* End of bundler config */\n',
      separator: '\n',
      extractPattern: '[^]*BUNDLER_PARTS.*?$([^]*)^.*?BUNDLER_PARTS_END[^]*',
      extractPatternFlags: 'gm',
      transforms: [
        { find: '^[ ]{4}', replace: '', flags: 'gm' },
        { find: '\\n{3,}', replace: '\n\n', flags: 'g' },
      ],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const output = await readFileText(
      path.join(projectDir, 'artifacts', 'js', 'bundler-config.js'),
    );

    expect(output.startsWith('/* DevExtreme Bundler Config */')).toBe(true);

    expect(output.endsWith('/* End of bundler config */\n')).toBe(true);

    expect(output).not.toContain('BUNDLER_PARTS');
    expect(output).not.toContain('Some preamble to ignore');
    expect(output).not.toContain('trailing code');

    expect(output).toContain("const VERSION = '24.2';");
    expect(output).toContain("require('./ui/core');");
    expect(output).toContain("require('./ui/widgets');");
    expect(output).toContain('module.exports = DevExpress;');

    expect(output).not.toMatch(/^    /m);

    expect(output).not.toContain('\r\n');

    const versionPos = output.indexOf("VERSION = '24.2'");
    const requirePos = output.indexOf("require('./ui/core')");
    const exportPos = output.indexOf('module.exports');
    expect(versionPos).toBeLessThan(requirePos);
    expect(requirePos).toBeLessThan(exportPos);
  });

  it('runs additionalPasses after the primary output', async () => {
    await writeFileText(path.join(projectDir, 'a.js'), 'AAA');
    await writeFileText(path.join(projectDir, 'b.js'), 'BBB');

    const options: ConcatenateFilesExecutorSchema = {
      sourceFiles: ['./a.js', './b.js'],
      outputFile: './out/primary.js',
      separator: '\n',
      additionalPasses: [
        {
          sourceFiles: ['./out/primary.js'],
          outputFile: './out/derived.js',
          transforms: [{ find: 'A', replace: 'X', flags: 'g' }],
        },
      ],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    expect(await readFileText(path.join(projectDir, 'out', 'primary.js'))).toBe('AAA\nBBB');
    // derived pass reads the primary output and applies its own transform
    expect(await readFileText(path.join(projectDir, 'out', 'derived.js'))).toBe('XXX\nBBB');
  });

  it('watch mode rebuilds all passes on change', async () => {
    writeChokidarMock(projectDir);
    await writeFileText(path.join(projectDir, 'a.js'), 'AAA');
    await writeFileText(path.join(projectDir, 'b.js'), 'BBB');

    const options: ConcatenateFilesExecutorSchema = {
      sourceFiles: ['./a.js', './b.js'],
      outputFile: './out/primary.js',
      separator: '\n',
      additionalPasses: [{ sourceFiles: ['./out/primary.js'], outputFile: './out/derived.js' }],
      watch: true,
      watchPaths: ['./*.js'],
    };

    const primaryPath = path.join(projectDir, 'out', 'primary.js');
    const derivedPath = path.join(projectDir, 'out', 'derived.js');

    const originalOnce = process.once;
    let stopWatch: (() => void) | undefined;

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

    const run = executor(options, context);

    await waitFor(() => fs.existsSync(primaryPath) && fs.existsSync(derivedPath));
    expect(await readFileText(primaryPath)).toBe('AAA\nBBB');
    expect(await readFileText(derivedPath)).toBe('AAA\nBBB');
    expect(typeof getWatchHandler()).toBe('function');

    await writeFileText(path.join(projectDir, 'a.js'), 'CCC');
    getWatchHandler()?.('change', path.join(projectDir, 'a.js'));

    await waitFor(async () => (await readFileText(primaryPath)) === 'CCC\nBBB');
    expect(await readFileText(derivedPath)).toBe('CCC\nBBB');

    try {
      stopWatch?.();
      expect((await run).success).toBe(true);
    } finally {
      (process as unknown as { once: typeof process.once }).once = originalOnce;
    }
    delete (globalThis as unknown as { __concatWatchHandler?: WatchHandler }).__concatWatchHandler;
  });
});
