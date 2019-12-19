var _max = Math.max,
    _round = Math.round,
    tiling = require('./tiling');

function compare(a, b) { return b.value - a.value; }

function getAspectRatio(value) {
    return _max(value, 1 / value);
}

function findAppropriateCollection(nodes, head, context) {
    var bestAspectRatio = Infinity,
        nextAspectRatio,
        sum = 0,
        nextSum,
        i,
        j,
        ii = nodes.length,
        coeff = context.areaToValue / context.staticSide,
        totalAspectRatio;

    for(i = head; i < ii;) {
        nextSum = sum + nodes[i].value;
        totalAspectRatio = context.staticSide / coeff / nextSum;
        nextAspectRatio = 0;
        for(j = head; j <= i; ++j) {
            nextAspectRatio = context.accumulate(nextAspectRatio, getAspectRatio(totalAspectRatio * nodes[j].value / nextSum), j - head + 1);
        }
        if(nextAspectRatio < bestAspectRatio) {
            bestAspectRatio = nextAspectRatio;
            sum = nextSum;
            ++i;
        } else {
            break;
        }
    }
    return { sum: sum, count: i - head, side: _round(coeff * sum) };
}

function getArea(rect) {
    return (rect[2] - rect[0]) * (rect[3] - rect[1]);
}

function doStep(nodes, head, context) {
    var sidesData = tiling.buildSidesData(context.rect, context.directions, context.staticSideIndex),
        area = getArea(context.rect),
        rowData = area > 0 ? findAppropriateCollection(nodes, head, {
            areaToValue: area / context.sum,
            accumulate: context.accumulate,
            staticSide: sidesData.staticSide
        }) : { sum: 1, side: sidesData.variedSide, count: nodes.length - head };

    tiling.calculateRectangles(nodes, head, context.rect, sidesData, rowData);
    context.sum -= rowData.sum;
    return head + rowData.count;
}

module.exports = function(data, accumulate, isFixedStaticSide) {
    var items = data.items,
        ii = items.length,
        i,
        context = {
            sum: data.sum,
            rect: data.rect,
            directions: data.directions,
            accumulate: accumulate
        };
    if(isFixedStaticSide) {
        context.staticSideIndex = tiling.getStaticSideIndex(context.rect);
    }
    items.sort(compare);
    for(i = 0; i < ii;) {
        i = doStep(items, i, context);
    }
};
