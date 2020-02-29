
/**
* @name dxSankeyNode
* @publicName Node
*/
const Node = {
    title: undefined,
    label: undefined,
    linksIn: undefined,
    linksOut: undefined,
    hover: function () { },
    isHovered: function () { },
    showTooltip: function () { },
    hideTooltip: function () { }
};

/**
* @name dxSankeyLink
* @publicName Link
*/
const Link = {
    connection: undefined,
    hover: function () { },
    isHovered: function () { },
    showTooltip: function () { },
    hideTooltip: function () { }
};

/**
* @name dxSankeyConnectionInfoObject
* @publicName connection
* @type object
*/
const dxSankeyConnectionInfoObject = {
    source: undefined,
    target: undefined,
    weight: undefined
};
