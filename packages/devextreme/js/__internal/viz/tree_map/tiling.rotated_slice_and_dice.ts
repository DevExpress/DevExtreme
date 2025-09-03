/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { addAlgorithm, getAlgorithm } from '@ts/viz/tree_map/tiling';

const sliceAndDiceAlgorithm = getAlgorithm('sliceanddice');

function rotatedSliceAndDice(data) {
  data.isRotated = !data.isRotated;
  return sliceAndDiceAlgorithm.call(this, data);
}

addAlgorithm('rotatedsliceanddice', rotatedSliceAndDice);
