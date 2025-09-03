/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { addAlgorithm } from '@ts/viz/tree_map/tiling';
import _squarify from '@ts/viz/tree_map/tiling.squarified.base';

const _max = Math.max;

function accumulate(total, current) {
  return _max(total, current);
}

function squarified(data) {
  return _squarify(data, accumulate, false);
}

addAlgorithm('squarified', squarified);
export default squarified;
