/**
* @name dxChartSeriesTypes_CommonSeries
* @publicName CommonSeries
* @type object
* @hidden
*/
var commonSeries = {
    /**
	* @name dxChartSeriesTypes_CommonSeries_color
	* @publicName color
	* @type string
	* @default undefined
	*/
    color: undefined,
    /**
	* @name dxChartSeriesTypes_CommonSeries_visible
	* @publicName visible
	* @type boolean
	* @default true
	*/
    visible: true,
    /**
	* @name dxChartSeriesTypes_CommonSeries_innercolor
	* @publicName innerColor
	* @type string
	* @default '#ffffff'
	* @propertyOf dxChartSeriesTypes_CandleStickSeries
	*/
    innerColor: '#ffffff',
    /**
    * @name dxChartSeriesTypes_CommonSeries_opacity
    * @publicName opacity
    * @type number
    * @default 0.5
    * @propertyOf dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_ StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_ FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries
    */
    opacity: 0.5,
    /**
	* @name dxChartSeriesTypes_CommonSeries_reduction
	* @publicName reduction
	* @type object
	* @propertyOf dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_StockSeries
	*/
    reduction: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_reduction_color
		* @publicName color
		* @type string
		* @default '#ff0000'
		* @propertyOf dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_StockSeries
		*/
        color: '#ff0000',
        /**
		* @name dxChartSeriesTypes_CommonSeries_reduction_level
		* @publicName level
		* @type string
		* @default 'close'
		* @acceptValues 'close' | 'open' | 'low' | 'high'
		* @propertyOf dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_StockSeries
		*/
        level: 'close'
    },
    /**
	* @name dxChartSeriesTypes_CommonSeries_width
	* @publicName width
	* @type number
	* @default 2
	* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_CandleStickSeriesSeries,dxChartSeriesTypes_StockSeriesSeries
	*/
    width: 2,
    /**
	* @name dxChartSeriesTypes_CommonSeries_cornerradius
	* @publicName cornerRadius
	* @type number
	* @default 0
	* @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeriesSeries
	*/
    cornerRadius: 0,
    /**
	* @name dxChartSeriesTypes_CommonSeries_dashstyle
	* @publicName dashStyle
	* @type string
	* @default 'solid'
	* @acceptValues 'solid'|'longDash'|'dash'|'dot'
	* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries
	*/
    dashStyle: 'solid',
    /**
	* @name dxChartSeriesTypes_CommonSeries_stack
	* @publicName stack
	* @type string
	* @default 'default'
	* @propertyOf dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries
	*/
    stack: 'default',
    /**
	* @name dxChartSeriesTypes_CommonSeries_pane
	* @publicName pane
	* @type string
	* @default 'default'
	*/
    pane: 'default',
    /**
	* @name dxChartSeriesTypes_CommonSeries_axis
	* @publicName axis
	* @type string
	* @default undefined
	*/
    axis: undefined,
    /**
	* @name dxChartSeriesTypes_CommonSeries_valuefield
	* @publicName valueField
	* @type string
	* @default 'val'
    * @notUsedInTheme
    * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_ StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_ FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_BubbleSeries
	*/
    valueField: 'val',
    /**
	* @name dxChartSeriesTypes_CommonSeries_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'arg'
    * @notUsedInTheme
	*/
    argumentField: 'arg',
    /**
	* @name dxChartSeriesTypes_CommonSeries_tagfield
	* @publicName tagField
	* @type string
	* @default 'tag'
    * @notUsedInTheme
	*/
    tagField: 'tag',
    /**
	* @name dxChartSeriesTypes_CommonSeries_rangevalue1field
	* @publicName rangeValue1Field
	* @type string
	* @default 'val1'
    * @notUsedInTheme
	* @propertyOf dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_RangeAreaSeries
	*/
    rangeValue1Field: 'val1',
    /**
	* @name dxChartSeriesTypes_CommonSeries_rangevalue2field
	* @publicName rangeValue2Field
	* @type string
	* @default 'val2'
    * @notUsedInTheme
	* @propertyOf dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_RangeAreaSeries
	*/
    rangeValue2Field: 'val2',
    /**
	* @name dxChartSeriesTypes_CommonSeries_openvaluefield
	* @publicName openValueField
	* @type string
	* @default 'open'
	* @propertyOf dxChartSeriesTypes_StockSeries,dxChartSeriesTypes_CandleStickSeries
    * @notUsedInTheme
	*/
    openValueField: 'open',
    /**
	* @name dxChartSeriesTypes_CommonSeries_highvaluefield
	* @publicName highValueField
	* @type string
	* @default 'high'
	* @propertyOf dxChartSeriesTypes_StockSeries,dxChartSeriesTypes_CandleStickSeries
    * @notUsedInTheme
	*/
    highValueField: 'high',
    /**
	* @name dxChartSeriesTypes_CommonSeries_lowvaluefield
	* @publicName lowValueField
	* @type string
	* @default 'low'
	* @propertyOf dxChartSeriesTypes_StockSeries,dxChartSeriesTypes_CandleStickSeries
    * @notUsedInTheme
	*/
    lowValueField: 'low',
    /**
	* @name dxChartSeriesTypes_CommonSeries_closevaluefield
	* @publicName closeValueField
	* @type string
	* @default 'close'
	* @propertyOf dxChartSeriesTypes_StockSeries,dxChartSeriesTypes_CandleStickSeries
    * @notUsedInTheme
	*/
    closeValueField: 'close',
    /**
    * @name dxChartSeriesTypes_CommonSeries_sizefield
    * @publicName sizeField
    * @type string
    * @default 'size'
    * @propertyOf dxChartSeriesTypes_BubbleSeries
    */
    sizeField: 'size',
    /**
	* @name dxChartSeriesTypes_CommonSeries_border
	* @publicName border
	* @type object
	* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_ StackeSplinedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
	*/
    border: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_border_visible
		* @publicName visible
		* @type boolean
		* @default false
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_ StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_ FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
		*/
        visible: false,
        /**
		* @name dxChartSeriesTypes_CommonSeries_border_width
		* @publicName width
		* @type number
		* @default 2
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_ StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
		*/
        width: 2,
        /**
		* @name dxChartSeriesTypes_CommonSeries_border_color
		* @publicName color
		* @type string
		* @default undefined
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
		*/
        color: undefined,
        /**
	    * @name dxChartSeriesTypes_CommonSeries_border_dashstyle
	    * @publicName dashStyle
	    * @type string
	    * @default undefined
	    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
	    * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
	    */
        dashStyle: undefined
    },
    /**
	* @name dxChartSeriesTypes_CommonSeries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'onlyPoint'|'allSeriesPoints'|'allArgumentPoints'|'nearestPoint'|'includePoints'|'excludePoints'|'none'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_CommonSeries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint'|'allSeriesPoints'|'allArgumentPoints'|'includePoints'|'excludePoints'|'none'
	*/
    selectionMode: 'includePoints',
    /**
	* @name dxChartSeriesTypes_CommonSeries_hoverstyle
	* @publicName hoverStyle
	* @type object
	*/
    hoverStyle: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_hoverstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxChartSeriesTypes_CommonSeries_hoverstyle_width
		* @publicName width
		* @type number
		* @default 3
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_StockSeries
		*/
        width: 3,
        /**
		* @name dxChartSeriesTypes_CommonSeries_hoverstyle_dashstyle
		* @publicName dashStyle
		* @type string
		* @default 'solid'
		* @acceptValues 'solid'|'longDash'|'dash'|'dot'
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries
		*/
        dashStyle: 'solid',
        /**
		* @name dxChartSeriesTypes_CommonSeries_hoverstyle_hatching
		* @publicName hatching
		* @type object
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_BubbleSeries
		*/
        hatching: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'right'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_width
			* @publicName width
			* @type number
			* @default 2
			*/
            width: 2,
            /**
			* @name dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_step
			* @publicName step
			* @type number
			* @default 6
			*/
            step: 6,
            /**
            * @name dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
		* @name dxChartSeriesTypes_CommonSeries_hoverstyle_border
		* @publicName border
		* @type object
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
		*/
        border: {
            /**
			* @name dxChartSeriesTypes_CommonSeries_hoverstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxChartSeriesTypes_CommonSeries_hoverstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxChartSeriesTypes_CommonSeries_hoverstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
		    * @name dxChartSeriesTypes_CommonSeries_hoverstyle_border_dashstyle
		    * @publicName dashStyle
		    * @type string
		    * @default 'solid'
		    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
		    */
            dashStyle: 'solid'
        }
    },
    /**
	* @name dxChartSeriesTypes_CommonSeries_selectionstyle
	* @publicName selectionStyle
	* @type object
	*/
    selectionStyle: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_selectionstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxChartSeriesTypes_CommonSeries_selectionstyle_width
		* @publicName width
		* @type number
		* @default 3
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_StockSeries
		*/
        width: 3,
        /**
		* @name dxChartSeriesTypes_CommonSeries_selectionstyle_dashstyle
		* @publicName dashStyle
		* @type string
		* @default 'solid'
		* @acceptValues 'solid'|'longDash'|'dash'|'dot'
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries
		*/
        dashStyle: 'solid',
        /**
		* @name dxChartSeriesTypes_CommonSeries_selectionstyle_hatching
		* @publicName hatching
		* @type object
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_CandleStickSeries,dxChartSeriesTypes_BubbleSeries
		*/
        hatching: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'right'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_width
			* @publicName width
			* @type number
			* @default 2
			*/
            width: 2,
            /**
			* @name dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_step
			* @publicName step
			* @type number
			* @default 6
			*/
            step: 6,
            /**
            * @name dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
		* @name dxChartSeriesTypes_CommonSeries_selectionstyle_border
		* @publicName border
		* @type object
		* @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_BubbleSeries
		*/
        border: {
            /**
			* @name dxChartSeriesTypes_CommonSeries_selectionstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxChartSeriesTypes_CommonSeries_selectionstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxChartSeriesTypes_CommonSeries_selectionstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
		    * @name dxChartSeriesTypes_CommonSeries_selectionstyle_border_dashstyle
		    * @publicName dashStyle
		    * @type string
		    * @default 'solid'
		    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
		    */
            dashStyle: 'solid'
        }
    },
    /**
	* @name dxChartSeriesTypes_CommonSeries_point
	* @publicName point
	* @type object
	* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
	*/
    point: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_hovermode
		* @publicName hoverMode
		* @type string
		* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
        * @default 'onlyPoint'
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        hoverMode: 'onlyPoint',
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_selectionmode
		* @publicName selectionMode
		* @type string
		* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
        * @default 'onlyPoint'
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        selectionMode: 'onlyPoint',
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_color
		* @publicName color
		* @type string
		* @default undefined
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        color: undefined,
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_visible
		* @publicName visible
		* @type boolean
		* @default true
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        visible: true,
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_symbol
		* @publicName symbol
		* @type string
		* @default 'circle'
		* @acceptValues 'circle' | 'square' | 'polygon' | 'triangleDown' | 'triangleUp' | 'cross'
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        symbol: 'circle',
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_image
		* @publicName image
		* @type string|object
		* @default undefined
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
        */
        image: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_point_image_url
            * @publicName url
            * @type string|object
            * @default undefined
            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
            */
            url: {
                /**
                * @name dxChartSeriesTypes_CommonSeries_point_image_url_rangeminpoint
                * @publicName rangeMinPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes_RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes_CommonSeries_point_image_url_rangemaxpoint
                * @publicName rangeMaxPoint
                * @type string
                * @default undefined
                * @propertyOf dxChartSeriesTypes_RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes_CommonSeries_point_image_width
            * @publicName width
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
            */
            width: {
                /**
                * @name dxChartSeriesTypes_CommonSeries_point_image_width_rangeminpoint
                * @publicName rangeMinPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes_RangeAreaSeries
                */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes_CommonSeries_point_image_width_rangemaxpoint
                * @publicName rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes_RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
            /**
            * @name dxChartSeriesTypes_CommonSeries_point_image_height
            * @publicName height
            * @type number|object
            * @default 30
            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
            */
            height: {
                /**
               * @name dxChartSeriesTypes_CommonSeries_point_image_height_rangeminpoint
               * @publicName rangeMinPoint
               * @type number
               * @default undefined
               * @propertyOf dxChartSeriesTypes_RangeAreaSeries
               */
                rangeMinPoint: undefined,
                /**
                * @name dxChartSeriesTypes_CommonSeries_point_image_height_rangemaxpoint
                * @publicName rangeMaxPoint
                * @type number
                * @default undefined
                * @propertyOf dxChartSeriesTypes_RangeAreaSeries
                */
                rangeMaxPoint: undefined
            },
        },
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_border
		* @publicName border
		* @type object
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        border: {
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            visible: false,
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_border_width
			* @publicName width
			* @type number
			* @default 1
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            width: 1,
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_border_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            color: undefined
        },
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_size
		* @publicName size
		* @type number
		* @default 12
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        size: 12,
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle
		* @publicName hoverStyle
		* @type object
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        hoverStyle: {
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            color: undefined,
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_border
			* @publicName border
			* @type object
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            border: {
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_visible
				* @publicName visible
				* @type boolean
				* @default true
	            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                visible: true,
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_width
				* @publicName width
				* @type number
				* @default 4
	            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                width: 4,
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_color
				* @publicName color
				* @type string
				* @default undefined
	            * @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                color: undefined
            },
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_hoverstyle_size
			* @publicName size
			* @type number
			* @default undefined
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            size: undefined
        },
        /**
		* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle
		* @publicName selectionStyle
		* @type object
		* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
		*/
        selectionStyle: {
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            color: undefined,
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_border
			* @publicName border
			* @type object
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            border: {
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_visible
				* @publicName visible
				* @type boolean
				* @default true
				* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                visible: true,
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_width
				* @publicName width
				* @type number
				* @default 4
				* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                width: 4,
                /**
				* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_color
				* @publicName color
				* @type string
				* @default undefined
				* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
				*/
                color: undefined
            },
            /**
			* @name dxChartSeriesTypes_CommonSeries_point_selectionstyle_size
			* @publicName size
			* @type number
			* @default undefined
			* @propertyOf dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StepLineSeries,dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_ScatterSeries
			*/
            size: undefined
        }
    },
    /**
	* @name dxChartSeriesTypes_CommonSeries_showinlegend
	* @publicName showInLegend
	* @type boolean
	* @default true
	*/
    showInLegend: true,
    /**
	* @name dxChartSeriesTypes_CommonSeries_maxlabelcount
	* @publicName maxLabelCount
	* @type number
	* @default undefined
	*/
    maxLabelCount: undefined,
    /**
	* @name dxChartSeriesTypes_CommonSeries_minbarsize
	* @publicName minBarSize
	* @type number
	* @default undefined
	* @propertyOf dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_BarSeries
		*/
    minBarSize: undefined,
    /**
	* @name dxChartSeriesTypes_CommonSeries_ignoreemptypoints
	* @publicName ignoreEmptyPoints
	* @type boolean
	* @default false
		*/
    ignoreEmptyPoints: false,
    /**
	* @name dxChartSeriesTypes_CommonSeries_label
	* @publicName label
	* @type object
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_visible
		* @publicName visible
		* @type boolean
		* @default false
		*/
        visible: false,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_showforzerovalues
		* @publicName showForZeroValues
		* @type boolean
		* @default true
		* @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries
		*/
        showForZeroValues: true,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_alignment
		* @publicName alignment
		* @type string
		* @default 'center'
		* @acceptValues 'left' | 'center' | 'right'
		*/
        alignment: 'center',
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_rotationangle
		* @publicName rotationAngle
		* @type number
		* @default 0
		*/
        rotationAngle: 0,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_horizontaloffset
		* @publicName horizontalOffset
		* @type number
		* @default 0
		*/
        horizontalOffset: 0,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_verticaloffset
		* @publicName verticalOffset
		* @type number
		* @default 0
		*/
        verticalOffset: 0,
        /**
		* @name dxChartSeriesTypes_CommonSeries_label_format
		* @publicName format
		* @extends CommonVizFormat
		*/
        format: '',
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        * @propertyOf dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_ FullStackedSplineAreaSeries,dxChartSeriesTypes_ FullStackedSplineSeries
        */
        percentPrecision: 0,
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_position
        * @publicName position
        * @type string
        * @default 'outside'
        * @acceptValues 'outside' | 'inside'
        * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_BubbleSeries
        */
        position: 'outside',
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_font_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_font_size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_border_color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxChartSeriesTypes_CommonSeries_label_connector
        * @publicName connector
        * @type object
        * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_StepLineSeries
        */
        connector: {
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_connector_visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_StepLineSeries
            */
            visible: false,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_connector_width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_StepLineSeries
            */
            width: 1,
            /**
            * @name dxChartSeriesTypes_CommonSeries_label_connector_color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_RangeAreaSeries,dxChartSeriesTypes_RangeBarSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_SplineSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_StepLineSeries
            */
            color: undefined
        }
    },
    /**
    * @name dxChartSeriesTypes_CommonSeries_valueerrorbar
    * @publicName valueErrorBar
    * @type object
    * @propertyOf dxChartSeriesTypes_AreaSeries,dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_LineSeries,dxChartSeriesTypes_ScatterSeries,dxChartSeriesTypes_SplineAreaSeries,dxChartSeriesTypes_StepAreaSeries,dxChartSeriesTypes_StepLineSeries
    */
    valueErrorBar: {
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_displaymode
        * @publicName displayMode
        * @type string
        * @acceptValues 'auto' | 'low' | 'high' | 'none'
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_lowvaluefield
        * @publicName lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_highvaluefield
        * @publicName highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_type
        * @publicName type
        * @type string
        * @default undefined
        * @acceptValues 'percent' | 'stdError' | 'stdDeviation' | 'variance' | 'fixed'
        */
        type: undefined,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_value
        * @publicName value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_color
        * @publicName color
        * @type string
        * @default 'black'
        */
        color: 'black',
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_linewidth
        * @publicName lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_edgelength
        * @publicName edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxChartSeriesTypes_CommonSeries_valueerrorbar_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined
    }

};

