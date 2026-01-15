import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { KarmaMultiEnvExecutorSchema } from './schema';
import {
  loadKarmaModule,
  createKarmaServer,
  KarmaConfigOptions,
  KarmaExecutorError,
} from './karma-utils';
import { resolveProjectPath } from '../../utils/path-resolver';
import { KarmaEnvironment, ENVIRONMENT_CONFIGS, DEFAULT_ENVIRONMENTS } from './karma.types';

const SIGNALS = { SIGINT: 'SIGINT', SIGTERM: 'SIGTERM' } as const;
const TIMEOUTS = { DEFAULT: 300000, FORCE_KILL_DELAY: 1000 } as const;
const STATUS_ICONS = {
  SUCCESS: '✅',
  FAILURE: '❌',
  CELEBRATION: '🎉',
  ERROR: '💥',
  WATCH: '👁️',
  START: '🚀',
  STOP: '📴',
  REFRESH: '🔄',
  DOCUMENTATION: '📋',
  CLOCK: '⏱️',
  DEBUG: '🕵🏻‍♂️',
} as const;

interface TestResult {
  environment: KarmaEnvironment;
  success: boolean;
  exitCode?: number;
  duration: number;
  error?: string;
  message?: string;
}

interface ExecutionPlan {
  executionOrder: KarmaEnvironment[];
  timeout: number;
}

