/**
* @name chartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
const chartSeriesObject = {
    axis: null,
    pane: null,
    stack: null,
    barOverlapGroup: null,    
    getArgumentAxis: function() { },
    getValueAxis: function() { }
};

/**
* @name chartPointAggregationInfoObject
* @publicName aggregationInfo
* @type object
*/
const chartPointAggregationInfoObject = {
    data: null,
    aggregationInterval: null,
    intervalStart: null,
    intervalEnd: null
};

/**
* @name chartPointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
const chartPointObject = {
    aggregationInfo: null,
    originalMinValue: null,
    originalOpenValue: null,
    originalCloseValue: null,
    originalLowValue: null,
    originalHighValue: null,
    size: null,
    getBoundingRect: function() { }
};

/**
* @name chartAxisObject
* @type object
*/
const chartAxisObject = {
    visualRange: function() { },
    visualRange: function(visualRange) { }
};
