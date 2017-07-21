"use strict";

var $ = require("../core/renderer"),
    fx = require("../animation/fx"),
    translator = require("../animation/translator"),
    compareVersions = require("../core/utils/version").compare,
    viewPortUtils = require("../core/utils/view_port"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    viewPortChanged = viewPortUtils.changeCallback,
    hideTopOverlayCallback = require("../mobile/hide_top_overlay").hideCallback,
    positionUtils = require("../animation/position"),
    fitIntoRange = require("../core/utils/math").fitIntoRange,
    domUtils = require("../core/utils/dom"),
    noop = require("../core/utils/common").noop,
    typeUtils = require("../core/utils/type"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    Widget = require("./widget/ui.widget"),
    KeyboardProcessor = require("./widget/ui.keyboard_processor"),
    selectors = require("./widget/jquery.selectors"),
    dragEvents = require("../events/drag"),
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    Resizable = require("./resizable"),
    EmptyTemplate = require("./widget/empty_template");

var OVERLAY_CLASS = "dx-overlay",
    OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    OVERLAY_SHADER_CLASS = "dx-overlay-shader",
    OVERLAY_MODAL_CLASS = "dx-overlay-modal",

    INVISIBLE_STATE_CLASS = "dx-state-invisible",

    ANONYMOUS_TEMPLATE_NAME = "content",

    RTL_DIRECTION_CLASS = "dx-rtl",

    ACTIONS = ["onShowing", "onShown", "onHiding", "onHidden", "onPositioning", "onPositioned", "onResizeStart", "onResize", "onResizeEnd"],

    FIRST_Z_INDEX = 1500,

    OVERLAY_STACK = [],

    DISABLED_STATE_CLASS = "dx-state-disabled",

    TAB_KEY = 9;


var realDevice = devices.real(),
    realVersion = realDevice.version,

    iOS = realDevice.platform === "ios",
    iOS7_0andBelow = iOS && compareVersions(realVersion, [7, 1]) < 0,
    android4_0nativeBrowser = realDevice.platform === "android" && compareVersions(realVersion, [4, 0], 2) === 0 && navigator.userAgent.indexOf("Chrome") === -1;

var forceRepaint = function($element) {
    // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)
    if(iOS7_0andBelow) {
        $element.width();
    }

    // NOTE: force rendering on buggy android (T112083)
    if(android4_0nativeBrowser) {
        var $parents = $element.parents(),
            inScrollView = $parents.is(".dx-scrollable-native");

        if(!inScrollView) {
            $parents.css("backface-visibility", "hidden");
            $parents.css("backface-visibility");
            $parents.css("backface-visibility", "visible");
        }
    }
};


var getElement = function(value) {
    return value && $(value instanceof $.Event ? value.target : value);
};

$(document).on(pointerEvents.down, function(e) {
    for(var i = OVERLAY_STACK.length - 1; i >= 0; i--) {
        if(!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
            return;
        }
    }
});

/**
* @name dxOverlay
* @publicName dxOverlay
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
            * @name dxOverlayOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @extend_doc
            */
            activeStateEnabled: false,

            /**
            * @name dxOverlayOptions_visible
            * @publicName visible
            * @type Boolean
            * @default false
            */
            visible: false,

            /**
             * @name dxOverlayOptions_deferRendering
             * @publicName deferRendering
             * @type Boolean
             * @default true
             */
            deferRendering: true,

            /**
            * @name dxOverlayOptions_shading
            * @publicName shading
            * @type Boolean
            * @default true
            */
            shading: true,

            /**
            * @name dxOverlayOptions_shadingColor
            * @publicName shadingColor
            * @type string
            * @default ''
            */
            shadingColor: "",

            /**
            * @name dxOverlayOptions_position
            * @publicName position
            * @type positionConfig
            * @default { my: 'center', at: 'center', of: window }
            */
            position: {
                my: "center",
                at: "center"
            },

            /**
             * @name dxOverlayOptions_width
             * @publicName width
             * @type number|string|function
             * @default function() {return $(window).width() * 0.8 }
             * @type_function_return number|string
             */
            width: function() { return $(window).width() * 0.8; },

            /**
             * @name dxOverlayOptions_minWidth
             * @publicName minWidth
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            minWidth: null,

            /**
             * @name dxOverlayOptions_maxWidth
             * @publicName maxWidth
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            maxWidth: null,

            /**
             * @name dxOverlayOptions_height
             * @publicName height
             * @type number|string|function
             * @default function() { return $(window).height() * 0.8 }
             * @type_function_return number|string
             */
            height: function() { return $(window).height() * 0.8; },

            /**
             * @name dxOverlayOptions_minHeight
             * @publicName minHeight
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            minHeight: null,

            /**
             * @name dxOverlayOptions_maxHeight
             * @publicName maxHeight
             * @type number|string|function
             * @default null
             * @type_function_return number|string
             */
            maxHeight: null,

            /**
            * @name dxOverlayOptions_animation
            * @publicName animation
            * @type object
            * @default { show: { type: "pop", duration: 300, from: { scale: 0.55 } }, hide: { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
            * @ref
            */
            animation: {
                /**
                * @name dxOverlayOptions_animation_show
                * @publicName show
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
                * @name dxOverlayOptions_animation_hide
                * @publicName hide
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
            * @name dxOverlayOptions_closeOnOutsideClick
            * @publicName closeOnOutsideClick
            * @type boolean|function
            * @default false
            * @type_function_param1 event:jQueryEvent
            * @type_function_return Boolean
            */
            closeOnOutsideClick: false,

            /**
            * @name dxOverlayOptions_closeOnBackButton
            * @publicName closeOnBackButton
            * @type boolean
            * @default true
            */
            closeOnBackButton: true,

            /**
            * @name dxOverlayOptions_onShowing
            * @publicName onShowing
            * @extends Action
            * @action
            */
            onShowing: null,

            /**
            * @name dxOverlayOptions_onShown
            * @publicName onShown
            * @extends Action
            * @action
            */
            onShown: null,

            /**
            * @name dxOverlayOptions_onHiding
            * @publicName onHiding
            * @extends Action
            * @type_function_param1_field4 cancel:boolean
            * @action
            */
            onHiding: null,

            /**
            * @name dxOverlayOptions_onHidden
            * @publicName onHidden
            * @extends Action
            * @action
            */
            onHidden: null,

            /**
            * @name dxOverlayOptions_contentTemplate
            * @publicName contentTemplate
            * @type template
            * @default "content"
            * @type_function_param1 contentElement:jQuery
            * @type_function_return string|jQuery
            */
            contentTemplate: "content",

            /**
            * @name dxOverlayOptions_dragEnabled
            * @publicName dragEnabled
            * @type boolean
            * @default false
            */
            dragEnabled: false,

            resizeEnabled: false,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,

            /**
            * @name dxOverlayOptions_onContentReady
            * @publicName onContentReady
            * @extends Action
            * @hidden false
            * @action
            * @extend_doc
            */
            onContentReady: null,

            // NOTE: private options

            target: undefined,
            container: undefined,

            hideTopOverlayHandler: undefined,
            closeOnTargetScroll: false,
            onPositioned: null,
            boundaryOffset: { h: 0, v: 0 },
            propagateOutsideClick: false,
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
                 * @name dxOverlayOptions_animation
                 * @publicName animation
                 * @custom_default_for_android_below_version_4 { show: { type: "fade", duration: 400 }, hide: { type: "fade", duration: 400, to: { opacity: 0 }, from: { opacity: 1 } } }
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

        var $element = this.element();
        this._$wrapper.addClass($element.attr("class"));
        $element.addClass(OVERLAY_CLASS);

        this._$wrapper.attr("data-bind", "dxControlsDescendantBindings: true");

        // NOTE: hack to fix B251087
        this._$wrapper.on("MSPointerDown", noop);
        // NOTE: bootstrap integration T342292
        this._$wrapper.on("focusin", function(e) { e.stopPropagation(); });

        this._toggleViewPortSubscription(true);
    },

    _initOptions: function(options) {
        this._initTarget(options.target);
        this._initContainer(options.container);
        this._initHideTopOverlayHandler(options.hideTopOverlayHandler);

        this.callBase(options);
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

        var $element = this.element(),
            $container = $element.closest(container);

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
            return;
        }

        var closeOnOutsideClick = this.option("closeOnOutsideClick");

        if(typeUtils.isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }
        if(closeOnOutsideClick) {
            var $container = this._$content,
                outsideClick = (!$container.is(e.target) && !$container.get(0).contains(e.target) && $(e.target).closest(document).length);

            if(outsideClick) {
                if(this.option("shading")) {
                    e.preventDefault();
                }

                this.hide();
            }
        }

        return this.option("propagateOutsideClick");
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _isTopOverlay: function() {
        var overlayStack = this._overlayStack();
        return overlayStack[overlayStack.length - 1] === this;
    },

    _overlayStack: function() {
        return OVERLAY_STACK;
    },

    _zIndexInitValue: function() {
        return FIRST_Z_INDEX;
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
        this._position = this.option("position");
    },

    _getAnimationConfig: function() {
        var animation = this.option("animation");
        if(typeUtils.isFunction(animation)) animation = animation.call(this);
        return animation;
    },

    _show: function() {
        var that = this,
            deferred = $.Deferred();

        this._parentHidden = this._isParentHidden();
        deferred.done(function() {
            delete that._parentHidden;
        });

        if(this._parentHidden) {
            return deferred.resolve();
        }

        if(this._currentVisible) {
            return $.Deferred().resolve().promise();
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
                        that._focusTarget().focus();
                    }

                    completeShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = false;
                    that._actions.onShown();
                    deferred.resolve();
                }, function() {
                    startShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = true;
                });
            }.bind(this);

            if(this.option("templatesRenderAsynchronously")) {
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
            return $.Deferred().resolve().promise();
        }
        this._currentVisible = false;

        var that = this,
            deferred = $.Deferred(),
            animation = that._getAnimationConfig() || {},
            hideAnimation = this._normalizeAnimation(animation.hide, "from"),
            completeHideAnimation = (hideAnimation && hideAnimation.complete) || noop,
            hidingArgs = { cancel: false };

        this._actions.onHiding(hidingArgs);

        if(hidingArgs.cancel) {
            this._isHidingActionCanceled = true;
            this.option("visible", true);
            deferred.resolve();
        } else {
            this._forceFocusLost();
            this._toggleShading(false);
            this._toggleSubscriptions(false);

            this._animate(hideAnimation, function() {
                that._renderVisibility(false);

                completeHideAnimation.apply(this, arguments);
                that._actions.onHidden();

                deferred.resolve();
            });
        }
        return deferred.promise();
    },

    _forceFocusLost: function() {
        document.activeElement && this._$content.find(document.activeElement).length && document.activeElement.blur();
    },

    _animate: function(animation, completeCallback, startCallback) {
        if(animation) {
            startCallback = startCallback || animation.start || noop;

            var $content = this._$content;

            fx.animate(this._$content, extend({}, animation, {
                start: function() {
                    $content.css("pointer-events", "none");

                    startCallback.apply(this, arguments);
                },
                complete: function() {
                    $content.css("pointer-events", "");

                    completeCallback.apply(this, arguments);
                }
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
        clearTimeout(this._asyncShowTimeout);

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
                var length = overlayStack.length;
                this._zIndex = (length ? overlayStack[length - 1]._zIndex : this._zIndexInitValue()) + 1;

                overlayStack.push(this);
            }

            this._$wrapper.css("z-index", this._zIndex);
            this._$content.css("z-index", this._zIndex);
        } else if(index !== -1) {
            overlayStack.splice(index, 1);
        }
    },

    _toggleShading: function(visible) {
        this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option("shading") && !this.option("container"));
        this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option("shading"));

        this._$wrapper.css("background-color", this.option("shading") ? this.option("shadingColor") : "");

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
            $(document).on(eventName, this._proxiedTabTerminatorHandler);
        } else {
            $(document).off(eventName, this._proxiedTabTerminatorHandler);
        }
    },

    _tabKeyHandler: function(e) {
        if(e.keyCode !== TAB_KEY || !this._isTopOverlay()) {
            return;
        }

        var tabbableElements = this._$wrapper
                .find("*").filter(selectors.tabbable),

            $firstTabbable = tabbableElements.first(),
            $lastTabbable = tabbableElements.last(),

            isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0),
            isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0),
            isEmptyTabList = tabbableElements.length === 0,
            isOutsideTarget = inArray(e.target, tabbableElements) === -1;

        if(isTabOnLast || isShiftTabOnFirst ||
            isEmptyTabList || isOutsideTarget) {

            e.preventDefault();

            (e.shiftKey ? $lastTabbable : $firstTabbable).focusin().focus();
        }
    },

    _toggleSubscriptions: function(enabled) {
        this._toggleHideTopOverlayCallback(enabled);
        this._toggleParentsScrollSubscription(enabled);
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

        $().add(this._$prevTargetParents)
            .off(scrollEvent, this._proxiedTargetParentsScrollHandler);
        if(subscribe && closeOnScroll) {
            $parents.on(scrollEvent, this._proxiedTargetParentsScrollHandler);
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

        this._$content.appendTo(this.element());
        this._renderVisibilityAnimate(this.option("visible"));
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
        this.callBase();
    },

    _isParentHidden: function() {
        if(!this.option("_checkParentVisibility")) {
            return false;
        }

        if(this._parentHidden !== undefined) {
            return this._parentHidden;
        }

        var $parent = this.element().parent();

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

        return isHidden || !document.body.contains($parent.get(0));
    },

    _renderContentImpl: function() {
        var $element = this.element();
        this._$content.appendTo($element);

        var contentTemplate = this._getTemplate(this.option("contentTemplate"));
        contentTemplate && contentTemplate.render({
            container: this.content(),
            noModel: true
        });

        this._renderDrag();
        this._renderResize();
        this._renderScrollTerminator();
    },

    _renderDrag: function() {
        var $dragTarget = this._getDragTarget();

        if(!$dragTarget) {
            return;
        }

        var startEventName = eventUtils.addNamespace(dragEvents.start, this.NAME),
            updateEventName = eventUtils.addNamespace(dragEvents.move, this.NAME);

        $dragTarget
            .off(startEventName)
            .off(updateEventName);

        if(!this.option("dragEnabled")) {
            return;
        }

        $dragTarget
            .on(startEventName, this._dragStartHandler.bind(this))
            .on(updateEventName, this._dragUpdateHandler.bind(this));
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

        $scrollTerminator
            .off(terminatorEventName)
            .on(terminatorEventName, {
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
        return this.content();
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
            shaderOffset = this.option("shading") && !this.option("container") ? translator.locate(this._$wrapper) : { top: 0, left: 0 },
            boundaryOffset = this.option("boundaryOffset");

        return {
            top: isAllowedDrag ? position.top + shaderOffset.top + boundaryOffset.v : 0,
            bottom: isAllowedDrag ? -position.top - shaderOffset.top + deltaSize.height - boundaryOffset.v : 0,
            left: isAllowedDrag ? position.left + shaderOffset.left + boundaryOffset.h : 0,
            right: isAllowedDrag ? -position.left - shaderOffset.left + deltaSize.width - boundaryOffset.h : 0
        };
    },

    _fireContentReadyAction: function() {
        if(this.option("visible")) {
            this._moveToContainer();
        }

        this.callBase.apply(this, arguments);
    },

    _moveFromContainer: function() {
        this._$content.appendTo(this.element());

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
        var $element = this.element();

        if(this._$container && this._$container[0] !== $element.parent()[0]) {
            this._$wrapper.appendTo(this._$container);
        } else {
            this._$wrapper.appendTo($element);
        }
    },

    _renderGeometry: function() {
        if(this.option("visible")) {
            this._renderGeometryImpl();
        }
    },

    _renderGeometryImpl: function() {
        this._stopAnimation();

        this._normalizePosition();
        this._renderShading();
        this._renderDimensions();
        var resultPosition = this._renderPosition();

        this._actions.onPositioned({ position: resultPosition });
    },

    _renderShading: function() {
        var $wrapper = this._$wrapper,
            $container = this._getContainer();

        $wrapper.css("position", this._isWindow($container) && !iOS ? "fixed" : "absolute");

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
        this._$content.css({
            minWidth: this.option("minWidth"),
            maxWidth: this.option("maxWidth"),
            minHeight: this.option("minHeight"),
            maxHeight: this.option("maxHeight")
        });

        this._$content
            .outerWidth(this.option("width"))
            .outerHeight(this.option("height"));
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
            var resultPosition = positionUtils.setup(this._$content, this._position);

            forceRepaint(this._$content);

            // TODO: hotfix for T338096
            this._actions.onPositioning();

            return resultPosition;
        }
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

        if($target.is(this._$content)) {
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
        this._renderGeometry();
    },

    _clean: function() {
        if(!this._contentAlreadyRendered) {
            this.content().empty();
        }

        this._renderVisibility(false);

        this._cleanFocusState();
    },

    _dispose: function() {
        fx.stop(this._$content, false);
        clearTimeout(this._deferShowTimer);

        this._toggleViewPortSubscription(false);
        this._toggleSubscriptions(false);
        this._updateZIndexStackPosition(false);
        this._toggleTabTerminator(false);

        this._actions = null;

        this.callBase();

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
            case "position":
            case "boundaryOffset":
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
            case "deferRendering":
            case "contentTemplate":
                this._contentAlreadyRendered = false;
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
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxOverlaymethods_toggle
    * @publicName toggle(showing)
    * @param1 showing:boolean
    * @return Promise
    */
    toggle: function(showing) {
        showing = showing === undefined ? !this.option("visible") : showing;

        if(showing === this.option("visible")) {
            return $.Deferred().resolve().promise();
        }

        var animateDeferred = $.Deferred();
        this._animateDeferred = animateDeferred;
        this.option("visible", showing);

        return animateDeferred.promise().done((function() {
            delete this._animateDeferred;
        }).bind(this));
    },

    /**
    * @name dxOverlaymethods_show
    * @publicName show()
    * @return Promise
    */
    show: function() {
        return this.toggle(true);
    },

    /**
    * @name dxOverlaymethods_hide
    * @publicName hide()
    * @return Promise
    */
    hide: function() {
        return this.toggle(false);
    },

    /**
    * @name dxOverlaymethods_content
    * @publicName content()
    * @return jQuery
    */
    content: function() {
        return this._$content;
    },

    /**
    * @name dxOverlaymethods_repaint
    * @publicName repaint()
    */
    repaint: function() {
        this._renderGeometry();
    }
});

/**
* @name ui_dxOverlay
* @publicName dxOverlay
* @section utils
*/
/**
* @name ui_dxOverlayMethods_baseZIndex
* @publicName baseZIndex(zIndex)
* @param1 zIndex:number
*/
Overlay.baseZIndex = function(zIndex) {
    FIRST_Z_INDEX = zIndex;
};

registerComponent("dxOverlay", Overlay);

module.exports = Overlay;
