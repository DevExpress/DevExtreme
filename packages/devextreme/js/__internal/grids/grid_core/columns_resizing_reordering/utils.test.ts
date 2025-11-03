import { describe, expect, it } from '@jest/globals';

import { getDraggingPanelBoundingRects } from './utils';

const getRandomPoint = (max: number) => Math.floor(Math.random() * max);

const getDraggingPanelMock = () => ({
  getBoundingRect: () => ({
    top: getRandomPoint(1080),
    bottom: getRandomPoint(1080),
    left: getRandomPoint(1920),
    right: getRandomPoint(1920),
  }),
} as any);

describe('getDraggingPanelBoundingRects', () => {
  it('returns equal amount of elements in tuple', () => {
    const draggingPanels = [
      getDraggingPanelMock(),
      getDraggingPanelMock(),
      getDraggingPanelMock(),
    ];
    const result = getDraggingPanelBoundingRects(draggingPanels);

    expect(result?.length).toBe(draggingPanels.length);
  });

  it('returns the same dragging panel objects', () => {
    const draggingPanels = [
      getDraggingPanelMock(),
      getDraggingPanelMock(),
      getDraggingPanelMock(),
    ];
    const result = getDraggingPanelBoundingRects(draggingPanels);

    expect(result).not.toBeNull();
    result?.forEach((draggingPanelBoundingRect, index) => {
      expect(draggingPanelBoundingRect.draggingPanel).toBe(draggingPanels[index]);
    });
  });

  it('returns filtered tuple without empty objects', () => {
    const draggingPanels = [
      getDraggingPanelMock(),
      undefined,
      getDraggingPanelMock(),
      null,
    ];
    const result = getDraggingPanelBoundingRects(draggingPanels);

    expect(result?.length).toBe(draggingPanels.filter(Boolean).length);
  });

  it('returns null if the result is empty array', () => {
    const draggingPanels = [undefined, null] as any[];
    const result = getDraggingPanelBoundingRects(draggingPanels);

    expect(result).toBeNull();
  });

  it('returns null if draggingPanels array is empty', () => {
    const draggingPanels = [] as any[];
    const result = getDraggingPanelBoundingRects(draggingPanels);

    expect(result).toBeNull();
  });

  it('returns null if draggingPanels is null or undefined', () => {
    expect(getDraggingPanelBoundingRects(undefined as any)).toBeNull();
    expect(getDraggingPanelBoundingRects(null as any)).toBeNull();
  });
});
