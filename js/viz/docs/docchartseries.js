/**
* @name dxChartSeriesTypes
* @publicName dxChartSeriesTypes
* @type object
*/
/**
* @name dxChartSeriesTypes.CommonSeries
* @publicName CommonSeries
* @type object
* @hidden
*/
var commonSeries = {
    /**
    * @name dxChartSeriesTypes.CommonSeries.color
    * @publicName color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.visible
    * @publicName visible
    * @type boolean
    * @default true
    */
    visible: true,
    /**
    * @name dxChartSeriesTypes.CommonSeries.innercolor
    * @publicName innerColor
    * @type string
    * @default '#ffffff'
    * @propertyOf dxChartSeriesTypes.CandleStickSeries
    */
    innerColor: '#ffffff',
    /**
    * @name dxChartSeriesTypes.CommonSeries.opacity
    * @publicName opacity
    * @type number
    * @default 0.5
    * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes. StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes. FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    opacity: 0.5,
    /**
    * @name dxChartSeriesTypes.CommonSeries.reduction
    * @publicName reduction
    * @type object
    * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
    */
    reduction: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.reduction.color
        * @publicName color
        * @type string
        * @default '#ff0000'
        * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        color: '#ff0000',
        /**
        * @name dxChartSeriesTypes.CommonSeries.reduction.level
        * @publicName level
        * @type Enums.FinancialChartReductionLevel
        * @default 'close'
                * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        level: 'close'
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.width
    * @publicName width
    * @type number
    * @default 2
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeriesSeries,dxChartSeriesTypes.StockSeriesSeries
    */
    width: 2,
    /**
    * @name dxChartSeriesTypes.CommonSeries.cornerradius
    * @publicName cornerRadius
    * @type number
    * @default 0
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
    */
    cornerRadius: 0,
    /**
    * @name dxChartSeriesTypes.CommonSeries.dashstyle
    * @publicName dashStyle
    * @type Enums.DashStyle
    * @default 'solid'
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
    */
    dashStyle: 'solid',
    /**
    * @name dxChartSeriesTypes.CommonSeries.stack
    * @publicName stack
    * @type string
    * @default 'default'
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
    */
    stack: 'default',
    /**
    * @name dxChartSeriesTypes.CommonSeries.pane
    * @publicName pane
    * @type string
    * @default 'default'
    */
    pane: 'default',
    /**
    * @name dxChartSeriesTypes.CommonSeries.axis
    * @publicName axis
    * @type string
    * @default undefined
    */
    axis: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes. StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes. FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
    */
    valueField: 'val',
    /**
    * @name dxChartSeriesTypes.CommonSeries.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    * @notUsedInTheme
    */
    argumentField: 'arg',
    /**
    * @name dxChartSeriesTypes.CommonSeries.tagfield
    * @publicName tagField
    * @type string
    * @default 'tag'
    * @notUsedInTheme
    */
    tagField: 'tag',
    /**
    * @name dxChartSeriesTypes.CommonSeries.rangevalue1field
    * @publicName rangeValue1Field
    * @type string
    * @default 'val1'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    rangeValue1Field: 'val1',
    /**
    * @name dxChartSeriesTypes.CommonSeries.rangevalue2field
    * @publicName rangeValue2Field
    * @type string
    * @default 'val2'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
    */
    rangeValue2Field: 'val2',
    /**
    * @name dxChartSeriesTypes.CommonSeries.openvaluefield
    * @publicName openValueField
    * @type string
    * @default 'open'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    openValueField: 'open',
    /**
    * @name dxChartSeriesTypes.CommonSeries.highvaluefield
    * @publicName highValueField
    * @type string
    * @default 'high'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    highValueField: 'high',
    /**
    * @name dxChartSeriesTypes.CommonSeries.lowvaluefield
    * @publicName lowValueField
    * @type string
    * @default 'low'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    lowValueField: 'low',
    /**
    * @name dxChartSeriesTypes.CommonSeries.closevaluefield
    * @publicName closeValueField
    * @type string
    * @default 'close'
    * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
    * @notUsedInTheme
    */
    closeValueField: 'close',
    /**
    * @name dxChartSeriesTypes.CommonSeries.sizefield
    * @publicName sizeField
    * @type string
    * @default 'size'
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    sizeField: 'size',
    /**
    * @name dxChartSeriesTypes.CommonSeries.border
    * @publicName border
    * @type object
    * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes. StackeSplinedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
    */
    border: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes. StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes. FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        visible: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.width
        * @publicName width
        * @type number
        * @default 2
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes. StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        width: 2,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.color
        * @publicName color
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.border.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default undefined
            * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        dashStyle: undefined
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.hovermode
    * @publicName hoverMode
    * @type Enums.ChartSeriesHoverMode
        */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.CommonSeries.selectionmode
    * @publicName selectionMode
    * @type Enums.ChartSeriesSelectionMode
        */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.CommonSeries.hoverstyle
    * @publicName hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverstyle.width
        * @publicName width
        * @type number
        * @default 3
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        width: 3,
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverstyle.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
        */
        dashStyle: 'solid',
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverstyle.hatching
        * @publicName hatching
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.hatching.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.hatching.step
            * @publicName step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.hoverstyle.border
        * @publicName border
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.hoverstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.selectionstyle
    * @publicName selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionstyle.width
        * @publicName width
        * @type number
        * @default 3
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
        */
        width: 3,
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionstyle.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
        */
        dashStyle: 'solid',
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionstyle.hatching
        * @publicName hatching
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.hatching.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.hatching.step
            * @publicName step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.selectionstyle.border
        * @publicName border
        * @type object
        * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.selectionstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.point
    * @publicName point
    * @type object
    * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
    */
    point: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.hovermode
        * @publicName hoverMode
        * @type Enums.ChartPointInteractionMode
        * @default 'onlyPoint'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        hoverMode: 'onlyPoint',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.selectionmode
        * @publicName selectionMode
        * @type Enums.ChartPointInteractionMode
        * @default 'onlyPoint'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        selectionMode: 'onlyPoint',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.color
        * @publicName color
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.visible
        * @publicName visible
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible: true,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.symbol
        * @publicName symbol
        * @type Enums.PointSymbol
        * @default 'circle'
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        symbol: 'circle',
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.image
        * @publicName image
        * @type string|object
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        image: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.url
            * @publicName url
            * @type string|object
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            url: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.url.rangeminpoint
                * @publicName rangeMinPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.url.rangemaxpoint
                * @publicName rangeMaxPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.width
            * @publicName width
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            width: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.width.rangeminpoint
                * @publicName rangeMinPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.width.rangemaxpoint
                * @publicName rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.image.height
            * @publicName height
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            height: {
                /**
               * @name dxChartSeriesTypes.CommonSeries.point.image.height.rangeminpoint
               * @publicName rangeMinPoint
               * @type number
               * @default undefined
               * @propertyOf dxChartSeriesTypes.RangeAreaSeries
               */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.image.height.rangemaxpoint
                * @publicName rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes.RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.border
        * @publicName border
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.border.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.size
        * @publicName size
        * @type number
        * @default 12
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        size: 12,
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle
        * @publicName hoverStyle
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        hoverStyle: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.border
            * @publicName border
            * @type object
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            border: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default true
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                visible: true,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.border.width
                * @publicName width
                * @type number
                * @default 4
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                width: 4,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                color: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.hoverstyle.size
            * @publicName size
            * @type number
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            size: undefined
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle
        * @publicName selectionStyle
        * @type object
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        selectionStyle: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            color: undefined,
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.border
            * @publicName border
            * @type object
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            border: {
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default true
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                visible: true,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.border.width
                * @publicName width
                * @type number
                * @default 4
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                width: 4,
                /**
                * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
                */
                color: undefined
            },
            /**
            * @name dxChartSeriesTypes.CommonSeries.point.selectionstyle.size
            * @publicName size
            * @type number
            * @default undefined
            * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
            */
            size: undefined
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.showinlegend
    * @publicName showInLegend
    * @type boolean
    * @default true
    */
    showInLegend: true,
    /**
    * @name dxChartSeriesTypes.CommonSeries.maxlabelcount
    * @publicName maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.minbarsize
    * @publicName minBarSize
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
        */
    minBarSize: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.ignoreemptypoints
    * @publicName ignoreEmptyPoints
    * @type boolean
    * @default false
        */
    ignoreEmptyPoints: false,
    /**
    * @name dxChartSeriesTypes.CommonSeries.barpadding
    * @publicName barPadding
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
    */
    barPadding: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.barwidth
    * @publicName barWidth
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
    */
    barWidth: undefined,
    /**
    * @name dxChartSeriesTypes.CommonSeries.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.showforzerovalues
        * @publicName showForZeroValues
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
        */
        showForZeroValues: true,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.alignment
        * @publicName alignment
        * @type Enums.HorizontalAlignment
        * @default 'center'
                */
        alignment: 'center',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.rotationangle
        * @publicName rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.horizontaloffset
        * @publicName horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.verticaloffset
        * @publicName verticalOffset
        * @type number
        * @default 0
        */
        verticalOffset: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        * @propertyOf dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes. FullStackedSplineAreaSeries,dxChartSeriesTypes. FullStackedSplineSeries
        */
        percentPrecision: 0,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'outside'
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
        */
        position: 'outside',
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.font.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.font.size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxChartSeriesTypes.CommonSeries.label.connector
        * @publicName connector
        * @type object
        * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
        */
        connector: {
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes.CommonSeries.label.connector.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
            */
            color: undefined
        }
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.valueerrorbar
    * @publicName valueErrorBar
    * @type object
    * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
    */
    valueErrorBar: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.displaymode
        * @publicName displayMode
        * @type Enums.ValueErrorBarDisplayMode
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.lowvaluefield
        * @publicName lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.highvaluefield
        * @publicName highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.type
        * @publicName type
        * @type Enums.ValueErrorBarType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.value
        * @publicName value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.color
        * @publicName color
        * @type string
        * @default 'black'
        */
        color: 'black',
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.linewidth
        * @publicName lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.edgelength
        * @publicName edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxChartSeriesTypes.CommonSeries.valueerrorbar.opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined
    },
    /**
    * @name dxChartSeriesTypes.CommonSeries.aggregation
    * @publicName aggregation
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.method
        * @publicName method
        * @type Enums.ChartSeriesAggregationMethod
        */
        method: undefined,
        /**
        * @name dxChartSeriesTypes.CommonSeries.aggregation.calculate
        * @publicName calculate
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
* @name dxChartSeriesTypes.areaseries
* @publicName AreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var areaSeries = {
    /**
    * @name dxChartSeriesTypes.areaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.areaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.areaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.areaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.areaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.areaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.areaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.areaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.barseries
* @publicName BarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var barSeries = {
    /**
    * @name dxChartSeriesTypes.barseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.barseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.barseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.barseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.barseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.barseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.candlestickseries
* @publicName CandleStickSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var candlestickSeries = {
    /**
    * @name dxChartSeriesTypes.candlestickseries.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'date'
    */
    argumentField: 'date',
    /**
    * @name dxChartSeriesTypes.candlestickseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.candlestickseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.candlestickseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.candlestickseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.candlestickseries.hoverstyle
    * @publicName hoverStyle
    * @type object
    * @inheritdoc
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.candlestickseries.hoverstyle.hatching
        * @publicName hatching
        * @type object
        * @inheritdoc
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.candlestickseries.hoverstyle.hatching.direction
            * @publicName direction
            * @default 'none'
            * @type Enums.HatchingDirection
            * @inheritdoc
            */
            direction: 'none'
        }
    },
    /**
    * @name dxChartSeriesTypes.candlestickseries.selectionstyle
    * @publicName selectionStyle
    * @type object
    * @inheritdoc
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.candlestickseries.selectionstyle.hatching
        * @publicName hatching
        * @type object
        * @inheritdoc
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes.candlestickseries.selectionstyle.hatching.direction
            * @publicName direction
            * @default 'none'
            * @type Enums.HatchingDirection
            * @inheritdoc
            */
            direction: 'none'
        }
    },
    /**
    * @name dxChartSeriesTypes.candlestickseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.candlestickseries.aggregation.method
        * @publicName method
        * @type Enums.ChartFinancialSeriesAggregationMethod
        * @default 'ohlc'
        */
        method: "ohlc"
    }
};

