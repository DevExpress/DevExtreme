/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '@ts/core/di';

export * from './options';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, TDeps extends readonly any[] = any[]> = new(...deps: TDeps) => T;

export interface WithDIContext {
  diContext: DIContext;
}
