/**
* @name baseSeriesObject
* @publicName Series
* @type object
*/
var BaseBaseSeries = {
    /**
    * @name baseSeriesObjectFields.fullstate
    * @publicName fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name baseSeriesObjectmethods.clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name baseSeriesObjectmethods.deselectpoint
    * @publicName deselectPoint(point)
    * @param1 point:basePointObject
    */
    deselectPoint: function() { },
    /**
    * @name baseSeriesObjectmethods.getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name baseSeriesObjectmethods.getallpoints
    * @publicName getAllPoints()
    * @return Array<basePointObject>
    */
    getAllPoints: function() { },
    /**
    * @name baseSeriesObjectmethods.getpointsbyarg
    * @publicName getPointsByArg(pointArg)
    * @param1 pointArg:number|string|date
    * @return Array<basePointObject>
    */
    getPointsByArg: function() { },
    /**
    * @name baseSeriesObjectmethods.getpointbypos
    * @publicName getPointByPos(positionIndex)
    * @param1 positionIndex:number
    * @return basePointObject
    */
    getPointByPos: function() { },
    /**
   * @name baseSeriesObjectmethods.getvisiblepoints
   * @publicName getVisiblePoints()
   * @return Array<basePointObject>
   */
    getVisiblePoints: function() { },
    /**
    * @name baseSeriesObjectmethods.select
    * @publicName select()
    */
    select: function() { },
    /**
    * @name baseSeriesObjectmethods.selectpoint
    * @publicName selectPoint(point)
    * @param1 point:basePointObject
    */
    selectPoint: function () { },
    /**
    * @name baseSeriesObjectmethods.hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name baseSeriesObjectmethods.clearHover
    * @publicName clearHover()
    */
    clearHover: function () { },
    /**
    * @name baseSeriesObjectmethods.isSelected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function() { },
    /**
    * @name baseSeriesObjectmethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function() { },
    /**
   * @name baseSeriesObjectmethods.isvisible
   * @publicName isVisible()
   * @return boolean
   */
    isVisible: function() { },
    /**
    * @name baseSeriesObjectFields.type
    * @publicName type
    * @type string
    */
    type: null,
    /**
    * @name baseSeriesObjectFields.name
    * @publicName name
    * @type any
    */
    name: null,
    /**
    * @name baseSeriesObjectFields.tag
    * @publicName tag
    * @type any
    */
    tag: null,
    /**
   * @name baseSeriesObjectmethods.show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name baseSeriesObjectmethods.hide
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
    * @name basePointObjectFields.data
    * @publicName data
    * @type any
    */
    data: {},
    /**
    * @name basePointObjectFields.fullstate
    * @publicName fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name basePointObjectmethods.clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name basePointObjectFields.originalArgument
    * @publicName originalArgument
    * @type string|number|date
    */
    originalArgument: null,
    /**
    * @name basePointObjectFields.originalValue
    * @publicName originalValue
    * @type string|number|date
    */
    originalValue: null,
    /**
    * @name basePointObjectmethods.select
    * @publicName select()
    */
    select: function () { },
    /**
    * @name basePointObjectmethods.hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name basePointObjectmethods.clearHover
    * @publicName clearHover()
    */
    clearHover: function() { },
    /**
   * @name basePointObjectmethods.isSelected
   * @publicName isSelected()
   * @return boolean
   */
    isSelected: function() { },
   /**
   * @name basePointObjectmethods.isHovered
   * @publicName isHovered()
   * @return boolean
   */
    isHovered: function() { },
    /**
    * @name basePointObjectmethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function() { },
    /**
    * @name basePointObjectmethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name basePointObjectmethods.getcolor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name basePointObjectFields.series
    * @publicName series
    * @type object
    */
    series: null,
    /**
    * @name basePointObjectFields.tag
    * @publicName tag
    * @type any
    */
    tag: null,
    /**
    * @name basePointObjectmethods.getlabel
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
    * @name baseLabelObjectmethods.getboundingrect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { },
    /**
    * @name baseLabelObjectmethods.hide
    * @publicName hide()
    */
    /**
    * @name baseLabelObjectmethods.hide
    * @publicName hide(holdInvisible)
    * @param1 holdInvisible:boolean
    */
    hide: function(holdInvisible) { },
    /**
    * @name baseLabelObjectmethods.show
    * @publicName show()
    */
    /**
    * @name baseLabelObjectmethods.show
    * @publicName show(holdVisible)
    * @param1 holdVisible:boolean
    */
    show: function(holdVisible) { },
    /**
    * @name baseLabelObjectmethods.isvisible
    * @publicName isVisible()
    * @return boolean
    */
    isVisible: function() { }
}
