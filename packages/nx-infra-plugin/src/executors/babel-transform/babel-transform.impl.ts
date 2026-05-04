import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from '@babel/core';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { stripDebug } from '../compress/compress.impl';
import { BabelTransformExecutorSchema } from './schema';

const ERROR_NO_FILES_MATCHED = 'No files matched the source pattern';

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

interface ResolvedBabelTransform {
  projectRoot: string;
  babelConfig: babel.TransformOptions;
  removeDebug: boolean;
  renameExtensions: Record<string, string>;
  globPattern: string;
  excludePatterns: string[];
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

    return {
      projectRoot,
      babelConfig,
      removeDebug,
      renameExtensions,
      globPattern,
      excludePatterns,
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
  },
});
