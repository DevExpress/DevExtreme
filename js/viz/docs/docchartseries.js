/**
 * @name ChartSeries
 * @type object
 * @inherits dxChartSeriesTypes.CommonSeries
 * @hidden
 */
var chartSeries = {
    /**
    * @name ChartSeries.name
    * @type string
    * @default undefined
    */
    name: undefined,
    /**
    * @name ChartSeries.tag
    * @type any
    * @default undefined
    */
    tag: undefined,
    /**
    * @name ChartSeries.type
    * @type Enums.SeriesType
    * @default 'line'
    */
    type: 'line'
};

/**
* @name dxChartSeriesTypes
* @type object
*/
/**
* @name dxChartSeriesTypes.CommonSeries
* @type object
* @hidden
*/
var commonSeries = {
    /**
    * @name dxChartSeriesTypes.CommonSeries.color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.visible
    * @type boolean
    * @default true
    */
    visible: true,
    /**
    * @name dxChartSeriesTypes.CommonSeries.innerColor
    * @type string
    * @default '#ffffff'
    * @propertyOf dxChartSeriesTypes.CandleStickSeries
    */
    innerColor: '#ffffff',
    /**
    * @name dxChartSeriesTypes.CommonSeries.opacity
    * @type number
    * @default 0.5
    * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    opacity: 0.5,
    /**
    * @name dxChartSeriesTypes.CommonSeries.reduction
    * @type object
    * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
    */
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
    /**
    * @name dxChartSeriesTypes.CommonSeries.width
    * @type number
    * @default 2
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
    */
    width: 2,
    /**
    * @name dxChartSeriesTypes.CommonSeries.cornerRadius
    * @type number
    * @default 0
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
    */
    cornerRadius: 0,
    /**
    * @name dxChartSeriesTypes.CommonSeries.dashStyle
    * @type Enums.DashStyle
    * @default 'solid'
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
    */
    dashStyle: 'solid',
    /**
    * @name dxChartSeriesTypes.CommonSeries.stack
    * @type string
    * @default 'default'
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
    */
    stack: 'default',
    /**
    * @name dxChartSeriesTypes.CommonSeries.barOverlapGroup
    * @type string
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
    */
   barOverlapGroup: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.pane
    * @type string
    * @default 'default'
    */
    pane: 'default',
    /**
    * @name dxChartSeriesTypes.CommonSeries.axis
    * @type string
    * @default undefined
    */
    axis: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.valueField
    * @type string
    * @default 'val'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
    */
    valueField: 'val',
    /**
    * @name dxChartSeriesTypes.CommonSeries.argumentField
    * @type string
    * @default 'arg'
    * @notUsedInTheme
    */
    argumentField: 'arg',
    /**
    * @name dxChartSeriesTypes.CommonSeries.tagField
    * @type string
    * @default 'tag'
    * @notUsedInTheme
    */
    tagField: 'tag',
    /**
    * @name dxChartSeriesTypes.CommonSeries.rangeValue1Field
    * @type string
    * @default 'val1'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    rangeValue1Field: 'val1',
    /**
    * @name dxChartSeriesTypes.CommonSeries.rangeValue2Field
    * @type string
    * @default 'val2'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    rangeValue2Field: 'val2',
    /**
    * @name dxChartSeriesTypes.CommonSeries.openValueField
    * @type string
    * @default 'open'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    openValueField: 'open',
    /**
    * @name dxChartSeriesTypes.CommonSeries.highValueField
    * @type string
    * @default 'high'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    highValueField: 'high',
    /**
    * @name dxChartSeriesTypes.CommonSeries.lowValueField
    * @type string
    * @default 'low'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    lowValueField: 'low',
    /**
    * @name dxChartSeriesTypes.CommonSeries.closeValueField
    * @type string
    * @default 'close'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    closeValueField: 'close',
    /**
    * @name dxChartSeriesTypes.CommonSeries.sizeField
    * @type string
    * @default 'size'
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    sizeField: 'size',
    /**
    * @name dxChartSeriesTypes.CommonSeries.border
    * @type object
    * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplinedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
    */
    border: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.visible
        * @type boolean
        * @default false
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        visible: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.width
        * @type number
        * @default 2
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        width: 2,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.color
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.dashStyle
        * @type Enums.DashStyle
        * @default undefined
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        dashStyle: undefined
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.hoverMode
    * @type Enums.ChartSeriesHoverMode
        */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.CommonSeries.selectionMode
    * @type Enums.ChartSeriesSelectionMode
        */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.CommonSeries.hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverStyle.width
        * @type number
        * @default 3
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        width: 3,
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
        */
        dashStyle: 'solid',
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverStyle.border
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionStyle.width
        * @type number
        * @default 3
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        width: 3,
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
        */
        dashStyle: 'solid',
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionStyle.border
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.point
    * @type object
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
    */
    point: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.hoverMode
        * @type Enums.ChartPointInteractionMode
        * @default 'onlyPoint'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        hoverMode: 'onlyPoint',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.selectionMode
        * @type Enums.ChartPointInteractionMode
        * @default 'onlyPoint'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        selectionMode: 'onlyPoint',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.color
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.visible
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible: true,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.symbol
        * @type Enums.PointSymbol
        * @default 'circle'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        symbol: 'circle',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.image
        * @type string|object
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
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
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.border
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
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
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.size
        * @type number
        * @default 12
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        size: 12,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.hoverStyle
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
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
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.selectionStyle
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
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
    /**
    * @name dxChartSeriesTypes.CommonSeries.showInLegend
    * @type boolean
    * @default true
    */
    showInLegend: true,
    /**
    * @name dxChartSeriesTypes.CommonSeries.maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.minBarSize
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
    */
    minBarSize: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
    * @type boolean
    * @default false
    */
    ignoreEmptyPoints: false,
    /**
    * @name dxChartSeriesTypes.CommonSeries.barPadding
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
    */
    barPadding: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.barWidth
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
    */
    barWidth: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.showForZeroValues
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
        */
        showForZeroValues: true,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.alignment
        * @type Enums.HorizontalAlignment
        * @default 'center'
        */
        alignment: 'center',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.verticalOffset
        * @type number
        * @default 0
        */
        verticalOffset: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.position
        * @type Enums.RelativePosition
        * @default 'outside'
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
        */
        position: 'outside',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.font
        * @type Font
        * @default '#FFFFFF' @prop color
        * @default 14 @prop size
        */
        font: {
            family: undefined,
            weight: 400,
            color: '#FFFFFF',
            size: 14,
            opacity: undefined
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.border
        * @type object
        */
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
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.connector
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
        */
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
    /**
    * @name dxChartSeriesTypes.CommonSeries.valueErrorBar
    * @type object
    * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
    */
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
    /**
    * @name dxChartSeriesTypes.CommonSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.method
        * @type Enums.ChartSeriesAggregationMethod
        */
        method: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.calculate
        * @type function(aggregationInfo, series)
        * @type_function_param1 aggregationInfo:chartPointAggregationInfoObject
        * @type_function_param2 series:chartSeriesObject
        * @type_function_return object|Array<object>
        * @default undefined
        */
        calculate: function(aggregationInfo, series) { }
    }
};

