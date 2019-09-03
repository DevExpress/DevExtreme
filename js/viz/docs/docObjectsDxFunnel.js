
/**
* @name dxFunnelItem
* @publicName Item
*/
var Item = {
    /**
    * @name dxFunnelItemFields.argument
    * @type string|Date|number
    */
    argument: undefined,
    /**
    * @name dxFunnelItemFields.data
    * @type object
    */
    data: undefined,
    /**
    * @name dxFunnelItemFields.percent
    * @type number
    */
    percent: undefined,
    /**
    * @name dxFunnelItemFields.value
    * @type number
    */
    value: undefined,
    /**
    * @name dxFunnelItemMethods.select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: function () { },
    /**
    * @name dxFunnelItemMethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxFunnelItemMethods.getColor
    * @publicName getColor()
    * @return string
    */
    getColor: function () { },
    /**
    * @name dxFunnelItemMethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxFunnelItemMethods.isSelected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function () { },

    /**
    * @name dxFunnelItemMethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};

/**
* @name FunnelLegendItem
* @type object
* @inherits BaseLegendItem
*/
var legendItem = {
    /**
    * @name FunnelLegendItem.item
    * @type dxFunnelItem
    */
    item: undefined
};

/**
* @name FunnelTooltipInfo
* @type object
* @inherits BaseTooltipInfo
*/
var FunnelTooltipInfo = {
    /**
    * @name FunnelTooltipInfo.item
    * @type dxFunnelItem
    */
    item: undefined,
    /**
    * @name FunnelTooltipInfo.percent
    * @type number
    */
    percent: 0,
    /**
    * @name FunnelTooltipInfo.percentText
    * @type string
    */
    percentText: "text"
};
