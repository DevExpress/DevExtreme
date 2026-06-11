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
  srcExcludes: ['bundles/**/*'],
  distExcludes: ['js/jquery*'],
  excludeLicenseValidator: '**/license/license_validation_internal.js',
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

  it('should normalize CRLF to LF in copied license/ and bin/ files (gulp-eol parity)', async () => {
    await writeFileText(
      path.join(projectDir, 'license', 'LICENSE.txt'),
      'DevExtreme License\r\nLine 2\r\nLine 3\r\n',
    );
    await writeFileText(
      path.join(projectDir, 'build', 'npm-bin', 'install.js'),
      'var a = 1;\r\nvar b = 2;\r\n',
    );

    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const licenseContent = await readFileText(path.join(outDir, 'license', 'LICENSE.txt'));
    const binContent = await readFileText(path.join(outDir, 'bin', 'install.js'));

    expect(licenseContent).not.toContain('\r');
    expect(binContent).not.toContain('\r');
    expect(licenseContent.endsWith('\n')).toBe(true);
    expect(binContent.endsWith('\n')).toBe(true);
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

  it('should not produce metadata or flatten artifacts when neither option is set', async () => {
    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const distArtifacts = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist');

    expect(fs.existsSync(path.join(outDir, 'README.md'))).toBe(false);
    expect(fs.existsSync(path.join(outDir, '.npmignore'))).toBe(false);
    expect(fs.existsSync(distArtifacts)).toBe(false);
  });

  it('should copy metadata files relative to projectRoot/outputDir when provided', async () => {
    fs.mkdirSync(path.join(projectDir, 'build', 'npm-templates'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'packages', 'devextreme-dist'), { recursive: true });

    await writeFileText(path.join(tempDir, 'README.md'), 'workspace readme');
    await writeFileText(path.join(projectDir, 'build', 'npm-templates', '.npmignore'), '*.log\n');
    await writeFileText(
      path.join(tempDir, 'packages', 'devextreme-dist', 'README.md'),
      'dist readme',
    );
    await writeFileText(
      path.join(tempDir, 'packages', 'devextreme-dist', 'LICENSE.md'),
      'dist license',
    );

    const optionsWithMetadata: NpmAssembleExecutorSchema = {
      ...OPTIONS,
      metadataFiles: [
        { from: '../../README.md', to: './README.md' },
        { from: './build/npm-templates/.npmignore', to: './.npmignore' },
        { from: '../devextreme-dist/README.md', to: '../devextreme-dist/README.md' },
        { from: '../devextreme-dist/LICENSE.md', to: '../devextreme-dist/LICENSE.md' },
      ],
    };

    const result = await executor(optionsWithMetadata, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const distMetaDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist');

    expect(await readFileText(path.join(outDir, 'README.md'))).toBe('workspace readme');
    expect(await readFileText(path.join(outDir, '.npmignore'))).toBe('*.log\n');
    expect(await readFileText(path.join(distMetaDir, 'README.md'))).toBe('dist readme');
    expect(await readFileText(path.join(distMetaDir, 'LICENSE.md'))).toBe('dist license');
  });

  it('should flatten outputDir sub-trees into a secondary dir relative to projectRoot', async () => {
    const artifactsDir = path.join(projectDir, 'artifacts');
    fs.mkdirSync(path.join(artifactsDir, 'js'), { recursive: true });
    fs.mkdirSync(path.join(artifactsDir, 'css'), { recursive: true });

    await writeFileText(path.join(artifactsDir, 'js', 'dx.all.js'), 'var dx = {};');
    await writeFileText(path.join(artifactsDir, 'css', 'dx.light.css'), '.dx { }');

    const optionsWithFlatten: NpmAssembleExecutorSchema = {
      ...OPTIONS,
      flatten: [{ from: './dist', to: './artifacts/npm/devextreme-dist' }],
    };

    const result = await executor(optionsWithFlatten, context);
    expect(result.success).toBe(true);

    const flattenedDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist');

    expect(fs.existsSync(path.join(flattenedDir, 'js', 'dx.all.js'))).toBe(true);
    expect(fs.existsSync(path.join(flattenedDir, 'css', 'dx.light.css'))).toBe(true);
  });

  it('should support metadataFiles and flatten together', async () => {
    const artifactsDir = path.join(projectDir, 'artifacts');
    fs.mkdirSync(path.join(artifactsDir, 'js'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'packages', 'devextreme-dist'), { recursive: true });

    await writeFileText(path.join(artifactsDir, 'js', 'dx.all.js'), 'var dx = {};');
    await writeFileText(
      path.join(tempDir, 'packages', 'devextreme-dist', 'README.md'),
      'dist readme',
    );

    const combinedOptions: NpmAssembleExecutorSchema = {
      ...OPTIONS,
      metadataFiles: [{ from: '../devextreme-dist/README.md', to: '../devextreme-dist/README.md' }],
      flatten: [{ from: './dist', to: './artifacts/npm/devextreme-dist' }],
    };

    const result = await executor(combinedOptions, context);
    expect(result.success).toBe(true);

    const distMetaDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist');

    expect(await readFileText(path.join(distMetaDir, 'README.md'))).toBe('dist readme');
    expect(fs.existsSync(path.join(distMetaDir, 'js', 'dx.all.js'))).toBe(true);
  });

  it('should exclude default license validator when excludeLicenseValidator targets it', async () => {
    const transpiledDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm');
    fs.mkdirSync(path.join(transpiledDir, 'esm', 'license'), { recursive: true });

    await writeFileText(
      path.join(transpiledDir, 'esm', 'license', 'license_validation.js'),
      'var d = {};',
    );
    await writeFileText(
      path.join(transpiledDir, 'esm', 'license', 'license_validation_internal.js'),
      'var i = {};',
    );

    const internalOptions: NpmAssembleExecutorSchema = {
      ...OPTIONS,
      outputDir: './artifacts/npm/devextreme-internal',
      excludeLicenseValidator: '**/license/license_validation.js',
      renameLicenseValidator: {
        fromGlob: '**/license/license_validation_internal.js',
        toBasename: 'license_validation.js',
      },
    };

    const result = await executor(internalOptions, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-internal');
    expect(fs.existsSync(path.join(outDir, 'esm', 'license', 'license_validation.js'))).toBe(true);
    expect(
      fs.existsSync(path.join(outDir, 'esm', 'license', 'license_validation_internal.js')),
    ).toBe(false);

    const renamedContent = await readFileText(
      path.join(outDir, 'esm', 'license', 'license_validation.js'),
    );
    expect(renamedContent).toContain('var i = {};');
  });

  it('should write to a different outputDir/flatten target when overridden via options', async () => {
    const transpiledDir = path.join(projectDir, 'artifacts', 'transpiled-esm-npm');
    const artifactsDir = path.join(projectDir, 'artifacts');
    fs.mkdirSync(path.join(transpiledDir, 'esm'), { recursive: true });
    fs.mkdirSync(path.join(artifactsDir, 'js'), { recursive: true });

    await writeFileText(path.join(transpiledDir, 'esm', 'button.js'), 'export class Button {}');
    await writeFileText(path.join(artifactsDir, 'js', 'dx.all.js'), 'var dx = {};');

    const internalOptions: NpmAssembleExecutorSchema = {
      ...OPTIONS,
      outputDir: './artifacts/npm/devextreme-internal',
      flatten: [{ from: './dist', to: './artifacts/npm/devextreme-dist-internal' }],
    };

    const result = await executor(internalOptions, context);
    expect(result.success).toBe(true);

    const internalDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-internal');
    const internalDistDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist-internal');
    const regularDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const regularDistDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme-dist');

    expect(fs.existsSync(path.join(internalDir, 'esm', 'button.js'))).toBe(true);
    expect(fs.existsSync(path.join(internalDistDir, 'js', 'dx.all.js'))).toBe(true);
    expect(fs.existsSync(regularDir)).toBe(false);
    expect(fs.existsSync(regularDistDir)).toBe(false);
  });
});
