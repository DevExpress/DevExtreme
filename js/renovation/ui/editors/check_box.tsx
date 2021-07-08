import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  TwoWay,
  Ref,
  Effect,
  Event,
  ForwardRef,
  RefObject,
} from '@devextreme-generator/declarations';
import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';
import Guid from '../../../core/guid';
import { Widget } from '../common/widget';
import BaseComponent from '../../component_wrapper/editors/check_box';
import { normalizeStyleProp } from '../../../core/utils/style';
import { BaseWidgetProps } from '../common/base_props';
import { combineClasses } from '../../utils/combine_classes';
import { EffectReturn } from '../../utils/effect_return.d';
import { ValidationMessage } from '../overlays/validation_message';

const ICON_FONT_SIZE_RATIO = 16 / 22;

const getCssClasses = (model: CheckBoxProps): string => {
  const {
    text, readOnly, isValid, value,
  } = model;

  const checked = value;
  const indeterminate = checked === null;

  const classesMap = {
    'dx-checkbox': true,
    'dx-state-readonly': !!readOnly,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-invalid': !isValid,
    'dx-checkbox-indeterminate': indeterminate,
  };
  return combineClasses(classesMap);
};

export const viewFunction = (viewModel: CheckBox): JSX.Element => {
  const { text, name } = viewModel.props;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      rootElementRef={viewModel.target}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      className={viewModel.props.className}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onFocusIn={viewModel.onFocusIn}
      aria={viewModel.aria}
      onClick={viewModel.onWidgetClick}
      onKeyDown={viewModel.onWidgetKeyDown}
      rtlEnabled={viewModel.props.rtlEnabled}
      tabIndex={viewModel.props.tabIndex}
      visible={viewModel.props.visible}
      width={viewModel.props.width}
      {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input ref={viewModel.inputRef} type="hidden" value={`${viewModel.props.value}`} {...name && { name }} />
      <div className="dx-checkbox-container">
        <span className="dx-checkbox-icon" ref={viewModel.iconRef} style={viewModel.iconStyles} />
        {text && (<span className="dx-checkbox-text">{text}</span>)}
      </div>
      {viewModel.showValidationMessage
                && (
                <ValidationMessage
                  validationErrors={viewModel.validationErrors}
                  mode={viewModel.props.validationMessageMode}
                  positionRequest="below"
                  rtlEnabled={viewModel.props.rtlEnabled}
                  target={viewModel.targetCurrent}
                  boundary={viewModel.targetCurrent}
                  container={viewModel.targetCurrent}
                />
                )}
    </Widget>
  );
};

@ComponentBindings()
export class CheckBoxProps extends BaseWidgetProps {
  @OneWay() activeStateEnabled = true;

  @OneWay() hoverStateEnabled = true;

  @OneWay() validationError: Record<string, unknown> | null = null;

  @OneWay() validationErrors: Record<string, unknown>[] | null = null;

  @OneWay() text = '';

  @OneWay() validationMessageMode: 'auto' | 'always' = 'auto';

  @OneWay() validationStatus: 'valid' | 'invalid' | 'pending' = 'valid';

  @OneWay() name = '';

  @OneWay() readOnly = false;

  @OneWay() iconHeight?: number | string;

  @OneWay() iconWidth?: number | string;

  @OneWay() isValid = true;

  @TwoWay() value: boolean | null = false;

  @Event() onFocusIn?: (e: Event) => void;

  @OneWay() saveValueChangeEvent?: (event: Event) => void;
}

export const defaultOptionRules = createDefaultOptionRules<CheckBoxProps>([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: { focusStateEnabled: true },
}]);

@Component({
  defaultOptionRules,
  jQuery: {
    component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class CheckBox extends JSXComponent(CheckBoxProps) {
  @Ref() iconRef!: RefObject<HTMLDivElement>;

  @Ref() inputRef!: RefObject<HTMLInputElement>;

  @Ref() widgetRef!: RefObject<Widget>;

  @ForwardRef() target!: RefObject<HTMLDivElement>;

  showValidationMessage = false;

  @Effect()
  updateValidationMessageVisibility(): EffectReturn {
    this.showValidationMessage = this.shouldShowValidationMessage;

    return undefined;
  }

  @Effect()
  updateIconFontSize(): EffectReturn {
    const iconElement = this.iconRef?.current;
    const { iconWidth, iconHeight } = this.props;

    if (iconElement !== null && iconElement !== undefined) {
      const width = typeof iconWidth === 'number' ? iconWidth : iconElement.offsetWidth;
      const height = typeof iconHeight === 'number' ? iconHeight : iconElement.offsetHeight;

      const calculatedFontSize = `${Math.ceil(Math.min(width, height) * ICON_FONT_SIZE_RATIO)}px`;

      iconElement.style.fontSize = calculatedFontSize;
    }

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

  onWidgetClick(event: Event): void {
    const { readOnly, saveValueChangeEvent } = this.props;
    const value = this.props.value ?? false;

    if (!readOnly) {
      saveValueChangeEvent?.(event);
      this.props.value = !value;
    }
  }

  onWidgetKeyDown(e: {
    originalEvent: Event & { cancel: boolean };
    keyName: string;
    which: string;
  }): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = e;

    const result: Event & { cancel: boolean } = onKeyDown?.(e);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space') {
      (originalEvent as Event).preventDefault();
      this.onWidgetClick(originalEvent as Event);
    }

    return undefined;
  }

  get iconStyles(): { [key: string]: string | number } {
    const { iconWidth, iconHeight } = this.props;
    const width = normalizeStyleProp('width', iconWidth);
    const height = normalizeStyleProp('height', iconHeight);

    return { height, width };
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
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
    const checked = this.props.value === true;
    const indeterminate = this.props.value === null;

    const result: Record<string, string> = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false',
    };

    if (this.shouldShowValidationMessage) {
      // eslint-disable-next-line spellcheck/spell-checker
      result.describedby = `dx-${new Guid()}`;
    }

    return result;
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
