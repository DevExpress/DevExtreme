import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { VectormapExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

const BROWSER_SOURCE = `
exports.parse = function(input, options) {
  return {
    type: 'FeatureCollection',
    features: [{
      precision: options.precision,
      firstShpByte: input.shp && input.shp.byteLength > 0
        ? new Uint8Array(input.shp)[0]
        : 0,
    }],
  };
};
`;

const COMMON_TS_SOURCE = `interface ShapeSource {
  shp: ArrayBuffer | null;
}

function firstByte(buffer: ArrayBuffer): number {
  return buffer.byteLength > 0 ? new Uint8Array(buffer)[0] : 0;
}
`;

const BROWSER_TS_SOURCE = `type ParseOptions = { precision: number };

// parse() comes from a .ts fragment
function parse(input: ShapeSource, options: ParseOptions): object {
  var shp = input.shp!;
  const feature = { precision: options.precision };
  return {
    type: 'FeatureCollection',
    features: [{ ...feature, firstShpByte: firstByte(shp as ArrayBuffer) }],
  };
}

exports.parse = parse;
`;

const SETTINGS_JSON = JSON.stringify({
  commonFiles: ['common'],
  browser: { fileName: 'dx.vectormaputils', files: ['browser'] },
});

const UTILS_TEMPLATE =
  '(function(factory){ factory(exports); }(function(exports){\n<%= data %>\n}));\n';
const DATA_TEMPLATE =
  '(function(factory){ factory(exports); }(function(sources){\n    sources.<%= data %>\n}));\n';

async function setupProject(tempDir: string): Promise<string> {
  const proj = path.join(tempDir, 'packages', 'test-lib');

  const srcDir = path.join(proj, 'js', 'viz', 'vector_map.utils');
  fs.mkdirSync(srcDir, { recursive: true });
  await writeFileText(path.join(srcDir, '_settings.json'), SETTINGS_JSON);
  await writeFileText(path.join(srcDir, 'common.js'), '');
  await writeFileText(path.join(srcDir, 'browser.js'), BROWSER_SOURCE);

  const templatesDir = path.join(proj, 'build', 'templates');
  fs.mkdirSync(templatesDir, { recursive: true });
  await writeFileText(path.join(templatesDir, 'utils.jst'), UTILS_TEMPLATE);
  await writeFileText(path.join(templatesDir, 'data.jst'), DATA_TEMPLATE);

  const sourcesDir = path.join(proj, 'build', 'vectormap-sources');
  fs.mkdirSync(sourcesDir, { recursive: true });
  await writeFileText(path.join(sourcesDir, '_settings.js'), 'module.exports = { precision: 4 };');

  fs.writeFileSync(path.join(sourcesDir, 'world.shp'), Buffer.from([1, 2, 3]));
  fs.writeFileSync(path.join(sourcesDir, 'world.dbf'), Buffer.from([0]));
  fs.writeFileSync(path.join(sourcesDir, 'usa.shp'), Buffer.from([4, 5, 6]));
  fs.writeFileSync(path.join(sourcesDir, 'usa.dbf'), Buffer.from([0]));

  await writeFileText(path.join(proj, 'package.json'), '{"name":"test","version":"1.0.0"}');
  return proj;
}

function makeOptions(): VectormapExecutorSchema {
  return {
    sourceDir: './js/viz/vector_map.utils',
    settingsFile: './_settings.json',
    sourcesDir: './build/vectormap-sources',
    sourcesSettingsFile: './_settings.js',
    utilsOutDir: './artifacts/js/vectormap-utils',
    dataOutDir: './artifacts/js/vectormap-data',
    utilsTemplatePath: './build/templates/utils.jst',
    dataTemplatePath: './build/templates/data.jst',
  };
}

const LICENSE_TEMPLATE = `/*<%= commentType %>
* Vectormap (<%= file.relative %>)
* Version: <%= version %>
*/
`;

async function setupLicenseTemplate(projectDir: string): Promise<string> {
  const buildDir = path.join(projectDir, 'build');
  fs.mkdirSync(buildDir, { recursive: true });
  const templatePath = path.join(buildDir, 'license-header.txt');
  await writeFileText(templatePath, LICENSE_TEMPLATE);
  return './build/license-header.txt';
}

describe('VectormapExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let utilsSourceDir: string;
  let savedCwd: string;

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-vectormap-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = await setupProject(tempDir);
    utilsSourceDir = path.join(projectDir, 'js', 'viz', 'vector_map.utils');
    process.chdir(projectDir);
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
  });

  function readDebugBundle(): Promise<string> {
    return readFileText(
      path.join(projectDir, 'artifacts', 'js', 'vectormap-utils', 'dx.vectormaputils.debug.js'),
    );
  }

  async function runExpectingFailure(): Promise<string> {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);
    try {
      const result = await executor(makeOptions(), context);
      expect(result.success).toBe(false);
      return String(errorSpy.mock.calls[0][0]);
    } finally {
      errorSpy.mockRestore();
    }
  }

  it('should produce utils bundles and region data files', async () => {
    const result = await executor(makeOptions(), context);
    expect(result.success).toBe(true);

    const utilsDir = path.join(projectDir, 'artifacts', 'js', 'vectormap-utils');
    const dataDir = path.join(projectDir, 'artifacts', 'js', 'vectormap-data');

    expect(fs.existsSync(path.join(utilsDir, 'dx.vectormaputils.debug.js'))).toBe(true);
    expect(fs.existsSync(path.join(utilsDir, 'dx.vectormaputils.js'))).toBe(true);

    const debug = await readFileText(path.join(utilsDir, 'dx.vectormaputils.debug.js'));
    expect(debug).toContain('factory(exports)');
    expect(debug).toContain('exports.parse');

    const dataFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith('.js'));
    expect(dataFiles.length).toBe(2);
    const worldData = await readFileText(path.join(dataDir, 'world.js'));
    expect(worldData).toContain('sources.');
    expect(worldData).toContain('"use strict"');
    expect(worldData).toContain('"precision":4');
    expect(worldData).toContain('"firstShpByte":1');
  }, 30000);

  it('should forward applyLicenseHeaders option to license header pipeline', async () => {
    const licenseTemplateFile = await setupLicenseTemplate(projectDir);
    const options: VectormapExecutorSchema = {
      ...makeOptions(),
      applyLicenseHeaders: {
        licenseTemplateFile,
        separator: '',
      },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const utilsDir = path.join(projectDir, 'artifacts', 'js', 'vectormap-utils');
    const productionContent = await readFileText(path.join(utilsDir, 'dx.vectormaputils.js'));
    expect(productionContent).toMatch(/^\/\*!/);
    expect(productionContent).toContain('Vectormap (dx.vectormaputils.js)');
  }, 30000);

  it('should strip types from .ts fragments and parse regions with the result', async () => {
    fs.rmSync(path.join(utilsSourceDir, 'common.js'));
    fs.rmSync(path.join(utilsSourceDir, 'browser.js'));
    await writeFileText(path.join(utilsSourceDir, 'common.ts'), COMMON_TS_SOURCE);
    await writeFileText(path.join(utilsSourceDir, 'browser.ts'), BROWSER_TS_SOURCE);

    const result = await executor(makeOptions(), context);
    expect(result.success).toBe(true);

    const debug = await readDebugBundle();
    expect(debug).toContain('function firstByte(buffer) {');
    expect(debug).toContain(
      '// parse() comes from a .ts fragment\nfunction parse(input, options) {',
    );
    expect(debug).toContain('var shp = input.shp;');
    expect(debug).toContain('const feature = { precision: options.precision };');
    expect(debug).toContain('features: [{ ...feature, firstShpByte: firstByte(shp) }],');
    expect(debug).toContain('exports.parse = parse;');
    expect(debug).not.toMatch(/interface|type ParseOptions|: number|: ArrayBuffer|\bas\b|shp!/);
    expect(debug).not.toMatch(/use strict|export \{|__esModule|__assign/);

    const dataDir = path.join(projectDir, 'artifacts', 'js', 'vectormap-data');
    const worldData = await readFileText(path.join(dataDir, 'world.js'));
    expect(worldData).toContain('"precision":4');
    expect(worldData).toContain('"firstShpByte":1');
  }, 30000);

  it('should concatenate mixed .js and .ts fragments in settings order', async () => {
    await writeFileText(
      path.join(utilsSourceDir, '_settings.json'),
      JSON.stringify({
        commonFiles: ['common', 'shared'],
        browser: { fileName: 'dx.vectormaputils', files: ['browser'] },
      }),
    );
    await writeFileText(
      path.join(utilsSourceDir, 'common.js'),
      "var commonMarker = 'common.js';\n",
    );
    await writeFileText(
      path.join(utilsSourceDir, 'shared.ts'),
      "var sharedMarker: string = 'shared.ts';\n",
    );

    const result = await executor(makeOptions(), context);
    expect(result.success).toBe(true);

    const debug = await readDebugBundle();
    const commonIndex = debug.indexOf("var commonMarker = 'common.js';\n");
    const sharedIndex = debug.indexOf("var sharedMarker = 'shared.ts';\n");
    const browserIndex = debug.indexOf(BROWSER_SOURCE);
    expect(commonIndex).toBeGreaterThan(-1);
    expect(sharedIndex).toBeGreaterThan(commonIndex);
    expect(browserIndex).toBeGreaterThan(sharedIndex);
  }, 30000);

  it('should fail when a fragment exists as both .js and .ts', async () => {
    await writeFileText(path.join(utilsSourceDir, 'browser.ts'), BROWSER_TS_SOURCE);

    const message = await runExpectingFailure();
    expect(message).toContain('ambiguous utils fragment "browser"');
    expect(message).toContain('"browser.ts" and "browser.js"');
  }, 30000);

  it('should fail when a fragment has neither a .js nor a .ts file', async () => {
    fs.rmSync(path.join(utilsSourceDir, 'common.js'));

    const message = await runExpectingFailure();
    expect(message).toContain('utils fragment "common" not found');
    expect(message).toContain(utilsSourceDir);
  }, 30000);

  it('should fail with the file and line of a syntax error in a .ts fragment', async () => {
    fs.rmSync(path.join(utilsSourceDir, 'browser.js'));
    await writeFileText(
      path.join(utilsSourceDir, 'browser.ts'),
      'var ok: number = 1;\n\nfunction broken(input: ArrayBuffer {\n  return input;\n}\n',
    );

    const message = await runExpectingFailure();
    expect(message).toMatch(/browser\.ts\(3,\d+\): error TS\d+/);
  }, 30000);

  it('should fail when a .ts fragment contains module syntax', async () => {
    fs.rmSync(path.join(utilsSourceDir, 'browser.js'));
    await writeFileText(
      path.join(utilsSourceDir, 'browser.ts'),
      `import type { Foo } from './foo';\n${BROWSER_TS_SOURCE}`,
    );

    const message = await runExpectingFailure();
    expect(message).toContain('browser.ts');
    expect(message).toContain('contains import/export statements');
  }, 30000);
});
