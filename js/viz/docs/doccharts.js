/**
* @name dxChart
* @inherits BaseChart
* @module viz/chart
* @export default
*/
var dxChart = {
    /**
    * @name dxChartOptions.seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxChartOptions.seriesTemplate.nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxChartOptions.seriesTemplate.customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return ChartSeries
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxChartOptions.resolveLabelOverlapping
    * @type Enums.ChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxChartOptions.seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxChartOptions.containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxChartOptions.onSeriesClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesClick: function() {},
    /**
    * @name dxChartOptions.onLegendClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxChartOptions.equalBarWidth
    * @type boolean
    * @deprecated dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxChartOptions.barWidth
    * @type number
    * @deprecated dxChartSeriesTypes.CommonSeries.barPadding
    */
    barWidth: undefined,
    /**
    * @name dxChartOptions.barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxChartOptions.barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
    */
    barGroupWidth: undefined,
    /**
    * @name dxChartOptions.negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
    */
    negativesAsZeroes: false,
    /**
    * @name dxChartOptions.commonSeriesSettings
    * @type object
    * @inherits dxChartSeriesTypes.CommonSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxChartOptions.commonSeriesSettings.type
        * @type Enums.SeriesType
        * @default 'line'
        */
        type: 'line',
        /**
        * @name dxChartOptions.commonSeriesSettings.line
        * @type object
        */
        line: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.fullstackedline
        * @type object
        */
        fullstackedline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.fullstackedspline
        * @type object
        */
        fullstackedspline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stackedline
        * @type object
        */
        stackedline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stackedspline
        * @type object
        */
        stackedspline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stepline
        * @type object
        */
        stepline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.area
        * @type object
        */
        area: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.fullstackedarea
        * @type object
        */
        fullstackedarea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.fullstackedsplinearea
        * @type object
        */
        fullstackedsplinearea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stackedarea
        * @type object
        */
        stackedarea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stackedsplinearea
        * @type object
        */
        stackedsplinearea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.steparea
        * @type object
        */
        steparea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.bar
        * @type object
        */
        bar: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.fullstackedbar
        * @type object
        */
        fullstackedbar: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.spline
        * @type object
        */
        spline: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.splinearea
        * @type object
        */
        splinearea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.scatter
        * @type object
        */
        scatter: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.candlestick
        * @type object
        */
        candlestick: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.stock
        * @type object
        */
        stock: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.rangebar
        * @type object
        */
        rangebar: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.rangearea
        * @type object
        */
        rangearea: {},
        /**
        * @name dxChartOptions.commonSeriesSettings.bubble
        * @type object
        */
        bubble: {}
    },
    /**
    * @name dxChartOptions.defaultPane
    * @type string
    * @default undefined
    * @notUsedInTheme
    */
    defaultPane: undefined,
    /**
    * @name dxChartOptions.resizePanesOnZoom
    * @type boolean
    * @default false
    */
    resizePanesOnZoom: false,
    /**
    * @name dxChartOptions.adjustOnZoom
    * @type boolean
    * @default true
    */
    adjustOnZoom: true,
    /**
    * @name dxChartOptions.autoHidePointMarkers
    * @type boolean
    * @default true
    */
    autoHidePointMarkers: true,
    /**
    * @name dxChartOptions.rotated
    * @type boolean
    * @default false
    */
    rotated: false,
    /**
    * @name dxChartOptions.synchronizeMultiAxes
    * @type boolean
    * @default true
    */
    synchronizeMultiAxes: true,
    /**
    * @name dxChartOptions.commonPaneSettings
    * @type object
    */
    commonPaneSettings: {
        /**
        * @name dxChartOptions.commonPaneSettings.backgroundColor
        * @type string
        * @default 'none'
        */
        backgroundColor: 'none',
        /**
        * @name dxChartOptions.commonPaneSettings.border
        * @type object
        */
        border: {
            /**
            * @name dxChartOptions.commonPaneSettings.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartOptions.commonPaneSettings.border.top
            * @type boolean
            * @default true
            */
            top: true,
            /**
            * @name dxChartOptions.commonPaneSettings.border.bottom
            * @type boolean
            * @default true
            */
            bottom: true,
            /**
            * @name dxChartOptions.commonPaneSettings.border.left
            * @type boolean
            * @default true
            */
            left: true,
            /**
            * @name dxChartOptions.commonPaneSettings.border.right
            * @type boolean
            * @default true
            */
            right: true,
            /**
            * @name dxChartOptions.commonPaneSettings.border.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartOptions.commonPaneSettings.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxChartOptions.commonPaneSettings.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonPaneSettings.border.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxChartOptions.panes
    * @type Object|Array<Object>
    * @inherits dxChartOptions.commonPaneSettings
    * @notUsedInTheme
    */
    panes: [{
        /**
        * @name dxChartOptions.panes.name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxChartOptions.panes.height
        * @type number|string
        * @default undefined
        */
        height: undefined
    }],
    /**
    * @name dxChartOptions.dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxChartOptions.dataPrepareSettings.checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxChartOptions.dataPrepareSettings.convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxChartOptions.dataPrepareSettings.sortingMethod
        * @type boolean|function(a,b)
        * @type_function_param1 a:object
        * @type_function_param2 b:object
        * @type_function_return Number
        * @default true
        */
        sortingMethod: true
    },
    /**
    * @name dxChartOptions.scrollBar
    * @type object
    */
    scrollBar: {
        /**
        * @name dxChartOptions.scrollBar.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxChartOptions.scrollBar.offset
        * @type number
        * @default 5
        */
        offset: 5,
        /**
        * @name dxChartOptions.scrollBar.color
        * @type string
        * @default 'gray'
        */
        color: "gray",
       /**
       * @name dxChartOptions.scrollBar.width
       * @type number
       * @default 10
       */
        width: 10,
       /**
       * @name dxChartOptions.scrollBar.opacity
       * @type number
       * @default undefined
       */
        opacity: undefined,
        /**
       * @name dxChartOptions.scrollBar.position
       * @type Enums.Position
       * @default 'top'
       */
        position: 'top'
    },
    /**
    * @name dxChartOptions.zoomAndPan
    * @type object
    */
    zoomAndPan: {
        /**
        * @name dxChartOptions.zoomAndPan.valueAxis
        * @type Enums.ChartZoomAndPanMode
        * @default 'none'
        */
        valueAxis: 'none',
        /**
        * @name dxChartOptions.zoomAndPan.argumentAxis
        * @type Enums.ChartZoomAndPanMode
        * @default 'none'
        */
        argumentAxis: 'none',
        /**
        * @name dxChartOptions.zoomAndPan.dragToZoom
        * @type boolean
        * @default false
        */
        dragToZoom: false,
        /**
        * @name dxChartOptions.zoomAndPan.dragBoxStyle
        * @type object
        */
        dragBoxStyle: {
            /**
            * @name dxChartOptions.zoomAndPan.dragBoxStyle.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartOptions.zoomAndPan.dragBoxStyle.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxChartOptions.zoomAndPan.panKey
        * @type Enums.EventKeyModifier
        * @default 'shift'
        */
        panKey: 'shift',
        /**
        * @name dxChartOptions.zoomAndPan.allowMouseWheel
        * @type boolean
        * @default true
        */
        allowMouseWheel: true,
        /**
        * @name dxChartOptions.zoomAndPan.allowTouchGestures
        * @type boolean
        * @default true
        */
       allowTouchGestures: true
    },
    /**
    * @name dxChartOptions.zoomingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    * @deprecated dxChartOptions.zoomAndPan
    */
    zoomingMode: 'none',
    /**
    * @name dxChartOptions.scrollingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    * @deprecated dxChartOptions.zoomAndPan
    */
    scrollingMode: 'none',
    /**
    * @name dxChartOptions.stickyHovering
    * @type boolean
    * @default true
    */
    stickyHovering: true,
    /**
    * @name dxChartOptions.useAggregation
    * @type boolean
    * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
    */
    useAggregation: false,
    /**
    * @name dxChartOptions.crosshair
    * @type object
    */
    crosshair: {
        /**
        * @name dxChartOptions.crosshair.enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name dxChartOptions.crosshair.color
        * @type string
        * @default '#f05b41'
        */
        color: '#f05b41',
        /**
        * @name dxChartOptions.crosshair.width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxChartOptions.crosshair.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle: 'solid',
        /**
        * @name dxChartOptions.crosshair.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxChartOptions.crosshair.label
        * @type object
        */
        label: {
            /**
            * @name dxChartOptions.crosshair.label.backgroundColor
            * @type string
            * @default "#f05b41"
            */
            backgroundColor: "#f05b41",
            /**
             * @name dxChartOptions.crosshair.label.visible
             * @type boolean
             * @default false
             */
            visible: false,
            /**
            * @name dxChartOptions.crosshair.label.font
            * @type Font
            * @default '#FFFFFF' @prop color
             */
            font: {
                family: undefined,
                weight: 400,
                color: '#FFFFFF',
                size: 12,
                opacity: undefined
            },
            /**
           * @name dxChartOptions.crosshair.label.format
           * @extends CommonVizFormat
           */
            format: '',
            /**
            * @name dxChartOptions.crosshair.label.customizeText
            * @type function(info)
            * @type_function_param1 info:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_param1_field3 point:chartPointObject
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined
        },
        /**
        * @name dxChartOptions.crosshair.verticalLine
        * @type object | boolean
        */
        verticalLine: {
            /**
            * @name dxChartOptions.crosshair.verticalLine.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxChartOptions.crosshair.verticalLine.color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxChartOptions.crosshair.verticalLine.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.crosshair.verticalLine.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxChartOptions.crosshair.verticalLine.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxChartOptions.crosshair.verticalLine.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.crosshair.verticalLine.label.backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxChartOptions.crosshair.verticalLine.label.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                * @name dxChartOptions.crosshair.verticalLine.label.font
                * @type Font
                * @default '#FFFFFF' @prop color
                 */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#FFFFFF',
                    size: 12,
                    opacity: undefined
                },
                /**
                * @name dxChartOptions.crosshair.verticalLine.label.format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxChartOptions.crosshair.verticalLine.label.customizeText
                * @type function(info)
                * @type_function_param1 info:object
                * @type_function_param1_field1 value:Date|Number|string
                * @type_function_param1_field2 valueText:string
                * @type_function_param1_field3 point:chartPointObject
                * @type_function_return string
                * @notUsedInTheme
                */
                customizeText: undefined,
            }
        },
        /**
        * @name dxChartOptions.crosshair.horizontalLine
        * @type object | boolean
        */
        horizontalLine: {
            /**
            * @name dxChartOptions.crosshair.horizontalLine.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxChartOptions.crosshair.horizontalLine.color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxChartOptions.crosshair.horizontalLine.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.crosshair.horizontalLine.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxChartOptions.crosshair.horizontalLine.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxChartOptions.crosshair.horizontalLine.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.crosshair.horizontalLine.label.backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxChartOptions.crosshair.horizontalLine.label.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                * @name dxChartOptions.crosshair.horizontalLine.label.font
                * @type Font
                * @default '#FFFFFF' @prop color
                 */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#FFFFFF',
                    size: 12,
                    opacity: undefined
                },
                /**
                * @name dxChartOptions.crosshair.horizontalLine.label.format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxChartOptions.crosshair.horizontalLine.label.customizeText
                * @type function(info)
                * @type_function_param1 info:object
                * @type_function_param1_field1 value:Date|Number|string
                * @type_function_param1_field2 valueText:string
                * @type_function_param1_field3 point:chartPointObject
                * @type_function_return string
                * @notUsedInTheme
                */
                customizeText: undefined,
            },

        }
    },
    /**
    * @name dxChartOptions.onArgumentAxisClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 argument:Date|Number|string
    * @notUsedInTheme
    * @action
    */
    onArgumentAxisClick: function() { },
    /**
    * @name dxChartOptions.legend
    * @type object
    */
    legend: {
        /**
        * @name dxChartOptions.legend.customizeText
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxChartOptions.legend.customizeHint
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        */
        customizeHint: undefined,
        /**
        * @name dxChartOptions.legend.hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints',
        /**
        * @name dxChartOptions.legend.position
        * @type Enums.RelativePosition
        * @default 'outside'
        */
        position: 'outside'
    },
    /**
    * @name dxChartOptions.commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxChartOptions.commonAxisSettings.discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxChartOptions.commonAxisSettings.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxChartOptions.commonAxisSettings.color
        * @type string
        * @default '#767676'
        */
        color: '#767676',
        /**
        * @name dxChartOptions.commonAxisSettings.width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxChartOptions.commonAxisSettings.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxChartOptions.commonAxisSettings.placeholderSize
        * @type number
        * @default null
        */
        placeholderSize: null,
        /**
        * @name dxChartOptions.commonAxisSettings.breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxChartOptions.commonAxisSettings.breakStyle.width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxChartOptions.commonAxisSettings.breakStyle.color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxChartOptions.commonAxisSettings.breakStyle.line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxChartOptions.commonAxisSettings.label
        * @type object
        */
        label: {
            /**
            * @name dxChartOptions.commonAxisSettings.label.alignment
            * @type Enums.HorizontalAlignment
            * @default undefined
            */
            alignment: undefined,
            /**
            * @name dxChartOptions.commonAxisSettings.label.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxChartOptions.commonAxisSettings.label.rotationAngle
            * @type number
            * @default 90
            */
            rotationAngle: 90,
            /**
            * @name dxChartOptions.commonAxisSettings.label.staggeringSpacing
            * @type number
            * @default 5
            */
            staggeringSpacing: 5,
            /**
            * @name dxChartOptions.commonAxisSettings.label.displayMode
            * @type Enums.ChartLabelDisplayMode
            * @default 'standard'
            */
            displayMode: "standard",
            /**
            * @name dxChartOptions.commonAxisSettings.label.overlappingBehavior
            * @type Enums.OverlappingBehavior
            * @default 'hide'
            */
            overlappingBehavior: "hide",
            /**
            * @name dxChartOptions.commonAxisSettings.label.indentFromAxis
            * @type number
            * @default 10
            */
            indentFromAxis: 10,
            /**
            * @name dxChartOptions.commonAxisSettings.label.font
            * @type Font
            * @default '#767676' @prop color
            */
            font: {
                family: undefined,
                weight: 400,
                color: '#767676',
                size: 12,
                opacity: undefined
            },
            /**
            * @name dxChartOptions.commonAxisSettings.label.wordWrap
            * @type Enums.VizWordWrap
            * @default "normal"
            */
            wordWrap: "normal",
            /**
             * @name dxChartOptions.commonAxisSettings.label.textOverflow
             * @type Enums.VizTextOverflow
             * @default "none"
             */
            textOverflow: "none"
        },
        /**
        * @name dxChartOptions.commonAxisSettings.grid
        * @type object
        */
        grid: {
            /**
            * @name dxChartOptions.commonAxisSettings.grid.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartOptions.commonAxisSettings.grid.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartOptions.commonAxisSettings.grid.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonAxisSettings.grid.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxChartOptions.commonAxisSettings.minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxChartOptions.commonAxisSettings.minorGrid.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartOptions.commonAxisSettings.minorGrid.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxChartOptions.commonAxisSettings.minorGrid.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonAxisSettings.minorGrid.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxChartOptions.commonAxisSettings.tick
        * @type object
        */
        tick: {
            /**
            * @name dxChartOptions.commonAxisSettings.tick.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxChartOptions.commonAxisSettings.tick.color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxChartOptions.commonAxisSettings.tick.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxChartOptions.commonAxisSettings.tick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonAxisSettings.tick.length
            * @type number
            * @default 7
            */
            length: 7,
            /**
            * @name dxChartOptions.commonAxisSettings.tick.shift
            * @type number
            * @default 3
            */
            shift: 3
        },
        /**
       * @name dxChartOptions.commonAxisSettings.minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.opacity
            * @type number
            * @default 0.3
            */
            opacity: 0.3,
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.length
            * @type number
            * @default 7
            */
            length: 7,
            /**
            * @name dxChartOptions.commonAxisSettings.minorTick.shift
            * @type number
            * @default 3
            */
            shift: 3
        },
        /**
        * @name dxChartOptions.commonAxisSettings.title
        * @type object
        */
        title: {
            /**
            * @name dxChartOptions.commonAxisSettings.title.font
            * @type Font
            * @default '#767676' @prop color
            * @default 16 @prop size
            */
            font: {
                family: undefined,
                weight: 400,
                color: '#767676',
                size: 16,
                opacity: undefined
            },
            /**
            * @name dxChartOptions.commonAxisSettings.title.margin
            * @type number
            * @default 6
            */
            margin: 6,
            /**
            * @name dxChartOptions.commonAxisSettings.title.alignment
            * @type Enums.HorizontalAlignment
            * @default 'center'
            */
            alignment: 'center',
            /**
            * @name dxChartOptions.commonAxisSettings.title.wordWrap
            * @type Enums.VizWordWrap
            * @default "normal"
            */
            wordWrap: "normal",
            /**
            * @name dxChartOptions.commonAxisSettings.title.textOverflow
            * @type Enums.VizTextOverflow
            * @default "ellipsis"
            */
            textOverflow: "ellipsis"
        },
        /**
        * @name dxChartOptions.commonAxisSettings.stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxChartOptions.commonAxisSettings.stripStyle.paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxChartOptions.commonAxisSettings.stripStyle.paddingTopBottom
            * @type number
            * @default 5
            */
            paddingTopBottom: 5,
            /**
            * @name dxChartOptions.commonAxisSettings.stripStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.commonAxisSettings.stripStyle.label.horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxChartOptions.commonAxisSettings.stripStyle.label.verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'center'
                */
                verticalAlignment: 'center',
                /**
                * @name dxChartOptions.commonAxisSettings.stripStyle.label.font
                * @type Font
                * @default '#767676' @prop color
                */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#767676',
                    size: 12,
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxChartOptions.commonAxisSettings.constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.paddingTopBottom
            * @type number
            * @default 10
            */
            paddingTopBottom: 10,
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxChartOptions.commonAxisSettings.constantLineStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.commonAxisSettings.constantLineStyle.label.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxChartOptions.commonAxisSettings.constantLineStyle.label.position
                * @type Enums.RelativePosition
                * @default 'inside'
                */
                position: 'inside',
                /**
                * @name dxChartOptions.commonAxisSettings.constantLineStyle.label.font
                * @type Font
                * @default '#767676' @prop color
                */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#767676',
                    size: 12,
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxChartOptions.commonAxisSettings.minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxChartOptions.commonAxisSettings.maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxChartOptions.commonAxisSettings.valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxChartOptions.commonAxisSettings.inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxChartOptions.commonAxisSettings.allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxChartOptions.commonAxisSettings.endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxChartOptions.argumentAxis
    * @type object
    * @inherits dxChartOptions.commonAxisSettings
    */
    argumentAxis: {
        /**
        * @name dxChartOptions.argumentAxis.tickInterval
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxChartOptions.argumentAxis.minorTickInterval
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxChartOptions.argumentAxis.minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxChartOptions.argumentAxis.title
        * @type string|object
        */
        title: {
            /**
            * @name dxChartOptions.argumentAxis.title.text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxChartOptions.argumentAxis.workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxChartOptions.argumentAxis.workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxChartOptions.argumentAxis.holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxChartOptions.argumentAxis.breaks
        * @type Array<ScaleBreak>
        * @default undefined
        * @inherits ScaleBreak
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxChartOptions.argumentAxis.singleWorkdays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxChartOptions.argumentAxis.aggregationGroupWidth
        * @type number
        * @default undefined
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxChartOptions.argumentAxis.aggregationInterval
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
        /**
        * @name dxChartOptions.argumentAxis.aggregateByCategory
        * @type boolean
        * @default false
        */
        aggregateByCategory: false,
        /**
        * @name dxChartOptions.argumentAxis.label
        * @type object
        */
        label: {
            /**
            * @name dxChartOptions.argumentAxis.label.customizeText
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxChartOptions.argumentAxis.label.customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxChartOptions.argumentAxis.label.format
            * @extends CommonVizFormat
            */
            format: ''
        },
        /**
        * @name dxChartOptions.argumentAxis.strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxChartOptions.commonAxisSettings.stripStyle
        */
        strips: [{
            /**
            * @name dxChartOptions.argumentAxis.strips.startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxChartOptions.argumentAxis.strips.endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxChartOptions.argumentAxis.strips.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartOptions.argumentAxis.strips.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.argumentAxis.strips.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxChartOptions.argumentAxis.constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxChartOptions.argumentAxis.constantLineStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.argumentAxis.constantLineStyle.label.horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxChartOptions.argumentAxis.constantLineStyle.label.verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxChartOptions.argumentAxis.constantLines
        * @type Array<Object>
        * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxChartOptions.argumentAxis.constantLines.value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxChartOptions.argumentAxis.constantLines.displayBehindSeries
            * @type boolean
            * @default false
            */
            displayBehindSeries: false,
            /**
            * @name dxChartOptions.argumentAxis.constantLines.extendAxis
            * @type boolean
            * @default false
            */
           extendAxis: false,
            /**
            * @name dxChartOptions.argumentAxis.constantLines.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.argumentAxis.constantLines.label.text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxChartOptions.argumentAxis.constantLines.label.horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxChartOptions.argumentAxis.constantLines.label.verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxChartOptions.argumentAxis.position
        * @type Enums.Position
        * @default 'bottom'
        */
        position: 'bottom',
        /**
        * @name dxChartOptions.argumentAxis.min
        * @type number | datetime | string
        * @deprecated dxChartOptions.argumentAxis.visualRange
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxChartOptions.argumentAxis.max
        * @type number | datetime | string
        * @deprecated dxChartOptions.argumentAxis.visualRange
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxChartOptions.argumentAxis.visualRange
        * @type VizRange | Array<number,string,Date>
        * @fires BaseWidgetOptions.onOptionChanged
        * @notUsedInTheme
        */
        visualRange: undefined,
         /**
        * @name dxChartOptions.argumentAxis.wholeRange
        * @type VizRange | Array<number,string,Date>
        * @default undefined
        */
        wholeRange: undefined,
        /**
        * @name dxChartOptions.argumentAxis.visualRangeUpdateMode
        * @type Enums.VisualRangeUpdateMode
        * @default 'auto'
        */
        visualRangeUpdateMode: "auto",
        /**
        * @name dxChartOptions.argumentAxis.minVisualRangeLength
        * @inherits VizTimeInterval
        * @default undefined
        * @notUsedInTheme
        */
        minVisualRangeLength: undefined,
        /**
        * @name dxChartOptions.argumentAxis.axisDivisionFactor
        * @type number
        * @default 70
        */
        axisDivisionFactor: 70,
        /**
        * @name dxChartOptions.argumentAxis.categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxChartOptions.argumentAxis.type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxChartOptions.argumentAxis.logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxChartOptions.argumentAxis.linearThreshold
        * @type number
        * @default undefined
        */
        linearThreshold: undefined,
        /**
        * @name dxChartOptions.argumentAxis.argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxChartOptions.argumentAxis.hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none',
        /**
        * @name dxChartOptions.argumentAxis.endOnTick
        * @type boolean
        * @default false
        */
        endOnTick: false
    },
    /**
    * @name dxChartOptions.valueAxis
    * @type Object|Array<Object>
    * @inherits dxChartOptions.commonAxisSettings
    */
    valueAxis: {
        /**
        * @name dxChartOptions.valueAxis.showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxChartOptions.valueAxis.synchronizedValue
        * @type number
        * @default undefined
        */
        synchronizedValue: undefined,
        /**
        * @name dxChartOptions.valueAxis.multipleAxesSpacing
        * @type number
        * @default 5
        */
        multipleAxesSpacing: 5,
        /**
        * @name dxChartOptions.valueAxis.tickInterval
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxChartOptions.valueAxis.minorTickInterval
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxChartOptions.valueAxis.minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxChartOptions.valueAxis.breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxChartOptions.valueAxis.autoBreaksEnabled
        * @type boolean
        * @default false
        */
        autoBreaksEnabled: false,
        /**
        * @name dxChartOptions.valueAxis.maxAutoBreakCount
        * @type numeric
        * @default 4
        */
        maxAutoBreakCount: 4,
        /**
        * @name dxChartOptions.valueAxis.title
        * @type string|object
        */
        title: {
            /**
            * @name dxChartOptions.valueAxis.title.text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxChartOptions.valueAxis.name
        * @type string
        * @default undefined
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxChartOptions.valueAxis.label
        * @type object
        */
        label: {
            /**
            * @name dxChartOptions.valueAxis.label.customizeText
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxChartOptions.valueAxis.label.customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxChartOptions.valueAxis.label.format
            * @extends CommonVizFormat
            */
            format: ''
        },
        /**
        * @name dxChartOptions.valueAxis.strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxChartOptions.commonAxisSettings.stripStyle
        */
        strips: [{
            /**
            * @name dxChartOptions.valueAxis.strips.startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxChartOptions.valueAxis.strips.endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxChartOptions.valueAxis.strips.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxChartOptions.valueAxis.strips.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.valueAxis.strips.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxChartOptions.valueAxis.constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxChartOptions.valueAxis.constantLineStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.valueAxis.constantLineStyle.label.horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxChartOptions.valueAxis.constantLineStyle.label.verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxChartOptions.valueAxis.constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
        */
        constantLines: [{
            /**
            * @name dxChartOptions.valueAxis.constantLines.value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxChartOptions.valueAxis.constantLines.displayBehindSeries
            * @type boolean
            * @default false
            */
            displayBehindSeries: false,
            /**
            * @name dxChartOptions.valueAxis.constantLines.extendAxis
            * @type boolean
            * @default false
            */
            extendAxis: false,
            /**
            * @name dxChartOptions.valueAxis.constantLines.label
            * @type object
            */
            label: {
                /**
                * @name dxChartOptions.valueAxis.constantLines.label.text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxChartOptions.valueAxis.constantLines.label.horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxChartOptions.valueAxis.constantLines.label.verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxChartOptions.valueAxis.position
        * @type Enums.Position
        * @default 'left'
        */
        position: 'left',
        /**
        * @name dxChartOptions.valueAxis.min
        * @type number | datetime | string
        * @deprecated dxChartOptions.valueAxis.visualRange
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxChartOptions.valueAxis.max
        * @type number | datetime | string
        * @deprecated dxChartOptions.valueAxis.visualRange
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxChartOptions.valueAxis.visualRange
        * @type VizRange | Array<number,string,Date>
        * @fires BaseWidgetOptions.onOptionChanged
        * @notUsedInTheme
        */
        visualRange: undefined,
        /**
        * @name dxChartOptions.valueAxis.wholeRange
        * @type VizRange | Array<number,string,Date>
        * @default undefined
        */
        wholeRange: undefined,
        /**
        * @name dxChartOptions.valueAxis.visualRangeUpdateMode
        * @type Enums.VisualRangeUpdateMode
        * @default 'auto'
        */
        visualRangeUpdateMode: "auto",
        /**
        * @name dxChartOptions.valueAxis.minVisualRangeLength
        * @inherits VizTimeInterval
        * @default undefined
        * @notUsedInTheme
        */
        minVisualRangeLength: undefined,
        /**
        * @name dxChartOptions.valueAxis.axisDivisionFactor
        * @type number
        * @default 40
        */
        axisDivisionFactor: 40,
        /**
        * @name dxChartOptions.valueAxis.categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxChartOptions.valueAxis.type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxChartOptions.valueAxis.logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxChartOptions.valueAxis.linearThreshold
        * @type number
        * @default undefined
        */
        linearThreshold: undefined,
        /**
        * @name dxChartOptions.valueAxis.valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxChartOptions.valueAxis.pane
        * @type string
        * @default undefined
        */
        pane: undefined,
        /**
        * @name dxChartOptions.valueAxis.endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxChartOptions.tooltip
    * @type object
    **/
    tooltip: {
        /**
        * @name dxChartOptions.tooltip.location
        * @type Enums.ChartTooltipLocation
        * @default 'center'
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
        */
        location: 'center'
    },
    /**
    * @name dxChartOptions.commonAnnotationSettings
    * @type dxChartCommonAnnotationConfig
    */
    commonAnnotationSettings: undefined,
    /**
    * @name dxChartOptions.annotations
    * @type Array<dxChartAnnotationConfig,object>
    * @inherits dxChartOptions.commonAnnotationSettings
    */
    annotations: [{}],
    /**
    * @name dxChartOptions.customizeAnnotation
    * @type function(annotation)
    * @type_function_param1 annotation:dxChartAnnotationConfig|any
    * @type_function_return dxChartAnnotationConfig
    * @default undefined
    * @notUsedInTheme
    */
    customizeAnnotation: undefined,
    /**
    * @name dxChartOptions.onSeriesHoverChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesHoverChanged: function() { },
    /**
    * @name dxChartOptions.onSeriesSelectionChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesSelectionChanged: function() { },
    /**
     * @name dxChartOptions.onZoomStart
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 axis:chartAxisObject
     * @type_function_param1_field6 range:VizRange
     * @type_function_param1_field7 cancel:boolean
     * @type_function_param1_field8 actionType:Enums.ChartZoomPanActionType
     * @notUsedInTheme
     * @action
     */
    onZoomStart: function() { },
    /**
     * @name dxChartOptions.onZoomEnd
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 rangeStart:Date|Number:deprecated(range)
     * @type_function_param1_field6 rangeEnd:Date|Number:deprecated(range)
     * @type_function_param1_field7 axis:chartAxisObject
     * @type_function_param1_field8 range:VizRange
     * @type_function_param1_field9 previousRange:VizRange
     * @type_function_param1_field10 cancel:boolean
     * @type_function_param1_field11 actionType:Enums.ChartZoomPanActionType
     * @type_function_param1_field12 zoomFactor:Number
     * @type_function_param1_field13 shift:Number
     * @notUsedInTheme
     * @action
     */
    onZoomEnd: function() { },
    /**
    * @name dxChartOptions.series
    * @type ChartSeries|Array<ChartSeries>
    * @default undefined
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: undefined,
    /**
    * @name dxChartOptions.minBubbleSize
    * @default 12
    * @type number
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    minBubbleSize: 12,
    /**
    * @name dxChartOptions.maxBubbleSize
    * @default 0.2
    * @type number
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    maxBubbleSize: 0.2,

    /**
    * @name dxchartmethods.zoomArgument
    * @publicName zoomArgument(startValue,endValue)
    * @param1 startValue:Number|Date|string
    * @param2 endValue:Number|Date|string
    */
    zoomArgument: function() { },
    /**
    * @name dxchartmethods.resetVisualRange
    * @publicName resetVisualRange()
    */
    resetVisualRange: function() { },
    /**
    * @name dxchartmethods.getValueAxis
    * @publicName getValueAxis()
    * @return chartAxisObject
    */
    getValueAxis: function() { },
    /**
    * @name dxchartmethods.getValueAxis(name)
    * @publicName getValueAxis(name)
    * @param1 name:string
    * @return chartAxisObject
    */
    getValueAxis: function(name) { },
    /**
    * @name dxchartmethods.getArgumentAxis
    * @publicName getArgumentAxis()
    * @return chartAxisObject
    */
    getArgumentAxis: function() { }
};

/**
* @name dxPieChart
* @inherits BaseChart
* @module viz/pie_chart
* @export default
*/
var dxPieChart = {/**
    * @name dxPieChartMethods.getInnerRadius
    * @publicName getInnerRadius()
    * @return number
    */
    getInnerRadius: function() { },
    /**
    * @name dxPieChartOptions.seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxPieChartOptions.seriesTemplate.nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxPieChartOptions.seriesTemplate.customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return PieChartSeries
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxPieChartOptions.legend
    * @type object
    */
    legend: {
        /**
        * @name dxPieChartOptions.legend.hoverMode
        * @type Enums.PieChartLegendHoverMode
        * @default 'allArgumentPoints'
        */
        hoverMode: 'allArgumentPoints',
        /**
        * @name dxPieChartOptions.legend.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_param1_field1 pointName:any
        * @type_function_param1_field2 pointIndex:Number
        * @type_function_param1_field3 pointColor:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
       * @name dxPieChartOptions.legend.customizeHint
       * @type function(pointInfo)
       * @type_function_param1 pointInfo:object
       * @type_function_param1_field1 pointName:any
       * @type_function_param1_field2 pointIndex:Number
       * @type_function_param1_field3 pointColor:string
       * @type_function_return string
       */
       customizeHint: undefined,
       /**
       * @name dxPieChartOptions.legend.customizeItems
       * @type function(items)
       * @type_function_param1 items:Array<PieChartLegendItem>
       * @type_function_return Array<PieChartLegendItem>
       */
       customizeItems: undefined,
       /**
       * @name dxPieChartOptions.legend.markerTemplate
       * @type template|function
       * @default undefined
       * @type_function_param1 legendItem:PieChartLegendItem
       * @type_function_param2 element:SVGGElement
       * @type_function_return string|SVGElement|jQuery
       */
       markerTemplate: undefined
    },
    /**
    * @name dxPieChartOptions.resolveLabelOverlapping
    * @type Enums.PieChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxPieChartOptions.palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxPieChartOptions.series
    * @type PieChartSeries|Array<PieChartSeries>
    * @default undefined
    * @hideDefaults true
    * @inheritAll
    */
    series: undefined,
    /**
    * @name dxPieChartOptions.type
    * @type Enums.PieChartType
    * @default 'pie'
    */
    type: 'pie',
    /**
    * @name dxPieChartOptions.commonSeriesSettings
    * @type object
    * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: { },
    /**
    * @name dxPieChartOptions.diameter
    * @type number
    * @default undefined
    */
    diameter: undefined,
    /**
    * @name dxPieChartOptions.minDiameter
    * @type number
    * @default 0.5
    */
    minDiameter: 0.5,
    /**
   * @name dxPieChartOptions.segmentsDirection
   * @type Enums.PieChartSegmentsDirection
   * @default 'clockwise'
   */
    segmentsDirection: 'clockwise',
    /**
    * @name dxPieChartOptions.startAngle
    * @type number
    * @default 0
    */
    startAngle: 0,
    /**
    * @name dxPieChartOptions.innerRadius
    * @type number
    * @default 0.5
    * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
    */
    innerRadius: 0.5,
    /**
    * @name dxPieChartOptions.onLegendClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:String|Number
    * @type_function_param1_field7 points:Array<piePointObject>
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxPieChartOptions.sizeGroup
    * @type string
    * @default undefined
    */
    sizeGroup: undefined,
    /**
    * @name dxPieChartOptions.centerTemplate
    * @type template|function
    * @default undefined
    * @type_function_param1 component:dxPieChart
    * @type_function_param2 element:SVGGElement
    * @type_function_return string|SVGElement|jQuery
    */
    centerTemplate: undefined
};

/**
* @name dxPolarChart
* @inherits BaseChart
* @module viz/polar_chart
* @export default
*/
var dxPolarChart = {
    /**
    * @name dxPolarChartOptions.seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxPolarChartOptions.seriesTemplate.nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxPolarChartOptions.seriesTemplate.customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return PolarChartSeries
        */
        customizeSeries: function() { }
    },
    /**
     * @name dxPolarChartOptions.useSpiderWeb
     * @type boolean
     * @default false
     */
    useSpiderWeb: false,
    /**
    * @name dxPolarChartOptions.resolveLabelOverlapping
    * @type Enums.PolarChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxPolarChartOptions.seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxPolarChartOptions.containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxPolarChartOptions.onSeriesClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesClick: function() { },
    /**
    * @name dxPolarChartOptions.onLegendClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxPolarChartOptions.equalBarWidth
    * @type boolean
    * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxPolarChartOptions.barWidth
    * @type number
    * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
    */
    barWidth: undefined,
    /**
    * @name dxPolarChartOptions.barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxPolarChartOptions.barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barGroupWidth: undefined,
    /**
    * @name dxPolarChartOptions.negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    negativesAsZeroes: false,
    /**
    * @name dxPolarChartOptions.commonSeriesSettings
    * @type object
    * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.type
        * @type Enums.PolarChartSeriesType
        * @default 'scatter'
        */
        type: 'scatter',
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.line
        * @type object
        */
        line: {},
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.area
        * @type object
        */
        area: {},
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.bar
        * @type object
        */
        bar: {},
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxPolarChartOptions.commonSeriesSettings.scatter
        * @type object
        */
        scatter: {}
    },
    /**
    * @name dxPolarChartOptions.dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxPolarChartOptions.dataPrepareSettings.checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxPolarChartOptions.dataPrepareSettings.convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxPolarChartOptions.dataPrepareSettings.sortingMethod
        * @type boolean|function(a,b)
        * @type_function_param1 a:object
        * @type_function_param1_field1 arg:Date|Number|string
        * @type_function_param1_field2 val:Date|Number|string
        * @type_function_param2 b:object
        * @type_function_param2_field1 arg:Date|Number|string
        * @type_function_param2_field2 val:Date|Number|string
        * @type_function_return Number
        * @default true
        */
        sortingMethod: true
    },
    /**
    * @name dxPolarChartOptions.onArgumentAxisClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 argument:Date|Number|string
    * @notUsedInTheme
    * @action
    */
    onArgumentAxisClick: function() { },
    /**
    * @name dxPolarChartOptions.legend
    * @type object
    */
    legend: {
        /**
        * @name dxPolarChartOptions.legend.customizeText
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxPolarChartOptions.legend.customizeHint
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        */
        customizeHint: undefined,
        /**
        * @name dxPolarChartOptions.legend.hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints'
    },
    /**
    * @name dxPolarChartOptions.commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxPolarChartOptions.commonAxisSettings.discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxPolarChartOptions.commonAxisSettings.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxPolarChartOptions.commonAxisSettings.color
        * @type string
        * @default '#767676'
        */
        color: '#767676',
        /**
        * @name dxPolarChartOptions.commonAxisSettings.width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxPolarChartOptions.commonAxisSettings.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxPolarChartOptions.commonAxisSettings.label
        * @type object
        */
        label: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.label.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.label.overlappingBehavior
            * @type Enums.PolarChartOverlappingBehavior
            * @default 'hide'
            */
            overlappingBehavior: 'hide',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.label.indentFromAxis
            * @type number
            * @default 5
            */
            indentFromAxis: 5,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.label.font
            * @type Font
            * @default '#767676' @prop color
            */
            font: {
                family: undefined,
                weight: 400,
                color: '#767676',
                size: 12,
                opacity: undefined
            }
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.grid
        * @type object
        */
        grid: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.grid.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.grid.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.grid.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.grid.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorGrid.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorGrid.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorGrid.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorGrid.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.tick
        * @type object
        */
        tick: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.tick.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.tick.color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.tick.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.tick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.tick.length
            * @type number
            * @default 7
            */
            length: 7
        },
        /**
       * @name dxPolarChartOptions.commonAxisSettings.minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorTick.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorTick.color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorTick.opacity
            * @type number
            * @default 0.3
            */
            opacity: 0.3,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorTick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.minorTick.length
            * @type number
            * @default 7
            */
            length: 7
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.stripStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.commonAxisSettings.stripStyle.label.font
                * @type Font
                * @default '#767676' @prop color
                */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#767676',
                    size: 12,
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font
                * @type Font
                * @default '#767676' @prop color
                */
                font: {
                    family: undefined,
                    weight: 400,
                    color: '#767676',
                    size: 12,
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxPolarChartOptions.commonAxisSettings.inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxPolarChartOptions.commonAxisSettings.allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxPolarChartOptions.commonAxisSettings.endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxPolarChartOptions.argumentAxis
    * @type object
    * @inherits dxPolarChartOptions.commonAxisSettings
    */
    argumentAxis: {
        /**
         * @name dxPolarChartOptions.argumentAxis.startAngle
         * @type number
         * @default 0
         */
        startAngle: 0,
        /**
         * @name dxPolarChartOptions.argumentAxis.firstPointOnStartAngle
         * @type boolean
         * @default false
         */
        firstPointOnStartAngle: false,
        /**
         * @name dxPolarChartOptions.argumentAxis.period
         * @type number
         * @default undefined
         */
        period: 0,
        /**
        * @name dxPolarChartOptions.argumentAxis.originValue
        * @type number
        * @default undefined
        */
        originValue: undefined,
        /**
        * @name dxPolarChartOptions.argumentAxis.tickInterval
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxPolarChartOptions.argumentAxis.minorTickInterval
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxPolarChartOptions.argumentAxis.minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxPolarChartOptions.argumentAxis.label
        * @type object
        */
        label: {
            /**
            * @name dxPolarChartOptions.argumentAxis.label.customizeText
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.label.customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.label.format
            * @extends CommonVizFormat
            */
            format: ''
        },
        /**
        * @name dxPolarChartOptions.argumentAxis.strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
        */
        strips: [{
            /**
            * @name dxPolarChartOptions.argumentAxis.strips.startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.strips.endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.strips.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.strips.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.argumentAxis.strips.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxPolarChartOptions.argumentAxis.constantLines
        * @type Array<Object>
        * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxPolarChartOptions.argumentAxis.constantLines.value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxPolarChartOptions.argumentAxis.constantLines.displayBehindSeries
            * @type boolean
            * @default false
            */
            displayBehindSeries: false,
            /**
            * @name dxPolarChartOptions.argumentAxis.constantLines.extendAxis
            * @type boolean
            * @default false
            */
            extendAxis: false,
            /**
            * @name dxPolarChartOptions.argumentAxis.constantLines.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.argumentAxis.constantLines.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxPolarChartOptions.argumentAxis.axisDivisionFactor
        * @type number
        * @default 50
        */
        axisDivisionFactor: 50,
        /**
        * @name dxPolarChartOptions.argumentAxis.categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxPolarChartOptions.argumentAxis.type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxPolarChartOptions.argumentAxis.logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxPolarChartOptions.argumentAxis.linearThreshold
        * @type number
        * @default undefined
        */
        linearThreshold: undefined,
        /**
        * @name dxPolarChartOptions.argumentAxis.argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxPolarChartOptions.argumentAxis.hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none',
        /**
        * @name dxPolarChartOptions.argumentAxis.tick
        * @type object
        */
        tick: {
            /**
            * @name dxPolarChartOptions.argumentAxis.tick.shift
            * @type number
            * @default 3
            */
            shift: 3
        },
        /**
        * @name dxPolarChartOptions.argumentAxis.minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name dxPolarChartOptions.argumentAxis.minorTick.shift
            * @type number
            * @default 3
            */
           shift: 3
        }
    },
    /**
    * @name dxPolarChartOptions.valueAxis
    * @type object
    * @inherits dxPolarChartOptions.commonAxisSettings
    */
    valueAxis: {
        /**
        * @name dxPolarChartOptions.valueAxis.showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.tickInterval
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxPolarChartOptions.valueAxis.minorTickInterval
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxPolarChartOptions.valueAxis.minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.tick
        * @type object
        */
        tick: {
            /**
            * @name dxPolarChartOptions.valueAxis.tick.visible
            * @type boolean
            * @default false
            */
            visible: false,
        },
        /**
        * @name dxPolarChartOptions.valueAxis.label
        * @type object
        */
        label: {
            /**
            * @name dxPolarChartOptions.valueAxis.label.customizeText
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.label.customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.label.format
            * @extends CommonVizFormat
            */
            format: ''
        },
        /**
        * @name dxPolarChartOptions.valueAxis.strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
        */
        strips: [{
            /**
            * @name dxPolarChartOptions.valueAxis.strips.startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.strips.endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.strips.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.strips.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.valueAxis.strips.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxPolarChartOptions.valueAxis.constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
        */
        constantLines: [{
            /**
            * @name dxPolarChartOptions.valueAxis.constantLines.value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxPolarChartOptions.valueAxis.constantLines.extendAxis
            * @type boolean
            * @default false
            */
            /**
            * @name dxPolarChartOptions.valueAxis.constantLines.displayBehindSeries
            * @type boolean
            * @default false
            */
            displayBehindSeries: false,
            extendAxis: false,
            /**
            * @name dxPolarChartOptions.valueAxis.constantLines.label
            * @type object
            */
            label: {
                /**
                * @name dxPolarChartOptions.valueAxis.constantLines.label.text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxPolarChartOptions.valueAxis.visualRange
        * @type VizRange | Array<number,string,Date>
        * @fires BaseWidgetOptions.onOptionChanged
        * @notUsedInTheme
        */
        visualRange: undefined,
        /**
         * @name dxPolarChartOptions.valueAxis.wholeRange
         * @type VizRange | Array<number,string,Date>
         * @default undefined
         */
        wholeRange: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.visualRangeUpdateMode
        * @type Enums.ValueAxisVisualRangeUpdateMode
        * @default 'auto'
        */
        visualRangeUpdateMode: "auto",
        /**
        * @name dxPolarChartOptions.valueAxis.minVisualRangeLength
        * @inherits VizTimeInterval
        * @default undefined
        * @notUsedInTheme
        */
        minVisualRangeLength: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxPolarChartOptions.valueAxis.maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxPolarChartOptions.valueAxis.valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxPolarChartOptions.valueAxis.axisDivisionFactor
        * @type number
        * @default 30
        */
        axisDivisionFactor: 30,
        /**
        * @name dxPolarChartOptions.valueAxis.categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxPolarChartOptions.valueAxis.type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxPolarChartOptions.valueAxis.linearThreshold
        * @type number
        * @default undefined
        */
        linearThreshold: undefined,
        /**
        * @name dxPolarChartOptions.valueAxis.valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
         /**
        * @name dxPolarChartOptions.valueAxis.endOnTick
        * @type boolean
        * @default false
        */
        endOnTick: false
    },
    /**
    * @name dxPolarChartOptions.tooltip
    * @type object
    **/
    tooltip: {
        /**
        * @name dxPolarChartOptions.tooltip.shared
        * @type boolean
        * @default false
        */
        shared: false
    },
    /**
    * @name dxPolarChartOptions.commonAnnotationSettings
    * @type dxPolarChartCommonAnnotationConfig
    */
    commonAnnotationSettings: undefined,
    /**
     * @name dxPolarChartOptions.annotations
     * @type Array<dxPolarChartAnnotationConfig,object>
     * @inherits dxPolarChartOptions.commonAnnotationSettings
     */
    annotations: [{}],
    /**
    * @name dxPolarChartOptions.onSeriesHoverChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesHoverChanged: function() { },
    /**
    * @name dxPolarChartOptions.onSeriesSelectionChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesSelectionChanged: function() { },
    /**
    * @name dxPolarChartOptions.series
    * @type PolarChartSeries|Array<PolarChartSeries>
    * @default undefined
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: undefined,
    /**
    * @name dxPolarChartOptions.onZoomStart
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 event:event
    * @type_function_param1_field5 axis:chartAxisObject
    * @type_function_param1_field6 range:VizRange
    * @type_function_param1_field7 cancel:boolean
    * @type_function_param1_field8 actionType:Enums.ChartZoomPanActionType
    * @notUsedInTheme
    * @action
    */
    onZoomStart: function() { },
    /**
    * @name dxPolarChartOptions.onZoomEnd
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 event:event
    * @type_function_param1_field5 axis:chartAxisObject
    * @type_function_param1_field6 range:VizRange
    * @type_function_param1_field7 previousRange:VizRange
    * @type_function_param1_field8 cancel:boolean
    * @type_function_param1_field9 actionType:Enums.ChartZoomPanActionType
    * @type_function_param1_field10 zoomFactor:Number
    * @type_function_param1_field11 shift:Number
    * @notUsedInTheme
    * @action
    */
    onZoomEnd: function() { },
    /**
    * @name dxPolarChartMethods.resetVisualRange
    * @publicName resetVisualRange()
    */
    resetVisualRange: function() { },
    /**
    * @name dxPolarChartMethods.getValueAxis
    * @publicName getValueAxis()
    * @return chartAxisObject
    */
    getValueAxis: function() { }
};
/**
* @name BaseChart
* @type object
* @hidden
* @inherits BaseWidget, DataHelperMixin
*/
var BaseChart = {
    /**
    * @name BaseChartOptions.onDone
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onDone: function() { },
    /**
    * @name BaseChartOptions.onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name BaseChartOptions.onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name BaseChartOptions.pointSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    pointSelectionMode: 'single',
    /**
    * @name BaseChartOptions.animation
    * @type object|boolean
    */
    animation: {
        /**
        * @name BaseChartOptions.animation.enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name BaseChartOptions.animation.duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name BaseChartOptions.animation.easing
        * @type Enums.VizAnimationEasing
        * @default 'easeOutCubic'
        */
        easing: 'easeOutCubic',
        /**
        * @name BaseChartOptions.animation.maxPointCountSupported
        * @type number
        * @default 300
        */
        maxPointCountSupported: 300
    },
    /**
    * @name BaseChartOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseChartOptions.tooltip.customizeTooltip
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined,
        /**
        * @name BaseChartOptions.tooltip.contentTemplate
        * @type template|function(pointInfo, element)
        * @type_function_param1 pointInfo:object
        * @type_function_param2 element:dxElement
        * @type_function_return string|Node|jQuery
        * @default undefined
        */
        contentTemplate: undefined,
        /**
        * @name BaseChartOptions.tooltip.argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name BaseChartOptions.tooltip.shared
        * @type boolean
        * @default false
        */
        shared: false
    },
    /**
    * @name BaseChartOptions.onPointClick
    * @extends Action
    * @type function(e)|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:basePointObject
    * @notUsedInTheme
    * @action
    */
    onPointClick: function() { },
    /**
    * @name BaseChartOptions.onPointSelectionChanged
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:basePointObject
    * @notUsedInTheme
    * @action
    */
    onPointSelectionChanged: function() { },
    /**
    * @name BaseChartOptions.onPointHoverChanged
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:basePointObject
    * @notUsedInTheme
    * @action
    */
    onPointHoverChanged: function() { },
    /**
    * @name BaseChartOptions.dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name BaseChartOptions.palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name BaseChartOptions.paletteExtensionMode
    * @type Enums.VizPaletteExtensionMode
    * @default 'blend'
    */
    paletteExtensionMode: 'blend',
    /**
    * @name BaseChartOptions.legend
    * @inherits BaseLegend
    * @type object
    */
    legend: {
        /**
        * @name BaseChartOptions.legend.customizeItems
        * @type function(items)
        * @type_function_param1 items:Array<BaseChartLegendItem>
        * @type_function_return Array<BaseChartLegendItem>
        */
        customizeItems: undefined,
        /**
        * @name BaseChartOptions.legend.markerTemplate
        * @type template|function
        * @default undefined
        * @type_function_param1 legendItem:BaseChartLegendItem
        * @type_function_param2 element:SVGGElement
        * @type_function_return string|SVGElement|jQuery
        */
        markerTemplate: undefined
    },
    /**
    * @name BaseChartOptions.series
    * @type Object|Array<Object>
    * @default undefined
    * @notUsedInTheme
    * @hideDefaults true
    */
    series: [{

    }],
    /**
    * @name BaseChartOptions.customizePoint
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes.CommonSeries.point
    */
    customizePoint: undefined,
    /**
    * @name BaseChartOptions.customizeLabel
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes.CommonSeries.label
    */
    customizeLabel: undefined,
    /**
    * @name BaseChartMethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name BaseChartMethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name BaseChartMethods.render
    * @publicName render(renderOptions)
    * @param1 renderOptions:object
    */
    render: function(renderOptions) { },
    /**
    * @name BaseChartMethods.refresh
    * @publicName refresh()
    */
    refresh: function() { },
    /**
    * @name BaseChartMethods.getAllSeries
    * @publicName getAllSeries()
    * @return Array<baseSeriesObject>
    */
    getAllSeries: function() { },
    /**
    * @name BaseChartMethods.getSeriesByName
    * @publicName getSeriesByName(seriesName)
    * @param1 seriesName:any
    * @return chartSeriesObject
    */
    getSeriesByName: function() { },
    /**
    * @name BaseChartMethods.getSeriesByPos
    * @publicName getSeriesByPos(seriesIndex)
    * @param1 seriesIndex:number
    * @return chartSeriesObject
    */
    getSeriesByPos: function() { },
    /**
    * @name BaseChartOptions.adaptiveLayout
    * @type object
    */
    /**
    * @name dxPieChartOptions.adaptiveLayout
    * @type object
    */
    /**
    * @name dxPolarChartOptions.adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name BaseChartOptions.adaptiveLayout.width
        * @type number
        * @default 80
        */
        /**
        * @name dxPolarChartOptions.adaptiveLayout.width
        * @type number
        * @default 170
        */
        width: 80,
        /**
        * @name BaseChartOptions.adaptiveLayout.height
        * @type number
        * @default 80
        */
        /**
        * @name dxPolarChartOptions.adaptiveLayout.height
        * @type number
        * @default 170
        */
        height: 80,
        /**
        * @name BaseChartOptions.adaptiveLayout.keepLabels
        * @type boolean
        * @default true
        */
        /**
        * @name dxPieChartOptions.adaptiveLayout.keepLabels
        * @type boolean
        * @default false
        */
        keepLabels: true
    }
};

/**
* @name dxChartCommonAnnotationConfig
* @type object
*/
var dxChartCommonAnnotationConfig = {
    /**
    * @name dxChartCommonAnnotationConfig.type
    * @type Enums.AnnotationType
    * @default undefined
    */
    type: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.argument
    * @type number | datetime | string
    * @default undefined
    */
    argument: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.value
    * @type number | datetime | string
    * @default undefined
    */
    value: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.axis
    * @type string
    * @default undefined
    */
    axis: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.series
    * @type string
    * @default undefined
    */
    series: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.x
    * @type number
    * @default undefined
    */
    x: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.y
    * @type number
    * @default undefined
    */
    y: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.offsetX
    * @type number
    * @default undefined
    */
    offsetX: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.offsetY
    * @type number
    * @default undefined
    */
    offsetY: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.tooltipEnabled
    * @type boolean
    * @default true
    */
    tooltipEnabled: true,
    /**
    * @name dxChartCommonAnnotationConfig.color
    * @type string
    * @default '#ffffff'
    */
    color: '#ffffff',
    /**
    * @name dxChartCommonAnnotationConfig.opacity
    * @type number
    * @default 0.9
    */
    opacity: 0.9,
    /**
    * @name dxChartCommonAnnotationConfig.border
    * @type object
    */
    border: {
        /**
        * @name dxChartCommonAnnotationConfig.border.width
        * @default 1
        * @type number
        */
        width: 1,
        /**
        * @name dxChartCommonAnnotationConfig.border.color
        * @type string
        * @default '#dddddd'
        */
        color: '#dddddd',
        /**
        * @name dxChartCommonAnnotationConfig.border.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle: 'solid',
        /**
        * @name dxChartCommonAnnotationConfig.border.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxChartCommonAnnotationConfig.border.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxChartCommonAnnotationConfig.border.cornerRadius
        * @type number
        * @default 0
        * @default 4 @for Material
        */
        cornerRadius: 0
    },
    /**
    * @name dxChartCommonAnnotationConfig.font
    * @type Font
    * @default '#333333' @prop color
    */
    font: {
        color: '#333333'
    },
    /**
    * @name dxChartCommonAnnotationConfig.arrowLength
    * @type number
    * @default 14
    */
    arrowLength: 14,
    /**
    * @name dxChartCommonAnnotationConfig.arrowWidth
    * @type number
    * @default 14
    */
    arrowWidth: 14,
    /**
    * @name dxChartCommonAnnotationConfig.paddingLeftRight
    * @type number
    * @default 10
    */
    paddingLeftRight: 10,
    /**
    * @name dxChartCommonAnnotationConfig.paddingTopBottom
    * @type number
    * @default 10
    */
    paddingTopBottom: 10,
    /**
    * @name dxChartCommonAnnotationConfig.shadow
    * @type object
    */
    shadow: {
        /**
        * @name dxChartCommonAnnotationConfig.shadow.opacity
        * @type number
        * @default 0.15
        */
        opacity: 0.15,
        /**
        * @name dxChartCommonAnnotationConfig.shadow.color
        * @type string
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxChartCommonAnnotationConfig.shadow.offsetX
        * @type number
        * @default 0
        */
        offsetX: 0,
        /**
        * @name dxChartCommonAnnotationConfig.shadow.offsetY
        * @type number
        * @default 1
        */
        offsetY: 1,
        /**
        * @name dxChartCommonAnnotationConfig.shadow.blur
        * @type number
        * @default 4
        */
        blur: 4
    },
    /**
    * @name dxChartCommonAnnotationConfig.image
    * @type string|object
    */
    image: {
        /**
        * @name dxChartCommonAnnotationConfig.image.url
        * @type string
        * @default undefined
        */
        url: undefined,
        /**
        * @name dxChartCommonAnnotationConfig.image.width
        * @type number
        * @default 30
        */
        width: 30,
        /**
        * @name dxChartCommonAnnotationConfig.image.height
        * @type number
        * @default 30
        */
        height: 30
    },
    /**
    * @name dxChartCommonAnnotationConfig.text
    * @type string
    * @default undefined
    */
    text: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.template
    * @type template|function
    * @default undefined
    * @type_function_param1 annotation:dxChartAnnotationConfig|any
    * @type_function_param2 element:SVGGElement
    * @type_function_return string|SVGElement|jQuery
    */
    template: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.description
    * @type string
    * @default undefined
    */
    description: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.width
    * @type number
    * @default undefined
    */
    width: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.height
    * @type number
    * @default undefined
    */
    height: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.customizeTooltip
    * @type function(annotation)
    * @type_function_param1 annotation:dxChartAnnotationConfig|any
    * @type_function_return object
    * @default undefined
    * @notUsedInTheme
    */
    customizeTooltip: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.tooltipTemplate
    * @type template|function(annotation, element)
    * @type_function_param1 annotation:dxChartAnnotationConfig|any
    * @type_function_param2 element:dxElement
    * @type_function_return string|Node|jQuery
    * @default undefined
    */
    tooltipTemplate: undefined,
    /**
    * @name dxChartCommonAnnotationConfig.wordWrap
    * @type Enums.VizWordWrap
    * @default "normal"
    */
    wordWrap: "normal",
    /**
    * @name dxChartCommonAnnotationConfig.textOverflow
    * @type Enums.VizTextOverflow
    * @default "ellipsis"
    */
    textOverflow: "ellipsis",
    /**
    * @name dxChartCommonAnnotationConfig.allowDragging
    * @type boolean
    * @default false
    */
    allowDragging: false,
    /**
    * @name dxChartCommonAnnotationConfig.data
    * @type object
    */
    data: undefined
};
/**
* @name dxChartAnnotationConfig
* @type object
* @inherits dxChartCommonAnnotationConfig
*/
var dxChartAnnotationConfig = {
    /**
    * @name dxChartAnnotationConfig.name
    * @type string
    * @default undefined
    */
    name: undefined
};

/**
* @name dxPolarChartCommonAnnotationConfig
* @type object
* @inherits dxChartCommonAnnotationConfig
*/
var dxPolarChartCommonAnnotationConfig = {
    /**
    * @name dxPolarChartCommonAnnotationConfig.radius
    * @type number
    * @default undefined
    */
    radius: undefined,
    /**
     * @name dxPolarChartCommonAnnotationConfig.angle
     * @type number
     * @default undefined
     */
    angle: undefined
};

/**
* @name dxPolarChartAnnotationConfig
* @type object
* @inherits dxPolarChartCommonAnnotationConfig
*/
var dxPolarChartAnnotationConfig = {
    /**
    * @name dxPolarChartAnnotationConfig.name
    * @type string
    * @default undefined
    */
    name: undefined
};
