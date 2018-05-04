
/**
* @name dxFunnelItem
* @publicName Item
*/
var Item = {
    /**
    * @name dxFunnelItemfields.argument
    * @publicName argument
    * @type string|Date|number
    */
    argument: undefined,
    /**
    * @name dxFunnelItemfields.data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxFunnelItemfields.percent
    * @publicName percent
    * @type number
    */
    percent: undefined,
    /**
    * @name dxFunnelItemfields.value
    * @publicName value
    * @type number
    */
    value: undefined,
    /**
    * @name dxFunnelItemmethods.select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: function () { },
    /**
    * @name dxFunnelItemmethods.hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxFunnelItemmethods.getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function () { },
    /**
    * @name dxFunnelItemmethods.ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxFunnelItemmethods.isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function () { },

    /**
    * @name dxFunnelItemmethods.showtooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};
