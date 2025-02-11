/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@js/common/core/events/click';
import '@js/common/core/events/hover';

import {
  createReRenderEffect, InfernoEffect, InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
import {
  dxClick, focus, keyboard, resize, visibility,
} from '@js/common/core/events/short';
import domAdapter from '@js/core/dom_adapter';
import errors from '@js/core/errors';
import { extend } from '@js/core/utils/extend';
import resizeCallbacks from '@js/core/utils/resize_callbacks';
import { normalizeStyleProp } from '@js/core/utils/style';
import { isFunction } from '@js/core/utils/type';
import type { ConfigContextValue } from '@ts/core/r1/config_context';
import { ConfigContext } from '@ts/core/r1/config_context';
import { ConfigProvider } from '@ts/core/r1/config_provider';
import type { RefObject } from '@ts/core/r1/types';
import type { EffectReturn } from '@ts/core/r1/utils/effect_return';
import { combineClasses } from '@ts/core/r1/utils/render_utils';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '@ts/core/r1/utils/resolve_rtl';
import { createRef as infernoCreateRef } from 'inferno';

import type { BaseWidgetProps } from './base_props';
import { BaseWidgetDefaultProps } from './base_props';
import {
  subscribeToDxActiveEvent,
  subscribeToDxFocusInEvent,
  subscribeToDxFocusOutEvent,
  subscribeToDxHoverEndEvent,
  subscribeToDxHoverStartEvent,
  subscribeToDxInactiveEvent,
} from './utils/subscribe_to_event';

const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;

const getAria = (args: Record<string, unknown>): Record<string, string> => Object
  .keys(args)
  .reduce((r, key) => {
    if (args[key]) {
      return {
        ...r,
        [key === 'role' || key === 'id' ? key : `aria-${key}`]: String(args[key]),
      };
    }
    return r;
  }, {});

export interface WidgetProps extends BaseWidgetProps {
  rootElementRef?: RefObject<HTMLDivElement>;
  _feedbackHideTimeout?: number;
  _feedbackShowTimeout?: number;
  activeStateUnit?: string;
  cssText?: string;
  aria?: Record<string, string>;
  children?: JSX.Element | (JSX.Element | undefined | false | null)[];
  classes?: string | undefined;
  name?: string;
  addWidgetClass?: boolean;
  style?: Record<string, string | number>;
  onActive?: (e: Event) => void;
  onDimensionChanged?: () => void;
  onInactive?: (e: Event) => void;
  onVisibilityChange?: (args: boolean) => void;
  onFocusIn?: (e: Event) => void;
  onFocusOut?: (e: Event) => void;
  onHoverStart?: (e: Event) => void;
  onHoverEnd?: (e: Event) => void;
  onRootElementRendered?: (rootElement: HTMLDivElement) => void;
}

export const WidgetDefaultProps: WidgetProps = {
  ...BaseWidgetDefaultProps,
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: {},
  classes: '',
  name: '',
  addWidgetClass: true,
};

export class Widget extends InfernoWrapperComponent<WidgetProps> {
  public state = {
    active: false,
    focused: false,
    hovered: false,
  };

  public refs: any = null;

  // eslint-disable-next-line max-len
  public rootElementRef?: RefObject<HTMLDivElement> = infernoCreateRef();

  // eslint-disable-next-line max-len
  public widgetElementRef?: RefObject<HTMLDivElement> = infernoCreateRef();

  public config?: ConfigContextValue;

  constructor(props) {
    super(props);
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.activeEffect = this.activeEffect.bind(this);
    this.inactiveEffect = this.inactiveEffect.bind(this);
    this.clickEffect = this.clickEffect.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.focusInEffect = this.focusInEffect.bind(this);
    this.focusOutEffect = this.focusOutEffect.bind(this);
    this.hoverStartEffect = this.hoverStartEffect.bind(this);
    this.hoverEndEffect = this.hoverEndEffect.bind(this);
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.resizeEffect = this.resizeEffect.bind(this);
    this.windowResizeEffect = this.windowResizeEffect.bind(this);
    this.visibilityEffect = this.visibilityEffect.bind(this);
    this.checkDeprecation = this.checkDeprecation.bind(this);
    this.applyCssTextEffect = this.applyCssTextEffect.bind(this);
  }

  componentWillUpdate(nextProps: WidgetProps, nextState, context): void {
    super.componentWillUpdate(nextProps, nextState, context);
  }

  getConfig(): any {
    if (this.context[ConfigContext.id]) {
      return this.context[ConfigContext.id];
    }
    return ConfigContext.defaultValue;
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.setRootElementRef, []),
      new InfernoEffect(this.activeEffect, [
        this.props._feedbackShowTimeout,
        this.props.activeStateEnabled,
        this.props.activeStateUnit,
        this.props.disabled,
        this.props.onActive,
      ]),
      new InfernoEffect(this.inactiveEffect, [
        this.props._feedbackHideTimeout,
        this.props.activeStateEnabled,
        this.props.activeStateUnit,
        this.props.onInactive,
        this.state.active,
      ]),
      new InfernoEffect(this.clickEffect, [
        this.props.disabled,
        this.props.name,
        this.props.onClick,
      ]),
      new InfernoEffect(this.focusInEffect, [
        this.props.disabled,
        this.props.focusStateEnabled,
        this.props.name,
        this.props.onFocusIn,
      ]),
      new InfernoEffect(this.focusOutEffect, [
        this.props.focusStateEnabled,
        this.props.name,
        this.props.onFocusOut,
        this.state.focused,
      ]),
      new InfernoEffect(this.hoverStartEffect, [
        this.props.activeStateUnit,
        this.props.disabled,
        this.props.hoverStateEnabled,
        this.props.onHoverStart,
        this.state.active,
      ]),
      new InfernoEffect(this.hoverEndEffect, [
        this.props.activeStateUnit,
        this.props.hoverStateEnabled,
        this.props.onHoverEnd,
        this.state.hovered,
      ]),
      new InfernoEffect(this.keyboardEffect, [this.props.focusStateEnabled, this.props.onKeyDown]),
      new InfernoEffect(this.resizeEffect, [this.props.name, this.props.onDimensionChanged]),
      new InfernoEffect(this.windowResizeEffect, [this.props.onDimensionChanged]),
      new InfernoEffect(this.visibilityEffect, [this.props.name, this.props.onVisibilityChange]),
      new InfernoEffect(this.checkDeprecation, [this.props.height, this.props.width]),
      new InfernoEffect(this.applyCssTextEffect, [this.props.cssText]), createReRenderEffect(),
    ];
  }

  updateEffects(): void {
    this._effects[1]?.update([
      this.props._feedbackShowTimeout,
      this.props.activeStateEnabled,
      this.props.activeStateUnit,
      this.props.disabled,
      this.props.onActive,
    ]);
    this._effects[2]?.update([
      this.props._feedbackHideTimeout,
      this.props.activeStateEnabled,
      this.props.activeStateUnit,
      this.props.onInactive,
      this.state.active,
    ]);
    this._effects[3]?.update([
      this.props.disabled,
      this.props.name,
      this.props.onClick,
    ]);
    this._effects[4]?.update([
      this.props.disabled,
      this.props.focusStateEnabled,
      this.props.name,
      this.props.onFocusIn,
    ]);
    this._effects[5]?.update([
      this.props.focusStateEnabled,
      this.props.name,
      this.props.onFocusOut,
      this.state.focused,
    ]);
    this._effects[6]?.update([
      this.props.activeStateUnit,
      this.props.disabled,
      this.props.hoverStateEnabled,
      this.props.onHoverStart,
      this.state.active,
    ]);
    this._effects[7]?.update([
      this.props.activeStateUnit,
      this.props.hoverStateEnabled,
      this.props.onHoverEnd,
      this.state.hovered,
    ]);
    this._effects[8]?.update([
      this.props.focusStateEnabled,
      this.props.onKeyDown,
    ]);
    this._effects[9]?.update([
      this.props.name,
      this.props.onDimensionChanged,
    ]);
    this._effects[10]?.update([this.props.onDimensionChanged]);
    this._effects[11]?.update([this.props.name, this.props.onVisibilityChange]);
    this._effects[12]?.update([this.props.height, this.props.width]);
    this._effects[13]?.update([this.props.cssText]);
  }

  setRootElementRef(): void {
    const { rootElementRef, onRootElementRendered } = this.props;
    if (rootElementRef && this.widgetElementRef) {
      rootElementRef.current = this.widgetElementRef.current;
    }
    if (this?.widgetElementRef?.current) {
      onRootElementRendered?.(this.widgetElementRef.current);
    }
  }

  activeEffect(): EffectReturn {
    const {
      activeStateEnabled, activeStateUnit, disabled,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _feedbackShowTimeout, onActive,
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;

    if (activeStateEnabled) {
      if (!disabled) {
        return subscribeToDxActiveEvent(
          this.widgetElementRef?.current,
          (event: Event) => {
            this.setState({
              active: true,
            });
            onActive?.(event);
          },
          { timeout: _feedbackShowTimeout, selector },
          namespace,
        );
      }
    }

    return undefined;
  }

  inactiveEffect(): EffectReturn {
    const {
      activeStateEnabled, activeStateUnit,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _feedbackHideTimeout, onInactive,
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;

    if (activeStateEnabled) {
      return subscribeToDxInactiveEvent(
        this.widgetElementRef?.current,
        (event: Event) => {
          if (this.state.active) {
            this.setState({
              active: false,
            });
            onInactive?.(event);
          }
        },
        { timeout: _feedbackHideTimeout, selector },
        namespace,
      );
    }

    return undefined;
  }

  clickEffect(): EffectReturn {
    const { name, onClick, disabled } = this.props;
    const namespace = name;

    if (onClick && !disabled) {
      dxClick.on(this.widgetElementRef?.current, onClick, { namespace });
      return (): void => dxClick.off(this.widgetElementRef?.current, { namespace });
    }

    return undefined;
  }

  focusInEffect(): EffectReturn {
    const {
      disabled, focusStateEnabled, name, onFocusIn,
    } = this.props;
    const namespace = `${name}Focus`;

    if (focusStateEnabled) {
      if (!disabled) {
        return subscribeToDxFocusInEvent(
          this.widgetElementRef?.current,
          (event: Event & { isDefaultPrevented: () => boolean }) => {
            if (!event.isDefaultPrevented()) {
              this.setState({
                focused: true,
              });
              onFocusIn?.(event);
            }
          },
          null,
          namespace,
        );
      }
    }

    return undefined;
  }

  focusOutEffect(): EffectReturn {
    const {
      focusStateEnabled, name, onFocusOut,
    } = this.props;
    const namespace = `${name}Focus`;

    if (focusStateEnabled) {
      return subscribeToDxFocusOutEvent(
        this.widgetElementRef?.current,
        (event: Event & { isDefaultPrevented: () => boolean }) => {
          if (!event.isDefaultPrevented() && this.state.focused) {
            this.setState({
              focused: false,
            });
            onFocusOut?.(event);
          }
        },
        null,
        namespace,
      );
    }

    return undefined;
  }

  hoverStartEffect(): EffectReturn {
    const {
      activeStateUnit, hoverStateEnabled, disabled, onHoverStart,
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;

    if (hoverStateEnabled) {
      if (!disabled) {
        return subscribeToDxHoverStartEvent(
          this.widgetElementRef?.current,
          (event: Event) => {
            if (!this.state.active) {
              this.setState({
                hovered: true,
              });
            }
            onHoverStart?.(event);
          },
          { selector },
          namespace,
        );
      }
    }

    return undefined;
  }

  hoverEndEffect(): EffectReturn {
    const {
      activeStateUnit, hoverStateEnabled, onHoverEnd,
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;

    if (hoverStateEnabled) {
      return subscribeToDxHoverEndEvent(
        this.widgetElementRef?.current,
        (event: Event) => {
          if (this.state.hovered) {
            this.setState({
              hovered: false,
            });
            onHoverEnd?.(event);
          }
        },
        { selector },
        namespace,
      );
    }

    return undefined;
  }

  keyboardEffect(): EffectReturn {
    const { onKeyDown, focusStateEnabled } = this.props;

    if (focusStateEnabled && onKeyDown) {
      const id = keyboard.on(
        this.widgetElementRef?.current,
        this.widgetElementRef?.current,
        (e: Event): void => onKeyDown(e) as undefined,
      );

      return (): void => keyboard.off(id);
    }

    return undefined;
  }

  resizeEffect(): EffectReturn {
    const namespace = `${this.props.name}VisibilityChange`;
    const { onDimensionChanged } = this.props;

    if (onDimensionChanged) {
      resize.on(this.widgetElementRef?.current, onDimensionChanged, { namespace });
      return (): void => resize.off(this.widgetElementRef?.current, { namespace });
    }

    return undefined;
  }

  windowResizeEffect(): EffectReturn {
    const { onDimensionChanged } = this.props;

    if (onDimensionChanged) {
      resizeCallbacks.add(onDimensionChanged);

      return (): void => { resizeCallbacks.remove(onDimensionChanged); };
    }

    return undefined;
  }

  visibilityEffect(): EffectReturn {
    const { name, onVisibilityChange } = this.props;
    const namespace = `${name}VisibilityChange`;

    if (onVisibilityChange) {
      visibility.on(
        this.widgetElementRef?.current,
        (): void => onVisibilityChange(true),
        (): void => onVisibilityChange(false),
        { namespace },
      );

      return (): void => visibility.off(this.widgetElementRef?.current, { namespace });
    }

    return undefined;
  }

  checkDeprecation(): void {
    const { width, height } = this.props;
    if (isFunction(width)) {
      errors.log('W0017', 'width');
    }
    if (isFunction(height)) {
      errors.log('W0017', 'height');
    }
  }

  applyCssTextEffect(): void {
    const { cssText } = this.props;

    if (cssText !== undefined && cssText !== '' && this.widgetElementRef?.current) {
      this.widgetElementRef.current.style.cssText = cssText;
    }
  }

  getShouldRenderConfigProvider(): boolean {
    const { rtlEnabled } = this.props;
    return resolveRtlEnabledDefinition(rtlEnabled, this.config);
  }

  getRtlEnabled(): boolean | undefined {
    const { rtlEnabled } = this.props;
    return resolveRtlEnabled(rtlEnabled, this.config);
  }

  getAttributes(): Record<string, string> {
    const {
      aria,
      disabled,
      focusStateEnabled,
      visible,
    } = this.props;

    const accessKey = focusStateEnabled && !disabled && this.props.accessKey;

    const props = {
      ...extend({}, accessKey && { accessKey }) as Record<string, string>,
      ...getAria({ ...aria, disabled, hidden: !visible }),
      ...extend({}, this.getRestAttributes(
        this.props as Record<string, unknown>,
      )) as Record<string, string>,
    };
    return props;
  }

  getRestAttributes(props: Record<string, unknown>): Record<string, unknown> {
    const result = { ...props };

    [
      '_feedbackHideTimeout', '_feedbackShowTimeout', 'accessKey', 'activeStateEnabled', 'activeStateUnit', 'addWidgetClass', 'aria', 'children', 'className', 'classes', 'cssText', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'name', 'onActive', 'onClick', 'onDimensionChanged', 'onFocusIn', 'onFocusOut', 'onHoverEnd', 'onHoverStart', 'onInactive', 'onKeyDown', 'onRootElementRendered', 'onVisibilityChange', 'rootElementRef', 'rtlEnabled', 'tabIndex', 'visible', 'width',
    ].forEach((exclude) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete result[exclude];
    });

    return result;
  }

  getStyles(): Record<string, string | number> {
    const { width, height } = this.props;
    const style = this.props.style as Record<string, string | number> || {};
    const computedWidth = normalizeStyleProp('width', isFunction(width) ? width() : width);
    const computedHeight = normalizeStyleProp('height', isFunction(height) ? height() : height);

    return {
      ...style,
      height: computedHeight ?? style.height,
      width: computedWidth ?? style.width,
    };
  }

  getCssClasses(): string {
    const {
      classes,
      addWidgetClass,
      className,
      disabled,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      visible,
    } = this.props;

    const isFocusable = !!focusStateEnabled && !disabled;
    const isHoverable = !!hoverStateEnabled && !disabled;
    const canBeActive = !!activeStateEnabled && !disabled;
    const classesMap = {
      'dx-widget': !!addWidgetClass,
      [String(classes)]: !!classes,
      [String(className)]: !!className,
      'dx-state-disabled': !!disabled,
      'dx-state-invisible': !visible,
      'dx-state-focused': !!this.state.focused && isFocusable,
      'dx-state-active': !!this.state.active && canBeActive,
      'dx-state-hover': !!this.state.hovered && isHoverable && !this.state.active,
      'dx-rtl': !!this.props.rtlEnabled,
      'dx-visibility-change-handler': !!onVisibilityChange,
    };

    return combineClasses(classesMap);
  }

  getTabIndex(): undefined | number {
    const { focusStateEnabled, disabled, tabIndex } = this.props;
    const isFocusable = focusStateEnabled && !disabled;

    return isFocusable ? tabIndex : undefined;
  }

  focus(): void {
    focus.trigger(this.widgetElementRef?.current);
  }

  blur(): void {
    const activeElement = domAdapter.getActiveElement(this.widgetElementRef?.current);

    if (this.widgetElementRef?.current === activeElement) {
      activeElement.blur();
    }
  }

  activate(): void {
    this.setState({
      active: true,
    });
  }

  deactivate(): void {
    this.setState({
      active: false,
    });
  }

  render(): JSX.Element {
    const {
      hint,
      children,
    } = this.props;

    const widget = (
      <div
        ref={this.widgetElementRef}
        {...this.getAttributes()}
        tabIndex={this.getTabIndex()}
        title={hint}
        className={this.getCssClasses()}
        style={this.getStyles()}
      >
        {children}
      </div>
    );
    return (
      this.getShouldRenderConfigProvider()
        ? (
          <ConfigProvider rtlEnabled={this.getRtlEnabled()}>
            {widget}
          </ConfigProvider>
        )
        : widget
    );
  }
}
Widget.defaultProps = WidgetDefaultProps;
