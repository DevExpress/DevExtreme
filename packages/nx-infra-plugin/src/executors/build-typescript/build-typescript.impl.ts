import { logger } from '@nx/devkit';
import * as ts from 'typescript';
import * as path from 'path';
import { glob } from 'glob';
import { prepareSingleFileReplaceTscAliasPaths } from 'tsc-alias';
import { createExecutor } from '../../utils/create-executor';
import { BuildTypescriptExecutorSchema } from './schema';
import { TsConfig, CompilerOptions } from '../../utils/types';
import { normalizeGlobPathForWindows, toPosixPath } from '../../utils/path-resolver';
import { isWindowsOS } from '../../utils/common';
import { exists, ensureDir, writeFileText } from '../../utils/file-operations';

type AliasTranspileFunc = (filePath: string, fileContents: string) => string;

const DEFAULT_MODULE_TYPE = 'esm';
const DEFAULT_TSCONFIG = './tsconfig.esm.json';
const DEFAULT_OUT_DIR = './npm/esm';
const DEFAULT_SRC_PATTERN = './src/**/*.{ts,tsx}';

const NEWLINE_CHAR = '\n';

const ERROR_MESSAGES = {
  COMPILATION_FAILED: 'Compilation failed',
  TSCONFIG_NOT_FOUND: (filePath: string) => `TypeScript config file not found: ${filePath}`,
  TSCONFIG_PARSE_ERROR: (message: string) => `Error reading tsconfig: ${message}`,
  NO_SOURCE_FILES: (pattern: string) => `No source files matched pattern: ${pattern}`,
  RESOLVE_PATHS_REQUIRES_BASE_DIR: 'resolvePathsBaseDir is required when resolvePaths is enabled',
} as const;

interface ResolvedConfig {
  projectRoot: string;
  moduleType: string;
  tsconfigPath: string;
  outDir: string;
  srcPattern: string;
  excludePatterns: string[];
  resolvePaths: boolean;
  resolvePathsBaseDir?: string;
}

interface EmitProgramResult {
  success: boolean;
}

interface EmitOptions {
  aliasTranspileFunc?: AliasTranspileFunc;
  outDir: string;
  aliasPath?: string;
}

function resolveExecutorConfig(
  options: BuildTypescriptExecutorSchema,
  projectRoot: string,
): ResolvedConfig {
  return {
    projectRoot,
    moduleType: options.module || DEFAULT_MODULE_TYPE,
    tsconfigPath: path.join(projectRoot, options.tsconfig || DEFAULT_TSCONFIG),
    outDir: path.join(projectRoot, options.outDir || DEFAULT_OUT_DIR),
    srcPattern: options.srcPattern || DEFAULT_SRC_PATTERN,
    excludePatterns: options.excludePatterns || [],
    resolvePaths: options.resolvePaths ?? false,
    resolvePathsBaseDir: options.resolvePathsBaseDir
      ? path.join(projectRoot, options.resolvePathsBaseDir)
      : undefined,
  };
}

function validateOptions(config: ResolvedConfig): void {
  if (config.resolvePaths && !config.resolvePathsBaseDir) {
    throw new Error(ERROR_MESSAGES.RESOLVE_PATHS_REQUIRES_BASE_DIR);
  }
}

async function createAliasTranspileFunc(
  tsconfigPath: string,
  aliasRoot: string,
): Promise<AliasTranspileFunc> {
  const transpileFunc = await prepareSingleFileReplaceTscAliasPaths({
    configFile: tsconfigPath,
    outDir: aliasRoot,
  });

  return (filePath: string, fileContents: string): string => {
    return transpileFunc({ fileContents, filePath });
  };
}

async function loadTsConfig(
  tsconfigPath: string,
): Promise<{ content: TsConfig; compilerOptions: CompilerOptions }> {
  if (!(await exists(tsconfigPath))) {
    throw new Error(ERROR_MESSAGES.TSCONFIG_NOT_FOUND(tsconfigPath));
  }

  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    const message = ts.flattenDiagnosticMessageText(error.messageText, NEWLINE_CHAR);
    throw new Error(ERROR_MESSAGES.TSCONFIG_PARSE_ERROR(message));
  }

  const content = config as TsConfig;
  return {
    content,
    compilerOptions: content.compilerOptions || {},
  };
}

async function resolveSourceFiles(
  projectRoot: string,
  srcPattern: string,
  excludePatterns: string[],
): Promise<string[]> {
  const globPattern = toPosixPath(path.join(projectRoot, srcPattern));

  const resolvedExcludes = excludePatterns.map((pattern) => {
    const result = path.join(projectRoot, pattern);
    return toPosixPath(result);
  });

  const files = await glob(globPattern, {
    absolute: true,
    nodir: true,
    ignore: resolvedExcludes,
  });

  if (files.length === 0) {
    throw new Error(ERROR_MESSAGES.NO_SOURCE_FILES(srcPattern));
  }

  return files;
}

