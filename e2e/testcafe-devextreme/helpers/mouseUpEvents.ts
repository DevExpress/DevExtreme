/* eslint-disable spellcheck/spell-checker, no-underscore-dangle */

import { ClientFunction } from 'testcafe';

export enum MouseAction {
  dragToOffset = 'DragToOffset',
  dragToElement = 'DragToElement',
}

const disableMouseUpEvent = (mouseAction: MouseAction): Promise<void> => ClientFunction(() => {
  const proto = (window as any)['%testCafeAutomation%'][mouseAction].prototype.constructor.prototype;

  (window as any)._originalMouseup = proto._mouseup;

  // eslint-disable-next-line no-promise-executor-return
  proto._mouseup = () => new Promise((r) => setTimeout(r, 1));
}, {
  dependencies: {
    mouseAction,
  },
})();

const enableMouseUpEvent = (mouseAction: MouseAction): Promise<void> => ClientFunction(() => {
  (window as any)['%testCafeAutomation%'][mouseAction].prototype.constructor.prototype._mouseup = (window as any)._originalMouseup;
}, {
  dependencies: {
    mouseAction,
  },
})();

export const MouseUpEvents = {
  disable: disableMouseUpEvent,
  enable: enableMouseUpEvent,
};
