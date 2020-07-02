import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  TwoWay,
  Ref,
  Event,
  Effect,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { createDefaultOptionRules } from '../core/options/utils';
import devices from '../core/devices';
import InkRipple from './ink-ripple';
import Widget from './widget';
import BaseWidgetProps from './utils/base-props';

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_ICON_CLASS = 'dx-checkbox-icon';
const CHECKBOX_CHECKED_CLASS = 'dx-checkbox-checked';
const CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';
const CHECKBOX_INDETERMINATE_CLASS = 'dx-checkbox-indeterminate';

const getCssClasses = (model: CheckBoxProps, value: boolean): string => {
  const { text } = model;
  const classNames = [CHECKBOX_CLASS];

  const checked = value;
  const indeterminate = checked === undefined;

  checked && classNames.push(CHECKBOX_CHECKED_CLASS);
  indeterminate && classNames.push(CHECKBOX_INDETERMINATE_CLASS);
  text && classNames.push(CHECKBOX_HAS_TEXT_CLASS);

  return classNames.join(' ');
};

const inkRippleConfig = (): object => ({
  waveSizeCoefficient: 2.5,
  useHoldAnimation: false,
  wavesNumber: 2,
  isCentered: true,
});
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const viewFunction = (viewModel: CheckBox): any => {
  const { text, name } = viewModel.props;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onActive={viewModel.onActive}
      aria={viewModel.aria}
      onContentReady={viewModel.props.onContentReady}
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
      <input ref={viewModel.submitInputRef} type="hidden" value={`${viewModel.props.value}`} {...name && { name }} />
      <div className={CHECKBOX_CONTAINER_CLASS} ref={viewModel.contentRef}>
        <span className={CHECKBOX_ICON_CLASS} />
        {text && (<span className={CHECKBOX_TEXT_CLASS}>{text}</span>)}
      </div>
      {viewModel.props.useInkRipple
                && <InkRipple config={inkRippleConfig} ref={viewModel.inkRippleRef} />}
    </Widget>
  );
};

@ComponentBindings()
export class CheckBoxProps extends BaseWidgetProps {
  @OneWay() activeStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() elementAttr?: object = {};

  @OneWay() text?: string = '';

  @OneWay() name?: string = '';

  @TwoWay() value?: boolean | null = false;

  @OneWay() useInkRipple?: boolean = false;

  @Event({
    actionConfig: { excludeValidators: ['disabled', 'readOnly'] },
  }) onValueChanged?: (e: object) => void = (() => {});
}

export const defaultOptionRules = createDefaultOptionRules<CheckBoxProps>([{
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  device: (): boolean => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
  options: { focusStateEnabled: true },
}]);

@Component({
  defaultOptionRules,
  jQuery: { register: true },
  view: viewFunction,
})
export default class CheckBox extends JSXComponent(CheckBoxProps) {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() inkRippleRef!: InkRipple;

  @Ref() submitInputRef!: HTMLInputElement;

  @Ref() widgetRef!: Widget;

  @Method()
  focus(): void {
    this.widgetRef.focus();
  }

  @Effect()
  contentReadyEffect(): void {
    const { onContentReady } = this.props;
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    onContentReady!({ element: this.submitInputRef.parentNode });
  }

  onActive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.showWave({ element: this.widgetRef, event });
  }

  onInactive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.hideWave({ element: this.widgetRef, event });
  }

  onWidgetClick(event: Event): void {
    const { value, onValueChanged } = this.props;

    this.props.value = !value;

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    onValueChanged!({
      event,
      element: this.submitInputRef.parentNode,
      previousValue: value,
      value: !value,
    });
  }

  onWidgetKeyDown(options): undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = options;

    const result = onKeyDown?.(options);
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
    // NOTE: second parameter needs for generator bug workaround
    return getCssClasses(this.props, this.props.value);
  }

  get aria(): object {
    const checked = this.props.value;
    const indeterminate = checked === undefined;

    return {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : checked || 'false',
    };
  }
}