/**
* @name dxChartSeriesTypes.fullstackedareaseries
* @publicName FullStackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var fullstackedareaSeries = {
    /**
    * @name dxChartSeriesTypes.fullstackedareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.fullstackedareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.fullstackedareaseries.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxChartSeriesTypes.fullstackedareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.fullstackedareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.fullstackedareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.fullstackedareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.fullstackedsplineareaseries
* @publicName FullStackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var fullstackedsplineareaSeries = {
    /**
    * @name dxChartSeriesTypes.fullstackedsplineareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.fullstackedsplineareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.fullstackedsplineareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.fullstackedsplineareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.fullstackedsplineareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedsplineareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.fullstackedsplineareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.fullstackedsplineareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.fullstackedbarseries
* @publicName FullStackedBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var fullstackedbarSeries = {
    /**
    * @name dxChartSeriesTypes.fullstackedbarseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.fullstackedbarseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.fullstackedbarseries.label.position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'inside'
        * @inheritdoc
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes.fullstackedbarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedbarseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedbarseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.fullstackedbarseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.fullstackedlineseries
* @publicName FullStackedLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var fullstackedlineSeries = {
    /**
    * @name dxChartSeriesTypes.fullstackedlineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.fullstackedlineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.fullstackedlineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedlineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.fullstackedlineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.fullstackedlineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.fullstackedsplineseries
* @publicName FullStackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var fullstackedsplineSeries = {
    /**
    * @name dxChartSeriesTypes.fullstackedsplineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.fullstackedsplineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.fullstackedsplineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.fullstackedsplineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.fullstackedsplineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.fullstackedsplineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};


/**
* @name dxChartSeriesTypes.lineseries
* @publicName LineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var lineSeries = {
    /**
    * @name dxChartSeriesTypes.lineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.lineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.lineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.lineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
   * @name dxChartSeriesTypes.lineseries.aggregation
   * @publicName aggregation
   * @inheritdoc
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.lineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.rangeareaseries
* @publicName RangeAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var rangeareaSeries = {
    /**
    * @name dxChartSeriesTypes.rangeareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.rangeareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.rangeareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.rangeareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.rangeareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.rangeareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.rangeareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.rangeareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartRangeSeriesAggregationMethod
        * @default 'range'
        */
        method: "range"
    }
};

