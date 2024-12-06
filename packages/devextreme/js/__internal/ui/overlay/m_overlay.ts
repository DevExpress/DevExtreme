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
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import browser from '@js/core/utils/browser';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import {
  isFunction, isObject, isPromise, isWindow,
} from '@js/core/utils/type';
import { changeCallback } from '@js/core/utils/view_port';
import type OverlayInstance from '@js/ui/overlay';
import { tabbable } from '@js/ui/widget/selectors';
import uiErrors from '@js/ui/widget/ui.errors';
import Widget from '@js/ui/widget/ui.widget';
import domUtils from '@ts/core/utils/m_dom';

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

const OVERLAY_STACK = [];

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

// @ts-expect-error
const Overlay: typeof OverlayInstance = Widget.inherit({
  _supportedKeys() {
    return extend(this.callBase(), {
      escape() {
        this.hide();
      },
    });
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
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

      container: undefined,

      visualContainer: undefined,

      // NOTE: private options
      hideTopOverlayHandler: () => { this.hide(); },
      hideOnParentScroll: false,

      preventScrollEvents: true,

      onPositioned: null,
      propagateOutsideClick: false,
      ignoreChildEvents: true,
      _checkParentVisibility: true,
      _hideOnParentScrollTarget: undefined,
      _fixWrapperPosition: false,
      _loopFocus: false,
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return !windowUtils.hasWindow();
      },
      options: {
        width: null,
        height: null,
        animation: null,
        _checkParentVisibility: false,
      },
    }]);
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      animation: true,
    });
  },

  $wrapper() {
    return this._$wrapper;
  },

  _eventBindingTarget() {
    return this._$content;
  },

  _setDeprecatedOptions() {
    this.callBase();
    extend(this._deprecatedOptions, {
      closeOnOutsideClick: { since: '22.1', alias: 'hideOnOutsideClick' },
    });
  },

  ctor(element, options) {
    this.callBase(element, options);

    if (options) {
      if ('preventScrollEvents' in options && !options._ignorePreventScrollEventsDeprecation) {
        this._logDeprecatedPreventScrollEventsInfo();
      }
    }
  },

  _logDeprecatedPreventScrollEventsInfo() {
    this._logDeprecatedOptionWarning('preventScrollEvents', {
      since: '23.1',
      message: 'If you enable this option, end-users may experience scrolling issues.',
    });
  },

  _init() {
    this.callBase();
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
    this._initHideTopOverlayHandler(this.option('hideTopOverlayHandler'));
    this._parentsScrollSubscriptionInfo = {
      handler: (e) => { this._hideOnParentsScrollHandler(e); },
    };

    this.warnPositionAsFunction();
  },

  warnPositionAsFunction() {
    if (isFunction(this.option('position'))) { // position as function deprecated in 21.2
      errors.log('W0018');
    }
  },

  _initInnerOverlayClass() {
    this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option('innerOverlay'));
  },

  _initHideTopOverlayHandler(handler) {
    this._hideTopOverlayHandler = handler;
  },

  _getActionsList() {
    return ['onShowing', 'onShown', 'onHiding', 'onHidden', 'onPositioned', 'onVisualPositionChanged'];
  },

  _initActions() {
    this._actions = {};
    const actions = this._getActionsList();

    each(actions, (_, action) => {
      this._actions[action] = this._createActionByOption(action, {
        excludeValidators: ['disabled', 'readOnly'],
      }) || noop;
    });
  },

  _initHideOnOutsideClickHandler() {
    this._proxiedDocumentDownHandler = (...args) => this._documentDownHandler(...args);
  },

  _initMarkup() {
    this.callBase();
    this._renderWrapperAttributes();
    this._initPositionController();
  },

  _documentDownHandler(e) {
    if (this._showAnimationProcessing) {
      this._stopAnimation();
    }
    const isAttachedTarget = $(window.document).is(e.target) || domUtils.contains(window.document, e.target);
    const isInnerOverlay = $(e.target).closest(`.${INNER_OVERLAY_CLASS}`).length;
    const outsideClick = isAttachedTarget && !isInnerOverlay && !(this._$content.is(e.target)
            || domUtils.contains(this._$content.get(0), e.target));

    if (outsideClick && this._shouldHideOnOutsideClick(e)) {
      this._outsideClickHandler(e);
    }

    return this.option('propagateOutsideClick');
  },

  _shouldHideOnOutsideClick(e) {
    const { hideOnOutsideClick } = this.option();

    if (isFunction(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }

    return hideOnOutsideClick;
  },

  _outsideClickHandler(e) {
    if (this.option('shading')) {
      e.preventDefault();
    }

    this.hide();
  },

  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },

  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new EmptyTemplate(),
    });
    this.callBase();
  },

  _isTopOverlay() {
    const overlayStack = this._overlayStack();

    for (let i = overlayStack.length - 1; i >= 0; i--) {
      const tabbableElements = overlayStack[i]._findTabbableBounds();

      if (tabbableElements.first || tabbableElements.last) {
        return overlayStack[i] === this;
      }
    }

    return false;
  },

  _overlayStack() {
    return OVERLAY_STACK;
  },

  _zIndexInitValue() {
    // @ts-expect-error
    return Overlay.baseZIndex();
  },

  _toggleViewPortSubscription(toggle) {
    viewPortChanged.remove(this._viewPortChangeHandle);

    if (toggle) {
      this._viewPortChangeHandle = (...args) => { this._viewPortChangeHandler(...args); };
      viewPortChanged.add(this._viewPortChangeHandle);
    }
  },

  _viewPortChangeHandler() {
    this._positionController.updateContainer(this.option('container'));
    this._refresh();
  },

  _renderWrapperAttributes() {
    const { wrapperAttr } = this.option();
    const attributes = extend({}, wrapperAttr);
    const classNames = attributes.class;

    delete attributes.class;

    this.$wrapper()
      .attr(attributes)
      .removeClass(this._customWrapperClass)
      .addClass(classNames);

    this._customWrapperClass = classNames;
  },

  _renderVisibilityAnimate(visible) {
    this._stopAnimation();

    return visible ? this._show() : this._hide();
  },

  _getAnimationConfig() {
    return this._getOptionValue('animation', this);
  },

  _toggleBodyScroll: noop,

  _animateShowing() {
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
  },

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
  },

  _show() {
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
        this._toggleBodyScroll(this.option('enableBodyScroll'));
        this._toggleVisibility(true);
        this._$content.css('visibility', 'hidden');
        this._$content.toggleClass(INVISIBLE_STATE_CLASS, false);
        this._updateZIndexStackPosition(true);
        this._positionController.openingHandled();
        this._renderContent();

        const showingArgs = { cancel: false };
        this._actions.onShowing(showingArgs);

        const cancelShow = () => {
          this._toggleVisibility(false);
          this._$content.css('visibility', '');
          this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);
          this._isShowingActionCanceled = true;
          this._moveFromContainer();
          this._toggleBodyScroll(true);
          this.option('visible', false);
          this._showingDeferred.resolve();
        };

        const applyShow = () => {
          this._$content.css('visibility', '');
          this._renderVisibility(true);
          this._animateShowing();
        };

        this._processShowingHidingCancel(showingArgs.cancel, applyShow, cancelShow);
      };

      if (this.option('templatesRenderAsynchronously')) {
        this._stopShowTimer();
        // NOTE: T390360, T386038
        this._asyncShowTimeout = setTimeout(show);
      } else {
        show();
      }
    }

    return this._showingDeferred.promise();
  },

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
  },

  _animateHiding() {
    const animation = this._getAnimationConfig() ?? {};
    const hideAnimation = this._normalizeAnimation(animation.hide, 'from');
    const startHideAnimation = hideAnimation?.start ?? noop;
    const completeHideAnimation = hideAnimation?.complete ?? noop;

    this._animate(
      hideAnimation,
      (...args) => {
        this._$content.css('pointerEvents', '');
        this._renderVisibility(false);

        completeHideAnimation.call(this, ...args);
        this._hideAnimationProcessing = false;
        this._actions?.onHidden();

        this._hidingDeferred.resolve();
      },
      (...args) => {
        this._$content.css('pointerEvents', 'none');
        startHideAnimation.call(this, ...args);
        this._hideAnimationProcessing = true;
      },
    );
  },

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
        this._toggleBodyScroll(this.option('enableBodyScroll'));
        this.option('visible', true);
        this._hidingDeferred.resolve();
      };

      const applyHide = () => {
        this._forceFocusLost();
        this._toggleShading(false);
        this._toggleSubscriptions(false);
        this._stopShowTimer();
        this._animateHiding();
      };

      this._processShowingHidingCancel(hidingArgs.cancel, applyHide, cancelHide);
    }
    return this._hidingDeferred.promise();
  },

  _forceFocusLost() {
    const activeElement = domAdapter.getActiveElement();
    const shouldResetActiveElement = !!this._$content.find(activeElement).length;

    if (shouldResetActiveElement) {
      domUtils.resetActiveElement();
    }
  },

  _animate(animation, completeCallback, startCallback) {
    if (animation) {
      startCallback = startCallback || animation.start || noop;

      fx.animate(this._$content, extend({}, animation, {
        start: startCallback,
        complete: completeCallback,
      }));
    } else {
      completeCallback();
    }
  },

  _stopAnimation() {
    fx.stop(this._$content, true);
  },

  _renderVisibility(visible) {
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
  },

  _updateZIndexStackPosition(pushToStack) {
    const overlayStack = this._overlayStack();
    const index = overlayStack.indexOf(this);

    if (pushToStack) {
      if (index === -1) {
        this._zIndex = zIndexPool.create(this._zIndexInitValue());

        overlayStack.push(this);
      }

      this._$wrapper.css('zIndex', this._zIndex);
      this._$content.css('zIndex', this._zIndex);
    } else if (index !== -1) {
      overlayStack.splice(index, 1);
      zIndexPool.remove(this._zIndex);
    }
  },

  _toggleShading(visible) {
    this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option('shading'));

    this._$wrapper.css('backgroundColor', this.option('shading') ? this.option('shadingColor') : '');

    this._toggleTabTerminator(visible && this.option('shading'));
  },

  _initTabTerminatorHandler() {
    this._proxiedTabTerminatorHandler = (...args) => {
      this._tabKeyHandler(...args);
    };
  },

  _toggleTabTerminator(enabled) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _loopFocus } = this.option();

    const eventName = addNamespace('keydown', this.NAME);

    if (_loopFocus || enabled) {
      eventsEngine.on(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    } else {
      eventsEngine.off(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    }
  },

  _findTabbableBounds() {
    const $elements = this._$wrapper.find('*');
    const elementsCount = $elements.length - 1;
    const result = { first: null, last: null };

    for (let i = 0; i <= elementsCount; i++) {
      if (!result.first && $elements.eq(i).is(tabbable)) {
        result.first = $elements.eq(i);
      }

      if (!result.last && $elements.eq(elementsCount - i).is(tabbable)) {
        result.last = $elements.eq(elementsCount - i);
      }

      if (result.first && result.last) {
        break;
      }
    }

    return result;
  },

  _tabKeyHandler(e) {
    if (normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
      return;
    }

    const tabbableElements = this._findTabbableBounds();

    const $firstTabbable = tabbableElements.first;
    const $lastTabbable = tabbableElements.last;

    const isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0);
    const isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0);
    const isEmptyTabList = tabbableElements.length === 0;
    const isOutsideTarget = !domUtils.contains(this._$wrapper.get(0), e.target);

    if (isTabOnLast || isShiftTabOnFirst
            || isEmptyTabList || isOutsideTarget) {
      e.preventDefault();

      const $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;
      // @ts-expect-error
      eventsEngine.trigger($focusElement, 'focusin');
      // @ts-expect-error
      eventsEngine.trigger($focusElement, 'focus');
    }
  },

  _toggleSubscriptions(enabled) {
    if (windowUtils.hasWindow()) {
      this._toggleHideTopOverlayCallback(enabled);
      this._toggleHideOnParentsScrollSubscription(enabled);
    }
  },

  _toggleHideTopOverlayCallback(subscribe) {
    if (!this._hideTopOverlayHandler) {
      return;
    }

    if (subscribe) {
      hideTopOverlayCallback.add(this._hideTopOverlayHandler);
    } else {
      hideTopOverlayCallback.remove(this._hideTopOverlayHandler);
    }
  },

  _toggleHideOnParentsScrollSubscription(needSubscribe) {
    const scrollEvent = addNamespace('scroll', this.NAME);
    const { prevTargets, handler } = this._parentsScrollSubscriptionInfo ?? {};

    eventsEngine.off(prevTargets, scrollEvent, handler);

    const hideOnScroll = this.option('hideOnParentScroll');

    if (needSubscribe && hideOnScroll) {
      let $parents = this._getHideOnParentScrollTarget().parents();
      if (devices.real().deviceType === 'desktop') {
        $parents = $parents.add(window);
      }
      eventsEngine.on($parents, scrollEvent, handler);
      this._parentsScrollSubscriptionInfo.prevTargets = $parents;
    }
  },

  _hideOnParentsScrollHandler(e) {
    let hideHandled = false;
    const hideOnScroll = this.option('hideOnParentScroll');
    if (isFunction(hideOnScroll)) {
      hideHandled = hideOnScroll(e);
    }

    if (!hideHandled && !this._showAnimationProcessing) {
      this.hide();
    }
  },

  _getHideOnParentScrollTarget() {
    const $hideOnParentScrollTarget = $(this.option('_hideOnParentScrollTarget'));

    if ($hideOnParentScrollTarget.length) {
      return $hideOnParentScrollTarget;
    }

    return this._$wrapper;
  },

  _render() {
    this.callBase();

    this._appendContentToElement();
    this._renderVisibilityAnimate(this.option('visible'));
  },

  _appendContentToElement() {
    if (!this._$content.parent().is(this.$element())) {
      this._$content.appendTo(this.$element());
    }
  },

  _renderContent() {
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

    this.callBase();
  },

  _isParentHidden() {
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
    // @ts-expect-error
    $parent.add($parent.parents()).each((index, element) => {
      const $element = $(element);
      // @ts-expect-error
      if ($element.css('display') === 'none') {
        isHidden = true;
        return false;
      }
    });

    return isHidden || !domAdapter.getBody().contains($parent.get(0));
  },

  _renderContentImpl() {
    const whenContentRendered = Deferred();

    const contentTemplateOption = this.option('contentTemplate');
    const contentTemplate = this._getTemplate(contentTemplateOption);
    const transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
    contentTemplate && contentTemplate.render({
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

    this._toggleWrapperScrollEventsSubscription(this.option('preventScrollEvents'));

    whenContentRendered.done(() => {
      if (this.option('visible')) {
        this._moveToContainer();
      }
    });

    return whenContentRendered.promise();
  },

  _getPositionControllerConfig() {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      container, visualContainer, _fixWrapperPosition, restorePosition, _skipContentPositioning,
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
  },

  _initPositionController() {
    this._positionController = new OverlayPositionController(
      this._getPositionControllerConfig(),
    );
  },

  _toggleWrapperScrollEventsSubscription(enabled) {
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
  },

  _moveFromContainer() {
    this._$content.appendTo(this.$element());
    this._$wrapper.detach();
  },

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
  },

  _moveToContainer() {
    const $wrapperContainer = this._positionController.$container;

    this._$wrapper.appendTo($wrapperContainer);
    this._$content.appendTo(this._$wrapper);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderGeometry(options) {
    const { visible } = this.option();

    if (visible && windowUtils.hasWindow()) {
      this._stopAnimation();
      this._renderGeometryImpl();
    }
  },

  _renderGeometryImpl() {
    // NOTE: position can be specified as a function which needs to be called strict on render start
    this._positionController.updatePosition(this._getOptionValue('position'));
    this._renderWrapper();
    this._renderDimensions();
    this._renderPosition();
  },

  _renderPosition() {
    this._positionController.positionContent();
  },

  _isAllWindowCovered() {
    return isWindow(this._positionController.$visualContainer.get(0)) && this.option('shading');
  },

  _toggleSafariScrolling() {
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
  },

  _renderWrapper() {
    this._positionController.styleWrapperPosition();
    this._renderWrapperDimensions();
    this._positionController.positionWrapper();
  },

  _renderWrapperDimensions() {
    const { $visualContainer } = this._positionController;
    const documentElement = domAdapter.getDocumentElement();
    const isVisualContainerWindow = isWindow($visualContainer.get(0));

    const wrapperWidth = isVisualContainerWindow ? documentElement.clientWidth : getOuterWidth($visualContainer);
    const wrapperHeight = isVisualContainerWindow ? window.innerHeight : getOuterHeight($visualContainer);

    this._$wrapper.css({
      width: wrapperWidth,
      height: wrapperHeight,
    });
  },

  _renderDimensions() {
    const content = this._$content.get(0);

    this._$content.css({
      minWidth: this._getOptionValue('minWidth', content),
      maxWidth: this._getOptionValue('maxWidth', content),
      minHeight: this._getOptionValue('minHeight', content),
      maxHeight: this._getOptionValue('maxHeight', content),
      width: this._getOptionValue('width', content),
      height: this._getOptionValue('height', content),
    });
  },

  _focusTarget() {
    return this._$content;
  },

  _attachKeyboardEvents() {
    this._keyboardListenerId = keyboard.on(
      this._$content,
      null,
      (opts) => this._keyboardHandler(opts),
    );
  },

  _keyboardHandler(options) {
    const e = options.originalEvent;
    const $target = $(e.target);

    if ($target.is(this._$content) || !this.option('ignoreChildEvents')) {
      this.callBase(...arguments);
    }
  },

  _isVisible() {
    return this.option('visible');
  },

  _visibilityChanged(visible) {
    if (visible) {
      if (this.option('visible')) {
        this._renderVisibilityAnimate(visible);
      }
    } else {
      this._renderVisibilityAnimate(visible);
    }
  },

  _dimensionChanged() {
    this._renderGeometry();
  },

  _clean() {
    const options = this.option();
    if (!this._contentAlreadyRendered && !options.isRenovated) {
      this.$content().empty();
    }

    this._renderVisibility(false);
    this._stopShowTimer();
    this._cleanFocusState();
  },

  _stopShowTimer() {
    if (this._asyncShowTimeout) {
      clearTimeout(this._asyncShowTimeout);
    }

    this._asyncShowTimeout = null;
  },

  _dispose() {
    fx.stop(this._$content, false);
    clearTimeout(this._deferShowTimer);

    this._toggleViewPortSubscription(false);
    this._toggleSubscriptions(false);
    this._updateZIndexStackPosition(false);
    this._toggleTabTerminator(false);

    this._actions = null;
    this._parentsScrollSubscriptionInfo = null;

    this.callBase();

    this._toggleSafariScrolling();
    this.option('visible') && zIndexPool.remove(this._zIndex);
    this._$wrapper.remove();
    this._$content.remove();
  },

  _toggleRTLDirection(rtl) {
    this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
  },

  _optionChanged(args) {
    const { value, name } = args;

    if (this._getActionsList().includes(name)) {
      this._initActions();
      return;
    }

    switch (name) {
      case 'animation':
        break;
      case '_loopFocus':
      case 'shading':
        this._toggleShading(this.option('visible'));
        this._toggleSafariScrolling();
        break;
      case 'shadingColor':
        this._toggleShading(this.option('visible'));
        break;
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
        this._initHideTopOverlayHandler(value);
        this._toggleHideTopOverlayCallback(this.option('visible'));
        break;
      case 'hideOnParentScroll':
      case '_hideOnParentScrollTarget':
        this._toggleHideOnParentsScrollSubscription(this.option('visible'));
        break;
      case 'closeOnOutsideClick':
      case 'hideOnOutsideClick':
      case 'propagateOutsideClick':
        break;
      case 'rtlEnabled':
        this._contentAlreadyRendered = false;
        this.callBase(args);
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
        this._toggleWrapperScrollEventsSubscription(value);
        break;
      default:
        this.callBase(args);
    }
  },

  toggle(showing) {
    showing = showing === undefined ? !this.option('visible') : showing;
    const result = Deferred();

    if (showing === this.option('visible')) {
      return result.resolveWith(this, [showing]).promise();
    }

    const animateDeferred = Deferred();
    this._animateDeferred = animateDeferred;
    this.option('visible', showing);

    animateDeferred.promise()
      // @ts-expect-error
      .done(() => {
        delete this._animateDeferred;
        result.resolveWith(this, [this.option('visible')]);
      })
      .fail(() => {
        delete this._animateDeferred;
        result.reject();
      });

    return result.promise();
  },

  $content() {
    return this._$content;
  },

  show() {
    return this.toggle(true);
  },

  hide() {
    return this.toggle(false);
  },

  content() {
    return getPublicElement(this._$content);
  },

  repaint() {
    if (this._contentAlreadyRendered) {
      this._positionController.restorePositionOnNextRender(true);
      this._renderGeometry({ forceStopAnimation: true });
      triggerResizeEvent(this._$content);
    } else {
      this.callBase();
    }
  },
});
// @ts-expect-error
Overlay.baseZIndex = (zIndex) => zIndexPool.base(zIndex);

registerComponent('dxOverlay', Overlay);

export default Overlay;
