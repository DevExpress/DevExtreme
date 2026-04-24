import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import { VectormapExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import {
  ensureDir,
  readFileText,
  writeFileText,
  normalizeEol,
  ensureTrailingNewline,
} from '../../utils/file-operations';

interface UtilsSettings {
  commonFiles: string[];
  browser: { fileName: string; files: string[] };
}

interface VariantConfig {
  name: string;
  files: string[];
  fileName: string;
  suffix: string;
}

interface ParsedRegion {
  name: string;
  data: unknown;
}

type ParseFn = (
  input: { shp: ArrayBuffer; dbf: ArrayBuffer },
  options: { precision: number },
) => unknown;

const USE_STRICT_HEADER = '"use strict";\n\n';
const DEBUG_SUFFIX = '.debug';
const DEFAULT_PRECISION = 4;

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function buildUtilsVariant(
  variant: VariantConfig,
  sourceDir: string,
  utilsTemplate: string,
  outDir: string,
): Promise<void> {
  const contents: string[] = [];
  for (const file of variant.files) {
    const filePath = path.join(sourceDir, `${file}.js`);
    const content = await readFileText(filePath);
    contents.push(content);
  }
  const concatenated = contents.join('\n');

  const compiled = _.template(utilsTemplate);
  let bundle = compiled({ data: concatenated });

  bundle = ensureTrailingNewline(normalizeEol(bundle));

  const outputPath = path.join(outDir, `${variant.fileName}${variant.suffix}.js`);
  await writeFileText(outputPath, bundle);
}

async function buildUtils(
  sourceDir: string,
  settingsFile: string,
  utilsTemplatePath: string,
  outDir: string,
): Promise<{ debugBundlePath: string }> {
  const settingsPath = path.join(sourceDir, settingsFile);
  const settings: UtilsSettings = JSON.parse(await readFileText(settingsPath));
  const utilsTemplate = await readFileText(utilsTemplatePath);

  const browserFiles = [...settings.commonFiles, ...settings.browser.files];
  const variants: VariantConfig[] = [
    {
      name: 'browser-debug',
      files: browserFiles,
      fileName: settings.browser.fileName,
      suffix: DEBUG_SUFFIX,
    },
    {
      name: 'browser-prod',
      files: browserFiles,
      fileName: settings.browser.fileName,
      suffix: '',
    },
  ];

  await ensureDir(outDir);

  for (const variant of variants) {
    logger.verbose(`Building utils variant: ${variant.name}`);
    await buildUtilsVariant(variant, sourceDir, utilsTemplate, outDir);
  }

  const debugBundlePath = path.join(outDir, `${settings.browser.fileName}${DEBUG_SUFFIX}.js`);
  return { debugBundlePath };
}

function parseShapefiles(parse: ParseFn, sourcesDir: string, precision: number): ParsedRegion[] {
  const shpFiles = fs
    .readdirSync(sourcesDir)
    .filter((f) => path.extname(f).toLowerCase() === '.shp')
    .map((f) => path.basename(f, '.shp'));

  const regions: ParsedRegion[] = [];
  for (const name of shpFiles) {
    const shpBuffer = fs.readFileSync(path.join(sourcesDir, `${name}.shp`));
    const dbfBuffer = fs.readFileSync(path.join(sourcesDir, `${name}.dbf`));

    const data = parse(
      { shp: toArrayBuffer(shpBuffer), dbf: toArrayBuffer(dbfBuffer) },
      { precision },
    );

    if (!data) {
      throw new Error(
        `Vectormap: parse() returned no data for "${name}". `
          + `Check that "${name}.shp" and "${name}.dbf" are valid shapefiles.`,
      );
    }

    regions.push({ name, data });
  }

  return regions;
}

async function writeRegionModules(
  regions: ParsedRegion[],
  dataTemplate: string,
  outDir: string,
): Promise<void> {
  const compiled = _.template(dataTemplate);

  for (const { name, data } of regions) {
    const rawData = `${name} = ${JSON.stringify(data)};`;
    let wrapped = USE_STRICT_HEADER + compiled({ data: rawData });
    wrapped = ensureTrailingNewline(normalizeEol(wrapped));
    await writeFileText(path.join(outDir, `${name}.js`), wrapped);
  }
}

async function buildData(
  debugBundlePath: string,
  sourcesDir: string,
  sourcesSettingsFile: string,
  dataTemplatePath: string,
  outDir: string,
  projectRoot: string,
): Promise<void> {
  const dataTemplate = await readFileText(dataTemplatePath);

  const resolvedUtilPath = path.resolve(debugBundlePath);
  delete require.cache[require.resolve(resolvedUtilPath)];
  const { parse } = require(resolvedUtilPath) as { parse: ParseFn };

  const resolvedSourcesDir = path.resolve(projectRoot, sourcesDir);
  const resolvedOutDir = path.resolve(projectRoot, outDir);
  const resolvedSettingsPath = path.resolve(resolvedSourcesDir, sourcesSettingsFile);

  delete require.cache[require.resolve(resolvedSettingsPath)];
  const sourcesSettings = require(resolvedSettingsPath) as { precision?: number };
  const precision =
    sourcesSettings.precision !== undefined && sourcesSettings.precision >= 0
      ? Math.round(sourcesSettings.precision)
      : DEFAULT_PRECISION;

  await ensureDir(resolvedOutDir);

  const regions = parseShapefiles(parse, resolvedSourcesDir, precision);
  await writeRegionModules(regions, dataTemplate, resolvedOutDir);
}

const runExecutor: PromiseExecutor<VectormapExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const {
    sourceDir,
    settingsFile,
    sourcesDir,
    sourcesSettingsFile,
    utilsOutDir,
    dataOutDir,
    utilsTemplatePath,
    dataTemplatePath,
  } = options;

  const resolvedSourceDir = path.resolve(projectRoot, sourceDir);
  const resolvedUtilsOutDir = path.resolve(projectRoot, utilsOutDir);
  const resolvedUtilsTemplatePath = path.resolve(projectRoot, utilsTemplatePath);
  const resolvedDataTemplatePath = path.resolve(projectRoot, dataTemplatePath);

  try {
    logger.verbose('Phase 1: Building vectormap utilities...');
    const { debugBundlePath } = await buildUtils(
      resolvedSourceDir,
      settingsFile,
      resolvedUtilsTemplatePath,
      resolvedUtilsOutDir,
    );

    logger.verbose('Phase 2: Building vectormap data...');
    await buildData(
      debugBundlePath,
      sourcesDir,
      sourcesSettingsFile,
      resolvedDataTemplatePath,
      dataOutDir,
      projectRoot,
    );
    const dataFiles = fs
      .readdirSync(path.resolve(projectRoot, dataOutDir))
      .filter((f) => f.endsWith('.js'));
    logger.verbose(`Phase 2 complete: ${dataFiles.length} region modules produced`);

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Vectormap build failed: ${msg}`);
    return { success: false };
  }
};

export default runExecutor;
