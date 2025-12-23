import { KarmaEnvironment } from './karma.types';

export interface KarmaMultiEnvExecutorSchema {
  karmaConfig: string;
  environments?: KarmaEnvironment[];
  watch?: boolean;
  debug?: boolean;
  timeout?: number;
  verbose?: boolean;
}
