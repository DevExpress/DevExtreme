import type { TilingData } from '@ts/viz/tree_map/tiling';
import { addAlgorithm, buildSidesData, calculateRectangles } from '@ts/viz/tree_map/tiling';

function sliceAndDice(data: TilingData): void {
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
