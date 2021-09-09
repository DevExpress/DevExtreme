import fx from '../../animation/fx';
import positionUtils from '../../animation/position';
import { resetPosition } from '../../animation/translator';
import registerComponent from '../../core/component_registrator';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import $ from '../../core/renderer';
import { EmptyTemplate } from '../../core/templates/empty_template';
import { inArray } from '../../core/utils/array';
import { noop } from '../../core/utils/common';
import { Deferred } from '../../core/utils/deferred';
import { contains, resetActiveElement } from '../../core/utils/dom';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import readyCallbacks from '../../core/utils/ready_callbacks';
import { isString, isDefined, isFunction, isPlainObject, isWindow, isObject } from '../../core/utils/type';
import { changeCallback } from '../../core/utils/view_port';
import { getWindow, hasWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import {
    move as dragEventMove
} from '../../events/drag';
import pointerEvents from '../../events/pointer';
import { keyboard } from '../../events/short';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '../../events/utils/index';
import { triggerHidingEvent, triggerResizeEvent, triggerShownEvent } from '../../events/visibility_change';
import { hideCallback as hideTopOverlayCallback } from '../../mobile/hide_callback';
import Resizable from '../resizable';
import OverlayDrag from './overlay_drag';
import { tabbable } from '../widget/selectors';
import swatch from '../widget/swatch_container';
import Widget from '../widget/ui.widget';
import browser from '../../core/utils/browser';
import * as zIndexPool from './z_index';
import resizeObserverSingleton from '../../core/resize_observer';
import { OverlayPositionController, OVERLAY_POSITION_ALIASES } from './overlay_position_controller';
const ready = readyCallbacks.add;
const window = getWindow();
const viewPortChanged = changeCallback;

const OVERLAY_CLASS = 'dx-overlay';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const OVERLAY_MODAL_CLASS = 'dx-overlay-modal';
const INNER_OVERLAY_CLASS = 'dx-inner-overlay';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const ANONYMOUS_TEMPLATE_NAME = 'content';

const RTL_DIRECTION_CLASS = 'dx-rtl';

const ACTIONS = ['onShowing', 'onShown', 'onHiding', 'onHidden', 'onPositioned', 'onResizeStart', 'onResize', 'onResizeEnd'];

const OVERLAY_STACK = [];

const DISABLED_STATE_CLASS = 'dx-state-disabled';

const PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';

const TAB_KEY = 'tab';

const DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };

ready(() => {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), pointerEvents.down, e => {
        for(let i = OVERLAY_STACK.length - 1; i >= 0; i--) {
            if(!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
                return;
            }
        }
    });
});

