import registerComponent from '@js/core/component_registrator';
import { InfernoWidget } from '@ts/ui/counter/inferno_widget';
import type { ComponentType } from 'inferno';

import { CheckboxProps } from './types';
import { CheckboxComponentWithProvider } from './component';

class Checkbox extends InfernoWidget<CheckboxProps> {
  protected override getComponent(): ComponentType<CheckboxProps> {
    return CheckboxComponentWithProvider;
  }

  protected override getProps(): CheckboxProps {
    const { disabled, value, text, onClick } = this.option();

    return {
      disabled,
      value,
      text,
      onClick,
    };
  }
}

registerComponent('dxCheckbox', Checkbox);

export default Checkbox;
