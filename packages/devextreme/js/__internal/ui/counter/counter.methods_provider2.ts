import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import type { CounterProps, CounterStepState } from '@ts/ui/counter/counter.types';

// Render prop pattern
export class CounterStepProvider extends BaseInfernoComponent<
  Partial<CounterProps>,
  CounterStepState
> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      step: props.step ?? 1,
    };
  }

  incrementStep = (): void => {
    this.setState((prevState) => ({
      step: prevState.step + 1,
    }));
  };

  resetStep = (): void => {
    this.setState({
      step: this.props.step ?? 1,
    });
  };

  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      step: this.state?.step ?? 1,
      incrementStep: this.incrementStep,
      resetStep: this.resetStep,
    });
  }
}
