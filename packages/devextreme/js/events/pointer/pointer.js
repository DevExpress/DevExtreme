import { extend } from '../../core/utils/extend';
import BaseStrategy from './base';
import Observer from './observer';

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

const normalizeEvent = function(e) {
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

const PointerStrategy = BaseStrategy.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);

        activateStrategy();
    },

    _fireEvent: function(args) {
        const normalizer = normalizeEvent;

        return this.callBase(extend(normalizer(args.originalEvent), args));
    },

    dispose: function() {
        this.callBase();
        this._skipNextEvents = false;
        this._mouseLocked = false;
        clearTimeout(this._unlockMouseTimer);
    }
});

PointerStrategy.map = eventMap;
PointerStrategy.resetObserver = () => {
    observer.reset();
};

export default PointerStrategy;
