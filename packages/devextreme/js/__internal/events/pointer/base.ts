import eventsEngine from '@js/common/core/events/core/events_engine';
import { getEventTarget } from '@js/common/core/events/utils/event_target';
import { addNamespace, eventSource, fireEvent } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import browser from '@js/core/utils/browser';
import type { EmitterEvent } from '@ts/events/core/emitter';
import type { HandleObject } from '@ts/events/core/events_engine';

const POINTER_EVENTS_NAMESPACE = 'dxPointerEvents';

export interface PointerStrategyEventArgs {
  type: string;
  pointerType: string;
  originalEvent: EmitterEvent;
  delegateTarget: Element | undefined;
  timeStamp: number;
  target?: EventTarget | null;
}

class BaseStrategy {
  _eventName: string;

  _originalEvents: string;

  _handlerCount: number;

  noBubble: boolean;

  _selector?: string | null;

  constructor(eventName: string, originalEvents: string) {
    this._eventName = eventName;
    this._originalEvents = addNamespace(originalEvents, POINTER_EVENTS_NAMESPACE);
    this._handlerCount = 0;
    this.noBubble = this._isNoBubble();
  }

  _isNoBubble(): boolean {
    const eventName = this._eventName;

    return eventName === 'dxpointerenter'
            || eventName === 'dxpointerleave';
  }

  _handler(e: EmitterEvent): EmitterEvent | undefined {
    const delegateTarget = this._getDelegateTarget(e);

    const event: PointerStrategyEventArgs = {
      type: this._eventName,
      pointerType: e.pointerType || eventSource(e),
      originalEvent: e,
      delegateTarget,
      // NOTE: TimeStamp normalization (FF bug #238041) (T277118)
      timeStamp: browser.mozilla ? new Date().getTime() : e.timeStamp,
    };

    const target = getEventTarget(e);
    event.target = target;

    return this._fireEvent(event);
  }

  _getDelegateTarget(e: EmitterEvent): Element | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let delegateTarget: Element | undefined;

    if (this.noBubble) {
      delegateTarget = e.delegateTarget;
    }

    return delegateTarget;
  }

  _fireEvent(args: PointerStrategyEventArgs): EmitterEvent {
    const event: EmitterEvent = fireEvent(args);

    return event;
  }

  _setSelector(handleObj?: HandleObject): void {
    this._selector = this.noBubble && handleObj ? handleObj.selector : null;
  }

  _getSelector(): string | null | undefined {
    return this._selector;
  }

  setup(): boolean {
    return true;
  }

  add(element: Element, handleObj: HandleObject): void {
    if (this._handlerCount <= 0 || this.noBubble) {
      const target = this.noBubble ? element : domAdapter.getDocument();
      this._setSelector(handleObj);

      eventsEngine.on(target, this._originalEvents, this._getSelector(), (e) => {
        this._handler(e);
      });
    }

    if (!this.noBubble) {
      this._handlerCount += 1;
    }
  }

  remove(): void {
    this._selector = null;

    if (!this.noBubble) {
      this._handlerCount -= 1;
    }
  }

  teardown(element: Element): void {
    if (this._handlerCount && !this.noBubble) {
      return;
    }

    const target = this.noBubble ? element : domAdapter.getDocument();

    if (this._originalEvents !== `.${POINTER_EVENTS_NAMESPACE}`) {
      eventsEngine.off(target, this._originalEvents, this._getSelector());
    }
  }

  dispose(element?: Element): void {
    const target = this.noBubble ? element : domAdapter.getDocument();

    eventsEngine.off(target, this._originalEvents);
  }
}

export default BaseStrategy;
