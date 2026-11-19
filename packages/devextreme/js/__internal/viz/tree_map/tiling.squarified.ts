/* eslint-disable @typescript-eslint/naming-convention */

import type { TilingData } from '@ts/viz/tree_map/tiling';
import { addAlgorithm } from '@ts/viz/tree_map/tiling';
import _squarify from '@ts/viz/tree_map/tiling.squarified.base';

const _max = Math.max;

function accumulate(total: number, current: number): number {
  return _max(total, current);
}

function squarified(data: TilingData): void {
  return _squarify(data, accumulate, false);
}

addAlgorithm('squarified', squarified);
export default squarified;
