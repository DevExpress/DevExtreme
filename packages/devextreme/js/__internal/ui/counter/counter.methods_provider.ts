import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import type { CounterProps, CounterState } from '@ts/ui/counter/counter.types';

// Render prop pattern
export class CounterMethodsProvider extends BaseInfernoComponent<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      count: props.count ?? 0,
    };
  }

  increment = (): void => {
    this.setState((prevState) => ({
      count: prevState.count + this.props.step,
    }));
  };

  decrement = (): void => {
    this.setState((prevState) => ({
      count: prevState.count - this.props.step,
    }));
  };

  reset = (): void => {
    this.setState({
      count: this.props.count || 0,
    });
  };

  setValue = (value: number): void => {
    this.setState({
      count: value,
    });
  };

  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      count: this.state?.count ?? 0,
      increment: this.increment,
      decrement: this.decrement,
      reset: this.reset,
      setValue: this.setValue,
    });
  }
}
