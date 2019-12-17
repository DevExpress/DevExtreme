var tiling = require('./tiling'),
    sliceAndDiceAlgorithm = tiling.getAlgorithm('sliceanddice');

function rotatedSliceAndDice(data) {
    data.isRotated = !data.isRotated;
    return sliceAndDiceAlgorithm.call(this, data);
}

tiling.addAlgorithm('rotatedsliceanddice', rotatedSliceAndDice);
