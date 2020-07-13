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
} from 'devextreme-generator/component_declaration/common';
import { createDefaultOptionRules } from '../core/options/utils';
import devices from '../core/devices';
import noop from './utils/noop';
import * as themes from '../ui/themes';
import { click } from '../events/short';
import { getImageSourceType } from '../core/utils/icon';
import { Icon } from './icon';
import { InkRipple } from './ink-ripple';
import { Widget } from './widget';
import BaseWidgetProps from './utils/base-props';
import BaseComponent from './preact-wrapper/button';

const stylingModes = ['outlined', 'text', 'contained'];

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

export const viewFunction = (viewModel: Button) => {
  const {
    children, icon, iconPosition, template, text,
  } = viewModel.props;
  const renderText = !template && !children && text;
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !template && !children && viewModel.iconSource
        && <Icon source={viewModel.iconSource} position={iconPosition} />;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      aria={viewModel.aria}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
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
                />
                )}
        {!template && children}
        {isIconLeft && iconComponent}
        {renderText && (<span className="dx-button-text">{text}</span>)}
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

  @Template() template?: any = '';

  @Slot() children?: any;

  @OneWay() text?: string = '';

  @OneWay() type?: string;

  @OneWay() useInkRipple?: boolean = false;

  @OneWay() useSubmitBehavior?: boolean = false;

  @OneWay() validationGroup?: string = undefined;
}

export const defaultOptionRules = createDefaultOptionRules<ButtonProps>([{
  device: () => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
  options: { focusStateEnabled: true },
}, {
  device: () => (themes as any).isMaterial((themes as any).current()),
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

    onClick?.({ event, validationGroup });
    useSubmitBehavior && this.submitInputRef.click();
  }

  onWidgetKeyDown(options) {
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

  @Effect()
  submitEffect() {
    const namespace = 'UIFeedback';
    const { useSubmitBehavior, onSubmit } = this.props;

    if (useSubmitBehavior && onSubmit) {
      click.on(this.submitInputRef,
        (event) => onSubmit({ event, submitInput: this.submitInputRef }),
        { namespace });

      return (): void => click.off(this.submitInputRef, { namespace });
    }

    return undefined;
  }

  get aria() {
    const { text, icon } = this.props;

    let label = text || icon;

    if (!text && icon && getImageSourceType(icon) === 'image') {
      label = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
    }

    return {
      role: 'button',
      ...(label ? { label } : {}),
    };
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get iconSource(): string {
    const { icon, type } = this.props;

    return (icon || type === 'back') ? (icon || 'back') : '';
  }

  get inkRippleConfig() {
    const { text, icon, type } = this.props;
    return ((!text && icon) || (type === 'back')) ? {
      isCentered: true,
      useHoldAnimation: false,
      waveSizeCoefficient: 1,
    } : {};
  }
}
