import registerComponent from '@js/core/component_registrator';
import type { CounterProps } from '@ts/ui/counter/counter.types';
import { InfernoWidget } from '@ts/ui/counter/inferno_widget';

import { CounterComponentWithProvider as CounterComponent } from './counter.component';
// import { CounterComponentWithHOC as CounterComponent } from './counter.component';

class Counter extends InfernoWidget<CounterProps> {
  protected _initComponent(): void {
    this.component = CounterComponent;
  }

  protected override getProps(): CounterProps {
    const { count = 0, onClick } = this.option();

    return {
      count,
      onClick,
      step: 1,
    };
  }
}

registerComponent('dxCounter', Counter);

export default Counter;
