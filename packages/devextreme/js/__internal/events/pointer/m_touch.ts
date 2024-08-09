import devices from '@js/core/devices';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import BaseStrategy from '@js/events/pointer/base';

/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'touchstart',
  dxpointermove: 'touchmove',
  dxpointerup: 'touchend',
  dxpointercancel: 'touchcancel',
  dxpointerover: '',
  dxpointerout: '',
  dxpointerenter: '',
  dxpointerleave: '',
};

const normalizeTouchEvent = function (e) {
  const pointers: any = [];

  each(e.touches, (_, touch) => {
    pointers.push(extend({
      pointerId: touch.identifier,
    }, touch));
  });

  return {
    pointers,
    pointerId: e.changedTouches[0].identifier,
  };
};

const skipTouchWithSameIdentifier = function (pointerEvent) {
  return devices.real().platform === 'ios' && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};

const TouchStrategy = BaseStrategy.inherit({

  ctor() {
    this.callBase.apply(this, arguments);
    this._pointerId = 0;
  },

  _handler(e) {
    if (skipTouchWithSameIdentifier(this._eventName)) {
      const touch = e.changedTouches[0];

      if (this._pointerId === touch.identifier && this._pointerId !== 0) {
        return;
      }

      this._pointerId = touch.identifier;
    }

    return this.callBase.apply(this, arguments);
  },

  _fireEvent(args) {
    return this.callBase(extend(normalizeTouchEvent(args.originalEvent), args));
  },

});
// @ts-expect-error
TouchStrategy.map = eventMap;
// @ts-expect-error
TouchStrategy.normalize = normalizeTouchEvent;

export default TouchStrategy;
