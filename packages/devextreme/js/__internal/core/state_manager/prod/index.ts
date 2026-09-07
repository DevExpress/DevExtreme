export const setupStateManager = (): void => {};

export type {
  ReadonlySignal,
  Signal,
} from './reactive_primitives/index';
export {
  batch,
  computed,
  effect,
  signal,
  track,
  // eslint-disable-next-line spellcheck/spell-checker
  untracked,
} from './reactive_primitives/index';
