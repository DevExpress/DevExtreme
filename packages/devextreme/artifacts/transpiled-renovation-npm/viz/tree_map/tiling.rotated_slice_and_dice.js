"use strict";

var _tiling = require("./tiling");
const sliceAndDiceAlgorithm = (0, _tiling.getAlgorithm)('sliceanddice');
function rotatedSliceAndDice(data) {
  data.isRotated = !data.isRotated;
  return sliceAndDiceAlgorithm.call(this, data);
}
(0, _tiling.addAlgorithm)('rotatedsliceanddice', rotatedSliceAndDice);