import registerComponent from '@js/core/component_registrator';
import type { CounterProps } from '@ts/ui/counter/counter.types';
import { InfernoWidget } from '@ts/ui/counter/inferno_widget';
import type { ComponentType } from 'inferno';

import { CounterComponentWithProvider as CounterComponent } from './counter.component';
// import { CounterComponentWithHOC as CounterComponent } from './counter.component';

class Counter extends InfernoWidget<CounterProps> {
  protected override getComponent(): ComponentType<CounterProps> {
    return CounterComponent;
  }

  protected override getProps(): CounterProps {
    const { count = 0, onClick, step = 1 } = this.option();

    return {
      count,
      onClick,
      step,
    };
  }
}

registerComponent('dxCounter', Counter);

export default Counter;
