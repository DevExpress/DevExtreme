const extend = require('../../core/utils/extend').extend;
const BaseStrategy = require('./base');
const MouseStrategy = require('./mouse');
const TouchStrategy = require('./touch');
const eventUtils = require('../utils');

const eventMap = {
    'dxpointerdown': 'touchstart mousedown',
    'dxpointermove': 'touchmove mousemove',
    'dxpointerup': 'touchend mouseup',
    'dxpointercancel': 'touchcancel',
    'dxpointerover': 'mouseover',
    'dxpointerout': 'mouseout',
    'dxpointerenter': 'mouseenter',
    'dxpointerleave': 'mouseleave'
};


let activated = false;
const activateStrategy = function() {
    if(activated) {
        return;
    }

    MouseStrategy.activate();

    activated = true;
};

const MouseAndTouchStrategy = BaseStrategy.inherit({

    EVENT_LOCK_TIMEOUT: 100,

    ctor: function() {
        this.callBase.apply(this, arguments);

        activateStrategy();
    },

    _handler: function(e) {
        const isMouseEvent = eventUtils.isMouseEvent(e);

        if(!isMouseEvent) {
            this._skipNextEvents = true;
        }

        if(isMouseEvent && this._mouseLocked) {
            return;
        }

        if(isMouseEvent && this._skipNextEvents) {
            this._skipNextEvents = false;
            this._mouseLocked = true;

            clearTimeout(this._unlockMouseTimer);

            const that = this;
            this._unlockMouseTimer = setTimeout(function() {
                that._mouseLocked = false;
            }, this.EVENT_LOCK_TIMEOUT);

            return;
        }

        return this.callBase(e);
    },

    _fireEvent: function(args) {
        const isMouseEvent = eventUtils.isMouseEvent(args.originalEvent);
        const normalizer = isMouseEvent ? MouseStrategy.normalize : TouchStrategy.normalize;

        return this.callBase(extend(normalizer(args.originalEvent), args));
    },

    dispose: function() {
        this.callBase();
        this._skipNextEvents = false;
        this._mouseLocked = false;
        clearTimeout(this._unlockMouseTimer);
    }
});
MouseAndTouchStrategy.map = eventMap;
MouseAndTouchStrategy.resetObserver = MouseStrategy.resetObserver;


module.exports = MouseAndTouchStrategy;
