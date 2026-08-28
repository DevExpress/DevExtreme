import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import devices from '@ts/core/m_devices';
import type { EmitterEvent, EmitterEventPointer } from '@ts/events/core/emitter';
import type { PointerEventInit } from '@ts/events/pointer/base';
import BaseStrategy from '@ts/events/pointer/base';
import type { PointerEventMap } from '@ts/events/pointer/observer';

/* eslint-disable spellcheck/spell-checker */
const eventMap: PointerEventMap = {
  dxpointerdown: 'touchstart',
  dxpointermove: 'touchmove',
  dxpointerup: 'touchend',
  dxpointercancel: 'touchcancel',
  dxpointerover: '',
  dxpointerout: '',
  dxpointerenter: '',
  dxpointerleave: '',
};

type TouchPointerEvent = EmitterEvent & {
  touches: TouchList;
  changedTouches: TouchList;
};

interface NormalizedTouchData {
  pointers: EmitterEventPointer[];
  pointerId: number;
}

const normalizeTouchEvent = function (e: TouchPointerEvent): NormalizedTouchData {
  const pointers: EmitterEventPointer[] = [];

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

const skipTouchWithSameIdentifier = function (pointerEvent: string): boolean {
  return devices.real().platform === 'ios'
    && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};

class TouchStrategy extends BaseStrategy {
  static map = eventMap;

  static normalize = normalizeTouchEvent;

  _pointerId: number;

  constructor(eventName: string, originalEvents: string) {
    super(eventName, originalEvents);
    this._pointerId = 0;
  }

  _handler(e: TouchPointerEvent): EmitterEvent | undefined {
    if (skipTouchWithSameIdentifier(this._eventName)) {
      const touch = e.changedTouches[0];

      if (this._pointerId === touch.identifier && this._pointerId !== 0) {
        return undefined;
      }

      this._pointerId = touch.identifier;
    }

    return super._handler(e);
  }

  _fireEvent(args: PointerEventInit): EmitterEvent {
    const touchEvent = args.originalEvent as TouchPointerEvent;

    return super._fireEvent(extend(normalizeTouchEvent(touchEvent), args));
  }
}

export default TouchStrategy;
