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
} from 'devextreme-generator/component_declaration/common';
import { createDefaultOptionRules } from '../../core/options/utils';
import devices from '../../core/devices';
import { InkRipple } from './common/ink_ripple';
import { Widget } from './common/widget';
import * as themes from '../../ui/themes';
import BaseComponent from '../preact_wrapper/check_box';
import BaseWidgetProps from '../utils/base_props';
import { combineClasses } from '../utils/combine_classes';

const getCssClasses = (model: CheckBoxProps): string => {
  const {
    text, readOnly, isValid, value,
  } = model;

  const checked = value;
  // TODO: replace null with undefined after generator bug fix
  const indeterminate = checked === null;

  const classesMap = {
    'dx-checkbox': true,
    'dx-state-readonly': !!readOnly,
    'dx-checkbox-checked': !!checked,
    'dx-checkbox-has-text': !!text,
    'dx-invalid': !isValid,
    'dx-checkbox-indeterminate': indeterminate,
  };
  return combineClasses(classesMap);
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
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      ref={viewModel.widgetRef as any}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
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
      <input ref={viewModel.inputRef} type="hidden" value={`${viewModel.props.value}`} {...name && { name }} />
      <div className="dx-checkbox-container">
        <span className="dx-checkbox-icon" ref={viewModel.iconRef} />
        {text && (<span className="dx-checkbox-text">{text}</span>)}
      </div>
      {viewModel.props.useInkRipple
                && <InkRipple config={inkRippleConfig()} ref={viewModel.inkRippleRef} />}
    </Widget>
  );
};

@ComponentBindings()
export class CheckBoxProps extends BaseWidgetProps {
  @OneWay() activeStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() validationError?: object | null = null;

  @OneWay() validationErrors?: object[] | null = null;

  @OneWay() text?: string = '';

  @OneWay() validationMessageMode?: string = 'auto';

  @OneWay() validationStatus?: string = 'valid';

  @OneWay() name?: string = '';

  @OneWay() readOnly?: boolean = false;

  @OneWay() isValid?: boolean = true;

  // TODO: remove null after generator bug fix
  @TwoWay() value?: boolean | null = false;

  @OneWay() useInkRipple?: boolean = false;

  @Event() onFocusIn?: (e: Event) => void;
}

export const defaultOptionRules = createDefaultOptionRules<CheckBoxProps>([{
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  device: (): boolean => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
  options: { focusStateEnabled: true },
}, {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  device: (): boolean => (themes as any).isMaterial((themes as any).current()),
  options: { useInkRipple: true },
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
  @Ref() iconRef!: HTMLDivElement;

  @Ref() inkRippleRef!: InkRipple;

  @Ref() inputRef!: HTMLInputElement;

  @Ref() widgetRef!: Widget;

  @Method()
  focus(): void {
    this.widgetRef.focus();
  }

  @Effect()
  contentReadyEffect(): void {
    const { onContentReady } = this.props;
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    onContentReady!({ element: this.widgetRef });
  }

  onActive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.showWave({ element: this.iconRef, event, wave: 1 });
  }

  onInactive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.hideWave({ element: this.iconRef, event, wave: 1 });
  }

  onFocusIn(event: Event): void {
    const { useInkRipple, onFocusIn } = this.props;

    useInkRipple && this.inkRippleRef.showWave({ element: this.iconRef, event, wave: 0 });
    // NOTE: pass to jQ wrapper
    onFocusIn?.(event);
  }

  onFocusOut(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.hideWave({ element: this.iconRef, event, wave: 0 });
  }

  onWidgetClick(event: Event): void {
    const { readOnly, value } = this.props;

    // TODO: remove it after actions support event pass
    event?.stopPropagation();

    if (!readOnly) {
      this.props.value = !value;
    }
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onWidgetKeyDown(options): any | undefined {
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
    return getCssClasses(this.props);
  }

  get aria(): object {
    const { readOnly, isValid } = this.props;
    const checked = this.props.value;
    // TODO: replace null with undefined after generator bug fix
    const indeterminate = checked === null;

    return {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
      readonly: readOnly ? 'true' : 'false',
      invalid: !isValid ? 'true' : 'false',
    };
  }
}
