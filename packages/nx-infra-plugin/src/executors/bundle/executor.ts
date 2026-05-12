import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import type { Configuration, Stats } from 'webpack';
import { BundleExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';

const ERROR_MESSAGES = {
  ENTRIES_EMPTY: 'entries must contain at least one entry point',
  WEBPACK_NOT_FOUND:
    'webpack is not installed. Add webpack as a dependency to the consuming project.',
  WEBPACK_CONFIG_NOT_FOUND: (configPath: string) => `Webpack config not found: ${configPath}`,
  WEBPACK_ERROR: (msg: string) => `Webpack build failed: ${msg}`,
} as const;

function loadWebpack(): typeof import('webpack') {
  try {
    return require('webpack');
  } catch {
    throw new Error(ERROR_MESSAGES.WEBPACK_NOT_FOUND);
  }
}

function buildEntryMap(
  entries: string[],
  sourceDir: string,
  mode: 'debug' | 'production',
): Record<string, string> {
  const entryMap: Record<string, string> = {};

  for (const entry of entries) {
    const baseName = path.basename(entry, path.extname(entry));
    const outputName = mode === 'debug' ? `${baseName}.debug` : baseName;
    entryMap[outputName] = path.resolve(sourceDir, entry);
  }

  return entryMap;
}

function createWebpackConfig(
  webpack: typeof import('webpack'),
  baseConfig: Configuration,
  entryMap: Record<string, string>,
  outDir: string,
  mode: 'debug' | 'production',
  projectRoot: string,
  sourceMap: boolean,
): Configuration {
  const config: Configuration = {
    ...baseConfig,
    context: projectRoot,
    entry: entryMap,
    output: {
      ...(baseConfig.output || {}),
      path: outDir,
      filename: '[name].js',
    },
  };

  config.optimization = {
    ...(config.optimization || {}),
    minimize: false,
  };

  if (mode === 'debug') {
    config.output = {
      ...(config.output || {}),
      pathinfo: true,
    };
    if (sourceMap) {
      config.devtool = 'eval-source-map';
    }
  }

  const isInternalBuild =
    String(process.env.BUILD_INTERNAL_PACKAGE).toLowerCase() === 'true'
    || String(process.env.BUILD_TEST_INTERNAL_PACKAGE).toLowerCase() === 'true';

  if (isInternalBuild) {
    const plugins = config.plugins ? [...config.plugins] : [];
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(/(.*)\/license_validation/, (resource) => {
        resource.request = resource.request.replace(
          'license_validation',
          'license_validation_internal',
        );
      }),
    );
    config.plugins = plugins;
  }

  return config;
}

function runWebpack(webpack: typeof import('webpack'), config: Configuration): Promise<Stats> {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (!stats) {
        reject(new Error('Webpack returned no stats'));
        return;
      }
      if (stats.hasErrors()) {
        const info = stats.toJson({ errors: true });
        const errorMessages = (info.errors || []).map((e) => e.message).join('\n');
        reject(new Error(errorMessages));
        return;
      }
      resolve(stats);
    });
  });
}

const runExecutor: PromiseExecutor<BundleExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const {
    entries,
    sourceDir,
    outDir,
    mode,
    webpackConfigPath = './webpack.config.js',
    sourceMap = true,
  } = options;

  if (!entries?.length) {
    logger.error(ERROR_MESSAGES.ENTRIES_EMPTY);
    return { success: false };
  }

  const resolvedSourceDir = path.resolve(projectRoot, sourceDir);
  const resolvedOutDir = path.resolve(projectRoot, outDir);
  const resolvedConfigPath = path.resolve(projectRoot, webpackConfigPath);

  let webpack: typeof import('webpack');
  try {
    webpack = loadWebpack();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(errorMsg);
    return { success: false };
  }

  if (!fs.existsSync(resolvedConfigPath)) {
    logger.error(ERROR_MESSAGES.WEBPACK_CONFIG_NOT_FOUND(resolvedConfigPath));
    return { success: false };
  }

  let baseConfig: Configuration;
  try {
    baseConfig = require(resolvedConfigPath);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to load webpack config: ${resolvedConfigPath} - ${errorMsg}`);
    return { success: false };
  }

  const entryMap = buildEntryMap(entries, resolvedSourceDir, mode);
  const config = createWebpackConfig(
    webpack,
    baseConfig,
    entryMap,
    resolvedOutDir,
    mode,
    projectRoot,
    sourceMap,
  );

  logger.verbose(`Bundling ${entries.length} entries in ${mode} mode`);
  logger.verbose(`Source: ${resolvedSourceDir}`);
  logger.verbose(`Output: ${resolvedOutDir}`);

  try {
    const stats = await runWebpack(webpack, config);

    if (stats.hasWarnings()) {
      const info = stats.toJson({ warnings: true });
      (info.warnings || []).forEach((w) => logger.warn(w.message));
    }

    const assets = Object.keys(stats.compilation.assets);
    logger.verbose(`Produced ${assets.length} bundle(s): ${assets.join(', ')}`);

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(ERROR_MESSAGES.WEBPACK_ERROR(errorMsg));
    return { success: false };
  }
};

export default runExecutor;
