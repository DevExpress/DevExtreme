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
});
