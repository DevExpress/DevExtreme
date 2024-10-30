/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createReRenderEffect, InfernoEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import Guid from '@js/core/guid';
import { convertRulesToOptions } from '@js/core/options/utils';
import type { WidgetProps } from '@ts/core/r1/widget';
import { Widget, WidgetDefaultProps } from '@ts/core/r1/widget';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { RefObject } from 'inferno';
import { createRef as infernoCreateRef, Fragment } from 'inferno';

import { ValidationMessage } from '../wrappers/validation_message';

const getCssClasses = (model: EditorProps): string => {
  const {
    classes,
    isValid,
    readOnly,
  } = model;
  const classesMap = {
    'dx-state-readonly': !!readOnly,
    'dx-invalid': !isValid,
    [String(classes)]: !!classes,
  };
  return combineClasses(classesMap);
};

export interface EditorProps extends WidgetProps {
  readOnly: boolean;

  name?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueChange?: (value: any) => void;

  // validation
  validationError: Record<string, unknown> | null;

  validationErrors: Record<string, unknown>[] | null;

  validationMessageMode: 'auto' | 'always';

  validationMessagePosition: 'top' | 'right' | 'bottom' | 'left';

  validationStatus: 'valid' | 'invalid' | 'pending';

  isValid: boolean;

  isDirty?: boolean;

  inputAttr?: Record<string, unknown>;

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
  valueChange: () => {},
};

export class Editor extends InfernoWrapperComponent<EditorProps> {
  widgetRef!: RefObject<Widget>;

  rootElementRef!: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue,
    };
    this.updateValidationMessageVisibility = this.updateValidationMessageVisibility.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(
        this.updateValidationMessageVisibility,
        [
          this.props.isValid,
          this.props.validationStatus,
          this.props.validationError,
          this.props.validationErrors,
        ],
      ), createReRenderEffect()];
  }

  updateEffects(): void {
    this._effects?.[0]?.update([
      this.props.isValid,
      this.props.validationStatus,
      this.props.validationError,
      this.props.validationErrors,
    ]);
  }

  updateValidationMessageVisibility(): void {
    this.setState(() => ({
      isValidationMessageVisible: this.shouldShowValidationMessage,
    }));
  }

  onFocusIn(event: Event): void {
    const {
      onFocusIn,
    } = this.props;
    onFocusIn?.(event);
  }

  get cssClasses(): string {
    return `${getCssClasses({
      ...this.props,
      value: this.props.value !== undefined ? this.props.value : this.state!.value,
    })}`;
  }

  get shouldShowValidationMessage(): boolean {
    const {
      isValid,
      validationStatus,
    } = this.props;
    const validationErrors = this.validationErrors ?? [];
    const isEditorValid = isValid && validationStatus !== 'invalid';
    return !isEditorValid && validationErrors.length > 0;
  }

  get aria(): Record<string, string> {
    const {
      isValid,
      readOnly,
    } = this.props;
    const result: Record<string, string> = {
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false',
    };
    if (this.shouldShowValidationMessage) {
      result.describedBy = this.state!.validationMessageGuid as string;
    }
    return { ...result, ...this.props.aria };
  }

  get validationErrors(): Record<string, unknown>[] | null | undefined {
    if (this.__getterCache.validationErrors !== undefined) {
      return this.__getterCache.validationErrors;
    }
    // eslint-disable-next-line no-return-assign, @typescript-eslint/no-explicit-any
    return this.__getterCache.validationErrors = ((): any => {
      const {
        validationError,
        validationErrors,
      } = this.props;
      let allValidationErrors = validationErrors && [...validationErrors];
      if (!allValidationErrors && validationError) {
        allValidationErrors = [{ ...validationError }];
      }
      return allValidationErrors;
    })();
  }

  get validationMessageTarget(): HTMLDivElement | null | undefined {
    return this.rootElementRef?.current;
  }

  get restAttributes(): Record<string, unknown> {
    const {
      // eslint-disable-next-line max-len
      accessKey, activeStateEnabled, aria, children, className, classes, defaultValue, disabled, focusStateEnabled, height, hint, hoverStateEnabled, inputAttr, isDirty, isValid, name, onClick, onFocusIn, onKeyDown, readOnly, rtlEnabled, tabIndex, validationError, validationErrors, validationMessageMode, validationMessagePosition, validationStatus, value, valueChange, visible, width,
      ...restProps
    } = this.props;
    return restProps;
  }

  focus(): void {
    this.widgetRef.current!.focus();
  }

  blur(): void {
    this.widgetRef.current!.blur();
  }

  componentWillUpdate(nextProps: EditorProps): void {
    super.componentWillUpdate();
    if (
      this.props.validationError !== nextProps.validationError
      || this.props.validationErrors !== nextProps.validationErrors
    ) {
      this.__getterCache.validationErrors = undefined;
    }
  }

  render(): JSX.Element {
    return (
      <Widget
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={this.widgetRef as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        {...this.restAttributes}
      >
        <Fragment>
          {this.props.children}
          {this.state!.isValidationMessageVisible && (
            <ValidationMessage
              validationErrors={this.validationErrors}
              mode={this.props.validationMessageMode}
              positionSide={this.props.validationMessagePosition}
              rtlEnabled={this.props.rtlEnabled}
              target={this.validationMessageTarget}
              boundary={this.validationMessageTarget}
              visualContainer={this.validationMessageTarget}
              contentId={this.state!.validationMessageGuid as string}
            />
          )}
        </Fragment>
      </Widget>
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

Editor.defaultProps = defaultEditorProps;
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
const __defaultOptionRules: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaultOptions(rule: any): void {
  __defaultOptionRules.push(rule);
  Editor.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Editor.defaultProps),
      Object.getOwnPropertyDescriptors(
        __processTwoWayProps(convertRulesToOptions(__defaultOptionRules)),
      ),
    ),
  );
}