interface TestSummary {
  totalDuration: number;
  results: TestResult[];
  environmentsRun: KarmaEnvironment[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  exitCode?: number;
}

const createErrorHandler = (environment: string) => ({
  logError: (message: string, error?: any) => {
    logger.error(`[${environment.toUpperCase()}] ${message}`);
    if (error?.message) logger.error(`Details: ${error.message}`);
  },

  createErrorResult: (error: any, duration: number): TestResult => ({
    environment: environment as KarmaEnvironment,
    success: false,
    exitCode: 1,
    duration,
    error: error instanceof Error ? error.message : String(error),
    message: error instanceof Error ? error.message : String(error),
  }),

  logWarning: (message: string, error?: any) => {
    logger.warn(`[${environment.toUpperCase()}] ${message}`);
    if (error?.message) logger.warn(`Details: ${error.message}`);
  },
});

function planTestExecution(
  options: KarmaMultiEnvExecutorSchema,
  environments: KarmaEnvironment[],
): ExecutionPlan {
  const executionOrder = createExecutionOrder(environments, options.watch || false);
  return {
    executionOrder,
    timeout: options.timeout || TIMEOUTS.DEFAULT,
  };
}

function createTestConfig(
  baseConfig: KarmaConfigOptions,
  shimPath: string,
  options: KarmaMultiEnvExecutorSchema,
): KarmaConfigOptions {
  const isSingleRun = !options.debug && !options.watch;

  const config = {
    ...baseConfig,
    files: [{ pattern: shimPath, watched: false }],
    preprocessors: { [shimPath]: ['webpack'] },
    singleRun: isSingleRun,
    autoWatch: options.watch || false,
    plugins: baseConfig.plugins,
    browsers:
      options.watch || options.debug ? ['Chrome'] : baseConfig.browsers || ['ChromeHeadless'],
    logLevel: baseConfig.logLevel || 'info',
  };

  return config;
}

function createExecutionOrder(
  environments: KarmaEnvironment[],
  watch: boolean,
): KarmaEnvironment[] {
  if (watch) {
    return ['client'];
  }

  const order: KarmaEnvironment[] = [];
  const validEnvironments: KarmaEnvironment[] = ['client', 'server', 'hydration'];

  for (const env of validEnvironments) {
    if (environments.includes(env)) {
      order.push(env);
    }
  }

  return order;
}

function summarizeTestResults(results: TestResult[]): TestSummary {
  const totalDuration = results.reduce((sum, result) => sum + result.duration, 0);

  return {
    totalDuration,
    results,
    environmentsRun: results.map((r) => r.environment),
    summary: {
      total: results.length,
      passed: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
    ...(results.some((r) => !r.success)
      ? {
          exitCode: results.find((r) => !r.success)?.exitCode || 1,
        }
      : {}),
  };
}

async function executeSingleRun(
  environment: KarmaEnvironment,
  config: KarmaConfigOptions,
  timeout: number,
): Promise<TestResult> {
  const errorHandler = createErrorHandler(environment);
  const startTime = Date.now();

  return new Promise<TestResult>((resolve) => {
    let hasCompleted = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let server: any = null;
    let serverProcess: any = null;

    const completeOnce = (result: TestResult) => {
      if (hasCompleted) {
        errorHandler.logWarning(
          `Attempted to complete test multiple times, ignoring subsequent calls`,
        );
        return;
      }
      hasCompleted = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      resolve(result);
    };

    const forceServerCleanup = () => {
      try {
        if (server) {
          logger.debug(`[${environment.toUpperCase()}] Stopping Karma server...`);
          server.stop();
          server = null;
        }

        if (serverProcess && !serverProcess.killed) {
          logger.debug(`[${environment.toUpperCase()}] Force terminating server process...`);
          serverProcess.kill(SIGNALS.SIGTERM);
          setTimeout(() => {
            if (!serverProcess.killed) {
              serverProcess.kill('SIGKILL');
            }
          }, TIMEOUTS.FORCE_KILL_DELAY);
        }
      } catch (cleanupError) {
        errorHandler.logWarning('Error during server cleanup', cleanupError);
      }
    };

    const createKarmaCallback = () => {
      return (exitCode: number) => {
        const duration = Date.now() - startTime;

        logger.verbose(
          `[${environment.toUpperCase()}] Karma callback called with exit code: ${exitCode}`,
        );

        if (hasCompleted) {
          errorHandler.logWarning('Callback already completed, ignoring');
          return;
        }

        forceServerCleanup();

        const testResult =
          exitCode === 0
            ? {
                environment,
                success: true,
                duration,
              }
            : {
                environment,
                success: false,
                exitCode,
                duration,
                error: `[${environment.toUpperCase()}] Tests failed with exit code ${exitCode}`,
                message: `[${environment.toUpperCase()}] Tests failed with exit code ${exitCode}`,
              };

        if (testResult.success) {
          logger.verbose(`\n[${environment.toUpperCase()}] Tests completed successfully`);
        } else {
          errorHandler.logError(testResult.error!);
        }

        completeOnce(testResult);
      };
    };

    const createTimeoutHandler = (): NodeJS.Timeout => {
      return setTimeout(() => {
        if (hasCompleted) return;

        errorHandler.logError(`Tests timed out after ${timeout}ms`);
        forceServerCleanup();

        const duration = Date.now() - startTime;
        const timeoutResult = {
          environment,
          success: false,
          exitCode: 1,
          duration,
          error: `${environment} tests timed out after ${timeout}ms`,
          message: `${environment} tests timed out after ${timeout}ms`,
        };
        completeOnce(timeoutResult);
      }, timeout);
    };

    const setupServerEvents = (server: any): void => {
      if (!server.on || typeof server.on !== 'function') return;

      server.on('browsers_ready', () => {
        logger.debug(`[${environment.toUpperCase()}] Browsers ready`);
      });

      server.on('run_complete', (_browsers: any, results: any) => {
        logger.debug(`[${environment.toUpperCase()}] Run complete. Success: ${results.success}`);
      });
    };

    const captureServerProcess = (): void => {
      try {
        const karmaModule = require('karma');
        if (karmaModule && server._boundServer) {
          serverProcess = server._boundServer;
        }
      } catch (e) {
        logger.debug(
          `[${environment.toUpperCase()}] Could not capture server process: ${e.message}`,
        );
      }
    };

    try {
      const karmaCallback = createKarmaCallback();
      server = createKarmaServer(config, karmaCallback);
      timeoutId = createTimeoutHandler();
      setupServerEvents(server);
      captureServerProcess();

      logger.debug(`[${environment.toUpperCase()}] Starting Karma server with PID: ${process.pid}`);
      server.start();
    } catch (error) {
      if (!hasCompleted) {
        if (timeoutId) clearTimeout(timeoutId);
        forceServerCleanup();

        const duration = Date.now() - startTime;
        errorHandler.logError('Failed to start Karma server', error);
        completeOnce(errorHandler.createErrorResult(error, duration));
      }
    }
  });
}

const createWatchModeCallback = (
  environment: KarmaEnvironment,
  startTime: number,
  server: any,
  resolve: (result: TestResult) => void,
): ((exitCode: number) => void) => {
  return (exitCode: number) => {
    const duration = Date.now() - startTime;
    const errorHandler = createErrorHandler(environment);

    try {
      if (server && server.stop) {
        logger.verbose(`[${environment.toUpperCase()}] Stopping Karma server...`);
        server.stop();
      }
    } catch (cleanupError) {
      errorHandler.logWarning('Error cleaning up Karma server');
    }

    const result: TestResult = {
      environment,
      success: exitCode === 0,
      exitCode,
      duration,
      ...(exitCode !== 0 && {
        error: `Tests failed with exit code ${exitCode}`,
        message: `Tests failed with exit code ${exitCode}`,
      }),
    };

    resolve(result);
  };
};

const setupSignalHandlers = (server: any): void => {
  const handleExit = (signal: string) => {
    logger.verbose(`\n${STATUS_ICONS.STOP} Received ${signal} - stopping watch mode...`);
    if (server && server.stop) {
      server.stop();
    }
    process.exit(0);
  };

  process.on(SIGNALS.SIGINT, () => handleExit(SIGNALS.SIGINT));
  process.on(SIGNALS.SIGTERM, () => handleExit(SIGNALS.SIGTERM));
};

async function loadKarmaConfig(
  projectRoot: string,
  karmaConfigPath: string,
  config?: any,
): Promise<KarmaConfigOptions> {
  try {
    const karma = loadKarmaModule();
    const absoluteConfigPath = path.join(projectRoot, karmaConfigPath);
    const resultConfig = await karma.config.parseConfig(absoluteConfigPath, config ?? {});

    return resultConfig;
  } catch (error) {
    throw new KarmaExecutorError(`Failed to load Karma configuration from ${karmaConfigPath}`, {
      projectRoot,
      karmaConfigPath,
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}

type ExecutionMode = 'watch' | 'single' | 'debug';

const getExecutionMode = (options: KarmaMultiEnvExecutorSchema): ExecutionMode => {
  if (options.watch) {
    return 'watch';
  }

  if (options.debug) {
    return 'debug';
  }

  return 'single';
};

const shouldStopExecution = (result: TestResult, isWatchMode: boolean): boolean =>
  !isWatchMode && !result.success;

const createExecutionResult = (
  _results: TestResult[],
  hasFailures: boolean,
  summary: TestSummary,
) => ({
  success: !hasFailures,
  result: summary,
});

const logExecutionStart = (plan: ExecutionPlan, options: KarmaMultiEnvExecutorSchema): void => {
  if (options.watch) return;

  logger.verbose(`Running tests in environments: ${plan.executionOrder.join(', ')}`);
  if (options.verbose) {
    logger.verbose(`Karma config: ${options.karmaConfig}`);
    logger.verbose(`Timeout: ${plan.timeout}ms`);
  }
};

const logEnvironmentStart = (environment: KarmaEnvironment): void =>
  logger.verbose(`\n[${environment.toUpperCase()}] Starting tests...`);

const logWatchModeStart = (environment: KarmaEnvironment): void =>
  logger.verbose(`[${environment.toUpperCase()}] Watch mode enabled - starting Karma server...`);

const logTestResults = (
  summary: TestSummary,
  plan: ExecutionPlan,
  options: KarmaMultiEnvExecutorSchema,
): void => {
  if (options.watch) {
    logger.verbose(
      `\n${STATUS_ICONS.WATCH} Watch mode active for: ${plan.executionOrder.join(', ')}`,
    );
    if (options.verbose) {
      logger.verbose(`Karma config: ${options.karmaConfig}`);
      logger.verbose('Watching file changes...');
    }
    logger.verbose('Press CTRL+C to stop watching...');
    return;
  }

  logger.verbose('\n' + '='.repeat(50));
  logger.verbose(`${STATUS_ICONS.DOCUMENTATION} TEST RESULTS SUMMARY`);
  logger.verbose('='.repeat(50));
  logger.verbose(
    `\n${STATUS_ICONS.SUCCESS} Environments tested: ${plan.executionOrder.join(', ')}`,
  );
  logger.verbose(`${STATUS_ICONS.CLOCK} Total duration: ${summary.totalDuration}ms`);

  summary.results.forEach((result) => {
    const statusIcon = result.success ? STATUS_ICONS.SUCCESS : STATUS_ICONS.FAILURE;
    const durationText = `${result.duration}ms`;
    const statusText = result.success ? 'PASS' : 'FAIL';

    logger.verbose(
      `\n${statusIcon} ${result.environment.toUpperCase()}: ${statusText} (${durationText})`,
    );
    if (!result.success && result.error) {
      logger.error(`   Error: ${result.error}`);
    }
  });

  if (summary.summary.failed === 0) {
    logger.verbose(`\n${STATUS_ICONS.CELEBRATION} SUCCESS: All tests passed`);
  } else {
    logger.error(`\n${STATUS_ICONS.ERROR} FAILURE: Some tests failed`);
  }
};

const setupWatchModeEvents = (environment: KarmaEnvironment, server: any): void => {
  if (!server.on || typeof server.on !== 'function') return;

  server.on('browsers_ready', () => {
    logger.verbose(
      `\n${STATUS_ICONS.WATCH} Watch mode active - browsers ready and watching for file changes...`,
    );
  });

  server.on('run_complete', (_browsers: any, results: any) => {
    const statusIcon = results.success ? STATUS_ICONS.SUCCESS : STATUS_ICONS.FAILURE;
    const statusText = results.success ? 'All tests passed' : 'Some tests failed';

    logger.verbose(
      `\n[${environment.toUpperCase()}] Test run completed. Success: ${results.success}`,
    );
    logger.verbose(`${statusIcon} ${statusText} in watch mode - continuing to watch...`);
    logger.verbose('Press CTRL+C to stop watching...');
  });

  server.on('file_list_modified', () => {
    logger.verbose(`\n${STATUS_ICONS.REFRESH} File changes detected, re-running tests...`);
  });
};

async function executeWatchMode(
  environment: KarmaEnvironment,
  config: KarmaConfigOptions,
  _projectRoot: string,
): Promise<TestResult> {
  const startTime = Date.now();

  return new Promise<TestResult>((resolve) => {
    const server = createKarmaServer(config, (exitCode: number) => {
      const callback = createWatchModeCallback(environment, startTime, server, resolve);
      callback(exitCode);
    });

    setupWatchModeEvents(environment, server);
    setupSignalHandlers(server);

    logger.verbose(`\n${STATUS_ICONS.START} Starting Karma server in watch mode...`);
    server.start();
  });
}

const handleWatchMode = async (
  options: KarmaMultiEnvExecutorSchema,
  _context: any,
  projectRoot: string,
): Promise<{ success: boolean; result?: TestSummary; error?: string }> => {
  try {
    const baseConfig = await loadKarmaConfig(projectRoot, options.karmaConfig);
    const plan = planTestExecution(options, ['client']);
    const envConfig = ENVIRONMENT_CONFIGS['client'];
    const shimPath = path.join(projectRoot, envConfig.shimPath);
    const config = createTestConfig(baseConfig, shimPath, options);

    logWatchModeStart('client');
    const result = await executeWatchMode('client', config, projectRoot);
    const summary = summarizeTestResults([result]);

    logTestResults(summary, plan, options);
    return { success: result.success, result: summary };
  } catch (error) {
    logger.error(`\n${STATUS_ICONS.ERROR} Test execution failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const setupDebugModeEvents = (environment: KarmaEnvironment, server: any): void => {
  if (!server.on || typeof server.on !== 'function') return;

  server.on('browsers_ready', () => {
    logger.verbose(
      `\n${STATUS_ICONS.DEBUG} Debug mode for the ${environment} environment is active. Click the "DEBUG" button in the opened browser window to start debugging.`,
    );
    logger.verbose('Press CTRL+C to stop debugging...');
  });
};

async function launchDebugMode(
  environment: KarmaEnvironment,
  config: KarmaConfigOptions,
  _projectRoot: string,
): Promise<TestResult> {
  return new Promise<TestResult>((resolve) => {
    const server = createKarmaServer(config, (exitCode: number) => {
      resolve({ success: exitCode === 0, environment, duration: 0 });
    });

    setupDebugModeEvents(environment, server);
    setupSignalHandlers(server);

    logger.verbose(`\n${STATUS_ICONS.START} Starting Karma server in debug mode...`);
    server.start();
  });
}

const handleDebugMode = async (
  options: KarmaMultiEnvExecutorSchema,
  _context: any,
  projectRoot: string,
  environments: KarmaEnvironment[],
): Promise<{ success: boolean; result?: TestSummary; error?: string }> => {
  try {
    const baseConfig = await loadKarmaConfig(projectRoot, options.karmaConfig);
    const envConfig = ENVIRONMENT_CONFIGS[environments[0]];
    const shimPath = path.join(projectRoot, envConfig.shimPath);
    const config = createTestConfig(baseConfig, shimPath, options);

    const result = await launchDebugMode(environments[0], config, projectRoot);

    return { success: result.success };
  } catch (error) {
    logger.error(`\n${STATUS_ICONS.ERROR} Test execution failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const handleSingleExecution = async (
  options: KarmaMultiEnvExecutorSchema,
  _context: any,
  projectRoot: string,
  environments: KarmaEnvironment[],
): Promise<{ success: boolean; result?: TestSummary; error?: string }> => {
  try {
    const baseConfig = await loadKarmaConfig(projectRoot, options.karmaConfig);
    const plan = planTestExecution(options, environments);
    const results: TestResult[] = [];

    logExecutionStart(plan, options);

    for (const environment of plan.executionOrder) {
      const envConfig = ENVIRONMENT_CONFIGS[environment];
      const shimPath = path.join(projectRoot, envConfig.shimPath);

      logEnvironmentStart(environment);

      try {
        const config = createTestConfig(baseConfig, shimPath, options);
        const result = await executeSingleRun(environment, config, plan.timeout);
        results.push(result);

        if (shouldStopExecution(result, false)) {
          logger.error(`\n[${environment.toUpperCase()}] Stopping execution after test failure`);
          break;
        }
      } catch (error) {
        const errorHandler = createErrorHandler(environment);
        results.push(errorHandler.createErrorResult(error, 0));
        logger.error(`\n[${environment.toUpperCase()}] Stopping execution after error`);
        break;
      }
    }

    const summary = summarizeTestResults(results);
    logTestResults(summary, plan, options);

    return createExecutionResult(results, summary.summary.failed > 0, summary);
  } catch (error) {
    logger.error(`\n${STATUS_ICONS.ERROR} Test execution failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const runExecutor: PromiseExecutor<KarmaMultiEnvExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const environments = options.environments || DEFAULT_ENVIRONMENTS;

  const executionMode = getExecutionMode(options);
  if (executionMode === 'watch') {
    return await handleWatchMode(options, context, projectRoot);
  }

  if (executionMode === 'debug') {
    if (options.environments && options.environments.length > 1) {
      logger.error(
        `Debug mode supports only a single environment, please specify one environment. Current environments: ${options.environments.join(', ')}`,
      );

      return Promise.resolve({ success: false });
    }

    return await handleDebugMode(options, context, projectRoot, environments);
  }

  return await handleSingleExecution(options, context, projectRoot, environments);
};

export default runExecutor;
