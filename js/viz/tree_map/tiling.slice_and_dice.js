import { buildSidesData, calculateRectangles, addAlgorithm } from './tiling';

function sliceAndDice(data) {
    const items = data.items;
    const sidesData = buildSidesData(data.rect, data.directions, data.isRotated ? 1 : 0);

    calculateRectangles(items, 0, data.rect, sidesData, {
        sum: data.sum,
        count: items.length,
        side: sidesData.variedSide
    });
}

addAlgorithm('sliceanddice', sliceAndDice);
export default sliceAndDice;
