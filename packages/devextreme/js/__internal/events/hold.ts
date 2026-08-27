import { eventData, eventDelta } from '@js/common/core/events/utils/index';
import type { EmitterEvent, EventCoords } from '@ts/events/core/emitter';
import Emitter from '@ts/events/core/emitter';
import registerEmitter from '@ts/events/core/emitter_registrator';

const { abs } = Math;

const HOLD_EVENT_NAME = 'dxhold';
const HOLD_TIMEOUT = 750;
const TOUCH_BOUNDARY = 5;

class HoldEmitter extends Emitter {
  timeout?: number;

  _startEventData!: EventCoords;

  _holdTimer?: ReturnType<typeof setTimeout>;

  start(e: EmitterEvent): void {
    this._startEventData = eventData(e);

    this._startTimer(e);
  }

  _startTimer(e: EmitterEvent): void {
    const holdTimeout = this.timeout ?? HOLD_TIMEOUT;
    this._holdTimer = setTimeout(() => {
      this._requestAccept(e);
      this._fireEvent(HOLD_EVENT_NAME, e, {
        target: e.target,
      });
      this._forgetAccept();
    }, holdTimeout);
  }

  move(e: EmitterEvent): void {
    if (this._touchWasMoved(e)) {
      this._cancel(e);
    }
  }

  _touchWasMoved(e: EmitterEvent): boolean {
    const delta: EventCoords = eventDelta(this._startEventData, eventData(e));

    return abs(delta.x) > TOUCH_BOUNDARY || abs(delta.y) > TOUCH_BOUNDARY;
  }

  end(): void {
    this._stopTimer();
  }

  _stopTimer(): void {
    clearTimeout(this._holdTimer);
  }

  cancel(): void {
    this._stopTimer();
  }

  dispose(): void {
    this._stopTimer();
  }
}

registerEmitter({
  emitter: HoldEmitter,
  bubble: true,
  events: [
    HOLD_EVENT_NAME,
  ],
});

export default {
  name: HOLD_EVENT_NAME,
};
