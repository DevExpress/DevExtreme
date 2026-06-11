import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { BundleExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

const MINIMAL_WEBPACK_CONFIG = `
module.exports = {
  mode: 'production',
  output: {
    sourcePrefix: '    ',
  },
  externals: {},
};
`;

describe('BundleExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let savedCwd: string;

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-bundle-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });

    process.chdir(projectDir);

    await writeFileText(path.join(projectDir, 'webpack.config.js'), MINIMAL_WEBPACK_CONFIG);

    const sourceDir = path.join(projectDir, 'artifacts', 'transpiled-renovation-npm');
    const bundlesDir = path.join(sourceDir, 'bundles');
    fs.mkdirSync(bundlesDir, { recursive: true });

    await writeFileText(
      path.join(sourceDir, 'helper.js'),
      `module.exports = { greet: function(name) { return "Hello, " + name; } };`,
    );

    await writeFileText(
      path.join(bundlesDir, 'dx.all.js'),
      `var helper = require('../helper');\nmodule.exports = helper;`,
    );

    await writeFileText(path.join(bundlesDir, 'dx.web.js'), `module.exports = { value: 42 };`);

    fs.mkdirSync(path.join(projectDir, 'artifacts', 'js'), {
      recursive: true,
    });
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
  });

  it('should bundle multiple entries in debug mode', async () => {
    const options: BundleExecutorSchema = {
      entries: ['bundles/dx.all.js', 'bundles/dx.web.js'],
      sourceDir: './artifacts/transpiled-renovation-npm',
      outDir: './artifacts/js',
      mode: 'debug',
      webpackConfigPath: './webpack.config.js',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const allDebug = path.join(projectDir, 'artifacts', 'js', 'dx.all.debug.js');
    const webDebug = path.join(projectDir, 'artifacts', 'js', 'dx.web.debug.js');
    expect(fs.existsSync(allDebug)).toBe(true);
    expect(fs.existsSync(webDebug)).toBe(true);

    expect(fs.existsSync(path.join(projectDir, 'artifacts', 'js', 'dx.all.js'))).toBe(false);
    expect(fs.existsSync(path.join(projectDir, 'artifacts', 'js', 'dx.web.js'))).toBe(false);

    const content = await readFileText(allDebug);
    expect(content).toContain('greet');
    expect(content.split('\n').length).toBeGreaterThan(3);
    expect(content).toContain('eval(');
  }, 60000);

  it('should omit eval-source-map in debug mode when sourceMap is false', async () => {
    const options: BundleExecutorSchema = {
      entries: ['bundles/dx.all.js'],
      sourceDir: './artifacts/transpiled-renovation-npm',
      outDir: './artifacts/js',
      mode: 'debug',
      webpackConfigPath: './webpack.config.js',
      sourceMap: false,
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const content = await readFileText(path.join(projectDir, 'artifacts', 'js', 'dx.all.debug.js'));
    expect(content).toContain('greet');
    expect(content).not.toContain('eval(');
  }, 60000);

  it('should forward applyLicenseHeaders option to license header pipeline', async () => {
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-bundle-pkg',
      version: '7.8.9',
    });

    const buildDir = path.join(projectDir, 'build', 'gulp');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(
      path.join(buildDir, 'license-header.txt'),
      `/*<%= commentType %>\n* DevExtreme (<%= file.relative %>)\n*/\n`,
    );

    const options: BundleExecutorSchema = {
      entries: ['bundles/dx.all.js'],
      sourceDir: './artifacts/transpiled-renovation-npm',
      outDir: './artifacts/js',
      mode: 'production',
      webpackConfigPath: './webpack.config.js',
      applyLicenseHeaders: {
        licenseTemplateFile: './build/gulp/license-header.txt',
        separator: '',
        includePatterns: ['dx.*.js'],
      },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const bundleContent = await readFileText(path.join(projectDir, 'artifacts', 'js', 'dx.all.js'));
    expect(bundleContent).toMatch(/^\/\*!/);
    expect(bundleContent).toContain('DevExtreme (dx.all.js)');
  }, 60000);
});
