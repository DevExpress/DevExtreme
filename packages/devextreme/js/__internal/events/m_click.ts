import { cancelAnimationFrame, requestAnimationFrame } from '@js/animation/frame';
import Emitter from '@js/common/core/events/core/emitter';
import registerEmitter from '@js/common/core/events/core/emitter_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { subscribeNodesDisposing, unsubscribeNodesDisposing } from '@js/common/core/events/utils/event_nodes_disposing';
import { getEventTarget } from '@js/common/core/events/utils/event_target';
import { addNamespace, fireEvent } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import devices from '@ts/core/m_devices';
import domUtils from '@ts/core/utils/m_dom';

const CLICK_EVENT_NAME = 'dxclick';

const misc = { requestAnimationFrame, cancelAnimationFrame };

let prevented: boolean | null = null;
let lastFiredEvent = null;

const onNodeRemove = () => {
  lastFiredEvent = null;
};

const clickHandler = function (e) {
  const { originalEvent } = e;
  const eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
  const leftButton = !e.which || e.which === 1;

  if (leftButton && !prevented && !eventAlreadyFired) {
    if (originalEvent) {
      originalEvent.DXCLICK_FIRED = true;
    }

    unsubscribeNodesDisposing(lastFiredEvent, onNodeRemove);
    lastFiredEvent = originalEvent;
    subscribeNodesDisposing(lastFiredEvent, onNodeRemove);

    fireEvent({
      type: CLICK_EVENT_NAME,
      originalEvent: e,
    });
  }
};

const ClickEmitter = Emitter.inherit({

  ctor(element) {
    this.callBase(element);
    eventsEngine.on(this.getElement(), 'click', clickHandler);
  },

  start() {
    prevented = null;
  },

  cancel() {
    prevented = true;
  },

  dispose() {
    eventsEngine.off(this.getElement(), 'click', clickHandler);
  },
});

// NOTE: fixes native click blur on slow devices
(function () {
  const desktopDevice = devices.real().generic;

  if (!desktopDevice) {
    let startTarget = null;
    let blurPrevented = false;

    const isInput = function (element) {
      return $(element).is('input, textarea, select, button ,:focus, :focus *');
    };

    const pointerDownHandler = function (e) {
      startTarget = e.target;
      blurPrevented = e.isDefaultPrevented();
    };

    const getTarget = function (e) {
      const target = getEventTarget(e);
      return $(target);
    };

    const clickHandler = function (e) {
      const $target = getTarget(e);

      if (!blurPrevented && startTarget && !$target.is(startTarget) && !$(startTarget).is('label') && isInput($target)) {
        domUtils.resetActiveElement();
      }

      startTarget = null;
      blurPrevented = false;
    };

    const NATIVE_CLICK_FIXER_NAMESPACE = 'NATIVE_CLICK_FIXER';
    const document = domAdapter.getDocument();
    // @ts-expect-error
    eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
    // @ts-expect-error
    eventsEngine.subscribeGlobal(document, addNamespace('click', NATIVE_CLICK_FIXER_NAMESPACE), clickHandler);
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
