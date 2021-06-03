import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  Template,
  Slot,
  RefObject,
} from '@devextreme-generator/declarations';
import { createDefaultOptionRules } from '../../core/options/utils';
import devices from '../../core/devices';
import { isMaterial, current } from '../../ui/themes';
import { click } from '../../events/short';
import { combineClasses } from '../utils/combine_classes';
import { getImageSourceType } from '../../core/utils/icon';
import { Icon } from './common/icon';
import { InkRipple, InkRippleConfig } from './common/ink_ripple';
import { Widget } from './common/widget';
import { BaseWidgetProps } from './common/base_props';
// eslint-disable-next-line import/no-cycle
import BaseComponent from '../component_wrapper/button';
import { EffectReturn } from '../utils/effect_return.d';

const stylingModes = ['outlined', 'text', 'contained'];

const getCssClasses = (model: ButtonProps): string => {
  const {
    text, icon, stylingMode, type, iconPosition,
  } = model;
  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    'dx-button': true,
    [`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`]: true,
    [`dx-button-${type ?? 'normal'}`]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left',
  };

  return combineClasses(classesMap);
};
export const viewFunction = (viewModel: Button): JSX.Element => {
  const {
    children, icon, iconPosition, template: ButtonTemplate, text, templateData,
  } = viewModel.props;
  const renderText = !ButtonTemplate && !children && text;
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !ButtonTemplate && !children && viewModel.iconSource
        && <Icon source={viewModel.iconSource} position={iconPosition} />;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      aria={viewModel.aria}
      className={viewModel.props.className}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onActive={viewModel.onActive}
      onClick={viewModel.onWidgetClick}
      onInactive={viewModel.onInactive}
      onKeyDown={viewModel.onWidgetKeyDown}
      rtlEnabled={viewModel.props.rtlEnabled}
      tabIndex={viewModel.props.tabIndex}
      visible={viewModel.props.visible}
      width={viewModel.props.width}
      {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className="dx-button-content" ref={viewModel.contentRef}>
        {ButtonTemplate && (<ButtonTemplate data={{ icon, text, ...templateData }} />)}
        {!ButtonTemplate && children}
        {isIconLeft && iconComponent}
        {renderText && (<span className="dx-button-text">{text}</span>)}
        {!isIconLeft && iconComponent}
        {viewModel.props.useSubmitBehavior
                && <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input" />}
        {viewModel.props.useInkRipple
                && (
                <InkRipple
                  config={viewModel.inkRippleConfig}
                  ref={viewModel.inkRippleRef}
                />
                )}
      </div>
    </Widget>
  );
};

@ComponentBindings()
export class ButtonProps extends BaseWidgetProps {
  @OneWay() activeStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() icon?: string = '';

  @OneWay() iconPosition?: string = 'left';

  @Event({
    actionConfig: { excludeValidators: ['readOnly'] },
  })
  onClick?: (e: { event: Event; validationGroup?: string }) => void;

  @Event() onSubmit?: (e: { event: Event; submitInput: HTMLInputElement | null }) => void;

  @OneWay() pressed?: boolean;

  @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';

  @Template() template?: (props: { data: { icon?: string; text?: string } }) => JSX.Element;

  @Slot() children?: JSX.Element;

  @OneWay() text?: string = '';

  @OneWay() type?: 'back' | 'danger' | 'default' | 'normal' | 'success' = 'normal';

  @OneWay() useInkRipple?: boolean = false;

  @OneWay() useSubmitBehavior?: boolean = false;

  @OneWay() validationGroup?: string = undefined;

  @OneWay() templateData?: Record<string, unknown> = {};
}

export const defaultOptionRules = createDefaultOptionRules<ButtonProps>([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: { focusStateEnabled: true },
}, {
  // eslint-disable-next-line import/no-named-as-default-member
  device: (): boolean => isMaterial(current()),
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

export class Button extends JSXComponent(ButtonProps) {
  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() inkRippleRef!: RefObject<InkRipple>;

  @Ref() submitInputRef!: RefObject<HTMLInputElement>;

  @Ref() widgetRef!: RefObject<Widget>;

  @Method()
  focus(): void {
    this.widgetRef.current!.focus();
  }

  @Method()
  activate(): void {
    this.widgetRef.current!.activate();
  }

  @Method()
  deactivate(): void {
    this.widgetRef.current!.deactivate();
  }

  @Effect()
  submitEffect(): EffectReturn {
    const namespace = 'UIFeedback';
    const { useSubmitBehavior, onSubmit } = this.props;

    if (useSubmitBehavior && onSubmit) {
      click.on(this.submitInputRef.current,
        (event) => onSubmit({ event, submitInput: this.submitInputRef.current }),
        { namespace });

      return (): void => click.off(this.submitInputRef.current, { namespace });
    }

    return undefined;
  }

  onActive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.current!.showWave({
      element: this.contentRef.current!, event,
    });
  }

  onInactive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.current!.hideWave({
      element: this.contentRef.current!, event,
    });
  }

  onWidgetClick(event: Event): void {
    const { onClick, useSubmitBehavior, validationGroup } = this.props;

    onClick?.({ event, validationGroup });
    useSubmitBehavior && this.submitInputRef.current!.click();
  }

  onWidgetKeyDown(options): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = options;

    const result = onKeyDown?.(options);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }

    return undefined;
  }

  get aria(): Record<string, string> {
    const { text, icon } = this.props;

    let label = (text ?? '') || icon;

    if (!text && icon && getImageSourceType(icon) === 'image') {
      label = !icon.includes('base64') ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
    }

    return {
      role: 'button',
      ...label ? { label } : {},
    };
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get iconSource(): string {
    const { icon, type } = this.props;

    if (icon || type === 'back') {
      return (icon ?? '') || 'back';
    }

    return '';
  }

  get inkRippleConfig(): InkRippleConfig {
    const { text, icon, type } = this.props;
    return (!text && icon) || (type === 'back') ? {
      isCentered: true,
      useHoldAnimation: false,
      waveSizeCoefficient: 1,
    } : {};
  }
}
