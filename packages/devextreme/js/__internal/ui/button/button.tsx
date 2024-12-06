/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createReRenderEffect, InfernoEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { click } from '@js/common/core/events/short';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import { convertRulesToOptions, createDefaultOptionRules } from '@js/core/options/utils';
import { getImageSourceType } from '@js/core/utils/icon';
import { camelize } from '@js/core/utils/inflector';
import { current, isMaterial } from '@js/ui/themes';
import type { EffectReturn } from '@ts/core/r1/utils/effect_return';
import { getTemplate } from '@ts/core/r1/utils/index';
import { Widget } from '@ts/core/r1/widget';
import { combineClasses } from '@ts/core/utils/combine_classes';
import {
  createRef as infernoCreateRef,
} from 'inferno';

import { Icon } from './icon';
import type { InkRippleConfig } from './ink_ripple';
import { InkRipple } from './ink_ripple';
import type { ButtonProps } from './props';
import { defaultButtonProps } from './props';

const stylingModes = ['outlined', 'text', 'contained'];

const getCssClasses = (model): string => {
  const {
    icon,
    iconPosition,
    stylingMode,
    text,
    type,
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

export const defaultOptionRules = createDefaultOptionRules([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: {
    focusStateEnabled: true,
  },
}, {
  device: (): boolean => isMaterial(current()),
  options: {
    useInkRipple: true,
  },
}]);

export class Button extends InfernoWrapperComponent<ButtonProps> {
  private readonly contentRef = infernoCreateRef<HTMLDivElement>();

  private readonly inkRippleRef = infernoCreateRef<InkRipple>();

  private readonly submitInputRef = infernoCreateRef<HTMLInputElement>();

  private readonly widgetRef = infernoCreateRef<Widget>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __getterCache: any = {};

  constructor(props: ButtonProps) {
    super(props);
    this.state = {};
    this.focus = this.focus.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.submitEffect = this.submitEffect.bind(this);
    this.onActive = this.onActive.bind(this);
    this.onInactive = this.onInactive.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.emitClickEvent = this.emitClickEvent.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior]),
      createReRenderEffect(),
    ];
  }

  updateEffects(): void {
    this._effects[0]?.update([this.props.onSubmit, this.props.useSubmitBehavior]);
  }

  submitEffect(): EffectReturn {
    const namespace = 'UIFeedback';
    const {
      onSubmit,
      useSubmitBehavior,
    } = this.props;
    if (useSubmitBehavior && onSubmit) {
      click.on(this.submitInputRef.current, (event) => onSubmit({
        event,
        submitInput: this.submitInputRef.current,
      }), {
        namespace,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return () => click.off(this.submitInputRef.current, {
        namespace,
      });
    }
    return undefined;
  }

  onActive(event): void {
    const {
      useInkRipple,
    } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    useInkRipple && this.inkRippleRef.current!.showWave({
      element: this.contentRef.current,
      event,
    });
  }

  onInactive(event): void {
    const {
      useInkRipple,
    } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    useInkRipple && this.inkRippleRef.current!.hideWave({
      element: this.contentRef.current,
      event,
    });
  }

  onWidgetClick(event): void {
    const {
      onClick,
      useSubmitBehavior,
    } = this.props;

    onClick?.({
      event,
    });

    if (useSubmitBehavior) {
      this.submitInputRef.current!.click();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  keyDown(e): unknown {
    const {
      onKeyDown,
    } = this.props;
    const {
      keyName,
      originalEvent,
      which,
    } = e;
    const result = onKeyDown?.(e);
    if (result?.cancel) {
      return result;
    }
    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      originalEvent.preventDefault();
      this.emitClickEvent();
    }
    return undefined;
  }

  emitClickEvent(): void {
    this.contentRef.current!.click();
  }

  get aria(): Record<string, string> {
    const {
      icon,
      text,
    } = this.props;
    let label = text ?? '';
    if (!text && icon) {
      const iconSource = getImageSourceType(icon);
      switch (iconSource) {
        case 'image':
        {
          const notURLRegexp = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
          const isPathToImage = !icon.includes('base64') && notURLRegexp.test(icon);
          label = isPathToImage ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : '';
          break;
        }
        case 'dxIcon':
          label = messageLocalization.format(camelize(icon, true)) || icon;
          break;
        case 'fontIcon':
          label = icon;
          break;
        case 'svg': {
          const titleRegexp = /<title>(.*?)<\/title>/;
          const title = titleRegexp.exec(icon)?.[1] ?? '';
          label = title;
          break;
        }
        default:
          break;
      }
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
    const {
      icon,
    } = this.props;
    return icon ?? '';
  }

  get inkRippleConfig(): InkRippleConfig {
    if (this.__getterCache.inkRippleConfig !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.__getterCache.inkRippleConfig;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.inkRippleConfig = ((): InkRippleConfig => {
      const {
        icon,
        text,
      } = this.props;
      return !text && icon ? {
        isCentered: true,
        useHoldAnimation: false,
        waveSizeCoefficient: 1,
      } : {};
    })();
  }

  get buttonTemplateData(): Record<string, unknown> {
    const { icon, text, templateData } = this.props;
    return { icon, text, ...templateData };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get restAttributes(): any {
    const restProps = { ...this.props };

    [
      'accessKey', 'activeStateEnabled', 'children', 'className', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'icon', 'iconPosition', 'iconTemplate', 'onClick', 'onKeyDown', 'onSubmit', 'pressed', 'rtlEnabled', 'stylingMode', 'tabIndex', 'template', 'templateData', 'text', 'type', 'useInkRipple', 'useSubmitBehavior', 'visible', 'width',
    ].forEach((excluded) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete restProps[excluded];
    });

    return restProps;
  }

  focus(): void {
    this.widgetRef.current!.focus();
  }

  activate(): void {
    this.widgetRef.current!.activate();
  }

  deactivate(): void {
    this.widgetRef.current!.deactivate();
  }

  componentWillUpdate(nextProps): void {
    super.componentWillUpdate();
    if (this.props.icon !== nextProps.icon || this.props.text !== nextProps.text) {
      this.__getterCache.inkRippleConfig = undefined;
    }
  }

  render(): JSX.Element {
    const {
      children,
      iconPosition,
      text,
    } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ButtonTemplate: any = getTemplate(this.props.template);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconTemplate: any = getTemplate(this.props.iconTemplate);

    const renderText = !this.props.template && !children && text !== '';
    const isIconLeft = iconPosition === 'left';

    const iconComponent = !ButtonTemplate && !children && (this.iconSource || IconTemplate) && (
      <Icon
        source={this.iconSource}
        position={iconPosition}
        iconTemplate={IconTemplate}
      />
    );

    return (
      <Widget
        ref={this.widgetRef}
        accessKey={this.props.accessKey}
        activeStateEnabled={this.props.activeStateEnabled}
        aria={this.aria}
        className={this.props.className}
        classes={this.cssClasses}
        disabled={this.props.disabled}
        focusStateEnabled={this.props.focusStateEnabled}
        height={this.props.height}
        hint={this.props.hint}
        hoverStateEnabled={this.props.hoverStateEnabled}
        onActive={this.onActive}
        onClick={this.onWidgetClick}
        onInactive={this.onInactive}
        onKeyDown={this.keyDown}
        rtlEnabled={this.props.rtlEnabled}
        tabIndex={this.props.tabIndex}
        visible={this.props.visible}
        width={this.props.width}
        {...this.restAttributes}
      >
        <div className="dx-button-content" ref={this.contentRef}>
          {ButtonTemplate && ButtonTemplate({ data: this.buttonTemplateData }) }
          {!ButtonTemplate && children}
          {isIconLeft && iconComponent}
          {renderText && (<span className="dx-button-text">{text}</span>)}
          {!isIconLeft && iconComponent}
          {this.props.useSubmitBehavior
            && (
              <input ref={this.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input" />
            )
          }
          {this.props.useInkRipple
            && (
              <InkRipple
                config={this.inkRippleConfig}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={this.inkRippleRef as any}
              />
            )
          }
        </div>
      </Widget>
    );
  }
}
Button.defaultProps = { ...defaultButtonProps, ...convertRulesToOptions(defaultOptionRules) };

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
const __defaultOptionRules: any = [];
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  // eslint-disable-next-line max-len
  Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors(convertRulesToOptions(defaultOptionRules)), Object.getOwnPropertyDescriptors(convertRulesToOptions(__defaultOptionRules))));
}