/**
* @name dxChartSeriesTypes.rangebarseries
* @publicName RangeBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var rangebarSeries = {
    /**
    * @name dxChartSeriesTypes.rangebarseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.rangebarseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.rangebarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.rangebarseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.rangebarseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.rangebarseries.aggregation.method
        * @publicName method
        * @type Enums.ChartRangeSeriesAggregationMethod
        * @default 'range'
        */
        method: "range"
    }
};

/**
* @name dxChartSeriesTypes.scatterseries
* @publicName ScatterSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var scatterSeries = {
    /**
    * @name dxChartSeriesTypes.scatterseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.scatterseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
   * @name dxChartSeriesTypes.scatterseries.aggregation
   * @publicName aggregation
   * @inheritdoc
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.scatterseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.splineareaseries
* @publicName SplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var splineareaSeries = {
    /**
    * @name dxChartSeriesTypes.splineareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.splineareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.splineareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.splineareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.splineareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.splineareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.splineareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.splineareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.splineseries
* @publicName SplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var splineSeries = {
    /**
    * @name dxChartSeriesTypes.splineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.splineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.splineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.splineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.splineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.splineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stackedareaseries
* @publicName StackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stackedareaSeries = {
    /**
    * @name dxChartSeriesTypes.stackedareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stackedareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stackedareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.stackedareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.stackedareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.stackedareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.stackedareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stackedareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stackedsplineareaseries
* @publicName StackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stackedsplineareaSeries = {
    /**
    * @name dxChartSeriesTypes.stackedsplineareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stackedsplineareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stackedsplineareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.stackedsplineareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.stackedsplineareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.stackedsplineareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.stackedsplineareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stackedsplineareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stackedbarseries
* @publicName StackedBarSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stackedbarSeries = {
    /**
    * @name dxChartSeriesTypes.stackedbarseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stackedbarseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes.stackedbarseries.label.position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'inside'
        * @inheritdoc
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes.stackedbarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.stackedbarseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.stackedbarseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stackedbarseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'sum'
        */
        method: "sum"
    }
};

