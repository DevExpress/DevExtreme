
/**
* @name dxfunnelItem
* @publicName Item
*/
var Item = {
    /**
    * @name dxfunnelitemfields_data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxfunnelitemfields_id
    * @publicName id
    * @type number
    */
    id: undefined,
    /**
    * @name dxfunnelitemfields_percent
    * @publicName percent
    * @type number
    */
    percent: undefined,
    /**
    * @name dxfunnelitemmethods_select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: function () { },
    /**
    * @name dxfunnelitemmethods_hover
    * @publicName hover(state)
    * @param1 state:boolean
    */
    hover: function () { },
    /**
    * @name dxfunnelitemmethods_getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function () { },
    /**
    * @name dxfunnelitemmethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function () { },
    /**
    * @name dxfunnelitemmethods_isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function () { },

    /**
    * @name dxfunnelitemmethods_showtooltip
    * @publicName showTooltip()
    */
    showTooltip: function(){ }
};
