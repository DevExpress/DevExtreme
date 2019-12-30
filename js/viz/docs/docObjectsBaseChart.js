/**
* @name baseSeriesObject
* @publicName Series
* @type object
*/
const BaseBaseSeries = {
    /**
    * @name baseSeriesObjectFields.fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name baseSeriesObjectMethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name baseSeriesObjectMethods.deselectPoint
    * @publicName deselectPoint(point)
    * @param1 point:basePointObject
    */
    deselectPoint: function() { },
    /**
    * @name baseSeriesObjectMethods.getColor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name baseSeriesObjectMethods.getAllPoints
    * @publicName getAllPoints()
    * @return Array<basePointObject>
    */
    getAllPoints: function() { },
    /**
    * @name baseSeriesObjectMethods.getPointsByArg
    * @publicName getPointsByArg(pointArg)
    * @param1 pointArg:number|string|date
    * @return Array<basePointObject>
    */
    getPointsByArg: function() { },
    /**
    * @name baseSeriesObjectMethods.getPointByPos
    * @publicName getPointByPos(positionIndex)
    * @param1 positionIndex:number
    * @return basePointObject
    */
    getPointByPos: function() { },
    /**
   * @name baseSeriesObjectMethods.getVisiblePoints
   * @publicName getVisiblePoints()
   * @return Array<basePointObject>
   */
    getVisiblePoints: function() { },
    /**
    * @name baseSeriesObjectMethods.select
    * @publicName select()
    */
    select: function() { },
    /**
    * @name baseSeriesObjectMethods.selectPoint
    * @publicName selectPoint(point)
    * @param1 point:basePointObject
    */
    selectPoint: function () { },
    /**
    * @name baseSeriesObjectMethods.hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name baseSeriesObjectMethods.clearHover
    * @publicName clearHover()
    */
    clearHover: function () { },
    /**
    * @name baseSeriesObjectMethods.isSelected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: function() { },
    /**
    * @name baseSeriesObjectMethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: function() { },
    /**
   * @name baseSeriesObjectMethods.isVisible
   * @publicName isVisible()
   * @return boolean
   */
    isVisible: function() { },
    /**
    * @name baseSeriesObjectFields.type
    * @type string
    */
    type: null,
    /**
    * @name baseSeriesObjectFields.name
    * @type any
    */
    name: null,
    /**
    * @name baseSeriesObjectFields.tag
    * @type any
    */
    tag: null,
    /**
   * @name baseSeriesObjectMethods.show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name baseSeriesObjectMethods.hide
  * @publicName hide()
  */
    hide: function() { }
};

/**
* @name basePointObject
* @publicName Point
* @type object
*/
const BasePoint = {
    /**
    * @name basePointObjectFields.data
    * @type any
    */
    data: {},
    /**
    * @name basePointObjectFields.fullState
    * @type number
    */
    fullState: 0,
    /**
    * @name basePointObjectMethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name basePointObjectFields.originalArgument
    * @type string|number|date
    */
    originalArgument: null,
    /**
    * @name basePointObjectFields.originalValue
    * @type string|number|date
    */
    originalValue: null,
    /**
    * @name basePointObjectMethods.select
    * @publicName select()
    */
    select: function () { },
    /**
    * @name basePointObjectMethods.hover
    * @publicName hover()
    */
    hover: function () { },
    /**
    * @name basePointObjectMethods.clearHover
    * @publicName clearHover()
    */
    clearHover: function() { },
    /**
   * @name basePointObjectMethods.isSelected
   * @publicName isSelected()
   * @return boolean
   */
    isSelected: function() { },
   /**
   * @name basePointObjectMethods.isHovered
   * @publicName isHovered()
   * @return boolean
   */
    isHovered: function() { },
    /**
    * @name basePointObjectMethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: function() { },
    /**
    * @name basePointObjectMethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name basePointObjectMethods.getColor
    * @publicName getColor()
    * @return string
    */
    getColor: function() { },
    /**
    * @name basePointObjectFields.series
    * @type object
    */
    series: null,
    /**
    * @name basePointObjectFields.tag
    * @type any
    */
    tag: null,
    /**
    * @name basePointObjectMethods.getLabel
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
const BaseLabel = {
    /**
    * @name baseLabelObjectMethods.getBoundingRect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { },
    /**
    * @name baseLabelObjectMethods.hide
    * @publicName hide()
    */
    /**
    * @name baseLabelObjectMethods.hide
    * @publicName hide(holdInvisible)
    * @param1 holdInvisible:boolean
    */
    hide: function(holdInvisible) { },
    /**
    * @name baseLabelObjectMethods.show
    * @publicName show()
    */
    /**
    * @name baseLabelObjectMethods.show
    * @publicName show(holdVisible)
    * @param1 holdVisible:boolean
    */
    show: function(holdVisible) { },
    /**
    * @name baseLabelObjectMethods.isVisible
    * @publicName isVisible()
    * @return boolean
    */
    isVisible: function() { }
};

/**
* @name BaseChartLegendItem
* @type object
* @inherits BaseLegendItem
*/
const legendItem = {
  /**
  * @name BaseChartLegendItem.series
  * @type baseSeriesObject
  */
  series: undefined
};
