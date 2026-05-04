import { logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import type { Configuration, Stats } from 'webpack';
import { createExecutor } from '../../utils/create-executor';
import { loadProjectPackageJson } from '../../utils/file-operations';
import type { PackageJson } from '../../utils/types';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import { BundleExecutorSchema, BundleLicenseHeadersOption } from './schema';

const ERROR_MESSAGES = {
  ENTRIES_EMPTY: 'entries must contain at least one entry point',
  WEBPACK_NOT_FOUND:
    'webpack is not installed. Add webpack as a dependency to the consuming project.',
  WEBPACK_CONFIG_NOT_FOUND: (configPath: string) => `Webpack config not found: ${configPath}`,
  WEBPACK_CONFIG_LOAD_FAILED: (configPath: string, message: string) =>
    `Failed to load webpack config: ${configPath} - ${message}`,
  WEBPACK_ERROR: (message: string) => `Webpack build failed: ${message}`,
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
        const errorMessages = (info.errors || []).map((entry) => entry.message).join('\n');
        reject(new Error(errorMessages));
        return;
      }
      resolve(stats);
    });
  });
}

function loadWebpackConfig(resolvedConfigPath: string): Configuration {
  if (!fs.existsSync(resolvedConfigPath)) {
    throw new Error(ERROR_MESSAGES.WEBPACK_CONFIG_NOT_FOUND(resolvedConfigPath));
  }

  try {
    return require(resolvedConfigPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(ERROR_MESSAGES.WEBPACK_CONFIG_LOAD_FAILED(resolvedConfigPath, message));
  }
}

interface ResolvedLicenseHeaders {
  pkg: PackageJson;
  templatePath: string;
  options: BundleLicenseHeadersOption;
}

interface ResolvedBundle {
  projectRoot: string;
  entries: string[];
  resolvedSourceDir: string;
  resolvedOutDir: string;
  mode: 'debug' | 'production';
  sourceMap: boolean;
  webpack: typeof import('webpack');
  baseConfig: Configuration;
  licenseHeaders?: ResolvedLicenseHeaders;
}

async function resolveLicenseHeadersStep(
  projectRoot: string,
  options: BundleLicenseHeadersOption | undefined,
): Promise<ResolvedLicenseHeaders | undefined> {
  if (!options) {
    return undefined;
  }
  const pkg = await loadProjectPackageJson(projectRoot);
  const templatePath = resolveLicenseTemplate(projectRoot, options);
  return { pkg, templatePath, options };
}

async function applyLicenseHeadersStep(
  outDir: string,
  resolved: ResolvedLicenseHeaders,
): Promise<void> {
  const { pkg, templatePath, options } = resolved;
  const count = await applyLicenseHeadersToDirectory({
    targetDir: outDir,
    pkg,
    templatePath,
    eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
    mode: options.mode,
    version: options.version,
    commentType: options.commentType,
    separator: options.separator,
    prependAfterLicense: options.prependAfterLicense,
    filenameMode: options.filenameMode,
    includePatterns: options.includePatterns,
    excludePatterns: options.excludePatterns,
  });
  logger.verbose(`Applied license headers to ${count} bundle file(s)`);
}

export default createExecutor<BundleExecutorSchema, ResolvedBundle>({
  name: 'Bundle',
  resolve: async (options, { projectRoot }) => {
    const {
      entries,
      sourceDir,
      outDir,
      mode,
      webpackConfigPath = './webpack.config.js',
      sourceMap = true,
      applyLicenseHeaders,
    } = options;

    if (!entries?.length) {
      throw new Error(ERROR_MESSAGES.ENTRIES_EMPTY);
    }

    const resolvedSourceDir = path.resolve(projectRoot, sourceDir);
    const resolvedOutDir = path.resolve(projectRoot, outDir);
    const resolvedConfigPath = path.resolve(projectRoot, webpackConfigPath);

    const webpack = loadWebpack();
    const baseConfig = loadWebpackConfig(resolvedConfigPath);
    const licenseHeaders = await resolveLicenseHeadersStep(projectRoot, applyLicenseHeaders);

    return {
      projectRoot,
      entries,
      resolvedSourceDir,
      resolvedOutDir,
      mode,
      sourceMap,
      webpack,
      baseConfig,
      licenseHeaders,
    };
  },
  run: async (resolved) => {
    const entryMap = buildEntryMap(resolved.entries, resolved.resolvedSourceDir, resolved.mode);
    const config = createWebpackConfig(
      resolved.webpack,
      resolved.baseConfig,
      entryMap,
      resolved.resolvedOutDir,
      resolved.mode,
      resolved.projectRoot,
      resolved.sourceMap,
    );

    logger.verbose(`Bundling ${resolved.entries.length} entries in ${resolved.mode} mode`);
    logger.verbose(`Source: ${resolved.resolvedSourceDir}`);
    logger.verbose(`Output: ${resolved.resolvedOutDir}`);

    try {
      const stats = await runWebpack(resolved.webpack, config);

      if (stats.hasWarnings()) {
        const info = stats.toJson({ warnings: true });
        (info.warnings || []).forEach((warning) => logger.warn(warning.message));
      }

      const assets = Object.keys(stats.compilation.assets);
      logger.verbose(`Produced ${assets.length} bundle(s): ${assets.join(', ')}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(ERROR_MESSAGES.WEBPACK_ERROR(message));
    }

    if (resolved.licenseHeaders) {
      await applyLicenseHeadersStep(resolved.resolvedOutDir, resolved.licenseHeaders);
    }
  },
});
