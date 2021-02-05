import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { each } from '../../core/utils/iterator';
import { locate } from '../../animation/translator';
import Class from '../../core/class';
import devices from '../../core/devices';
import { normalizeKeyName } from '../../events/utils/index';
import { deferUpdate, deferUpdater, deferRender, deferRenderer, noop } from '../../core/utils/common';
import { when } from '../../core/utils/deferred';

const realDevice = devices.real;
const isSluggishPlatform = realDevice.platform === 'android';

const SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + 'Cursor';
const SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + 'Keyboard';
const SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';

const HORIZONTAL = 'horizontal';

const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const MIN_VELOCITY_LIMIT = 1;
const FRAME_DURATION = Math.round(1000 / 60);

export const Scroller = Class.inherit({
    _scrollStep: function(delta) {
        eventsEngine.triggerHandler(this._$container, { type: 'scroll' });
    },

    _scrollToBounds: function() {
        this._bounceAction();
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

    _eachScroller: function(callback) {
        callback = callback.bind(this);
        each(this._scrollers, function(direction, scroller) {
            callback(scroller, direction);
        });
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
