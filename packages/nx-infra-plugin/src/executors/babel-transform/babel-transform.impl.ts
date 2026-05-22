import * as path from 'path';
import * as fs from 'fs-extra';
import { stat } from 'fs/promises';
import * as babel from '@babel/core';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { copyFile } from '../../utils/file-operations';
import { copyDirectory } from '../copy-files/copy-files.impl';
import { stripDebug } from '../compress/compress.impl';
import { BabelTransformAsset, BabelTransformExecutorSchema } from './schema';

const ERROR_NO_FILES_MATCHED = 'No files matched the source pattern';
const ERROR_ASSET_NOT_FOUND = (source: string) => `Asset source not found: ${source}`;

function loadBabelConfig(
  projectRoot: string,
  configPath: string,
  configKey: string,
): babel.TransformOptions {
  const fullConfigPath = path.join(projectRoot, configPath);

  if (!fs.existsSync(fullConfigPath)) {
    throw new Error(`Babel config not found: ${fullConfigPath}`);
  }

  const config = require(fullConfigPath);

  if (!config[configKey]) {
    const availableKeys = Object.keys(config).join(', ');
    throw new Error(`Config key '${configKey}' not found. Available: ${availableKeys}`);
  }

  return config[configKey];
}

function applyExtensionRenames(filePath: string, renameExtensions: Record<string, string>): string {
  const ext = path.extname(filePath);

  if (ext && ext in renameExtensions) {
    return filePath.slice(0, -ext.length) + renameExtensions[ext];
  }

  return filePath;
}

async function transformFile(
  filePath: string,
  projectRoot: string,
  outDir: string,
  sourcePattern: string,
  babelConfig: babel.TransformOptions,
  removeDebug: boolean,
  renameExtensions: Record<string, string>,
): Promise<void> {
  let content = await fs.readFile(filePath, 'utf-8');

  if (removeDebug) {
    content = stripDebug(content);
  }

  const result = await babel.transformAsync(content, {
    ...babelConfig,
    filename: filePath,
  });

  if (!result?.code) {
    throw new Error(`Babel returned no code for ${filePath}`);
  }

  const cleanPattern = sourcePattern.replace(/^\.\//, '');
  const globIndex = cleanPattern.search(/\*+/);
  const patternBase =
    globIndex > 0
      ? cleanPattern.substring(0, globIndex).replace(/\/$/, '')
      : cleanPattern.split('/')[0];
  const sourceBase = path.join(projectRoot, patternBase);
  const relativePath = path.relative(sourceBase, filePath);

  const renamedRelativePath = applyExtensionRenames(relativePath, renameExtensions);
  const outputPath = path.join(projectRoot, outDir, renamedRelativePath);

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, result.code);
}

interface ResolvedBabelTransformAsset {
  source: string;
  destination: string;
}

async function copyResolvedAsset(asset: ResolvedBabelTransformAsset): Promise<void> {
  let assetStat;
  try {
    assetStat = await stat(asset.source);
  } catch {
    throw new Error(ERROR_ASSET_NOT_FOUND(asset.source));
  }

  if (assetStat.isDirectory()) {
    await copyDirectory(asset.source, asset.destination);
    logger.verbose(`Copied asset directory ${asset.source} -> ${asset.destination}`);
    return;
  }

  await copyFile(asset.source, asset.destination);
  logger.verbose(`Copied asset file ${asset.source} -> ${asset.destination}`);
}

interface ResolvedBabelTransform {
  projectRoot: string;
  babelConfig: babel.TransformOptions;
  removeDebug: boolean;
  renameExtensions: Record<string, string>;
  globPattern: string;
  excludePatterns: string[];
  resolvedAssets: ResolvedBabelTransformAsset[];
}

function resolveAssets(
  assets: BabelTransformAsset[],
  projectRoot: string,
  outDir: string,
): ResolvedBabelTransformAsset[] {
  const outDirAbsolute = path.isAbsolute(outDir) ? outDir : path.join(projectRoot, outDir);
  return assets.map((asset) => ({
    source: path.isAbsolute(asset.from) ? asset.from : path.join(projectRoot, asset.from),
    destination: path.isAbsolute(asset.to) ? asset.to : path.join(outDirAbsolute, asset.to),
  }));
}

export default createExecutor<BabelTransformExecutorSchema, ResolvedBabelTransform>({
  name: 'BabelTransform',
  resolve: (options, { projectRoot }) => {
    const babelConfig = loadBabelConfig(projectRoot, options.babelConfigPath, options.configKey);
    const removeDebug = options.removeDebug ?? false;
    const renameExtensions = options.renameExtensions ?? {};

    const sourcePath = path.join(projectRoot, options.sourcePattern);
    const globPattern = toPosixPath(sourcePath);

    const rawExcludePatterns = options.excludePatterns ?? [];
    const excludePatterns = rawExcludePatterns.map((pattern) => {
      const resolved = path.isAbsolute(pattern) ? pattern : path.join(projectRoot, pattern);
      return toPosixPath(resolved);
    });

    const resolvedAssets = resolveAssets(options.copyAssets ?? [], projectRoot, options.outDir);

    return {
      projectRoot,
      babelConfig,
      removeDebug,
      renameExtensions,
      globPattern,
      excludePatterns,
      resolvedAssets,
    };
  },
  run: async (resolved, options) => {
    const sourceFiles = await glob(resolved.globPattern, {
      absolute: true,
      ignore: resolved.excludePatterns,
    });

    if (sourceFiles.length === 0) {
      logger.warn(ERROR_NO_FILES_MATCHED);
      throw new Error(ERROR_NO_FILES_MATCHED);
    }

    logger.verbose(
      `Transforming ${sourceFiles.length} files with config '${options.configKey}'...`,
    );
    if (resolved.removeDebug) {
      logger.verbose('Debug blocks will be removed (production mode)');
    }

    await Promise.all(
      sourceFiles.map((file) =>
        transformFile(
          file,
          resolved.projectRoot,
          options.outDir,
          options.sourcePattern,
          resolved.babelConfig,
          resolved.removeDebug,
          resolved.renameExtensions,
        ),
      ),
    );

    logger.verbose(`Successfully transformed ${sourceFiles.length} files to ${options.outDir}`);

    if (resolved.resolvedAssets.length > 0) {
      logger.verbose(
        `Copying ${resolved.resolvedAssets.length} asset entries to ${options.outDir}`,
      );
      for (const asset of resolved.resolvedAssets) {
        await copyResolvedAsset(asset);
      }
    }
  },
});
