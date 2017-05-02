"use strict";

function discreteColorizer(options, themeManager, root) {
    var palette = themeManager.createPalette(options.palette, { useHighlight: true });

    return (options.colorizeGroups ? discreteGroupColorizer : discreteLeafColorizer)(palette, root);
}

function generateColors(palette, colors, count) {
    var i;

    for(i = colors.length; i < count; ++i) {
        colors.push(palette.getNextColor());
    }
}

function discreteLeafColorizer(palette) {
    var colors = [];

    generateColors(palette, colors, 4);
    return function(node) {
        if(node.index >= colors.length) {
            generateColors(palette, colors, colors.length * 2);
        }
        return colors[node.index];
    };
}

function prepareDiscreteGroupColors(palette, root) {
    var colors = {},
        allNodes = root.nodes.slice(),
        i,
        ii = allNodes.length,
        node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            allNodes = allNodes.concat(node.nodes);
            ii = allNodes.length;
        } else if(!colors[node.parent._id]) {
            colors[node.parent._id] = palette.getNextColor();
        }
    }
    return colors;
}

function discreteGroupColorizer(palette, root) {
    var colors = prepareDiscreteGroupColors(palette, root);

    return function(node) {
        return colors[node._id];
    };
}

require("./colorizing").addColorizer("discrete", discreteColorizer);
module.exports = discreteColorizer;
