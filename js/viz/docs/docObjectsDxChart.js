/**
* @name chartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
const chartSeriesObject = {
    /**
    * @name chartSeriesObjectFields.axis
    * @type string
    */
    axis: null,
    /**
    * @name chartSeriesObjectFields.pane
    * @type string
    */
    pane: null,
    /**
    * @name chartSeriesObjectFields.stack
    * @type string
    */
    stack: null,
    /**
    * @name chartSeriesObjectFields.barOverlapGroup
    * @type string
    */
    barOverlapGroup: null,    
    /**
    * @name chartSeriesObjectMethods.getArgumentAxis
    * @publicName getArgumentAxis()
    * @return chartAxisObject
    */
    getArgumentAxis: function() { },
    /**
    * @name chartSeriesObjectMethods.getValueAxis
    * @publicName getValueAxis()
    * @return chartAxisObject
    */
    getValueAxis: function() { }
};

/**
* @name chartPointAggregationInfoObject
* @publicName aggregationInfo
* @type object
*/
const chartPointAggregationInfoObject = {
    /**
    * @name chartPointAggregationInfoObject.data
    * @type Array<any>
    */
    data: null,
    /**
    * @name chartPointAggregationInfoObject.aggregationInterval
    * @type any
    */
    aggregationInterval: null,
    /**
    * @name chartPointAggregationInfoObject.intervalStart
    * @type any
    */
    intervalStart: null,
    /**
    * @name chartPointAggregationInfoObject.intervalEnd
    * @type any
    */
    intervalEnd: null
};

/**
* @name chartPointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
const chartPointObject = {
    /**
    * @name chartPointObjectFields.aggregationInfo
    * @type chartPointAggregationInfoObject
    */
    aggregationInfo: null,
    /**
    * @name chartPointObjectFields.originalMinValue
    * @type string|number|date
    */
    originalMinValue: null,
    /**
    * @name chartPointObjectFields.originalOpenValue
    * @type number|string
    */
    originalOpenValue: null,
    /**
    * @name chartPointObjectFields.originalCloseValue
    * @type number|string
    */
    originalCloseValue: null,
    /**
    * @name chartPointObjectFields.originalLowValue
    * @type number|string
    */
    originalLowValue: null,
    /**
    * @name chartPointObjectFields.originalHighValue
    * @type number|string
    */
    originalHighValue: null,
    /**
    * @name chartPointObjectFields.size
    * @type number|string
    */
    size: null,
    /**
    * @name chartPointObjectmethods.getBoundingRect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { }
};

/**
* @name chartAxisObject
* @type object
*/
const chartAxisObject = {
    /**
    * @name chartAxisObjectMethods.visualRange
    * @publicName visualRange()
    * @return VizRange
    */
    visualRange: function() { },
    /**
    * @name chartAxisObjectMethods.visualRange
    * @publicName visualRange(visualRange)
    * @param1 visualRange:Array<number,string,Date> | VizRange
    */
    visualRange: function(visualRange) { }
};
