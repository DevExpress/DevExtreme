const devices = require('../../core/devices');
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const BaseStrategy = require('./base');

const eventMap = {
    'dxpointerdown': 'touchstart',
    'dxpointermove': 'touchmove',
    'dxpointerup': 'touchend',
    'dxpointercancel': 'touchcancel',
    'dxpointerover': '',
    'dxpointerout': '',
    'dxpointerenter': '',
    'dxpointerleave': ''
};


const normalizeTouchEvent = function(e) {
    const pointers = [];

    each(e.touches, function(_, touch) {
        pointers.push(extend({
            pointerId: touch.identifier
        }, touch));
    });

    return {
        pointers: pointers,
        pointerId: e.changedTouches[0].identifier
    };
};

const skipTouchWithSameIdentifier = function(pointerEvent) {
    return devices.real().platform === 'ios' && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};

const TouchStrategy = BaseStrategy.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);
        this._pointerId = 0;
    },

    _handler: function(e) {
        if(skipTouchWithSameIdentifier(this._eventName)) {
            const touch = e.changedTouches[0];

            if(this._pointerId === touch.identifier && this._pointerId !== 0) {
                return;
            }

            this._pointerId = touch.identifier;
        }

        return this.callBase.apply(this, arguments);
    },

    _fireEvent: function(args) {
        return this.callBase(extend(normalizeTouchEvent(args.originalEvent), args));
    }

});
TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;


module.exports = TouchStrategy;
