import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import { removeEvent } from '@js/common/core/events/remove';
import eventsEngine from '@ts/events/core/events_engine';

import { name as clickEventName } from '../click';

const noop = (): void => {};

const getRemoveHandlersCount = (element: Element): number => {
  const elementData = eventsEngine.elementDataMap?.get(element);

  return elementData?.[removeEvent]?.handleObjects.length ?? 0;
};

describe('dxclick nodes disposing (5025)', () => {
  const clickableNodes: HTMLElement[] = [];

  const createClickableNode = (): HTMLElement => {
    const node = document.createElement('div');

    document.body.appendChild(node);
    eventsEngine.on(node, clickEventName, noop);
    clickableNodes.push(node);

    return node;
  };

  afterEach(() => {
    clickableNodes.forEach((node) => {
      eventsEngine.off(node);
      node.remove();
    });
    clickableNodes.length = 0;
  });

  it('keeps a foreign dxremove handler on the previously clicked node', () => {
    const clicked = createClickableNode();
    const other = createClickableNode();

    clicked.click();

    const foreignHandler = jest.fn();
    eventsEngine.on(clicked, removeEvent, foreignHandler);

    other.click();
    eventsEngine.triggerHandler(clicked, { type: removeEvent });

    expect(foreignHandler).toHaveBeenCalledTimes(1);
  });

  it('keeps a foreign dxremove handler when the same node is clicked twice', () => {
    const clicked = createClickableNode();

    clicked.click();
    expect(getRemoveHandlersCount(clicked)).toBe(1);

    const foreignHandler = jest.fn();
    eventsEngine.on(clicked, removeEvent, foreignHandler);

    clicked.click();
    expect(getRemoveHandlersCount(clicked)).toBe(2);

    eventsEngine.triggerHandler(clicked, { type: removeEvent });

    expect(foreignHandler).toHaveBeenCalledTimes(1);
  });

  it('removes only its own dxremove handler from the previously clicked node', () => {
    const clicked = createClickableNode();
    const other = createClickableNode();

    clicked.click();
    expect(getRemoveHandlersCount(clicked)).toBe(1);

    eventsEngine.on(clicked, removeEvent, noop);
    expect(getRemoveHandlersCount(clicked)).toBe(2);

    other.click();

    expect(getRemoveHandlersCount(clicked)).toBe(1);
  });
});
