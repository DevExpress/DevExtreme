import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { locate } from '../../animation/translator';
import Class from '../../core/class';
import Animator from './animator';
import devices from '../../core/devices';
import { normalizeKeyName } from '../../events/utils/index';
import { deferUpdate, deferUpdater, deferRender, deferRenderer, noop } from '../../core/utils/common';
import { when, Deferred } from '../../core/utils/deferred';

const realDevice = devices.real;
const isSluggishPlatform = realDevice.platform === 'android';

const SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + 'Cursor';
const SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + 'Keyboard';
const SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const OUT_BOUNDS_ACCELERATION = 0.5;
const MIN_VELOCITY_LIMIT = 1;
const FRAME_DURATION = Math.round(1000 / 60);
const VALIDATE_WHEEL_TIMEOUT = 500;

const BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
const BOUNCE_DURATION = isSluggishPlatform ? 300 : 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
const BOUNCE_ACCELERATION_SUM = (1 - Math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION);

const InertiaAnimator = Animator.inherit({
    ctor: function(scroller) {
        this.callBase();
        this.scroller = scroller;
    },

    VELOCITY_LIMIT: MIN_VELOCITY_LIMIT,

    _isFinished: function() {
        return Math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT;
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

const BounceAnimator = InertiaAnimator.inherit({
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

export const Scroller = Class.inherit({

    ctor: function(options) {
        this._initOptions(options);
        this._initAnimators();
    },

    _initOptions: function(options) {
        this._topReached = false;
        this._bottomReached = false;
    },

    _initAnimators: function() {
        this._inertiaAnimator = new InertiaAnimator(this);
        this._bounceAnimator = new BounceAnimator(this);
    },

    _scrollStep: function(delta) {
        // eslint-disable-next-line no-undef
        if(Math.abs(prevLocation - this._location) < 1) {
            return;
        }

        eventsEngine.triggerHandler(this._$container, { type: 'scroll' });
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
        const boundLocation = this._bounceLocation = this._boundLocation();
        const bounceDistance = boundLocation - this._location;

        this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
    },

    _crossBoundOnNextStep: function() {
        const location = this._location;
        const nextLocation = location + this._velocity;

        return (location < this._minOffset && nextLocation >= this._minOffset)
            || (location > this._maxOffset && nextLocation <= this._maxOffset);
    },

    _stopScrolling: deferRenderer(function() {
        this._hideScrollbar();
        this._inertiaAnimator.stop();
        this._bounceAnimator.stop();
    }),

    _stopComplete: function() {
        if(this._stopDeferred) {
            this._stopDeferred.resolve();
        }
    },

    _startHandler: function() {
        this._showScrollbar();
    },

    _scrollByHandler: function(delta) {
        this._scrollBy(delta);
        this._scrollComplete();
    },

    _endHandler: function(velocity) {
        this._completeDeferred = new Deferred();
        return this._completeDeferred.promise();
    },

    _inertiaHandler: function() {
        this._inertiaAnimator.start();
    },

    _stopHandler: function() {
        if(this._thumbScrolling) {
            this._scrollComplete();
        }
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
        this._stopScrolling();
        return deferUpdate(() => {
            this._resetScaleRatio();
            this._updateLocation();
            this._updateBounds();
            this._updateScrollbar();
            deferRender(() => {
                this._moveScrollbar();
                this._scrollbar.update();
            });
        });
    },

    _resetScaleRatio: function() {
        this._scaleRatio = null;
    },

    _updateLocation: function() {
        this._location = (locate(this._$content)[this._prop] - this._$container[this._scrollProp]()) * this._getScaleRatio();
    },

    _updateBounds: function() {
        this._maxOffset = Math.round(this._getMaxOffset());
        this._minOffset = Math.round(this._getMinOffset());
    },

    _updateScrollbar: deferUpdater(function() {
        const containerSize = this._containerSize();
        const contentSize = this._contentSize();

        // NOTE: Real container and content sizes can be a fractional number when scaling.
        //       Let's save sizes when scale = 100% to decide whether it is necessary to show
        //       the scrollbar based on by more precise numbers. We can do it because the container
        //       size to content size ratio should remain approximately the same at any zoom.
        const baseContainerSize = this._getBaseDimension(this._$container.get(0), this._dimension);
        const baseContentSize = this._getBaseDimension(this._$content.get(0), this._dimension);

        deferRender(() => {
            this._scrollbar.option({
                containerSize,
                contentSize,
                baseContainerSize,
                baseContentSize,
                scaleRatio: this._getScaleRatio()
            });
        });
    }),

    _moveToBounds: deferRenderer(deferUpdater(deferRenderer(function() {
        const location = this._boundLocation();
        const locationChanged = location !== this._location;

        this._location = location;
        this._move();

        if(locationChanged) {
            this._scrollAction();
        }
    }))),

    _showScrollbar: function() {
        this._scrollbar.option('visible', true);
    },

    _hideScrollbar: function() {
        this._scrollbar.option('visible', false);
    },

    _reachedMin: function() {
        return this._location <= this._minOffset;
    },

    _reachedMax: function() {
        return this._location >= this._maxOffset;
    },

    _cursorEnterHandler: function() {
        this._resetScaleRatio();
        this._updateScrollbar();

        this._scrollbar.cursorEnter();
    },

    _cursorLeaveHandler: function() {
        this._scrollbar.cursorLeave();
    },

    dispose: noop
});


let hoveredScrollable;
let activeScrollable;

export const SimulatedStrategy = Class.inherit({

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
        this._getScrollOffset = scrollable._getScrollOffset.bind(scrollable);
    },

    _applyScaleRatio: function(targetLocation) {
        for(const direction in this._scrollers) {
            const prop = this._getPropByDirection(direction);

            if(isDefined(targetLocation[prop])) {
                const scroller = this._scrollers[direction];

                targetLocation[prop] *= scroller._getScaleRatio();
            }
        }
        return targetLocation;
    },

    _eachScroller: function(callback) {
        callback = callback.bind(this);
        each(this._scrollers, function(direction, scroller) {
            callback(scroller, direction);
        });
    },

    handleStart: function(e) {
        this._eventHandler('start').done(this._startAction);
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
    },

    handleEnd: function(e) {
        this._resetActive();
        this._refreshCursorState(e.originalEvent && e.originalEvent.target);
    },

    handleCancel: function(e) {
        this._resetActive();
        return this._eventHandler('end', { x: 0, y: 0 });
    },

    handleStop: function() {
        this._resetActive();
    },

    handleScroll: function() {
        this._component._updateRtlConfig();
        this._scrollAction();
    },

    _keyDownHandler: function(e) {
        clearTimeout(this._updateHandlerTimeout);
        this._updateHandlerTimeout = setTimeout(() => {
            if(normalizeKeyName(e) === 'tab') {
                this._eachScroller((scroller) => {
                    scroller._updateHandler();
                });
            }
        });

        if(!this._$container.is(domAdapter.getActiveElement())) {
            return;
        }
    },

    location: function() {
        const location = locate(this._$content);

        location.top -= this._$container.scrollTop();
        location.left -= this._$container.scrollLeft();
        return location;
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
        this._eventHandler('cursorEnter');
        e.originalEvent._hoverHandled = true;
    },

    _cursorLeaveHandler: function(e) {
        if(hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
            return;
        }

        this._eventHandler('cursorLeave');
        hoveredScrollable = null;
        this._refreshCursorState(e && e.relatedTarget);
    },

    _refreshCursorState: function(target) {
        if(!this._isHoverMode() && (!target || activeScrollable)) {
            return;
        }

        const $target = $(target);
        const $scrollable = $target.closest(`.${SCROLLABLE_SIMULATED_CLASS}:not(.dx-state-disabled)`);
        const targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);

        if(hoveredScrollable && hoveredScrollable !== targetScrollable) {
            hoveredScrollable._cursorLeaveHandler();
        }

        if(targetScrollable) {
            targetScrollable._cursorEnterHandler();
        }
    },

    update: function() {
        const result = this._eventHandler('update').done(this._updateAction);

        return when(result, deferUpdate(() => {
            const allowedDirections = this._allowedDirections();
            deferRender(() => {
                let touchDirection = allowedDirections.vertical ? 'pan-x' : '';
                touchDirection = allowedDirections.horizontal ? 'pan-y' : touchDirection;
                touchDirection = allowedDirections.vertical && allowedDirections.horizontal ? 'none' : touchDirection;
                this._$container.css('touchAction', touchDirection);
            });
            return when().promise();
        }));
    },

    updateBounds: function() {
        this._scrollers[HORIZONTAL] && this._scrollers[HORIZONTAL]._updateBounds();
    },

    scrollBy: function(distance) {
        const verticalScroller = this._scrollers[VERTICAL];
        const horizontalScroller = this._scrollers[HORIZONTAL];

        if(verticalScroller) {
            distance.top = verticalScroller._boundLocation(distance.top + verticalScroller._location) - verticalScroller._location;
        }
        if(horizontalScroller) {
            distance.left = horizontalScroller._boundLocation(distance.left + horizontalScroller._location) - horizontalScroller._location;
        }

        this._prepareDirections(true);
        this._startAction();
        this._eventHandler('scrollBy', { x: distance.left, y: distance.top });
        this._endAction();
    },

    _validateWheel: function(e) {
        const scroller = this._scrollers[this._wheelDirection(e)];
        const reachedMin = scroller._reachedMin();
        const reachedMax = scroller._reachedMax();

        const contentGreaterThanContainer = !reachedMin || !reachedMax;
        const locatedNotAtBound = !reachedMin && !reachedMax;
        const scrollFromMin = (reachedMin && e.delta > 0);
        const scrollFromMax = (reachedMax && e.delta < 0);

        let validated = contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
        validated = validated || this._validateWheelTimer !== undefined;

        if(validated) {
            clearTimeout(this._validateWheelTimer);
            this._validateWheelTimer = setTimeout(() => {
                this._validateWheelTimer = undefined;
            }, VALIDATE_WHEEL_TIMEOUT);
        }

        return validated;
    },

    verticalOffset: function() {
        return 0;
    },

    dispose: function() {
        this._resetActive();

        if(hoveredScrollable === this) {
            hoveredScrollable = null;
        }

        this._eventHandler('dispose');
        this._detachEventHandlers();
        this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);
        this._eventForUserAction = null;
        clearTimeout(this._validateWheelTimer);
        clearTimeout(this._updateHandlerTimeout);
    },

    _detachEventHandlers: function() {
        eventsEngine.off(this._$element, `.${SCROLLABLE_SIMULATED_CURSOR}`);
        eventsEngine.off(this._$container, `.${SCROLLABLE_SIMULATED_KEYBOARD}`);
    }

});

export {
    ACCELERATION,
    MIN_VELOCITY_LIMIT,
    FRAME_DURATION
};