/**
* @name dxChartSeriesTypes_areaseries
* @publicName AreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var areaSeries = {
    /**
	* @name dxChartSeriesTypes_areaseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_areaseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_areaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
		* @name dxChartSeriesTypes_areaseries_point_visible
		* @publicName visible
		* @type boolean
		* @default false
		* @extend_doc
		*/
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_areaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_areaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_barseries
* @publicName BarSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var barSeries = {
    /**
	* @name dxChartSeriesTypes_barseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_barseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_barseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_barseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};

/**
* @name dxChartSeriesTypes_candlestickseries
* @publicName CandleStickSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var candlestickSeries = {
    /**
	* @name dxChartSeriesTypes_candlestickseries_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'date'
	*/
    argumentField: 'date',
    /**
	* @name dxChartSeriesTypes_candlestickseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_candlestickseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_candlestickseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_candlestickseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint',
    /**
    * @name dxChartSeriesTypes_candlestickseries_hoverstyle
    * @publicName hoverStyle
    * @type object
    * @extend_doc
    */
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes_candlestickseries_hoverstyle_hatching
        * @publicName hatching
        * @type object
        * @extend_doc
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes_candlestickseries_hoverstyle_hatching_direction
            * @publicName direction
            * @default 'none'
            * @type string
            * @extend_doc
            */
            direction: 'none'
        }
    },
    /**
    * @name dxChartSeriesTypes_candlestickseries_selectionstyle
    * @publicName selectionStyle
    * @type object
    * @extend_doc
    */
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes_candlestickseries_selectionstyle_hatching
        * @publicName hatching
        * @type object
        * @extend_doc
        */
        hatching: {
            /**
            * @name dxChartSeriesTypes_candlestickseries_selectionstyle_hatching_direction
            * @publicName direction
            * @default 'none'
            * @type string
            * @extend_doc
            */
            direction: 'none'
        }
    }
};

