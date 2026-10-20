import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { LayoutTargetOptions } from '@ts/viz/core/layout';
import Layout from '@ts/viz/core/layout';

const CANVAS = [0, 0, 400, 100];
const MIN_SIZE = [80, 80];
const LEGEND_SIZE = [220, 15];

interface Target {
  layoutOptions: () => LayoutTargetOptions;
  measure: jest.Mock<(size: number[]) => number[]>;
  move: jest.Mock<(rect: number[], fitRect: number[]) => void>;
  freeSpace: jest.Mock<() => void>;
}

function createTarget(position: string): Target {
  return {
    layoutOptions: () => ({
      side: 'vertical',
      verticalAlignment: 'top',
      horizontalAlignment: 'center',
      position,
    }),
    measure: jest.fn(() => LEGEND_SIZE),
    move: jest.fn(),
    freeSpace: jest.fn(),
  };
}

interface LayoutResult {
  rect: number[];
  targetRect: number[];
  size: number[];
}

function layOut(target: Target, shortage: number[]): LayoutResult {
  const layout = new Layout();
  layout.add(target);
  const rect = layout.forward(CANVAS.slice(), MIN_SIZE);
  const targetRect = rect.slice();
  const size = layout.backward(targetRect, rect.slice(), shortage.slice());
  return { rect, targetRect, size };
}

describe('an outside item', () => {
  it('takes its space in forward and gives it back when the content lacks space', () => {
    const target = createTarget('outside');

    const { rect, targetRect, size } = layOut(target, [0, 30]);

    expect(rect).toEqual([0, 15, 400, 100]);
    expect(target.freeSpace).toHaveBeenCalledTimes(1);
    expect(target.move).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([0, 15]);
  });
});

describe('an inside item', () => {
  it('takes no space in forward', () => {
    const target = createTarget('inside');

    const { rect } = layOut(target, [0, 0]);

    expect(rect).toEqual(CANVAS);
    expect(target.move).toHaveBeenCalledTimes(1);
    expect(target.freeSpace).not.toHaveBeenCalled();
  });

  it('is hidden when the content lacks space, and the content rect stays inside the canvas', () => {
    const target = createTarget('inside');

    const { targetRect, size } = layOut(target, [0, 30]);

    expect(target.freeSpace).toHaveBeenCalledTimes(1);
    expect(target.move).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([0, 30]);
  });

  it('stays in place when the shortage is on the other side', () => {
    const target = createTarget('inside');

    const { targetRect, size } = layOut(target, [30, 0]);

    expect(target.move).toHaveBeenCalledTimes(1);
    expect(target.freeSpace).not.toHaveBeenCalled();
    expect(targetRect).toEqual(CANVAS);
    expect(size).toEqual([30, 0]);
  });
});
