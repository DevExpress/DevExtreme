export interface KarmaMultiEnvExecutorSchema {
  karmaConfig: string;
  environments?: KarmaEnvironment[];
  watch?: boolean;
  debug?: boolean;
  timeout?: number;
}

export type KarmaEnvironment = 'client' | 'server' | 'hydration';
