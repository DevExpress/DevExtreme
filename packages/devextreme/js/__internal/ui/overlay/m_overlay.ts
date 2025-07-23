import type { AnimationConfig } from '@js/common/core/animation';
import { fx } from '@js/common/core/animation';
import { hideCallback as hideTopOverlayCallback } from '@js/common/core/environment/hide_callback';
import type { EventInfo } from '@js/common/core/events';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  move as dragEventMove,
} from '@js/common/core/events/drag';
import pointerEvents from '@js/common/core/events/pointer';
import { keyboard } from '@js/common/core/events/short';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '@js/common/core/events/utils/index';
import { triggerHidingEvent, triggerResizeEvent, triggerShownEvent } from '@js/common/core/events/visibility_change';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import errors from '@js/core/errors';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import browser from '@js/core/utils/browser';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import {
  isFunction, isObject, isPromise, isWindow,
} from '@js/core/utils/type';
import { changeCallback } from '@js/core/utils/view_port';
import type { DxEvent } from '@js/events';
import type { dxOverlayAnimation, Properties } from '@js/ui/overlay';
import { tabbable } from '@js/ui/widget/selectors';
import uiErrors from '@js/ui/widget/ui.errors';
import domUtils from '@ts/core/utils/m_dom';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import windowUtils from '../../core/utils/m_window';
import { OVERLAY_POSITION_ALIASES, OverlayPositionController } from './m_overlay_position_controller';
import * as zIndexPool from './m_z_index';

const ready = readyCallbacks.add;
const window = windowUtils.getWindow();
const viewPortChanged = changeCallback;

const OVERLAY_STACK: Overlay[] = [];
const ANONYMOUS_TEMPLATE_NAME = 'content';
const TAB_KEY = 'tab';

const OVERLAY_CLASS = 'dx-overlay';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
export const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const INNER_OVERLAY_CLASS = 'dx-inner-overlay';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const RTL_DIRECTION_CLASS = 'dx-rtl';
const PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';

type AnimationDirection = 'to' | 'from';
type PointerLikeEvent = DxEvent<MouseEvent | PointerEvent | TouchEvent>;
type EventHandler = (e: PointerLikeEvent) => boolean | undefined;
type TabTerminatorHandler = (e: KeyboardEvent) => void;

interface ParentsScrollSubscriptionInfo {
  handler?: (e: Event) => void;
  target?: Element | Document;
  prevTargets?: dxElementWrapper;
}

interface OverlayProperties extends Properties {
  container?: string | dxElementWrapper | Element;

  visualContainer?: string | Element | null;

  innerOverlay?: boolean;

  propagateOutsideClick?: boolean;

  restorePosition?: boolean;

  preventScrollEvents?: boolean;

  enableBodyScroll?: boolean;

  _loopFocus?: boolean;

  _ignorePreventScrollEventsDeprecation?: boolean;

  _fixWrapperPosition?: boolean;

  _skipContentPositioning?: boolean;

  _hideOnParentScrollTarget?: string | Element | dxElementWrapper;

  hideTopOverlayHandler?: () => void;
}

export interface OverlayActions {
  onShowing?: OverlayProperties['onShowing'];
  onShown?: OverlayProperties['onShown'];
  onHiding?: OverlayProperties['onHiding'];
  onHidden?: OverlayProperties['onHidden'];
  onPositioned?: (e: EventInfo<Overlay>) => void;
  onVisualPositionChanged?: (e: EventInfo<Overlay>) => void;
}

ready(() => {
  const callback = (e: PointerLikeEvent): void => {
    for (let i = OVERLAY_STACK.length - 1; i >= 0; i -= 1) {
      if (!OVERLAY_STACK[i]._proxiedDocumentDownHandler?.(e)) {
        return;
      }
    }
  };

  // @ts-expect-error subscribeGlobal should be described in .d.ts
  eventsEngine.subscribeGlobal(
    domAdapter.getDocument(),
    pointerEvents.down,
    callback,
  );
});

class Overlay<
  TProperties extends OverlayProperties = OverlayProperties,
