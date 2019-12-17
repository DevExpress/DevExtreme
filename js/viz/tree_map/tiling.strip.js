const _squarify = require('./tiling.squarified.base');

function accumulate(total, current, count) {
    return ((count - 1) * total + current) / count;
}

function strip(data) {
    return _squarify(data, accumulate, true);
}

require('./tiling').addAlgorithm('strip', strip);
module.exports = strip;
