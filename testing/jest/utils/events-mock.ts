import eventsEngine from '../../../js/events/core/events_engine';
import { keyboard } from '../../../js/events/short';

let eventHandlers = {};
let keyboardHandlers = {};

export const KEY = {
  enter: 'enter',
  space: 'space',
  a: 'a',
};

export const clear = () => {
  eventHandlers = {};
  keyboardHandlers = {};
};

export const EVENT = {
  active: 'dxactive',
  blur: 'focusout',
  click: 'click',
  dxClick: 'dxclick',
  focus: 'focusin',
  hiding: 'dxhiding',
  hoverEnd: 'dxhoverend',
  hoverStart: 'dxhoverstart',
  inactive: 'dxinactive',
  shown: 'dxshown',
  resize: 'dxresize',
};

export const defaultEvent = {
  isDefaultPrevented: () => undefined,
  preventDefault: () => undefined,
  stopImmediatePropagation: () => undefined,
  stopPropagation: () => undefined,
  screenX: 5,
  offsetX: 5,
  pageX: 10,
  pageY: 10,
};

export const fakeClickEvent = {
  ...defaultEvent,
  screenX: 0,
  offsetX: 0,
  pageX: 0,
  pageY: 0,
};

export const getEventHandlers = (event) => eventHandlers[event];

export const emitKeyboard = (key, which = key, e = defaultEvent) => {
  Object.keys(keyboardHandlers).forEach((id) => {
    keyboardHandlers[id].forEach(
      (handler) => handler({ originalEvent: e, keyName: key, which }),
    );
  });
};

export const emit = (event, e = defaultEvent, element) => {
    eventHandlers[event]?.forEach(({ handler, el }) => {
      if (!element || el === element) {
        handler(e);
      }
    });
};

let keyboardSubscriberId = 0;

keyboard.on = (el, focusTarget, handler) => {
  keyboardSubscriberId += 1;
  keyboardHandlers[keyboardSubscriberId] = keyboardHandlers[keyboardSubscriberId] || [];
  keyboardHandlers[keyboardSubscriberId].push(handler);

  return keyboardSubscriberId;
};

eventsEngine.on = (...args) => {
  const event = args[1].split('.')[0];

  if (!eventHandlers[event]) {
    eventHandlers[event] = [];
  }

  eventHandlers[event].push({
    handler: args[args.length - 1],
    el: args[0],
  });
};

eventsEngine.off = (...args) => {
  const event = args[1].split('.')[0];
  eventHandlers[event] = [];
};

eventsEngine.trigger = (element, event) => {
  emit(EVENT[event], undefined, element);
};

keyboard.off = (id) => delete keyboardHandlers[id];
