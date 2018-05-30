
/**
* @name dxSankeyNodeItem
* @publicName NodeItem
*/
var NodeItem = {
    /**
    * @name dxSankeyNodeItemfields_title
    * @publicName title
    * @type string
    */
    title: undefined,
    /**
    * @name dxSankeyNodeItemfields_linksIn
    * @publicName linksIn
    * @type Array<Object>
    */
    linksIn: undefined,
    /**
    * @name dxSankeyNodeItemfields_linksOut
    * @publicName linksOut
    * @type Array<Object>
    */
    linksOut: undefined,
    /**
    * @name dxSankeyNodeItemmethods_hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyNodeItemmethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyNodeItemmethods_showtooltip
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
    * @name dxSankeyLinkItemfields_connection
    * @publicName connection
    * @type Object
    */
    connection: undefined,
    /**
    * @name dxSankeyLinkItemmethods_hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxSankeyLinkItemmethods_adjacentnodehover
    * @publicName adjacentNodeHover(state)
    * @param1 state:boolean
    */
    adjacentNodeHover: function () { },
    /**
    * @name dxSankeyLinkItemmethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxSankeyLinkItemmethods_isadjacentnodehovered
    * @publicName isAdjacentNodeHovered()
    * @return boolean
    */
    isAdjacentNodeHovered: function () { },
    /**
    * @name dxSankeyLinkItemmethods_showtooltip
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
    * @name dxSankeyItemsfields_nodes
    * @publicName nodes
    * @type Array<dxSankeyNodeItem>
    */
    nodes: undefined,
    /**
    * @name dxSankeyItemsfields_links
    * @publicName links
    * @type Array<dxSankeyLinksItem>
    */
    links: undefined
}