
/**
* @name dxSankeyNodeItem
* @publicName NodeItem
*/
var NodeItem = {
    /**
    * @name dxSankeyNodeItemfields.title
    * @type string
    */
    title: undefined,
    /**
    * @name dxSankeyNodeItemfields.linksIn
    * @type Array<Object>
    */
    linksIn: undefined,
    /**
    * @name dxSankeyNodeItemfields.linksOut
    * @type Array<Object>
    */
    linksOut: undefined,
    /**
    * @name dxSankeyNodeItemmethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyNodeItemmethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyNodeItemmethods.showtTooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};

/**
* @name dxSankeyLinkItem
* @publicName LinkItem
*/
var LinkItem = {
    /**
    * @name dxSankeyLinkItemfields.connection
    * @type Object
    */
    connection: undefined,
    /**
    * @name dxSankeyLinkItemmethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyLinkItemmethods.adjacentNodeHover
    * @publicName adjacentNodeHover(state)
    * @param1 state:boolean
    */
    adjacentNodeHover: function () { },
    /**
    * @name dxSankeyLinkItemmethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyLinkItemmethods.isAdjacentNodeHovered
    * @publicName isAdjacentNodeHovered()
    * @return boolean
    */
    isAdjacentNodeHovered: function () { },
    /**
    * @name dxSankeyLinkItemmethods.showTooltip
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
    * @type Array<dxSankeyNodeItem>
    */
    nodes: undefined,
    /**
    * @name dxSankeyItemsfields.links
    * @type Array<dxSankeyLinksItem>
    */
    links: undefined
}