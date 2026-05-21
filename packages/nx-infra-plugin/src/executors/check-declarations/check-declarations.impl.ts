import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { ensureDir, readFileText, writeFileText } from '../../utils/file-operations';
import {
  buildJqueryCheckContent,
  buildPublicModulesCheckContent,
  ModuleMetadata,
} from './declaration-check-content';
import { CheckDeclarationsExecutorSchema } from './schema';

const DEFAULT_MODULES_METADATA = './build/gulp/modules_metadata.json';
const DEFAULT_TS_BUNDLE = './ts/dx.all.d.ts';
const DEFAULT_BUNDLE_ARTIFACT = './artifacts/ts/dx.all.d.ts';
const DEFAULT_MODULES_PATTERN = './js/**/*.d.ts';
const DEFAULT_ENTRY_DIR = './artifacts';
const DEFAULT_NPM_PACKAGE = 'devextreme';
const INTERNAL_NPM_PACKAGE = 'devextreme-internal';

const NEWLINE = '\n';
const COMPILATION_FAILED = 'Declaration type check failed';

interface ResolvedCheckDeclarations {
  projectRoot: string;
  mode: CheckDeclarationsExecutorSchema['mode'];
  modulesMetadataPath: string;
  tsBundleFile: string;
  bundleArtifactPath: string;
  modulesPattern: string;
  entryOutputDir: string;
  npmPackageDir: string;
  typescriptModule?: string;
  extraCompilerOptions: Record<string, unknown>;
}

function readInternalPackageFlag(option?: boolean): boolean {
  if (option !== undefined) {
    return option;
  }
  return String(process.env.BUILD_INTERNAL_PACKAGE).toLowerCase() === 'true';
}

function resolveNpmPackageDir(options: CheckDeclarationsExecutorSchema): string {
  if (options.npmPackageDir) {
    return options.npmPackageDir;
  }
  return readInternalPackageFlag(options.internalPackage)
    ? INTERNAL_NPM_PACKAGE
    : DEFAULT_NPM_PACKAGE;
}

export function resolveTypeScript(
  projectRoot: string,
  typescriptModule?: string,
): typeof import('typescript') {
  const candidates = typescriptModule
    ? [
        path.isAbsolute(typescriptModule)
          ? typescriptModule
          : path.resolve(projectRoot, typescriptModule),
      ]
    : [
        path.join(projectRoot, 'node_modules', 'typescript-min'),
        path.join(projectRoot, 'node_modules', 'typescript'),
      ];

  for (const candidate of candidates) {
    try {
      const resolved = fs.existsSync(path.join(candidate, 'package.json'))
        ? candidate
        : require.resolve(candidate, { paths: [projectRoot] });
      return require(resolved);
    } catch {
      // try next candidate
    }
  }

  return require('typescript');
}

export function buildDefaultCompilerOptions(
  projectRoot: string,
  ts: typeof import('typescript'),
  extra?: Record<string, unknown>,
): import('typescript').CompilerOptions {
  return {
    noEmit: true,
    noEmitOnError: true,
    allowJs: true,
    strict: true,
    noImplicitAny: false,
    types: ['jquery'],
    // gulp-typescript accepted legacy names; TS API expects standard lib entries (4.9).
    lib: ['ES2017', 'DOM'],
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    typeRoots: [path.join(projectRoot, 'node_modules', '@types')],
    ...extra,
  };
}

function formatDiagnostics(
  ts: typeof import('typescript'),
  diagnostics: readonly import('typescript').Diagnostic[],
): string[] {
  return diagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE);
      return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    }
    return ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE);
  });
}

