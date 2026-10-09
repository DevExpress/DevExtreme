import * as fs from 'fs';
import * as path from 'path';
import executor, { findMissingThemeCss } from './executor';
import { ScssBuildExecutorSchema } from './schema';
import { createMockContext, createTempDir, cleanupTempDir } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

function writeMockPackage(nodeModulesDir: string, packageName: string, mainFile: string): void {
  const packageDir = path.join(nodeModulesDir, packageName);
  fs.mkdirSync(packageDir, { recursive: true });
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify({ main: mainFile }),
    'utf8',
  );
  fs.writeFileSync(path.join(packageDir, mainFile), '', 'utf8');
}

function createMockModules(projectRoot: string): void {
  const projectNodeModules = path.join(projectRoot, 'node_modules');
  fs.mkdirSync(projectNodeModules, { recursive: true });

  writeMockPackage(projectNodeModules, 'sass-embedded', 'index.js');
  fs.writeFileSync(
    path.join(projectNodeModules, 'sass-embedded', 'index.js'),
    [
      'class SassString {',
      '  constructor(value) { this.value = value; }',
      '}',
      'module.exports = {',
      '  SassString,',
      "  compile: (source) => ({ css: source.includes('unbannered')",
      "    ? '/* not the banner */\\n:root{--first-declaration:1}\\n/* mentions auto-generated */\\n:root{--last-declaration:2}'",
      '    : \'/**\\n * Do not edit directly, this file was auto-generated.\\n */\\n@charset "UTF-8"; .a{display:flex}\' })',
      '};',
      '',
    ].join('\n'),
    'utf8',
  );

  writeMockPackage(projectNodeModules, 'postcss', 'index.js');
  fs.writeFileSync(
    path.join(projectNodeModules, 'postcss', 'index.js'),
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

  writeMockPackage(projectNodeModules, 'autoprefixer', 'index.js');
  fs.writeFileSync(
    path.join(projectNodeModules, 'autoprefixer', 'index.js'),
    'module.exports = function autoprefixer() { return { postcssPlugin: "autoprefixer" }; };',
    'utf8',
  );

  writeMockPackage(projectNodeModules, 'clean-css', 'index.js');
  fs.writeFileSync(
    path.join(projectNodeModules, 'clean-css', 'index.js'),
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

  writeMockPackage(projectNodeModules, 'chokidar', 'index.js');
  fs.writeFileSync(
    path.join(projectNodeModules, 'chokidar', 'index.js'),
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
  await writeJson(path.join(projectRoot, 'package.json'), {
    name: 'devextreme-scss',
    devDependencies: {
      'sass-embedded': '1.0.0',
      postcss: '8.0.0',
      autoprefixer: '10.0.0',
      'clean-css': '5.0.0',
      chokidar: '5.0.0',
    },
  });

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

  await writeFileText(
    path.join(projectRoot, 'scss', '_design-system', 'fluent', 'accents', 'blue.scss'),
    ':root { --dxds-primary-100: #0f6cbd; }',
  );

  createMockModules(projectRoot);
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

  it('compiles design-system accent sources into the accents subfolder without minification', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    await writeFileText(
      path.join(projectRoot, 'scss', '_design-system', 'fluent', 'accents', 'storm.scss'),
      ':root { --dxds-primary-100: #6d6a68; }',
    );

    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    const options: ScssBuildExecutorSchema = { mode: 'all', cssOutputDir: './artifacts/css' };
    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const stormCss = await readFileText(
      path.join(projectRoot, 'artifacts', 'css', 'accents', 'storm.css'),
    );
    expect(stormCss).toContain('DevExtreme (storm.css)');
    expect(stormCss).not.toContain('/*min:');
    expect(stormCss).not.toContain('/*prefixed*/');
    expect(stormCss).not.toContain('auto-generated');
  });

  it('strips only a leading generator banner, keeping css that merely mentions auto-generated', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    await writeFileText(
      path.join(projectRoot, 'scss', '_design-system', 'fluent', 'accents', 'unbannered.scss'),
      ':root { --dxds-primary-100: #6d6a68; }',
    );

    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    await executor({ mode: 'all', cssOutputDir: './artifacts/css' }, context);

    const unbanneredCss = await readFileText(
      path.join(projectRoot, 'artifacts', 'css', 'accents', 'unbannered.css'),
    );
    expect(unbanneredCss).toContain('/* not the banner */');
    expect(unbanneredCss).toContain('--first-declaration');
    expect(unbanneredCss).toContain('--last-declaration');
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

  it('fails when the design-system produced no accent palettes', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    fs.rmSync(path.join(projectRoot, 'scss', '_design-system'), { recursive: true });

    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    const options: ScssBuildExecutorSchema = { mode: 'all', cssOutputDir: './artifacts/css' };
    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });

  it('reports declared themes that left no CSS behind', async () => {
    const projectRoot = await setupProjectStructure(tempDir);
    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    await executor({ mode: 'all', cssOutputDir: './artifacts/css' }, context);

    const cssDir = path.join(projectRoot, 'artifacts', 'css');
    const deps = { themeOptions: { getThemes: () => [['generic', 'default', 'light']] } };

    expect(findMissingThemeCss(cssDir, deps as never)).toEqual([]);

    fs.rmSync(path.join(cssDir, 'dx.light.css'));
    expect(findMissingThemeCss(cssDir, deps as never)).toEqual(['dx.light.css']);
  });

  it('fails in ci mode when a configured bundle source is missing', async () => {
    await setupProjectStructure(tempDir);
    const context = createMockContext({
      root: tempDir,
      projectName: 'devextreme-scss',
      projectRoot: 'packages/devextreme-scss',
    });

    const options: ScssBuildExecutorSchema = {
      mode: 'ci',
      devBundles: ['light', 'missing.bundle'],
      cssOutputDir: './artifacts/css',
    };
    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });
});
