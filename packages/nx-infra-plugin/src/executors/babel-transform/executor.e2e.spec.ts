import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { BabelTransformExecutorSchema } from './schema';
import {
  createTempDir,
  cleanupTempDir,
  createMockContext,
  findWorkspaceRoot,
} from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

const WORKSPACE_ROOT = findWorkspaceRoot();

type WatchHandler = (event: string, file: string) => void;

function getWatchHandler(): WatchHandler | undefined {
  return (globalThis as unknown as { __babelWatchHandler?: WatchHandler }).__babelWatchHandler;
}

// Mock chokidar so the shared watch util's projectRequire('chokidar') resolves; the mock
// captures the 'all' handler on globalThis so the test can drive a rebuild deterministically.
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
      '      on: function on(event, handler) { globalThis.__babelWatchHandler = handler; return this; },',
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

const BABEL_CONFIG = `
'use strict';

const common = {
  plugins: [
    ['babel-plugin-inferno', { 'imports': true }],
    ['@babel/plugin-transform-object-rest-spread', { loose: true }],
  ],
  ignore: ['**/*.json'],
};

const targets = { ios: 15, android: 95, samsung: 13 };

module.exports = {
  cjs: Object.assign({}, common, {
    presets: [['@babel/preset-env', { targets }]],
    plugins: common.plugins.concat([
      ['add-module-exports', { addDefaultProperty: true }],
      ['@babel/plugin-transform-modules-commonjs', { strict: true }]
    ])
  }),
  esm: Object.assign({}, common, {
    presets: [['@babel/preset-env', { targets, modules: false }]],
    plugins: common.plugins.concat([
      ['@babel/plugin-transform-runtime', { useESModules: true, version: '7.5.0' }]
    ])
  })
};
`;

describe('BabelTransformExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let savedCwd: string;

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-babel-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });

    const infraPluginNodeModules = path.join(
      WORKSPACE_ROOT,
      'packages',
      'nx-infra-plugin',
      'node_modules',
    );
    const tempNodeModules = path.join(projectDir, 'node_modules');
    fs.symlinkSync(infraPluginNodeModules, tempNodeModules, 'junction');

    process.chdir(projectDir);

    const buildDir = path.join(projectDir, 'build', 'gulp');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(path.join(buildDir, 'transpile-config.js'), BABEL_CONFIG);

    const jsDir = path.join(projectDir, 'js');
    fs.mkdirSync(jsDir, { recursive: true });

    await writeFileText(
      path.join(jsDir, 'module.js'),
      `import { helper } from './utils';

export default function greet(name) {
  return \`Hello, \${name}!\`;
}

export const add = (a, b) => a + b;
`,
    );

    await writeFileText(
      path.join(jsDir, 'utils.js'),
      `export const something = 'test';

//#DEBUG
console.log('This is debug code');
const debugOnly = true;
//#ENDDEBUG

export function helper() {
  return 42;
}
`,
    );
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
  });

  describe.each([
    {
      configKey: 'cjs',
      outDir: './artifacts/transpiled',
      shouldContain: ['exports'],
      shouldNotContain: ['export default function'],
    },
    {
      configKey: 'esm',
      outDir: './artifacts/esm',
      shouldContain: ['export'],
      shouldNotContain: ['module.exports'],
    },
  ])('$configKey config', ({ configKey, outDir, shouldContain, shouldNotContain }) => {
    it('should transform files correctly', async () => {
      const options: BabelTransformExecutorSchema = {
        babelConfigPath: './build/gulp/transpile-config.js',
        configKey,
        sourcePattern: './js/**/*.js',
        outDir,
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, outDir.replace('./', ''));

      expect(fs.existsSync(path.join(outputDir, 'module.js'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'utils.js'))).toBe(true);

      const moduleContent = await readFileText(path.join(outputDir, 'module.js'));

      shouldContain.forEach((text) => expect(moduleContent).toContain(text));
      shouldNotContain.forEach((text) => expect(moduleContent).not.toContain(text));
    }, 30000);
  });

  it('should forward removeDebug option to stripDebug helper', async () => {
    const options: BabelTransformExecutorSchema = {
      babelConfigPath: './build/gulp/transpile-config.js',
      configKey: 'cjs',
      sourcePattern: './js/**/*.js',
      outDir: './artifacts/transpiled-prod',
      removeDebug: true,
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const utilsContent = await readFileText(
      path.join(projectDir, 'artifacts', 'transpiled-prod', 'utils.js'),
    );

    expect(utilsContent).not.toContain('This is debug code');
  }, 30000);

  describe('copyAssets option', () => {
    const MINIMAL_BABEL_CONFIG = `
'use strict';
module.exports = {
  cjs: {
    plugins: [['@babel/plugin-transform-modules-commonjs', { strict: true }]],
  },
};
`;
    const minimalConfigPath = './build/gulp/minimal-config.js';

    beforeEach(async () => {
      await writeFileText(path.join(projectDir, minimalConfigPath), MINIMAL_BABEL_CONFIG);
    });

    it('should not copy any extra files when copyAssets is omitted', async () => {
      const options: BabelTransformExecutorSchema = {
        babelConfigPath: minimalConfigPath,
        configKey: 'cjs',
        sourcePattern: './js/**/*.js',
        outDir: './artifacts/transpiled-no-assets',
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, 'artifacts', 'transpiled-no-assets');
      const entries = fs.readdirSync(outputDir).sort();

      expect(entries).toEqual(['module.js', 'utils.js']);
    }, 30000);

    it('should copy a single asset file into outDir', async () => {
      const settingsPath = path.join(projectDir, 'js', 'viz', 'vector_map.utils', '_settings.json');
      await writeFileText(settingsPath, JSON.stringify({ scale: 1 }));

      const options: BabelTransformExecutorSchema = {
        babelConfigPath: minimalConfigPath,
        configKey: 'cjs',
        sourcePattern: './js/**/*.js',
        outDir: './artifacts/transpiled-with-file-asset',
        copyAssets: [
          {
            from: './js/viz/vector_map.utils/_settings.json',
            to: './viz/vector_map.utils/_settings.json',
          },
        ],
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, 'artifacts', 'transpiled-with-file-asset');
      const copiedSettingsPath = path.join(outputDir, 'viz', 'vector_map.utils', '_settings.json');

      expect(fs.existsSync(copiedSettingsPath)).toBe(true);
      const copiedSettings = JSON.parse(await readFileText(copiedSettingsPath));
      expect(copiedSettings).toEqual({ scale: 1 });

      expect(fs.existsSync(path.join(outputDir, 'module.js'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'utils.js'))).toBe(true);
    }, 30000);

    it('should copy a directory of assets recursively into outDir', async () => {
      const messagesDir = path.join(projectDir, 'js', 'localization', 'messages');
      fs.mkdirSync(messagesDir, { recursive: true });
      await writeFileText(path.join(messagesDir, 'en.json'), JSON.stringify({ greeting: 'Hello' }));
      await writeFileText(path.join(messagesDir, 'de.json'), JSON.stringify({ greeting: 'Hallo' }));

      const nestedDir = path.join(messagesDir, 'extra');
      fs.mkdirSync(nestedDir, { recursive: true });
      await writeFileText(path.join(nestedDir, 'fr.json'), JSON.stringify({ greeting: 'Bonjour' }));

      const options: BabelTransformExecutorSchema = {
        babelConfigPath: minimalConfigPath,
        configKey: 'cjs',
        sourcePattern: './js/**/*.js',
        outDir: './artifacts/transpiled-with-dir-asset',
        copyAssets: [
          {
            from: './js/localization/messages',
            to: './localization/messages',
          },
        ],
      };

      const result = await executor(options, context);
      expect(result.success).toBe(true);

      const outputDir = path.join(projectDir, 'artifacts', 'transpiled-with-dir-asset');
      const copiedMessagesDir = path.join(outputDir, 'localization', 'messages');

      expect(fs.existsSync(path.join(copiedMessagesDir, 'en.json'))).toBe(true);
      expect(fs.existsSync(path.join(copiedMessagesDir, 'de.json'))).toBe(true);
      expect(fs.existsSync(path.join(copiedMessagesDir, 'extra', 'fr.json'))).toBe(true);

      const enContent = JSON.parse(await readFileText(path.join(copiedMessagesDir, 'en.json')));
      expect(enContent).toEqual({ greeting: 'Hello' });
    }, 30000);
  });
});

