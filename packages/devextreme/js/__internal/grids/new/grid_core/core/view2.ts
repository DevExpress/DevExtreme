import { state, type Subscribable } from '@ts/core/reactive';
import { Component } from 'inferno';

export abstract class View<TState> extends Component<{}, TState> {
  protected abstract getObservables(): { [K in keyof TState]?: Subscribable<TState[K]> };

  constructor() {
    super();

    Object.entries(this.getObservables()).forEach(([k, v]) => {
      // @ts-expect-error
      v.subscribe((v) => {
        // @ts-expect-error
        this.setState({
          [k]: v,
        });
      });
    });
  }
}

interface State {
  pageSize: number;
}

export class TestView extends View<State> {
  protected getObservables() {
    return {
      pageSize: state(0),
    };
  }
}
