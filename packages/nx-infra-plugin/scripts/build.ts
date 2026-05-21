import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const DIST_DIR_NAME = 'dist';
const SRC_DIR_NAME = 'src';
const TSCONFIG_LIB_NAME = 'tsconfig.lib.json';
const EXECUTORS_JSON_NAME = 'executors.json';
const JSON_EXTENSION = '.json';
const TXT_EXTENSION = '.txt';
const TSCONFIG_PREFIX = 'tsconfig';

interface PathConfig {
  pluginDir: string;
  distDir: string;
  srcDir: string;
  tsconfig: string;
}

interface CompilationResult {
  success: boolean;
  error?: string;
}

interface AssetCopyResult {
  filesCopied: number;
}

const buildPathConfig = (rootDir: string): PathConfig => {
  const pluginDir = path.join(rootDir, '..');
  return {
    pluginDir,
    distDir: path.join(pluginDir, DIST_DIR_NAME),
    srcDir: path.join(pluginDir, SRC_DIR_NAME),
    tsconfig: path.join(pluginDir, TSCONFIG_LIB_NAME),
  };
};

const checkDistExists = (distPath: string): boolean => {
  if (!fs.existsSync(distPath)) return false;
  const files = fs.readdirSync(distPath);
  return files.length > 0;
};

const formatDiagnostics = (diagnostics: readonly ts.Diagnostic[]): string => {
  const host: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  };
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, host);
};

const compileTypeScript = (configPath: string): CompilationResult => {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    return { success: false, error: formatDiagnostics([configFile.error]) };
  }

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
  if (parsed.errors.length > 0) {
    return { success: false, error: formatDiagnostics(parsed.errors) };
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
    projectReferences: parsed.projectReferences,
  });

  const emitResult = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  if (emitResult.emitSkipped || diagnostics.length > 0) {
    return { success: false, error: formatDiagnostics(diagnostics) };
  }
  return { success: true };
};

const isAssetFile = (filename: string): boolean =>
  (filename.endsWith(JSON_EXTENSION) && !filename.includes(TSCONFIG_PREFIX))
  || filename.endsWith(TXT_EXTENSION);

const copyAssets = (srcDir: string, destDir: string): AssetCopyResult => {
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
      const result = copyAssets(srcPath, destPath);
      filesCopied += result.filesCopied;
    } else if (isAssetFile(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
      filesCopied++;
    }
  }

  return { filesCopied };
};

const updateExecutorPaths = (config: Record<string, unknown>): Record<string, unknown> => {
  const executors = config.executors as Record<string, { implementation: string; schema: string }>;

  const updated = Object.entries(executors).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        implementation: value.implementation.replace('./src/', './'),
        schema: value.schema.replace('./src/', './'),
      };
      return acc;
    },
    {} as Record<string, { implementation: string; schema: string }>,
  );

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

const shouldSkipBuild = (distPath: string, forceRebuild: boolean): boolean => {
  if (forceRebuild) return false;
  return checkDistExists(distPath);
};

const buildPlugin = (paths: PathConfig, forceRebuild = false): void => {
  if (shouldSkipBuild(paths.distDir, forceRebuild)) {
    console.log('[nx-infra-plugin] Already built, skipping.');
    process.exit(0);
  }

  console.log('[nx-infra-plugin] Compiling TypeScript...');
  const result = compileTypeScript(paths.tsconfig);
  if (!result.success) {
    throw new Error(result.error);
  }

  console.log('[nx-infra-plugin] Copying assets...');
  copyAssets(paths.srcDir, paths.distDir);
  copyExecutorsJson(paths.pluginDir, paths.distDir);

  console.log('[nx-infra-plugin] Plugin built successfully!');
};

const parseArgs = (): { forceRebuild: boolean } => {
  const args = process.argv.slice(2);
  return {
    forceRebuild: args.includes('--force') || args.includes('-f'),
  };
};

const main = (): void => {
  console.log('[nx-infra-plugin] Building...');

  try {
    const { forceRebuild } = parseArgs();
    const paths = buildPathConfig(__dirname);
    buildPlugin(paths, forceRebuild);
  } catch (error) {
    console.error('[nx-infra-plugin] Build failed:', (error as Error).message);
    console.error('[nx-infra-plugin] The plugin will be built on first use by NX.');
    process.exit(1);
  }
};

main();
