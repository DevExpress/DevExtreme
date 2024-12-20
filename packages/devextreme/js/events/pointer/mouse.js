import { extend } from '../../core/utils/extend';
import BaseStrategy from './base';
import Observer from './observer';
import browser from '../../core/utils/browser';

const eventMap = {
    'dxpointerdown': 'mousedown',
    'dxpointermove': 'mousemove',
    'dxpointerup': 'mouseup',
    'dxpointercancel': 'pointercancel',
    'dxpointerover': 'mouseover',
    'dxpointerout': 'mouseout',
    'dxpointerenter': 'mouseenter',
    'dxpointerleave': 'mouseleave'
};

// due to this https://bugs.webkit.org/show_bug.cgi?id=222632 issue
if(browser.safari) {
    // eslint-disable-next-line spellcheck/spell-checker
    eventMap.dxpointercancel += ' ' + 'dragstart';
}

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


export default MouseStrategy;
