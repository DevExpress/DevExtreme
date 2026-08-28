import { isMouseEvent } from '@js/common/core/events/utils/index';
import { extend } from '@js/core/utils/extend';
import type { EmitterEvent } from '@ts/events/core/emitter';
import type { PointerEventInit } from '@ts/events/pointer/base';
import BaseStrategy from '@ts/events/pointer/base';
import MouseStrategy from '@ts/events/pointer/mouse';
import type { PointerEventMap } from '@ts/events/pointer/observer';
import TouchStrategy from '@ts/events/pointer/touch';

/* eslint-disable spellcheck/spell-checker */
const eventMap: PointerEventMap = {
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
const activateStrategy = function (): void {
  if (activated) {
    return;
  }
  MouseStrategy.activate();

  activated = true;
};

class MouseAndTouchStrategy extends BaseStrategy {
  static map = eventMap;

  static resetObserver = MouseStrategy.resetObserver;

  EVENT_LOCK_TIMEOUT = 100;

  _skipNextEvents?: boolean;

  _mouseLocked?: boolean;

  _unlockMouseTimer?: ReturnType<typeof setTimeout>;

  constructor(eventName: string, originalEvents: string) {
    super(eventName, originalEvents);

    activateStrategy();
  }

  _handler(e: EmitterEvent): EmitterEvent | undefined {
    const isMouse = isMouseEvent(e);

    if (!isMouse) {
      this._skipNextEvents = true;
    }

    if (isMouse && this._mouseLocked) {
      return undefined;
    }

    if (isMouse && this._skipNextEvents) {
      this._skipNextEvents = false;
      this._mouseLocked = true;

      clearTimeout(this._unlockMouseTimer);

      this._unlockMouseTimer = setTimeout(() => {
        this._mouseLocked = false;
      }, this.EVENT_LOCK_TIMEOUT);

      return undefined;
    }

    return super._handler(e);
  }

  _fireEvent(args: PointerEventInit): EmitterEvent {
    const normalizer = isMouseEvent(args.originalEvent)
      ? MouseStrategy.normalize
      : TouchStrategy.normalize;

    // @ts-expect-error the normalizers expect their own strategy-specific event shape
    return super._fireEvent(extend(normalizer(args.originalEvent), args));
  }

  dispose(element?: Element): void {
    super.dispose(element);
    this._skipNextEvents = false;
    this._mouseLocked = false;
    clearTimeout(this._unlockMouseTimer);
  }
}

export default MouseAndTouchStrategy;
