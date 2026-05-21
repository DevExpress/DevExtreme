import * as fs from 'fs';
import * as path from 'path';
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
  const buildDir = path.join(projectDir, 'build', 'gulp');
  fs.mkdirSync(buildDir, { recursive: true });
  const templatePath = path.join(buildDir, 'license-header.txt');
  await writeFileText(templatePath, LICENSE_TEMPLATE);
  return './build/gulp/license-header.txt';
}

describe('VectormapExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let savedCwd: string;

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-vectormap-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = await setupProject(tempDir);
    process.chdir(projectDir);
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
  });

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
});