const Overlay = Widget.inherit({
    _supportedKeys: function() {
        return extend(this.callBase(), {
            escape: function() {
                this.hide();
            },
            upArrow: (e) => { this._drag.moveUp(e); },
            downArrow: (e) => { this._drag.moveDown(e); },
            leftArrow: (e) => { this._drag.moveLeft(e); },
            rightArrow: (e) => { this._drag.moveRight(e); }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxOverlayOptions.activeStateEnabled
            * @hidden
            */
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
                        scale: 0.55
                    }
                },
                hide: {
                    type: 'pop',
                    duration: 300,
                    to: {
                        opacity: 0,
                        scale: 0.55
                    },
                    from: {
                        opacity: 1,
                        scale: 1
                    }
                }
            },

            allowDragOutside: false,

            closeOnOutsideClick: false,

            copyRootClassesToWrapper: false,

            onShowing: null,

            onShown: null,

            onHiding: null,

            onHidden: null,

            contentTemplate: 'content',

            dragEnabled: false,

            dragAndResizeArea: undefined,

            outsideDragFactor: 0,

            resizeEnabled: false,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,
            innerOverlay: false,

            // NOTE: private options

            target: undefined,
            container: undefined,

            hideTopOverlayHandler: () => { this.hide(); },
            hideOnParentScroll: false,
            onPositioned: null,
            propagateOutsideClick: false,
            ignoreChildEvents: true,
            _checkParentVisibility: true,
            _fixWrapperPosition: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return !hasWindow();
            },
            options: {
                width: null,
                height: null,
                animation: null,
                _checkParentVisibility: false
            }
        }]);
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            animation: true
        });
    },

    $wrapper: function() {
        return this._$wrapper;
    },

    _eventBindingTarget: function() {
        return this._$content;
    },

    _setDeprecatedOptions() {
        this.callBase();
        extend(this._deprecatedOptions, {
            'elementAttr': { since: '21.2', message: 'Use the "wrapperAttr" option instead' }
        });
    },

    _init: function() {
        this.callBase();
        this._initActions();
        this._initCloseOnOutsideClickHandler();
        this._initTabTerminatorHandler();

        this._customWrapperClass = null;
        this._$wrapper = $('<div>').addClass(OVERLAY_WRAPPER_CLASS);
        this._$content = $('<div>').addClass(OVERLAY_CONTENT_CLASS);
        this._initInnerOverlayClass();

        const $element = this.$element();
        if(this.option('copyRootClassesToWrapper')) {
            this._$wrapper.addClass($element.attr('class'));
        }
        $element.addClass(OVERLAY_CLASS);

        this._$wrapper.attr('data-bind', 'dxControlsDescendantBindings: true');

        // NOTE: bootstrap integration T342292
        eventsEngine.on(this._$wrapper, 'focusin', e => { e.stopPropagation(); });

        this._toggleViewPortSubscription(true);
        this._initHideTopOverlayHandler(this.option('hideTopOverlayHandler'));
        this._parentsScrollSubscriptionInfo = {
            handler: e => { this._targetParentsScrollHandler(e); }
        };

        this._updateResizeCallbackSkipCondition();
    },

    _initOptions: function(options) {
        this._setAnimationTarget(options.target);

        this.callBase(options);
    },

    _initInnerOverlayClass: function() {
        this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option('innerOverlay'));
    },

    _setAnimationTarget: function(target) {
        if(!isDefined(target)) {
            return;
        }

        const options = this.option();
        [
            'animation.show.from.position.of',
            'animation.show.to.position.of',
            'animation.hide.from.position.of',
            'animation.hide.to.position.of'
        ].forEach(path => {
            const pathParts = path.split('.');

            let option = options;
            while(option) {
                if(pathParts.length === 1) {
                    if(isPlainObject(option)) {
                        option[pathParts.shift()] = target;
                    }
                    break;
                } else {
                    option = option[pathParts.shift()];
                }
            }
        });
    },

    _initHideTopOverlayHandler: function(handler) {
        this._hideTopOverlayHandler = handler;
    },

    _initActions: function() {
        this._actions = {};

        each(ACTIONS, (_, action) => {
            this._actions[action] = this._createActionByOption(action, {
                excludeValidators: ['disabled', 'readOnly']
            }) || noop;
        });
    },

    _initCloseOnOutsideClickHandler: function() {
        this._proxiedDocumentDownHandler = (...args) => {
            return this._documentDownHandler(...args);
        };
    },

    _areContentDimensionsRendered: function(entry) {
        const contentBox = entry.contentBoxSize?.[0];
        if(contentBox) {
            return parseInt(contentBox.inlineSize, 10) === this._renderedDimensions?.width
                    && parseInt(contentBox.blockSize, 10) === this._renderedDimensions?.height;
        }

        const contentRect = entry.contentRect;
        return parseInt(contentRect.width, 10) === this._renderedDimensions?.width
                && parseInt(contentRect.height, 10) === this._renderedDimensions?.height;
    },

    _contentResizeHandler: function(entry) {
        if(!this._shouldSkipContentResize(entry)) {
            this._renderGeometry({ shouldOnlyReposition: true });
        }
    },

    _updateResizeCallbackSkipCondition() {
        const doesShowAnimationChangeDimensions = this._doesShowAnimationChangeDimensions();

        this._shouldSkipContentResize = (entry) => {
            return doesShowAnimationChangeDimensions && this._showAnimationProcessing
                || this._areContentDimensionsRendered(entry);
        };
    },

    _doesShowAnimationChangeDimensions: function() {
        const animation = this.option('animation');

        return ['to', 'from'].some(prop => {
            const config = animation?.show?.[prop];
            return isObject(config) && ('width' in config || 'height' in config);
        });
    },

    _observeContentResize: function(shouldObserve) {
        if(!this.option('useResizeObserver')) {
            return;
        }

        const contentElement = this._$content.get(0);
        if(shouldObserve) {
            resizeObserverSingleton.observe(contentElement, (entry) => { this._contentResizeHandler(entry); });
        } else {
            resizeObserverSingleton.unobserve(contentElement);
        }
    },

    _initMarkup() {
        this.callBase();
        this._renderWrapperAttributes();
        this._initPositionController();
    },

    _documentDownHandler: function(e) {
        if(this._showAnimationProcessing) {
            this._stopAnimation();
        }

        let closeOnOutsideClick = this.option('closeOnOutsideClick');

        if(isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }

        const $container = this._$content;
        const isAttachedTarget = $(window.document).is(e.target) || contains(window.document, e.target);
        const isInnerOverlay = $(e.target).closest('.' + INNER_OVERLAY_CLASS).length;
        const outsideClick = isAttachedTarget && !isInnerOverlay && !($container.is(e.target) || contains($container.get(0), e.target));

        if(outsideClick && closeOnOutsideClick) {
            this._outsideClickHandler(e);
        }

        return this.option('propagateOutsideClick');
    },

    _outsideClickHandler(e) {
        if(this.option('shading')) {
            e.preventDefault();
        }

        this.hide();
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            content: new EmptyTemplate()
        });
        this.callBase();
    },

    _isTopOverlay: function() {
        const overlayStack = this._overlayStack();

        for(let i = overlayStack.length - 1; i >= 0; i--) {
            const tabbableElements = overlayStack[i]._findTabbableBounds();

            if(tabbableElements.first || tabbableElements.last) {
                return overlayStack[i] === this;
            }
        }

        return false;
    },

    _overlayStack: function() {
        return OVERLAY_STACK;
    },

    _zIndexInitValue: function() {
        return Overlay.baseZIndex();
    },

    _toggleViewPortSubscription: function(toggle) {
        viewPortChanged.remove(this._viewPortChangeHandle);

        if(toggle) {
            this._viewPortChangeHandle = (...args) => { this._viewPortChangeHandler(...args); };
            viewPortChanged.add(this._viewPortChangeHandle);
        }
    },

    _viewPortChangeHandler: function() {
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

    _renderVisibilityAnimate: function(visible) {
        this._observeContentResize(visible);
        this._stopAnimation();

        return visible ? this._show() : this._hide();
    },

    _getAnimationConfig: function() {
        return this._getOptionValue('animation', this);
    },

    _animateShowing: function() {
        const animation = this._getAnimationConfig() ?? {};
        const showAnimation = this._normalizeAnimation(animation.show, 'to');
        const startShowAnimation = showAnimation?.start ?? noop;
        const completeShowAnimation = showAnimation?.complete ?? noop;

        this._animate(
            showAnimation,
            (...args) => {
                if(this._isAnimationPaused) {
                    return;
                }
                if(this.option('focusStateEnabled')) {
                    eventsEngine.trigger(this._focusTarget(), 'focus');
                }

                completeShowAnimation.call(this, ...args);
                this._showAnimationProcessing = false;
                this._isShown = true;
                this._actions.onShown();
                this._toggleSafariScrolling();
                this._showingDeferred.resolve();
            },
            (...args) => {
                if(this._isAnimationPaused) {
                    return;
                }
                startShowAnimation.call(this, ...args);
                this._showAnimationProcessing = true;
            });
    },

    _show: function() {
        this._showingDeferred = new Deferred();

        this._parentHidden = this._isParentHidden();
        this._showingDeferred.done(() => {
            delete this._parentHidden;
        });

        if(this._parentHidden) {
            this._isHidden = true;
            return this._showingDeferred.resolve();
        }

        if(this._currentVisible) {
            return new Deferred().resolve().promise();
        }
        this._currentVisible = true;
        this._isShown = false;

        if(this._isHidingActionCanceled) {
            delete this._isHidingActionCanceled;
            this._showingDeferred.resolve();
        } else {
            const show = () => {
                this._renderVisibility(true);

                if(this._isShowingActionCanceled) {
                    delete this._isShowingActionCanceled;
                    this._showingDeferred.resolve();
                    return;
                }

                this._animateShowing();
            };

            if(this.option('templatesRenderAsynchronously')) {
                this._stopShowTimer();
                this._asyncShowTimeout = setTimeout(show);
            } else {
                show();
            }
        }

        return this._showingDeferred.promise();
    },

    _normalizeAnimation: function(animation, prop) {
        if(animation) {
            animation = extend({
                type: 'slide'
            }, animation);

            if(animation[prop] && typeof animation[prop] === 'object') {
                extend(animation[prop], {
                    position: this._positionController._position
                });
            }
        }

        return animation;
    },

    _animateHiding: function() {
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
            }
        );
    },

    _hide: function() {
        if(!this._currentVisible) {
            return new Deferred().resolve().promise();
        }
        this._currentVisible = false;

        this._hidingDeferred = new Deferred();
        const hidingArgs = { cancel: false };

        if(this._isShowingActionCanceled) {
            this._hidingDeferred.resolve();
        } else {
            this._actions.onHiding(hidingArgs);

            this._toggleSafariScrolling();

            if(hidingArgs.cancel) {
                this._isHidingActionCanceled = true;
                this.option('visible', true);
                this._hidingDeferred.resolve();
            } else {
                this._forceFocusLost();
                this._toggleShading(false);
                this._toggleSubscriptions(false);
                this._stopShowTimer();

                this._animateHiding();
            }
        }
        return this._hidingDeferred.promise();
    },

    _forceFocusLost: function() {
        const activeElement = domAdapter.getActiveElement();
        const shouldResetActiveElement = !!this._$content.find(activeElement).length;

        if(shouldResetActiveElement) {
            resetActiveElement();
        }
    },

    _animate: function(animation, completeCallback, startCallback) {
        if(animation) {
            startCallback = startCallback || animation.start || noop;

            fx.animate(this._$content, extend({}, animation, {
                start: startCallback,
                complete: completeCallback
            }));
        } else {
            completeCallback();
        }
    },

    _stopAnimation: function() {
        fx.stop(this._$content, true);
    },

    _renderVisibility: function(visible) {
        if(visible && this._isParentHidden()) {
            return;
        }

        this._currentVisible = visible;
        this._positionChangeHandled = false;

        this._stopAnimation();

        if(!visible) {
            triggerHidingEvent(this._$content);
        }

        this._toggleVisibility(visible);

        this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        this._updateZIndexStackPosition(visible);

        if(visible) {
            this._renderContent();

            const showingArgs = { cancel: false };
            this._actions.onShowing(showingArgs);
            if(showingArgs.cancel) {
                this._toggleVisibility(false);
                this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);
                this._updateZIndexStackPosition(false);
                this._moveFromContainer();
                this._isShowingActionCanceled = true;
                this.option('visible', false);
                return;
            }

            this._moveToContainer();
            this._renderGeometry();

            triggerShownEvent(this._$content);
            triggerResizeEvent(this._$content);
        } else {
            this._moveFromContainer();
        }
        this._toggleShading(visible);

        this._toggleSubscriptions(visible);
    },

    _updateZIndexStackPosition: function(pushToStack) {
        const overlayStack = this._overlayStack();
        const index = inArray(this, overlayStack);

        if(pushToStack) {
            if(index === -1) {
                this._zIndex = zIndexPool.create(this._zIndexInitValue());

                overlayStack.push(this);
            }

            this._$wrapper.css('zIndex', this._zIndex);
            this._$content.css('zIndex', this._zIndex);
        } else if(index !== -1) {
            overlayStack.splice(index, 1);
            zIndexPool.remove(this._zIndex);
        }
    },

    _toggleShading: function(visible) {
        this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option('shading') && !this.option('container'));
        this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option('shading'));

        this._$wrapper.css('backgroundColor', this.option('shading') ? this.option('shadingColor') : '');

        this._toggleTabTerminator(visible && this.option('shading'));
    },

    _initTabTerminatorHandler: function() {
        this._proxiedTabTerminatorHandler = (...args) => {
            this._tabKeyHandler(...args);
        };
    },

    _toggleTabTerminator: function(enabled) {
        const eventName = addNamespace('keydown', this.NAME);
        if(enabled) {
            eventsEngine.on(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
        } else {
            eventsEngine.off(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
        }
    },

    _findTabbableBounds: function() {
        const $elements = this._$wrapper.find('*');
        const elementsCount = $elements.length - 1;
        const result = { first: null, last: null };

        for(let i = 0; i <= elementsCount; i++) {
            if(!result.first && $elements.eq(i).is(tabbable)) {
                result.first = $elements.eq(i);
            }

            if(!result.last && $elements.eq(elementsCount - i).is(tabbable)) {
                result.last = $elements.eq(elementsCount - i);
            }

            if(result.first && result.last) {
                break;
            }
        }

        return result;
    },

    _tabKeyHandler: function(e) {
        if(normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
            return;
        }

        const tabbableElements = this._findTabbableBounds();

        const $firstTabbable = tabbableElements.first;
        const $lastTabbable = tabbableElements.last;

        const isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0);
        const isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0);
        const isEmptyTabList = tabbableElements.length === 0;
        const isOutsideTarget = !contains(this._$wrapper.get(0), e.target);

        if(isTabOnLast || isShiftTabOnFirst ||
            isEmptyTabList || isOutsideTarget) {

            e.preventDefault();

            const $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;

            eventsEngine.trigger($focusElement, 'focusin');
            eventsEngine.trigger($focusElement, 'focus');
        }
    },

    _toggleSubscriptions: function(enabled) {
        if(hasWindow()) {
            this._toggleHideTopOverlayCallback(enabled);
            this._toggleParentsScrollSubscription(enabled);
        }
    },

    _toggleHideTopOverlayCallback: function(subscribe) {
        if(!this._hideTopOverlayHandler) {
            return;
        }

        if(subscribe) {
            hideTopOverlayCallback.add(this._hideTopOverlayHandler);
        } else {
            hideTopOverlayCallback.remove(this._hideTopOverlayHandler);
        }
    },

    _toggleParentsScrollSubscription: function(needSubscribe) {
        const scrollEvent = addNamespace('scroll', this.NAME);
        const { prevTargets, handler } = this._parentsScrollSubscriptionInfo ?? {};

        eventsEngine.off(prevTargets, scrollEvent, handler);

        const closeOnScroll = this.option('hideOnParentScroll');
        if(needSubscribe && closeOnScroll) {
            let $parents = this._$wrapper.parents();
            if(devices.real().deviceType === 'desktop') {
                $parents = $parents.add(window);
            }
            eventsEngine.on($parents, scrollEvent, handler);
            this._parentsScrollSubscriptionInfo.prevTargets = $parents;
        }
    },

    _targetParentsScrollHandler: function(e) {
        let closeHandled = false;
        const closeOnScroll = this.option('hideOnParentScroll');
        if(isFunction(closeOnScroll)) {
            closeHandled = closeOnScroll(e);
        }

        if(!closeHandled && !this._showAnimationProcessing) {
            this.hide();
        }
    },

    _render: function() {
        this.callBase();

        this._appendContentToElement();
        this._renderVisibilityAnimate(this.option('visible'));
    },

    _appendContentToElement: function() {
        if(!this._$content.parent().is(this.$element())) {
            this._$content.appendTo(this.$element());
        }
    },

    _renderContent: function() {
        const shouldDeferRendering = !this._currentVisible && this.option('deferRendering');
        const isParentHidden = this.option('visible') && this._isParentHidden();

        if(isParentHidden) {
            this._isHidden = true;
            return;
        }

        if(this._contentAlreadyRendered || shouldDeferRendering) {
            return;
        }

        this._contentAlreadyRendered = true;
        this._appendContentToElement();

        this.callBase();
    },

    _isParentHidden: function() {
        if(!this.option('_checkParentVisibility')) {
            return false;
        }

        if(this._parentHidden !== undefined) {
            return this._parentHidden;
        }

        const $parent = this.$element().parent();

        if($parent.is(':visible')) {
            return false;
        }

        let isHidden = false;
        $parent.add($parent.parents()).each(function() {
            const $element = $(this);
            if($element.css('display') === 'none') {
                isHidden = true;
                return false;
            }
        });

        return isHidden || !domAdapter.getBody().contains($parent.get(0));
    },

    _renderContentImpl: function() {
        const whenContentRendered = new Deferred();

        const contentTemplateOption = this.option('contentTemplate');
        const contentTemplate = this._getTemplate(contentTemplateOption);
        const transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
        contentTemplate && contentTemplate.render({
            container: getPublicElement(this.$content()),
            noModel: true,
            transclude,
            onRendered: () => {
                whenContentRendered.resolve();
            }
        });

        this._renderDrag();
        this._renderResize();
        this._renderScrollTerminator();

        whenContentRendered.done(() => {
            if(this.option('visible')) {
                this._moveToContainer();
            }
        });

        return whenContentRendered.promise();
    },

    _getPositionControllerConfig() {
        const { target, container, dragAndResizeArea, allowDragOutside, outsideDragFactor } = this.option();

        return {
            position: this._getOptionValue('position'),
            target,
            container,
            $root: this.$element(),
            $content: this._$content,
            $wrapper: this._$wrapper,
            onPositioned: this._actions.onPositioned,
            dragAndResizeArea,
            allowDragOutside,
            outsideDragFactor
        };
    },

    _initPositionController() {
        this._positionController = new OverlayPositionController(
            this._getPositionControllerConfig()
        );
    },

    _renderDrag: function() {
        const $dragTarget = this._getDragTarget();

        if(!$dragTarget) {
            return;
        }

        const updatePositionChangeHandled = (value) => this._positionChangeHandled = value;
        const config = {
            dragEnabled: this.option('dragEnabled'),
            handle: $dragTarget.get(0),
            draggableElement: this._$content.get(0),
            updatePositionChangeHandled,
            onPositioned: this._actions.onPositioned,
            positionController: this._positionController
        };

        if(this._drag) {
            this._drag.init(config);
        } else {
            this._drag = new OverlayDrag(config);
        }
    },

    _renderResize: function() {
        this._resizable = this._createComponent(this._$content, Resizable, {
            handles: this.option('resizeEnabled') ? 'all' : 'none',
            onResizeEnd: (e) => {
                this._resizeEndHandler(e);
                this._observeContentResize(true);
            },
            onResize: (e) => { this._actions.onResize(e); },
            onResizeStart: (e) => {
                this._observeContentResize(false);
                this._actions.onResizeStart(e);
            },
            minHeight: 100,
            minWidth: 100,
            area: this._positionController.$dragResizeContainer
        });
    },

    _resizeEndHandler: function(e) {
        const width = this._resizable.option('width');
        const height = this._resizable.option('height');

        width && this._setOptionWithoutOptionChange('width', width);
        height && this._setOptionWithoutOptionChange('height', height);
        this._cacheDimensions();
        this._drag.updatePosition();

        this._actions.onResizeEnd(e);
    },

    _renderScrollTerminator: function() {
        const $scrollTerminator = this._$wrapper;
        const terminatorEventName = addNamespace(dragEventMove, this.NAME);

        eventsEngine.off($scrollTerminator, terminatorEventName);
        eventsEngine.on($scrollTerminator, terminatorEventName, {
            validate: function() {
                return true;
            },
            getDirection: function() {
                return 'both';
            },
            _toggleGestureCover: function(toggle) {
                if(!toggle) {
                    this._toggleGestureCoverImpl(toggle);
                }
            },
            _clearSelection: noop,
            isNative: true
        }, e => {
            const originalEvent = e.originalEvent.originalEvent;
            const { type } = originalEvent || {};
            const isWheel = type === 'wheel';
            const isMouseMove = type === 'mousemove';
            const isScrollByWheel = isWheel && !isCommandKeyPressed(e);
            e._cancelPreventDefault = true;

            if(originalEvent && e.cancelable !== false && (!isMouseMove && !isWheel || isScrollByWheel)) {
                e.preventDefault();
            }
        });
    },

    _getDragTarget: function() {
        return this.$content();
    },

    _moveFromContainer: function() {
        this._$content.appendTo(this.$element());

        this._detachWrapperToContainer();
    },

    _detachWrapperToContainer: function() {
        this._$wrapper.detach();
    },

    _moveToContainer: function() {
        this._attachWrapperToContainer();

        this._$content.appendTo(this._$wrapper);
    },

    _attachWrapperToContainer: function() {
        const $element = this.$element();
        const containerDefined = this.option('container') !== undefined;
        let renderContainer = containerDefined ? this._positionController._$container : swatch.getSwatchContainer($element);

        if(renderContainer && renderContainer[0] === $element.parent()[0]) {
            renderContainer = $element;
        }

        this._$wrapper.appendTo(renderContainer);
    },

    _renderGeometry: function(options) {
        const { visible, useResizeObserver } = this.option();

        if(visible && hasWindow()) {
            const isAnimated = this._showAnimationProcessing;
            const shouldRepeatAnimation = isAnimated && !options?.forceStopAnimation && useResizeObserver;
            this._isAnimationPaused = shouldRepeatAnimation || undefined;

            this._stopAnimation();
            if(options?.shouldOnlyReposition) {
                this._positionContent();
            } else {
                this._renderGeometryImpl();
            }

            if(shouldRepeatAnimation) {
                this._animateShowing();
                this._isAnimationPaused = undefined;
            }
        }
    },

    _cacheDimensions: function() {
        if(!this.option('useResizeObserver')) {
            return;
        }

        this._renderedDimensions = {
            width: parseInt(this._$content.width(), 10),
            height: parseInt(this._$content.height(), 10)
        };
    },

    _renderGeometryImpl: function() {
        // NOTE: position can be specified as a function which needs to be called strict on render start
        this._positionController.updatePosition(this._getOptionValue('position'));
        this._renderWrapper();
        this._renderDimensions();
        this._cacheDimensions();
        this._positionContent();
    },

    _styleWrapperPosition: function() {
        const useFixed = this._isContainerWindow() || this.option('_fixWrapperPosition');
        const positionStyle = useFixed ? 'fixed' : 'absolute';
        this._$wrapper.css('position', positionStyle);
    },

    _isContainerWindow: function() {
        const $container = this._positionController._$wrapperCoveredElement;
        return this._isWindow($container) || !$container?.get(0);
    },

    _isAllWindowCovered: function() {
        return this._isContainerWindow() && this.option('shading');
    },

    _toggleSafariScrolling: function() {
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

        if(isIosSafari) {
            if(shouldEnableScrolling) {
                $body.removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
                window.scrollTo(0, this._cachedBodyScrollTop);
                this._cachedBodyScrollTop = undefined;
            } else if(shouldPreventScrolling) {
                this._cachedBodyScrollTop = window.pageYOffset;
                $body.addClass(PREVENT_SAFARI_SCROLLING_CLASS);
            }
        }
    },

    _renderWrapper: function() {
        this._styleWrapperPosition();
        this._renderWrapperDimensions();
        this._positionController.positionWrapper();
    },

    _renderWrapperDimensions: function() {
        let wrapperWidth;
        let wrapperHeight;
        const $container = this._positionController._$wrapperCoveredElement;

        if(!$container) {
            return;
        }

        const isWindow = this._isWindow($container);
        const documentElement = domAdapter.getDocumentElement();
        wrapperWidth = isWindow ? documentElement.clientWidth : $container.outerWidth(),
        wrapperHeight = isWindow ? window.innerHeight : $container.outerHeight();

        this._$wrapper.css({
            width: wrapperWidth,
            height: wrapperHeight
        });
    },

    _isWindow: function($element) {
        return !!$element && isWindow($element.get(0));
    },

    _renderDimensions: function() {
        const content = this._$content.get(0);

        this._$content.css({
            minWidth: this._getOptionValue('minWidth', content),
            maxWidth: this._getOptionValue('maxWidth', content),
            minHeight: this._getOptionValue('minHeight', content),
            maxHeight: this._getOptionValue('maxHeight', content),
            width: this._getOptionValue('width', content),
            height: this._getOptionValue('height', content)
        });
    },

    _renderPosition: function() {
        if(this._positionChangeHandled) {
            this._drag.moveToLastPosition();
            this._drag.moveToContainer();

            return this._drag.getPosition();
        } else {
            const position = this._positionController._position;
            this._renderOverlayBoundaryOffset(position || { boundaryOffset: DEFAULT_BOUNDARY_OFFSET });

            resetPosition(this._$content);

            const resultPosition = positionUtils.setup(this._$content, position);
            return { top: resultPosition.v.location, left: resultPosition.h.location };
        }
    },

    _positionContent: function() {
        const resultPosition = this._renderPosition();

        this._actions.onPositioned({ position: resultPosition });
    },

    _getPositionValue: function(positionAliases) {
        let position = this._getOptionValue('position', this);
        if(isString(position)) {
            position = extend({}, positionAliases[position]);
        }

        return position;
    },

    _renderOverlayBoundaryOffset: function({ boundaryOffset }) {
        this._$content.css('margin', boundaryOffset.v + 'px ' + boundaryOffset.h + 'px');
    },

    _focusTarget: function() {
        return this._$content;
    },

    _attachKeyboardEvents: function() {
        this._keyboardListenerId = keyboard.on(
            this._$content,
            null,
            opts => this._keyboardHandler(opts)
        );
    },

    _keyboardHandler: function(options) {
        const e = options.originalEvent;
        const $target = $(e.target);

        if($target.is(this._$content) || !this.option('ignoreChildEvents')) {
            this.callBase(...arguments);
        }
    },

    _isVisible: function() {
        return this.option('visible');
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            if(this.option('visible')) {
                this._renderVisibilityAnimate(visible);
            }
        } else {
            this._renderVisibilityAnimate(visible);
        }
    },

    _dimensionChanged: function() {
        this._renderGeometry();
    },

    _clean: function() {
        if(!this._contentAlreadyRendered) {
            this.$content().empty();
        }

        this._renderVisibility(false);
        this._stopShowTimer();
        this._observeContentResize(false);

        this._cleanFocusState();
    },

    _stopShowTimer() {
        if(this._asyncShowTimeout) {
            clearTimeout(this._asyncShowTimeout);
        }

        this._asyncShowTimeout = null;
    },

    _dispose: function() {
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
        zIndexPool.remove(this._zIndex);
        this._$wrapper.remove();
        this._$content.remove();
    },

    _toggleDisabledState: function(value) {
        this.callBase(...arguments);
        this._$content.toggleClass(DISABLED_STATE_CLASS, Boolean(value));
    },

    _toggleRTLDirection: function(rtl) {
        this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
    },

    _optionChanged: function(args) {
        const value = args.value;

        if(inArray(args.name, ACTIONS) > -1) {
            this._initActions();
            return;
        }

        switch(args.name) {
            case 'dragEnabled':
                this._renderDrag();
                this._renderGeometry();
                break;
            case 'resizeEnabled':
                this._renderResize();
                this._renderGeometry();
                break;
            case 'shading':
                this._toggleShading(this.option('visible'));
                this._toggleSafariScrolling();
                break;
            case 'shadingColor':
                this._toggleShading(this.option('visible'));
                break;
            case 'width':
            case 'height':
            case 'minWidth':
            case 'maxWidth':
            case 'minHeight':
            case 'maxHeight':
                this._renderGeometry();
                break;
            case 'position':
                this._positionController.updatePosition(this.option('position'));
                this._positionChangeHandled = false;
                this._renderGeometry();
                this._toggleSafariScrolling();
                break;
            case 'visible':
                this._renderVisibilityAnimate(value).done(() => {
                    if(!this._animateDeferred) {
                        return;
                    }

                    this._animateDeferred.resolveWith(this);
                });
                break;
            case 'target':
                this._positionController.updateTarget(value);
                this._setAnimationTarget(value);
                this._invalidate();
                break;
            case 'container':
                this._positionController.updateContainer(value);
                this._invalidate();
                this._toggleSafariScrolling();
                if(this.option('resizeEnabled')) {
                    this._resizable?.option('area', this._positionController.$dragResizeContainer);
                }
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
                this._initHideTopOverlayHandler(args.value);
                this._toggleHideTopOverlayCallback(this.option('visible'));
                break;
            case 'hideOnParentScroll':
                this._toggleParentsScrollSubscription(this.option('visible'));
                break;
            case 'closeOnOutsideClick':
            case 'propagateOutsideClick':
                break;
            case 'animation':
                this._updateResizeCallbackSkipCondition();
                break;
            case 'rtlEnabled':
                this._contentAlreadyRendered = false;
                this.callBase(args);
                break;
            case '_fixWrapperPosition':
                this._styleWrapperPosition();
                break;
            case 'wrapperAttr':
                this._renderWrapperAttributes();
                break;
            case 'dragAndResizeArea':
                this._positionController.dragAndResizeArea = value;
                if(this.option('resizeEnabled')) {
                    this._resizable?.option('area', this._positionController.$dragResizeContainer);
                }
                this._positionContent();
                break;
            case 'allowDragOutside':
                this._positionController.allowDragOutside = value;
                if(this.option('resizeEnabled')) {
                    this._resizable.option('area', this._positionController.$dragResizeContainer);
                }
                break;
            case 'outsideDragFactor':
                this._positionController.outsideDragFactor = value;
                break;
            default:
                this.callBase(args);
        }
    },

    toggle: function(showing) {
        showing = showing === undefined ? !this.option('visible') : showing;
        const result = new Deferred();

        if(showing === this.option('visible')) {
            return result.resolveWith(this, [showing]).promise();
        }

        const animateDeferred = new Deferred();
        this._animateDeferred = animateDeferred;
        this.option('visible', showing);

        animateDeferred.promise().done(() => {
            delete this._animateDeferred;
            result.resolveWith(this, [this.option('visible')]);
        });

        return result.promise();
    },

    $content: function() {
        return this._$content;
    },

    show: function() {
        return this.toggle(true);
    },

    hide: function() {
        return this.toggle(false);
    },

    content: function() {
        return getPublicElement(this._$content);
    },

    repaint: function() {
        if(this._contentAlreadyRendered) {
            this._positionChangeHandled = false;
            this._renderGeometry({ forceStopAnimation: true });
            triggerResizeEvent(this._$content);
        } else {
            this.callBase();
        }
    }
});

/**
* @name ui.dxOverlay
* @section utils
*/
Overlay.baseZIndex = zIndex => {
    return zIndexPool.base(zIndex);
};

registerComponent('dxOverlay', Overlay);

export default Overlay;
