export type KarmaEnvironment = 'client' | 'server' | 'hydration' | 'zone' | 'zoneless';

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
  zone: {
    shimPath: 'karma.zone.test.shim.js',
  },
  zoneless: {
    shimPath: 'karma.zoneless.test.shim.js',
  },
};

export const DEFAULT_ENVIRONMENTS: KarmaEnvironment[] = ['client', 'server', 'hydration'];
