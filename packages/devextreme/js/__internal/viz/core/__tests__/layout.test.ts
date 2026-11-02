import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { LayoutTarget, LayoutTargetOptions } from '@ts/viz/core/layout';
import Layout from '@ts/viz/core/layout';

type Target = { [K in keyof LayoutTarget]: jest.Mock<LayoutTarget[K]> };

interface LayoutResult {
  rect: number[];
  targetRect: number[];
  size: number[];
}

const CANVAS = [0, 0, 400, 100];
const TALL_CANVAS = [0, 0, 400, 150];
const MIN_SIZE = [80, 80];
const TOP_CENTER: LayoutTargetOptions = {
  side: 'vertical',
  verticalAlignment: 'top',
  horizontalAlignment: 'center',
};

function createTarget(options: LayoutTargetOptions, size: number[]): Target {
  return {
    layoutOptions: jest.fn<LayoutTarget['layoutOptions']>(() => options),
    measure: jest.fn<LayoutTarget['measure']>(() => size),
    move: jest.fn<LayoutTarget['move']>(),
    freeSpace: jest.fn<LayoutTarget['freeSpace']>(),
  };
}

function createLegend(position: string): Target {
  return createTarget({ ...TOP_CENTER, position, priority: 1 }, [220, 15]);
}

function createTitle(): Target {
  return createTarget(TOP_CENTER, [200, 20]);
}

function layOut(targets: Target[], canvas: number[], shortage: number[]): LayoutResult {
  const layout = new Layout();
  targets.forEach((target) => layout.add(target));
  const rect = layout.forward(canvas.slice(), MIN_SIZE);
  const targetRect = rect.slice();
  const size = layout.backward(targetRect, rect.slice(), shortage.slice());
  return { rect, targetRect, size };
}

describe('an outside item', () => {
  it('takes its space in forward and gives it back when the content lacks space', () => {
    const legend = createLegend('outside');

    const { rect, targetRect, size } = layOut([legend], CANVAS, [0, 30]);

    expect(rect).toEqual([0, 15, 400, 100]);
    expect(legend.freeSpace).toHaveBeenCalledTimes(1);
    expect(legend.move).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([0, 15]);
  });
});

describe('an inside item', () => {
  it('takes no space in forward', () => {
    const legend = createLegend('inside');

    const { rect } = layOut([legend], CANVAS, [0, 0]);

    expect(rect).toEqual(CANVAS);
    expect(legend.move).toHaveBeenCalledTimes(1);
    expect(legend.freeSpace).not.toHaveBeenCalled();
  });

  it('is hidden when the content lacks space, and the content rect stays inside the canvas', () => {
    const legend = createLegend('inside');

    const { targetRect, size } = layOut([legend], CANVAS, [0, 30]);

    expect(legend.freeSpace).toHaveBeenCalledTimes(1);
    expect(legend.move).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([0, 30]);
  });

  it('stays in place when the shortage is on the other side', () => {
    const legend = createLegend('inside');

    const { targetRect, size } = layOut([legend], CANVAS, [30, 0]);

    expect(legend.move).toHaveBeenCalledTimes(1);
    expect(legend.freeSpace).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([30, 0]);
  });

  it('leaves the whole shortage to the outside item next to it', () => {
    const legend = createLegend('inside');
    const title = createTitle();

    const { rect, targetRect, size } = layOut([legend, title], TALL_CANVAS, [0, 10]);

    expect(rect).toEqual([0, 20, 400, 150]);
    expect(legend.freeSpace).toHaveBeenCalledTimes(1);
    expect(title.freeSpace).toHaveBeenCalledTimes(1);
    expect(legend.move).not.toHaveBeenCalled();
    expect(title.move).not.toHaveBeenCalled();
    expect(targetRect).toEqual(TALL_CANVAS);
    expect(size).toEqual([0, -10]);
  });
});
