import registerComponent from '@js/core/component_registrator';

import { CheckBox as CheckBoxComponent, defaultOptions } from './check_box';
import BaseComponent from './wrapper';

export default class CheckBox extends BaseComponent {
  getProps(): Record<string, unknown> {
    const props = super.getProps();
    // @ts-expect-error
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus(): unknown {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
    return this.viewRef?.focus(...arguments);
  }

  blur(): unknown {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
    return this.viewRef?.blur(...arguments);
  }

  // @ts-expect-error
  _getActionConfigs(): Record<string, unknown> {
    return {
      onFocusIn: {},
      onClick: {},
    };
  }

  // @ts-expect-error
  get _propsInfo(): Record<string, unknown> {
    return {
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['defaultValue', 'validationError', 'validationErrors', 'value'],
      elements: [],
      templates: [],
      props: ['text', 'iconSize', 'enableThreeStateBehavior', 'activeStateEnabled', 'hoverStateEnabled', 'focusStateEnabled', 'saveValueChangeEvent', 'defaultValue', 'valueChange', 'readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'className', 'accessKey', 'disabled', 'height', 'hint', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'value'],
    };
  }

  // @ts-expect-error
  get _viewComponent(): unknown {
    return CheckBoxComponent;
  }
}
registerComponent('dxCheckBox', CheckBox);
CheckBox.defaultOptions = defaultOptions;
