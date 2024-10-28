/**
* DevExtreme (esm/renovation/ui/editors/check_box/check_box.js)
* Version: 24.2.0
* Build date: Fri Oct 25 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "enableThreeStateBehavior", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
import { createVNode, createFragment, createComponentVNode, normalizeProps } from "inferno";
import { Fragment } from 'inferno';
import { InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import devices from '../../../../core/devices';
import { Editor, EditorProps } from '../common/editor';
import { combineClasses } from '../../../utils/combine_classes';
import { CheckBoxIcon } from './check_box_icon';
import { WidgetProps } from '../../common/widget';
const getCssClasses = model => {
  const {
    text,
    value
  } = model;
  const checked = value;
  const indeterminate = checked === null;
  const classesMap = {
    'dx-checkbox': true,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-checkbox-indeterminate': indeterminate
  };
  return combineClasses(classesMap);
};
export const viewFunction = viewModel => {
  const {
    aria,
    cssClasses: classes,
    editorRef,
    keyDown: onKeyDown,
    onWidgetClick: onClick,
    props: {
      accessKey,
      activeStateEnabled,
      className,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      iconSize,
      isValid,
      name,
      onFocusIn,
      readOnly,
      rtlEnabled,
      tabIndex,
      text,
      validationError,
      validationErrors,
      validationMessageMode,
      validationMessagePosition,
      validationStatus,
      value,
      visible,
      width
    },
    restAttributes
  } = viewModel;
  return normalizeProps(createComponentVNode(2, Editor, _extends({
    "aria": aria,
    "classes": classes,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "className": className,
    "disabled": disabled,
    "readOnly": readOnly,
    "hint": hint,
    "height": height,
    "width": width,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "validationError": validationError,
    "validationErrors": validationErrors,
    "validationMessageMode": validationMessageMode,
    "validationMessagePosition": validationMessagePosition,
    "validationStatus": validationStatus,
    "isValid": isValid,
    "onFocusIn": onFocusIn
  }, restAttributes, {
    children: createFragment([normalizeProps(createVNode(64, "input", null, null, 1, _extends({
      "type": "hidden",
      "value": `${value}`
    }, name && {
      name
    }))), createVNode(1, "div", "dx-checkbox-container", [createComponentVNode(2, CheckBoxIcon, {
      "size": iconSize,
      "isChecked": value === true
    }), text && createVNode(1, "span", "dx-checkbox-text", text, 0)], 0)], 4)
  }), null, editorRef));
};
export const CheckBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(EditorProps), Object.getOwnPropertyDescriptors({
  text: '',
  enableThreeStateBehavior: false,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  get focusStateEnabled() {
    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
  },
  defaultValue: false,
  valueChange: () => {}
})));
export const CheckBoxPropsType = {
  get text() {
    return CheckBoxProps.text;
  },
  get enableThreeStateBehavior() {
    return CheckBoxProps.enableThreeStateBehavior;
  },
  get activeStateEnabled() {
    return CheckBoxProps.activeStateEnabled;
  },
  get hoverStateEnabled() {
    return CheckBoxProps.hoverStateEnabled;
  },
  get focusStateEnabled() {
    return CheckBoxProps.focusStateEnabled;
  },
  get defaultValue() {
    return CheckBoxProps.defaultValue;
  },
  get valueChange() {
    return CheckBoxProps.valueChange;
  },
  get readOnly() {
    return CheckBoxProps.readOnly;
  },
  get name() {
    return CheckBoxProps.name;
  },
  get validationError() {
    return CheckBoxProps.validationError;
  },
  get validationErrors() {
    return CheckBoxProps.validationErrors;
  },
  get validationMessageMode() {
    return CheckBoxProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return CheckBoxProps.validationMessagePosition;
  },
  get validationStatus() {
    return CheckBoxProps.validationStatus;
  },
  get isValid() {
    return CheckBoxProps.isValid;
  },
  get isDirty() {
    return CheckBoxProps.isDirty;
  },
  get inputAttr() {
    return CheckBoxProps.inputAttr;
  },
  get className() {
    return CheckBoxProps.className;
  },
  get disabled() {
    return CheckBoxProps.disabled;
  },
  get tabIndex() {
    return CheckBoxProps.tabIndex;
  },
  get visible() {
    return CheckBoxProps.visible;
  },
  get aria() {
    return WidgetProps.aria;
  }
};
import { convertRulesToOptions } from '../../../../core/options/utils';
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
export class CheckBox extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.editorRef = infernoCreateRef();
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }
  createEffects() {
    return [createReRenderEffect()];
  }
  onWidgetClick(event) {
    const {
      enableThreeStateBehavior,
      readOnly,
      saveValueChangeEvent
    } = this.props;
    if (!readOnly) {
      saveValueChangeEvent === null || saveValueChangeEvent === void 0 || saveValueChangeEvent(event);
      if (enableThreeStateBehavior) {
        {
          let __newValue;
          this.setState(__state_argument => {
            __newValue = (this.props.value !== undefined ? this.props.value : __state_argument.value) === null || (!(this.props.value !== undefined ? this.props.value : __state_argument.value) ? null : false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      } else {
        {
          let __newValue;
          this.setState(__state_argument => {
            __newValue = !((this.props.value !== undefined ? this.props.value : __state_argument.value) ?? false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      }
    }
  }
  keyDown(e) {
    const {
      onKeyDown
    } = this.props;
    const {
      keyName,
      originalEvent,
      which
    } = e;
    const result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }
    if (keyName === 'space' || which === 'space') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }
    return undefined;
  }
  get cssClasses() {
    return getCssClasses(_extends({}, this.props, {
      value: this.props.value !== undefined ? this.props.value : this.state.value
    }));
  }
  get aria() {
    const checked = (this.props.value !== undefined ? this.props.value : this.state.value) === true;
    const indeterminate = (this.props.value !== undefined ? this.props.value : this.state.value) === null;
    const result = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`
    };
    return _extends({}, result, this.props.aria);
  }
  get restAttributes() {
    const _this$props$value = _extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);
    return restProps;
  }
  focus() {
    this.editorRef.current.focus();
  }
  blur() {
    this.editorRef.current.blur();
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      editorRef: this.editorRef,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      cssClasses: this.cssClasses,
      aria: this.aria,
      restAttributes: this.restAttributes
    });
  }
}
function __processTwoWayProps(defaultProps) {
  const twoWayProps = ['value'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some(p => p === propName) ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
CheckBox.defaultProps = CheckBoxPropsType;
const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  CheckBox.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps(convertRulesToOptions(__defaultOptionRules)))));
}
