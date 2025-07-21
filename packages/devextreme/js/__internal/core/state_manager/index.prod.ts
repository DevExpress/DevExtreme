export const setupStateManager = (): void => {};

export type {
  ReadonlySignal,
  Signal,
} from './reactive-primitives/index.prod';
export {
  batch,
  computed,
  effect,
  signal,
  // eslint-disable-next-line spellcheck/spell-checker
  untracked,
} from './reactive-primitives/index.prod';
