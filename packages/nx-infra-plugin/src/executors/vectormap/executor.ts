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
  node: { fileName: string; files: string[] };
}

interface VariantConfig {
  name: string;
  files: string[];
  fileName: string;
  suffix: string;
  wrapUmd: boolean;
}

const USE_STRICT_HEADER = '"use strict";\n\n';

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
  let bundle = contents.join('\n');

  if (variant.wrapUmd) {
    const compiled = _.template(utilsTemplate);
    bundle = compiled({ data: bundle });
  }

  bundle = ensureTrailingNewline(normalizeEol(bundle));

  const outputPath = path.join(outDir, `${variant.fileName}${variant.suffix}.js`);
  await writeFileText(outputPath, bundle);
}

async function buildUtils(
  sourceDir: string,
  settingsFile: string,
  utilsTemplatePath: string,
  outDir: string,
): Promise<{ nodeUtilPath: string }> {
  const settingsPath = path.join(sourceDir, settingsFile);
  const settings: UtilsSettings = JSON.parse(await readFileText(settingsPath));
  const utilsTemplate = await readFileText(utilsTemplatePath);

  const variants: VariantConfig[] = [
    {
      name: 'browser-debug',
      files: [...settings.commonFiles, ...settings.browser.files],
      fileName: settings.browser.fileName,
      suffix: '.debug',
      wrapUmd: true,
    },
    {
      name: 'browser-prod',
      files: [...settings.commonFiles, ...settings.browser.files],
      fileName: settings.browser.fileName,
      suffix: '',
      wrapUmd: true,
    },
    {
      name: 'node',
      files: [...settings.commonFiles, ...settings.node.files],
      fileName: settings.node.fileName,
      suffix: '',
      wrapUmd: false,
    },
  ];

  await ensureDir(outDir);

  for (const variant of variants) {
    logger.verbose(`Building utils variant: ${variant.name}`);
    await buildUtilsVariant(variant, sourceDir, utilsTemplate, outDir);
  }

  const nodeUtilPath = path.join(outDir, `${settings.node.fileName}.js`);
  return { nodeUtilPath };
}

async function buildData(
  nodeUtilPath: string,
  sourcesDir: string,
  sourcesSettingsFile: string,
  dataTemplatePath: string,
  outDir: string,
  projectRoot: string,
): Promise<void> {
  const dataTemplate = await readFileText(dataTemplatePath);

  const resolvedUtilPath = path.resolve(nodeUtilPath);
  delete require.cache[require.resolve(resolvedUtilPath)];
  const { processFiles } = require(resolvedUtilPath);

  const resolvedSourcesDir = path.resolve(projectRoot, sourcesDir);
  const resolvedOutDir = path.resolve(projectRoot, outDir);

  await ensureDir(resolvedOutDir);

  await new Promise<void>((resolve, reject) => {
    try {
      processFiles(
        resolvedSourcesDir,
        {
          output: resolvedOutDir,
          settings: path.resolve(resolvedSourcesDir, sourcesSettingsFile),
        },
        () => {
          resolve();
        },
      );
    } catch (error) {
      reject(error);
    }
  });

  const files = fs.readdirSync(resolvedOutDir).filter((f) => f.endsWith('.js'));
  const compiled = _.template(dataTemplate);

  for (const file of files) {
    const filePath = path.join(resolvedOutDir, file);
    const rawData = await readFileText(filePath);
    let wrapped = compiled({ data: rawData });
    wrapped = USE_STRICT_HEADER + wrapped;
    wrapped = ensureTrailingNewline(normalizeEol(wrapped));
    await writeFileText(filePath, wrapped);
  }
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
    const { nodeUtilPath } = await buildUtils(
      resolvedSourceDir,
      settingsFile,
      resolvedUtilsTemplatePath,
      resolvedUtilsOutDir,
    );

    logger.verbose('Phase 2: Building vectormap data...');

    await buildData(
      nodeUtilPath,
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
