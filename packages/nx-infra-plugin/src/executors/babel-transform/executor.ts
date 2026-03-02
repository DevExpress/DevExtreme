import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from '@babel/core';
import { glob } from 'glob';
import { BabelTransformExecutorSchema } from './schema';
import { resolveProjectPath, normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { isWindowsOS } from '../../utils/common';

function removeDebugBlocks(content: string): string {
  return content.replace(/\/{2,}\s*#DEBUG[\s\S]*?\/{2,}\s*#ENDDEBUG/g, '');
}

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
    content = removeDebugBlocks(content);
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

const runExecutor: PromiseExecutor<BabelTransformExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);

  try {
    const babelConfig = loadBabelConfig(projectRoot, options.babelConfigPath, options.configKey);
    const removeDebug = options.removeDebug ?? false;
    const renameExtensions = options.renameExtensions ?? {};

    const sourcePath = path.join(projectRoot, options.sourcePattern);
    const globPattern = isWindowsOS() ? normalizeGlobPathForWindows(sourcePath) : sourcePath;

    const rawExcludePatterns = options.excludePatterns ?? [];
    const excludePatterns = rawExcludePatterns.map((pattern) => {
      const resolved = path.isAbsolute(pattern) ? pattern : path.join(projectRoot, pattern);
      return isWindowsOS() ? normalizeGlobPathForWindows(resolved) : resolved;
    });

    const sourceFiles = await glob(globPattern, {
      absolute: true,
      ignore: excludePatterns,
    });

    if (sourceFiles.length === 0) {
      logger.warn('No files matched the source pattern');
      return { success: false };
    }

    logger.verbose(
      `Transforming ${sourceFiles.length} files with config '${options.configKey}'...`,
    );
    if (removeDebug) {
      logger.verbose('Debug blocks will be removed (production mode)');
    }

    await Promise.all(
      sourceFiles.map((file) =>
        transformFile(
          file,
          projectRoot,
          options.outDir,
          options.sourcePattern,
          babelConfig,
          removeDebug,
          renameExtensions,
        ),
      ),
    );

    logger.verbose(`Successfully transformed ${sourceFiles.length} files to ${options.outDir}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Babel transform failed: ${errorMsg}`);
    return { success: false };
  }
};

export default runExecutor;
