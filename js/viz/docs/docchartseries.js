/**
 * @name ChartSeries
 * @type object
 * @inherits dxChartSeriesTypes.CommonSeries
 * @hidden
 */
var chartSeries = {
    name: undefined,
    tag: undefined,
    type: 'line'
};

/**
* @name dxChartSeriesTypes
* @type object
*/
var commonSeries = {
    color: undefined,
    visible: true,
    innerColor: '#ffffff',
    opacity: 0.5,
    reduction: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.reduction.color
        * @type string
        * @default '#ff0000'
        * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        color: '#ff0000',
        /**
        * @name dxChartSeriesTypes.CommonSeries.reduction.level
        * @type Enums.FinancialChartReductionLevel
        * @default 'close'
                * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        level: 'close'
    },
    width: 2,
    cornerRadius: 0,
    dashStyle: 'solid',
    stack: 'default',
   barOverlapGroup: undefined,
    pane: 'default',
    axis: undefined,
    valueField: 'val',
    argumentField: 'arg',
    tagField: 'tag',
    rangeValue1Field: 'val1',
    rangeValue2Field: 'val2',
    openValueField: 'open',
    highValueField: 'high',
    lowValueField: 'low',
    closeValueField: 'close',
    sizeField: 'size',
    border: {
        visible: false,
        width: 2,
        color: undefined,
        dashStyle: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    hoverStyle: {
        color: undefined,
        width: 3,
        dashStyle: 'solid',
        hatching: {
            direction: 'right',
            width: 2,
            step: 6,
            opacity: 0.75
        },
        border: {
            visible: false,
            width: 3,
            color: undefined,
            dashStyle: 'solid'
        }
    },
    selectionStyle: {
        color: undefined,
        width: 3,
        dashStyle: 'solid',
        hatching: {
            direction: 'right',
            width: 2,
            step: 6,
            opacity: 0.5
        },
        border: {
            visible: false,
            width: 3,
            color: undefined,
            dashStyle: 'solid'
        }
    },
    point: {
        hoverMode: 'onlyPoint',
        selectionMode: 'onlyPoint',
        color: undefined,
        visible: true,
        symbol: 'circle',
        image: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.url
            * @type string|object
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            url: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.url.rangeMinPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.url.rangeMaxPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.width
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            width: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.width.rangeMinPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.width.rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.height
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            height: {
                /**
               * @name dxChartSeriesTypes.CommonSeries.point.image.height.rangeMinPoint
               * @type number
               * @default undefined
               * @propertyOf dxChartSeriesTypes.RangeAreaSeries
               */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.height.rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
        },
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.visible
            * @type boolean
            * @default false
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.width
            * @type number
            * @default 1
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined
        },
        size: 12,
        hoverStyle: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.border
            * @type object
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            border: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.visible
                * @type boolean
                * @default true
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                visible: true,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.width
                * @type number
                * @default 4
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                width: 4,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.color
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                color: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle.size
            * @type number
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            size: undefined
        },
        selectionStyle: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.border
            * @type object
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            border: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.visible
                * @type boolean
                * @default true
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                visible: true,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.width
                * @type number
                * @default 4
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                width: 4,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.color
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                color: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle.size
            * @type number
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            size: undefined
        }
    },
    showInLegend: true,
    maxLabelCount: undefined,
    minBarSize: undefined,
    ignoreEmptyPoints: false,
    barPadding: undefined,
    barWidth: undefined,
    label: {
        customizeText: undefined,
        visible: false,
        showForZeroValues: true,
        alignment: 'center',
        rotationAngle: 0,
        horizontalOffset: 0,
        verticalOffset: 0,
        format: '',
        argumentFormat: '',
        position: 'outside',
        font: {
            family: undefined,
            weight: 400,
            color: '#FFFFFF',
            size: 14,
            opacity: undefined
        },
        backgroundColor: undefined,
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        connector: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.visible
            * @type boolean
            * @default false
            * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.width
            * @type number
            * @default 1
            * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            color: undefined
        }
    },
    valueErrorBar: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.displayMode
        * @type Enums.ValueErrorBarDisplayMode
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.type
        * @type Enums.ValueErrorBarType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.color
        * @type string
        * @default 'black'
        */
        color: 'black',
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueErrorBar.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined
    },
    aggregation: {
        enabled: false,
        method: undefined,
        calculate: function(aggregationInfo, series) { }
    }
};

var AreaSeries = {
    label: {
        customizeText: undefined
    },
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var BarSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "sum"
    }
};

var CandleStickSeries = {
    argumentField: 'date',
    label: {
        customizeText: undefined
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    hoverStyle: {
        hatching: {
            direction: 'none'
        }
    },
    selectionStyle: {
        hatching: {
            direction: 'none'
        }
    },
    aggregation: {
        method: "ohlc"
    }
};

var FullStackedAreaSeries = {
    point: {
        visible: false
    },
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var FullStackedSplineAreaSeries = {
    point: {
        visible: false
    },
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var FullStackedBarSeries = {
    label: {
        customizeText: undefined,
        position: 'inside'
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "sum"
    }
};

var FullStackedLineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var FullStackedSplineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};


var LineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var RangeAreaSeries = {
    label: {
        customizeText: undefined
    },
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "range"
    }
};

var RangeBarSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "range"
    }
};

var ScatterSeries = {
    label: {
        customizeText: undefined
    },
    aggregation: {
        method: "avg"
    }
};

var SplineAreaSeries = {
    label: {
        customizeText: undefined
    },
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var SplineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StackedAreaSeries = {
    label: {
        customizeText: undefined
    },
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StackedSplineAreaSeries = {
    label: {
        customizeText: undefined
    },
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StackedBarSeries = {
    label: {
        customizeText: undefined,
        position: 'inside'
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "sum"
    }
};

var StackedLineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StackedSplineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StepAreaSeries = {
    border: {
        visible: true
    },
    point: {
        visible: false
    },
    hoverStyle: {
        border: {
            visible: true
        }
    },
    label: {
        customizeText: undefined
    },
    selectionStyle: {
        border: {
            visible: true
        }
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StepLineSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
    aggregation: {
        method: "avg"
    }
};

var StockSeries = {
    argumentField: 'date',
    label: {
        customizeText: undefined
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "ohlc"
    }
};
var BubbleSeries = {
    label: {
        customizeText: undefined
    },
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
    aggregation: {
        method: "avg"
    }
};
