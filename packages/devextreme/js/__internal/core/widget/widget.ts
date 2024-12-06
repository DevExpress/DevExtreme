import '@js/common/core/events/click';
import '@js/common/core/events/core/emitter.feedback';
import '@js/common/core/events/hover';

import {
  active, focus, hover, keyboard,
} from '@js/common/core/events/short';
import Action from '@js/core/action';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { compare as compareVersions } from '@js/core/utils/version';
import { focusable as focusableSelector } from '@js/ui/widget/selectors';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import DOMComponent from './dom_component';
import type { OptionChanged } from './types';

const DISABLED_STATE_CLASS = 'dx-state-disabled';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

function setAttribute(name, value, target): void {
  // eslint-disable-next-line no-param-reassign
  name = name === 'role' || name === 'id' ? name : `aria-${name}`;
  // eslint-disable-next-line no-param-reassign
  value = isDefined(value) ? value.toString() : null;

  target.attr(name, value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Properties<TComponent = any> extends WidgetOptions<TComponent> {
  useResizeObserver?: boolean;
  onKeyboardHandled?: (event: KeyboardEvent) => void;
  isActive?: boolean;
  ignoreParentReadOnly?: boolean;
  hoveredElement?: dxElementWrapper;
}

class Widget<
  TProperties extends Properties = Properties,
> extends DOMComponent<Widget<TProperties>, TProperties> {
  private readonly _feedbackHideTimeout = 400;

  private readonly _feedbackShowTimeout = 30;

  private _contentReadyAction?: ((event?: Record<string, unknown>) => void) | null;

  private readonly _activeStateUnit!: string;

  private _keyboardListenerId?: string | null;

  private _isReady?: boolean;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  static getOptionsFromContainer({ name, fullName, value }) {
    let options = {};

    if (name === fullName) {
      options = value;
    } else {
      const option = fullName.split('.').pop();

      options[option] = value;
    }

    return options;
  }

  _supportedKeys():
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void | boolean> {
    return {};
  }

  _getDefaultOptions(): TProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      hoveredElement: null,
      isActive: false,

      disabled: false,

      visible: true,

      hint: undefined,

      activeStateEnabled: false,

      onContentReady: null,

      hoverStateEnabled: false,

      focusStateEnabled: false,

      tabIndex: 0,

      accessKey: undefined,

      onFocusIn: null,

      onFocusOut: null,
      onKeyboardHandled: null,
      ignoreParentReadOnly: false,
      useResizeObserver: true,
    });
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([{
      device(): boolean {
        const device = devices.real();
        const { platform } = device;
        const { version } = device;
        return platform === 'ios' && compareVersions(version, '13.3') <= 0;
      },
      // @ts-expect-error
      options: {
        useResizeObserver: false,
      },
    }]);
  }

  _init(): void {
    super._init();
    this._initContentReadyAction();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _innerWidgetOptionChanged(innerWidget, args): void {
    const options = Widget.getOptionsFromContainer(args);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/prefer-optional-chain
    innerWidget && innerWidget.option(options);
    this._options.cache(args.name, options);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _bindInnerWidgetOptions(innerWidget, optionsContainer): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const syncOptions = (): void => this._options.silent(
      optionsContainer,
      extend({}, innerWidget.option()),
    );

    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _getAriaTarget(): dxElementWrapper {
    return this._focusTarget();
  }

  _initContentReadyAction(): void {
    this._contentReadyAction = this._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initMarkup(): void {
    const { disabled, visible } = this.option();

    this.$element().addClass('dx-widget');

    this._toggleDisabledState(disabled);
    this._toggleVisibility(visible);
    this._renderHint();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._isFocusable() && this._renderFocusTarget();

    super._initMarkup();
  }

  _render(): void {
    super._render();

    this._renderContent();
    this._renderFocusState();
    this._attachFeedbackEvents();
    this._attachHoverEvents();
    this._toggleIndependentState();
  }

  _renderHint(): void {
    const { hint } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.$element().attr('title', hint || null);
  }

  _renderContent(): void {
    // eslint-disable-next-line no-void
    deferRender(() => (!this._disposed ? this._renderContentImpl() : void 0))
      // @ts-expect-error
      // eslint-disable-next-line no-void, @typescript-eslint/no-unsafe-return
      .done(() => (!this._disposed ? this._fireContentReadyAction() : void 0));
  }

  _renderContentImpl(): void {}

  _fireContentReadyAction(): Promise<void> | DeferredObj<void> | void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferRender(() => this._contentReadyAction?.());
  }

  _dispose(): void {
    this._contentReadyAction = null;
    this._detachKeyboardEvents();

    super._dispose();
  }

  _resetActiveState(): void {
    this._toggleActiveState(this._eventBindingTarget(), false);
  }

  _clean(): void {
    this._cleanFocusState();
    this._resetActiveState();
    super._clean();
    this.$element().empty();
  }

  _toggleVisibility(visible: boolean | undefined): void {
    this.$element().toggleClass(INVISIBLE_STATE_CLASS, !visible);
  }

  _renderFocusState(): void {
    this._attachKeyboardEvents();

    if (this._isFocusable()) {
      this._renderFocusTarget();
      this._attachFocusEvents();
      this._renderAccessKey();
    }
  }

  _renderAccessKey(): void {
    const $el = this._focusTarget();
    const { accessKey } = this.option();

    // @ts-expect-error
    $el.attr('accesskey', accessKey);
  }

  _isFocusable(): boolean | undefined {
    const { focusStateEnabled, disabled } = this.option();

    return focusStateEnabled && !disabled;
  }

  _eventBindingTarget(): dxElementWrapper {
    return this.$element();
  }

  _focusTarget(): dxElementWrapper {
    return this._getActiveElement();
  }

  _isFocusTarget(element: Element): boolean {
    const focusTargets = $(this._focusTarget()).toArray();
    return focusTargets.includes(element);
  }

  _findActiveTarget($element: dxElementWrapper): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return $element.find(this._activeStateUnit).not(`.${DISABLED_STATE_CLASS}`);
  }

  _getActiveElement(): dxElementWrapper {
    const activeElement = this._eventBindingTarget();

    if (this._activeStateUnit) {
      return this._findActiveTarget(activeElement);
    }

    return activeElement;
  }

  _renderFocusTarget(): void {
    const { tabIndex } = this.option();

    // @ts-expect-error
    this._focusTarget().attr('tabIndex', tabIndex);
  }

  _keyboardEventBindingTarget(): dxElementWrapper {
    return this._eventBindingTarget();
  }

  _refreshFocusEvent(): void {
    this._detachFocusEvents();
    this._attachFocusEvents();
  }

  _focusEventTarget(): dxElementWrapper {
    return this._focusTarget();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _focusInHandler(event): void {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption('onFocusIn', {
        beforeExecute: () => this._updateFocusState(event, true),
        excludeValidators: ['readOnly'],
      })({ event });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _focusOutHandler(event): void {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption('onFocusOut', {
        beforeExecute: () => this._updateFocusState(event, false),
        excludeValidators: ['readOnly', 'disabled'],
      })({ event });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _updateFocusState({ target }, isFocused: boolean): void {
    if (this._isFocusTarget(target)) {
      this._toggleFocusClass(isFocused, $(target));
    }
  }

  _toggleFocusClass(isFocused: boolean, $element?: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const $focusTarget = $element && $element.length ? $element : this._focusTarget();

    $focusTarget.toggleClass(FOCUSED_STATE_CLASS, isFocused);
  }

  _hasFocusClass(element?: dxElementWrapper): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const $focusTarget = $(element ?? this._focusTarget());

    return $focusTarget.hasClass(FOCUSED_STATE_CLASS);
  }

  _isFocused(): boolean {
    return this._hasFocusClass();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[] {
    return [];
  }

  _attachKeyboardEvents(): void {
    this._detachKeyboardEvents();

    const { focusStateEnabled, onKeyboardHandled } = this.option();
    const hasChildListeners = this._getKeyboardListeners().length;
    const hasKeyboardEventHandler = !!onKeyboardHandled;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldAttach = focusStateEnabled || hasChildListeners || hasKeyboardEventHandler;

    if (shouldAttach) {
      this._keyboardListenerId = keyboard.on(
        this._keyboardEventBindingTarget(),
        this._focusTarget(),
        (opts) => this._keyboardHandler(opts),
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _keyboardHandler(options, onlyChildProcessing?: boolean): boolean {
    if (!onlyChildProcessing) {
      const { originalEvent, keyName, which } = options;
      // @ts-expect-error
      const keys = this._supportedKeys(originalEvent);
      const func = keys[keyName] || keys[which];

      if (func !== undefined) {
        const handler = func.bind(this);
        const result = handler(originalEvent, options);

        if (!result) {
          return false;
        }
      }
    }

    const keyboardListeners = this._getKeyboardListeners();
    const { onKeyboardHandled } = this.option();

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-optional-chain
    keyboardListeners.forEach((listener) => listener && listener._keyboardHandler(options));

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/prefer-optional-chain
    onKeyboardHandled && onKeyboardHandled(options);

    return true;
  }

  _refreshFocusState(): void {
    this._cleanFocusState();
    this._renderFocusState();
  }

  _cleanFocusState(): void {
    const $element = this._focusTarget();

    $element.removeAttr('tabIndex');
    this._toggleFocusClass(false);
    this._detachFocusEvents();
    this._detachKeyboardEvents();
  }

  _detachKeyboardEvents(): void {
    keyboard.off(this._keyboardListenerId);
    this._keyboardListenerId = null;
  }

  _attachHoverEvents(): void {
    const { hoverStateEnabled } = this.option();
    const selector = this._activeStateUnit;
    const namespace = 'UIFeedback';
    const $el = this._eventBindingTarget();

    hover.off($el, { selector, namespace });

    if (hoverStateEnabled) {
      hover.on($el, new Action(({ event, element }) => {
        this._hoverStartHandler(event);
        this.option('hoveredElement', $(element));
      }, { excludeValidators: ['readOnly'] }), (event) => {
        this.option('hoveredElement', null);
        this._hoverEndHandler(event);
      }, { selector, namespace });
    }
  }

  _attachFeedbackEvents(): void {
    const { activeStateEnabled } = this.option();
    const selector = this._activeStateUnit;
    const namespace = 'UIFeedback';
    const $el = this._eventBindingTarget();

    active.off($el, { namespace, selector });

    if (activeStateEnabled) {
      active.on(
        $el,
        new Action(({ event, element }) => this._toggleActiveState($(element), true, event)),
        new Action(
          ({ event, element }) => this._toggleActiveState($(element), false, event),
          { excludeValidators: ['disabled', 'readOnly'] },
        ),
        {
          showTimeout: this._feedbackShowTimeout,
          hideTimeout: this._feedbackHideTimeout,
          selector,
          namespace,
        },
      );
    }
  }

  _detachFocusEvents(): void {
    const $el = this._focusEventTarget();

    focus.off($el, { namespace: `${this.NAME}Focus` });
  }

  _attachFocusEvents(): void {
    const $el = this._focusEventTarget();

    focus.on(
      $el,
      (e) => this._focusInHandler(e),
      (e) => this._focusOutHandler(e),
      {
        namespace: `${this.NAME}Focus`,
        // @ts-expect-error
        isFocusable: (index, el) => $(el).is(focusableSelector),
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hoverStartHandler(event: unknown): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hoverEndHandler(event: unknown): void {}

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event?: Record<string, unknown>,
  ): void {
    this.option('isActive', value);
    $element.toggleClass('dx-state-active', value);
  }

  _updatedHover(): void {
    const hoveredElement = this._options.silent('hoveredElement');

    this._hover(hoveredElement, hoveredElement);
  }

  _findHoverTarget($el?: dxElementWrapper): dxElementWrapper | undefined {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-optional-chain
    return $el && $el.closest(this._activeStateUnit || this._eventBindingTarget());
  }

  _hover($el: dxElementWrapper | undefined, $previous: dxElementWrapper | undefined): void {
    const { hoverStateEnabled, disabled, isActive } = this.option();

    // eslint-disable-next-line no-param-reassign
    $previous = this._findHoverTarget($previous);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/prefer-optional-chain
    $previous && $previous.toggleClass('dx-state-hover', false);

    if ($el && hoverStateEnabled && !disabled && !isActive) {
      const newHoveredElement = this._findHoverTarget($el);

      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/prefer-optional-chain
      newHoveredElement && newHoveredElement.toggleClass('dx-state-hover', true);
    }
  }

  _toggleDisabledState(value: boolean | undefined): void {
    this.$element().toggleClass(DISABLED_STATE_CLASS, Boolean(value));
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.setAria('disabled', value || undefined);
  }

  _toggleIndependentState(): void {
    const { ignoreParentReadOnly } = this.option();

    this.$element().toggleClass('dx-state-independent', ignoreParentReadOnly);
  }

  _setWidgetOption(widgetName: 'string', args: Record<string, unknown>): void {
    if (!this[widgetName]) {
      return;
    }

    if (isPlainObject(args[0])) {
      // @ts-expect-error
      each(args[0], (option, value) => this._setWidgetOption(widgetName, [option, value]));

      return;
    }

    const optionName = args[0];
    let value = args[1];

    if (args.length === 1) {
      value = this.option(optionName);
    }

    const widgetOptionMap = this[`${widgetName}OptionMap`];

    this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value);
  }

  _optionChanged(args: OptionChanged<TProperties> | Record<string, unknown>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'disabled':
        this._toggleDisabledState(value as Properties[typeof name]);
        this._updatedHover();
        this._refreshFocusState();
        break;
      case 'hint':
        this._renderHint();
        break;
      case 'ignoreParentReadOnly':
        this._toggleIndependentState();
        break;
      case 'activeStateEnabled':
        this._attachFeedbackEvents();
        break;
      case 'hoverStateEnabled':
        this._attachHoverEvents();
        this._updatedHover();
        break;
      case 'tabIndex':
      case 'focusStateEnabled':
        this._refreshFocusState();
        break;
      case 'onFocusIn':
      case 'onFocusOut':
      case 'useResizeObserver':
        break;
      case 'accessKey':
        this._renderAccessKey();
        break;
      case 'hoveredElement':
        this._hover(value as Properties[typeof name], previousValue as Properties[typeof name]);
        break;
      case 'isActive':
        this._updatedHover();
        break;
      case 'visible':
        this._toggleVisibility(value as Properties[typeof name]);
        if (this._isVisibilityChangeSupported()) {
          // TODO hiding works wrong
          this._checkVisibilityChanged(value ? 'shown' : 'hiding');
        }
        break;
      case 'onKeyboardHandled':
        this._attachKeyboardEvents();
        break;
      case 'onContentReady':
        this._initContentReadyAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _isVisible(): boolean {
    const { visible } = this.option();

    // @ts-expect-error
    return super._isVisible() && visible;
  }

  beginUpdate(): void {
    this._ready(false);
    super.beginUpdate();
  }

  endUpdate(): void {
    super.endUpdate();

    if (this._initialized) {
      this._ready(true);
    }
  }

  _ready(value?: boolean): boolean {
    if (arguments.length === 0) {
      return !!this._isReady;
    }

    this._isReady = !!value;

    return this._isReady;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setAria(...args): void {
    if (!isPlainObject(args[0])) {
      setAttribute(args[0], args[1], args[2] || this._getAriaTarget());
    } else {
      const target = args[1] || this._getAriaTarget();

      each(args[0], (name, value) => setAttribute(name, value, target));
    }
  }

  isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ready();
  }

  repaint(): void {
    this._refresh();
  }

  focus(): void {
    focus.trigger(this._focusTarget());
  }

  registerKeyHandler(key: string, handler: () => void): void {
    const currentKeys = this._supportedKeys();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, max-len
    this._supportedKeys = (): Record<string, (e) => boolean> => extend(currentKeys, { [key]: handler });
  }
}

export default Widget;
