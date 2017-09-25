/**
* @name baseSeriesObject
* @publicName Series
* @type object
*/
var BaseBaseSeries = {
    /**
    * @name baseSeriesObjectFields_fullstate
    * @publicName fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name baseSeriesObjectmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name baseSeriesObjectmethods_deselectpoint
    * @publicName deselectPoint(point)
    * @param1 point:basePointObject
    */
    deselectPoint: function() { },
    /**
    * @name baseSeriesObjectmethods_getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name baseSeriesObjectmethods_getallpoints
    * @publicName getAllPoints()
    * @return Array<basePointObject>
    */
    getAllPoints: function() { },
    /**
    * @name baseSeriesObjectmethods_getpointsbyarg
    * @publicName getPointsByArg(pointArg)
    * @param1 pointArg:number|string|date
    * @return Array<basePointObject>
    */
    getPointsByArg: function() { },
    /**
    * @name baseSeriesObjectmethods_getpointbypos
    * @publicName getPointByPos(positionIndex)
    * @param1 positionIndex:number
    * @return object
    */
    getPointByPos: function() { },
    /**
   * @name baseSeriesObjectmethods_getvisiblepoints
   * @publicName getVisiblePoints()
   * @return Array<basePointObject>
   */
    getVisiblePoints: function() { },
    /**
    * @name baseSeriesObjectmethods_select
    * @publicName select()
    */
    select: function() { },
    /**
    * @name baseSeriesObjectmethods_selectpoint
    * @publicName selectPoint(point)
    * @param1 point:basePointObject
    */
    selectPoint: function () { },
    /**
    * @name baseSeriesObjectmethods_hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name baseSeriesObjectmethods_clearHover
    * @publicName clearHover()
    */
    clearHover: function () { },
    /**
    * @name baseSeriesObjectmethods_isSelected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function() { },
    /**
    * @name baseSeriesObjectmethods_isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function() { },
    /**
   * @name baseSeriesObjectmethods_isvisible
   * @publicName isVisible()
   * @return boolean
   */
    isVisible: function() { },
    /**
    * @name baseSeriesObjectFields_type
    * @publicName type
    * @type string
    */
    type: null,
    /**
    * @name baseSeriesObjectFields_name
    * @publicName name
    * @type any
    */
    name: null,
    /**
    * @name baseSeriesObjectFields_tag
    * @publicName tag
    * @type any
    */
    tag: null,
    /**
   * @name baseSeriesObjectmethods_show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name baseSeriesObjectmethods_hide
  * @publicName hide()
  */
    hide: function() { }
}

/**
* @name basePointObject
* @publicName Point
* @type object
*/
var BasePoint = {
    /**
    * @name basePointObjectFields_fullstate
    * @publicName fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name basePointObjectmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name basePointObjectFields_originalArgument
    * @publicName originalArgument
    * @type string|number|date
    */
    originalArgument: null,
    /**
    * @name basePointObjectFields_originalValue
    * @publicName originalValue
    * @type string|number|date
    */
    originalValue: null,
    /**
    * @name basePointObjectmethods_select
    * @publicName select()
    */
    select: function () { },
    /**
    * @name basePointObjectmethods_hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name basePointObjectmethods_clearHover
    * @publicName clearHover()
    */
    clearHover: function() { },
    /**
   * @name basePointObjectmethods_isSelected
   * @publicName isSelected()
   * @return boolean
   */
    isSelected: function() { },
   /**
   * @name basePointObjectmethods_isHovered
   * @publicName isHovered()
   * @return boolean
   */
    isHovered: function() { },
    /**
    * @name basePointObjectmethods_showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function() { },
    /**
    * @name basePointObjectmethods_hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name basePointObjectmethods_getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name basePointObjectFields_series
    * @publicName series
    * @type object
    */
    series: null,
    /**
    * @name basePointObjectFields_tag
    * @publicName tag
    * @type any
    */
    tag: null,
    /**
    * @name basePointObjectmethods_getlabel
    * @publicName getLabel()
    * @return baseLabelObject|Array<baseLabelObject>
    */
    getLabel: function() { }
};
/**
* @name baseLabelObject
* @publicName Label
* @type object
*/
var BaseLabel = {
    /**
    * @name baseLabelObjectmethods_getboundingrect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { },
    /**
    * @name baseLabelObjectmethods_hide
    * @publicName hide()
    */
    hide: function() { },
    /**
    * @name baseLabelObjectmethods_show
    * @publicName show()
    */
    show: function() { }
}
