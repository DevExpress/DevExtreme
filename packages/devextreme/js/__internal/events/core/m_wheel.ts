import registerEvent from '@js/common/core/events/core/event_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, fireEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';

const EVENT_NAME = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';
const NATIVE_EVENT_NAME = 'wheel';

const PIXEL_MODE = 0;
const DELTA_MULTIPLIER = 30;

enum DeltaMode {
  DOM_DELTA_PIXEL = 0,
  DOM_DELTA_LINE = 1,
  DOM_DELTA_PAGE = 2,
}

interface WheelEvent {
  deltaMode: DeltaMode;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

const wheel = {
  setup(element) {
    const $element = $(element);
    eventsEngine.on($element, addNamespace(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
  },

  teardown(element) {
    eventsEngine.off(element, `.${EVENT_NAMESPACE}`);
  },

  _wheelHandler(e) {
    const {
      deltaMode, deltaY, deltaX, deltaZ,
    }: WheelEvent = e.originalEvent;

    const delta = this._getWheelDelta(deltaY, deltaX);

    fireEvent({
      type: EVENT_NAME,
      originalEvent: e,
      // @ts-expect-error
      delta: this._normalizeDelta(delta, deltaMode),
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
      pointerType: 'mouse',
    });

    e.stopPropagation();
  },

  _normalizeDelta(delta: number, deltaMode = PIXEL_MODE) {
    if (deltaMode === PIXEL_MODE) {
      return -delta;
    }
    // Use multiplier to get rough delta value in px for the LINE or PAGE mode
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
    return -DELTA_MULTIPLIER * delta;
  },

  _getWheelDelta(deltaY: number, deltaX: number) {
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
