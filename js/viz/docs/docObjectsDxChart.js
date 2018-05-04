/**
* @name chartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
var chartSeriesObject = {
    /**
    * @name chartSeriesObjectFields.axis
    * @publicName axis
    * @type string
    */
    axis: null,
    /**
    * @name chartSeriesObjectFields.pane
    * @publicName pane
    * @type string
    */
    pane: null
}

/**
* @name chartPointAggregationInfoObject
* @publicName aggregationInfo
* @type object
*/
var chartPointAggregationInfoObject = {
    /**
    * @name chartPointAggregationInfoObject.data
    * @publicName data
    * @type Array<any>
    */
    data: null,
    /**
    * @name chartPointAggregationInfoObject.aggregationInterval
    * @publicName aggregationInterval
    * @type any
    */
    aggregationInterval: null,
    /**
    * @name chartPointAggregationInfoObject.intervalStart
    * @publicName intervalStart
    * @type any
    */
    intervalStart: null,
    /**
    * @name chartPointAggregationInfoObject.intervalEnd
    * @publicName intervalEnd
    * @type any
    */
    intervalEnd: null
}

/**
* @name chartPointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var chartPointObject = {
    /**
    * @name chartPointObjectFields.aggregationInfo
    * @publicName aggregationInfo
    * @type chartPointAggregationInfoObject
    */
    aggregationInfo: null,
    /**
    * @name chartPointObjectFields.originalMinValue
    * @publicName originalMinValue
    * @type string|number|date
    */
    originalMinValue: null,
    /**
    * @name chartPointObjectFields.originalOpenValue
    * @publicName originalOpenValue
    * @type number|string
    */
    originalOpenValue: null,
    /**
    * @name chartPointObjectFields.originalCloseValue
    * @publicName originalCloseValue
    * @type number|string
    */
    originalCloseValue: null,
    /**
    * @name chartPointObjectFields.originalLowValue
    * @publicName originalLowValue
    * @type number|string
    */
    originalLowValue: null,
    /**
    * @name chartPointObjectFields.originalHighValue
    * @publicName originalHighValue
    * @type number|string
    */
    originalHighValue: null,
    /**
    * @name chartPointObjectFields.size
    * @publicName size
    * @type number|string
    */
    size: null,
    /**
    * @name chartPointObjectmethods.getboundingrect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { }
};
