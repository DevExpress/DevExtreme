/**
* @name piePointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var piePointObject = {
    /**
    * @name piePointObjectFields.percent
    * @publicName percent
    * @type string|number|date
    */
    percent: null,
    /**
    * @name piePointObjectmethods.isvisible
    * @publicName isVisible()
    * @return boolean
    */
    isVisible: function() { },
    /**
   * @name piePointObjectmethods.show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name piePointObjectmethods.hide
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
    * @name pieChartSeriesObjectmethods.hover
    * @publicName hover()
    * @hidden
    */
    hover: function () { },
    /**
    * @name pieChartSeriesObjectmethods.clearHover
    * @publicName clearHover()
    * @hidden
    */
    clearHover: function () { },
    /**
    * @name pieChartSeriesObjectmethods.isHovered
    * @publicName isHovered()
    * @hidden
    */
    isHovered: function() { }
};
