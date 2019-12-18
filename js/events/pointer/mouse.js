var extend = require('../../core/utils/extend').extend,
    BaseStrategy = require('./base'),
    Observer = require('./observer');

var eventMap = {
    'dxpointerdown': 'mousedown',
    'dxpointermove': 'mousemove',
    'dxpointerup': 'mouseup',
    'dxpointercancel': '',
    'dxpointerover': 'mouseover',
    'dxpointerout': 'mouseout',
    'dxpointerenter': 'mouseenter',
    'dxpointerleave': 'mouseleave'
};

var normalizeMouseEvent = function(e) {
    e.pointerId = 1;

    return {
        pointers: observer.pointers(),
        pointerId: 1
    };
};


var observer;
var activated = false;
var activateStrategy = function() {
    if(activated) {
        return;
    }

    observer = new Observer(eventMap, function() {
        return true;
    });

    activated = true;
};

var MouseStrategy = BaseStrategy.inherit({

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
