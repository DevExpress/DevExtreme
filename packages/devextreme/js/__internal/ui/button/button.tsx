import { click } from '@js/common/core/events/short';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import { convertRulesToOptions, createDefaultOptionRules } from '@js/core/options/utils';
import { getImageSourceType } from '@js/core/utils/icon';
import { camelize } from '@js/core/utils/inflector';
import type { Properties as ButtonProperties, TemplateData } from '@js/ui/button.d';
import { current, isMaterial } from '@js/ui/themes';
import type { BaseWidgetProps } from '@ts/core/r1/base_props';
import { BaseWidgetDefaultProps } from '@ts/core/r1/base_props';
import { createReRenderEffect, InfernoEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';
import type { TemplateComponent } from '@ts/core/r1/types';
import type { EffectReturn } from '@ts/core/r1/utils/effect_return';
import { getTemplate } from '@ts/core/r1/utils/index';
import { Widget } from '@ts/core/r1/widget';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { createRef as infernoCreateRef } from 'inferno';

import { Icon } from './icon';
import type { InkRippleConfig } from './ink_ripple';
import { InkRipple } from './ink_ripple';

export const BUTTON_CLASS = 'dx-button';

const stylingModes = ['outlined', 'text', 'contained'];
export const buttonComponentProps = [
  'accessKey',
  'activeStateEnabled',
  'className',
  'disabled',
  'focusStateEnabled',
  'height',
  'hint',
  'hoverStateEnabled',
  'icon',
  'iconPosition',
  'iconTemplate',
  'onClick',
  'onKeyDown',
  'onSubmit',
  'pressed',
  'rtlEnabled',
  'stylingMode',
  'tabIndex',
  'template',
  'templateData',
  'text',
  'type',
  'useInkRipple',
  'useSubmitBehavior',
  'visible',
  'width',
];

const getCssClasses = (model: ButtonProps): string => {
  const {
    icon,
    iconPosition,
    stylingMode,
    text,
    type,
  } = model;

  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    [BUTTON_CLASS]: true,
    [`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`]: true,
    [`dx-button-${type ?? 'normal'}`]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left',
  };

  return combineClasses(classesMap);
};

const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  excludedKeys: K[],
): Omit<T, K> => {
  const excludedSet = new Set(excludedKeys);

  return Object.keys(obj).reduce((result, key) => {
    if (!excludedSet.has(key as K)) {
      result[key] = obj[key];
    }

    return result;
  }, {}) as Omit<T, K>;
};

export type ButtonProps = Record<string, unknown> & BaseWidgetProps & ButtonProperties & {
  iconPosition?: string;
  onSubmit?: (e: { event: Event; submitInput: HTMLInputElement | null }) => void;
  pressed?: boolean;
  template?: TemplateComponent;
  iconTemplate?: TemplateComponent;
  children?: JSX.Element;
  useInkRipple: boolean;
  templateData?: TemplateData;
};

export const defaultButtonProps: ButtonProps = {
  ...BaseWidgetDefaultProps,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  icon: '',
  iconPosition: 'left',
  stylingMode: 'contained',
  text: '',
  type: 'normal',
  useInkRipple: false,
  useSubmitBehavior: false,
  templateData: {},
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

  private readonly __getterCache: { inkRippleConfig?: InkRippleConfig } = {};

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
    const { onSubmit, useSubmitBehavior } = this.props;
    const submitInput = this.submitInputRef.current;

    if (useSubmitBehavior && onSubmit) {
      click.on(
        submitInput,
        (event: Event) => onSubmit({ event, submitInput }),
        { namespace },
      );

      return () => click.off(submitInput, { namespace });
    }
    return undefined;
  }

  onActive(event: Event): void {
    if (this.props.useInkRipple) {
      this.inkRippleRef.current?.showWave({
        element: this.contentRef.current,
        event,
      });
    }
  }

  onInactive(event: Event): void {
    if (this.props.useInkRipple) {
      this.inkRippleRef.current?.hideWave({
        element: this.contentRef.current,
        event,
      });
    }
  }

  onWidgetClick(event: Event): void {
    const { onClick, useSubmitBehavior } = this.props;

    onClick?.({ event });

    if (useSubmitBehavior) {
      this.submitInputRef.current?.click();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  keyDown(e): unknown {
    const { onKeyDown } = this.props;
    const { keyName, originalEvent, which } = e;

    const result = onKeyDown?.(e);
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
    const { icon, text } = this.props;
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
          label = titleRegexp.exec(icon)?.[1] ?? '';
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
    return this.props.icon ?? '';
  }

  get inkRippleConfig(): InkRippleConfig {
    if (this.__getterCache.inkRippleConfig === undefined) {
      const { icon, text } = this.props;

      this.__getterCache.inkRippleConfig = !text && icon ? {
        isCentered: true,
        useHoldAnimation: false,
        waveSizeCoefficient: 1,
      } : {};
    }

    return this.__getterCache.inkRippleConfig;
  }

  get buttonTemplateData(): Record<string, unknown> {
    const { icon, text, templateData } = this.props;
    return { icon, text, ...templateData };
  }

  get restAttributes(): Partial<ButtonProps> {
    const excludedKeys = [
      ...buttonComponentProps,
      'children',
    ];

    return omit(this.props, excludedKeys);
  }

  focus(): void {
    this.widgetRef.current?.focus();
  }

  activate(): void {
    this.widgetRef.current?.activate();
  }

  deactivate(): void {
    this.widgetRef.current?.deactivate();
  }

  componentWillUpdate(nextProps: ButtonProps): void {
    super.componentWillUpdate();

    if (this.props.icon !== nextProps.icon || this.props.text !== nextProps.text) {
      this.__getterCache.inkRippleConfig = undefined;
    }
  }

  render(): JSX.Element {
    const { children, iconPosition, text } = this.props;

    const ButtonTemplate = getTemplate(this.props.template);
    const IconTemplate = getTemplate(this.props.iconTemplate);

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
          {ButtonTemplate
            ? ButtonTemplate({ data: this.buttonTemplateData })
            : children
          }

          {isIconLeft && iconComponent}
          {renderText && (<span className="dx-button-text">{text}</span>)}
          {!isIconLeft && iconComponent}

          {this.props.useSubmitBehavior && (
            <input ref={this.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input" />
          )}

          {this.props.useInkRipple && (
            <InkRipple config={this.inkRippleConfig} ref={this.inkRippleRef} />
          )}
        </div>
      </Widget>
    );
  }
}

Button.defaultProps = { ...defaultButtonProps, ...convertRulesToOptions(defaultOptionRules) };

// eslint-disable-next-line @typescript-eslint/naming-convention
const __defaultOptionRules: DefaultOptionsRule<ButtonProps>[] = [];

export function defaultOptions(rule: DefaultOptionsRule<ButtonProps>): void {
  __defaultOptionRules.push(rule);

  Button.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Button.defaultProps),
      Object.getOwnPropertyDescriptors(convertRulesToOptions(defaultOptionRules)),
      Object.getOwnPropertyDescriptors(convertRulesToOptions(__defaultOptionRules)),
    ),
  );
}
