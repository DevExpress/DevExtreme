import BaseStrategy from '@js/common/core/events/pointer/base';
import Observer from '@js/common/core/events/pointer/observer';
import { extend } from '@js/core/utils/extend';

/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'mousedown',
  dxpointermove: 'mousemove',
  dxpointerup: 'mouseup',
  dxpointercancel: '',
  dxpointerover: 'mouseover',
  dxpointerout: 'mouseout',
  dxpointerenter: 'mouseenter',
  dxpointerleave: 'mouseleave',
};

const normalizeMouseEvent = function (e) {
  e.pointerId = 1;

  return {
    pointers: observer.pointers(),
    pointerId: 1,
  };
};

let observer;
let activated = false;
const activateStrategy = function () {
  if (activated) {
    return;
  }
  // @ts-expect-error
  observer = new Observer(eventMap, () => true);

  activated = true;
};

const MouseStrategy = BaseStrategy.inherit({

  ctor() {
    this.callBase.apply(this, arguments);

    activateStrategy();
  },

  _fireEvent(args) {
    return this.callBase(extend(normalizeMouseEvent(args.originalEvent), args));
  },

});

MouseStrategy.map = eventMap;
MouseStrategy.normalize = normalizeMouseEvent;
MouseStrategy.activate = activateStrategy;
MouseStrategy.resetObserver = function () {
  observer.reset();
};

export default MouseStrategy;
