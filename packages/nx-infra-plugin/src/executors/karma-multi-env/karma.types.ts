export type KarmaEnvironment = 'client' | 'server' | 'hydration';

export interface EnvironmentConfig {
  shimPath: string;
}

export const ENVIRONMENT_CONFIGS: Record<KarmaEnvironment, EnvironmentConfig> = {
  client: {
    shimPath: 'karma.test.shim.js',
  },
  server: {
    shimPath: 'karma.server.test.shim.js',
  },
  hydration: {
    shimPath: 'karma.hydration.test.shim.js',
  },
};

export const DEFAULT_ENVIRONMENTS: KarmaEnvironment[] = ['client', 'server', 'hydration'];
