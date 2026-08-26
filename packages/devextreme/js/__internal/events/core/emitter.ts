import { fireEvent, hasTouches, isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import type { DxEvent, PointerInteractionEvent } from '@js/events';
import type { CallbackInterface } from '@ts/core/utils/m_callbacks';

export interface EmitterEventPointer {
  pageX: number;
  pageY: number;
}

export interface EventCoords {
  x: number;
  y: number;
  time: number;
}

// The event object flowing through the emitter pipeline: an events-engine
// event over a native pointer interaction, extended by the pointer strategies
// (normalized pointers) and by the emitters themselves. Page coordinates are
// always present: touch events get them from hook_touch_props.
export type EmitterEvent = DxEvent<PointerInteractionEvent> & {
  cancel?: boolean;
  which?: number;
  pageX: number;
  pageY: number;
  pointerType?: string;
  pointers?: (EmitterEventPointer | null)[];
  originalEvent: PointerInteractionEvent & { touches?: ArrayLike<unknown> };
  _needSkipEvent?: boolean;
};

export type EmitterConfigData = Record<string, unknown> & {
  delegateSelector?: string;
};

class Emitter {
  _$element: dxElementWrapper;

  _cancelCallback: CallbackInterface;

  _acceptCallback: CallbackInterface;

  _acceptRequestEvent?: EmitterEvent | null;

  delegateSelector?: string;

  constructor(element: Element | dxElementWrapper) {
    this._$element = $(element);

    this._cancelCallback = Callbacks();
    this._acceptCallback = Callbacks();
  }

  getElement(): dxElementWrapper {
    return this._$element;
  }

  validate(e: EmitterEvent): boolean {
    return !isDxMouseWheelEvent(e);
  }

  validatePointers(e: EmitterEvent): boolean {
    return hasTouches(e) === 1;
  }

  allowInterruptionByMouseWheel(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(data: EmitterConfigData, eventName?: string): void {
    extend(this, data);
  }

  addCancelCallback(callback: (emitter: Emitter, e?: EmitterEvent) => void): void {
    this._cancelCallback.add(callback);
  }

  removeCancelCallback(): void {
    this._cancelCallback.empty();
  }

  _cancel(e?: EmitterEvent): void {
    this._cancelCallback.fire(this, e);
  }

  addAcceptCallback(callback: (emitter: Emitter, e?: EmitterEvent) => void): void {
    this._acceptCallback.add(callback);
  }

  removeAcceptCallback(): void {
    this._acceptCallback.empty();
  }

  _accept(e?: EmitterEvent | null): void {
    this._acceptCallback.fire(this, e);
  }

  _requestAccept(e: EmitterEvent): void {
    this._acceptRequestEvent = e;
  }

  _forgetAccept(): void {
    this._accept(this._acceptRequestEvent);
    this._acceptRequestEvent = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  move(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  end(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cancel(e: EmitterEvent): void {}

  reset(): void {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  }

  _fireEvent(eventName: string, e: EmitterEvent, params?: Record<string, unknown>): EmitterEvent {
    const eventData = extend({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0),
    }, params);

    const firedEvent: EmitterEvent = fireEvent(eventData);

    if (firedEvent.cancel) {
      this._cancel(firedEvent);
    }

    return firedEvent;
  }

  _getEmitterTarget(e: EmitterEvent): Element {
    const $target = this.delegateSelector
      ? $(e.target).closest(this.delegateSelector)
      : this.getElement();

    return $target.get(0);
  }

  dispose(): void {}
}

export default Emitter;
