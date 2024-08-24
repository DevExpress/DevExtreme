import type { Gettable, Updatable } from '@ts/core/reactive';

type State = Record<string, unknown>;

interface Saver {
  loadState: (key: string) => Promise<State>;

  saveState: (key: string, value: State) => Promise<void>;
}

// TODO asd

interface Mapping<T> {
  obs: Updatable<T> & Gettable<T>;
  key: string;
}

export class StateStoringController {
  public static dependencies = [];

  private readonly mappings: Set<Mapping<unknown>> = new Set();

  public addMapping(mapping: Mapping<unknown>): void {
    this.mappings.add(mapping);
  }
}