/**
* @name dxChartSeriesTypes.stackedlineseries
* @publicName StackedLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stackedlineSeries = {
    /**
    * @name dxChartSeriesTypes.stackedlineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stackedlineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stackedlineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.stackedlineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.stackedlineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stackedlineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stackedsplineseries
* @publicName StackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stackedsplineSeries = {
    /**
    * @name dxChartSeriesTypes.stackedsplineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stackedsplineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stackedsplineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.stackedsplineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.stackedsplineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stackedsplineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stepareaseries
* @publicName StepAreaSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stepareaSeries = {
    /**
    * @name dxChartSeriesTypes.stepareaseries.border
    * @publicName border
    * @type object
    * @inheritdoc
    */
    border: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.border.visible
        * @publicName visible
        * @type boolean
        * @default true
        * @inheritdoc
        */
        visible: true
    },
    /**
    * @name dxChartSeriesTypes.stepareaseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxChartSeriesTypes.stepareaseries.hoverstyle
    * @publicName hoverStyle
    * @type object
    * @inheritdoc
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.hoverstyle.border
        * @publicName border
        * @type object
        * @inheritdoc
        */
        border: {
            /**
            * @name dxChartSeriesTypes.stepareaseries.hoverstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default true
            * @inheritdoc
            */
            visible: true
        }
    },
    /**
    * @name dxChartSeriesTypes.stepareaseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stepareaseries.selectionStyle
    * @publicName selectionStyle
    * @type object
    * @inheritdoc
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.selectionStyle.border
        * @publicName border
        * @type object
        * @inheritdoc
        */
        border: {
            /**
            * @name dxChartSeriesTypes.stepareaseries.selectionstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @inheritdoc
            */
            visible: true
        }
    },
    /**
    * @name dxChartSeriesTypes.stepareaseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.stepareaseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.stepareaseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stepareaseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.steplineseries
* @publicName StepLineSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var steplineSeries = {
    /**
    * @name dxChartSeriesTypes.steplineseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.steplineseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.steplineseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxChartSeriesTypes.steplineseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints',
    /**
    * @name dxChartSeriesTypes.steplineseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.steplineseries.aggregation.method
        * @publicName method
        * @type Enums.ChartSingleValueSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};

/**
* @name dxChartSeriesTypes.stockseries
* @publicName StockSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var stockSeries = {
    /**
    * @name dxChartSeriesTypes.stockseries.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'date'
    */
    argumentField: 'date',
    /**
    * @name dxChartSeriesTypes.stockseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.stockseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.stockseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.stockseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
   * @name dxChartSeriesTypes.stockseries.aggregation
   * @publicName aggregation
   * @inheritdoc
   * @type object
   */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.stockseries.aggregation.method
        * @publicName method
        * @type Enums.ChartFinancialSeriesAggregationMethod
        * @default 'ohlc'
        */
        method: "ohlc"
    }
};
/**
* @name dxChartSeriesTypes.bubbleseries
* @publicName BubbleSeries
* @type object
* @inherits dxChartSeriesTypes.CommonSeries
* @hidePropertyOf
*/
var bubbleSeries = {
    /**
    * @name dxChartSeriesTypes.bubbleseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    label: {
        /**
        * @name dxChartSeriesTypes.bubbleseries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes.bubbleseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.bubbleseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes.bubbleseries.aggregation
    * @publicName aggregation
    * @inheritdoc
    * @type object
    */
    aggregation: {
        /**
        * @name dxChartSeriesTypes.bubbleseries.aggregation.method
        * @publicName method
        * @type Enums.ChartBubbleSeriesAggregationMethod
        * @default 'avg'
        */
        method: "avg"
    }
};
