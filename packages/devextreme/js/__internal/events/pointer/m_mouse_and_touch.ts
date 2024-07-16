import { extend } from '@js/core/utils/extend';
import BaseStrategy from '@js/events/pointer/base';
import MouseStrategy from '@js/events/pointer/mouse';
import TouchStrategy from '@js/events/pointer/touch';
import { isMouseEvent } from '@js/events/utils/index';

/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'touchstart mousedown',
  dxpointermove: 'touchmove mousemove',
  dxpointerup: 'touchend mouseup',
  dxpointercancel: 'touchcancel',
  dxpointerover: 'mouseover',
  dxpointerout: 'mouseout',
  dxpointerenter: 'mouseenter',
  dxpointerleave: 'mouseleave',
};

let activated = false;
const activateStrategy = function () {
  if (activated) {
    return;
  }
  // @ts-expect-error
  MouseStrategy.activate();

  activated = true;
};

const MouseAndTouchStrategy = BaseStrategy.inherit({

  EVENT_LOCK_TIMEOUT: 100,

  ctor() {
    this.callBase.apply(this, arguments);

    activateStrategy();
  },

  _handler(e) {
    const isMouse = isMouseEvent(e);

    if (!isMouse) {
      this._skipNextEvents = true;
    }

    if (isMouse && this._mouseLocked) {
      return;
    }

    if (isMouse && this._skipNextEvents) {
      this._skipNextEvents = false;
      this._mouseLocked = true;

      clearTimeout(this._unlockMouseTimer);

      const that = this;
      this._unlockMouseTimer = setTimeout(() => {
        that._mouseLocked = false;
      }, this.EVENT_LOCK_TIMEOUT);

      return;
    }

    return this.callBase(e);
  },

  _fireEvent(args) {
    // @ts-expect-error
    const normalizer = isMouseEvent(args.originalEvent) ? MouseStrategy.normalize : TouchStrategy.normalize;

    return this.callBase(extend(normalizer(args.originalEvent), args));
  },

  dispose() {
    this.callBase();
    this._skipNextEvents = false;
    this._mouseLocked = false;
    clearTimeout(this._unlockMouseTimer);
  },
});

// @ts-expect-error
MouseAndTouchStrategy.map = eventMap;
// @ts-expect-error
MouseAndTouchStrategy.resetObserver = MouseStrategy.resetObserver;

export default MouseAndTouchStrategy;
