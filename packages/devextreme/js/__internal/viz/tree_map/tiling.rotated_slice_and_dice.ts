import type { TilingData } from '@ts/viz/tree_map/tiling';
import { addAlgorithm, getAlgorithm } from '@ts/viz/tree_map/tiling';

const sliceAndDiceAlgorithm = getAlgorithm('sliceanddice');

function rotatedSliceAndDice(this: unknown, data: TilingData): void {
  data.isRotated = !data.isRotated;
  return sliceAndDiceAlgorithm.call(this, data);
}

addAlgorithm('rotatedsliceanddice', rotatedSliceAndDice);
