import { logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import { createExecutor } from '../../utils/create-executor';
import { ApplyLicenseHeadersOption, VectormapExecutorSchema } from './schema';
import {
  ensureDir,
  loadProjectPackageJson,
  readFileText,
  writeFileText,
  normalizeEol,
  ensureTrailingNewline,
} from '../../utils/file-operations';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';

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
    .filter((entry) => path.extname(entry).toLowerCase() === '.shp')
    .map((entry) => path.basename(entry, '.shp'));

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

async function applyLicenseHeadersIfRequested(
  applyLicenseHeaders: ApplyLicenseHeadersOption | undefined,
  projectRoot: string,
  defaultTargetDir: string,
): Promise<void> {
  if (!applyLicenseHeaders) {
    return;
  }
  const pkg = await loadProjectPackageJson(projectRoot);
  const templatePath = resolveLicenseTemplate(projectRoot, applyLicenseHeaders);
  const targetDir = applyLicenseHeaders.targetSubdir
    ? path.join(projectRoot, applyLicenseHeaders.targetSubdir)
    : defaultTargetDir;
  await applyLicenseHeadersToDirectory({
    targetDir,
    pkg,
    templatePath,
    eulaUrl: applyLicenseHeaders.eulaUrl ?? DEFAULT_EULA_URL,
    mode: applyLicenseHeaders.mode,
    version: applyLicenseHeaders.version,
    commentType: applyLicenseHeaders.commentType,
    separator: applyLicenseHeaders.separator,
    prependAfterLicense: applyLicenseHeaders.prependAfterLicense,
    filenameMode: applyLicenseHeaders.filenameMode,
    includePatterns: applyLicenseHeaders.includePatterns,
    excludePatterns: applyLicenseHeaders.excludePatterns,
  });
}

interface ResolvedVectormap {
  projectRoot: string;
  resolvedSourceDir: string;
  settingsFile: string;
  sourcesDir: string;
  sourcesSettingsFile: string;
  resolvedUtilsOutDir: string;
  dataOutDir: string;
  resolvedUtilsTemplatePath: string;
  resolvedDataTemplatePath: string;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}

export default createExecutor<VectormapExecutorSchema, ResolvedVectormap>({
  name: 'Vectormap',
  resolve: (options, { projectRoot }) => {
    return {
      projectRoot,
      resolvedSourceDir: path.resolve(projectRoot, options.sourceDir),
      settingsFile: options.settingsFile,
      sourcesDir: options.sourcesDir,
      sourcesSettingsFile: options.sourcesSettingsFile,
      resolvedUtilsOutDir: path.resolve(projectRoot, options.utilsOutDir),
      dataOutDir: options.dataOutDir,
      resolvedUtilsTemplatePath: path.resolve(projectRoot, options.utilsTemplatePath),
      resolvedDataTemplatePath: path.resolve(projectRoot, options.dataTemplatePath),
      applyLicenseHeaders: options.applyLicenseHeaders,
    };
  },
  run: async (resolved) => {
    logger.verbose('Phase 1: Building vectormap utilities...');
    const { debugBundlePath } = await buildUtils(
      resolved.resolvedSourceDir,
      resolved.settingsFile,
      resolved.resolvedUtilsTemplatePath,
      resolved.resolvedUtilsOutDir,
    );

    logger.verbose('Phase 2: Building vectormap data...');
    await buildData(
      debugBundlePath,
      resolved.sourcesDir,
      resolved.sourcesSettingsFile,
      resolved.resolvedDataTemplatePath,
      resolved.dataOutDir,
      resolved.projectRoot,
    );
    const dataFiles = fs
      .readdirSync(path.resolve(resolved.projectRoot, resolved.dataOutDir))
      .filter((entry) => entry.endsWith('.js'));
    logger.verbose(`Phase 2 complete: ${dataFiles.length} region modules produced`);

    await applyLicenseHeadersIfRequested(
      resolved.applyLicenseHeaders,
      resolved.projectRoot,
      resolved.resolvedUtilsOutDir,
    );
  },
});
