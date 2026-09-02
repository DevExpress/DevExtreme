import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';

import { keyboard } from '../short';

describe('keyboard processor registry disposal (T1332943)', () => {
  const registered: string[] = [];

  const on = (element: Element, focusTarget: Element | null = null): string => {
    const id = keyboard.on(element, focusTarget, () => {});
    registered.push(id);
    return id;
  };

  afterEach(() => {
    registered.forEach((id) => keyboard.off(id));
    registered.length = 0;
    jest.restoreAllMocks();
  });

  it('disposes a processor whose element is a descendant of the removed subtree', () => {
    const root = document.createElement('div');
    const child = document.createElement('input');
    root.appendChild(child);

    const id = on(child);
    expect(keyboard._getProcessor(id)).toBeDefined();

    keyboard.disposeProcessorsForSubtree(root);

    expect(keyboard._getProcessor(id)).toBeUndefined();
  });

  it('disposes a processor registered on the root element itself', () => {
    const root = document.createElement('div');

    const id = on(root);

    keyboard.disposeProcessorsForSubtree(root);

    expect(keyboard._getProcessor(id)).toBeUndefined();
  });

  it('disposes when only the focusTarget is inside the removed subtree', () => {
    const root = document.createElement('div');
    const focusTarget = document.createElement('input');
    root.appendChild(focusTarget);
    const elementElsewhere = document.createElement('input');

    const id = on(elementElsewhere, focusTarget);

    keyboard.disposeProcessorsForSubtree(root);

    expect(keyboard._getProcessor(id)).toBeUndefined();
  });

  it('leaves processors outside the removed subtree registered (no over-disposal)', () => {
    const root = document.createElement('div');
    const elsewhere = document.createElement('input');

    const insideId = on(root);
    const outsideId = on(elsewhere);

    keyboard.disposeProcessorsForSubtree(root);

    expect(keyboard._getProcessor(insideId)).toBeUndefined();
    expect(keyboard._getProcessor(outsideId)).toBeDefined();
  });

  it('does not scan the whole registry when disposing a subtree', () => {
    const disposeOneSubtreeAmong = (unrelatedCount: number): number => {
      for (let i = 0; i < unrelatedCount; i += 1) {
        on(document.createElement('input'));
      }

      const root = document.createElement('div');
      const child = document.createElement('input');
      root.appendChild(child);
      on(child);

      const containsSpy = jest.spyOn(Element.prototype, 'contains');
      keyboard.disposeProcessorsForSubtree(root);
      const calls = containsSpy.mock.calls.length;
      containsSpy.mockRestore();

      return calls;
    };

    const few = disposeOneSubtreeAmong(10);
    const many = disposeOneSubtreeAmong(500);

    expect(many).toBe(few);
  });
});
