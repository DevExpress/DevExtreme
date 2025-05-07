import registerComponent from '@js/core/component_registrator';

import { defaultOptions, Editor as EditorComponent } from './editor';
import EditorWrapperComponent from './wrapper';

export default class Editor extends EditorWrapperComponent {
  getProps(): Record<string, unknown> {
    const props = super.getProps();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown as any);
    return props;
  }

  focus(): unknown {
    // @ts-expect-error
    // eslint-disable-next-line prefer-rest-params
    return this.viewRef?.focus(...arguments);
  }

  blur(): unknown {
    // @ts-expect-error
    // eslint-disable-next-line prefer-rest-params
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
      allowNull: ['validationError', 'validationErrors'],
      elements: [],
      templates: [],
      props: ['readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'defaultValue', 'valueChange', 'className', 'accessKey', 'activeStateEnabled', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'classes', 'value'],
    };
  }

  // @ts-expect-error
  get _viewComponent(): unknown {
    return EditorComponent;
  }
}
registerComponent('dxEditor', Editor);
Editor.defaultOptions = defaultOptions;
