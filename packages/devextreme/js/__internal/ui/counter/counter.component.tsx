// eslint-disable-next-line max-classes-per-file
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import { Widget } from '@ts/core/r1/widget';
import withMethods from '@ts/ui/counter/counter.methods_hoc';
import { CounterMethodsProvider } from '@ts/ui/counter/counter.methods_provider';
import { CounterStepProvider } from '@ts/ui/counter/counter.methods_provider2';
import type { CounterProps } from '@ts/ui/counter/counter.types';
import { createRef } from 'inferno';

// Example 1: Using hoc pattern
class CounterComponent extends BaseInfernoComponent<CounterProps> {
  render(): JSX.Element {
    return (
      <div className="counter">
        <h3>Counter with HOC</h3>
        <div className="counter-display">
          <button onClick={this.props.decrement} className="btn btn-secondary">-</button>
          <span className="count">{this.props.count}</span>
          <button onClick={this.props.increment} className="btn btn-primary">+</button>
          <button onClick={this.props.reset} className="btn btn-warning">Reset</button>
        </div>
      </div>
    );
  }
}

// @ts-ignore
export const CounterComponentWithHOC = withMethods(CounterComponent);

// Example 2: Using render props pattern
export class CounterComponentWithProvider extends BaseInfernoComponent<CounterProps> {
  private readonly inputRef = createRef<HTMLInputElement>();

  constructor(props: CounterProps) {
    super(props);

    this.focus = this.focus.bind(this);
  }

  focus(): void {
    this.inputRef.current?.focus();
  }

  render(): JSX.Element {
    return (
      <CounterStepProvider>
        {({ step, incrementStep, resetStep }) => (
          <CounterMethodsProvider count={this.props.count} step={step}>
            {({
              count, increment, decrement, reset, setValue,
            }) => {
              const resetAll = (): void => {
                reset();
                resetStep();
              };

              return (
                <Widget
                  className="counter"
                >
                  <h3>Counter with Custom Hook (Render Props)</h3>
                  <div className="counter-display">
                    <button onClick={decrement} className="btn btn-secondary">-</button>
                    <input className="count" ref={this.inputRef} onClick={this.props.onClick} value={count}></input>
                    <button onClick={increment} className="btn btn-primary">+</button>
                    <button onClick={resetAll} className="btn btn-warning">Reset</button>
                    <button onClick={() => {
                      setValue(100);
                    }} className="btn btn-info">Set to 100</button>
                    <button onClick={this.focus} className="btn btn-info">focus input</button>
                    <button onClick={incrementStep} className="btn btn-info">increment step</button>
                  </div>
                </Widget>
              );
            }}
          </CounterMethodsProvider>
        )}
      </CounterStepProvider>
    );
  }
}
