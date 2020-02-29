const BaseStrategy = require('./base');
const Observer = require('./observer');
const extend = require('../../core/utils/extend').extend;

const eventMap = {
    'dxpointerdown': 'pointerdown',
    'dxpointermove': 'pointermove',
    'dxpointerup': 'pointerup',
    'dxpointercancel': 'pointercancel',
    'dxpointerover': 'pointerover',
    'dxpointerout': 'pointerout',
    'dxpointerenter': 'pointerenter',
    'dxpointerleave': 'pointerleave'
};

let observer;
let activated = false;
const activateStrategy = function() {
    if(activated) {
        return;
    }

    observer = new Observer(
        eventMap,
        function(a, b) { return a.pointerId === b.pointerId; },
        function(e) { if(e.isPrimary) observer.reset(); }
    );

    activated = true;
};

const MsPointerStrategy = BaseStrategy.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);

        activateStrategy();
    },

    _fireEvent: function(args) {
        return this.callBase(extend({
            pointers: observer.pointers(),
            pointerId: args.originalEvent.pointerId
        }, args));
    }

});
MsPointerStrategy.map = eventMap;
MsPointerStrategy.resetObserver = function() {
    observer.reset();
};


module.exports = MsPointerStrategy;
