/**
* @name chartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
var chartSeriesObject = {
    axis: null,
    pane: null,
    stack: null,
    barOverlapGroup: null,    
    getArgumentAxis: function() { },
    getValueAxis: function() { }
}

/**
* @name chartPointAggregationInfoObject
* @publicName aggregationInfo
* @type object
*/
var chartPointAggregationInfoObject = {
    data: null,
    aggregationInterval: null,
    intervalStart: null,
    intervalEnd: null
}

/**
* @name chartPointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var chartPointObject = {
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
var chartAxisObject = {
    visualRange: function() { },
    visualRange: function(visualRange) { }
};
