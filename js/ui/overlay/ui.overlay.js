import fx from '../../animation/fx';
import positionUtils from '../../animation/position';
import { locate, move, resetPosition } from '../../animation/translator';
import registerComponent from '../../core/component_registrator';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import $ from '../../core/renderer';
import { EmptyTemplate } from '../../core/templates/empty_template';
import { inArray } from '../../core/utils/array';
import browser from '../../core/utils/browser';
import { noop } from '../../core/utils/common';
import { Deferred } from '../../core/utils/deferred';
import { contains, resetActiveElement } from '../../core/utils/dom';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { fitIntoRange } from '../../core/utils/math';
import readyCallbacks from '../../core/utils/ready_callbacks';
import { isString, isDefined, isFunction, isPlainObject, isWindow, isEvent } from '../../core/utils/type';
import { compare as compareVersions } from '../../core/utils/version';
import { changeCallback, originalViewPort, value as viewPort } from '../../core/utils/view_port';
import { getNavigator, getWindow, hasWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import {
    start as dragEventStart,
    move as dragEventMove
} from '../../events/drag';
import pointerEvents from '../../events/pointer';
import { keyboard } from '../../events/short';
import { addNamespace, normalizeKeyName } from '../../events/utils/index';
import { triggerHidingEvent, triggerResizeEvent, triggerShownEvent } from '../../events/visibility_change';
import { hideCallback as hideTopOverlayCallback } from '../../mobile/hide_callback';
import Resizable from '../resizable';
import { tabbable } from '../widget/selectors';
import swatch from '../widget/swatch_container';
import Widget from '../widget/ui.widget';
import * as zIndexPool from './z_index';
const ready = readyCallbacks.add;
const window = getWindow();
const navigator = getNavigator();
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

const ACTIONS = ['onShowing', 'onShown', 'onHiding', 'onHidden', 'onPositioning', 'onPositioned', 'onResizeStart', 'onResize', 'onResizeEnd'];

const OVERLAY_STACK = [];

const DISABLED_STATE_CLASS = 'dx-state-disabled';

const PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';

const TAB_KEY = 'tab';

const POSITION_ALIASES = {
    'top': { my: 'top center', at: 'top center' },
    'bottom': { my: 'bottom center', at: 'bottom center' },
    'right': { my: 'right center', at: 'right center' },
    'left': { my: 'left center', at: 'left center' },
    'center': { my: 'center', at: 'center' },
    'right bottom': { my: 'right bottom', at: 'right bottom' },
    'right top': { my: 'right top', at: 'right top' },
    'left bottom': { my: 'left bottom', at: 'left bottom' },
    'left top': { my: 'left top', at: 'left top' }
};

const realDevice = devices.real();
const realVersion = realDevice.version;
const firefoxDesktop = browser.mozilla && realDevice.deviceType === 'desktop';
const iOS = realDevice.platform === 'ios';
const hasSafariAddressBar = browser.safari && realDevice.deviceType !== 'desktop';
const android4_0nativeBrowser = realDevice.platform === 'android' && compareVersions(realVersion, [4, 0], 2) === 0 && navigator.userAgent.indexOf('Chrome') === -1;

const forceRepaint = $element => {
    // NOTE: force layout recalculation on FF desktop (T581681)
    if(firefoxDesktop) {
        $element.width();
    }

    // NOTE: force rendering on buggy android (T112083)
    if(android4_0nativeBrowser) {
        const $parents = $element.parents();
        const inScrollView = $parents.is('.dx-scrollable-native');

        if(!inScrollView) {
            $parents.css('backfaceVisibility', 'hidden');
            $parents.css('backfaceVisibility');
            $parents.css('backfaceVisibility', 'visible');
        }
    }
};


const getElement = value => {
    if(isEvent(value)) {
        value = value.target;
    }

    return $(value);
};

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
        const offsetSize = 5;
        const move = function(top, left, e) {
            if(!this.option('dragEnabled')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const allowedOffsets = this._allowedOffsets();
            const offset = {
                top: fitIntoRange(top, -allowedOffsets.top, allowedOffsets.bottom),
                left: fitIntoRange(left, -allowedOffsets.left, allowedOffsets.right)
            };
            this._changePosition(offset);
        };
        return extend(this.callBase(), {
            escape: function() {
                this.hide();
            },
            upArrow: move.bind(this, -offsetSize, 0),
            downArrow: move.bind(this, offsetSize, 0),
            leftArrow: move.bind(this, 0, -offsetSize),
            rightArrow: move.bind(this, 0, offsetSize)
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

            position: {
                my: 'center',
                at: 'center'
            },

            width: function() { return $(window).width() * 0.8; },

            minWidth: null,

            maxWidth: null,

            height: function() { return $(window).height() * 0.8; },

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

            closeOnOutsideClick: false,

            onShowing: null,

            onShown: null,

            onHiding: null,

            onHidden: null,

            contentTemplate: 'content',

            dragEnabled: false,

            resizeEnabled: false,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,
            innerOverlay: false,

            // NOTE: private options

            target: undefined,
            container: undefined,

            hideTopOverlayHandler: () => { this.hide(); },
            closeOnTargetScroll: false,
            onPositioned: null,
            boundaryOffset: { h: 0, v: 0 },
            propagateOutsideClick: false,
            ignoreChildEvents: true,
            _checkParentVisibility: true,
            _fixedPosition: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                const realDevice = devices.real();
                const realPlatform = realDevice.platform;
                const realVersion = realDevice.version;

                return realPlatform === 'android' && compareVersions(realVersion, [4, 2]) < 0;
            },
            options: {
                animation: {
                    show: {
                        type: 'fade',
                        duration: 400
                    },
                    hide: {
                        type: 'fade',
                        duration: 400,
                        to: {
                            opacity: 0
                        },
                        from: {
                            opacity: 1
                        }
                    }
                }
            }
        }, {
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

    _wrapper: function() {
        return this._$wrapper;
    },

    _container: function() {
        return this._$content;
    },

    _eventBindingTarget: function() {
        return this._$content;
    },

    _init: function() {
        this.callBase();

        this._initActions();
        this._initCloseOnOutsideClickHandler();
        this._initTabTerminatorHandler();

        this._$wrapper = $('<div>').addClass(OVERLAY_WRAPPER_CLASS);
        this._$content = $('<div>').addClass(OVERLAY_CONTENT_CLASS);
        this._initInnerOverlayClass();

        const $element = this.$element();
        this._$wrapper.addClass($element.attr('class'));
        $element.addClass(OVERLAY_CLASS);

        this._$wrapper.attr('data-bind', 'dxControlsDescendantBindings: true');

        // NOTE: hack to fix B251087
        eventsEngine.on(this._$wrapper, 'MSPointerDown', noop);
        // NOTE: bootstrap integration T342292
        eventsEngine.on(this._$wrapper, 'focusin', e => { e.stopPropagation(); });

        this._toggleViewPortSubscription(true);
        this._initHideTopOverlayHandler(this.option('hideTopOverlayHandler'));
    },

    _initOptions: function(options) {
        this._initTarget(options.target);
        const container = options.container === undefined ? this.option('container') : options.container;
        this._initContainer(container);

        this.callBase(options);
    },

    _initInnerOverlayClass: function() {
        this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option('innerOverlay'));
    },

    _initTarget: function(target) {
        if(!isDefined(target)) {
            return;
        }

        const options = this.option();
        each([
            'position.of',
            'animation.show.from.position.of',
            'animation.show.to.position.of',
            'animation.hide.from.position.of',
            'animation.hide.to.position.of'
        ], (_, path) => {
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

    _initContainer: function(container) {
        container = container === undefined ? viewPort() : container;

        const $element = this.$element();
        let $container = $element.closest(container);

        if(!$container.length) {
            $container = $(container).first();
        }

        this._$container = $container.length ? $container : $element.parent();
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
        const that = this;
        this._proxiedDocumentDownHandler = function() {
            return that._documentDownHandler(...arguments);
        };
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
            this._viewPortChangeHandle = this._viewPortChangeHandler.bind(this);
            viewPortChanged.add(this._viewPortChangeHandle);
        }
    },

    _viewPortChangeHandler: function() {
        this._initContainer(this.option('container'));
        this._refresh();
    },

    _renderVisibilityAnimate: function(visible) {
        this._stopAnimation();

        return visible ? this._show() : this._hide();
    },

    _normalizePosition: function() {
        const position = this.option('position');
        this._position = typeof position === 'function' ? position() : position;
    },

    _getAnimationConfig: function() {
        let animation = this.option('animation');
        if(isFunction(animation)) animation = animation.call(this);
        return animation;
    },

    _show: function() {
        const that = this;
        const deferred = new Deferred();

        this._parentHidden = this._isParentHidden();
        deferred.done(() => {
            delete that._parentHidden;
        });

        if(this._parentHidden) {
            this._isHidden = true;
            return deferred.resolve();
        }

        if(this._currentVisible) {
            return new Deferred().resolve().promise();
        }
        this._currentVisible = true;
        this._isShown = false;

        this._normalizePosition();

        const animation = that._getAnimationConfig() || {};
        const showAnimation = this._normalizeAnimation(animation.show, 'to');
        const startShowAnimation = (showAnimation && showAnimation.start) || noop;
        const completeShowAnimation = (showAnimation && showAnimation.complete) || noop;

        if(this._isHidingActionCanceled) {
            delete this._isHidingActionCanceled;
            deferred.resolve();
        } else {
            const show = () => {
                this._renderVisibility(true);

                if(this._isShowingActionCanceled) {
                    delete this._isShowingActionCanceled;
                    deferred.resolve();
                    return;
                }

                this._animate(showAnimation, function() {
                    if(that.option('focusStateEnabled')) {
                        eventsEngine.trigger(that._focusTarget(), 'focus');
                    }

                    completeShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = false;
                    that._isShown = true;
                    that._actions.onShown();
                    that._toggleSafariScrolling(false);
                    deferred.resolve();
                }, function() {
                    startShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = true;
                });
            };

            if(this.option('templatesRenderAsynchronously')) {
                this._stopShowTimer();
                this._asyncShowTimeout = setTimeout(show);
            } else {
                show();
            }
        }

        return deferred.promise();
    },

    _normalizeAnimation: function(animation, prop) {
        if(animation) {
            animation = extend({
                type: 'slide'
            }, animation);

            if(animation[prop] && typeof animation[prop] === 'object') {
                extend(animation[prop], {
                    position: this._position
                });
            }
        }

        return animation;
    },

    _hide: function() {
        if(!this._currentVisible) {
            return new Deferred().resolve().promise();
        }
        this._currentVisible = false;

        const that = this;
        const deferred = new Deferred();
        const animation = that._getAnimationConfig() || {};
        const hideAnimation = this._normalizeAnimation(animation.hide, 'from');
        const startHideAnimation = (hideAnimation && hideAnimation.start) || noop;
        const completeHideAnimation = (hideAnimation && hideAnimation.complete) || noop;
        const hidingArgs = { cancel: false };

        if(this._isShowingActionCanceled) {
            deferred.resolve();
        } else {
            this._actions.onHiding(hidingArgs);

            that._toggleSafariScrolling(true);

            if(hidingArgs.cancel) {
                this._isHidingActionCanceled = true;
                this.option('visible', true);
                deferred.resolve();
            } else {
                this._forceFocusLost();
                this._toggleShading(false);
                this._toggleSubscriptions(false);
                this._stopShowTimer();

                this._animate(hideAnimation,
                    function() {
                        that._$content.css('pointerEvents', '');
                        that._renderVisibility(false);

                        completeHideAnimation.apply(this, arguments);
                        that._actions?.onHidden();

                        deferred.resolve();
                    },

                    function() {
                        that._$content.css('pointerEvents', 'none');
                        startHideAnimation.apply(this, arguments);
                    }
                );
            }
        }
        return deferred.promise();
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
        const that = this;
        this._proxiedTabTerminatorHandler = function() {
            that._tabKeyHandler(...arguments);
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

    _toggleParentsScrollSubscription: function(subscribe) {
        if(!this._position) {
            return;
        }

        const target = this._position.of || $();
        const closeOnScroll = this.option('closeOnTargetScroll');
        let $parents = getElement(target).parents();
        const scrollEvent = addNamespace('scroll', this.NAME);

        if(devices.real().deviceType === 'desktop') {
            $parents = $parents.add(window);
        }

        this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler
            || (e => { this._targetParentsScrollHandler(e); });

        eventsEngine.off($().add(this._$prevTargetParents), scrollEvent, this._proxiedTargetParentsScrollHandler);

        if(subscribe && closeOnScroll) {
            eventsEngine.on($parents, scrollEvent, this._proxiedTargetParentsScrollHandler);
            this._$prevTargetParents = $parents;
        }
    },

    _targetParentsScrollHandler: function(e) {
        let closeHandled = false;
        const closeOnScroll = this.option('closeOnTargetScroll');
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

    _renderDrag: function() {
        const $dragTarget = this._getDragTarget();

        if(!$dragTarget) {
            return;
        }

        const startEventName = addNamespace(dragEventStart, this.NAME);
        const updateEventName = addNamespace(dragEventMove, this.NAME);

        eventsEngine.off($dragTarget, startEventName);
        eventsEngine.off($dragTarget, updateEventName);

        if(!this.option('dragEnabled')) {
            return;
        }

        eventsEngine.on($dragTarget, startEventName, this._dragStartHandler.bind(this));
        eventsEngine.on($dragTarget, updateEventName, this._dragUpdateHandler.bind(this));
    },

    _renderResize: function() {
        this._resizable = this._createComponent(this._$content, Resizable, {
            handles: this.option('resizeEnabled') ? 'all' : 'none',
            onResizeEnd: this._resizeEndHandler.bind(this),
            onResize: this._actions.onResize.bind(this),
            onResizeStart: this._actions.onResizeStart.bind(this),
            minHeight: 100,
            minWidth: 100,
            area: this._getDragResizeContainer()
        });
    },

    _resizeEndHandler: function() {
        this._positionChangeHandled = true;

        const width = this._resizable.option('width');
        const height = this._resizable.option('height');

        width && this.option('width', width);
        height && this.option('height', height);

        this._actions.onResizeEnd();
    },

    _renderScrollTerminator: function() {
        const $scrollTerminator = this._wrapper();
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
            e._cancelPreventDefault = true;

            if(originalEvent && originalEvent.type !== 'mousemove' && e.cancelable !== false) {
                e.preventDefault();
            }
        });
    },

    _getDragTarget: function() {
        return this.$content();
    },

    _dragStartHandler: function(e) {
        e.targetElements = [];

        this._prevOffset = { x: 0, y: 0 };

        const allowedOffsets = this._allowedOffsets();
        e.maxTopOffset = allowedOffsets.top;
        e.maxBottomOffset = allowedOffsets.bottom;
        e.maxLeftOffset = allowedOffsets.left;
        e.maxRightOffset = allowedOffsets.right;
    },

    _getDragResizeContainer: function() {
        const isContainerDefined = originalViewPort().get(0) || this.option('container');
        const $container = !isContainerDefined ? $(window) : this._$container;

        return $container;
    },

    _deltaSize: function() {
        const $content = this._$content;
        const $container = this._getDragResizeContainer();

        const contentWidth = $content.outerWidth();
        const contentHeight = $content.outerHeight();
        let containerWidth = $container.outerWidth();
        let containerHeight = $container.outerHeight();

        if(this._isWindow($container)) {
            const document = domAdapter.getDocument();
            const fullPageHeight = Math.max($(document).outerHeight(), containerHeight);
            const fullPageWidth = Math.max($(document).outerWidth(), containerWidth);

            containerHeight = fullPageHeight;
            containerWidth = fullPageWidth;
        }

        return {
            width: containerWidth - contentWidth,
            height: containerHeight - contentHeight
        };
    },

    _dragUpdateHandler: function(e) {
        const offset = e.offset;
        const prevOffset = this._prevOffset;
        const targetOffset = {
            top: offset.y - prevOffset.y,
            left: offset.x - prevOffset.x
        };

        this._changePosition(targetOffset);

        this._prevOffset = offset;
    },

    _changePosition: function(offset) {
        const position = locate(this._$content);

        move(this._$content, {
            left: position.left + offset.left,
            top: position.top + offset.top
        });

        this._positionChangeHandled = true;
    },

    _allowedOffsets: function() {
        const position = locate(this._$content);
        const deltaSize = this._deltaSize();
        const isAllowedDrag = deltaSize.height >= 0 && deltaSize.width >= 0;
        const shaderOffset = this.option('shading') && !this.option('container') && !this._isWindow(this._getContainer()) ? locate(this._$wrapper) : { top: 0, left: 0 };
        const boundaryOffset = this.option('boundaryOffset');

        return {
            top: isAllowedDrag ? position.top + shaderOffset.top + boundaryOffset.v : 0,
            bottom: isAllowedDrag ? -position.top - shaderOffset.top + deltaSize.height - boundaryOffset.v : 0,
            left: isAllowedDrag ? position.left + shaderOffset.left + boundaryOffset.h : 0,
            right: isAllowedDrag ? -position.left - shaderOffset.left + deltaSize.width - boundaryOffset.h : 0
        };
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
        let renderContainer = containerDefined ? this._$container : swatch.getSwatchContainer($element);

        if(renderContainer && renderContainer[0] === $element.parent()[0]) {
            renderContainer = $element;
        }

        this._$wrapper.appendTo(renderContainer);
    },

    _fixHeightAfterSafariAddressBarResizing: function() {
        if(this._isWindow(this._getContainer()) && hasSafariAddressBar) {
            this._$wrapper.css('minHeight', window.innerHeight);
        }
    },

    _renderGeometry: function(isDimensionChanged) {
        if(this.option('visible') && hasWindow()) {
            this._renderGeometryImpl(isDimensionChanged);
        }
    },

    _renderGeometryImpl: function(isDimensionChanged) {
        this._stopAnimation();
        this._normalizePosition();
        this._renderWrapper();
        this._fixHeightAfterSafariAddressBarResizing();
        this._renderDimensions();
        const resultPosition = this._renderPosition();

        this._actions.onPositioned({ position: resultPosition });
    },

    _fixWrapperPosition: function() {
        this._$wrapper.css('position', this._useFixedPosition() ? 'fixed' : 'absolute');
    },

    _useFixedPosition: function() {
        return this._shouldFixBodyPosition()
            || this.option('_fixedPosition');
    },

    _shouldFixBodyPosition: function() {
        const $container = this._getContainer();
        return this._isWindow($container)
            && (!iOS || this._bodyScrollTop !== undefined);
    },

    _toggleSafariScrolling: function(scrollingEnabled) {
        if(iOS && this._shouldFixBodyPosition()) {
            const body = domAdapter.getBody();
            if(scrollingEnabled) {
                $(body).removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
                window.scrollTo(0, this._bodyScrollTop);
                this._bodyScrollTop = undefined;
            } else if(this.option('visible')) {
                this._bodyScrollTop = window.pageYOffset;
                $(body).addClass(PREVENT_SAFARI_SCROLLING_CLASS);
            }
        }
    },

    _renderWrapper: function() {
        this._fixWrapperPosition();
        this._renderWrapperDimensions();
        this._renderWrapperPosition();
    },

    _renderWrapperDimensions: function() {
        let wrapperWidth;
        let wrapperHeight;
        const $container = this._getContainer();
        if(!$container) {
            return;
        }

        const isWindow = this._isWindow($container);

        wrapperWidth = isWindow ? '' : $container.outerWidth(),
        wrapperHeight = isWindow ? '' : $container.outerHeight();

        this._$wrapper.css({
            width: wrapperWidth,
            height: wrapperHeight
        });
    },

    _isWindow: function($element) {
        return !!$element && isWindow($element.get(0));
    },

    _renderWrapperPosition: function() {
        const $container = this._getContainer();

        if($container) {
            positionUtils.setup(this._$wrapper, { my: 'top left', at: 'top left', of: $container });
        }
    },

    _getContainer: function() {
        const position = this._position;
        const container = this.option('container');
        let positionOf = null;

        if(!container && position) {
            positionOf = isEvent(position.of) ? window : (position.of || window);
        }

        return getElement(container || positionOf);
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
            const allowedOffsets = this._allowedOffsets();

            this._changePosition({
                top: fitIntoRange(0, -allowedOffsets.top, allowedOffsets.bottom),
                left: fitIntoRange(0, -allowedOffsets.left, allowedOffsets.right)
            });
        } else {
            this._renderOverlayBoundaryOffset();

            resetPosition(this._$content);

            const position = this._transformStringPosition(this._position, POSITION_ALIASES);
            const resultPosition = positionUtils.setup(this._$content, position);

            forceRepaint(this._$content);

            // TODO: hotfix for T338096
            this._actions.onPositioning();

            return resultPosition;
        }
    },

    _transformStringPosition: function(position, positionAliases) {
        if(isString(position)) {
            position = extend({}, positionAliases[position]);
        }

        return position;
    },

    _renderOverlayBoundaryOffset: function() {
        const boundaryOffset = this.option('boundaryOffset');

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
        this._renderGeometry(true);
    },

    _clean: function() {
        if(!this._contentAlreadyRendered) {
            this.$content().empty();
        }

        this._renderVisibility(false);
        this._stopShowTimer();

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
        this._toggleSafariScrolling(true);

        this._actions = null;

        this.callBase();

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
            case 'shadingColor':
                this._toggleShading(this.option('visible'));
                break;
            case 'width':
            case 'height':
            case 'minWidth':
            case 'maxWidth':
            case 'minHeight':
            case 'maxHeight':
            case 'boundaryOffset':
                this._renderGeometry();
                break;
            case 'position':
                this._positionChangeHandled = false;
                this._renderGeometry();
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
                this._initTarget(value);
                this._invalidate();
                break;
            case 'container':
                this._initContainer(value);
                this._invalidate();
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
            case 'closeOnTargetScroll':
                this._toggleParentsScrollSubscription(this.option('visible'));
                break;
            case 'closeOnOutsideClick':
            case 'animation':
            case 'propagateOutsideClick':
                break;
            case 'rtlEnabled':
                this._contentAlreadyRendered = false;
                this.callBase(args);
                break;
            case '_fixedPosition':
                this._fixWrapperPosition();
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
            this._renderGeometry();
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