function replacePathPrefix(filePath: string, from: string, to: string): string {
  if (isWindowsOS()) {
    return normalizeGlobPathForWindows(filePath).replace(
      normalizeGlobPathForWindows(from),
      normalizeGlobPathForWindows(to),
    );
  }

  return filePath.replace(from, to);
}

function buildCompilerOptions(
  tsconfigContent: TsConfig,
  tsconfigPath: string,
  outDir: string,
  resolvePaths: boolean,
): ts.CompilerOptions {
  const parsedConfig = ts.parseJsonConfigFileContent(
    tsconfigContent,
    ts.sys,
    path.dirname(tsconfigPath),
  );

  return {
    ...parsedConfig.options,
    outDir,
    paths: resolvePaths ? parsedConfig.options.paths : {},
  };
}

function formatDiagnostics(diagnostics: ts.Diagnostic[]): string[] {
  return diagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE_CHAR);
      return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    }
    return ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE_CHAR);
  });
}

async function emitWithAliasResolution(
  program: ts.Program,
  emitOptions: EmitOptions,
): Promise<{ success: boolean; diagnostics: ts.Diagnostic[] }> {
  const { aliasTranspileFunc, outDir, aliasPath } = emitOptions;
  const emittedFiles: Array<{ path: string; content: string }> = [];

  const result = program.emit(undefined, (filePath, fileData) => {
    let finalContent = fileData;

    if (aliasTranspileFunc && aliasPath) {
      const normalizedFilePath = replacePathPrefix(filePath, outDir, aliasPath);
      finalContent = aliasTranspileFunc(normalizedFilePath, fileData);
    }

    emittedFiles.push({ path: filePath, content: finalContent });
  });

  for (const file of emittedFiles) {
    const dir = path.dirname(file.path);
    await ensureDir(dir);
    await writeFileText(file.path, file.content);
  }

  const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
  return { success: !result.emitSkipped, diagnostics };
}

async function emitWithPathAliasResolution(
  program: ts.Program,
  config: ResolvedConfig,
): Promise<EmitProgramResult> {
  const aliasTranspileFunc = await createAliasTranspileFunc(
    config.tsconfigPath,
    config.resolvePathsBaseDir!,
  );

  logger.verbose(`Path alias resolution enabled with base dir: ${config.resolvePathsBaseDir}`);

  const { success, diagnostics } = await emitWithAliasResolution(program, {
    aliasTranspileFunc,
    outDir: config.outDir,
    aliasPath: config.resolvePathsBaseDir,
  });

  if (!success) {
    logger.error(ERROR_MESSAGES.COMPILATION_FAILED);
    formatDiagnostics(diagnostics).forEach((message) => logger.error(message));
  }

  return { success };
}

function emitStandard(program: ts.Program): EmitProgramResult {
  const result = program.emit();

  if (result.emitSkipped) {
    logger.error(ERROR_MESSAGES.COMPILATION_FAILED);
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
    formatDiagnostics(diagnostics).forEach((message) => logger.error(message));
    return { success: false };
  }

  return { success: true };
}

interface ResolvedBuildTypescript {
  config: ResolvedConfig;
}

export default createExecutor<BuildTypescriptExecutorSchema, ResolvedBuildTypescript>({
  name: 'BuildTypescript',
  resolve: async (options, { projectRoot }) => {
    const config = resolveExecutorConfig(options, projectRoot);
    validateOptions(config);
    return { config };
  },
  run: async ({ config }) => {
    const { content: tsconfigContent, compilerOptions } = await loadTsConfig(config.tsconfigPath);
    compilerOptions.outDir = config.outDir;
    await ensureDir(config.outDir);

    const sourceFiles = await resolveSourceFiles(
      config.projectRoot,
      config.srcPattern,
      config.excludePatterns,
    );

    logger.verbose(
      `Building ${config.moduleType.toUpperCase()} for ${sourceFiles.length} files...`,
    );

    const finalCompilerOptions = buildCompilerOptions(
      tsconfigContent,
      config.tsconfigPath,
      config.outDir,
      config.resolvePaths,
    );

    const program = ts.createProgram(sourceFiles, finalCompilerOptions);
    const emitResult =
      config.resolvePaths && config.resolvePathsBaseDir
        ? await emitWithPathAliasResolution(program, config)
        : emitStandard(program);

    if (!emitResult.success) {
      throw new Error(ERROR_MESSAGES.COMPILATION_FAILED);
    }

    logger.verbose(`✓ ${config.moduleType.toUpperCase()} build completed successfully`);
  },
});
