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
import { InkRipple, InkRippleConfig } from '../common/ink_ripple';
import { Widget } from '../common/widget';
import { isMaterial, current } from '../../../ui/themes';
import BaseComponent from '../../component_wrapper/editors/check_box';
import { BaseWidgetProps } from '../common/base_props';
import { combineClasses } from '../../utils/combine_classes';
import { EffectReturn } from '../../utils/effect_return';
import { ValidationMessage } from '../overlays/validation_message';

const getCssClasses = (model: CheckBoxProps): string => {
  const {
    text, readOnly, isValid, value,
  } = model;

  const checked = value;
  const indeterminate = checked === null;

  const classesMap = {
    'dx-checkbox': true,
    'dx-state-readonly': Boolean(readOnly),
    'dx-checkbox-checked': Boolean(checked),
    'dx-checkbox-has-text': Boolean(text),
    'dx-invalid': !(isValid ?? false),
    'dx-checkbox-indeterminate': indeterminate,
  };
  return combineClasses(classesMap);
};

const inkRippleConfig: InkRippleConfig = {
  waveSizeCoefficient: 2.5,
  useHoldAnimation: false,
  wavesNumber: 2,
  isCentered: true,
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
      onActive={viewModel.onActive}
      onFocusIn={viewModel.onFocusIn}
      onFocusOut={viewModel.onFocusOut}
      aria={viewModel.aria}
      onClick={viewModel.onWidgetClick}
      onInactive={viewModel.onInactive}
      onKeyDown={viewModel.onWidgetKeyDown}
      rtlEnabled={viewModel.props.rtlEnabled}
      tabIndex={viewModel.props.tabIndex}
      visible={viewModel.props.visible}
      width={viewModel.props.width}
      {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input ref={viewModel.inputRef} type="hidden" value={`${viewModel.props.value}`} {...Boolean(name) && { name }} />
      <div className="dx-checkbox-container">
        <span className="dx-checkbox-icon" ref={viewModel.iconRef} />
        {Boolean(text) && (<span className="dx-checkbox-text">{text}</span>)}
      </div>
      {Boolean(viewModel.props.useInkRipple)
                && <InkRipple config={inkRippleConfig} ref={viewModel.inkRippleRef} />}
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
  @OneWay() activeStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() validationError?: Record<string, unknown> | null = null;

  @OneWay() validationErrors?: Record<string, unknown>[] | null = null;

  @OneWay() text?: string = '';

  @OneWay() validationMessageMode?: 'auto' | 'always' = 'auto';

  @OneWay() validationStatus?: string = 'valid';

  @OneWay() name?: string = '';

  @OneWay() readOnly?: boolean = false;

  @OneWay() isValid?: boolean = true;

  @TwoWay() value?: boolean | null = false;

  @OneWay() useInkRipple?: boolean = false;

  @Event() onFocusIn?: (e: Event) => void;

  @OneWay() saveValueChangeEvent?: (event: Event) => void;
}

export const defaultOptionRules = createDefaultOptionRules<CheckBoxProps>([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: { focusStateEnabled: true },
}, {
  // NOTE: it's disabled until styles fix: see https://trello.com/c/5Pbm18YA
  // eslint-disable-next-line import/no-named-as-default-member
  device: (): boolean => isMaterial(current()),
  options: { useInkRipple: false },
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

  @Ref() inkRippleRef!: RefObject<InkRipple>;

  @Ref() inputRef!: RefObject<HTMLInputElement>;

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

  onActive(event: Event): void {
    const waveId = 1;
    this.wave(event, 'showWave', waveId);
  }

  onInactive(event: Event): void {
    const waveId = 1;
    this.wave(event, 'hideWave', waveId);
  }

  onFocusIn(event: Event): void {
    const waveId = 0;
    const { onFocusIn } = this.props;
    this.wave(event, 'showWave', waveId);

    // NOTE: pass to jQ wrapper
    onFocusIn?.(event);
  }

  onFocusOut(event: Event): void {
    const waveId = 0;
    this.wave(event, 'hideWave', waveId);
  }

  onWidgetClick(event: Event): void {
    const { readOnly, value, saveValueChangeEvent } = this.props;

    if (!(readOnly ?? false)) {
      saveValueChangeEvent?.(event);
      this.props.value = !(value ?? false);
    }
  }

  onWidgetKeyDown(options): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = options;

    const result: Event & { cancel: boolean } = onKeyDown?.(options);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }

    return undefined;
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get shouldShowValidationMessage(): boolean {
    const { isValid, validationStatus } = this.props;
    return !(isValid ?? false)
      && validationStatus === 'invalid'
      && Boolean(this.validationErrors?.length);
  }

  get aria(): Record<string, string> {
    const { readOnly, isValid } = this.props;
    const checked = Boolean(this.props.value);
    const indeterminate = this.props.value === null;

    const result: Record<string, string> = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
      readonly: (readOnly ?? false) ? 'true' : 'false',
      invalid: !(isValid ?? false) ? 'true' : 'false',
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

  wave(event: Event, type: 'showWave' | 'hideWave', waveId: number): void {
    const { useInkRipple } = this.props;
    Boolean(useInkRipple) && this.inkRippleRef.current![type]({
      element: this.iconRef.current!, event, wave: waveId,
    });
  }
}
