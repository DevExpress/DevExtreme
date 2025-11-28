import { fx } from '@js/common/core/animation';
import { hideCallback as hideTopOverlayCallback } from '@js/common/core/environment/hide_callback';
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
import type { Properties } from '@js/ui/overlay';
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

const OVERLAY_CLASS = 'dx-overlay';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const INNER_OVERLAY_CLASS = 'dx-inner-overlay';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const ANONYMOUS_TEMPLATE_NAME = 'content';

const RTL_DIRECTION_CLASS = 'dx-rtl';

const OVERLAY_STACK: Overlay[] = [];

const PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';

const TAB_KEY = 'tab';

ready(() => {
  // @ts-expect-error
  eventsEngine.subscribeGlobal(domAdapter.getDocument(), pointerEvents.down, (e) => {
    for (let i = OVERLAY_STACK.length - 1; i >= 0; i--) {
      // @ts-expect-error
      if (!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});

interface OverlayProperties extends Properties {
  _loopFocus?: boolean;

  _ignorePreventScrollEventsDeprecation?: boolean;

  hideTopOverlayHandler?: () => void;

  _hideOnParentScrollTarget?: boolean;

  enableBodyScroll?: boolean;

  innerOverlay?: boolean;

  propagateOutsideClick?: boolean;

  restorePosition?: boolean;

  zIndex?: number;

  _fixWrapperPosition?: boolean;

  _skipContentPositioning?: boolean;

  visualContainer?: string | Element | null;

  container?: string | dxElementWrapper | Element;

  preventScrollEvents?: boolean;

  isRenovated?: boolean;
}

class Overlay<
  TProperties extends OverlayProperties = OverlayProperties,
> extends Widget<TProperties> {
  _$wrapper?: dxElementWrapper | null;

  _$content?: dxElementWrapper | null;

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

  _parentsScrollSubscriptionInfo?: any;

  _proxiedTabTerminatorHandler?: any;

  _zIndex!: number;

  _actions?: any;

  _isHidingActionCanceled?: boolean;

  _isShowingActionCanceled?: boolean;

  _isAnimationPaused?: boolean;

  _hideTopOverlayHandler!: () => void;

  _hideAnimationProcessing?: boolean;

  _showAnimationProcessing?: boolean;

  _keyboardListenerId?: string;

  _viewPortChangeHandle?: any;

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
      closeOnOutsideClick: false,
      hideOnOutsideClick: false,
      _ignorePreventScrollEventsDeprecation: false,
      onShowing: null,
      onShown: null,
      onHiding: null,
      onHidden: null,
      contentTemplate: 'content',
      innerOverlay: false,
      restorePosition: true,

      // NOTE: private options
      hideTopOverlayHandler: () => { this.hide(); },
      hideOnParentScroll: false,
      preventScrollEvents: true,
      onPositioned: null,
      propagateOutsideClick: false,
      ignoreChildEvents: true,
      _checkParentVisibility: true,
      _fixWrapperPosition: false,
      _loopFocus: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([{
      device(): boolean {
        return !windowUtils.hasWindow();
      },
      // @ts-expect-error ts-error
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

  $wrapper(): dxElementWrapper | null | undefined {
    return this._$wrapper;
  }

  // @ts-expect-error LSP
  _eventBindingTarget(): dxElementWrapper | null | undefined {
    return this._$content;
  }

  _setDeprecatedOptions(): void {
    super._setDeprecatedOptions();
    extend(this._deprecatedOptions, {
      closeOnOutsideClick: { since: '22.1', alias: 'hideOnOutsideClick' },
    });
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
    // @ts-expect-error ts-error
    this._initHideTopOverlayHandler(hideTopOverlayHandler);
    this._parentsScrollSubscriptionInfo = {
      handler: (e) => { this._hideOnParentsScrollHandler(e); },
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

    this._$content?.toggleClass(INNER_OVERLAY_CLASS, innerOverlay);
  }

  _initHideTopOverlayHandler(handler: () => void): void {
    this._hideTopOverlayHandler = handler;
  }

  // eslint-disable-next-line class-methods-use-this
  _getActionsList(): string[] {
    return ['onShowing', 'onShown', 'onHiding', 'onHidden', 'onPositioned', 'onVisualPositionChanged'];
  }

  _initActions(): void {
    this._actions = {};
    const actions = this._getActionsList();

    each(actions, (_, action) => {
      this._actions[action] = this._createActionByOption(action, {
        excludeValidators: ['disabled', 'readOnly'],
      }) || noop;
    });
  }

  _initHideOnOutsideClickHandler(): void {
    // @ts-expect-error ts-error
    this._proxiedDocumentDownHandler = (...args) => this._documentDownHandler(...args);
  }

  _initMarkup(): void {
    super._initMarkup();
    this._renderWrapperAttributes();
    this._initPositionController();
  }

  _documentDownHandler(e): boolean {
    if (this._showAnimationProcessing) {
      this._stopAnimation();
    }

    const { target } = e;
    const $target = $(target);

    const isTargetDocument = domUtils.contains(window.document, target);
    const isAttachedTarget = $(window.document).is($target) || isTargetDocument;
    const isInnerOverlay = $($target).closest(`.${INNER_OVERLAY_CLASS}`).length;
    const isTargetContent = this._$content?.is($target);
    const isTargetInContent = domUtils.contains(this._$content?.get(0), target);

    const isOutsideClick = isAttachedTarget
      && !isInnerOverlay
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      && !(isTargetContent || isTargetInContent);

    if (isOutsideClick && this._shouldHideOnOutsideClick(e)) {
      this._outsideClickHandler(e);
    }

    const { propagateOutsideClick } = this.option();

    return Boolean(propagateOutsideClick);
  }

  _shouldHideOnOutsideClick(e): boolean | undefined {
    const { hideOnOutsideClick } = this.option();

    if (isFunction(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }

    return hideOnOutsideClick;
  }

  _outsideClickHandler(e): void {
    if (this.option('shading')) {
      e.preventDefault();
    }

    this.hide();
  }

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

    for (let i = overlayStack.length - 1; i >= 0; i--) {
      const tabbableElements = overlayStack[i]._findTabbableBounds();

      if (tabbableElements.$first || tabbableElements.$last) {
        // @ts-ignore
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
    // @ts-expect-error ts-error
    return Overlay.baseZIndex();
  }

  _toggleViewPortSubscription(toggle: boolean): void {
    viewPortChanged.remove(this._viewPortChangeHandle);

    if (toggle) {
      this._viewPortChangeHandle = (...args) => {
        // @ts-expect-error ts-error
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

    const attributes = { ...wrapperAttr };
    const classNames = attributes.class;

    delete attributes.class;

    const $wrapper = this.$wrapper();

    $wrapper?.attr(attributes);

    if (this._customWrapperClass) {
      $wrapper?.removeClass(this._customWrapperClass);
    }

    $wrapper?.addClass(classNames);

    this._customWrapperClass = classNames;
  }

  _renderVisibilityAnimate(visible) {
    this._stopAnimation();

    return visible ? this._show() : this._hide();
  }

  _getAnimationConfig() {
    return this._getOptionValue('animation', this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _toggleBodyScroll(enabled?: boolean): void {}

  _animateShowing(): void {
    const animation = this._getAnimationConfig() ?? {};
    const showAnimation = this._normalizeAnimation(animation.show, 'to');
    const startShowAnimation = showAnimation?.start ?? noop;
    const completeShowAnimation = showAnimation?.complete ?? noop;

    this._animate(
      showAnimation,
      (...args) => {
        if (this._isAnimationPaused) {
          return;
        }
        if (this.option('focusStateEnabled')) {
          // @ts-expect-error
          eventsEngine.trigger(this._focusTarget(), 'focus');
        }

        completeShowAnimation.call(this, ...args);
        this._showAnimationProcessing = false;
        this._isHidden = false;
        this._actions.onShown();
        this._toggleSafariScrolling();
        this._showingDeferred.resolve();
      },
      (...args) => {
        if (this._isAnimationPaused) {
          return;
        }
        startShowAnimation.call(this, ...args);
        this._showAnimationProcessing = true;
      },
    );
  }

  _processShowingHidingCancel(cancelArg, applyFunction, cancelFunction) {
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
    } else {
      cancelArg ? cancelFunction() : applyFunction();
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
      const show = () => {
        this._stopAnimation();
        const { enableBodyScroll } = this.option();

        this._toggleBodyScroll(enableBodyScroll);
        this._toggleVisibility(true);
        this._$content?.css('visibility', 'hidden');
        this._$content?.toggleClass(INVISIBLE_STATE_CLASS, false);
        this._updateZIndexStackPosition(true);
        this._positionController.openingHandled();
        this._renderContent();

        const showingArgs = { cancel: false };
        this._actions.onShowing(showingArgs);

        const cancelShow = () => {
          this._toggleVisibility(false);
          this._$content?.css('visibility', '');
          this._$content?.toggleClass(INVISIBLE_STATE_CLASS, true);
          this._isShowingActionCanceled = true;
          this._moveFromContainer();
          this._toggleBodyScroll(true);
          this.option('visible', false);
          this._showingDeferred.resolve();
        };

        const applyShow = () => {
          this._$content?.css('visibility', '');
          this._renderVisibility(true);
          this._animateShowing();
        };

        this._processShowingHidingCancel(showingArgs.cancel, applyShow, cancelShow);
      };

      show();
    }

    return this._showingDeferred.promise();
  }

  _normalizeAnimation(showHideConfig, direction) {
    if (showHideConfig) {
      showHideConfig = extend({
        type: 'slide',
        skipElementInitialStyles: true, // NOTE: for fadeIn animation
      }, showHideConfig);

      if (isObject(showHideConfig[direction])) {
        extend(showHideConfig[direction], {
          position: this._positionController.position,
        });
      }
    }

    return showHideConfig;
  }

  _animateHiding() {
    const animation = this._getAnimationConfig() ?? {};
    const hideAnimation = this._normalizeAnimation(animation.hide, 'from');
    const startHideAnimation = hideAnimation?.start ?? noop;
    const completeHideAnimation = hideAnimation?.complete ?? noop;

    this._animate(
      hideAnimation,
      (...args) => {
        this._$content?.css('pointerEvents', '');
        this._renderVisibility(false);

        completeHideAnimation.call(this, ...args);
        this._hideAnimationProcessing = false;
        this._actions?.onHidden();

        this._hidingDeferred.resolve();
      },
      (...args) => {
        this._$content?.css('pointerEvents', 'none');
        startHideAnimation.call(this, ...args);
        this._hideAnimationProcessing = true;
      },
    );
  }

  _hide() {
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
      this._actions.onHiding(hidingArgs);

      this._toggleSafariScrolling();
      this._toggleBodyScroll(true);

      const cancelHide = () => {
        this._isHidingActionCanceled = true;
        const { enableBodyScroll } = this.option();

        this._toggleBodyScroll(enableBodyScroll);
        this.option('visible', true);
        this._hidingDeferred.resolve();
      };

      const applyHide = () => {
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
    const shouldResetActiveElement = !!this._$content?.find(activeElement).length;

    if (shouldResetActiveElement) {
      domUtils.resetActiveElement();
    }
  }

  _animate(animation, completeCallback, startCallback): void {
    if (animation) {
      const actualStartCallback = startCallback ?? animation.start ?? noop;

      const configuration = {
        ...animation,
        start: actualStartCallback,
        complete: completeCallback,
      };

      if (this._$content) {
        // @ts-expect-error this._$content
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fx.animate(this._$content, configuration);
      }
    } else {
      completeCallback();
    }
  }

  _stopAnimation(): void {
    if (this._$content) {
      // @ts-expect-error this._$content
      fx.stop(this._$content, true);
    }
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
      this._$content?.toggleClass(INVISIBLE_STATE_CLASS, !visible);
      this._updateZIndexStackPosition(visible);
      this._moveFromContainer();
    }
    this._toggleShading(visible);

    this._toggleSubscriptions(visible);
  }

  _handleZIndexOptionChanged(): void {
    const { zIndex } = this.option();

    this._zIndex = zIndex ?? zIndexPool.create(this._zIndexInitValue());

    this._updateZIndexStackPosition(this._isVisible());
  }

  _updateZIndexStackPosition(pushToStack: boolean): void {
    const overlayStack = this._overlayStack();
    // @ts-expect-error ts-error
    const index = overlayStack.indexOf(this);
    const isInStack = index !== -1;
    const { zIndex } = this.option();

    if (!pushToStack) {
      if (isInStack) {
        overlayStack.splice(index, 1);
        zIndexPool.remove(this._zIndex);
      }

      return;
    }

    if (!isInStack) {
      this._zIndex = zIndex ?? zIndexPool.create(this._zIndexInitValue());
      // @ts-expect-error this and Overlay have no overlap
      overlayStack.push(this);
    }

    this._updateZIndex();
  }

  _updateZIndex(): void {
    this._$wrapper?.css('zIndex', this._zIndex);
    this._$content?.css('zIndex', this._zIndex);
  }

  _toggleShading(visible?: boolean): void {
    const { shading, shadingColor } = this.option();

    this._$wrapper?.toggleClass(OVERLAY_SHADER_CLASS, visible && shading);
    // @ts-expect-error ts-error
    this._$wrapper?.css('backgroundColor', shading ? shadingColor : '');
    // @ts-expect-error ts-error
    this._toggleTabTerminator(visible && shading);
  }

  _initTabTerminatorHandler(): void {
    this._proxiedTabTerminatorHandler = (...args) => {
      // @ts-expect-error ts-error
      this._tabKeyHandler(...args);
    };
  }

  _toggleTabTerminator(enabled: boolean): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _loopFocus } = this.option();
    // @ts-expect-error ts-error
    const eventName = addNamespace('keydown', this.NAME);

    if (_loopFocus || enabled) {
      eventsEngine.on(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    } else {
      eventsEngine.off(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    }
  }

  _findTabbableBounds(): {
    $first: dxElementWrapper | null;
    $last: dxElementWrapper | null;
  } {
    const $elements = this._$wrapper?.find('*');
    const elementsCount = ($elements?.length ?? 0) - 1;

    let $first: dxElementWrapper | null = null;
    let $last: dxElementWrapper | null = null;

    for (let i = 0; i <= elementsCount; i += 1) {
      const $currentElement = $elements?.eq(i) ?? null;
      const $reverseElement = $elements?.eq(elementsCount - i) ?? null;

      // @ts-expect-error is should can get function as callback
      if (!$first && $currentElement.is(selectors.tabbable)) {
        $first = $currentElement;
      }

      // @ts-expect-error is should can get function as callback
      if (!$last && $reverseElement.is(selectors.tabbable)) {
        $last = $reverseElement;
      }

      if ($first && $last) {
        break;
      }
    }

    return { $first, $last };
  }

  _tabKeyHandler(e: KeyboardEvent): void {
    if (normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
      return;
    }

    const wrapper = this._$wrapper?.get(0) as HTMLElement;
    const activeElement = domAdapter.getActiveElement(wrapper);

    const {
      $first: $firstTabbable,
      $last: $lastTabbable,
    } = this._findTabbableBounds();

    const isTabOnLast = !e.shiftKey && activeElement === $lastTabbable?.get(0);
    const isShiftTabOnFirst = e.shiftKey && activeElement === $firstTabbable?.get(0);
    const isOutsideTarget = !domUtils.contains(wrapper, activeElement);

    const shouldPreventDefault = isTabOnLast || isShiftTabOnFirst || isOutsideTarget;

    if (shouldPreventDefault) {
      e.preventDefault();

      const $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;
      // @ts-expect-error ts-error
      eventsEngine.trigger($focusElement, 'focusin');
      // @ts-expect-error ts-error
      eventsEngine.trigger($focusElement, 'focus');
    }
  }

  _toggleSubscriptions(enabled: boolean): void {
    if (windowUtils.hasWindow()) {
      this._toggleHideTopOverlayCallback(enabled);
      this._toggleHideOnParentsScrollSubscription(enabled);
    }
  }

  _toggleHideTopOverlayCallback(subscribe): void {
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
    // @ts-expect-error ts-error
    const scrollEvent = addNamespace('scroll', this.NAME);
    const { prevTargets, handler } = this._parentsScrollSubscriptionInfo ?? {};

    eventsEngine.off(prevTargets, scrollEvent, handler);

    const hideOnScroll = this.option('hideOnParentScroll');

    if (needSubscribe && hideOnScroll) {
      let $parents = this._getHideOnParentScrollTarget()?.parents();
      if (devices.real().deviceType === 'desktop') {
        $parents = $parents?.add(window);
      }
      eventsEngine.on($parents, scrollEvent, handler);
      this._parentsScrollSubscriptionInfo.prevTargets = $parents;
    }
  }

  _hideOnParentsScrollHandler(e): void {
    let hideHandled = false;
    const hideOnScroll = this.option('hideOnParentScroll');
    if (isFunction(hideOnScroll)) {
      hideHandled = hideOnScroll(e);
    }

    if (!hideHandled && !this._showAnimationProcessing) {
      this.hide();
    }
  }

  _getHideOnParentScrollTarget(): dxElementWrapper | null | undefined {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _hideOnParentScrollTarget } = this.option();
    // @ts-expect-error ts-error
    const $hideOnParentScrollTarget = $(_hideOnParentScrollTarget);

    if ($hideOnParentScrollTarget.length) {
      return $hideOnParentScrollTarget;
    }

    return this._$wrapper;
  }

  _render(): void {
    super._render();

    this._appendContentToElement();
    this._renderVisibilityAnimate(this.option('visible'));
  }

  _appendContentToElement(): void {
    if (!this._$content?.parent().is(this.$element())) {
      this._$content?.appendTo(this.$element());
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
    // @ts-expect-error ts-error
    $parent.add($parent.parents()).each((index, element) => {
      const $element = $(element);
      // @ts-expect-error ts-error
      if ($element.css('display') === 'none') {
        isHidden = true;
        return false;
      }
    });

    return isHidden || !domAdapter.getBody().contains($parent.get(0));
  }

  _renderContentImpl(): Promise<void> {
    const whenContentRendered = Deferred();
    const contentTemplateOption = this.option('contentTemplate');
    const contentTemplate = this._getTemplate(contentTemplateOption);
    const transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;

    contentTemplate?.render({
      container: this.content(),
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
      if (this.option('visible')) {
        this._moveToContainer();
      }
    });

    // @ts-expect-error ts-error
    return whenContentRendered.promise();
  }

  _getPositionControllerConfig() {
    const {
      container,
      visualContainer,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _fixWrapperPosition,
      restorePosition,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _skipContentPositioning,
    } = this.option();
    // NOTE: position is passed to controller in renderGeometry to prevent window field using in server side mode

    return {
      container,
      visualContainer,
      $root: this.$element(),
      $content: this._$content,
      $wrapper: this._$wrapper,
      onPositioned: this._actions.onPositioned,
      onVisualPositionChanged: this._actions.onVisualPositionChanged,
      restorePosition,
      _fixWrapperPosition,
      _skipContentPositioning,
    };
  }

  _initPositionController(): void {
    this._positionController = new OverlayPositionController(
      // @ts-expect-error ts-error
      this._getPositionControllerConfig(),
    );
  }

  _toggleWrapperScrollEventsSubscription(enabled?: boolean): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace(dragEventMove, this.NAME);

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
        e._cancelPreventDefault = true;

        if (originalEvent && e.cancelable !== false && (!isMouseMove && !isWheel || isScrollByWheel)) {
          e.preventDefault();
        }
      });
    }
  }

  _moveFromContainer() {
    this._$content?.appendTo(this.$element());
    this._$wrapper?.detach();
  }

  _checkContainerExists() {
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

    if ($wrapperContainer !== undefined) {
      this._$wrapper?.appendTo($wrapperContainer);
    }

    if (this._$wrapper) {
      this._$content?.appendTo(this._$wrapper);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderGeometry(options?): void {
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
  _renderPosition(state?): void {
    this._positionController.positionContent();
  }

  _isAllWindowCovered(): boolean {
    const { shading } = this.option();
    const element = this._positionController.$visualContainer?.get(0);

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
    const isVisualContainerWindow = isWindow($visualContainer?.get(0));

    const wrapperWidth = isVisualContainerWindow
      ? documentElement.clientWidth
      : getOuterWidth($visualContainer);
    const wrapperHeight = isVisualContainerWindow
      ? window.innerHeight
      : getOuterHeight($visualContainer);

    this._$wrapper?.css({
      width: wrapperWidth,
      height: wrapperHeight,
    });
  }

  _renderDimensions(): void {
    const content = this._$content?.get(0);

    this._$content?.css({
      minWidth: this._getOptionValue('minWidth', content),
      maxWidth: this._getOptionValue('maxWidth', content),
      minHeight: this._getOptionValue('minHeight', content),
      maxHeight: this._getOptionValue('maxHeight', content),
      width: this._getOptionValue('width', content),
      height: this._getOptionValue('height', content),
    });
  }

  // @ts-expect-error LSP
  _focusTarget(): dxElementWrapper | null | undefined {
    return this._$content;
  }

  _attachKeyboardEvents(): void {
    this._keyboardListenerId = keyboard.on(
      this._$content,
      null,
      (opts) => this._keyboardHandler(opts),
    );
  }

  // @ts-expect-error ts-error
  _keyboardHandler(options): void {
    const e = options.originalEvent;
    const $target = $(e.target);

    if ($target.is(this._$content ?? '') || !this.option('ignoreChildEvents')) {
      // @ts-expect-error ts-error
      super._keyboardHandler(...arguments);
    }
  }

  _isVisible(): boolean {
    const { visible } = this.option();
    // @ts-expect-error ts-error
    return visible;
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      if (this.option('visible')) {
        this._renderVisibilityAnimate(visible);
      }
    } else {
      this._renderVisibilityAnimate(visible);
    }
  }

  _dimensionChanged(): void {
    this._renderGeometry();
  }

  _clean(): void {
    const { isRenovated } = this.option();
    if (!this._contentAlreadyRendered && !isRenovated) {
      this.$content()?.empty();
    }

    this._renderVisibility(false);
    this._cleanFocusState();
  }

  _dispose(): void {
    if (this._$content) {
      // @ts-expect-error this._$content
      fx.stop(this._$content, false);
    }

    this._toggleViewPortSubscription(false);
    this._toggleSubscriptions(false);
    this._updateZIndexStackPosition(false);
    this._toggleTabTerminator(false);

    super._dispose();

    this._toggleSafariScrolling();

    if (this._isVisible()) {
      zIndexPool.remove(this._zIndex);
    }

    this._positionController.clean();

    this._$wrapper?.remove();
    this._$content?.remove();

    this._actions = null;
    this._parentsScrollSubscriptionInfo = null;
    this._$wrapper = null;
    this._$content = null;
  }

  _toggleRTLDirection(rtl) {
    this._$content?.toggleClass(RTL_DIRECTION_CLASS, rtl);
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
        this._renderVisibilityAnimate(value)
          // @ts-expect-error ts-error
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
        this._toggleHideTopOverlayCallback(this.option('visible'));
        break;
      case 'zIndex':
        this._handleZIndexOptionChanged();
        break;
      case 'hideOnParentScroll':
      case '_hideOnParentScrollTarget': {
        const { visible } = this.option();

        this._toggleHideOnParentsScrollSubscription(visible);
        break;
      }
      case 'closeOnOutsideClick':
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

  toggle(showing?): Promise<unknown> {
    showing = showing === undefined ? !this.option('visible') : showing;
    const result = Deferred();

    if (showing === this.option('visible')) {
      // @ts-expect-error ts-error
      return result.resolveWith(this, [showing]).promise();
    }

    const animateDeferred = Deferred();
    this._animateDeferred = animateDeferred;
    this.option('visible', showing);

    animateDeferred.promise()
      // @ts-expect-error ts-error
      .done(() => {
        delete this._animateDeferred;
        // @ts-expect-error ts-error
        result.resolveWith(this, [this.option('visible')]);
      })
      .fail(() => {
        delete this._animateDeferred;
        result.reject();
      });

    return result.promise();
  }

  $content(): dxElementWrapper | null | undefined {
    return this._$content;
  }

  show(): Promise<unknown> {
    return this.toggle(true);
  }

  hide() {
    return this.toggle(false);
  }

  content() {
    return getPublicElement(this._$content as dxElementWrapper);
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
}
// @ts-expect-error
Overlay.baseZIndex = (zIndex) => zIndexPool.base(zIndex);

registerComponent('dxOverlay', Overlay);

export default Overlay;
