/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { addAlgorithm } from '@ts/viz/tree_map/tiling';
import _squarify from '@ts/viz/tree_map/tiling.squarified.base';

function accumulate(total, current, count) {
  return ((count - 1) * total + current) / count;
}

function strip(data) {
  return _squarify(data, accumulate, true);
}

addAlgorithm('strip', strip);
export default strip;