> extends Widget<TProperties> {
  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _contentAlreadyRendered?: boolean;

  _positionController!: OverlayPositionController;

  _animateDeferred?: DeferredObj<unknown>;

  _hidingDeferred!: DeferredObj<unknown>;

  _showingDeferred!: DeferredObj<unknown>;

  _customWrapperClass?: string | null;

  _isHidden?: boolean;

  _currentVisible?: boolean;

  _cachedBodyScrollTop?: number;

  _parentHidden?: boolean;

  _parentsScrollSubscriptionInfo?: ParentsScrollSubscriptionInfo;

  _proxiedTabTerminatorHandler?: TabTerminatorHandler;

  _zIndex!: number;

  _actions?: OverlayActions;

  _isHidingActionCanceled?: boolean;

  _isShowingActionCanceled?: boolean;

  _isAnimationPaused?: boolean;

  _hideTopOverlayHandler!: () => void;

  _hideAnimationProcessing?: boolean;

  _showAnimationProcessing?: boolean;

  _keyboardListenerId?: string;

  _viewPortChangeHandle?: () => void;

  _proxiedDocumentDownHandler?: EventHandler;

  _supportedKeys(): Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void> {
    return {
      ...super._supportedKeys(),
      escape(): void {
        this.hide();
      },
    };
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: false,
      visible: false,
      deferRendering: true,
      shading: true,
      shadingColor: '',
      wrapperAttr: {},
      position: extend({}, OVERLAY_POSITION_ALIASES.center),
      width: '80vw',
      minWidth: null,
      maxWidth: null,
      height: '80vh',
      minHeight: null,
      maxHeight: null,
      animation: {
        show: {
          type: 'pop',
          duration: 300,
          from: {
            scale: 0.55,
          },
        },
        hide: {
          type: 'pop',
          duration: 300,
          from: {
            opacity: 1,
            scale: 1,
          },
          to: {
            opacity: 0,
            scale: 0.55,
          },
        },
      },
      hideOnOutsideClick: false,
      onShowing: null,
      onShown: null,
      onHiding: null,
      onHidden: null,
      contentTemplate: 'content',
      innerOverlay: false,
      restorePosition: true,
      hideOnParentScroll: false,
      preventScrollEvents: true,
      onPositioned: null,
      propagateOutsideClick: false,
      ignoreChildEvents: true,
      _checkParentVisibility: true,
      _fixWrapperPosition: false,
      _loopFocus: false,
      _ignorePreventScrollEventsDeprecation: false,
      // NOTE: private option
      hideTopOverlayHandler: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.hide();
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([{
      device(): boolean {
        return !windowUtils.hasWindow();
      },
      // @ts-expect-error overload
      options: {
        width: null,
        height: null,
        animation: null,
        _checkParentVisibility: false,
      },
    }]);
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      animation: true,
    });
  }

  $wrapper(): dxElementWrapper {
    return this._$wrapper;
  }

  _eventBindingTarget(): dxElementWrapper {
    return this._$content;
  }

  ctor(element: Element, options: TProperties): void {
    super.ctor(element, options);

    if (options) {
      if ('preventScrollEvents' in options && !options._ignorePreventScrollEventsDeprecation) {
        this._logDeprecatedPreventScrollEventsInfo();
      }
    }
  }

  _logDeprecatedPreventScrollEventsInfo(): void {
    this._logDeprecatedOptionWarning('preventScrollEvents', {
      since: '23.1',
      message: 'If you enable this option, end-users may experience scrolling issues.',
    });
  }

  _init(): void {
    super._init();
    this._initActions();
    this._initHideOnOutsideClickHandler();
    this._initTabTerminatorHandler();

    this._customWrapperClass = null;
    this._$wrapper = $('<div>').addClass(OVERLAY_WRAPPER_CLASS);
    this._$content = $('<div>').addClass(OVERLAY_CONTENT_CLASS);
    this._initInnerOverlayClass();

    const $element = this.$element();
    $element.addClass(OVERLAY_CLASS);

    this._$wrapper.attr('data-bind', 'dxControlsDescendantBindings: true');

    this._toggleViewPortSubscription(true);

    const { hideTopOverlayHandler } = this.option();

    this._initHideTopOverlayHandler(hideTopOverlayHandler);

    this._parentsScrollSubscriptionInfo = {
      handler: (e): void => {
        this._hideOnParentsScrollHandler(e);
      },
    };

    this.warnPositionAsFunction();
  }

  warnPositionAsFunction(): void {
    if (isFunction(this.option('position'))) { // position as function deprecated in 21.2
      errors.log('W0018');
    }
  }

  _initInnerOverlayClass(): void {
    const { innerOverlay } = this.option();

    this._$content.toggleClass(INNER_OVERLAY_CLASS, innerOverlay);
  }

  _initHideTopOverlayHandler(handler?: () => void): void {
    if (handler) {
      this._hideTopOverlayHandler = handler;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getActionsList(): string[] {
    return [
      'onShowing',
      'onShown',
      'onHiding',
      'onHidden',
      'onPositioned',
      'onVisualPositionChanged',
    ];
  }

  _initActions(): void {
    this._actions = {};

    const actions = this._getActionsList();

    each(actions, (_, action) => {
      if (this._actions) {
        this._actions[action] = this._createActionByOption(action, {
          excludeValidators: ['disabled', 'readOnly'],
        }) || noop;
      }
    });
  }

  _initHideOnOutsideClickHandler(): void {
    this._proxiedDocumentDownHandler = (
      e: PointerLikeEvent,
    ): boolean => this._documentDownHandler(e);
  }

  _initMarkup(): void {
    super._initMarkup();
    this._renderWrapperAttributes();
    this._initPositionController();
  }

  _documentDownHandler(e: PointerLikeEvent): boolean {
    if (this._showAnimationProcessing) {
      this._stopAnimation();
    }

    const { target } = e;
    const $target = $(target);

    const isTargetDocument = domUtils.contains(window.document, target);
    const isAttachedTarget = $(window.document).is($target) || isTargetDocument;
    const isInnerOverlay = $($target).closest(`.${INNER_OVERLAY_CLASS}`).length;
    const isTargetContent = this._$content.is($target);
    const isTargetInContent = domUtils.contains(this._$content.get(0), target);

    const isOutsideClick = isAttachedTarget
      && !isInnerOverlay
      && !(isTargetContent || isTargetInContent);

    if (isOutsideClick && this._shouldHideOnOutsideClick(e)) {
      this._outsideClickHandler(e);
    }

    const { propagateOutsideClick } = this.option();

    return Boolean(propagateOutsideClick);
  }

  _shouldHideOnOutsideClick(e: PointerLikeEvent): boolean {
    const { hideOnOutsideClick } = this.option();

    if (isFunction(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }

    return Boolean(hideOnOutsideClick);
  }

  _outsideClickHandler(e: PointerLikeEvent): void {
    if (this.option('shading')) {
      e.preventDefault();
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hide();
  }

  // eslint-disable-next-line class-methods-use-this
  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      content: new EmptyTemplate(),
    });

    super._initTemplates();
  }

  _isTopOverlay(): boolean {
    const overlayStack = this._overlayStack();

    for (let i = overlayStack.length - 1; i >= 0; i -= 1) {
      const tabbableElements = overlayStack[i]._findTabbableBounds();

      if (tabbableElements.first || tabbableElements.last) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore expected: types Overlay<OverlayProperties> and this have no overlap
        return overlayStack[i] === this;
      }
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  _overlayStack(): Overlay[] {
    return OVERLAY_STACK;
  }

  // eslint-disable-next-line class-methods-use-this
  _zIndexInitValue(): number {
    return Overlay.baseZIndex();
  }

  _toggleViewPortSubscription(toggle: boolean): void {
    if (this._viewPortChangeHandle) {
      viewPortChanged.remove(this._viewPortChangeHandle);
    }

    if (toggle) {
      this._viewPortChangeHandle = (...args): void => {
        this._viewPortChangeHandler(...args);
      };

      viewPortChanged.add(this._viewPortChangeHandle);
    }
  }

  _viewPortChangeHandler(): void {
    this._positionController.updateContainer(this.option('container'));
    this._refresh();
  }

  _renderWrapperAttributes(): void {
    const { wrapperAttr } = this.option();
    const attributes = extend({}, wrapperAttr);
    const classNames = attributes.class;

    delete attributes.class;

    // @ts-expect-error object is possible undefined
    this.$wrapper()
      .attr(attributes)
      // @ts-expect-error .attr() type returns string
      .removeClass(this._customWrapperClass)
      .addClass(classNames);

    this._customWrapperClass = classNames;
  }

  _renderVisibilityAnimate(visible: boolean): DeferredObj<unknown> | Promise<unknown> {
    this._stopAnimation();

    return visible ? this._show() : this._hide();
  }

  _getAnimationConfig(): dxOverlayAnimation {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getOptionValue('animation', this) ?? {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _toggleBodyScroll(enabled?: boolean): void {}

  _animateShowing(): void {
    const animation = this._getAnimationConfig();
    const showAnimation = this._normalizeAnimation(animation.show, 'to');
    const startShowAnimation = showAnimation?.start ?? noop;
    const completeShowAnimation = showAnimation?.complete ?? noop;

    const completeCallback = (element: HTMLElement, config: AnimationConfig): void => {
      if (this._isAnimationPaused) {
        return;
      }

      if (this.option('focusStateEnabled')) {
        // @ts-expect-error trigger should be typed on type 'EventsEngineType'
        eventsEngine.trigger(this._focusTarget(), 'focus');
      }

      completeShowAnimation.call(this, element, config);

      this._showAnimationProcessing = false;
      this._isHidden = false;
      // @ts-expect-error onShown should provide event
      this._actions?.onShown?.();
      this._toggleSafariScrolling();
      this._showingDeferred.resolve();
    };

    const startCallback = (element: HTMLElement, config: AnimationConfig): void => {
      if (this._isAnimationPaused) {
        return;
      }
      startShowAnimation.call(this, element, config);
      this._showAnimationProcessing = true;
    };

    this._animate(
      showAnimation,
      completeCallback,
      startCallback,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  _processShowingHidingCancel(
    cancelArg: boolean | Promise<boolean>,
    applyFunction: () => void,
    cancelFunction: () => void,
  ): void {
    if (isPromise(cancelArg)) {
      cancelArg
        .then((shouldCancel) => {
          if (shouldCancel) {
            cancelFunction();
          } else {
            applyFunction();
          }
        })
        .catch(() => applyFunction());
    } else if (cancelArg) {
      cancelFunction();
    } else {
      applyFunction();
    }
  }

  _show(): DeferredObj<unknown> | Promise<unknown> {
    this._showingDeferred = Deferred();
    this._parentHidden = this._isParentHidden();

    this._showingDeferred.done(() => {
      delete this._parentHidden;
    });

    if (this._parentHidden) {
      this._isHidden = true;
      return this._showingDeferred.resolve();
    }

    if (this._currentVisible) {
      return Deferred().resolve().promise();
    }

    this._currentVisible = true;

    if (this._isHidingActionCanceled) {
      delete this._isHidingActionCanceled;
      this._showingDeferred.reject();
    } else {
      const show = (): void => {
        this._stopAnimation();
        const { enableBodyScroll } = this.option();

        this._toggleBodyScroll(enableBodyScroll);
        this._toggleVisibility(true);
        this._$content.css('visibility', 'hidden');
        this._$content.toggleClass(INVISIBLE_STATE_CLASS, false);
        this._updateZIndexStackPosition(true);
        this._positionController.openingHandled();
        this._renderContent();

        const showingArgs = { cancel: false };

        // @ts-expect-error onShowing should provide event
        this._actions?.onShowing?.(showingArgs);

        const cancelShow = (): void => {
          this._toggleVisibility(false);
          this._$content.css('visibility', '');
          this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);
          this._isShowingActionCanceled = true;
          this._moveFromContainer();
          this._toggleBodyScroll(true);
          this.option('visible', false);
          this._showingDeferred.resolve();
        };

        const applyShow = (): void => {
          this._$content.css('visibility', '');
          this._renderVisibility(true);
          this._animateShowing();
        };

        this._processShowingHidingCancel(showingArgs.cancel, applyShow, cancelShow);
      };

      show();
    }

    return this._showingDeferred.promise();
  }

  _normalizeAnimation(
    showHideConfig: AnimationConfig | undefined,
    direction: AnimationDirection,
  ): AnimationConfig | undefined {
    if (showHideConfig) {
      const configuration = extend({
        type: 'slide',
        skipElementInitialStyles: true, // NOTE: for fadeIn animation
      }, showHideConfig);

      if (isObject(configuration[direction])) {
        extend(configuration[direction], {
          position: this._positionController.position,
        });
      }

      return configuration as AnimationConfig;
    }

    return undefined;
  }

  _animateHiding(): void {
    const animation = this._getAnimationConfig();
    const hideAnimation = this._normalizeAnimation(animation.hide, 'from');
    const startHideAnimation = hideAnimation?.start ?? noop;
    const completeHideAnimation = hideAnimation?.complete ?? noop;

    const completeCallback = (element: HTMLElement, config: AnimationConfig): void => {
      this._$content.css('pointerEvents', '');
      this._renderVisibility(false);

      completeHideAnimation.call(this, element, config);

      this._hideAnimationProcessing = false;
      // @ts-expect-error onHidden should provide event
      this._actions?.onHidden?.();

      this._hidingDeferred.resolve();
    };

    const startCallback = (element: HTMLElement, config: AnimationConfig): void => {
      this._$content.css('pointerEvents', 'none');
      startHideAnimation.call(this, element, config);
      this._hideAnimationProcessing = true;
    };

    this._animate(
      hideAnimation,
      completeCallback,
      startCallback,
    );
  }

  _hide(): DeferredObj<unknown> | Promise<unknown> {
    if (!this._currentVisible) {
      return Deferred().resolve().promise();
    }
    this._currentVisible = false;

    this._hidingDeferred = Deferred();
    const hidingArgs = { cancel: false };

    if (this._isShowingActionCanceled) {
      delete this._isShowingActionCanceled;

      this._hidingDeferred.reject();
    } else {
      // @ts-expect-error onHiding should provide event
      this._actions?.onHiding?.(hidingArgs);

      this._toggleSafariScrolling();
      this._toggleBodyScroll(true);

      const cancelHide = (): void => {
        this._isHidingActionCanceled = true;

        const { enableBodyScroll } = this.option();

        this._toggleBodyScroll(enableBodyScroll);
        this.option('visible', true);
        this._hidingDeferred.resolve();
      };

      const applyHide = (): void => {
        this._forceFocusLost();
        this._toggleShading(false);
        this._toggleSubscriptions(false);
        this._animateHiding();
      };

      this._processShowingHidingCancel(hidingArgs.cancel, applyHide, cancelHide);
    }

    return this._hidingDeferred.promise();
  }

  _forceFocusLost(): void {
    const activeElement = domAdapter.getActiveElement();
    const shouldResetActiveElement = !!this._$content.find(activeElement).length;

    if (shouldResetActiveElement) {
      domUtils.resetActiveElement();
    }
  }

  _animate(
    animation: AnimationConfig | undefined,
    completeCallback: (element: HTMLElement, config: AnimationConfig) => void,
    startCallback?: (element: HTMLElement, config: AnimationConfig) => void,
  ): void {
    if (animation) {
      const actualStartCallback = startCallback ?? animation.start ?? noop;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fx.animate(this._$content.get(0), extend({}, animation, {
        start: actualStartCallback,
        complete: completeCallback,
      }));
    } else {
      // @ts-expect-error complate in AnimationConfig contains required params
      completeCallback();
    }
  }

  _stopAnimation(): void {
    fx.stop(this._$content.get(0), true);
  }

  _renderVisibility(visible: boolean): void {
    if (visible && this._isParentHidden()) {
      return;
    }

    this._currentVisible = visible;
    this._stopAnimation();

    if (!visible) {
      triggerHidingEvent(this._$content);
    }

    if (visible) {
      this._checkContainerExists();
      this._moveToContainer();
      this._renderGeometry();

      triggerShownEvent(this._$content);
      triggerResizeEvent(this._$content);
    } else {
      this._toggleVisibility(visible);
      this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible);
      this._updateZIndexStackPosition(visible);
      this._moveFromContainer();
    }

    this._toggleShading(visible);
    this._toggleSubscriptions(visible);
  }

  _updateZIndexStackPosition(pushToStack: boolean): void {
    const overlayStack = this._overlayStack();
    const index = overlayStack.indexOf(this as unknown as Overlay);

    if (pushToStack) {
      if (index === -1) {
        this._zIndex = zIndexPool.create(this._zIndexInitValue());
        overlayStack.push(this as unknown as Overlay);
      }

      this._$wrapper.css('zIndex', this._zIndex);
      this._$content.css('zIndex', this._zIndex);
    } else if (index !== -1) {
      overlayStack.splice(index, 1);
      zIndexPool.remove(this._zIndex);
    }
  }

  _toggleShading(visible?: boolean): void {
    const { shading, shadingColor } = this.option();

    this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && shading);
    this._$wrapper.css('backgroundColor', shading ? shadingColor ?? '' : '');
    this._toggleTabTerminator(!!(visible && shading));
  }

  _initTabTerminatorHandler(): void {
    this._proxiedTabTerminatorHandler = (e: KeyboardEvent): void => {
      this._tabKeyHandler(e);
    };
  }

  _toggleTabTerminator(enabled: boolean): void {
    const { _loopFocus: loopFocus } = this.option();
    const eventName = addNamespace('keydown', this.NAME as string);

    if (loopFocus || enabled) {
      eventsEngine.on(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    } else {
      this._destroyTabTerminator();
    }
  }

  _destroyTabTerminator(): void {
    const eventName = addNamespace('keydown', this.NAME as string);
    eventsEngine.off(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
  }

  _findTabbableBounds(): { first: dxElementWrapper | null; last: dxElementWrapper | null } {
    const $elements = this._$wrapper.find('*');
    const elementsCount = $elements.length - 1;

    let first: dxElementWrapper | null = null;
    let last: dxElementWrapper | null = null;

    for (let i = 0; i <= elementsCount; i += 1) {
      const currentElement = $elements.eq(i);
      const reverseElement = $elements.eq(elementsCount - i);

      if (!first && currentElement.length && tabbable(i, currentElement.get(0))) {
        first = currentElement;
      }

      if (!last && reverseElement.length && tabbable(elementsCount - i, reverseElement.get(0))) {
        last = reverseElement;
      }

      if (first && last) {
        break;
      }
    }

    return { first, last };
  }

  _tabKeyHandler(e: KeyboardEvent): void {
    if (normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
      return;
    }

    const wrapper = this._$wrapper.get(0) as HTMLElement;
    const activeElement = domAdapter.getActiveElement(wrapper);

    const { first: $firstTabbable, last: $lastTabbable } = this._findTabbableBounds();

    const isTabOnLast = !e.shiftKey && activeElement === $lastTabbable?.get(0);
    const isShiftTabOnFirst = e.shiftKey && activeElement === $firstTabbable?.get(0);
    const isOutsideTarget = !domUtils.contains(wrapper, activeElement);

    const shouldPreventDefault = isTabOnLast || isShiftTabOnFirst || isOutsideTarget;

    if (shouldPreventDefault) {
      e.preventDefault();

      const $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;

      // @ts-expect-error trigger should be typed on type 'EventsEngineType'
      eventsEngine.trigger($focusElement, 'focusin');
      // @ts-expect-error trigger should be typed on type 'EventsEngineType'
      eventsEngine.trigger($focusElement, 'focus');
    }
  }

  _toggleSubscriptions(enabled: boolean): void {
    if (windowUtils.hasWindow()) {
      this._toggleHideTopOverlayCallback(enabled);
      this._toggleHideOnParentsScrollSubscription(enabled);
    }
  }

  _toggleHideTopOverlayCallback(subscribe: boolean): void {
    if (!this._hideTopOverlayHandler) {
      return;
    }

    if (subscribe) {
      hideTopOverlayCallback.add(this._hideTopOverlayHandler);
    } else {
      hideTopOverlayCallback.remove(this._hideTopOverlayHandler);
    }
  }

  _toggleHideOnParentsScrollSubscription(needSubscribe?: boolean): void {
    const scrollEvent = addNamespace('scroll', this.NAME as string);
    const { prevTargets, handler } = this._parentsScrollSubscriptionInfo ?? {};

    eventsEngine.off(prevTargets, scrollEvent, handler);

    const hideOnScroll = this.option('hideOnParentScroll');

    if (needSubscribe && hideOnScroll) {
      let $parents = this._getHideOnParentScrollTarget().parents();

      if (devices.real().deviceType === 'desktop') {
        $parents = $parents.add(window);
      }

      eventsEngine.on($parents, scrollEvent, handler);

      this._parentsScrollSubscriptionInfo = {
        ...this._parentsScrollSubscriptionInfo ?? {},
        prevTargets: $parents,
      };
    }
  }

  _hideOnParentsScrollHandler(e: Event): void {
    let hideHandled = false;

    const hideOnScroll = this.option('hideOnParentScroll');

    if (isFunction(hideOnScroll)) {
      hideHandled = hideOnScroll(e);
    }

    if (!hideHandled && !this._showAnimationProcessing) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hide();
    }
  }

  _getHideOnParentScrollTarget(): dxElementWrapper {
    const { _hideOnParentScrollTarget: target } = this.option();
    const $hideOnParentScrollTarget = $(target);

    if ($hideOnParentScrollTarget.length) {
      return $hideOnParentScrollTarget;
    }

    return this._$wrapper;
  }

  _render(): void {
    super._render();

    this._appendContentToElement();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderVisibilityAnimate(Boolean(this.option('visible')));
  }

  _appendContentToElement(): void {
    if (!this._$content.parent().is(this.$element())) {
      this._$content.appendTo(this.$element());
    }
  }

  _renderContent(): void {
    const shouldDeferRendering = !this._currentVisible && this.option('deferRendering');
    const isParentHidden = this.option('visible') && this._isParentHidden();

    if (isParentHidden) {
      this._isHidden = true;
      return;
    }

    if (this._contentAlreadyRendered || shouldDeferRendering) {
      return;
    }

    this._contentAlreadyRendered = true;
    this._appendContentToElement();

    super._renderContent();
  }

  _isParentHidden(): boolean {
    if (!this.option('_checkParentVisibility')) {
      return false;
    }

    if (this._parentHidden !== undefined) {
      return this._parentHidden;
    }

    const $parent = this.$element().parent();

    if ($parent.is(':visible')) {
      return false;
    }

    let isHidden = false;

    // @ts-expect-error add should can get dxElementWrapper
    $parent.add($parent.parents()).each((index, element) => {
      const $element = $(element);

      // @ts-expect-error css should can get 1 argument
      if ($element.css('display') === 'none') {
        isHidden = true;
        return false;
      }

      return undefined;
    });

    return isHidden || !domAdapter.getBody().contains($parent.get(0));
  }

  _renderContentImpl(): Promise<void> {
    const whenContentRendered = Deferred();
    const contentTemplateOption = this.option('contentTemplate');
    const contentTemplate = this._getTemplate(contentTemplateOption);
    const transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;

    contentTemplate?.render({
      container: getPublicElement(this.$content()),
      noModel: true,
      transclude,
      onRendered: () => {
        whenContentRendered.resolve();

        // NOTE: T1114344
        if (this.option('templatesRenderAsynchronously')) {
          this._dimensionChanged();
        }
      },
    });

    const { preventScrollEvents } = this.option();

    this._toggleWrapperScrollEventsSubscription(preventScrollEvents);

    whenContentRendered.done(() => {
      this._processContentRendering();
    });

    // @ts-expect-error Promise should be typed as Promise<T>
    return whenContentRendered.promise();
  }

  _processContentRendering(): void {
    if (this.option('visible')) {
      this._moveToContainer();
    }
  }

  _getPositionControllerConfig(): Record<string, unknown> {
    const {
      container,
      visualContainer,
      restorePosition,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _fixWrapperPosition,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _skipContentPositioning,
    } = this.option();
    // NOTE: position is passed to controller in renderGeometry
    // to prevent window field using in server side mode
    return {
      container,
      visualContainer,
      restorePosition,
      $root: this.$element(),
      $content: this._$content,
      $wrapper: this._$wrapper,
      onPositioned: this._actions?.onPositioned,
      onVisualPositionChanged: this._actions?.onVisualPositionChanged,
      _fixWrapperPosition,
      _skipContentPositioning,
    };
  }

  _initPositionController(): void {
    this._positionController = new OverlayPositionController(
      this._getPositionControllerConfig(),
    );
  }

  _toggleWrapperScrollEventsSubscription(enabled?: boolean): void {
    const eventName = addNamespace(dragEventMove, this.NAME as string);

    eventsEngine.off(this._$wrapper, eventName);

    if (enabled) {
      eventsEngine.on(this._$wrapper, eventName, {
        validate() {
          return true;
        },
        getDirection() {
          return 'both';
        },
        _toggleGestureCover(toggle) {
          if (!toggle) {
            this._toggleGestureCoverImpl(toggle);
          }
        },
        _clearSelection: noop,
        isNative: true,
      }, (e) => {
        const { originalEvent } = e.originalEvent;
        const { type } = originalEvent || {};
        const isWheel = type === 'wheel';
        const isMouseMove = type === 'mousemove';
        const isScrollByWheel = isWheel && !isCommandKeyPressed(e);
        const isNotMouseOrWheel = !isMouseMove && !isWheel;

        e._cancelPreventDefault = true;

        if (originalEvent && e.cancelable !== false && (isNotMouseOrWheel || isScrollByWheel)) {
          e.preventDefault();
        }
      });
    }
  }

  _moveFromContainer(): void {
    this._$content.appendTo(this.$element());
    this._$wrapper.detach();
  }

  _checkContainerExists(): void {
    const $wrapperContainer = this._positionController.$container;

    // NOTE: The container is undefined when DOM is not ready yet. See T1143527
    if ($wrapperContainer === undefined) {
      return;
    }

    const containerExists = $wrapperContainer.length > 0;

    if (!containerExists) {
      uiErrors.log('W1021', this.NAME);
    }
  }

  _moveToContainer(): void {
    const $wrapperContainer = this._positionController.$container;

    this._$wrapper.appendTo($wrapperContainer);
    this._$content.appendTo(this._$wrapper);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderGeometry(options?: Record<string, unknown>): void {
    const { visible } = this.option();

    if (visible && windowUtils.hasWindow()) {
      this._stopAnimation();
      this._renderGeometryImpl();
    }
  }

  _renderGeometryImpl(): void {
    // NOTE: position can be specified as a function which needs to be called strict on render start
    this._positionController.updatePosition(this._getOptionValue('position'));
    this._renderWrapper();
    this._renderDimensions();
    this._renderPosition();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderPosition(state?: unknown): void {
    this._positionController.positionContent();
  }

  _isAllWindowCovered(): boolean {
    const { shading } = this.option();
    const element = this._positionController.$visualContainer.get(0);

    return isWindow(element) && Boolean(shading);
  }

  _toggleSafariScrolling(): void {
    const visible = this.option('visible');
    const $body = $(domAdapter.getBody());
    const isIosSafari = devices.real().platform === 'ios' && browser.safari;
    const isAllWindowCovered = this._isAllWindowCovered();
    const isScrollingPrevented = $body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS);

    const shouldPreventScrolling = !isScrollingPrevented
      && visible
      && isAllWindowCovered;

    const shouldEnableScrolling = isScrollingPrevented
      && (!visible || !isAllWindowCovered || this._disposed);

    if (isIosSafari) {
      if (shouldEnableScrolling) {
        $body.removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
        window.scrollTo(0, this._cachedBodyScrollTop);
        this._cachedBodyScrollTop = undefined;
      } else if (shouldPreventScrolling) {
        this._cachedBodyScrollTop = window.pageYOffset;
        $body.addClass(PREVENT_SAFARI_SCROLLING_CLASS);
      }
    }
  }

  _renderWrapper(): void {
    this._positionController.styleWrapperPosition();
    this._renderWrapperDimensions();
    this._positionController.positionWrapper();
  }

  _renderWrapperDimensions(): void {
    const { $visualContainer } = this._positionController;
    const documentElement = domAdapter.getDocumentElement();
    const isVisualContainerWindow = isWindow($visualContainer.get(0));

    const wrapperWidth = isVisualContainerWindow
      ? documentElement.clientWidth
      : getOuterWidth($visualContainer);

    const wrapperHeight = isVisualContainerWindow
      ? window.innerHeight
      : getOuterHeight($visualContainer);

    this._$wrapper.css({
      width: wrapperWidth,
      height: wrapperHeight,
    });
  }

  _renderDimensions(): void {
    const content = this._$content.get(0);

    this._$content.css({
      minWidth: this._getOptionValue('minWidth', content),
      maxWidth: this._getOptionValue('maxWidth', content),
      minHeight: this._getOptionValue('minHeight', content),
      maxHeight: this._getOptionValue('maxHeight', content),
      width: this._getOptionValue('width', content),
      height: this._getOptionValue('height', content),
    });
  }

  _focusTarget(): dxElementWrapper {
    return this._$content;
  }

  _attachKeyboardEvents(): void {
    this._keyboardListenerId = keyboard.on(
      this._$content,
      null,
      (options) => this._keyboardHandler(options),
    );
  }

  // @ts-expect-error return type in base class is not void
  _keyboardHandler(options: { originalEvent: Event }, onlyChildProcessing?: boolean): void {
    const e = options.originalEvent;
    const $target = $(e.target as Element);

    if ($target.is(this._$content) || !this.option('ignoreChildEvents')) {
      super._keyboardHandler(options, onlyChildProcessing);
    }
  }

  _isVisible(): boolean {
    const { visible } = this.option();
    return Boolean(visible);
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      if (this.option('visible')) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._renderVisibilityAnimate(visible);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._renderVisibilityAnimate(visible);
    }
  }

  _dimensionChanged(): void {
    this._renderGeometry();
  }

  _clean(): void {
    if (!this._contentAlreadyRendered) {
      this.$content().empty();
    }

    this._renderVisibility(false);
    this._cleanFocusState();
  }

  _dispose(): void {
    fx.stop(this._$content.get(0), false);

    this._toggleViewPortSubscription(false);
    this._toggleSubscriptions(false);
    this._updateZIndexStackPosition(false);

    this._actions = undefined;
    this._parentsScrollSubscriptionInfo = undefined;

    super._dispose();

    this._toggleSafariScrolling();

    if (this.option('visible')) {
      zIndexPool.remove(this._zIndex);
    }

    this._$wrapper.remove();
    this._$content.remove();

    this._destroyTabTerminator();
  }

  _toggleRTLDirection(rtl: boolean): void {
    this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { value, name } = args;

    if (this._getActionsList().includes(name)) {
      this._initActions();
      return;
    }

    switch (name) {
      case 'animation':
        break;
      case '_loopFocus':
      case 'shading': {
        const { visible } = this.option();

        this._toggleShading(visible);
        this._toggleSafariScrolling();
        break;
      }
      case 'shadingColor': {
        const { visible } = this.option();

        this._toggleShading(visible);
        break;
      }
      case 'width':
      case 'height':
        this._renderGeometry();
        break;
      case 'minWidth':
      case 'maxWidth':
      case 'minHeight':
      case 'maxHeight':
        this._renderGeometry();
        break;
      case 'position':
        this._positionController.updatePosition(this.option('position'));
        this._positionController.restorePositionOnNextRender(true);
        this._renderGeometry();
        this._toggleSafariScrolling();
        break;
      case 'visible':
        this._renderVisibilityAnimate(Boolean(value))
          // @ts-expect-error done should be typed
          .done(() => this._animateDeferred?.resolveWith(this))
          .fail(() => this._animateDeferred?.reject());
        break;
      case 'container':
        this._positionController.updateContainer(value);
        this._invalidate();
        this._toggleSafariScrolling();
        break;
      case 'visualContainer':
        this._positionController.updateVisualContainer(value);
        this._renderWrapper();
        this._toggleSafariScrolling();
        break;
      case 'innerOverlay':
        this._initInnerOverlayClass();
        break;
      case 'deferRendering':
      case 'contentTemplate':
        this._contentAlreadyRendered = false;
        this._clean();
        this._invalidate();
        break;
      case 'hideTopOverlayHandler':
        this._toggleHideTopOverlayCallback(false);
        // @ts-expect-error ts-error
        this._initHideTopOverlayHandler(value);
        this._toggleHideTopOverlayCallback(Boolean(this.option('visible')));
        break;
      case 'hideOnParentScroll':
      case '_hideOnParentScrollTarget': {
        const { visible } = this.option();

        this._toggleHideOnParentsScrollSubscription(visible);
        break;
      }
      case 'hideOnOutsideClick':
      case 'propagateOutsideClick':
        break;
      case 'rtlEnabled':
        this._contentAlreadyRendered = false;
        super._optionChanged(args);
        break;
      case '_fixWrapperPosition':
        this._positionController.fixWrapperPosition = value;
        break;
      case 'wrapperAttr':
        this._renderWrapperAttributes();
        break;
      case 'restorePosition':
        this._positionController.restorePosition = value;
        break;
      case 'preventScrollEvents':
        this._logDeprecatedPreventScrollEventsInfo();
        // @ts-expect-error ts-error
        this._toggleWrapperScrollEventsSubscription(value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  toggle(showing?: boolean): Promise<boolean> {
    const isShowing = showing ?? !this.option('visible');
    const result = Deferred<boolean>();

    if (isShowing === Boolean(this.option('visible'))) {
      // @ts-expect-error this
      return result.resolveWith(this, [isShowing]).promise();
    }

    const animateDeferred = Deferred();
    this._animateDeferred = animateDeferred;

    this.option('visible', isShowing);

    animateDeferred.promise()
      // @ts-expect-error done shpuld be typed
      .done(() => {
        delete this._animateDeferred;

        // @ts-expect-error this
        result.resolveWith(this, [Boolean(this.option('visible'))]);
      })
      .fail(() => {
        delete this._animateDeferred;

        result.reject();
      });

    return result.promise();
  }

  $content(): dxElementWrapper {
    return this._$content;
  }

  show(): Promise<boolean> {
    return this.toggle(true);
  }

  hide(): Promise<boolean> {
    return this.toggle(false);
  }

  content(): Element {
    return getPublicElement(this._$content);
  }

  repaint(): void {
    if (this._contentAlreadyRendered) {
      this._positionController.restorePositionOnNextRender(true);
      this._renderGeometry({ forceStopAnimation: true });
      triggerResizeEvent(this._$content);
    } else {
      super.repaint();
    }
  }

  static baseZIndex(zIndex?: number): number {
    return zIndexPool.base(zIndex);
  }
}

registerComponent('dxOverlay', Overlay);

export default Overlay;
