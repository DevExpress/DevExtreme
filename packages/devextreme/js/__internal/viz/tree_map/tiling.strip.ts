import type { TilingData } from '@ts/viz/tree_map/tiling';
import { addAlgorithm } from '@ts/viz/tree_map/tiling';
import _squarify from '@ts/viz/tree_map/tiling.squarified.base';

function accumulate(total: number, current: number, count: number): number {
  return ((count - 1) * total + current) / count;
}

function strip(data: TilingData): void {
  return _squarify(data, accumulate, true);
}

addAlgorithm('strip', strip);
export default strip;
