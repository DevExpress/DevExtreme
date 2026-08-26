import { cancelAnimationFrame, requestAnimationFrame } from '@js/animation/frame';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { subscribeNodesDisposing, unsubscribeNodesDisposing } from '@js/common/core/events/utils/event_nodes_disposing';
import { getEventTarget } from '@js/common/core/events/utils/event_target';
import { addNamespace, fireEvent } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import devices from '@ts/core/m_devices';
import domUtils from '@ts/core/utils/m_dom';
import type { EmitterEvent } from '@ts/events/core/m_emitter';
import Emitter from '@ts/events/core/m_emitter';
import registerEmitter from '@ts/events/core/m_emitter_registrator';

const CLICK_EVENT_NAME = 'dxclick';

const misc = { requestAnimationFrame, cancelAnimationFrame };

type NativeClickEvent = Event & {
  DXCLICK_FIRED?: boolean;
};

interface NodesDisposingSubscription {
  onceCallback: (...args: unknown[]) => unknown;
  nodes: Node[];
}

let prevented: boolean | null = null;
let lastFiredEvent: NativeClickEvent | null = null;
const subscriptions = new Map<NativeClickEvent, NodesDisposingSubscription>();

const onNodeRemove = (): void => {
  lastFiredEvent = null;
};

const clickHandler = function (e: EmitterEvent & { originalEvent: NativeClickEvent }): void {
  const { originalEvent } = e;
  const eventAlreadyFired = lastFiredEvent === originalEvent || (originalEvent && originalEvent.DXCLICK_FIRED);
  const leftButton = !e.which || e.which === 1;

  if (leftButton && !prevented && !eventAlreadyFired) {
    if (originalEvent) {
      originalEvent.DXCLICK_FIRED = true;
    }

    if (lastFiredEvent && subscriptions.has(lastFiredEvent)) {
      // @ts-expect-error the subscription stores onceCallback, not callback, so this
      // destructured callback is always undefined and off() drops every dxremove
      // handler from the nodes
      const { nodes, callback } = subscriptions.get(lastFiredEvent) as NodesDisposingSubscription;

      unsubscribeNodesDisposing(lastFiredEvent, callback, nodes);

      subscriptions.delete(lastFiredEvent);
    }

    lastFiredEvent = originalEvent;

    const subscriptionData: NodesDisposingSubscription = subscribeNodesDisposing(lastFiredEvent, onNodeRemove);

    subscriptions.set(lastFiredEvent, subscriptionData);

    fireEvent({
      type: CLICK_EVENT_NAME,
      originalEvent: e,
    });
  }
};

class ClickEmitter extends Emitter {
  constructor(element: Element) {
    super(element);
    eventsEngine.on(this.getElement(), 'click', clickHandler);
  }

  start(): void {
    prevented = null;
  }

  cancel(): void {
    prevented = true;
  }

  dispose(): void {
    eventsEngine.off(this.getElement(), 'click', clickHandler);
  }
}

// NOTE: fixes native click blur on slow devices
(function () {
  const desktopDevice = devices.real().generic;

  if (!desktopDevice) {
    let startTarget: Element | null = null;
    let blurPrevented = false;

    const isInput = function (element: Element | dxElementWrapper | null): boolean {
      return $(element).is('input, textarea, select, button ,:focus, :focus *');
    };

    const pointerDownHandler = function (e: EmitterEvent): void {
      startTarget = e.target;
      blurPrevented = e.isDefaultPrevented();
    };

    const nativeClickHandler = function (e: EmitterEvent): void {
      const target = getEventTarget(e);
      const $target = $(target);

      if (!blurPrevented && startTarget && !$target.is(startTarget) && !$(startTarget).is('label') && isInput($target)) {
        domUtils.resetActiveElement();
      }

      startTarget = null;
      blurPrevented = false;
    };

    const NATIVE_CLICK_FIXER_NAMESPACE = 'NATIVE_CLICK_FIXER';
    const document = domAdapter.getDocument();
    // @ts-expect-error subscribeGlobal is not declared in the public events engine type
    eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
    // @ts-expect-error subscribeGlobal is not declared in the public events engine type
    eventsEngine.subscribeGlobal(document, addNamespace('click', NATIVE_CLICK_FIXER_NAMESPACE), nativeClickHandler);
  }
}());

registerEmitter({
  emitter: ClickEmitter,
  bubble: true,
  events: [
    CLICK_EVENT_NAME,
  ],
});

export { CLICK_EVENT_NAME as name };

/// #DEBUG
export {
  misc,
};
/// #ENDDEBUG
