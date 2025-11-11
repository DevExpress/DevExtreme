import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PLUGIN_DIR_NAME = 'nx-infra-plugin';
const DIST_DIR_NAME = 'dist';
const SRC_DIR_NAME = 'src';
const TEMP_TSCONFIG_NAME = 'tsconfig.bootstrap.json';
const TSCONFIG_LIB_NAME = 'tsconfig.lib.json';
const EXECUTORS_JSON_NAME = 'executors.json';
const JSON_EXTENSION = '.json';
const TSCONFIG_PREFIX = 'tsconfig';

interface PathConfig {
  pluginDir: string;
  distDir: string;
  srcDir: string;
  tsconfig: string;
}

interface TsConfig {
  extends?: string;
  compilerOptions?: Record<string, unknown>;
  include?: string[];
  exclude?: string[];
}

interface CompilationResult {
  success: boolean;
  error?: string;
}

interface AssetCopyResult {
  filesCopied: number;
}

const buildPathConfig = (rootDir: string): PathConfig => {
  const pluginDir = path.join(rootDir, '../../packages', PLUGIN_DIR_NAME);
  return {
    pluginDir,
    distDir: path.join(pluginDir, DIST_DIR_NAME),
    srcDir: path.join(pluginDir, SRC_DIR_NAME),
    tsconfig: path.join(pluginDir, TSCONFIG_LIB_NAME)
  };
};

const checkDistExists = (distPath: string): boolean => {
  if (!fs.existsSync(distPath)) return false;
  const files = fs.readdirSync(distPath);
  return files.length > 0;
};

const readTsConfig = (configPath: string): TsConfig => {
  const content = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(content);
};

const createBootstrapConfig = (original: TsConfig): TsConfig => ({
  ...original,
  compilerOptions: {
    ...original.compilerOptions,
    rootDir: undefined,
    outDir: `./${DIST_DIR_NAME}`
  }
});

const writeTsConfig = (configPath: string, config: TsConfig): void => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

const compileTypeScript = (pluginDir: string, configPath: string): CompilationResult => {
  try {
    execSync(
      `npx tsc -p ${configPath}`,
      {
        cwd: pluginDir,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      }
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

const isJsonAsset = (filename: string): boolean =>
  filename.endsWith(JSON_EXTENSION) && !filename.includes(TSCONFIG_PREFIX);

const copyJsonAssets = (srcDir: string, destDir: string): AssetCopyResult => {
  if (!fs.existsSync(srcDir)) {
    return { filesCopied: 0 };
  }

  let filesCopied = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      const result = copyJsonAssets(srcPath, destPath);
      filesCopied += result.filesCopied;
    } else if (isJsonAsset(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
      filesCopied++;
    }
  }

  return { filesCopied };
};

const updateExecutorPaths = (config: Record<string, unknown>): Record<string, unknown> => {
  const executors = config.executors as Record<string, { implementation: string; schema: string }>;

  const updated = Object.entries(executors).reduce((acc, [key, value]) => {
    acc[key] = {
      ...value,
      implementation: value.implementation.replace('./src/', './'),
      schema: value.schema.replace('./src/', './')
    };
    return acc;
  }, {} as Record<string, { implementation: string; schema: string }>);

  return { ...config, executors: updated };
};

const copyExecutorsJson = (pluginDir: string, distDir: string): boolean => {
  const sourcePath = path.join(pluginDir, EXECUTORS_JSON_NAME);
  if (!fs.existsSync(sourcePath)) return false;

  const content = fs.readFileSync(sourcePath, 'utf8');
  const config = JSON.parse(content);
  const updatedConfig = updateExecutorPaths(config);

  const destPath = path.join(distDir, EXECUTORS_JSON_NAME);
  fs.writeFileSync(destPath, JSON.stringify(updatedConfig, null, 2));
  return true;
};

const cleanupTempConfig = (configPath: string): void => {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
};

const shouldSkipBuild = (distPath: string, forceRebuild: boolean): boolean => {
  if (forceRebuild) return false;
  return checkDistExists(distPath);
};

const buildPlugin = (paths: PathConfig, forceRebuild = false): void => {
  if (shouldSkipBuild(paths.distDir, forceRebuild)) {
    console.log('✓ Plugin already built, skipping...');
    process.exit(0);
  }

  console.log('  Compiling TypeScript...');

  const tempConfigPath = path.join(paths.pluginDir, TEMP_TSCONFIG_NAME);
  const originalConfig = readTsConfig(paths.tsconfig);
  const bootstrapConfig = createBootstrapConfig(originalConfig);

  writeTsConfig(tempConfigPath, bootstrapConfig);

  try {
    const result = compileTypeScript(paths.pluginDir, tempConfigPath);
    if (!result.success) {
      throw new Error(result.error);
    }

    console.log('  Copying assets...');
    copyJsonAssets(paths.srcDir, paths.distDir);

    copyExecutorsJson(paths.pluginDir, paths.distDir);

    console.log('✓ Plugin built successfully!');
  } finally {
    cleanupTempConfig(tempConfigPath);
  }
};

const parseArgs = (): { forceRebuild: boolean } => {
  const args = process.argv.slice(2);
  return {
    forceRebuild: args.includes('--force') || args.includes('-f')
  };
};

const main = (): void => {
  console.log('🔨 Building nx-infra-plugin...');

  try {
    const { forceRebuild } = parseArgs();
    const paths = buildPathConfig(__dirname);
    buildPlugin(paths, forceRebuild);
  } catch (error) {
    console.error('⚠ Failed to build plugin:', (error as Error).message);
    console.error('  The plugin will be built on first use by NX');
    process.exit(0);
  }
};

main();