/**
* @name dxChartSeriesTypes.AreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var AreaSeries = {
    /**
    * @name dxChartSeriesTypes.AreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.AreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.AreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.AreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.AreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.AreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.AreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.AreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.BarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var BarSeries = {
    /**
    * @name dxChartSeriesTypes.BarSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.BarSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.BarSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.BarSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.BarSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.BarSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.CandleStickSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var CandleStickSeries = {
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.argumentField
    * @type string
    * @default 'date'
    */
    argumentField: 'date',
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.CandleStickSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction
            * @default 'none'
            * @type Enums.HatchingDirection
            */
            direction: 'none'
        }
    },
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction
            * @default 'none'
            * @type Enums.HatchingDirection
            */
            direction: 'none'
        }
    },
    /**
    * @name dxChartSeriesTypes.CandleStickSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.CandleStickSeries.aggregation.method
        * @type Enums.ChartFinancialSeriesAggregationMethod
        * @default 'ohlc'
        */
        method: "ohlc"
    }
};

/**
* @name dxChartSeriesTypes.FullStackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var FullStackedAreaSeries = {
    /**
    * @name dxChartSeriesTypes.FullStackedAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.FullStackedAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.FullStackedAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.FullStackedAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.FullStackedAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.FullStackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var FullStackedSplineAreaSeries = {
    /**
    * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.FullStackedBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var FullStackedBarSeries = {
    /**
    * @name dxChartSeriesTypes.FullStackedBarSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.FullStackedBarSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.FullStackedBarSeries.label.position
        * @type Enums.RelativePosition
        * @default 'inside'
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes.FullStackedBarSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedBarSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedBarSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.FullStackedBarSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.FullStackedLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var FullStackedLineSeries = {
    /**
    * @name dxChartSeriesTypes.FullStackedLineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.FullStackedLineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.FullStackedLineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedLineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.FullStackedLineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.FullStackedLineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.FullStackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var FullStackedSplineSeries = {
    /**
    * @name dxChartSeriesTypes.FullStackedSplineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.FullStackedSplineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.FullStackedSplineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.FullStackedSplineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};


/**
* @name dxChartSeriesTypes.LineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var LineSeries = {
    /**
    * @name dxChartSeriesTypes.LineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.LineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.LineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.LineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
   * @name dxChartSeriesTypes.LineSeries.aggregation
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.LineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.RangeAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var RangeAreaSeries = {
    /**
    * @name dxChartSeriesTypes.RangeAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.RangeAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.RangeAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.RangeAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.RangeAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.RangeAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.RangeAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.RangeAreaSeries.aggregation.method
        * @type Enums.ChartRangeSeriesAggregationMethod
        * @default 'range'
        */
        method: "range"
    }
};

