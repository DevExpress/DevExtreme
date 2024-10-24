/* eslint-disable prefer-rest-params */
/* eslint-disable no-void */
/* eslint-disable no-cond-assign */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import registerComponent from '@js/core/component_registrator';

import { Button as ButtonComponent, defaultOptions } from './button';
import BaseComponent from './wrapper';

export default class Button extends BaseComponent {
  getProps() {
    const props = super.getProps();
    // @ts-expect-error
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus() {
    let _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }

  activate() {
    let _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.activate(...arguments);
  }

  deactivate() {
    let _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.deactivate(...arguments);
  }

  _getActionConfigs() {
    return {
      onClick: {
        excludeValidators: ['readOnly'],
      },
      onSubmit: {},
    };
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: ['onSubmit'],
      templates: ['template', 'iconTemplate'],
      props: ['activeStateEnabled', 'hoverStateEnabled', 'icon', 'iconPosition', 'onClick', 'onSubmit', 'pressed', 'stylingMode', 'template', 'iconTemplate', 'text', 'type', 'useInkRipple', 'useSubmitBehavior', 'templateData', 'className', 'accessKey', 'disabled', 'focusStateEnabled', 'height', 'hint', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width'],
    };
  }

  // @ts-expect-error
  get _viewComponent() {
    return ButtonComponent;
  }
}
registerComponent('dxButton', Button);
Button.defaultOptions = defaultOptions;
