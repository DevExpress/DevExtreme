import _squarify from './tiling.squarified.base';
import { addAlgorithm } from './tiling';

function accumulate(total, current, count) {
    return ((count - 1) * total + current) / count;
}

function strip(data) {
    return _squarify(data, accumulate, true);
}

addAlgorithm('strip', strip);
export default strip;
