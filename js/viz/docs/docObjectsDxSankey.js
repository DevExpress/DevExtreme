
/**
* @name dxSankeyNode
* @publicName Node
*/
const Node = {
    /**
    * @name dxSankeyNodefields.title
    * @type string
    * @deprecated
    */
    title: undefined,
    /**
    * @name dxSankeyNodefields.label
    * @type string
    */
    label: undefined,
    /**
    * @name dxSankeyNodefields.linksIn
    * @type Array<Object>
    */
    linksIn: undefined,
    /**
    * @name dxSankeyNodefields.linksOut
    * @type Array<Object>
    */
    linksOut: undefined,
    /**
    * @name dxSankeyNodemethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyNodemethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyNodemethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function () { },
    /**
    * @name dxSankeyNodemethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function () { }
};

/**
* @name dxSankeyLink
* @publicName Link
*/
const Link = {
    /**
    * @name dxSankeyLinkfields.connection
    * @type dxSankeyConnectionInfoObject
    */
    connection: undefined,
    /**
    * @name dxSankeyLinkmethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyLinkmethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyLinkmethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function () { },
    /**
    * @name dxSankeyLinkmethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function () { }
};

/**
* @name dxSankeyConnectionInfoObject
* @publicName connection
* @type object
*/
const dxSankeyConnectionInfoObject = {
    /**
    * @name dxSankeyConnectionInfoObject.source
    * @type string
    */
    source: undefined,
    /**
    * @name dxSankeyConnectionInfoObject.target
    * @type string
    */
    target: undefined,
    /**
    * @name dxSankeyConnectionInfoObject.weight
    * @type Number
    */
    weight: undefined
};
