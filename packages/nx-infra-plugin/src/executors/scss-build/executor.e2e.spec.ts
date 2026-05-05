import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { ScssBuildExecutorSchema } from './schema';
import { createMockContext, createTempDir, cleanupTempDir } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

function createMockModules(workspaceRoot: string, projectRoot: string): void {
  const projectNodeModules = path.join(projectRoot, 'node_modules', 'sass-embedded');
  fs.mkdirSync(projectNodeModules, { recursive: true });
  fs.writeFileSync(
    path.join(projectNodeModules, 'index.js'),
    [
      'class SassString {',
      '  constructor(value) { this.value = value; }',
      '}',
      'module.exports = {',
      '  SassString,',
      '  compile: () => ({ css: \'@charset "UTF-8"; .a{display:flex}\' })',
      '};',
      '',
    ].join('\n'),
    'utf8',
  );

  const workspaceNodeModules = path.join(workspaceRoot, 'node_modules');
  fs.mkdirSync(workspaceNodeModules, { recursive: true });

  const postcssDir = path.join(workspaceNodeModules, 'postcss');
  fs.mkdirSync(postcssDir, { recursive: true });
  fs.writeFileSync(
    path.join(postcssDir, 'index.js'),
    [
      'module.exports = function postcss() {',
      '  return {',
      '    process: async (css) => ({ css: css + "/*prefixed*/" })',
      '  };',
      '};',
      '',
    ].join('\n'),
    'utf8',
  );

  const autoprefixerDir = path.join(workspaceNodeModules, 'autoprefixer');
  fs.mkdirSync(autoprefixerDir, { recursive: true });
  fs.writeFileSync(
    path.join(autoprefixerDir, 'index.js'),
    'module.exports = function autoprefixer() { return { postcssPlugin: "autoprefixer" }; };',
    'utf8',
  );

  const cleanCssDir = path.join(workspaceNodeModules, 'clean-css');
  fs.mkdirSync(cleanCssDir, { recursive: true });
  fs.writeFileSync(
    path.join(cleanCssDir, 'index.js'),
    [
      'module.exports = class CleanCss {',
      '  constructor(options) { this.options = options || {}; }',
      '  minify(css) {',
      '    return { styles: css + "/*min:" + (this.options.profile || "none") + "*/" };',
      '  }',
      '};',
      '',
    ].join('\n'),
    'utf8',
  );

  const chokidarDir = path.join(workspaceNodeModules, 'chokidar');
  fs.mkdirSync(chokidarDir, { recursive: true });
  fs.writeFileSync(
    path.join(chokidarDir, 'index.js'),
    [
      'module.exports = {',
      '  watch: function watch() {',
      '    return {',
      '      on: function on() { return this; },',
      '      close: function close() { return Promise.resolve(); },',
      '    };',
      '  },',
      '};',
      '',
    ].join('\n'),
    'utf8',
  );
}

async function setupProjectStructure(workspaceRoot: string): Promise<string> {
  const projectRoot = path.join(workspaceRoot, 'packages', 'devextreme-scss');
  const buildDir = path.join(projectRoot, 'build');
  fs.mkdirSync(buildDir, { recursive: true });

  await writeJson(path.join(workspaceRoot, 'package.json'), { name: 'workspace' });
  await writeJson(path.join(projectRoot, 'package.json'), { name: 'devextreme-scss' });

  await writeJson(path.join(projectRoot, 'build', 'clean-css-options.json'), { profile: 'all' });

  const themebuilderDataDir = path.join(
    workspaceRoot,
    'packages',
    'devextreme-themebuilder',
    'src',
    'data',
  );
  fs.mkdirSync(themebuilderDataDir, { recursive: true });
  await writeJson(path.join(themebuilderDataDir, 'clean-css-options.json'), { profile: 'ci' });

  const devextremeDir = path.join(workspaceRoot, 'packages', 'devextreme');
  fs.mkdirSync(devextremeDir, { recursive: true });
  await writeJson(path.join(devextremeDir, 'package.json'), { version: '26.1.0-test' });

  await writeFileText(
    path.join(buildDir, 'theme-options.cjs'),
    [
      'module.exports = {',
      '  getThemes: () => [',
      "    ['generic', 'default', 'light'],",
      '  ],',
      '};',
      '',
    ].join('\n'),
  );

  await writeFileText(
    path.join(buildDir, 'bundle-template.common.scss'),
    '.common { color: red; }',
  );
  await writeFileText(
    path.join(buildDir, 'bundle-template.generic.scss'),
    '.generic-$COLOR { color: red; }',
  );

  createMockModules(workspaceRoot, projectRoot);
  return projectRoot;
}

describe('ScssBuildExecutor E2E', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir('nx-scss-build-e2e-');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('builds all mode bundles and applies license/minification profile', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    const options: ScssBuildExecutorSchema = { mode: 'all', cssOutputDir: './artifacts/css' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'scss', 'bundles', 'dx.light.scss'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'scss', 'bundles', 'dx.common.scss'))).toBe(true);

    const cssDir = path.join(projectRoot, 'artifacts', 'css');
    const generatedCssFiles = fs
      .readdirSync(cssDir)
      .filter((name) => name.endsWith('.css'))
      .sort();
    expect(generatedCssFiles.length).toBeGreaterThan(0);
    expect(generatedCssFiles).toContain('dx.common.css');

    const commonCss = await readFileText(path.join(cssDir, 'dx.common.css'));

    expect(commonCss).toContain('Version: 26.1.0-test');
    expect(commonCss).toContain('/*min:all*/');
    expect(commonCss).toContain('DevExtreme (dx.common.css)');
  });

  it('builds ci mode only for selected dev bundles and uses ci profile', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    const options: ScssBuildExecutorSchema = {
      mode: 'ci',
      devBundles: ['light'],
      cssOutputDir: './artifacts/css',
    };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const cssDir = path.join(projectRoot, 'artifacts', 'css');
    const generatedCssFiles = fs
      .readdirSync(cssDir)
      .filter((name) => name.endsWith('.css'))
      .sort();

    expect(generatedCssFiles).toEqual(['dx.light.css']);
    const lightCss = await readFileText(path.join(cssDir, 'dx.light.css'));
    expect(lightCss).toContain('/*min:ci*/');

    expect(fs.existsSync(path.join(projectRoot, 'scss', 'bundles', 'dx.common.scss'))).toBe(true);
  });
});
