export type KarmaEnvironment =
  | 'client'
  | 'server'
  | 'hydration'
  | 'zone'
  | 'zoneless'
  | 'server-zoneless'
  | 'hydration-zoneless';

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
  'server-zoneless': {
    shimPath: 'karma.server-zoneless.test.shim.js',
  },
  'hydration-zoneless': {
    shimPath: 'karma.hydration-zoneless.test.shim.js',
  },
};

export const DEFAULT_ENVIRONMENTS: KarmaEnvironment[] = ['client', 'server', 'hydration'];
