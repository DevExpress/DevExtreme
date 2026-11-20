/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */

import type { RowData, TilingData, TilingItem } from '@ts/viz/tree_map/tiling';
import { buildSidesData, calculateRectangles, getStaticSideIndex } from '@ts/viz/tree_map/tiling';

type Accumulate = (total: number, current: number, count: number) => number;

interface CollectionContext {
  areaToValue: number;
  accumulate: Accumulate;
  staticSide: number;
}

interface StepContext {
  sum: number;
  rect: number[];
  directions: number[];
  accumulate: Accumulate;
  staticSideIndex?: 0 | 1;
}

const _max = Math.max;
const _round = Math.round;

function compare(a: TilingItem, b: TilingItem): number { return b.value - a.value; }

function getAspectRatio(value: number): number {
  return _max(value, 1 / value);
}

function findAppropriateCollection(
  nodes: TilingItem[],
  head: number,
  context: CollectionContext,
): RowData {
  let bestAspectRatio = Infinity;
  let nextAspectRatio;
  let sum = 0;
  let nextSum;
  let i;
  let j;
  const ii = nodes.length;
  const coeff = context.areaToValue / context.staticSide;
  let totalAspectRatio;

  for (i = head; i < ii;) {
    nextSum = sum + nodes[i].value;
    totalAspectRatio = context.staticSide / coeff / nextSum;
    nextAspectRatio = 0;
    for (j = head; j <= i; j += 1) {
      nextAspectRatio = context.accumulate(
        nextAspectRatio,
        getAspectRatio((totalAspectRatio * nodes[j].value) / nextSum),
        j - head + 1,
      );
    }
    if (nextAspectRatio < bestAspectRatio) {
      bestAspectRatio = nextAspectRatio;
      sum = nextSum;
      i += 1;
    } else {
      break;
    }
  }
  return { sum, count: i - head, side: _round(coeff * sum) };
}

function getArea(rect: number[]): number {
  return (rect[2] - rect[0]) * (rect[3] - rect[1]);
}

function doStep(nodes: TilingItem[], head: number, context: StepContext): number {
  const sidesData = buildSidesData(context.rect, context.directions, context.staticSideIndex);
  const area = getArea(context.rect);
  const rowData = area > 0 ? findAppropriateCollection(nodes, head, {
    areaToValue: area / context.sum,
    accumulate: context.accumulate,
    staticSide: sidesData.staticSide,
  }) : { sum: 1, side: sidesData.variedSide, count: nodes.length - head };

  calculateRectangles(nodes, head, context.rect, sidesData, rowData);
  context.sum -= rowData.sum;
  return head + rowData.count;
}

export default function (
  data: TilingData,
  accumulate: Accumulate,
  isFixedStaticSide: boolean,
): void {
  const { items } = data;
  const ii = items.length;
  let i;
  const context: StepContext = {
    sum: data.sum,
    rect: data.rect,
    directions: data.directions,
    accumulate,
  };
  if (isFixedStaticSide) {
    context.staticSideIndex = getStaticSideIndex(context.rect);
  }
  items.sort(compare);
  for (i = 0; i < ii;) {
    i = doStep(items, i, context);
  }
}
