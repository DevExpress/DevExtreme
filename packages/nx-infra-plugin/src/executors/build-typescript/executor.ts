import { PromiseExecutor, logger } from '@nx/devkit';
import * as ts from 'typescript';
import * as path from 'path';
import { glob } from 'glob';
import { BuildTypescriptExecutorSchema } from './schema';
import { TsConfig, CompilerOptions } from '../../utils/types';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readFileText, exists, ensureDir } from '../../utils/file-operations';

const MODULE_TYPE_ESM = 'esm';
const MODULE_TYPE_CJS = 'cjs';

const DEFAULT_MODULE_TYPE = MODULE_TYPE_ESM;
const DEFAULT_TSCONFIG_CJS = './tsconfig.json';
const DEFAULT_TSCONFIG_ESM = './tsconfig.esm.json';
const DEFAULT_OUT_DIR_CJS = './npm/cjs';
const DEFAULT_OUT_DIR_ESM = './npm/esm';
const DEFAULT_SRC_PATTERN = './src/**/*.{ts,tsx}';

const ERROR_COMPILATION_FAILED = 'Compilation failed';

const NEWLINE_CHAR = '\n';

async function loadTsConfig(
  tsconfigPath: string
): Promise<{ content: TsConfig; compilerOptions: CompilerOptions }> {
  if (!await exists(tsconfigPath)) {
    throw new Error(`TypeScript config file not found: ${tsconfigPath}`);
  }

  const tsconfigContentRaw = await readFileText(tsconfigPath);
  const content = JSON.parse(tsconfigContentRaw) as TsConfig;
  return {
    content,
    compilerOptions: content.compilerOptions || {},
  };
}

function formatDiagnostics(
  diagnostics: ts.Diagnostic[]
): string[] {
  return diagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } =
        diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        NEWLINE_CHAR
      );
      return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    }
    return ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE_CHAR);
  });
}

function compile(
  sourceFiles: string[],
  compilerOptions: ts.CompilerOptions
): ts.Program {
  return ts.createProgram(sourceFiles, compilerOptions);
}

const runExecutor: PromiseExecutor<BuildTypescriptExecutorSchema> = async (
  options,
  context
) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const module = options.module || DEFAULT_MODULE_TYPE;

  const defaultTsconfigPath = module === MODULE_TYPE_CJS ? DEFAULT_TSCONFIG_CJS : DEFAULT_TSCONFIG_ESM;
  const tsconfigPath = path.join(
    absoluteProjectRoot,
    options.tsconfig || defaultTsconfigPath
  );

  const defaultOutDir = module === MODULE_TYPE_CJS ? DEFAULT_OUT_DIR_CJS : DEFAULT_OUT_DIR_ESM;
  const outDir = path.join(
    absoluteProjectRoot,
    options.outDir || defaultOutDir
  );

  try {
    const { content: tsconfigContent, compilerOptions } = await loadTsConfig(tsconfigPath);
    compilerOptions.outDir = outDir;
    await ensureDir(outDir);

    const srcPattern = options.srcPattern || DEFAULT_SRC_PATTERN;
    const globPattern = path.join(absoluteProjectRoot, srcPattern);
    const excludePattern = options.excludePattern
      ? path.join(absoluteProjectRoot, options.excludePattern)
      : undefined;

    const sourceFiles = await glob(globPattern, {
      absolute: true,
      nodir: true,
      ignore: excludePattern ? [excludePattern] : [],
    });

    logger.info(`Building ${module.toUpperCase()} for ${sourceFiles.length} source files...`);

    if (sourceFiles.length === 0) {
      logger.warn(`No source files matched pattern: ${srcPattern}`);
    }

    const parsedConfig = ts.parseJsonConfigFileContent(
      tsconfigContent,
      ts.sys,
      path.dirname(tsconfigPath)
    );

    const finalCompilerOptions: ts.CompilerOptions = {
      ...parsedConfig.options,
      outDir: compilerOptions.outDir,
      paths: {},
    };

    const program = compile(sourceFiles, finalCompilerOptions);
    const result = program.emit();

    if (result.emitSkipped) {
      logger.error(ERROR_COMPILATION_FAILED);
      const diagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(result.diagnostics);

      formatDiagnostics(diagnostics).forEach(msg => logger.error(msg));
      return { success: false };
    }

    logger.info(`✓ ${module.toUpperCase()} build completed successfully`);
    return { success: true };
  } catch (error) {
    logError(`Failed to build ${module.toUpperCase()}`, error);
    return { success: false };
  }
};

export default runExecutor;
