import registerComponent from '../../../../core/component_registrator';
import BaseComponent from '../../../component_wrapper/editors/check_box';
import { CheckBox as CheckBoxComponent, defaultOptions } from './check_box';
export default class CheckBox extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  focus() {
    var _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }
  blur() {
    var _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur(...arguments);
  }
  _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['defaultValue', 'validationError', 'validationErrors', 'value'],
      elements: [],
      templates: [],
      props: ['text', 'iconSize', 'enableThreeStateBehavior', 'activeStateEnabled', 'hoverStateEnabled', 'focusStateEnabled', 'saveValueChangeEvent', 'defaultValue', 'valueChange', 'readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'className', 'accessKey', 'disabled', 'height', 'hint', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'value']
    };
  }
  get _viewComponent() {
    return CheckBoxComponent;
  }
}
registerComponent('dxCheckBox', CheckBox);
CheckBox.defaultOptions = defaultOptions;