/**
* @name dxChartSeriesTypes.RangeBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var RangeBarSeries = {
    /**
    * @name dxChartSeriesTypes.RangeBarSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.RangeBarSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.RangeBarSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.RangeBarSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.RangeBarSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.RangeBarSeries.aggregation.method
        * @type Enums.ChartRangeSeriesAggregationMethod
        * @default 'range'
        */
        method: "range"
    }
};

/**
* @name dxChartSeriesTypes.ScatterSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var ScatterSeries = {
    /**
    * @name dxChartSeriesTypes.ScatterSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.ScatterSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
   * @name dxChartSeriesTypes.ScatterSeries.aggregation
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.ScatterSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.SplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var SplineAreaSeries = {
    /**
    * @name dxChartSeriesTypes.SplineAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.SplineAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.SplineAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.SplineAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.SplineAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.SplineAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.SplineAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.SplineAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.SplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var SplineSeries = {
    /**
    * @name dxChartSeriesTypes.SplineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.SplineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.SplineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.SplineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.SplineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.SplineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StackedAreaSeries = {
    /**
    * @name dxChartSeriesTypes.StackedAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StackedAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StackedAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.StackedAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.StackedAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StackedAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StackedAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StackedAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StackedSplineAreaSeries = {
    /**
    * @name dxChartSeriesTypes.StackedSplineAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StackedSplineAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.StackedSplineAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StackedSplineAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StackedBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StackedBarSeries = {
    /**
    * @name dxChartSeriesTypes.StackedBarSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StackedBarSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.StackedBarSeries.label.position
        * @type Enums.RelativePosition
        * @default 'inside'
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes.StackedBarSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.StackedBarSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.StackedBarSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StackedBarSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.StackedLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StackedLineSeries = {
    /**
    * @name dxChartSeriesTypes.StackedLineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StackedLineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StackedLineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StackedLineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StackedLineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StackedLineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StackedSplineSeries = {
    /**
    * @name dxChartSeriesTypes.StackedSplineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StackedSplineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StackedSplineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StackedSplineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StackedSplineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StackedSplineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StepAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StepAreaSeries = {
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.border
    * @type object
    */
    border: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.border.visible
        * @type boolean
        * @default true
        */
        visible: true
    },
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.point
    * @type object
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.hoverStyle.border
        * @type object
        */
        border: {
            /**
            * @name dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible
            * @type boolean
            * @default true
            */
            visible: true
        }
    },
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.selectionStyle.border
        * @type object
        */
        border: {
            /**
            * @name dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: true
        }
    },
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StepAreaSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StepAreaSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StepLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StepLineSeries = {
    /**
    * @name dxChartSeriesTypes.StepLineSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StepLineSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StepLineSeries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.StepLineSeries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.StepLineSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StepLineSeries.aggregation.method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.StockSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var StockSeries = {
    /**
    * @name dxChartSeriesTypes.StockSeries.argumentField
    * @type string
    * @default 'date'
    */
    argumentField: 'date',
    /**
    * @name dxChartSeriesTypes.StockSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.StockSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.StockSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.StockSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
   * @name dxChartSeriesTypes.StockSeries.aggregation
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.StockSeries.aggregation.method
        * @type Enums.ChartFinancialSeriesAggregationMethod
        * @default 'ohlc'
        */
        method: "ohlc"
    }
};
/**
* @name dxChartSeriesTypes.BubbleSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var BubbleSeries = {
    /**
    * @name dxChartSeriesTypes.BubbleSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.BubbleSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.BubbleSeries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.BubbleSeries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.BubbleSeries.aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.BubbleSeries.aggregation.method
        * @type Enums.ChartBubbleSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};
