
/**
* @name dxFunnelItem
* @publicName Item
*/
var Item = {
    /**
    * @name dxFunnelItemfields_argument
    * @publicName argument
    * @type any
    */
    argument: undefined,
    /**
    * @name dxFunnelItemfields_data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxFunnelItemfields_percent
    * @publicName percent
    * @type number
    */
    percent: undefined,
    /**
    * @name dxFunnelItemfields_value
    * @publicName value
    * @type number
    */
    value: undefined,
    /**
    * @name dxFunnelItemmethods_select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: function () { },
    /**
    * @name dxFunnelItemmethods_hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxFunnelItemmethods_getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function () { },
    /**
    * @name dxFunnelItemmethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxFunnelItemmethods_isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function () { },

    /**
    * @name dxFunnelItemmethods_showtooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};
