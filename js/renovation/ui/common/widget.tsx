import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  InternalState,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  Slot,
} from 'devextreme-generator/component_declaration/common';
import '../../../events/click';
import '../../../events/hover';

import { focus } from '../../../events/short';
import { extend } from '../../../core/utils/extend';
import { focusable } from '../../../ui/widget/selectors';
import { isFakeClickEvent } from '../../../events/utils/index';
import { normalizeStyleProp } from '../../../core/utils/style';
import BaseWidgetProps from '../../utils/base_props';
import {
  subscribeHover, subscribeActive, subscribeFocus, subscribeDxClick,
  subscribeResize, subscribeVisibility, subscribeKeyboard,
} from '../../utils/subscribe_to_event';

const getAria = (args): { [name: string]: string } => Object.keys(args).reduce((r, key) => {
  if (args[key]) {
    return {
      ...r,
      [(key === 'role' || key === 'id') ? key : `aria-${key}`]: String(args[key]),
    };
  }
  return r;
}, {});

const getCssClasses = (model: Partial<Widget> & Partial<WidgetProps>) => {
  const className = ['dx-widget'];
  const isFocusable = model.focusStateEnabled && !model.disabled;
  const isHoverable = model.hoverStateEnabled && !model.disabled;

  model.classes && className.push(model.classes);
  model.className && className.push(model.className);
  model.disabled && className.push('dx-state-disabled');
  !model.visible && className.push('dx-state-invisible');
  model.focused && isFocusable && className.push('dx-state-focused');
  model.active && className.push('dx-state-active');
  model.hovered && isHoverable && !model.active && className.push('dx-state-hover');
  model.rtlEnabled && className.push('dx-rtl');
  model.onVisibilityChange && className.push('dx-visibility-change-handler');

  return className.join(' ');
};

export const viewFunction = (viewModel: Widget) => (
  <div
    ref={viewModel.widgetRef as any}
    {...viewModel.attributes} // eslint-disable-line react/jsx-props-no-spreading
    tabIndex={viewModel.tabIndex}
    title={viewModel.props.hint}
    hidden={!viewModel.props.visible}
    className={viewModel.cssClasses}
    style={viewModel.styles}
  >
    {viewModel.props.children}
  </div>
);

@ComponentBindings()
export class WidgetProps extends BaseWidgetProps {
  @OneWay() _feedbackHideTimeout?: number = 400;

  @OneWay() _feedbackShowTimeout?: number = 30;

  @OneWay() activeStateUnit?: string;

  @OneWay() aria?: any = {};

  @Slot() children?: any;

  @OneWay() classes?: string | undefined = '';

  @OneWay() className?: string = '';

  @OneWay() name?: string = '';

  @Event() onActive?: (e: any) => any;

  @Event() onDimensionChanged?: () => any;

  @Event() onInactive?: (e: any) => any;

  @Event() onKeyboardHandled?: (args: any) => any | undefined;

  @Event() onVisibilityChange?: (args: boolean) => undefined;
}

@Component({
  defaultOptionRules: null,
  jQuery: {
    register: true,
  },
  view: viewFunction,
})

export class Widget extends JSXComponent(WidgetProps) {
  @InternalState() active = false;

  @InternalState() focused = false;

  @InternalState() hovered = false;

  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  accessKeyEffect() {
    const { accessKey, focusStateEnabled, disabled } = this.props;
    const isFocusable = focusStateEnabled && !disabled;
    const canBeFocusedByKey = isFocusable && accessKey;

    if (canBeFocusedByKey) {
      return subscribeDxClick(this.widgetRef, (e) => {
        if (isFakeClickEvent(e)) {
          e.stopImmediatePropagation();
          this.focused = true;
        }
      });
    }

    return undefined;
  }

  @Effect()
  activeEffect() {
    const {
      activeStateEnabled, activeStateUnit, disabled, onInactive,
      _feedbackShowTimeout, _feedbackHideTimeout, onActive,
    } = this.props;
    const selector = activeStateUnit;
    return subscribeActive(
      !!(activeStateEnabled && !disabled),
      this.widgetRef,
      ({ event }) => {
        this.active = true;
          onActive?.(event);
      },
      ({ event }) => {
        this.active = false;
          onInactive?.(event);
      }, {
        hideTimeout: _feedbackHideTimeout,
        selector,
        showTimeout: _feedbackShowTimeout,
      },
    );
  }

  @Effect()
  clickEffect() {
    return subscribeDxClick(this.widgetRef, this.props.onClick);
  }

  @Method()
  focus() {
    focus.trigger(this.widgetRef);
  }

  @Effect()
  focusEffect() {
    const { disabled, focusStateEnabled } = this.props;
    const isFocusable = focusStateEnabled && !disabled;

    return subscribeFocus(
      !!isFocusable,
      this.widgetRef,
      (e) => { !e.isDefaultPrevented() && (this.focused = true); },
      (e) => { !e.isDefaultPrevented() && (this.focused = false); },
      {
        isFocusable: focusable,
      },
    );
  }

  @Effect()
  hoverEffect() {
    const { activeStateUnit, hoverStateEnabled, disabled } = this.props;
    const selector = activeStateUnit;
    const isHoverable = hoverStateEnabled && !disabled;
    return subscribeHover(
      !!isHoverable,
      this.widgetRef,
      () => { !this.active && (this.hovered = true); },
      () => { this.hovered = false; },
      { selector },
    );
  }

  @Effect()
  keyboardEffect() {
    const { focusStateEnabled, onKeyDown } = this.props;

    return subscribeKeyboard(!!focusStateEnabled, this.widgetRef, onKeyDown);
  }

  @Effect()
  resizeEffect() {
    const { onDimensionChanged } = this.props;
    return subscribeResize(this.widgetRef, onDimensionChanged);
  }

  @Effect()
  visibilityEffect() {
    const { onVisibilityChange } = this.props;
    return subscribeVisibility(
      !!onVisibilityChange,
      this.widgetRef,
      () => onVisibilityChange!(true),
      () => onVisibilityChange!(false),
    );
  }

  get attributes() {
    const {
      aria,
      disabled,
      focusStateEnabled,
      visible,
    } = this.props;

    const accessKey = focusStateEnabled && !disabled && this.props.accessKey;
    return {
      ...extend({}, this.restAttributes, accessKey && { accessKey }),
      ...getAria({ ...aria, disabled, hidden: !visible }),
    };
  }

  get styles() {
    const { width, height } = this.props;
    const style = this.restAttributes.style || {};

    const computedWidth = normalizeStyleProp('width', typeof width === 'function' ? width() : width);
    const computedHeight = normalizeStyleProp('height', typeof height === 'function' ? height() : height);

    return {
      ...style,
      height: computedHeight ?? style.height,
      width: computedWidth ?? style.width,
    };
  }

  get cssClasses() {
    const {
      classes,
      className,
      disabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      rtlEnabled,
      visible,
    } = this.props;

    return getCssClasses({
      active: this.active,
      focused: this.focused,
      hovered: this.hovered,
      className,
      classes,
      disabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      rtlEnabled,
      visible,
    });
  }

  get tabIndex() {
    const { focusStateEnabled, disabled, tabIndex } = this.props;
    const isFocusable = focusStateEnabled && !disabled;

    return isFocusable ? tabIndex : undefined;
  }
}
