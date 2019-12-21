/**
* @name baseSeriesObject
* @publicName Series
* @type object
*/
var BaseBaseSeries = {
    fullState: 0,
    clearSelection: function() { },
    deselectPoint: function() { },
    getColor: function() { },
    getAllPoints: function() { },
    getPointsByArg: function() { },
    getPointByPos: function() { },
    getVisiblePoints: function() { },
    select: function() { },
    selectPoint: function () { },
    hover: function () { },
    clearHover: function () { },
    isSelected: function() { },
    isHovered: function() { },
    isVisible: function() { },
    type: null,
    name: null,
    tag: null,
    show: function() { },
    hide: function() { }
}

/**
* @name basePointObject
* @publicName Point
* @type object
*/
var BasePoint = {
    data: {},
    fullState: 0,
    clearSelection: function() { },
    originalArgument: null,
    originalValue: null,
    select: function () { },
    hover: function () { },
    clearHover: function() { },
    isSelected: function() { },
    isHovered: function() { },
    showTooltip: function() { },
    hideTooltip: function() { },
    getColor: function() { },
    series: null,
    tag: null,
    getLabel: function() { }
};
/**
* @name baseLabelObject
* @publicName Label
* @type object
*/
var BaseLabel = {
    getBoundingRect: function() { },
    hide: function(holdInvisible) { },
    show: function(holdVisible) { },
    isVisible: function() { }
}

/**
* @name BaseChartLegendItem
* @type object
* @inherits BaseLegendItem
*/
var legendItem = {
  series: undefined
};
