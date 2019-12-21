/**
* @name piePointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var piePointObject = {
    percent: null,
    isVisible: function() { },
    show: function() { },
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
* @inherits BaseLegendItem
*/
var legendItem = {
    text: undefined,
    points: [],
    argument: undefined,
    argumentIndex: undefined
};
