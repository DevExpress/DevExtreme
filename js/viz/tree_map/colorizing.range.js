const _createColorCodeGetter = require('./colorizing').createColorCodeGetter;

function getPaletteIndex(value, items) {
    let start = 0;
    let end = items.length - 1;
    let index = -1;
    let middle;
    if(items[start] <= value && value <= items[end]) {
        if(value === items[end]) {
            index = end - 1;
        } else {
            while(end - start > 1) {
                middle = (start + end) >> 1;
                if(value < items[middle]) {
                    end = middle;
                } else {
                    start = middle;
                }
            }
            index = start;
        }
    }
    return index;
}

function rangeColorizer(options, themeManager) {
    const range = options.range || [];
    const palette = themeManager.createDiscretePalette(options.palette, range.length - 1);
    const getValue = _createColorCodeGetter(options);

    return function(node) {
        return palette.getColor(getPaletteIndex(getValue(node), range));
    };
}

require('./colorizing').addColorizer('range', rangeColorizer);
module.exports = rangeColorizer;
