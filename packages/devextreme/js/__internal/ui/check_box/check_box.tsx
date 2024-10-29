/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import devices from '@js/core/devices';
import { convertRulesToOptions } from '@js/core/options/utils';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { RefObject } from 'inferno';
import { createRef as infernoCreateRef, Fragment } from 'inferno';

import { CheckBoxIcon } from './check_box_icon';
import type { EditorProps } from './editor_base/editor';
import { defaultEditorProps, Editor } from './editor_base/editor';

const getCssClasses = (model: CheckBoxProps): string => {
  const {
    text,
    value,
  } = model;
  const checked = value;
  const indeterminate = checked === null;
  const classesMap = {
    'dx-checkbox': true,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-checkbox-indeterminate': indeterminate,
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

  focusStateEnabled: boolean;

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
  get focusStateEnabled(): boolean {
    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
  },
  defaultValue: false,
  valueChange: (): void => {},
};
export class CheckBox extends InfernoWrapperComponent<CheckBoxProps> {
  editorRef!: RefObject<Editor>;

  constructor(props: CheckBoxProps) {
    super(props);
    this.editorRef = infernoCreateRef();
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue,
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  onWidgetClick(event: Event): void {
    const {
      enableThreeStateBehavior,
      readOnly,
      saveValueChangeEvent,
    } = this.props;
    if (!readOnly) {
      saveValueChangeEvent?.(event);
      if (enableThreeStateBehavior) {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/naming-convention
        let __newValue;
        this.setState((__state_argument) => {
          // eslint-disable-next-line max-len
          __newValue = (this.props.value !== undefined ? this.props.value : __state_argument.value) === null || (!(this.props.value !== undefined ? this.props.value : __state_argument.value) ? null : false);
          return {
            value: __newValue,
          };
        });
        this.props.valueChange?.(__newValue);
      } else {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/naming-convention
        let __newValue;
        this.setState((__state_argument) => {
          // eslint-disable-next-line max-len
          __newValue = !((this.props.value !== undefined ? this.props.value : __state_argument.value) ?? false);
          return {
            value: __newValue,
          };
        });
        this.props.valueChange?.(__newValue);
      }
    }
  }

  keyDown(e: {
    originalEvent: Event & { cancel: boolean };
    keyName: string;
    which: string;
  }): Event | undefined {
    const {
      onKeyDown,
    } = this.props;
    const {
      keyName,
      originalEvent,
      which,
    } = e;
    const result = onKeyDown?.(e);
    if (result?.cancel) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    }
    if (keyName === 'space' || which === 'space') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }
    return undefined;
  }

  get cssClasses(): string {
    return getCssClasses({
      ...this.props,
      // @ts-expect-error
      value: this.props.value !== undefined ? this.props.value : this.state!.value,
    });
  }

  get aria(): Record<string, string> {
    const checked = (
      this.props.value !== undefined ? this.props.value : this.state!.value
    ) === true;
    const indeterminate = (
      this.props.value !== undefined ? this.props.value : this.state!.value
    ) === null;
    const result = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
    };
    return { ...result, ...this.props.aria };
  }

  get restAttributes(): Record<string, unknown> {
    const {
      // eslint-disable-next-line max-len
      accessKey, activeStateEnabled, aria, className, classes, defaultValue, disabled, enableThreeStateBehavior, focusStateEnabled, height, hint, hoverStateEnabled, iconSize, inputAttr, isDirty, isValid, name, onClick, onFocusIn, onKeyDown, readOnly, rtlEnabled, saveValueChangeEvent, tabIndex, text, validationError, validationErrors, validationMessageMode, validationMessagePosition, validationStatus, value, valueChange, visible, width,
      ...restProps
    } = this.props;
    return restProps;
  }

  focus(): void {
    this.editorRef.current!.focus();
  }

  blur(): void {
    this.editorRef.current!.blur();
  }

  render(): JSX.Element {
    const value = this.props.value !== undefined ? this.props.value : this.state!.value;

    return (
      <Editor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={this.editorRef as any}
        aria={this.aria}
        classes={this.cssClasses}
        onClick={this.onWidgetClick}
        onKeyDown={this.keyDown}
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
        {...this.restAttributes}
      >
        <Fragment>
          <input type="hidden" value={`${value}`} {...this.props.name && { name: this.props.name }} />
          <div className="dx-checkbox-container">
            {/* @ts-expect-error */}
            <CheckBoxIcon size={this.props.iconSize} isChecked={value === true}/>
            {this.props.text && (<span className="dx-checkbox-text">{this.props.text}</span>)}
          </div>
        </Fragment>
      </Editor>
    );
  }
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function __processTwoWayProps(defaultProps): Record<string, unknown> {
  const twoWayProps = ['value'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some((p) => p === propName) ? `default${propName.charAt(0).toUpperCase()}${propName.slice(1)}` : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
CheckBox.defaultProps = defaultCheckBoxProps;
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
const __defaultOptionRules: any[] = [];
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  CheckBox.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(CheckBox.defaultProps),
      Object.getOwnPropertyDescriptors(
        __processTwoWayProps(convertRulesToOptions(__defaultOptionRules)),
      ),
    ),
  );
}
