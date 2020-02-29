const tiling = require('./tiling');

function sliceAndDice(data) {
    const items = data.items;
    const sidesData = tiling.buildSidesData(data.rect, data.directions, data.isRotated ? 1 : 0);

    tiling.calculateRectangles(items, 0, data.rect, sidesData, {
        sum: data.sum,
        count: items.length,
        side: sidesData.variedSide
    });
}

tiling.addAlgorithm('sliceanddice', sliceAndDice);
module.exports = sliceAndDice;
