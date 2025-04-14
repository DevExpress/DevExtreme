import type { Inferno } from 'inferno';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = Inferno.InfernoElement;
  }
}