/**
* @name dxChartSeriesTypes_fullstackedareaseries
* @publicName FullStackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var fullstackedareaSeries = {
    /**
	* @name dxChartSeriesTypes_fullstackedareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_fullstackedareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_fullstackedareaseries_label
	* @publicName label
	* @type object
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_fullstackedareaseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_fullstackedareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_fullstackedareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_fullstackedsplineareaseries
* @publicName FullStackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var fullstackedsplineareaSeries = {
    /**
	* @name dxChartSeriesTypes_fullstackedsplineareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_fullstackedsplineareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_fullstackedsplineareaseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_fullstackedsplineareaseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_fullstackedsplineareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_fullstackedsplineareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_fullstackedbarseries
* @publicName FullStackedBarSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var fullstackedbarSeries = {
    /**
	* @name dxChartSeriesTypes_fullstackedbarseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_fullstackedbarseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes_fullstackedbarseries_label_position
        * @publicName position
        * @type string
        * @default 'inside'
        * @extend_doc
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes_fullstackedbarseries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_fullstackedbarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint',
};

/**
* @name dxChartSeriesTypes_fullstackedlineseries
* @publicName FullStackedLineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var fullstackedlineSeries = {
    /**
	* @name dxChartSeriesTypes_fullstackedlineseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_fullstackedlineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_fullstackedlineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_fullstackedlineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_fullstackedsplineseries
* @publicName FullStackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var fullstackedsplineSeries = {
    /**
	* @name dxChartSeriesTypes_fullstackedsplineseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_fullstackedsplineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_fullstackedsplineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_fullstackedsplineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};


/**
* @name dxChartSeriesTypes_lineseries
* @publicName LineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var lineSeries = {
    /**
	* @name dxChartSeriesTypes_lineseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_lineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_lineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_lineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_rangeareaseries
* @publicName RangeAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var rangeareaSeries = {
    /**
	* @name dxChartSeriesTypes_rangeareaseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_rangeareaseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_rangeareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_rangeareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_rangeareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_rangeareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_rangebarseries
* @publicName RangeBarSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var rangebarSeries = {
    /**
	* @name dxChartSeriesTypes_rangebarseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_rangebarseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes_rangebarseries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_rangebarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};

/**
* @name dxChartSeriesTypes_scatterseries
* @publicName ScatterSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var scatterSeries = {
    /**
	* @name dxChartSeriesTypes_scatterseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_scatterseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    }
};

/**
* @name dxChartSeriesTypes_splineareaseries
* @publicName SplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var splineareaSeries = {
    /**
	* @name dxChartSeriesTypes_splineareaseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_splineareaseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_splineareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_splineareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_splineareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_splineareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_splineseries
* @publicName SplineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var splineSeries = {
    /**
	* @name dxChartSeriesTypes_splineseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_splineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_splineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_splineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stackedareaseries
* @publicName StackedAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stackedareaSeries = {
    /**
	* @name dxChartSeriesTypes_stackedareaseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
        * @name dxChartSeriesTypes_stackedareaseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_stackedareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_stackedareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_stackedareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_stackedareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stackedsplineareaseries
* @publicName StackedSplineAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stackedsplineareaSeries = {
    /**
    * @name dxChartSeriesTypes_stackedsplineareaseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_stackedsplineareaseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_stackedsplineareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
        * @name dxChartSeriesTypes_stackedsplineareaseries_point_visible
        * @publicName visible
        * @type boolean
        * @default false
        * @extend_doc
        */
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_stackedsplineareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_stackedsplineareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stackedbarseries
* @publicName StackedBarSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stackedbarSeries = {
    /**
    * @name dxChartSeriesTypes_stackedbarseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_stackedbarseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartSeriesTypes_stackedbarseries_label_position
        * @publicName position
        * @type string
        * @default 'inside'
        * @extend_doc
        */
        position: 'inside'
    },
    /**
    * @name dxChartSeriesTypes_stackedbarseries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_stackedbarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};

/**
* @name dxChartSeriesTypes_stackedlineseries
* @publicName StackedLineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stackedlineSeries = {
    /**
    * @name dxChartSeriesTypes_stackedlineseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_stackedlineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_stackedlineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_stackedlineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stackedsplineseries
* @publicName StackedSplineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stackedsplineSeries = {
    /**
    * @name dxChartSeriesTypes_stackedsplineseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_stackedsplineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_stackedsplineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_stackedsplineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stepareaseries
* @publicName StepAreaSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stepareaSeries = {
    /**
    * @name dxChartSeriesTypes_stepareaseries_border
    * @publicName border
    * @type object
    * @extend_doc
    */
    border: {
        /**
        * @name dxChartSeriesTypes_stepareaseries_border_visible
        * @publicName visible
        * @type boolean
        * @default true
        * @extend_doc
        */
        visible: true
    },
    /**
	* @name dxChartSeriesTypes_stepareaseries_point
	* @publicName point
	* @type object
    * @extend_doc
    **/
    point: {
        /**
		* @name dxChartSeriesTypes_stepareaseries_point_visible
		* @publicName visible
		* @type boolean
		* @default false
		* @extend_doc
		*/
        visible: false
    },
    /**
	* @name dxChartSeriesTypes_stepareaseries_hoverstyle
	* @publicName hoverStyle
	* @type object
	* @extend_doc
	*/
    hoverStyle: {
        /**
        * @name dxChartSeriesTypes_stepareaseries_hoverstyle_border
        * @publicName border
	    * @type object
        * @extend_doc
        */
        border: {
            /**
            * @name dxChartSeriesTypes_stepareaseries_hoverstyle_border_visible
            * @publicName visible
            * @type boolean
            * @default true
            * @extend_doc
            */
            visible: true
        }
    },
    /**
    * @name dxChartSeriesTypes_stepareaseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_stepareaseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_stepareaseries_selectionStyle
	* @publicName selectionStyle
	* @type object
	* @extend_doc
	*/
    selectionStyle: {
        /**
        * @name dxChartSeriesTypes_stepareaseries_selectionStyle_border
        * @publicName border
	    * @type object
        * @extend_doc
        */
        border: {
            /**
            * @name dxChartSeriesTypes_stepareaseries_selectionstyle_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            * @extend_doc
            */
            visible: true
        }
    },
    /**
	* @name dxChartSeriesTypes_stepareaseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_stepareaseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_steplineseries
* @publicName StepLineSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var steplineSeries = {
    /**
    * @name dxChartSeriesTypes_steplineseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    label: {
        /**
        * @name dxChartSeriesTypes_steplineseries_label_customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_steplineseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxChartSeriesTypes_steplineseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxChartSeriesTypes_stockseries
* @publicName StockSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var stockSeries = {
    /**
	* @name dxChartSeriesTypes_stockseries_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'date'
	*/
    argumentField: 'date',
    /**
	* @name dxChartSeriesTypes_stockseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_stockseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
    * @name dxChartSeriesTypes_stockseries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_stockseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};
/**
* @name dxChartSeriesTypes_bubbleseries
* @publicName BubbleSeries
* @type object
* @inherits dxChartSeriesTypes_CommonSeries
* @hidePropertyOf
*/
var bubbleSeries = {
    /**
	* @name dxChartSeriesTypes_bubbleseries_label
	* @publicName label
	* @type object
	* @extend_doc
	*/
    label: {
        /**
		* @name dxChartSeriesTypes_bubbleseries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined
    },
    /**
	* @name dxChartSeriesTypes_bubbleseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    hoverMode: 'onlyPoint',
    /**
	* @name dxChartSeriesTypes_bubbleseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};
