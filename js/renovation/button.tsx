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
} from 'devextreme-generator/component_declaration/common';
import createDefaultOptionRules from '../core/options/utils';
import devices from '../core/devices';
import noop from './utils/noop';
import themes from '../ui/themes';
import { click } from '../events/short';
import { getImageSourceType } from '../core/utils/icon';
import Icon from './icon';
import InkRipple from './ink-ripple';
import Widget from './widget';
import { BaseWidgetProps } from './utils/base-props';
import BaseComponent from './preact-wrapper/button';

const stylingModes = ['outlined', 'text', 'contained'];

const getInkRippleConfig = ({ text, icon, type }: ButtonProps) => {
  const isOnlyIconButton = (!text && icon) || (type === 'back');
  const config: any = isOnlyIconButton ? {
    isCentered: true,
    useHoldAnimation: false,
    waveSizeCoefficient: 1,
  } : {};

  return config;
};

const getCssClasses = (model: ButtonProps) => {
  const {
    text, icon, stylingMode, type, iconPosition,
  } = model;
  const classNames = ['dx-button'];
  const isValidStylingMode = stylingMode && stylingModes.indexOf(stylingMode) !== -1;

  classNames.push(`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`);
  classNames.push(`dx-button-${type || 'normal'}`);

  text && classNames.push('dx-button-has-text');
  icon && classNames.push('dx-button-has-icon');
  iconPosition !== 'left' && classNames.push('dx-button-icon-right');

  return classNames.join(' ');
};

const getAriaLabel = (text, icon) => {
  let label = (text && text.trim()) || icon;

  if (!text && getImageSourceType(icon) === 'image') {
    label = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
  }

  return label ? { label } : {};
};

export const viewFunction = (viewModel: Button) => {
  const {
    icon, iconPosition, template, text,
  } = viewModel.props;
  const renderText = !template && text;
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !template && viewModel.iconSource
        && <Icon source={viewModel.iconSource} position={iconPosition} />;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      aria={viewModel.aria}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      elementAttr={viewModel.elementAttr}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onActive={viewModel.onActive}
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
      <div className="dx-button-content" ref={viewModel.contentRef as any}>
        {template
                && (
                <viewModel.props.template
                  data={{ icon, text }}
                  parentRef={viewModel.contentRef}
                />
                )}
        {isIconLeft && iconComponent}
        {renderText
                && <span className="dx-button-text">{text}</span>}
        {!isIconLeft && iconComponent}
        {viewModel.props.useSubmitBehavior
                && <input ref={viewModel.submitInputRef as any} type="submit" tabIndex={-1} className="dx-button-submit-input" />}
        {viewModel.props.useInkRipple
                && <InkRipple config={viewModel.inkRippleConfig} ref={viewModel.inkRippleRef} />}
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
  onClick?: (e: any) => any = noop;

  @Event() onSubmit?: (e: any) => any = noop;

  @OneWay() pressed?: boolean;

  @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';

  @Template({ canBeAnonymous: true }) template?: any = '';

  @OneWay() text?: string = '';

  @OneWay() type?: string;

  @OneWay() useInkRipple?: boolean = false;

  @OneWay() useSubmitBehavior?: boolean = false;

  @OneWay() validationGroup?: string = undefined;
}

const defaultOptionRules = createDefaultOptionRules<ButtonProps>([{
  device: () => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
  options: { focusStateEnabled: true },
}, {
  device: () => (themes as any).isMaterial(themes.current()),
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

export default class Button extends JSXComponent<ButtonProps>(ButtonProps) {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() inkRippleRef!: InkRipple;

  @Ref() submitInputRef!: HTMLInputElement;

  @Ref() widgetRef!: Widget;

  @Effect()
  contentReadyEffect() {
    // NOTE: we should trigger this effect on change each
    //       property upon which onContentReady depends
    //       (for example, text, icon, etc)
    const { onContentReady } = this.props;

    onContentReady!({ element: this.contentRef.parentNode });
  }

  @Method()
  focus() {
    this.widgetRef.focus();
  }

  onActive(event: Event) {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.showWave({ element: this.contentRef, event });
  }

  onInactive(event: Event) {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.hideWave({ element: this.contentRef, event });
  }

  onWidgetClick(event: Event) {
    const { onClick, useSubmitBehavior, validationGroup } = this.props;

    onClick!({ event, validationGroup });
    useSubmitBehavior && this.submitInputRef.click();
  }

  onWidgetKeyDown(event: Event, options) {
    const { onKeyDown } = this.props;
    const { keyName, which } = options;

    const result = onKeyDown?.(event, options);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      event.preventDefault();
      this.onWidgetClick(event);
    }

    return undefined;
  }

  @Effect()
  submitEffect() {
    const namespace = 'UIFeedback';
    const { useSubmitBehavior, onSubmit } = this.props;

    if (useSubmitBehavior) {
      click.on(this.submitInputRef,
        (event) => onSubmit!({ event, submitInput: this.submitInputRef }),
        { namespace });

      return () => click.off(this.submitInputRef, { namespace });
    }

    return undefined;
  }

  get aria() {
    return getAriaLabel(this.props.text, this.props.icon);
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get elementAttr() {
    return { ...this.props.elementAttr, role: 'button' };
  }

  get iconSource(): string {
    const { icon, type } = this.props;

    return (icon || type === 'back') ? (icon || 'back') : '';
  }

  get inkRippleConfig() {
    return getInkRippleConfig(this.props);
  }
}
