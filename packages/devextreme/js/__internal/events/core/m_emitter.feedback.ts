/* eslint-disable max-classes-per-file */
import pointerEvents from '@js/common/core/events/pointer';
import { isMouseEvent } from '@js/common/core/events/utils/index';
import { ensureDefined, noop } from '@js/core/utils/common';
import { contains } from '@js/core/utils/dom';
import devices from '@ts/core/m_devices';
import type { EmitterConfigData, EmitterEvent } from '@ts/events/core/m_emitter';
import Emitter from '@ts/events/core/m_emitter';
import registerEmitter from '@ts/events/core/m_emitter_registrator';

const ACTIVE_EVENT_NAME = 'dxactive';
const INACTIVE_EVENT_NAME = 'dxinactive';

const ACTIVE_TIMEOUT = 30;
const INACTIVE_TIMEOUT = 400;

class FeedbackEvent {
  _timeout: number;

  _fire: () => void;

  _timer?: ReturnType<typeof setTimeout>;

  _fired = false;

  constructor(timeout: number, fire: () => void) {
    this._timeout = timeout;
    this._fire = fire;
  }

  start(): void {
    this._schedule(() => {
      this.force();
    });
  }

  _schedule(fn: () => void): void {
    this.stop();
    this._timer = setTimeout(fn, this._timeout);
  }

  stop(): void {
    clearTimeout(this._timer);
  }

  force(): void {
    if (this._fired) {
      return;
    }

    this.stop();
    this._fire();
    this._fired = true;
  }

  fired(): boolean {
    return this._fired;
  }
}

let activeFeedback: FeedbackEmitter | null = null;

interface FeedbackLockDeferred {
  done: (callback: () => void) => unknown;
}

class FeedbackEmitter extends Emitter {
  _active: FeedbackEvent;

  _inactive: FeedbackEvent;

  activeTimeout?: number;

  inactiveTimeout?: number;

  constructor(element: Element) {
    super(element);

    this._active = new FeedbackEvent(0, noop);
    this._inactive = new FeedbackEvent(0, noop);
  }

  configure(data: EmitterConfigData, eventName?: string): void {
    switch (eventName) {
      case ACTIVE_EVENT_NAME:
        data.activeTimeout = data.timeout;
        break;
      case INACTIVE_EVENT_NAME:
        data.inactiveTimeout = data.timeout;
        break;
      default:
        break;
    }

    super.configure(data);
  }

  start(e: EmitterEvent): void {
    if (activeFeedback) {
      const activeChildExists = contains(this.getElement().get(0), activeFeedback.getElement().get(0));
      const childJustActivated = !activeFeedback._active.fired();

      if (activeChildExists && childJustActivated) {
        this._cancel();
        return;
      }

      activeFeedback._inactive.force();
    }
    activeFeedback = this;

    this._initEvents(e);
    this._active.start();
  }

  _initEvents(e: EmitterEvent): void {
    const eventTarget = this._getEmitterTarget(e);

    const mouseEvent = isMouseEvent(e);
    const isSimulator = devices.isSimulator();
    const deferFeedback = isSimulator || !mouseEvent;

    const activeTimeout = ensureDefined(this.activeTimeout, ACTIVE_TIMEOUT);
    const inactiveTimeout = ensureDefined(this.inactiveTimeout, INACTIVE_TIMEOUT);

    this._active = new FeedbackEvent(deferFeedback ? activeTimeout : 0, () => {
      this._fireEvent(ACTIVE_EVENT_NAME, e, { target: eventTarget });
    });
    this._inactive = new FeedbackEvent(deferFeedback ? inactiveTimeout : 0, () => {
      this._fireEvent(INACTIVE_EVENT_NAME, e, { target: eventTarget });
      activeFeedback = null;
    });
  }

  cancel(e: EmitterEvent): void {
    this.end(e);
  }

  end(e: EmitterEvent): void {
    const skipTimers = e.type !== pointerEvents.up;

    if (skipTimers) {
      this._active.stop();
    } else {
      this._active.force();
    }

    this._inactive.start();

    if (skipTimers) {
      this._inactive.force();
    }
  }

  dispose(): void {
    this._active.stop();
    this._inactive.stop();

    if (activeFeedback === this) {
      activeFeedback = null;
    }

    super.dispose();
  }

  lockInactive(): () => void {
    this._active.force();
    this._inactive.stop();
    activeFeedback = null;
    this._cancel();

    return this._inactive.force.bind(this._inactive);
  }

  static lock(deferred: FeedbackLockDeferred): void {
    const lockInactive = activeFeedback ? activeFeedback.lockInactive() : noop;

    deferred.done(lockInactive);
  }
}

registerEmitter({
  emitter: FeedbackEmitter,
  events: [
    ACTIVE_EVENT_NAME,
    INACTIVE_EVENT_NAME,
  ],
});

export const { lock } = FeedbackEmitter;
export {
  ACTIVE_EVENT_NAME as active,
  INACTIVE_EVENT_NAME as inactive,
};
