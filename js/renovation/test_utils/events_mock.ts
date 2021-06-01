import { keyboard } from '../../events/short';
import { AbstractFunction } from '../common/types';

let eventHandlers = {};
let keyboardHandlers = {};
export const KEY = {
  enter: 'enter',
  space: 'space',
  a: 'a',
};

export const clear = (): void => {
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
  dragStart: 'dxdragstart',
  dragMove: 'dxdrag',
  dragEnd: 'dxdragend',
};

export const defaultEvent = {
  isDefaultPrevented: (): void => undefined,
  preventDefault: (): void => undefined,
  stopImmediatePropagation: (): void => undefined,
  stopPropagation: (): void => undefined,
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

export const getEventHandlers = (e: string): Record<string, AbstractFunction[]> => eventHandlers[e];

export const emitKeyboard = (key: string, which = key, e = defaultEvent): void => {
  Object.keys(keyboardHandlers).forEach((id) => {
    keyboardHandlers[id].forEach(
      (handler) => handler({ originalEvent: e, keyName: key, which }),
    );
  });
};

export const emit = (event: string, e = defaultEvent, element = null): void => {
  eventHandlers[event]?.forEach(({ handler, el }) => {
    if (!element || el === element) {
      handler(e);
    }
  });
};

let keyboardSubscriberId = 0;

keyboard.on = (_el, _focusTarget, handler): string => {
  keyboardSubscriberId += 1;
  keyboardHandlers[keyboardSubscriberId] = keyboardHandlers[keyboardSubscriberId] || [];
  keyboardHandlers[keyboardSubscriberId].push(handler);

  return keyboardSubscriberId.toString();
};

keyboard.off = (id) => { keyboardHandlers[id] = []; };

jest.mock('../../events/core/events_engine', () => {
  const originalEventsEngine = jest.requireActual('../../events/core/events_engine').default;

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
