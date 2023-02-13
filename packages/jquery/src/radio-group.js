import { registerComponent } from '@devextreme/interim';
import { EditorWrapper } from './editor-wrapper';
import { RadioGroupCompatible as RadioButtonCompatibleInferno } from './generated/compatible-components/radio-group';

export class RadioGroupCompatible extends EditorWrapper {
  focus() {
    this.viewRef.focus();
  }

  get _propsInfo() {
    return {
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['value'],
      elements: [],
      templates: ['itemRender'],
      props: ['items', 'displayExpr', 'valueExpr', 'itemRender', 'value', 'defaultValue', 'valueChange',
        'name', 'errors',
        'active', 'disabled', 'visible', 'shortcutKey', 'tabIndex', 'hint', 'width', 'height',
        'focusStateEnabled', 'hoverStateEnabled', 'activeStateEnabled',
        'onFocus', 'onBlur'],
    };
  }

  get _viewComponent() {
    return RadioButtonCompatibleInferno;
  }
}

registerComponent('dxRadioGroup', RadioGroupCompatible);
