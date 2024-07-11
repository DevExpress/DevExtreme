"use strict";

exports.default = void 0;
var _tiling = require("./tiling");
function sliceAndDice(data) {
  const items = data.items;
  const sidesData = (0, _tiling.buildSidesData)(data.rect, data.directions, data.isRotated ? 1 : 0);
  (0, _tiling.calculateRectangles)(items, 0, data.rect, sidesData, {
    sum: data.sum,
    count: items.length,
    side: sidesData.variedSide
  });
}
(0, _tiling.addAlgorithm)('sliceanddice', sliceAndDice);
var _default = exports.default = sliceAndDice;
module.exports = exports.default;
module.exports.default = exports.default;