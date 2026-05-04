import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { NpmAssembleExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

const LICENSE_TEMPLATE = `/*<%= commentType %>
* DevExtreme (<%= file.relative %>)
* Version: <%= version %>
* Build date: <%= date %>
*
* Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: <%= eula %>
*/
`;

const OPTIONS: NpmAssembleExecutorSchema = {
  transpiledDir: './artifacts/transpiled-esm-npm',
  jsSrcDir: './js',
  licenseSrcDir: './license',
  npmBinDir: './build/npm-bin',
  webpackConfig: './webpack.config.js',
  artifactsDir: './artifacts',
  outputDir: './artifacts/npm/devextreme',
  licenseTemplateFile: './build/gulp/license-header.txt',
  eulaUrl: 'https://js.devexpress.com/Licensing/',
};

describe('NpmAssembleExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-npm-assemble-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(path.join(projectDir, 'artifacts', 'transpiled-esm-npm'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'js'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'license'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'npm-bin'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'artifacts'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'gulp'), { recursive: true });

    await writeFileText(
      path.join(projectDir, 'package.json'),
      JSON.stringify({ name: 'devextreme', version: '26.1.0' }),
    );
    await writeFileText(
      path.join(projectDir, 'build', 'gulp', 'license-header.txt'),
      LICENSE_TEMPLATE,
    );
    await writeFileText(path.join(projectDir, 'webpack.config.js'), 'module.exports = {};');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should copy transpiled JS sources and exclude bundles + internal license validation', async () => {
    const transpiledDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm');
    fs.mkdirSync(path.join(transpiledDir, 'esm'), { recursive: true });
    fs.mkdirSync(path.join(transpiledDir, 'bundles'), { recursive: true });
    fs.mkdirSync(path.join(transpiledDir, 'esm', 'license'), { recursive: true });

    await writeFileText(path.join(transpiledDir, 'esm', 'button.js'), 'export class Button {}');
    await writeFileText(path.join(transpiledDir, 'bundles', 'dx.all.js'), 'var dx = {};');
    await writeFileText(
      path.join(transpiledDir, 'esm', 'license', 'license_validation_internal.js'),
      'var v = {};',
    );

    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    expect(fs.existsSync(path.join(outDir, 'esm', 'button.js'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'bundles', 'dx.all.js'))).toBe(false);
    expect(
      fs.existsSync(path.join(outDir, 'esm', 'license', 'license_validation_internal.js')),
    ).toBe(false);
  });

  it('should copy license dir and npm-bin scripts to expected destinations', async () => {
    await writeFileText(path.join(projectDir, 'license', 'LICENSE.txt'), 'DevExtreme License\n');
    await writeFileText(path.join(projectDir, 'build', 'npm-bin', 'install.js'), 'var a = 1;\n');

    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    expect(fs.existsSync(path.join(outDir, 'license', 'LICENSE.txt'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'bin', 'install.js'))).toBe(true);
  });

  it('should copy dist files into outputDir/dist with the gulp-equivalent excludes', async () => {
    const artifactsDir = path.join(projectDir, 'artifacts');
    fs.mkdirSync(path.join(artifactsDir, 'js'), { recursive: true });

    await writeFileText(path.join(artifactsDir, 'js', 'dx.all.js'), 'var dx = {};');
    await writeFileText(path.join(artifactsDir, 'js', 'jquery.js'), 'var $ = {};');

    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const distDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme', 'dist');

    expect(fs.existsSync(path.join(distDir, 'js', 'dx.all.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'js', 'jquery.js'))).toBe(false);
  });
});
