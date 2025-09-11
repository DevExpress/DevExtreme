import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import type { CounterProps, CounterState } from '@ts/ui/counter/counter.types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
function withMethods(WrappedComponent: BaseInfernoComponent<CounterProps>) {
  return class WithMethodsComponent extends BaseInfernoComponent<CounterProps, CounterState> {
    constructor(props) {
      super(props);

      this.state = {
        count: this.props.count ?? 0,
      };
    }

    increment = (): void => {
      this.setState({ count: (this.state?.count ?? 0) + (this.props.step ?? 1) });
    };

    decrement = (): void => {
      this.setState({ count: (this.state?.count ?? 0) - (this.props.step ?? 1) });
    };

    reset = (): void => {
      this.setState({ count: this.props.count ?? 0 });
    };

    render(): JSX.Element {
      return (
      // @ts-ignore
            <WrappedComponent
              {...this.props}
              count={this.state?.count ?? 0}
              increment={this.increment}
              decrement={this.decrement}
              reset={this.reset}
            />
      );
    }
  };
}

export default withMethods;
