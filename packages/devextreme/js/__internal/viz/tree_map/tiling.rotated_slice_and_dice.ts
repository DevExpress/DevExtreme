import { getAlgorithm, addAlgorithm } from './tiling';
const sliceAndDiceAlgorithm = getAlgorithm('sliceanddice');

function rotatedSliceAndDice(data) {
    data.isRotated = !data.isRotated;
    return sliceAndDiceAlgorithm.call(this, data);
}

addAlgorithm('rotatedsliceanddice', rotatedSliceAndDice);
