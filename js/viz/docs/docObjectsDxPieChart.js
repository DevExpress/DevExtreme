/**
* @name piePointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
const piePointObject = {
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
const pieChartSeriesObject = {
    /**
    * @name pieChartSeriesObject.hover
    * @publicName hover()
    * @hidden
    */
    hover: function () { },
    /**
    * @name pieChartSeriesObject.clearHover
    * @publicName clearHover()
    * @hidden
    */
    clearHover: function () { },
    /**
    * @name pieChartSeriesObject.isHovered
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
const legendItem = {
    text: undefined,
    points: [],
    argument: undefined,
    argumentIndex: undefined
};
