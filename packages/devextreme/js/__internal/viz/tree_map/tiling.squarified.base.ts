/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */

import { buildSidesData, calculateRectangles, getStaticSideIndex } from '@ts/viz/tree_map/tiling';

const _max = Math.max;
const _round = Math.round;

function compare(a, b) { return b.value - a.value; }

function getAspectRatio(value) {
  return _max(value, 1 / value);
}

function findAppropriateCollection(nodes, head, context) {
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
    for (j = head; j <= i; ++j) {
      nextAspectRatio = context.accumulate(nextAspectRatio, getAspectRatio(totalAspectRatio * nodes[j].value / nextSum), j - head + 1);
    }
    if (nextAspectRatio < bestAspectRatio) {
      bestAspectRatio = nextAspectRatio;
      sum = nextSum;
      ++i;
    } else {
      break;
    }
  }
  return { sum, count: i - head, side: _round(coeff * sum) };
}

function getArea(rect) {
  return (rect[2] - rect[0]) * (rect[3] - rect[1]);
}

function doStep(nodes, head, context) {
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

export default function (data, accumulate, isFixedStaticSide) {
  const items = data.items;
  const ii = items.length;
  let i;
  const context = {
    sum: data.sum,
    rect: data.rect,
    directions: data.directions,
    accumulate,
  };
  if (isFixedStaticSide) {
    // @ts-expect-error
    context.staticSideIndex = getStaticSideIndex(context.rect);
  }
  items.sort(compare);
  for (i = 0; i < ii;) {
    i = doStep(items, i, context);
  }
}
