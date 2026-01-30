import { ClientFunction } from 'testcafe';

export enum MouseAction {
  dragToOffset = 'DragToOffset',
  dragToElement = 'DragToElement',
}

const disableMouseUpEvent = (mouseAction: MouseAction): Promise<void> => ClientFunction(() => {
  const proto = (window as any)['%testCafeAutomation%'][mouseAction].prototype.constructor.prototype;

  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle
  (window as any)._originalMouseup = proto._mouseup;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle, no-promise-executor-return
  proto._mouseup = () => new Promise((r) => setTimeout(r, 1));
}, {
  dependencies: {
    mouseAction,
  },
})();

const enableMouseUpEvent = (mouseAction: MouseAction): Promise<void> => ClientFunction(() => {
  // eslint-disable-next-line no-underscore-dangle,spellcheck/spell-checker
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

/**
 * Performs a drag operation on a row with MouseUpEvents temporarily disabled.
 * This is useful for autoscroll tests where we need to keep the row in drag state.
 *
 * @param t - TestController instance
 * @param element - Selector for the element to drag
 * @param options - drag options
 * @param options.offsetX - X-offset for the drag operation
 * @param options.offsetY - Y-offset for the drag operation
 * @param options.speed - speed of the drag operation (default is 0.1)
 */
export const dragWithDisabledMouseUp = async (
  t: TestController,
  element: Selector,
  {
    offsetX,
    offsetY,
    speed = 0.1,
  }: {
    offsetX: number;
    offsetY: number;
    speed?: number;
  },
): Promise<void> => {
  await MouseUpEvents.disable(MouseAction.dragToOffset);
  await t.drag(
    element,
    offsetX,
    offsetY,
    { speed },
  );
  await MouseUpEvents.enable(MouseAction.dragToOffset);
};
