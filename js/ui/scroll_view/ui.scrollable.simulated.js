"use strict";

var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    math = Math,
    titleize = require("../../core/utils/inflector").titleize,
    extend = require("../../core/utils/extend").extend,
    windowUtils = require("../../core/utils/window"),
    iteratorUtils = require("../../core/utils/iterator"),
    translator = require("../../animation/translator"),
    Class = require("../../core/class"),
    Animator = require("./animator"),
    devices = require("../../core/devices"),
    eventUtils = require("../../events/utils"),
    commonUtils = require("../../core/utils/common"),
    Scrollbar = require("./ui.scrollbar"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

var realDevice = devices.real;
var isSluggishPlatform = (realDevice.platform === "win" || realDevice.platform === "android");

var SCROLLABLE_SIMULATED = "dxSimulatedScrollable",
    SCROLLABLE_STRATEGY = "dxScrollableStrategy",
    SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + "Cursor",
    SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + "Keyboard",
    SCROLLABLE_SIMULATED_CLASS = "dx-scrollable-simulated",
    SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden",
    SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = "dx-scrollable-scrollbars-alwaysvisible",
    SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",

    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",

    ACCELERATION = isSluggishPlatform ? 0.95 : 0.92,
    OUT_BOUNDS_ACCELERATION = 0.5,
    MIN_VELOCITY_LIMIT = 1,
    FRAME_DURATION = math.round(1000 / 60),
    SCROLL_LINE_HEIGHT = 20,

    BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5,
    BOUNCE_DURATION = isSluggishPlatform ? 300 : 400,
    BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION,
    BOUNCE_ACCELERATION_SUM = (1 - math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION);

var KEY_CODES = {
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

var InertiaAnimator = Animator.inherit({
    ctor: function(scroller) {
        this.callBase();
        this.scroller = scroller;
    },

    VELOCITY_LIMIT: MIN_VELOCITY_LIMIT,

    _isFinished: function() {
        return math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT;
    },

    _step: function() {
        this.scroller._scrollStep(this.scroller._velocity);
        this.scroller._velocity *= this._acceleration();
    },

    _acceleration: function() {
        return this.scroller._inBounds() ? ACCELERATION : OUT_BOUNDS_ACCELERATION;
    },

    _complete: function() {
        this.scroller._scrollComplete();
    },

    _stop: function() {
        this.scroller._stopComplete();
    }
});

var BounceAnimator = InertiaAnimator.inherit({
    VELOCITY_LIMIT: BOUNCE_MIN_VELOCITY_LIMIT,

    _isFinished: function() {
        return this.scroller._crossBoundOnNextStep() || this.callBase();
    },

    _acceleration: function() {
        return ACCELERATION;
    },

    _complete: function() {
        this.scroller._move(this.scroller._bounceLocation);
        this.callBase();
    }
});

var isWheelEvent = function(e) {
    return e.type === "dxmousewheel";
};

var Scroller = Class.inherit({

    ctor: function(options) {
        this._initOptions(options);
        this._initAnimators();
        this._initScrollbar();
    },

    _initOptions: function(options) {
        this._location = 0;
        this._topReached = false;
        this._bottomReached = false;
        this._axis = options.direction === HORIZONTAL ? "x" : "y";
        this._prop = options.direction === HORIZONTAL ? "left" : "top";
        this._dimension = options.direction === HORIZONTAL ? "width" : "height";
        this._scrollProp = options.direction === HORIZONTAL ? "scrollLeft" : "scrollTop";

        iteratorUtils.each(options, (function(optionName, optionValue) {
            this["_" + optionName] = optionValue;
        }).bind(this));
    },

    _initAnimators: function() {
        this._inertiaAnimator = new InertiaAnimator(this);
        this._bounceAnimator = new BounceAnimator(this);
    },

    _initScrollbar: function() {
        this._scrollbar = new Scrollbar($("<div>").appendTo(this._$container), {
            direction: this._direction,
            visible: this._scrollByThumb,
            visibilityMode: this._visibilityModeNormalize(this._scrollbarVisible),
            expandable: this._scrollByThumb
        });
        this._$scrollbar = this._scrollbar.$element();
    },

    _visibilityModeNormalize: function(mode) {
        return (mode === true) ? "onScroll" : (mode === false) ? "never" : mode;
    },

    _scrollStep: function(delta) {
        var prevLocation = this._location;

        this._location += delta;
        this._suppressBounce();
        this._move();

        if(Math.abs(prevLocation - this._location) < 1) {
            return;
        }

        eventsEngine.triggerHandler(this._$container, { type: "scroll" });
    },

    _suppressBounce: function() {
        if(this._bounceEnabled || this._inBounds(this._location)) {
            return;
        }

        this._velocity = 0;
        this._location = this._boundLocation();
    },

    _boundLocation: function(location) {
        location = location !== undefined ? location : this._location;
        return math.max(math.min(location, this._maxOffset), this._minOffset);
    },

    _move: function(location) {
        this._location = location !== undefined ? location * this._getScaleRatio() : this._location;
        this._moveContent();
        this._moveScrollbar();
    },

    _moveContent: function() {
        var location = this._location;

        this._$container[this._scrollProp](-location / this._getScaleRatio());
        this._moveContentByTranslator(location);
    },

    _getScaleRatio: function() {
        if(windowUtils.hasWindow() && !this._scaleRatio) {
            var element = this._$element.get(0),
                realDimension = this._getRealDimension(element, this._dimension),
                baseDimension = this._getBaseDimension(element, this._dimension);

            this._scaleRatio = realDimension / baseDimension;
        }

        return this._scaleRatio || 1;
    },

    _getRealDimension: function(element, dimension) {
        return math.round(element.getBoundingClientRect()[dimension]);
    },

    _getBaseDimension: function(element, dimension) {
        var dimensionName = "offset" + titleize(dimension);

        return element[dimensionName];
    },

    _moveContentByTranslator: function(location) {
        var translateOffset,
            minOffset = -this._maxScrollPropValue;

        if(location > 0) {
            translateOffset = location;
        } else if(location <= minOffset) {
            translateOffset = location - minOffset;
        } else {
            translateOffset = location % 1;
        }

        if(this._translateOffset === translateOffset) {
            return;
        }

        var targetLocation = {};
        targetLocation[this._prop] = translateOffset;
        this._translateOffset = translateOffset;

        if(translateOffset === 0) {
            translator.resetPosition(this._$content);
            return;
        }

        translator.move(this._$content, targetLocation);
    },

    _moveScrollbar: function() {
        this._scrollbar.moveTo(this._location);
    },

    _scrollComplete: function() {
        if(this._inBounds()) {
            this._hideScrollbar();
            if(this._completeDeferred) {
                this._completeDeferred.resolve();
            }
        }
        this._scrollToBounds();
    },

    _scrollToBounds: function() {
        if(this._inBounds()) {
            return;
        }
        this._bounceAction();
        this._setupBounce();
        this._bounceAnimator.start();
    },

    _setupBounce: function() {
        var boundLocation = this._bounceLocation = this._boundLocation(),
            bounceDistance = boundLocation - this._location;
        this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
    },

    _inBounds: function(location) {
        location = location !== undefined ? location : this._location;
        return this._boundLocation(location) === location;
    },

    _crossBoundOnNextStep: function() {
        var location = this._location,
            nextLocation = location + this._velocity;

        return (location < this._minOffset && nextLocation >= this._minOffset)
            || (location > this._maxOffset && nextLocation <= this._maxOffset);
    },

    _initHandler: function(e) {
        this._stopDeferred = new Deferred();
        this._stopScrolling();
        this._prepareThumbScrolling(e);
        return this._stopDeferred.promise();
    },

    _stopScrolling: commonUtils.deferRenderer(function() {
        this._hideScrollbar();
        this._inertiaAnimator.stop();
        this._bounceAnimator.stop();
    }),

    _prepareThumbScrolling: function(e) {
        if(isWheelEvent(e.originalEvent)) {
            return;
        }

        var $target = $(e.originalEvent.target);
        var scrollbarClicked = this._isScrollbar($target);
        if(scrollbarClicked) {
            this._moveToMouseLocation(e);
        }

        this._thumbScrolling = scrollbarClicked || this._isThumb($target);
        this._crossThumbScrolling = !this._thumbScrolling && this._isAnyThumbScrolling($target);

        if(this._thumbScrolling) {
            this._scrollbar.feedbackOn();
        }
    },

    _isThumbScrollingHandler: function($target) {
        return this._isThumb($target);
    },

    _moveToMouseLocation: function(e) {
        var mouseLocation = e["page" + this._axis.toUpperCase()] - this._$element.offset()[this._prop];
        var location = this._location + mouseLocation / this._containerToContentRatio() - this._$container.height() / 2;
        this._scrollStep(-Math.round(location));
    },

    _stopComplete: function() {
        if(this._stopDeferred) {
            this._stopDeferred.resolve();
        }
    },

    _startHandler: function() {
        this._showScrollbar();
    },

    _moveHandler: function(delta) {
        if(this._crossThumbScrolling) {
            return;
        }

        if(this._thumbScrolling) {
            delta[this._axis] = -Math.round(delta[this._axis] / this._containerToContentRatio());
        }

        this._scrollBy(delta);
    },

    _scrollBy: function(delta) {
        delta = delta[this._axis];
        if(!this._inBounds()) {
            delta *= OUT_BOUNDS_ACCELERATION;
        }
        this._scrollStep(delta);
    },

    _scrollByHandler: function(delta) {
        this._scrollBy(delta);
        this._scrollComplete();
    },

    _containerToContentRatio: function() {
        return this._scrollbar.containerToContentRatio();
    },

    _endHandler: function(velocity) {
        this._completeDeferred = new Deferred();
        this._velocity = velocity[this._axis];
        this._inertiaHandler();
        this._resetThumbScrolling();
        return this._completeDeferred.promise();
    },

    _inertiaHandler: function() {
        this._suppressInertia();
        this._inertiaAnimator.start();
    },

    _suppressInertia: function() {
        if(!this._inertiaEnabled || this._thumbScrolling) {
            this._velocity = 0;
        }
    },

    _resetThumbScrolling: function() {
        this._thumbScrolling = false;
        this._crossThumbScrolling = false;
    },

    _stopHandler: function() {
        if(this._thumbScrolling) {
            this._scrollComplete();
        }
        this._resetThumbScrolling();
        this._scrollToBounds();
    },

    _disposeHandler: function() {
        this._stopScrolling();
        this._$scrollbar.remove();
    },

    _updateHandler: function() {
        this._update();
        this._moveToBounds();
    },

    _update: function() {
        var that = this;

        that._stopScrolling();
        return commonUtils.deferUpdate(function() {
            that._resetScaleRatio();
            that._updateLocation();
            that._updateBounds();
            that._updateScrollbar();
            commonUtils.deferRender(function() {
                that._moveScrollbar();
                that._scrollbar.update();
            });
        });
    },

    _resetScaleRatio: function() {
        this._scaleRatio = null;
    },

    _updateLocation: function() {
        this._location = (translator.locate(this._$content)[this._prop] - this._$container[this._scrollProp]()) * this._getScaleRatio();
    },

    _updateBounds: function() {
        this._maxOffset = Math.round(this._getMaxOffset());
        this._minOffset = Math.round(this._getMinOffset());
    },

    _getMaxOffset: function() {
        return 0;
    },

    _getMinOffset: function() {
        this._maxScrollPropValue = math.max(this._contentSize() - this._containerSize(), 0);
        return -this._maxScrollPropValue;
    },

    _updateScrollbar: commonUtils.deferUpdater(function() {
        var that = this,
            containerSize = that._containerSize(),
            contentSize = that._contentSize();

        commonUtils.deferRender(function() {
            that._scrollbar.option({
                containerSize: containerSize,
                contentSize: contentSize,
                scaleRatio: that._getScaleRatio()
            });
        });
    }),

    _moveToBounds: commonUtils.deferRenderer(commonUtils.deferUpdater(commonUtils.deferRenderer(function() {
        var location = this._boundLocation();
        var locationChanged = location !== this._location;
        this._location = location;

        this._move();

        if(locationChanged) {
            this._scrollAction();
        }
    }))),

    _createActionsHandler: function(actions) {
        this._scrollAction = actions.scroll;
        this._bounceAction = actions.bounce;
    },

    _showScrollbar: function() {
        this._scrollbar.option("visible", true);
    },

    _hideScrollbar: function() {
        this._scrollbar.option("visible", false);
    },

    _containerSize: function() {
        return this._getRealDimension(this._$container.get(0), this._dimension);
    },

    _contentSize: function() {
        var isOverflowHidden = this._$content.css("overflow" + this._axis.toUpperCase()) === "hidden",
            contentSize = this._getRealDimension(this._$content.get(0), this._dimension);

        if(!isOverflowHidden) {
            var containerScrollSize = this._$content[0]["scroll" + titleize(this._dimension)] * this._getScaleRatio();

            contentSize = math.max(containerScrollSize, contentSize);
        }

        return contentSize;
    },

    _validateEvent: function(e) {
        var $target = $(e.originalEvent.target);

        return this._isThumb($target) || this._isScrollbar($target) || this._isContent($target);
    },

    _isThumb: function($element) {
        return this._scrollByThumb && this._scrollbar.isThumb($element);
    },

    _isScrollbar: function($element) {
        return this._scrollByThumb && $element && $element.is(this._$scrollbar);
    },

    _isContent: function($element) {
        return this._scrollByContent && !!$element.closest(this._$element).length;
    },

    _reachedMin: function() {
        return this._location <= this._minOffset;
    },

    _reachedMax: function() {
        return this._location >= this._maxOffset;
    },

    _cursorEnterHandler: function() {
        this._scrollbar.cursorEnter();
    },

    _cursorLeaveHandler: function() {
        this._scrollbar.cursorLeave();
    },

    dispose: commonUtils.noop
});


var hoveredScrollable,
    activeScrollable;

var SimulatedStrategy = Class.inherit({

    ctor: function(scrollable) {
        this._init(scrollable);
    },

    _init: function(scrollable) {
        this._component = scrollable;
        this._$element = scrollable.$element();
        this._$container = scrollable._$container;
        this._$wrapper = scrollable._$wrapper;
        this._$content = scrollable._$content;
        this.option = scrollable.option.bind(scrollable);
        this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
        this._isLocked = scrollable._isLocked.bind(scrollable);
        this._isDirection = scrollable._isDirection.bind(scrollable);
        this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
    },

    render: function() {
        this._$element.addClass(SCROLLABLE_SIMULATED_CLASS);
        this._createScrollers();
        if(this.option("useKeyboard")) {
            this._$container.prop("tabIndex", 0);
        }
        this._attachKeyboardHandler();
        this._attachCursorHandlers();
    },

    _createScrollers: function() {
        this._scrollers = {};

        if(this._isDirection(HORIZONTAL)) {
            this._createScroller(HORIZONTAL);
        }

        if(this._isDirection(VERTICAL)) {
            this._createScroller(VERTICAL);
        }

        this._$element.toggleClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE, this.option("showScrollbar") === "always");
        this._$element.toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this.option("showScrollbar"));
    },

    _createScroller: function(direction) {
        this._scrollers[direction] = new Scroller(this._scrollerOptions(direction));
    },

    _scrollerOptions: function(direction) {
        return {
            direction: direction,
            $content: this._$content,
            $container: this._$container,
            $wrapper: this._$wrapper,
            $element: this._$element,
            scrollByContent: this.option("scrollByContent"),
            scrollByThumb: this.option("scrollByThumb"),
            scrollbarVisible: this.option("showScrollbar"),
            bounceEnabled: this.option("bounceEnabled"),
            inertiaEnabled: this.option("inertiaEnabled"),
            isAnyThumbScrolling: this._isAnyThumbScrolling.bind(this)
        };
    },

    _isAnyThumbScrolling: function($target) {
        var result = false;
        this._eventHandler("isThumbScrolling", $target).done(function(isThumbScrollingVertical, isThumbScrollingHorizontal) {
            result = isThumbScrollingVertical || isThumbScrollingHorizontal;
        });
        return result;
    },

    handleInit: function(e) {
        this._suppressDirections(e);
        this._eventForUserAction = e;
        this._eventHandler("init", e).done(this._stopAction);
    },

    _suppressDirections: function(e) {
        if(isWheelEvent(e.originalEvent)) {
            this._prepareDirections(true);
            return;
        }

        this._prepareDirections();
        this._eachScroller(function(scroller, direction) {
            var isValid = scroller._validateEvent(e);
            this._validDirections[direction] = isValid;
        });
    },

    _prepareDirections: function(value) {
        value = value || false;
        this._validDirections = {};
        this._validDirections[HORIZONTAL] = value;
        this._validDirections[VERTICAL] = value;
    },

    _eachScroller: function(callback) {
        callback = callback.bind(this);
        iteratorUtils.each(this._scrollers, function(direction, scroller) {
            callback(scroller, direction);
        });
    },

    handleStart: function(e) {
        this._eventForUserAction = e;
        this._eventHandler("start").done(this._startAction);
    },

    _saveActive: function() {
        activeScrollable = this;
    },

    _resetActive: function() {
        if(activeScrollable === this) {
            activeScrollable = null;
        }
    },

    handleMove: function(e) {
        if(this._isLocked()) {
            e.cancel = true;
            this._resetActive();
            return;
        }
        this._saveActive();
        e.preventDefault && e.preventDefault();
        this._adjustDistance(e.delta);
        this._eventForUserAction = e;
        this._eventHandler("move", e.delta);
    },

    _adjustDistance: function(distance) {
        distance.x *= this._validDirections[HORIZONTAL];
        distance.y *= this._validDirections[VERTICAL];
    },

    handleEnd: function(e) {
        this._resetActive();
        this._refreshCursorState(e.originalEvent && e.originalEvent.target);
        this._adjustDistance(e.velocity);
        this._eventForUserAction = e;
        return this._eventHandler("end", e.velocity).done(this._endAction);
    },

    handleCancel: function(e) {
        this._resetActive();
        this._eventForUserAction = e;
        return this._eventHandler("end", { x: 0, y: 0 });
    },

    handleStop: function() {
        this._resetActive();
        this._eventHandler("stop");
    },

    handleScroll: function() {
        this._scrollAction();
    },

    _attachKeyboardHandler: function() {
        eventsEngine.off(this._$element, "." + SCROLLABLE_SIMULATED_KEYBOARD);

        if(!this.option("disabled") && this.option("useKeyboard")) {
            eventsEngine.on(this._$element, eventUtils.addNamespace("keydown", SCROLLABLE_SIMULATED_KEYBOARD), this._keyDownHandler.bind(this));
        }
    },

    _keyDownHandler: function(e) {
        if(!this._$container.is(domAdapter.getActiveElement())) {
            return;
        }

        var handled = true;

        switch(e.keyCode) {
            case KEY_CODES.DOWN:
                this._scrollByLine({ y: 1 });
                break;
            case KEY_CODES.UP:
                this._scrollByLine({ y: -1 });
                break;
            case KEY_CODES.RIGHT:
                this._scrollByLine({ x: 1 });
                break;
            case KEY_CODES.LEFT:
                this._scrollByLine({ x: -1 });
                break;
            case KEY_CODES.PAGE_DOWN:
                this._scrollByPage(1);
                break;
            case KEY_CODES.PAGE_UP:
                this._scrollByPage(-1);
                break;
            case KEY_CODES.HOME:
                this._scrollToHome();
                break;
            case KEY_CODES.END:
                this._scrollToEnd();
                break;
            default:
                handled = false;
                break;
        }

        if(handled) {
            e.stopPropagation();
            e.preventDefault();
        }
    },

    _scrollByLine: function(lines) {
        this.scrollBy({
            top: (lines.y || 0) * -SCROLL_LINE_HEIGHT,
            left: (lines.x || 0) * -SCROLL_LINE_HEIGHT
        });
    },

    _scrollByPage: function(page) {
        var prop = this._wheelProp(),
            dimension = this._dimensionByProp(prop);

        var distance = {};
        distance[prop] = page * -this._$container[dimension]();
        this.scrollBy(distance);
    },

    _dimensionByProp: function(prop) {
        return (prop === "left") ? "width" : "height";
    },

    _scrollToHome: function() {
        var prop = this._wheelProp();
        var distance = {};
        distance[prop] = 0;
        this._component.scrollTo(distance);
    },

    _scrollToEnd: function() {
        var prop = this._wheelProp(),
            dimension = this._dimensionByProp(prop);

        var distance = {};
        distance[prop] = this._$content[dimension]() - this._$container[dimension]();
        this._component.scrollTo(distance);
    },

    createActions: function() {
        this._startAction = this._createActionHandler("onStart");
        this._stopAction = this._createActionHandler("onStop");
        this._endAction = this._createActionHandler("onEnd");
        this._updateAction = this._createActionHandler("onUpdated");

        this._createScrollerActions();
    },

    _createScrollerActions: function() {
        this._scrollAction = this._createActionHandler("onScroll");
        this._bounceAction = this._createActionHandler("onBounce");
        this._eventHandler("createActions", {
            scroll: this._scrollAction,
            bounce: this._bounceAction
        });
    },

    _createActionHandler: function(optionName) {
        var that = this,
            actionHandler = that._createActionByOption(optionName);
        return function() {
            actionHandler(extend(that._createActionArgs(), arguments));
        };
    },

    _createActionArgs: function() {
        var scrollerX = this._scrollers[HORIZONTAL],
            scrollerY = this._scrollers[VERTICAL];

        var location = this.location();
        this._scrollOffset = {
            top: scrollerY && -location.top,
            left: scrollerX && -location.left
        };

        return {
            event: this._eventForUserAction,
            scrollOffset: this._scrollOffset,
            reachedLeft: scrollerX && scrollerX._reachedMax(),
            reachedRight: scrollerX && scrollerX._reachedMin(),
            reachedTop: scrollerY && scrollerY._reachedMax(),
            reachedBottom: scrollerY && scrollerY._reachedMin()
        };
    },

    _eventHandler: function(eventName) {
        var args = [].slice.call(arguments).slice(1),
            deferreds = iteratorUtils.map(this._scrollers, function(scroller) {
                return scroller["_" + eventName + "Handler"].apply(scroller, args);
            });
        return when.apply($, deferreds).promise();
    },

    location: function() {
        var location = translator.locate(this._$content);
        location.top -= this._$container.scrollTop();
        location.left -= this._$container.scrollLeft();
        return location;
    },

    disabledChanged: function() {
        this._attachCursorHandlers();
    },

    _attachCursorHandlers: function() {
        eventsEngine.off(this._$element, "." + SCROLLABLE_SIMULATED_CURSOR);

        if(!this.option("disabled") && this._isHoverMode()) {
            eventsEngine.on(this._$element, eventUtils.addNamespace("mouseenter", SCROLLABLE_SIMULATED_CURSOR), this._cursorEnterHandler.bind(this));
            eventsEngine.on(this._$element, eventUtils.addNamespace("mouseleave", SCROLLABLE_SIMULATED_CURSOR), this._cursorLeaveHandler.bind(this));
        }
    },

    _isHoverMode: function() {
        return this.option("showScrollbar") === "onHover";
    },

    _cursorEnterHandler: function(e) {
        e = e || {};
        e.originalEvent = e.originalEvent || {};

        if(activeScrollable || e.originalEvent._hoverHandled) {
            return;
        }

        if(hoveredScrollable) {
            hoveredScrollable._cursorLeaveHandler();
        }

        hoveredScrollable = this;
        this._eventHandler("cursorEnter");
        e.originalEvent._hoverHandled = true;
    },

    _cursorLeaveHandler: function(e) {
        if(hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
            return;
        }

        this._eventHandler("cursorLeave");
        hoveredScrollable = null;
        this._refreshCursorState(e && e.relatedTarget);
    },

    _refreshCursorState: function(target) {
        if(!this._isHoverMode() && (!target || activeScrollable)) {
            return;
        }
        var $target = $(target);
        var $scrollable = $target.closest("." + SCROLLABLE_SIMULATED_CLASS + ":not(.dx-state-disabled)");
        var targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);

        if(hoveredScrollable && hoveredScrollable !== targetScrollable) {
            hoveredScrollable._cursorLeaveHandler();
        }

        if(targetScrollable) {
            targetScrollable._cursorEnterHandler();
        }
    },

    update: function() {
        var that = this;
        var result = this._eventHandler("update").done(this._updateAction);

        return when(result, commonUtils.deferUpdate(function() {
            var allowedDirections = that._allowedDirections();
            commonUtils.deferRender(function() {
                var touchDirection = allowedDirections.vertical ? "pan-x" : "";
                touchDirection = allowedDirections.horizontal ? "pan-y" : touchDirection;
                touchDirection = allowedDirections.vertical && allowedDirections.horizontal ? "none" : touchDirection;
                that._$container.css("touchAction", touchDirection);
            });
            return when().promise();
        }));
    },

    _allowedDirections: function() {
        var bounceEnabled = this.option("bounceEnabled"),
            verticalScroller = this._scrollers[VERTICAL],
            horizontalScroller = this._scrollers[HORIZONTAL];

        return {
            vertical: verticalScroller && (verticalScroller._minOffset < 0 || bounceEnabled),
            horizontal: horizontalScroller && (horizontalScroller._minOffset < 0 || bounceEnabled)
        };
    },

    updateBounds: function() {
        this._scrollers[HORIZONTAL] && this._scrollers[HORIZONTAL]._updateBounds();
    },

    scrollBy: function(distance) {
        var verticalScroller = this._scrollers[VERTICAL],
            horizontalScroller = this._scrollers[HORIZONTAL];

        if(verticalScroller) {
            distance.top = verticalScroller._boundLocation(distance.top + verticalScroller._location) - verticalScroller._location;
        }
        if(horizontalScroller) {
            distance.left = horizontalScroller._boundLocation(distance.left + horizontalScroller._location) - horizontalScroller._location;
        }

        this._prepareDirections(true);
        this._startAction();
        this._eventHandler("scrollBy", { x: distance.left, y: distance.top });
        this._endAction();
    },

    validate: function(e) {
        if(this.option("disabled")) {
            return false;
        }

        if(this.option("bounceEnabled")) {
            return true;
        }

        return isWheelEvent(e) ? this._validateWheel(e) : this._validateMove(e);
    },

    _validateWheel: function(e) {
        var scroller = this._scrollers[this._wheelDirection(e)];
        var reachedMin = scroller._reachedMin();
        var reachedMax = scroller._reachedMax();

        var contentGreaterThanContainer = !reachedMin || !reachedMax;
        var locatedNotAtBound = !reachedMin && !reachedMax;
        var scrollFromMin = (reachedMin && e.delta > 0);
        var scrollFromMax = (reachedMax && e.delta < 0);
        return contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
    },

    _validateMove: function(e) {
        if(!this.option("scrollByContent") && !$(e.target).closest("." + SCROLLABLE_SCROLLBAR_CLASS).length) {
            return false;
        }

        return this._allowedDirection();
    },

    getDirection: function(e) {
        return isWheelEvent(e) ? this._wheelDirection(e) : this._allowedDirection();
    },

    _wheelProp: function() {
        return (this._wheelDirection() === HORIZONTAL) ? "left" : "top";
    },

    _wheelDirection: function(e) {
        switch(this.option("direction")) {
            case HORIZONTAL:
                return HORIZONTAL;
            case VERTICAL:
                return VERTICAL;
            default:
                return e && e.shiftKey ? HORIZONTAL : VERTICAL;
        }
    },

    verticalOffset: function() {
        return 0;
    },

    dispose: function() {
        this._resetActive();

        if(hoveredScrollable === this) {
            hoveredScrollable = null;
        }

        this._eventHandler("dispose");
        this._detachEventHandlers();
        this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);
        this._eventForUserAction = null;
        clearTimeout(this._gestureEndTimer);
    },

    _detachEventHandlers: function() {
        eventsEngine.off(this._$element, "." + SCROLLABLE_SIMULATED_CURSOR);
        eventsEngine.off(this._$container, "." + SCROLLABLE_SIMULATED_KEYBOARD);
    }

});

exports.SimulatedStrategy = SimulatedStrategy;
exports.Scroller = Scroller;

///#DEBUG
exports.ACCELERATION = ACCELERATION;
exports.MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT;
exports.FRAME_DURATION = FRAME_DURATION;
exports.SCROLL_LINE_HEIGHT = SCROLL_LINE_HEIGHT;
///#ENDDEBUG