export async function runDeclarationsTypeCheck(params: {
  projectRoot: string;
  rootNames: string[];
  typescriptModule?: string;
  compilerOptions?: Record<string, unknown>;
}): Promise<void> {
  const ts = resolveTypeScript(params.projectRoot, params.typescriptModule);
  const compilerOptions = buildDefaultCompilerOptions(
    params.projectRoot,
    ts,
    params.compilerOptions,
  );

  const parsedConfig = ts.parseJsonConfigFileContent(
    { compilerOptions: compilerOptions as Record<string, unknown> },
    ts.sys,
    params.projectRoot,
  );

  const program = ts.createProgram(params.rootNames, parsedConfig.options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const errors = diagnostics.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (errors.length > 0) {
    logger.error(COMPILATION_FAILED);
    formatDiagnostics(ts, errors).forEach((message) => logger.error(message));
    throw new Error(COMPILATION_FAILED);
  }

  logger.verbose(`Type check passed for ${params.rootNames.length} root file(s)`);
}

async function loadModulesMetadata(metadataPath: string): Promise<ModuleMetadata[]> {
  const raw = await readFileText(metadataPath);
  return JSON.parse(raw) as ModuleMetadata[];
}

async function resolveModuleDeclarationFiles(
  projectRoot: string,
  pattern: string,
): Promise<string[]> {
  const globPattern = toPosixPath(path.join(projectRoot, pattern));
  const files = await glob(globPattern, { absolute: true, nodir: true });

  if (files.length === 0) {
    throw new Error(`No declaration files matched pattern: ${pattern}`);
  }

  return files;
}

async function writeCheckEntryFile(
  entryDir: string,
  fileName: string,
  content: string,
): Promise<string> {
  await ensureDir(entryDir);
  const entryPath = path.join(entryDir, fileName);
  await writeFileText(entryPath, content);
  return entryPath;
}

async function runModeCheck(resolved: ResolvedCheckDeclarations): Promise<void> {
  const { projectRoot, mode } = resolved;

  switch (mode) {
    case 'jquery': {
      const modules = await loadModulesMetadata(resolved.modulesMetadataPath);
      const content = buildJqueryCheckContent(resolved.tsBundleFile, modules);
      const entryPath = await writeCheckEntryFile(
        path.join(projectRoot, resolved.entryOutputDir),
        'globals.ts',
        content,
      );
      await runDeclarationsTypeCheck({
        projectRoot,
        rootNames: [entryPath],
        typescriptModule: resolved.typescriptModule,
        compilerOptions: resolved.extraCompilerOptions,
      });
      break;
    }
    case 'bundle': {
      const bundlePath = path.resolve(projectRoot, resolved.bundleArtifactPath);
      if (!fs.existsSync(bundlePath)) {
        throw new Error(`Bundle artifact not found: ${resolved.bundleArtifactPath}`);
      }
      await runDeclarationsTypeCheck({
        projectRoot,
        rootNames: [bundlePath],
        typescriptModule: resolved.typescriptModule,
        compilerOptions: resolved.extraCompilerOptions,
      });
      break;
    }
    case 'modules': {
      const rootNames = await resolveModuleDeclarationFiles(projectRoot, resolved.modulesPattern);
      await runDeclarationsTypeCheck({
        projectRoot,
        rootNames,
        typescriptModule: resolved.typescriptModule,
        compilerOptions: resolved.extraCompilerOptions,
      });
      break;
    }
    case 'public-modules': {
      const modules = await loadModulesMetadata(resolved.modulesMetadataPath);
      const content = buildPublicModulesCheckContent(modules, resolved.npmPackageDir);
      const entryPath = await writeCheckEntryFile(
        path.join(projectRoot, resolved.entryOutputDir),
        'modules.ts',
        content,
      );
      await runDeclarationsTypeCheck({
        projectRoot,
        rootNames: [entryPath],
        typescriptModule: resolved.typescriptModule,
        compilerOptions: {
          allowSyntheticDefaultImports: true,
          ...resolved.extraCompilerOptions,
        },
      });
      break;
    }
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unsupported check mode: ${exhaustive}`);
    }
  }
}

export default createExecutor<CheckDeclarationsExecutorSchema, ResolvedCheckDeclarations>({
  name: 'CheckDeclarations',
  resolve: (options, { projectRoot }) => ({
    projectRoot,
    mode: options.mode,
    modulesMetadataPath: path.resolve(
      projectRoot,
      options.modulesMetadataFile ?? DEFAULT_MODULES_METADATA,
    ),
    tsBundleFile: options.tsBundleFile ?? DEFAULT_TS_BUNDLE,
    bundleArtifactPath: options.bundleArtifactPath ?? DEFAULT_BUNDLE_ARTIFACT,
    modulesPattern: options.modulesPattern ?? DEFAULT_MODULES_PATTERN,
    entryOutputDir: options.entryOutputDir ?? DEFAULT_ENTRY_DIR,
    npmPackageDir: resolveNpmPackageDir(options),
    typescriptModule: options.typescriptModule ?? 'typescript-min',
    extraCompilerOptions: options.compilerOptions ?? {},
  }),
  run: async (resolved) => {
    logger.verbose(`Running declaration check: ${resolved.mode}`);
    await runModeCheck(resolved);
  },
});
