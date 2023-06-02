import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  TwoWay,
  Ref,
  Event,
  RefObject,
  Fragment,
  InternalState,
  Effect,
  ForwardRef,
} from '@devextreme-generator/declarations';
import Guid from '../../../../core/guid';
import { Widget, WidgetProps } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';
import { combineClasses } from '../../../utils/combine_classes';
import { ValidationMessage } from '../../overlays/validation_message';
import EditorWrapperComponent from '../../../component_wrapper/editors/editor';

const getCssClasses = (model: EditorPropsType): string => {
  const {
    readOnly, isValid, classes,
  } = model;

  const classesMap = {
    'dx-state-readonly': !!readOnly,
    'dx-invalid': !isValid,
    [`${classes}`]: !!classes,
  };
  return combineClasses(classesMap);
};

export const viewFunction = (viewModel: Editor): JSX.Element => {
  const {
    props: {
      activeStateEnabled, hoverStateEnabled, focusStateEnabled,
      className, accessKey, rtlEnabled, hint, tabIndex,
      validationMessageMode, validationMessagePosition,
      disabled, visible,
      width, height,
      onClick, onKeyDown,
      children,
    },
    widgetRef,
    aria, cssClasses: classes,
    validationErrors, isValidationMessageVisible, validationMessageGuid, validationMessageTarget,
    onFocusIn,
    restAttributes,
    rootElementRef,
  } = viewModel;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={widgetRef}
      rootElementRef={rootElementRef}
      aria={aria}
      classes={classes}
      activeStateEnabled={activeStateEnabled}
      focusStateEnabled={focusStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      accessKey={accessKey}
      className={className}
      rtlEnabled={rtlEnabled}
      hint={hint}
      disabled={disabled}
      height={height}
      width={width}
      onFocusIn={onFocusIn}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      visible={visible}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <Fragment>
        {children}

        {isValidationMessageVisible
        && (
        <ValidationMessage
          validationErrors={validationErrors}
          mode={validationMessageMode}
          positionSide={validationMessagePosition}
          rtlEnabled={rtlEnabled}
          target={validationMessageTarget}
          boundary={validationMessageTarget}
          visualContainer={validationMessageTarget}
          contentId={validationMessageGuid}
        />
        )}
      </Fragment>
    </Widget>
  );
};

@ComponentBindings()
export class EditorProps extends BaseWidgetProps {
  @OneWay() readOnly = false;

  @OneWay() name = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @TwoWay() value?: any = null;

  // validation
  @OneWay() validationError: Record<string, unknown> | null = null;

  @OneWay() validationErrors: Record<string, unknown>[] | null = null;

  @OneWay() validationMessageMode: 'auto' | 'always' = 'auto';

  @OneWay() validationMessagePosition: 'top' | 'right' | 'bottom' | 'left' = 'bottom';

  @OneWay() validationStatus: 'valid' | 'invalid' | 'pending' = 'valid';

  @OneWay() isValid = true;

  @OneWay() inputAttr = {};

  // private
  @Event() onFocusIn?: (e: Event) => void;
}

export type EditorPropsType = EditorProps
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<WidgetProps, 'aria' | 'classes' | 'children'>;

@Component({
  jQuery: {
    component: EditorWrapperComponent,
    register: true,
  },
  view: viewFunction,
})

export class Editor extends JSXComponent<EditorPropsType>() {
  @Ref() widgetRef!: RefObject<Widget>;

  @InternalState() validationMessageGuid = `dx-${new Guid()}`;

  @ForwardRef() rootElementRef!: RefObject<HTMLDivElement>;

  @InternalState() isValidationMessageVisible = false;

  @Effect() updateValidationMessageVisibility(): void {
    // NOTE: To improve performance.
    // State should not be updated after root element init
    // if no necessity to show validation message, but should otherwise
    this.isValidationMessageVisible = this.shouldShowValidationMessage;
  }

  @Method()
  focus(): void {
    this.widgetRef.current!.focus();
  }

  @Method()
  blur(): void {
    this.widgetRef.current!.blur();
  }

  onFocusIn(event: Event): void {
    const { onFocusIn } = this.props;

    // NOTE: pass to jQ wrapper
    onFocusIn?.(event);
  }

  get cssClasses(): string {
    return `${getCssClasses(this.props)}`;
  }

  get shouldShowValidationMessage(): boolean {
    const { isValid, validationStatus } = this.props;
    const validationErrors = this.validationErrors ?? [];
    const isEditorValid = isValid && validationStatus !== 'invalid';

    return !isEditorValid
        && validationErrors.length > 0;
  }

  get aria(): Record<string, string> {
    const { readOnly, isValid } = this.props;

    const result: Record<string, string> = {
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false',
    };

    if (this.shouldShowValidationMessage) {
      result.describedBy = this.validationMessageGuid;
    }

    return { ...result, ...this.props.aria };
  }

  get validationErrors(): Record<string, unknown>[] | null | undefined {
    const { validationErrors, validationError } = this.props;
    let allValidationErrors = validationErrors && [...validationErrors];

    if (!allValidationErrors && validationError) {
      allValidationErrors = [{ ...validationError }];
    }
    return allValidationErrors;
  }

  get validationMessageTarget(): HTMLDivElement | null | undefined {
    return this.rootElementRef?.current;
  }
}
