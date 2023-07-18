const _max = Math.max;
import _squarify from './tiling.squarified.base';
import { addAlgorithm } from './tiling';

function accumulate(total, current) {
    return _max(total, current);
}

function squarified(data) {
    return _squarify(data, accumulate, false);
}

addAlgorithm('squarified', squarified);
export default squarified;
