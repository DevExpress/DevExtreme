import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Class from '../../core/class';

const SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + 'Cursor';
const SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + 'Keyboard';
const SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';


let hoveredScrollable;
let activeScrollable;

export const SimulatedStrategy = Class.inherit({

    _saveActive: function() {
        activeScrollable = this;
    },

    _resetActive: function() {
        if(activeScrollable === this) {
            activeScrollable = null;
        }
    },

    handleMove: function(event) {
        if(this._isLocked()) {
            this._resetActive();
            return;
        }
        this._saveActive();
    },

    handleEnd: function(event) {
        this._resetActive();
        this._refreshCursorState(event.originalEvent && event.originalEvent.target);
    },

    handleCancel: function(event) {
        this._resetActive();
    },

    handleStop: function() {
        this._resetActive();
    },

    _cursorEnterHandler: function(event) {
        event = event || {};
        event.originalEvent = event.originalEvent || {};

        if(activeScrollable || event.originalEvent._hoverHandled) {
            return;
        }

        if(hoveredScrollable) {
            hoveredScrollable._cursorLeaveHandler();
        }

        hoveredScrollable = this;
        this._eventHandler('cursorEnter');
        event.originalEvent._hoverHandled = true;
    },

    _cursorLeaveHandler: function(event) {
        if(hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
            return;
        }

        this._eventHandler('cursorLeave');
        hoveredScrollable = null;
        this._refreshCursorState(event && event.relatedTarget);
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