describe('BabelTransformExecutor flat config + watch', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let savedCwd: string;

  const FLAT_CONFIG = JSON.stringify({ comments: false });

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-babel-watch-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });
    await writeFileText(
      path.join(projectDir, 'package.json'),
      JSON.stringify({ name: 'test-lib' }),
    );
    process.chdir(projectDir);

    // Flat (keyless) babel config, mirroring testing/tests.babelrc.json usage.
    await writeFileText(path.join(projectDir, 'babel.flat.json'), FLAT_CONFIG);

    const jsDir = path.join(projectDir, 'js');
    fs.mkdirSync(jsDir, { recursive: true });
    await writeFileText(
      path.join(jsDir, 'a.js'),
      'const a = 1; // comment-a\nmodule.exports = a;\n',
    );
    await writeFileText(
      path.join(jsDir, 'b.js'),
      'const b = 2; // comment-b\nmodule.exports = b;\n',
    );
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
    delete (globalThis as unknown as { __babelWatchHandler?: WatchHandler }).__babelWatchHandler;
  });

  it('uses the whole module as the babel config when configKey is omitted', async () => {
    const options: BabelTransformExecutorSchema = {
      babelConfigPath: './babel.flat.json',
      sourcePattern: './js/**/*.js',
      outDir: './out',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const aContent = await readFileText(path.join(projectDir, 'out', 'a.js'));
    expect(aContent).not.toContain('comment-a');
  }, 30000);

  it('watch mode re-transforms only the changed file', async () => {
    writeChokidarMock(projectDir);

    const options: BabelTransformExecutorSchema = {
      babelConfigPath: './babel.flat.json',
      sourcePattern: './js/**/*.js',
      outDir: './out',
      watch: true,
    };

    const aOut = path.join(projectDir, 'out', 'a.js');
    const bOut = path.join(projectDir, 'out', 'b.js');

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

      await waitFor(() => typeof getWatchHandler() === 'function');

      // Only a.js changes; b.js must stay untouched (file-level incremental).
      getWatchHandler()?.('change', path.join(projectDir, 'js', 'a.js'));

      await waitFor(() => fs.existsSync(aOut));
      expect(await readFileText(aOut)).not.toContain('comment-a');
      expect(fs.existsSync(bOut)).toBe(false);

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
