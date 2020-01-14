const extend = require('../../core/utils/extend').extend;
const BaseStrategy = require('./base');
const Observer = require('./observer');

const eventMap = {
    'dxpointerdown': 'mousedown',
    'dxpointermove': 'mousemove',
    'dxpointerup': 'mouseup',
    'dxpointercancel': '',
    'dxpointerover': 'mouseover',
    'dxpointerout': 'mouseout',
    'dxpointerenter': 'mouseenter',
    'dxpointerleave': 'mouseleave'
};

const normalizeMouseEvent = function(e) {
    e.pointerId = 1;

    return {
        pointers: observer.pointers(),
        pointerId: 1
    };
};


let observer;
let activated = false;
const activateStrategy = function() {
    if(activated) {
        return;
    }

    observer = new Observer(eventMap, function() {
        return true;
    });

    activated = true;
};

const MouseStrategy = BaseStrategy.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);

        activateStrategy();
    },

    _fireEvent: function(args) {
        return this.callBase(extend(normalizeMouseEvent(args.originalEvent), args));
    }

});
MouseStrategy.map = eventMap;
MouseStrategy.normalize = normalizeMouseEvent;
MouseStrategy.activate = activateStrategy;
MouseStrategy.resetObserver = function() {
    observer.reset();
};


module.exports = MouseStrategy;
