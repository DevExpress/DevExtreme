import { registerComponent } from '@devextreme/interim';
import { ComponentWrapper } from './component-wrapper';
import { RadioButton as RadioButtonInferno } from './generated/components/radio-button';

export class RadioButton extends ComponentWrapper {
  _initializeComponent() {
    super._initializeComponent();
    this._propsInfo.templates.forEach((template) => {
      this._componentTemplates[template] = this._createTemplateComponent(
        this._props[template],
        template,
      );
    });
  }

  getProps() {
    return super.getProps();
  }

  get _propsInfo() {
    return {
      twoWay: [['checked', 'defaultChecked', 'onChange']],
      allowNull: [],
      elements: [],
      templates: ['radioTemplate', 'labelTemplate'],
      props: ['label', 'value', 'checked', 'defaultChecked', 'onChange'],
    };
  }

  get _viewComponent() {
    return RadioButtonInferno;
  }
}

registerComponent('dxRadioButton', RadioButton);

export default RadioButton;
