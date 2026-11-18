/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { addAlgorithm, buildSidesData, calculateRectangles } from '@ts/viz/tree_map/tiling';

function sliceAndDice(data): void {
  const { items } = data;
  const sidesData = buildSidesData(data.rect, data.directions, data.isRotated ? 1 : 0);

  calculateRectangles(items, 0, data.rect, sidesData, {
    sum: data.sum,
    count: items.length,
    side: sidesData.variedSide,
  });
}

addAlgorithm('sliceanddice', sliceAndDice);
export default sliceAndDice;
