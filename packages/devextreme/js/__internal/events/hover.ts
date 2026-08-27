/* eslint-disable max-classes-per-file */
import registerEvent from '@js/common/core/events/core/event_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, fireEvent, isTouchEvent } from '@js/common/core/events/utils/index';
import { data as elementData, removeData } from '@js/core/element_data';
import devices from '@ts/core/m_devices';
import type { EmitterEvent } from '@ts/events/core/emitter';

const HOVERSTART_NAMESPACE = 'dxHoverStart';
const HOVERSTART = 'dxhoverstart';
const POINTERENTER_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.enter, HOVERSTART_NAMESPACE);

const HOVEREND_NAMESPACE = 'dxHoverEnd';
const HOVEREND = 'dxhoverend';
const POINTERLEAVE_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.leave, HOVEREND_NAMESPACE);

interface HoverHandleObj {
  selector?: string;
  guid: string;
}

type HoverHandlersStore = Record<string, (e: EmitterEvent) => void>;

class Hover {
  noBubble = true;

  _eventNamespace: string;

  _eventName: string;

  _originalEventName: string;

  _handlerArrayKeyPath: string;

  constructor(eventNamespace: string, eventName: string, originalEventName: string) {
    this._eventNamespace = eventNamespace;
    this._eventName = eventName;
    this._originalEventName = originalEventName;

    this._handlerArrayKeyPath = `${this._eventNamespace}_HandlerStore`;
  }

  setup(element: Element): void {
    elementData(element, this._handlerArrayKeyPath, {});
  }

  add(element: Element, handleObj: HoverHandleObj): void {
    const handler = (e: EmitterEvent): void => {
      this._handler(e);
    };

    eventsEngine.on(element, this._originalEventName, handleObj.selector, handler);
    const handlers: HoverHandlersStore = elementData(element, this._handlerArrayKeyPath);
    handlers[handleObj.guid] = handler;
  }

  _handler(e: EmitterEvent): void {
    if (isTouchEvent(e) || devices.isSimulator()) {
      return;
    }

    fireEvent({
      type: this._eventName,
      originalEvent: e,
      delegateTarget: e.delegateTarget,
    });
  }

  remove(element: Element, handleObj: HoverHandleObj): void {
    const handlers: HoverHandlersStore = elementData(element, this._handlerArrayKeyPath);
    const handler = handlers[handleObj.guid];
    // @ts-expect-error off with a selector is not declared in the public events engine type
    eventsEngine.off(element, this._originalEventName, handleObj.selector, handler);
  }

  teardown(element: Element): void {
    removeData(element, this._handlerArrayKeyPath);
  }
}

class HoverStart extends Hover {
  constructor() {
    super(HOVERSTART_NAMESPACE, HOVERSTART, POINTERENTER_NAMESPACED_EVENT_NAME);
  }

  _handler(e: EmitterEvent): void {
    const pointers = e.pointers ?? [];
    if (!pointers.length) {
      super._handler(e);
    }
  }
}

class HoverEnd extends Hover {
  constructor() {
    super(HOVEREND_NAMESPACE, HOVEREND, POINTERLEAVE_NAMESPACED_EVENT_NAME);
  }
}

registerEvent(HOVERSTART, new HoverStart());
registerEvent(HOVEREND, new HoverEnd());

export {
  HOVEREND as end,
  HOVERSTART as start,
};
