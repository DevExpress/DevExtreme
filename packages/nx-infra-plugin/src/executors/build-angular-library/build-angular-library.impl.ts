import { logger, ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { spawn } from 'child_process';
import { createExecutor } from '../../utils/create-executor';
import { BuildAngularLibraryExecutorSchema } from './schema';
import { resolveFromProject } from '../../utils/path-resolver';
import { exists } from '../../utils/file-operations';

interface BuildConfiguration {
  ngPackagePath: string;
  tsconfigPath: string;
  projectDir: string;
  ngPackagrPath: string;
  args: string[];
  projectName: string;
}

interface BuildResult {
  success: boolean;
  message?: string;
  error?: string;
  exitCode?: number;
  signal?: string | undefined;
  duration?: number;
}

const CONFIG = {
  DEFAULT_TSCONFIG: './tsconfig.lib.json',
  NG_PACKAGR_BIN_PATH: 'node_modules/.bin/ng-packagr',
  NG_PACKAGR_ARGS: {
    PACKAGE: '-p',
    CONFIG: '-c',
  },
} as const;

const ERROR_MESSAGES = {
  MISSING_NG_PACKAGE: (filePath: string) => `ng-package.json file not found at: ${filePath}`,
  MISSING_TSCONFIG: (filePath: string) => `TypeScript config file not found at: ${filePath}`,
  BUILD_FAILED: (project: string, exitCode?: number) =>
    `Angular library build failed for project ${project}${
      exitCode ? ` (exit code: ${exitCode})` : ''
    }`,
  PROJECT_ROOT_NOT_FOUND: (project: string) =>
    `Could not determine project root directory for project: ${project}`,
} as const;

function resolveBuildConfiguration(
  options: BuildAngularLibraryExecutorSchema,
  context: ExecutorContext,
): BuildConfiguration {
  const ngPackagePath = resolveFromProject(context, options.project);
  const tsconfigPath = resolveFromProject(context, options.tsConfig || CONFIG.DEFAULT_TSCONFIG);
  const projectRoot = context.projectsConfigurations?.projects[context.projectName!]?.root;

  if (!projectRoot) {
    throw new Error(ERROR_MESSAGES.PROJECT_ROOT_NOT_FOUND(context.projectName || 'unknown'));
  }

  const projectDir = path.resolve(context.root, projectRoot);

  const relativeNgPackage = path.relative(projectDir, ngPackagePath);
  const relativeTsConfig = path.relative(projectDir, tsconfigPath);

  return {
    ngPackagePath,
    tsconfigPath,
    projectDir,
    ngPackagrPath: path.join(projectDir, CONFIG.NG_PACKAGR_BIN_PATH),
    args: [
      CONFIG.NG_PACKAGR_ARGS.PACKAGE,
      relativeNgPackage,
      CONFIG.NG_PACKAGR_ARGS.CONFIG,
      relativeTsConfig,
    ],
    projectName: context.projectName || 'unknown',
  };
}

async function validateConfigFiles(ngPackagePath: string, tsconfigPath: string): Promise<void> {
  if (!(await exists(ngPackagePath))) {
    throw new Error(ERROR_MESSAGES.MISSING_NG_PACKAGE(ngPackagePath));
  }

  if (!(await exists(tsconfigPath))) {
    throw new Error(ERROR_MESSAGES.MISSING_TSCONFIG(tsconfigPath));
  }
}

async function validateBuildConfiguration(config: BuildConfiguration): Promise<void> {
  await validateConfigFiles(config.ngPackagePath, config.tsconfigPath);
}

function spawnProcess(spawnArgs: {
  command: string;
  args: string[];
  options: any;
}): Promise<{ exitCode: number; signal?: string | undefined }> {
  return new Promise((resolve, reject) => {
    logger.verbose(`Spawning process: ${spawnArgs.command} ${spawnArgs.args.join(' ')}`);

    const child = spawn(spawnArgs.command, spawnArgs.args, spawnArgs.options);

    child.on('close', (code, signal) => {
      logger.verbose(`Process closed with code: ${code}, signal: ${signal || 'none'}`);
      const actualExitCode = code === null ? -1 : code;
      resolve({ exitCode: actualExitCode, signal: signal || undefined });
    });

    child.on('error', (error) => {
      logger.error(`Process error: ${error instanceof Error ? error.message : String(error)}`);
      reject(error);
    });
  });
}

async function executeNgPackagrBuild(config: BuildConfiguration): Promise<BuildResult> {
  const startTime = Date.now();

  try {
    logger.verbose(
      `Using ng-package config: ${path.relative(config.projectDir, config.ngPackagePath)}`,
    );
    logger.verbose(
      `Using TypeScript config: ${path.relative(config.projectDir, config.tsconfigPath)}`,
    );
    logger.verbose(`Running ng-packagr from: ${config.projectDir}`);
    logger.verbose(`Executing: ${config.ngPackagrPath} ${config.args.join(' ')}`);

    const { exitCode, signal } = await spawnProcess({
      command: config.ngPackagrPath,
      args: config.args,
      options: {
        cwd: config.projectDir,
        stdio: 'inherit' as const,
        shell: true,
      },
    });

    if (exitCode === 0) {
      logger.verbose(`✓ ng-packagr completed successfully (exitCode: ${exitCode})`);
      return {
        success: true,
        message: '✓ Angular library build completed successfully',
        exitCode,
        duration: Date.now() - startTime,
      };
    } else {
      logger.error(`✗ ng-packagr failed with exit code ${exitCode}`);
      return {
        success: false,
        message: `ng-packagr exited with code ${exitCode}`,
        exitCode,
        signal,
        duration: Date.now() - startTime,
      };
    }
  } catch (error) {
    logger.error(`Process spawn error: ${error instanceof Error ? error.message : String(error)}`);
    logger.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack available'}`);
    return {
      success: false,
      message: 'Failed to execute ng-packagr',
      error: error instanceof Error ? error.message : String(error),
      exitCode: -1,
      duration: Date.now() - startTime,
    };
  }
}

async function withWorkingDirectory<T>(directory: string, operation: () => Promise<T>): Promise<T> {
  const originalCwd = process.cwd();

  try {
    process.chdir(directory);
    return await operation();
  } finally {
    process.chdir(originalCwd);
  }
}

interface ResolvedBuildAngularLibrary {
  config: BuildConfiguration;
}

export default createExecutor<BuildAngularLibraryExecutorSchema, ResolvedBuildAngularLibrary>({
  name: 'BuildAngularLibrary',
  resolve: async (options, { context }) => {
    const config = resolveBuildConfiguration(options, context);
    await validateBuildConfiguration(config);
    return { config };
  },
  run: async ({ config }) => {
    logger.verbose('Building Angular library with ng-packagr...');

    const buildResult = await withWorkingDirectory(config.projectDir, () =>
      executeNgPackagrBuild(config),
    );

    if (!buildResult.success) {
      throw new Error(ERROR_MESSAGES.BUILD_FAILED(config.projectName, buildResult.exitCode));
    }
  },
});
