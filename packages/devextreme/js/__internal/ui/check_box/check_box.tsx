import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "enableThreeStateBehavior", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
import { createVNode, createFragment, createComponentVNode, normalizeProps, RefObject } from "inferno";
import { Fragment } from 'inferno';
import { InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import devices from '@js/core/devices';
import { defaultEditorProps, Editor, EditorProps } from './editor_base/editor';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { CheckBoxIcon } from './check_box_icon';
import { WidgetProps } from '@ts/core/r1/widget';
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

export interface CheckBoxProps extends EditorProps {
  text: string;

  iconSize?: number | string;

  enableThreeStateBehavior: boolean;

  // overrides default value
  activeStateEnabled: boolean;

  hoverStateEnabled: boolean;

  focusStateEnabled: boolean

  value: boolean | null;

  // private
  saveValueChangeEvent?: (event: Event) => void;
}

export const defaultCheckBoxProps = {
  ...defaultEditorProps,
  text: '',
  enableThreeStateBehavior: false,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  get focusStateEnabled() {
    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
  },
  defaultValue: false,
  valueChange: () => {}
};

import { convertRulesToOptions } from '@js/core/options/utils';
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
export class CheckBox extends InfernoWrapperComponent<CheckBoxProps> {
  editorRef!: RefObject<Editor>;
  
  constructor(props: CheckBoxProps) {
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
    const value = this.props.value !== undefined ? this.props.value : this.state.value;
    
    return (
      <Editor // eslint-disable-line jsx-a11y/no-access-key
        ref={this.editorRef}
        aria={this.props.aria}
        classes={this.props.classes}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        accessKey={this.props.accessKey}
        activeStateEnabled={this.props.activeStateEnabled}
        focusStateEnabled={this.props.focusStateEnabled}
        hoverStateEnabled={this.props.hoverStateEnabled}
        className={this.props.className}
        disabled={this.props.disabled}
        readOnly={this.props.readOnly}
        hint={this.props.hint}
        height={this.props.height}
        width={this.props.width}
        rtlEnabled={this.props.rtlEnabled}
        tabIndex={this.props.tabIndex}
        visible={this.props.visible}
        validationError={this.props.validationError}
        validationErrors={this.props.validationErrors}
        validationMessageMode={this.props.validationMessageMode}
        validationMessagePosition={this.props.validationMessagePosition}
        validationStatus={this.props.validationStatus}
        isValid={this.props.isValid}
        onFocusIn={this.props.onFocusIn}
        {...this.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
      >
        <Fragment>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <input type="hidden" value={`${value}`} {...this.props.name && { name: this.props.name }} />
          <div className="dx-checkbox-container">
            <CheckBoxIcon size={this.props.iconSize}/>
            {this.props.text && (<span className="dx-checkbox-text">{this.props.text}</span>)}
          </div>
        </Fragment>
      </Editor>
    )

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
CheckBox.defaultProps = defaultCheckBoxProps;
const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  CheckBox.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps(convertRulesToOptions(__defaultOptionRules)))));
}
