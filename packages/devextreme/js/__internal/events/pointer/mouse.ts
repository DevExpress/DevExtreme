import browser from '@js/core/utils/browser';
import { extend } from '@js/core/utils/extend';
import type { EmitterEvent } from '@ts/events/core/emitter';
import type { PointerStrategyEventArgs } from '@ts/events/pointer/base';
import BaseStrategy from '@ts/events/pointer/base';
import type { PointerEventMap } from '@ts/events/pointer/observer';
import Observer from '@ts/events/pointer/observer';

/* eslint-disable spellcheck/spell-checker */
const eventMap: PointerEventMap = {
  dxpointerdown: 'mousedown',
  dxpointermove: 'mousemove',
  dxpointerup: 'mouseup',
  dxpointercancel: 'pointercancel',
  dxpointerover: 'mouseover',
  dxpointerout: 'mouseout',
  dxpointerenter: 'mouseenter',
  dxpointerleave: 'mouseleave',
};

// due to this https://bugs.webkit.org/show_bug.cgi?id=222632 issue
if (browser.safari) {
  // eslint-disable-next-line no-useless-concat
  eventMap.dxpointercancel += ' ' + 'dragstart';
}

// eslint-disable-next-line @typescript-eslint/init-declarations
let observer: Observer;

interface NormalizedPointerData {
  pointers: Event[];
  pointerId: number;
}

const normalizeMouseEvent = function (
  e: EmitterEvent & { pointerId?: number },
): NormalizedPointerData {
  e.pointerId = 1;

  return {
    pointers: observer.pointers(),
    pointerId: 1,
  };
};

let activated = false;
const activateStrategy = function (): void {
  if (activated) {
    return;
  }

  observer = new Observer(eventMap, () => true);

  activated = true;
};

class MouseStrategy extends BaseStrategy {
  static map = eventMap;

  static normalize = normalizeMouseEvent;

  static activate = activateStrategy;

  constructor(eventName: string, originalEvents: string) {
    super(eventName, originalEvents);

    activateStrategy();
  }

  static resetObserver = (): void => {
    observer.reset();
  };

  _fireEvent(args: PointerStrategyEventArgs): EmitterEvent {
    return super._fireEvent(extend(normalizeMouseEvent(args.originalEvent), args));
  }
}

export default MouseStrategy;
