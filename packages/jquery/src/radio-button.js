/* eslint-disable no-underscore-dangle */
import { ComponentWrapper, registerComponent } from '@devextreme/ui-core';
import { RadioButton as RadioButtonInferno } from './generated/components/radio-button';

export default class RadioButton extends ComponentWrapper {
  _initializeComponent() {
    super._initializeComponent();
    this._propsInfo.templates.forEach((template) => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template], template);
    });
  }

  getProps() {
    return super.getProps();
  }

  get _propsInfo() {
    return {
      twoWay: [['value', 'defaultValue', 'onChange']],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['label'],
    };
  }

  get _viewComponent() {
    return RadioButtonInferno;
  }
}

registerComponent('dxRadioButton', RadioButton);
