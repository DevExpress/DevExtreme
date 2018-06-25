
/**
* @name dxSankeyNode
* @publicName Node
*/
var NodeItem = {
    /**
    * @name dxSankeyNodefields.title
    * @type string
    */
    title: undefined,
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
    * @name dxSankeyNodemethods.showtTooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};

/**
* @name dxSankeyLink
* @publicName Link
*/
var Link = {
    /**
    * @name dxSankeyLinkfields.connection
    * @type Object
    */
    connection: undefined,
    /**
    * @name dxSankeyLinkmethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyLinkmethods.adjacentNodeHover
    * @publicName adjacentNodeHover(state)
    * @param1 state:boolean
    */
    adjacentNodeHover: function () { },
    /**
    * @name dxSankeyLinkmethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyLinkmethods.isAdjacentNodeHovered
    * @publicName isAdjacentNodeHovered()
    * @return boolean
    */
    isAdjacentNodeHovered: function () { },
    /**
    * @name dxSankeyLinkmethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};

/**
* @name dxSankeyItems
* @publicName SankeyItems
*/
var SankeyItems = {
    /**
    * @name dxSankeyItemsfields.nodes
    * @type Array<dxSankeyNode>
    */
    nodes: undefined,
    /**
    * @name dxSankeyItemsfields.links
    * @type Array<dxSankeyLinks>
    */
    links: undefined
}