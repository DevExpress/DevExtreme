import { registerComponent } from '@devextreme/interim';
import { ComponentWrapper } from './component-wrapper';
import { RadioButton as RadioButtonInferno } from './generated/components/radio-button';

export class RadioButton extends ComponentWrapper {
  get _propsInfo() {
    return {
      twoWay: [['checked', 'defaultChecked']],
      allowNull: [],
      elements: [],
      templates: ['radioTemplate', 'labelTemplate'],
      props: ['label', 'value', 'checked', 'defaultChecked', 'onSelected', 'onClick'],
    };
  }

  get _viewComponent() {
    return RadioButtonInferno;
  }
}

registerComponent('dxRadioButton', RadioButton);

// eslint-disable-next-line import/no-default-export
export default RadioButton;
