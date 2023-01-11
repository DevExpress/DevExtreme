import { registerComponent } from '@devextreme/interim';
import { ComponentWrapper } from './component-wrapper';
import { RadioGroupCompatible as RadioButtonCompatibleInferno } from './generated/compatible-components/radio-group';

export class RadioGroupCompatible extends ComponentWrapper {
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
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['value'],
      elements: [],
      templates: ['itemRender'],
      props: ['items', 'displayExpr', 'valueExpr', 'itemRender', 'value', 'defaultValue', 'valueChange'],
    };
  }

  get _viewComponent() {
    return RadioButtonCompatibleInferno;
  }
}

registerComponent('dxRadioGroup', RadioGroupCompatible);
