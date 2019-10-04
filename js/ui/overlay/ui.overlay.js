var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    windowUtils = require("../../core/utils/window"),
    ready = require("../../core/utils/ready_callbacks").add,
    window = windowUtils.getWindow(),
    navigator = windowUtils.getNavigator(),
    eventsEngine = require("../../events/core/events_engine"),
    fx = require("../../animation/fx"),
    translator = require("../../animation/translator"),
    compareVersions = require("../../core/utils/version").compare,
    viewPortUtils = require("../../core/utils/view_port"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    viewPortChanged = viewPortUtils.changeCallback,
    hideTopOverlayCallback = require("../../mobile/hide_top_overlay").hideCallback,
    positionUtils = require("../../animation/position"),
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    domUtils = require("../../core/utils/dom"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    devices = require("../../core/devices"),
    browser = require("../../core/utils/browser"),
    registerComponent = require("../../core/component_registrator"),
    Widget = require("../widget/ui.widget"),
    KeyboardProcessor = require("../widget/ui.keyboard_processor"),
    selectors = require("../widget/selectors"),
    dragEvents = require("../../events/drag"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    Resizable = require("../resizable"),
    EmptyTemplate = require("../widget/empty_template"),
    Deferred = require("../../core/utils/deferred").Deferred,
    zIndexPool = require("./z_index"),
    swatch = require("../widget/swatch_container");

var OVERLAY_CLASS = "dx-overlay",
    OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    OVERLAY_SHADER_CLASS = "dx-overlay-shader",
    OVERLAY_MODAL_CLASS = "dx-overlay-modal",
    INNER_OVERLAY_CLASS = "dx-inner-overlay",
    INVISIBLE_STATE_CLASS = "dx-state-invisible",

    ANONYMOUS_TEMPLATE_NAME = "content",

    RTL_DIRECTION_CLASS = "dx-rtl",

    ACTIONS = ["onShowing", "onShown", "onHiding", "onHidden", "onPositioning", "onPositioned", "onResizeStart", "onResize", "onResizeEnd"],

    OVERLAY_STACK = [],

    DISABLED_STATE_CLASS = "dx-state-disabled",

    PREVENT_SAFARI_SCROLLING_CLASS = "dx-prevent-safari-scrolling",

    TAB_KEY = "tab",

    POSITION_ALIASES = {
        "top": { my: "top center", at: "top center" },
        "bottom": { my: "bottom center", at: "bottom center" },
        "right": { my: "right center", at: "right center" },
        "left": { my: "left center", at: "left center" },
        "center": { my: 'center', at: 'center' },
        "right bottom": { my: 'right bottom', at: 'right bottom' },
        "right top": { my: 'right top', at: 'right top' },
        "left bottom": { my: 'left bottom', at: 'left bottom' },
        "left top": { my: 'left top', at: 'left top' }
    };

var realDevice = devices.real(),
    realVersion = realDevice.version,

    firefoxDesktop = browser.mozilla && realDevice.deviceType === "desktop",
    iOS = realDevice.platform === "ios",
    hasSafariAddressBar = browser.safari && realDevice.deviceType !== "desktop",
    iOS7_0andBelow = iOS && compareVersions(realVersion, [7, 1]) < 0,
    android4_0nativeBrowser = realDevice.platform === "android" && compareVersions(realVersion, [4, 0], 2) === 0 && navigator.userAgent.indexOf("Chrome") === -1;

var forceRepaint = function($element) {
    // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713) and FF desktop (T581681)
    if(iOS7_0andBelow || firefoxDesktop) {
        $element.width();
    }

    // NOTE: force rendering on buggy android (T112083)
    if(android4_0nativeBrowser) {
        var $parents = $element.parents(),
            inScrollView = $parents.is(".dx-scrollable-native");

        if(!inScrollView) {
            $parents.css("backfaceVisibility", "hidden");
            $parents.css("backfaceVisibility");
            $parents.css("backfaceVisibility", "visible");
        }
    }
};


var getElement = function(value) {
    return value && $(value.target || value);
};

ready(function() {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), pointerEvents.down, function(e) {
        for(var i = OVERLAY_STACK.length - 1; i >= 0; i--) {
            if(!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
                return;
            }
        }
    });
});

/**
* @name dxOverlay
* @type object
* @inherits Widget
* @hidden
*/
var Overlay = Widget.inherit({

    _supportedKeys: function() {
        var offsetSize = 5,
            move = function(top, left, e) {
                if(!this.option("dragEnabled")) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                var allowedOffsets = this._allowedOffsets();
                var offset = {
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

            /**
            * @name dxOverlayOptions.visible
            * @type Boolean
            * @default false
            * @fires dxOverlayOptions.onShowing
            * @fires dxOverlayOptions.onHiding
            */
            visible: false,

            /**
             * @name dxOverlayOptions.deferRendering
             * @type Boolean
             * @default true
             */
            deferRendering: true,

            /**
            * @name dxOverlayOptions.shading
            * @type Boolean
            * @default true
            */
            shading: true,

            /**
            * @name dxOverlayOptions.shadingColor
            * @type string
            * @default ''
            */
            shadingColor: "",

            /**
            * @name dxOverlayOptions.position
            * @default { my: 'center', at: 'center', of: window }
            * @fires dxOverlayOptions.onPositioning
            * @fires dxOverlayOptions.onPositioned
            */
            position: {
                my: "center",
                at: "center"
            },

            /**
             * @name dxOverlayOptions.width
             * @type number|string|function
             * @default function() {return $(window).width() * 0.8 }
             * @type_function_return number|string
             */
            width: function() { return $(window).width() * 0.8; },

            /**
             * @name dxOverlayOptions.minWidth
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            minWidth: null,

            /**
             * @name dxOverlayOptions.maxWidth
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            maxWidth: null,

            /**
             * @name dxOverlayOptions.height
             * @type number|string|function
             * @default function() { return $(window).height() * 0.8 }
             * @type_function_return number|string
             */
            height: function() { return $(window).height() * 0.8; },

            /**
             * @name dxOverlayOptions.minHeight
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            minHeight: null,

            /**
             * @name dxOverlayOptions.maxHeight
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            maxHeight: null,

            /**
            * @name dxOverlayOptions.animation
            * @type object
            * @default { show: { type: "pop", duration: 300, from: { scale: 0.55 } }, hide: { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
            * @ref
            */
            animation: {
                /**
                * @name dxOverlayOptions.animation.show
                * @type animationConfig
                * @default { type: "pop", duration: 400, from: { scale: 0.55 } }
                */
                show: {
                    type: "pop",
                    duration: 300,
                    from: {
                        scale: 0.55
                    }
                },
                /**
                * @name dxOverlayOptions.animation.hide
                * @type animationConfig
                * @default { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
                */
                hide: {
                    type: "pop",
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

            /**
            * @name dxOverlayOptions.closeOnOutsideClick
            * @type boolean|function
            * @default false
            * @type_function_param1 event:event
            * @type_function_return Boolean
            */
            closeOnOutsideClick: false,

            closeOnBackButton: true,

            /**
            * @name dxOverlayOptions.onShowing
            * @extends Action
            * @action
            */
            onShowing: null,

            /**
            * @name dxOverlayOptions.onShown
            * @extends Action
            * @action
            */
            onShown: null,

            /**
            * @name dxOverlayOptions.onHiding
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 cancel:boolean
            * @action
            */
            onHiding: null,

            /**
            * @name dxOverlayOptions.onHidden
            * @extends Action
            * @action
            */
            onHidden: null,

            /**
            * @name dxOverlayOptions.contentTemplate
            * @type template|function
            * @default "content"
            * @type_function_param1 contentElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            contentTemplate: "content",

            /**
            * @name dxOverlayOptions.dragEnabled
            * @type boolean
            * @default false
            */
            dragEnabled: false,

            resizeEnabled: false,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,
            innerOverlay: false,

            // NOTE: private options

            target: undefined,
            container: undefined,

            hideTopOverlayHandler: undefined,
            closeOnTargetScroll: false,
            onPositioned: null,
            boundaryOffset: { h: 0, v: 0 },
            propagateOutsideClick: false,
            ignoreChildEvents: true,
            _checkParentVisibility: true
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                var realDevice = devices.real(),
                    realPlatform = realDevice.platform,
                    realVersion = realDevice.version;

                return realPlatform === "android" && compareVersions(realVersion, [4, 2]) < 0;
            },
            options: {
                /**
                 * @name dxOverlayOptions.animation
                 * @default { show: { type: 'fade', duration: 400 }, hide: { type: 'fade', duration: 400, to: { opacity: 0 }, from: { opacity: 1 } }} @for Android_below_version_4.2
                 */
                animation: {
                    show: {
                        type: "fade",
                        duration: 400
                    },
                    hide: {
                        type: "fade",
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
                return !windowUtils.hasWindow();
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

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
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

        this._$wrapper = $("<div>").addClass(OVERLAY_WRAPPER_CLASS);
        this._$content = $("<div>").addClass(OVERLAY_CONTENT_CLASS);
        this._initInnerOverlayClass();

        var $element = this.$element();
        this._$wrapper.addClass($element.attr("class"));
        $element.addClass(OVERLAY_CLASS);

        this._$wrapper.attr("data-bind", "dxControlsDescendantBindings: true");

        // NOTE: hack to fix B251087
        eventsEngine.on(this._$wrapper, "MSPointerDown", noop);
        // NOTE: bootstrap integration T342292
        eventsEngine.on(this._$wrapper, "focusin", function(e) { e.stopPropagation(); });

        this._toggleViewPortSubscription(true);
    },

    _initOptions: function(options) {
        this._initTarget(options.target);
        var container = options.container === undefined ? this.option("container") : options.container;
        this._initContainer(container);
        this._initHideTopOverlayHandler(options.hideTopOverlayHandler);

        this.callBase(options);
    },

    _initInnerOverlayClass: function() {
        this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option("innerOverlay"));
    },

    _initTarget: function(target) {
        if(!typeUtils.isDefined(target)) {
            return;
        }

        var options = this.option();
        each([
            "position.of",
            "animation.show.from.position.of",
            "animation.show.to.position.of",
            "animation.hide.from.position.of",
            "animation.hide.to.position.of"
        ], function(_, path) {
            var pathParts = path.split(".");

            var option = options;
            while(option) {
                if(pathParts.length === 1) {
                    if(typeUtils.isPlainObject(option)) {
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
        container = container === undefined ? viewPortUtils.value() : container;

        var $element = this.$element();
        var $container = $element.closest(container);

        if(!$container.length) {
            $container = $(container).first();
        }

        this._$container = $container.length ? $container : $element.parent();
    },

    _initHideTopOverlayHandler: function(handler) {
        this._hideTopOverlayHandler = handler !== undefined ? handler : this._defaultHideTopOverlayHandler.bind(this);
    },

    _defaultHideTopOverlayHandler: function() {
        this.hide();
    },

    _initActions: function() {
        this._actions = {};

        each(ACTIONS, (function(_, action) {
            this._actions[action] = this._createActionByOption(action, {
                excludeValidators: ["disabled", "readOnly"]
            }) || noop;
        }).bind(this));
    },

    _initCloseOnOutsideClickHandler: function() {
        var that = this;
        this._proxiedDocumentDownHandler = function() {
            return that._documentDownHandler.apply(that, arguments);
        };
    },

    _documentDownHandler: function(e) {
        if(this._showAnimationProcessing) {
            this._stopAnimation();
        }

        var closeOnOutsideClick = this.option("closeOnOutsideClick");

        if(typeUtils.isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }

        var $container = this._$content,
            isAttachedTarget = $(window.document).is(e.target) || domUtils.contains(window.document, e.target),
            isInnerOverlay = $(e.target).closest("." + INNER_OVERLAY_CLASS).length,
            outsideClick = isAttachedTarget && !isInnerOverlay && !($container.is(e.target) || domUtils.contains($container.get(0), e.target));

        if(outsideClick && closeOnOutsideClick) {
            if(this.option("shading")) {
                e.preventDefault();
            }

            this.hide();
        }

        return this.option("propagateOutsideClick");
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _isTopOverlay: function() {
        var overlayStack = this._overlayStack();

        for(var i = overlayStack.length - 1; i >= 0; i--) {
            var tabbableElements = overlayStack[i]._findTabbableBounds();

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
        this._initContainer(this.option("container"));
        this._refresh();
    },

    _renderVisibilityAnimate: function(visible) {
        this._stopAnimation();

        return visible ? this._show() : this._hide();
    },

    _normalizePosition: function() {
        var position = this.option("position");
        this._position = typeof position === "function" ? position() : position;
    },

    _getAnimationConfig: function() {
        var animation = this.option("animation");
        if(typeUtils.isFunction(animation)) animation = animation.call(this);
        return animation;
    },

    _show: function() {
        var that = this,
            deferred = new Deferred();

        this._parentHidden = this._isParentHidden();
        deferred.done(function() {
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

        this._normalizePosition();

        var animation = that._getAnimationConfig() || {},
            showAnimation = this._normalizeAnimation(animation.show, "to"),
            startShowAnimation = (showAnimation && showAnimation.start) || noop,
            completeShowAnimation = (showAnimation && showAnimation.complete) || noop;

        if(this._isHidingActionCanceled) {
            delete this._isHidingActionCanceled;
            deferred.resolve();
        } else {
            var show = function() {
                this._renderVisibility(true);

                this._animate(showAnimation, function() {
                    if(that.option("focusStateEnabled")) {
                        eventsEngine.trigger(that._focusTarget(), "focus");
                    }

                    completeShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = false;
                    that._actions.onShown();
                    that._toggleSafariScrolling(false);
                    deferred.resolve();
                }, function() {
                    startShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = true;
                });
            }.bind(this);

            if(this.option("templatesRenderAsynchronously")) {
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
                type: "slide"
            }, animation);

            if(animation[prop] && typeof animation[prop] === "object") {
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

        var that = this,
            deferred = new Deferred(),
            animation = that._getAnimationConfig() || {},
            hideAnimation = this._normalizeAnimation(animation.hide, "from"),
            startHideAnimation = (hideAnimation && hideAnimation.start) || noop,
            completeHideAnimation = (hideAnimation && hideAnimation.complete) || noop,
            hidingArgs = { cancel: false };

        this._actions.onHiding(hidingArgs);

        that._toggleSafariScrolling(true);

        if(hidingArgs.cancel) {
            this._isHidingActionCanceled = true;
            this.option("visible", true);
            deferred.resolve();
        } else {
            this._forceFocusLost();
            this._toggleShading(false);
            this._toggleSubscriptions(false);
            this._stopShowTimer();

            this._animate(hideAnimation,
                function() {
                    that._$content.css("pointerEvents", "");
                    that._renderVisibility(false);

                    completeHideAnimation.apply(this, arguments);
                    that._actions.onHidden();

                    deferred.resolve();
                },

                function() {
                    that._$content.css("pointerEvents", "none");
                    startHideAnimation.apply(this, arguments);
                }
            );
        }
        return deferred.promise();
    },

    _forceFocusLost: function() {
        var activeElement = domAdapter.getActiveElement();
        var shouldResetActiveElement = !!this._$content.find(activeElement).length;

        if(shouldResetActiveElement) {
            domUtils.resetActiveElement();
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
            domUtils.triggerHidingEvent(this._$content);
        }

        this._toggleVisibility(visible);

        this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        this._updateZIndexStackPosition(visible);

        if(visible) {
            this._renderContent();
            this._actions.onShowing();

            this._moveToContainer();
            this._renderGeometry();

            domUtils.triggerShownEvent(this._$content);
            domUtils.triggerResizeEvent(this._$content);
        } else {
            this._moveFromContainer();
        }
        this._toggleShading(visible);

        this._toggleSubscriptions(visible);
    },

    _updateZIndexStackPosition: function(pushToStack) {
        var overlayStack = this._overlayStack(),
            index = inArray(this, overlayStack);

        if(pushToStack) {
            if(index === -1) {
                this._zIndex = zIndexPool.create(this._zIndexInitValue());

                overlayStack.push(this);
            }

            this._$wrapper.css("zIndex", this._zIndex);
            this._$content.css("zIndex", this._zIndex);
        } else if(index !== -1) {
            overlayStack.splice(index, 1);
            zIndexPool.remove(this._zIndex);
        }
    },

    _toggleShading: function(visible) {
        this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option("shading") && !this.option("container"));
        this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option("shading"));

        this._$wrapper.css("backgroundColor", this.option("shading") ? this.option("shadingColor") : "");

        this._toggleTabTerminator(visible && this.option("shading"));
    },

    _initTabTerminatorHandler: function() {
        var that = this;
        this._proxiedTabTerminatorHandler = function() {
            that._tabKeyHandler.apply(that, arguments);
        };
    },

    _toggleTabTerminator: function(enabled) {
        var eventName = eventUtils.addNamespace("keydown", this.NAME);
        if(enabled) {
            eventsEngine.on(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
        } else {
            eventsEngine.off(domAdapter.getDocument(), eventName, this._proxiedTabTerminatorHandler);
        }
    },

    _findTabbableBounds: function() {
        var $elements = this._$wrapper.find("*");
        var elementsCount = $elements.length - 1;
        var result = { first: null, last: null };

        for(var i = 0; i <= elementsCount; i++) {
            if(!result.first && $elements.eq(i).is(selectors.tabbable)) {
                result.first = $elements.eq(i);
            }

            if(!result.last && $elements.eq(elementsCount - i).is(selectors.tabbable)) {
                result.last = $elements.eq(elementsCount - i);
            }

            if(result.first && result.last) {
                break;
            }
        }

        return result;
    },

    _tabKeyHandler: function(e) {
        if(eventUtils.normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
            return;
        }

        var tabbableElements = this._findTabbableBounds(),

            $firstTabbable = tabbableElements.first,
            $lastTabbable = tabbableElements.last,

            isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0),
            isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0),
            isEmptyTabList = tabbableElements.length === 0,
            isOutsideTarget = !domUtils.contains(this._$wrapper.get(0), e.target);

        if(isTabOnLast || isShiftTabOnFirst ||
            isEmptyTabList || isOutsideTarget) {

            e.preventDefault();

            var $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;

            eventsEngine.trigger($focusElement, "focusin");
            eventsEngine.trigger($focusElement, "focus");
        }
    },

    _toggleSubscriptions: function(enabled) {
        if(windowUtils.hasWindow()) {
            this._toggleHideTopOverlayCallback(enabled);
            this._toggleParentsScrollSubscription(enabled);
        }
    },

    _toggleHideTopOverlayCallback: function(subscribe) {
        if(!this._hideTopOverlayHandler) {
            return;
        }

        if(subscribe && this.option("closeOnBackButton")) {
            hideTopOverlayCallback.add(this._hideTopOverlayHandler);
        } else {
            hideTopOverlayCallback.remove(this._hideTopOverlayHandler);
        }
    },

    _toggleParentsScrollSubscription: function(subscribe) {
        if(!this._position) {
            return;
        }

        var target = this._position.of || $(),
            closeOnScroll = this.option("closeOnTargetScroll"),
            $parents = getElement(target).parents(),
            scrollEvent = eventUtils.addNamespace("scroll", this.NAME);

        if(devices.real().platform === "generic") {
            $parents = $parents.add(window);
        }

        this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler
            || (function(e) { this._targetParentsScrollHandler(e); }).bind(this);

        eventsEngine.off($().add(this._$prevTargetParents), scrollEvent, this._proxiedTargetParentsScrollHandler);

        if(subscribe && closeOnScroll) {
            eventsEngine.on($parents, scrollEvent, this._proxiedTargetParentsScrollHandler);
            this._$prevTargetParents = $parents;
        }
    },

    _targetParentsScrollHandler: function(e) {
        var closeHandled = false,
            closeOnScroll = this.option("closeOnTargetScroll");
        if(typeUtils.isFunction(closeOnScroll)) {
            closeHandled = closeOnScroll(e);
        }

        if(!closeHandled && !this._showAnimationProcessing) {
            this.hide();
        }
    },

    _render: function() {
        this.callBase();

        this._appendContentToElement();
        this._renderVisibilityAnimate(this.option("visible"));
    },

    _appendContentToElement: function() {
        if(!this._$content.parent().is(this.$element())) {
            this._$content.appendTo(this.$element());
        }
    },

    _renderContent: function() {
        var shouldDeferRendering = !this._currentVisible && this.option("deferRendering");
        var isParentHidden = this.option("visible") && this._isParentHidden();

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
        if(!this.option("_checkParentVisibility")) {
            return false;
        }

        if(this._parentHidden !== undefined) {
            return this._parentHidden;
        }

        var $parent = this.$element().parent();

        if($parent.is(":visible")) {
            return false;
        }

        var isHidden = false;
        $parent.add($parent.parents()).each(function() {
            var $element = $(this);
            if($element.css("display") === "none") {
                isHidden = true;
                return false;
            }
        });

        return isHidden || !domAdapter.getBody().contains($parent.get(0));
    },

    _renderContentImpl: function() {
        const whenContentRendered = new Deferred();

        const contentTemplateOption = this.option("contentTemplate"),
            contentTemplate = this._getTemplate(contentTemplateOption),
            transclude = this._getAnonymousTemplateName() === contentTemplateOption;
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
            if(this.option("visible")) {
                this._moveToContainer();
            }
        });

        return whenContentRendered.promise();
    },

    _renderDrag: function() {
        var $dragTarget = this._getDragTarget();

        if(!$dragTarget) {
            return;
        }

        var startEventName = eventUtils.addNamespace(dragEvents.start, this.NAME),
            updateEventName = eventUtils.addNamespace(dragEvents.move, this.NAME);

        eventsEngine.off($dragTarget, startEventName);
        eventsEngine.off($dragTarget, updateEventName);

        if(!this.option("dragEnabled")) {
            return;
        }

        eventsEngine.on($dragTarget, startEventName, this._dragStartHandler.bind(this));
        eventsEngine.on($dragTarget, updateEventName, this._dragUpdateHandler.bind(this));
    },

    _renderResize: function() {
        this._resizable = this._createComponent(this._$content, Resizable, {
            handles: this.option("resizeEnabled") ? "all" : "none",
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

        var width = this._resizable.option("width"),
            height = this._resizable.option("height");

        width && this.option("width", width);
        height && this.option("height", height);

        this._actions.onResizeEnd();
    },

    _renderScrollTerminator: function() {
        var $scrollTerminator = this._wrapper();
        var terminatorEventName = eventUtils.addNamespace(dragEvents.move, this.NAME);

        eventsEngine.off($scrollTerminator, terminatorEventName);
        eventsEngine.on($scrollTerminator, terminatorEventName, {
            validate: function() {
                return true;
            },
            getDirection: function() {
                return "both";
            },
            _toggleGestureCover: noop,
            _clearSelection: noop,
            isNative: true
        }, function(e) {
            var originalEvent = e.originalEvent.originalEvent;
            e._cancelPreventDefault = true;

            if(originalEvent && originalEvent.type !== "mousemove") {
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

        var allowedOffsets = this._allowedOffsets();
        e.maxTopOffset = allowedOffsets.top;
        e.maxBottomOffset = allowedOffsets.bottom;
        e.maxLeftOffset = allowedOffsets.left;
        e.maxRightOffset = allowedOffsets.right;
    },

    _getDragResizeContainer: function() {
        var isContainerDefined = viewPortUtils.originalViewPort().get(0) || this.option("container"),
            $container = !isContainerDefined ? $(window) : this._$container;

        return $container;
    },

    _deltaSize: function() {
        var $content = this._$content,
            $container = this._getDragResizeContainer();

        var contentWidth = $content.outerWidth(),
            contentHeight = $content.outerHeight(),
            containerWidth = $container.outerWidth(),
            containerHeight = $container.outerHeight();

        if(this._isWindow($container)) {
            var document = domAdapter.getDocument(),
                fullPageHeight = Math.max($(document).outerHeight(), containerHeight),
                fullPageWidth = Math.max($(document).outerWidth(), containerWidth);

            containerHeight = fullPageHeight;
            containerWidth = fullPageWidth;
        }

        return {
            width: containerWidth - contentWidth,
            height: containerHeight - contentHeight
        };
    },

    _dragUpdateHandler: function(e) {
        var offset = e.offset,
            prevOffset = this._prevOffset,
            targetOffset = {
                top: offset.y - prevOffset.y,
                left: offset.x - prevOffset.x
            };

        this._changePosition(targetOffset);

        this._prevOffset = offset;
    },

    _changePosition: function(offset) {
        var position = translator.locate(this._$content);

        translator.move(this._$content, {
            left: position.left + offset.left,
            top: position.top + offset.top
        });

        this._positionChangeHandled = true;
    },

    _allowedOffsets: function() {
        var position = translator.locate(this._$content),
            deltaSize = this._deltaSize(),
            isAllowedDrag = deltaSize.height >= 0 && deltaSize.width >= 0,
            shaderOffset = this.option("shading") && !this.option("container") && !this._isWindow(this._getContainer()) ? translator.locate(this._$wrapper) : { top: 0, left: 0 },
            boundaryOffset = this.option("boundaryOffset");

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
        var $element = this.$element();
        var containerDefined = this.option("container") !== undefined;
        var renderContainer = containerDefined ? this._$container : swatch.getSwatchContainer($element);

        if(renderContainer && renderContainer[0] === $element.parent()[0]) {
            renderContainer = $element;
        }

        this._$wrapper.appendTo(renderContainer);
    },

    _fixHeightAfterSafariAddressBarResizing: function() {
        if(this._isWindow(this._getContainer()) && hasSafariAddressBar) {
            this._$wrapper.css("minHeight", window.innerHeight);
        }
    },

    _renderGeometry: function(isDimensionChanged) {
        if(this.option("visible") && windowUtils.hasWindow()) {
            this._renderGeometryImpl(isDimensionChanged);
        }
    },

    _renderGeometryImpl: function(isDimensionChanged) {
        this._stopAnimation();
        this._normalizePosition();
        this._renderShading();
        this._fixHeightAfterSafariAddressBarResizing();
        this._renderDimensions();
        var resultPosition = this._renderPosition();

        this._actions.onPositioned({ position: resultPosition });
    },

    _fixWrapperPosition: function() {
        this._$wrapper.css("position", this._useFixedPosition() ? "fixed" : "absolute");
    },

    _useFixedPosition: function() {
        var $container = this._getContainer();
        return this._isWindow($container) && (!iOS || this._bodyScrollTop !== undefined);
    },

    _toggleSafariScrolling: function(scrollingEnabled) {
        if(iOS && this._useFixedPosition()) {
            var body = domAdapter.getBody();
            if(scrollingEnabled) {
                $(body).removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
                window.scrollTo(0, this._bodyScrollTop);
                this._bodyScrollTop = undefined;
            } else if(this.option("visible")) {
                this._bodyScrollTop = window.pageYOffset;
                $(body).addClass(PREVENT_SAFARI_SCROLLING_CLASS);
            }
        }
    },

    _renderShading: function() {
        this._fixWrapperPosition();
        this._renderShadingDimensions();
        this._renderShadingPosition();
    },

    _renderShadingPosition: function() {
        if(this.option("shading")) {
            var $container = this._getContainer();

            positionUtils.setup(this._$wrapper, { my: "top left", at: "top left", of: $container });
        }
    },

    _renderShadingDimensions: function() {
        var wrapperWidth, wrapperHeight;

        if(this.option("shading")) {
            var $container = this._getContainer();

            wrapperWidth = this._isWindow($container) ? "100%" : $container.outerWidth(),
            wrapperHeight = this._isWindow($container) ? "100%" : $container.outerHeight();
        } else {
            wrapperWidth = "";
            wrapperHeight = "";
        }

        this._$wrapper.css({
            width: wrapperWidth,
            height: wrapperHeight
        });
    },

    _isWindow: function($element) {
        return !!$element && typeUtils.isWindow($element.get(0));
    },

    _getContainer: function() {
        var position = this._position,
            container = this.option("container"),
            positionOf = position ? position.of || window : null;

        return getElement(container || positionOf);
    },

    _renderDimensions: function() {
        var content = this._$content.get(0);

        this._$content.css({
            minWidth: this._getOptionValue("minWidth", content),
            maxWidth: this._getOptionValue("maxWidth", content),
            minHeight: this._getOptionValue("minHeight", content),
            maxHeight: this._getOptionValue("maxHeight", content),
            width: this._getOptionValue("width", content),
            height: this._getOptionValue("height", content)
        });
    },

    _renderPosition: function() {
        if(this._positionChangeHandled) {
            var allowedOffsets = this._allowedOffsets();

            this._changePosition({
                top: fitIntoRange(0, -allowedOffsets.top, allowedOffsets.bottom),
                left: fitIntoRange(0, -allowedOffsets.left, allowedOffsets.right)
            });
        } else {
            this._renderOverlayBoundaryOffset();

            translator.resetPosition(this._$content);

            var position = this._transformStringPosition(this._position, POSITION_ALIASES),
                resultPosition = positionUtils.setup(this._$content, position);

            forceRepaint(this._$content);

            // TODO: hotfix for T338096
            this._actions.onPositioning();

            return resultPosition;
        }
    },

    _transformStringPosition: function(position, positionAliases) {
        if(typeUtils.isString(position)) {
            position = extend({}, positionAliases[position]);
        }

        return position;
    },

    _renderOverlayBoundaryOffset: function() {
        var boundaryOffset = this.option("boundaryOffset");

        this._$content.css("margin", boundaryOffset.v + "px " + boundaryOffset.h + "px");
    },

    _focusTarget: function() {
        return this._$content;
    },

    _attachKeyboardEvents: function() {
        this._keyboardProcessor = new KeyboardProcessor({
            element: this._$content,
            handler: this._keyboardHandler,
            context: this
        });
    },

    _keyboardHandler: function(options) {
        var e = options.originalEvent,
            $target = $(e.target);

        if($target.is(this._$content) || !this.option("ignoreChildEvents")) {
            this.callBase.apply(this, arguments);
        }
    },

    _isVisible: function() {
        return this.option("visible");
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            if(this.option("visible")) {
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
        this.callBase.apply(this, arguments);
        this._$content.toggleClass(DISABLED_STATE_CLASS, Boolean(value));
    },

    _toggleRTLDirection: function(rtl) {
        this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
    },

    _optionChanged: function(args) {
        var value = args.value;

        if(inArray(args.name, ACTIONS) > -1) {
            this._initActions();
            return;
        }

        switch(args.name) {
            case "dragEnabled":
                this._renderDrag();
                this._renderGeometry();
                break;
            case "resizeEnabled":
                this._renderResize();
                this._renderGeometry();
                break;
            case "shading":
            case "shadingColor":
                this._toggleShading(this.option("visible"));
                break;
            case "width":
            case "height":
            case "minWidth":
            case "maxWidth":
            case "minHeight":
            case "maxHeight":
            case "boundaryOffset":
                this._renderGeometry();
                break;
            case "position":
                this._positionChangeHandled = false;
                this._renderGeometry();
                break;
            case "visible":
                this._renderVisibilityAnimate(value).done((function() {
                    if(!this._animateDeferred) {
                        return;
                    }

                    this._animateDeferred.resolveWith(this);
                }).bind(this));
                break;
            case "target":
                this._initTarget(value);
                this._invalidate();
                break;
            case "container":
                this._initContainer(value);
                this._invalidate();
                break;
            case "innerOverlay":
                this._initInnerOverlayClass();
                break;
            case "deferRendering":
            case "contentTemplate":
                this._contentAlreadyRendered = false;
                this._clean();
                this._invalidate();
                break;
            case "closeOnBackButton":
                this._toggleHideTopOverlayCallback(this.option("visible"));
                break;
            case "closeOnTargetScroll":
                this._toggleParentsScrollSubscription(this.option("visible"));
                break;
            case "closeOnOutsideClick":
            case "animation":
            case "propagateOutsideClick":
                break;
            case "rtlEnabled":
                this._contentAlreadyRendered = false;
                this.option("visible", false);
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxOverlaymethods.toggle
    * @publicName toggle(showing)
    * @param1 showing:boolean
    * @return Promise<void>
    */
    toggle: function(showing) {
        showing = showing === undefined ? !this.option("visible") : showing;

        if(showing === this.option("visible")) {
            return new Deferred().resolve().promise();
        }

        var animateDeferred = new Deferred();
        this._animateDeferred = animateDeferred;
        this.option("visible", showing);

        return animateDeferred.promise().done((function() {
            delete this._animateDeferred;
        }).bind(this));
    },

    $content: function() {
        return this._$content;
    },

    /**
    * @name dxOverlaymethods.show
    * @publicName show()
    * @return Promise<void>
    */
    show: function() {
        return this.toggle(true);
    },

    /**
    * @name dxOverlaymethods.hide
    * @publicName hide()
    * @return Promise<void>
    */
    hide: function() {
        return this.toggle(false);
    },

    /**
    * @name dxOverlaymethods.content
    * @publicName content()
    * @return dxElement
    */
    content: function() {
        return getPublicElement(this._$content);
    },

    /**
    * @name dxOverlaymethods.repaint
    * @publicName repaint()
    */
    repaint: function() {
        this._renderGeometry();
        domUtils.triggerResizeEvent(this._$content);
    }
});

/**
* @name ui.dxOverlay
* @section utils
*/
/**
* @name ui.dxOverlayMethods.baseZIndex
* @publicName baseZIndex(zIndex)
* @param1 zIndex:number
* @namespace DevExpress.ui.dxOverlay
* @module ui/overlay
* @export dxOverlay.baseZIndex
* @static
*/
Overlay.baseZIndex = function(zIndex) {
    return zIndexPool.base(zIndex);
};

registerComponent("dxOverlay", Overlay);

module.exports = Overlay;
