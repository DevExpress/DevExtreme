import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  Effect,
  Event,
  ForwardRef,
  RefObject,
  Fragment,
} from '@devextreme-generator/declarations';
import Guid from '../../../../core/guid';
import { Widget, WidgetProps } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';
import { combineClasses } from '../../../utils/combine_classes';
import { EffectReturn } from '../../../utils/effect_return.d';
import { ValidationMessage } from '../../overlays/validation_message';

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
      validationMessageMode,
      disabled, visible,
      width, height,
      onClick, onKeyDown,
    },
    widgetRef, target,
    aria, cssClasses: classes,
    validationErrors, targetCurrent,
    onFocusIn,
    restAttributes,
  } = viewModel;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={widgetRef}
      rootElementRef={target}
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
        {viewModel.props.children}

        {viewModel.showValidationMessage
        && (
        <ValidationMessage
          validationErrors={validationErrors}
          mode={validationMessageMode}
          positionRequest="below"
          rtlEnabled={rtlEnabled}
          target={targetCurrent}
          boundary={targetCurrent}
          container={targetCurrent}
        />
        )}
      </Fragment>
    </Widget>
  );
};

@ComponentBindings()
export class EditorProps extends BaseWidgetProps {
  @OneWay() readOnly = false;

  // validation
  @OneWay() validationError: Record<string, unknown> | null = null;

  @OneWay() validationErrors: Record<string, unknown>[] | null = null;

  @OneWay() validationMessageMode: 'auto' | 'always' = 'auto';

  @OneWay() validationStatus: 'valid' | 'invalid' | 'pending' = 'valid';

  @OneWay() isValid = true;

  // private
  @Event() onFocusIn?: (e: Event) => void;
}

export type EditorPropsType = EditorProps
& Pick<WidgetProps, 'aria' | 'classes' | 'children'>;

@Component({
  view: viewFunction,
})

export class Editor extends JSXComponent<EditorPropsType>() {
  @Ref() widgetRef!: RefObject<Widget>;

  @ForwardRef() target!: RefObject<HTMLDivElement>;

  showValidationMessage = false;

  @Effect()
  updateValidationMessageVisibility(): EffectReturn {
    this.showValidationMessage = this.shouldShowValidationMessage;

    return undefined;
  }

  @Method()
  focus(): void {
    this.widgetRef.current!.focus();
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
    return !isValid
        && validationStatus === 'invalid'
        && validationErrors.length > 0;
  }

  get aria(): Record<string, string> {
    const { readOnly, isValid } = this.props;

    const result: Record<string, string> = {
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false',
    };

    if (this.shouldShowValidationMessage) {
      // eslint-disable-next-line spellcheck/spell-checker
      result.describedby = `dx-${new Guid()}`;
    }

    return { ...result, ...this.props.aria };
  }

  get validationErrors(): Record<string, unknown>[] | null | undefined {
    const { validationErrors, validationError } = this.props;
    let allValidationErrors = validationErrors;
    if (!allValidationErrors && validationError) {
      allValidationErrors = [validationError];
    }
    return allValidationErrors;
  }

  get targetCurrent(): HTMLDivElement | null | undefined {
    return this.target?.current;
  }
}
