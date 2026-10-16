import registerEvent from '@js/common/core/events/core/event_registrator';
import { addNamespace, fireEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import type {
  EngineEvent, EngineTarget, EventPropertyBag,
} from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';

const EVENT_NAME = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';
const NATIVE_EVENT_NAME = 'wheel';

const PIXEL_MODE = 0;
const DELTA_MULTIPLIER = 30;

type MouseWheelEvent = EngineEvent & { originalEvent: WheelEvent };

const wheel = {
  setup(element: EngineTarget): void {
    const $element = $(element);
    eventsEngine.on(
      $element,
      addNamespace(NATIVE_EVENT_NAME, EVENT_NAMESPACE),
      wheel._wheelHandler.bind(wheel),
    );
  },

  teardown(element: EngineTarget): void {
    eventsEngine.off(element, `.${EVENT_NAMESPACE}`);
  },

  _wheelHandler(e: MouseWheelEvent): void {
    const {
      deltaMode, deltaY, deltaX, deltaZ,
    } = e.originalEvent;

    const delta = this._getWheelDelta(deltaY, deltaX);

    const wheelEvent: EventPropertyBag & { originalEvent: EngineEvent } = {
      type: EVENT_NAME,
      originalEvent: e,
      delta: this._normalizeDelta(delta, deltaMode),
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
      pointerType: 'mouse',
    };

    fireEvent(wheelEvent);

    e.stopPropagation();
  },

  _normalizeDelta(delta: number, deltaMode = PIXEL_MODE): number {
    if (deltaMode === PIXEL_MODE) {
      return -delta;
    }
    // Use multiplier to get rough delta value in px for the LINE or PAGE mode
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
    return -DELTA_MULTIPLIER * delta;
  },

  _getWheelDelta(deltaY: number, deltaX: number): number {
    if (deltaY) {
      return deltaY;
    }

    if (deltaX) {
      return deltaX;
    }

    return 0;
  },
};

registerEvent(EVENT_NAME, wheel);

export { EVENT_NAME as name };
