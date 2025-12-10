export interface KarmaConfigOptions {
  basePath?: string;
  frameworks?: string[];
  files?: Array<string | { pattern: string; watched?: boolean; included?: boolean }>;
  port?: number;
  logLevel?: string;
  colors?: boolean;
  autoWatch?: boolean;
  browsers?: string[];
  reporters?: string[];
  client?: {
    jasmine?: {
      random?: boolean;
    };
  };
  junitReporter?: {
    outputFile?: string;
  };
  plugins?: unknown[];
  webpack?: unknown;
  webpackMiddleware?: {
    stats?: string;
  };
  singleRun?: boolean;
  concurrency?: number;
  preprocessors?: Record<string, string[]>;
  coverageReporter?: {
    type?: string;
    dir?: string;
  };
}

export interface KarmaServer {
  on(event: string, callback: (exitCode: number) => void): void;
  start(): void;
  stop(): void;
}

export interface KarmaServerStatic {
  new (config: KarmaConfigOptions, callback?: (exitCode: number) => void): KarmaServer;
}

export interface KarmaModule {
  Server: KarmaServerStatic;
  config: {
    parseConfig(
      configPath: string | null,
      cliOptions: Record<string, unknown>,
    ): Promise<KarmaConfigOptions>;
  };
}

export class KarmaExecutorError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'KarmaExecutorError';
  }
}

export function loadKarmaModule(): KarmaModule {
  try {
    const karma = require('karma') as KarmaModule;
    return karma;
  } catch (error) {
    throw new KarmaExecutorError(
      `Failed to load Karma module: ${error instanceof Error ? error.message : String(error)}`,
      { originalError: error },
    );
  }
}

export function createKarmaServer(
  config: KarmaConfigOptions,
  callback?: (exitCode: number) => void,
): KarmaServer {
  const karma = loadKarmaModule();
  return new karma.Server(config, callback);
}
