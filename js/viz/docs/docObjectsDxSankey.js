
/**
* @name dxSankeyNode
* @publicName Node
*/
var Node = {
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
var Link = {
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
var dxSankeyConnectionInfoObject = {
    source: undefined,
    target: undefined,
    weight: undefined
}
