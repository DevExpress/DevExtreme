import { RefObject } from "inferno";
import { Fragment } from 'inferno';
import { InfernoEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import Guid from '@js/core/guid';
import { Widget, WidgetProps, WidgetDefaultProps } from '@ts/core/r1/widget';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { ValidationMessage } from '../wrappers/validation_message';

const getCssClasses = model => {
  const {
    classes,
    isValid,
    readOnly
  } = model;
  const classesMap = {
    'dx-state-readonly': !!readOnly,
    'dx-invalid': !isValid,
    [String(classes)]: !!classes
  };
  return combineClasses(classesMap);
};

export interface EditorProps extends WidgetProps {
  readOnly: boolean;

  name: string;

  value?: any;

  defaultValue?: any;

  valueChange?: (value: any) => void;

  // validation
  validationError: Record<string, unknown> | null;

  validationErrors: Record<string, unknown>[] | null;

  validationMessageMode: 'auto' | 'always';

  validationMessagePosition: 'top' | 'right' | 'bottom' | 'left';

  validationStatus: 'valid' | 'invalid' | 'pending';

  isValid: boolean;

  isDirty: boolean;

  inputAttr: Record<string, unknown>;

  // private
  onFocusIn?: (e: Event) => void;
}


export const defaultEditorProps: EditorProps = {
  ...WidgetDefaultProps,
  readOnly: false,
  name: '',
  validationError: null,
  validationErrors: null,
  validationMessageMode: 'auto',
  validationMessagePosition: 'bottom',
  validationStatus: 'valid',
  isValid: true,
  isDirty: false,
  inputAttr: {},
  defaultValue: null,
  valueChange: () => {}
};

import { convertRulesToOptions } from '../../../../core/options/utils';
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';

export class Editor extends InfernoWrapperComponent<EditorProps> {
  widgetRef!: RefObject<Widget>;

  validationMessageGuid = `dx-${new Guid()}`;

  rootElementRef!: RefObject<HTMLDivElement>;

  isValidationMessageVisible = false;

  __getterCache: any;

  constructor(props: EditorProps) {
    super(props);
    this.state = {};
    this.widgetRef = infernoCreateRef();
    this.rootElementRef = infernoCreateRef();
    this.__getterCache = {};
    this.state = {
      validationMessageGuid: `dx-${new Guid()}`,
      isValidationMessageVisible: false,
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
    this.updateValidationMessageVisibility = this.updateValidationMessageVisibility.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
  }
  createEffects() {
    return [new InfernoEffect(this.updateValidationMessageVisibility, [this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]), createReRenderEffect()];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]);
  }
  updateValidationMessageVisibility() {
    this.setState(__state_argument => ({
      isValidationMessageVisible: this.shouldShowValidationMessage
    }));
  }
  onFocusIn(event) {
    const {
      onFocusIn
    } = this.props;
    onFocusIn === null || onFocusIn === void 0 || onFocusIn(event);
  }
  get cssClasses() {
    return `${getCssClasses({
      ...this.props,
      value: this.props.value !== undefined ? this.props.value : this.state!.value
    })}`;
  }
  get shouldShowValidationMessage() {
    const {
      isValid,
      validationStatus
    } = this.props;
    const validationErrors = this.validationErrors ?? [];
    const isEditorValid = isValid && validationStatus !== 'invalid';
    return !isEditorValid && validationErrors.length > 0;
  }
  get aria() {
    const {
      isValid,
      readOnly
    } = this.props;
    const result: Record<string, string> = {
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false'
    };
    if (this.shouldShowValidationMessage) {
      result.describedBy = this.state!.validationMessageGuid as string;
    }
    return {...result, ...this.props.aria};
  }
  get validationErrors() {
    if (this.__getterCache['validationErrors'] !== undefined) {
      return this.__getterCache['validationErrors'];
    }
    return this.__getterCache['validationErrors'] = (() => {
      const {
        validationError,
        validationErrors
      } = this.props;
      let allValidationErrors = validationErrors && [...validationErrors];
      if (!allValidationErrors && validationError) {
        allValidationErrors = [{...validationError}];
      }
      return allValidationErrors;
    })();
  }
  get validationMessageTarget() {
    var _this$rootElementRef;
    return (_this$rootElementRef = this.rootElementRef) === null || _this$rootElementRef === void 0 ? void 0 : _this$rootElementRef.current;
  }
  get restAttributes() {
    const {
      accessKey, activeStateEnabled, aria, children, className, classes, defaultValue, disabled, focusStateEnabled, height, hint, hoverStateEnabled, inputAttr, isDirty, isValid, name, onClick, onFocusIn, onKeyDown, readOnly, rtlEnabled, tabIndex, validationError, validationErrors, validationMessageMode, validationMessagePosition, validationStatus, value, valueChange, visible, width,
      ...restProps
    } = this.props
    return restProps;
  }
  focus() {
    this.widgetRef.current!.focus();
  }
  blur() {
    this.widgetRef.current!.blur();
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props['validationError'] !== nextProps['validationError'] || this.props['validationErrors'] !== nextProps['validationErrors']) {
      this.__getterCache['validationErrors'] = undefined;
    }
  }
  render() {
    const value = this.props.value !== undefined ? this.props.value : this.state!.value

    return (
      <Widget
        ref={this.widgetRef as any}
        rootElementRef={this.rootElementRef as any}
        aria={this.aria}
        classes={this.cssClasses}
        activeStateEnabled={this.props.activeStateEnabled}
        focusStateEnabled={this.props.focusStateEnabled}
        hoverStateEnabled={this.props.hoverStateEnabled}
        accessKey={this.props.accessKey}
        className={this.props.className}
        rtlEnabled={this.props.rtlEnabled}
        hint={this.props.hint}
        disabled={this.props.disabled}
        height={this.props.height}
        width={this.props.width}
        onFocusIn={this.props.onFocusIn}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        tabIndex={this.props.tabIndex}
        visible={this.props.visible}
        {...this.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
      >
        <Fragment>
          {this.props.children}
          {this.isValidationMessageVisible && (
            <ValidationMessage
              validationErrors={this.props.validationErrors}
              mode={this.props.validationMessageMode}
              positionSide={this.props.validationMessagePosition}
              rtlEnabled={this.props.rtlEnabled}
              target={this.validationMessageTarget}
              boundary={this.validationMessageTarget}
              visualContainer={this.validationMessageTarget}
              contentId={this.validationMessageGuid}
            />
          )}
        </Fragment>
      </Widget>
    );
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

Editor.defaultProps = defaultEditorProps;
const __defaultOptionRules: any[] = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Editor.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(Editor.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps(convertRulesToOptions(__defaultOptionRules)))));
}
