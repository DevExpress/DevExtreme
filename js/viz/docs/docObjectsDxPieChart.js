/**
* @name piePointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var piePointObject = {
    /**
    * @name piePointObjectFields.percent
    * @type string|number|date
    */
    percent: null,
    /**
    * @name piePointObjectMethods.isVisible
    * @publicName isVisible()
    * @return boolean
    */
    isVisible: function() { },
    /**
   * @name piePointObjectMethods.show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name piePointObjectMethods.hide
  * @publicName hide()
  */
    hide: function() { }
};

/**
* @name pieChartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
var pieChartSeriesObject = {
    /**
    * @name pieChartSeriesObjectMethods.hover
    * @publicName hover()
    * @hidden
    */
    hover: function () { },
    /**
    * @name pieChartSeriesObjectMethods.clearHover
    * @publicName clearHover()
    * @hidden
    */
    clearHover: function () { },
    /**
    * @name pieChartSeriesObjectMethods.isHovered
    * @publicName isHovered()
    * @hidden
    */
    isHovered: function() { }
};


/**
* @name PieChartLegendItem
* @type object
*/
var legendItem = {
  /**
  * @name PieChartLegendItem.text
  * @type any
  */
  text: undefined,
  /**
  * @name PieChartLegendItem.points
  * @type Array<piePointObject>
  */
  points: [],
  /**
  * @name PieChartLegendItem.visible
  * @type boolean
  */
  visible: true,
  /**
  * @name PieChartLegendItem.argument
  * @type string|Date|number
  */
  argument: undefined,
  /**
  * @name PieChartLegendItem.argumentIndex
  * @type number
  */
  argumentIndex: undefined,
};