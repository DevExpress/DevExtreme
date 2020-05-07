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

export const emit = (event, e = defaultEvent, element = null) => {
    eventHandlers[event]?.forEach(({ handler, el }) => {
      if (!element || el === element) {
        handler(e);
      }
    });
};

let keyboardSubscriberId = 0;

keyboard.on = (el, focusTarget, handler): string => {
  keyboardSubscriberId += 1;
  keyboardHandlers[keyboardSubscriberId] = keyboardHandlers[keyboardSubscriberId] || [];
  keyboardHandlers[keyboardSubscriberId].push(handler);

  return keyboardSubscriberId.toString();
};

keyboard.off = (id) => delete keyboardHandlers[id];

jest.mock('../../../js/events/core/events_engine', () => {
  const originalEventsEngine = jest.requireActual('../../../js/events/core/events_engine');
  return (
    {
      ...originalEventsEngine,
      on: (el, eventName, ...args): void => {
        const event = eventName.split('.')[0];

        if (!eventHandlers[event]) {
          eventHandlers[event] = [];
        }

        eventHandlers[event].push({
          handler: args[args.length - 1],
          el,
        });
      },
      off: (_, eventName): void => {
        const event = eventName.split('.')[0];
        eventHandlers[event] = [];
      },
      trigger: (element, event): void => {
        emit(EVENT[event], undefined, element);
      },
    });
});
