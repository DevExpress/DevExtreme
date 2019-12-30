function discreteColorizer(options, themeManager, root) {
    const palette = themeManager.createPalette(options.palette, {
        useHighlight: true,
        extensionMode: options.paletteExtensionMode,
        count: options.colorizeGroups ? getNodesCount(root) : getLeafsCount(root)
    });

    return (options.colorizeGroups ? discreteGroupColorizer : discreteLeafColorizer)(palette, root);
}

function getLeafsCount(root) {
    const allNodes = root.nodes.slice();
    let i;
    const ii = allNodes.length;
    let count = 0;
    let node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            count = Math.max(count, getLeafsCount(node));
        } else {
            count += 1;
        }
    }

    return count;
}

function discreteLeafColorizer(palette) {
    const colors = palette.generateColors();

    return function(node) {
        return colors[node.index];
    };
}

function getNodesCount(root) {
    const allNodes = root.nodes.slice();
    let i;
    const ii = allNodes.length;
    let count = 0;
    let node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            count += getNodesCount(node) + 1;
        }
    }

    return count;
}

function prepareDiscreteGroupColors(palette, root) {
    const colors = {};
    let allNodes = root.nodes.slice();
    let i;
    let ii = allNodes.length;
    let node;

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
    const colors = prepareDiscreteGroupColors(palette, root);

    return function(node) {
        return colors[node._id];
    };
}

require('./colorizing').addColorizer('discrete', discreteColorizer);
module.exports = discreteColorizer;
