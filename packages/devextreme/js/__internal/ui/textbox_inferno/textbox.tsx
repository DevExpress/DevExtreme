import registerComponent from '@js/core/component_registrator';
import { InfernoWidget } from '@ts/ui/counter/inferno_widget';
import { createTwoWayProps } from '@ts/ui/counter/two_way';
import type { TextBoxProps } from '@ts/ui/textbox_inferno/textbox.types';

import { InfernoTextBoxComponentWithHOC as TextBoxComponent } from './textbox.component';

class InfernoTextBox extends InfernoWidget<TextBoxProps> {
  protected _initComponent(): void {
    this.component = TextBoxComponent;
  }

  protected override getProps(): TextBoxProps {
    const {
      label = '',
      value = '',
      name = '',
      placeholder = '',
      maxLength = 0,
      onInput,
      onChange,
      onValueChange,
    } = this.option();

    const baseProps: TextBoxProps = {
      label,
      value,
      name,
      placeholder,
      maxLength,
      onInput,
      onChange,
      onValueChange,
    } as TextBoxProps;

    return createTwoWayProps<TextBoxProps, string>(
      this.option.bind(this),
      baseProps,
      [{ prop: 'value', change: 'onValueChange' }],
    ) as TextBoxProps;
  }

  reset(): void {
    this.viewRef?.reset?.();
  }
}

registerComponent('dxInfernoTextBox', InfernoTextBox);

export default InfernoTextBox;
