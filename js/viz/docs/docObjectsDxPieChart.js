/**
* @name piePointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var piePointObject = {
    /**
    * @name piePointObjectFields_percent
    * @publicName percent
    * @type string|number|date
    */
    percent: null,
    /**
    * @name piePointObjectmethods_isvisible
    * @publicName isVisible()
    * @return boolean
    */
    isVisible: function() { },
    /**
   * @name piePointObjectmethods_show
   * @publicName show()
   */
    show: function() { },
    /**
  * @name piePointObjectmethods_hide
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
    * @name pieChartSeriesObjectmethods_hover
    * @publicName hover()
    * @hidden
    */
    hover: function () { },
    /**
    * @name pieChartSeriesObjectmethods_clearHover
    * @publicName clearHover()
    * @hidden
    */
    clearHover: function () { },
    /**
    * @name pieChartSeriesObjectmethods_isHovered
    * @publicName isHovered()
    * @hidden
    */
    isHovered: function() { }
};
