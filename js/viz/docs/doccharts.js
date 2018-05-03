/**
* @name dxchart
* @publicName dxChart
* @inherits BaseChart
* @module viz/chart
* @export default
*/
var dxChart = {
    /**
    * @name dxchart.options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxchartoptions.seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxchartoptions.seriestemplate.nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxchartoptions.seriestemplate.customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxChartOptions.series
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxchartoptions.resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.ChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxchartoptions.seriesSelectionMode
    * @publicName seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxchartoptions.containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxchartoptions.onseriesclick
    * @publicName onSeriesClick
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
    * @name dxchartoptions.onlegendclick
    * @publicName onLegendClick
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
    * @name dxchartoptions.equalbarwidth
    * @publicName equalBarWidth
    * @type boolean
    * @deprecated dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxchartoptions.barwidth
    * @publicName barWidth
    * @type number
    * @deprecated dxChartSeriesTypes.CommonSeries.barPadding
    */
    barWidth: undefined,
    /**
    * @name dxchartoptions.bargrouppadding
    * @publicName barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxchartoptions.bargroupwidth
    * @publicName barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
    */
    barGroupWidth: undefined,
    /**
    * @name dxchartoptions.negativesaszeroes
    * @publicName negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
    */
    negativesAsZeroes: false,
    /**
    * @name dxchartoptions.commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxChartSeriesTypes.CommonSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxchartoptions.commonseriessettings.type
        * @publicName type
        * @type Enums.SeriesType
        * @default 'line'
        */
        type: 'line',
        /**
        * @name dxchartoptions.commonseriessettings.line
        * @publicName line
        * @type object
        */
        line: {},
        /**
        * @name dxchartoptions.commonseriessettings.fullstackedline
        * @publicName fullstackedline
        * @type object
        */
        fullstackedline: {},
        /**
        * @name dxchartoptions.commonseriessettings.fullstackedspline
        * @publicName fullstackedspline
        * @type object
        */
        fullstackedspline: {},
        /**
        * @name dxchartoptions.commonseriessettings.stackedline
        * @publicName stackedline
        * @type object
        */
        stackedline: {},
        /**
        * @name dxchartoptions.commonseriessettings.stackedspline
        * @publicName stackedspline
        * @type object
        */
        stackedspline: {},
        /**
        * @name dxchartoptions.commonseriessettings.stepline
        * @publicName stepline
        * @type object
        */
        stepline: {},
        /**
        * @name dxchartoptions.commonseriessettings.area
        * @publicName area
        * @type object
        */
        area: {},
        /**
        * @name dxchartoptions.commonseriessettings.fullstackedarea
        * @publicName fullstackedarea
        * @type object
        */
        fullstackedarea: {},
        /**
        * @name dxchartoptions.commonseriessettings.fullstackedsplinearea
        * @publicName fullstackedsplinearea
        * @type object
        */
        fullstackedsplinearea: {},
        /**
        * @name dxchartoptions.commonseriessettings.stackedarea
        * @publicName stackedarea
        * @type object
        */
        stackedarea: {},
        /**
        * @name dxchartoptions.commonseriessettings.stackedsplinearea
        * @publicName stackedsplinearea
        * @type object
        */
        stackedsplinearea: {},
        /**
        * @name dxchartoptions.commonseriessettings.steparea
        * @publicName steparea
        * @type object
        */
        steparea: {},
        /**
        * @name dxchartoptions.commonseriessettings.bar
        * @publicName bar
        * @type object
        */
        bar: {},
        /**
        * @name dxchartoptions.commonseriessettings.fullstackedbar
        * @publicName fullstackedbar
        * @type object
        */
        fullstackedbar: {},
        /**
        * @name dxchartoptions.commonseriessettings.stackedbar
        * @publicName stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxchartoptions.commonseriessettings.spline
        * @publicName spline
        * @type object
        */
        spline: {},
        /**
        * @name dxchartoptions.commonseriessettings.splinearea
        * @publicName splinearea
        * @type object
        */
        splinearea: {},
        /**
        * @name dxchartoptions.commonseriessettings.scatter
        * @publicName scatter
        * @type object
        */
        scatter: {},
        /**
        * @name dxchartoptions.commonseriessettings.candlestick
        * @publicName candlestick
        * @type object
        */
        candlestick: {},
        /**
        * @name dxchartoptions.commonseriessettings.stock
        * @publicName stock
        * @type object
        */
        stock: {},
        /**
        * @name dxchartoptions.commonseriessettings.rangebar
        * @publicName rangebar
        * @type object
        */
        rangebar: {},
        /**
        * @name dxchartoptions.commonseriessettings.rangearea
        * @publicName rangearea
        * @type object
        */
        rangearea: {},
        /**
        * @name dxchartoptions.commonseriessettings.bubble
        * @publicName bubble
        * @type object
        */
        bubble: {}
    },
    /**
    * @name dxchartoptions.defaultpane
    * @publicName defaultPane
    * @type string
    * @default undefined
    * @notUsedInTheme
    */
    defaultPane: undefined,
    /**
    * @name dxchartoptions.adjustonzoom
    * @publicName adjustOnZoom
    * @type boolean
    * @default true
    */
    adjustOnZoom: true,
    /**
    * @name dxchartoptions.rotated
    * @publicName rotated
    * @type boolean
    * @default false
    */
    rotated: false,
    /**
    * @name dxchartoptions.synchronizemultiaxes
    * @publicName synchronizeMultiAxes
    * @type boolean
    * @default true
    */
    synchronizeMultiAxes: true,
    /**
    * @name dxchartoptions.commonpanesettings
    * @publicName commonPaneSettings
    * @type object
    */
    commonPaneSettings: {
        /**
        * @name dxchartoptions.commonpanesettings.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default 'none'
        */
        backgroundColor: 'none',
        /**
        * @name dxchartoptions.commonpanesettings.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxchartoptions.commonpanesettings.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions.commonpanesettings.border.top
            * @publicName top
            * @type boolean
            * @default true
            */
            top: true,
            /**
            * @name dxchartoptions.commonpanesettings.border.bottom
            * @publicName bottom
            * @type boolean
            * @default true
            */
            bottom: true,
            /**
            * @name dxchartoptions.commonpanesettings.border.left
            * @publicName left
            * @type boolean
            * @default true
            */
            left: true,
            /**
            * @name dxchartoptions.commonpanesettings.border.right
            * @publicName right
            * @type boolean
            * @default true
            */
            right: true,
            /**
            * @name dxchartoptions.commonpanesettings.border.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions.commonpanesettings.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions.commonpanesettings.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonpanesettings.border.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxchartoptions.panes
    * @publicName panes
    * @type Object|Array<Object>
    * @inherits dxchartoptions.commonpanesettings
    * @notUsedInTheme
    */
    panes: [{
        /**
        * @name dxchartoptions.panes.name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined
    }],
    /**
    * @name dxchartoptions.dataPrepareSettings
    * @publicName dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxchartoptions.dataPrepareSettings.checkTypeForAllData
        * @publicName checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxchartoptions.dataPrepareSettings.convertToAxisDataType
        * @publicName convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxchartoptions.dataPrepareSettings.sortingMethod
        * @publicName sortingMethod
        * @type boolean|function(a,b)
        * @type_function_param1 a:object
        * @type_function_param2 b:object
        * @type_function_return Number
        * @default true
        */
        sortingMethod: true
    },
    /**
    * @name dxchartoptions.scrollbar
    * @publicName scrollBar
    * @type object
    */
    scrollBar: {
        /**
        * @name dxchartoptions.scrollbar.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxchartoptions.scrollbar.offset
        * @publicName offset
        * @type number
        * @default 5
        */
        offset: 5,
        /**
        * @name dxchartoptions.scrollbar.color
        * @publicName color
        * @type string
        * @default 'gray'
        */
        color: "gray",
       /**
       * @name dxchartoptions.scrollbar.width
       * @publicName width
       * @type number
       * @default 10
       */
        width: 10,
       /**
       * @name dxchartoptions.scrollbar.opacity
       * @publicName opacity
       * @type number
       * @default undefined
       */
        opacity: undefined,
        /**
       * @name dxchartoptions.scrollbar.position
       * @publicName position
       * @type Enums.Position
       * @default 'top'
       */
        position: 'top'
    },
    /**
    * @name dxchartoptions.zoomingmode
    * @publicName zoomingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    */
    zoomingMode: 'none',
    /**
    * @name dxchartoptions.scrollingmode
    * @publicName scrollingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    */
    scrollingMode: 'none',
    /**
    * @name dxchartoptions.useAggregation
    * @publicName useAggregation
    * @type boolean
    * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
    */
    useAggregation: false,
    /**
    * @name dxchartoptions.crosshair
    * @publicName crosshair
    * @type object
    */
    crosshair: {
        /**
        * @name dxchartoptions.crosshair.enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name dxchartoptions.crosshair.color
        * @publicName color
        * @type string
        * @default '#f05b41'
        */
        color: '#f05b41',
        /**
        * @name dxchartoptions.crosshair.width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxchartoptions.crosshair.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle: 'solid',
        /**
        * @name dxchartoptions.crosshair.opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxchartoptions.crosshair.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions.crosshair.label.backgroundcolor
            * @publicName backgroundColor
            * @type string
            * @default "#f05b41"
            */
            backgroundColor: "#f05b41",
            /**
             * @name dxchartoptions.crosshair.label.visible
             * @publicName visible
             * @type boolean
             * @default false
             */
            visible: false,
            /**
             * @name dxchartoptions.crosshair.label.font
             * @publicName font
             * @type object
             */
            font: {
                /**
                * @name dxchartoptions.crosshair.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions.crosshair.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions.crosshair.label.font.color
                * @publicName color
                * @type string
                * @default '#FFFFFF'
                */
                color: '#FFFFFF',
                /**
                * @name dxchartoptions.crosshair.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxchartoptions.crosshair.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
           * @name dxchartoptions.crosshair.label.format
           * @publicName format
           * @extends CommonVizFormat
           */
            format: '',
            /**
            * @name dxchartoptions.crosshair.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0,
            /**
            * @name dxchartoptions.crosshair.label.customizetext
            * @publicName customizeText
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
        * @name dxchartoptions.crosshair.verticalline
        * @publicName verticalLine
        * @type object | boolean
        */
        verticalLine: {
            /**
            * @name dxchartoptions.crosshair.verticalline.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions.crosshair.verticalline.color
            * @publicName color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxchartoptions.crosshair.verticalline.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.crosshair.verticalline.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions.crosshair.verticalline.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions.crosshair.verticalline.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.crosshair.verticalline.label.backgroundcolor
                * @publicName backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxchartoptions.crosshair.verticalline.label.visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxchartoptions.crosshair.verticalline.label.font
                 * @publicName font
                 * @type object
                 */
                font: {
                    /**
                    * @name dxchartoptions.crosshair.verticalline.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions.crosshair.verticalline.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions.crosshair.verticalline.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#FFFFFF'
                    */
                    color: '#FFFFFF',
                    /**
                    * @name dxchartoptions.crosshair.verticalline.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions.crosshair.verticalline.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                },
                /**
                * @name dxchartoptions.crosshair.verticalline.label.format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxchartoptions.crosshair.verticalline.label.precision
                * @publicName precision
                * @extends CommonVizPrecision
                */
                precision: 0,
                /**
                * @name dxchartoptions.crosshair.verticalline.label.customizetext
                * @publicName customizeText
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
        * @name dxchartoptions.crosshair.horizontalline
        * @publicName horizontalLine
        * @type object | boolean
        */
        horizontalLine: {
            /**
            * @name dxchartoptions.crosshair.horizontalline.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions.crosshair.horizontalline.color
            * @publicName color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxchartoptions.crosshair.horizontalline.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.crosshair.horizontalline.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions.crosshair.horizontalline.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions.crosshair.horizontalline.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.crosshair.horizontalline.label.backgroundcolor
                * @publicName backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxchartoptions.crosshair.horizontalline.label.visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxchartoptions.crosshair.horizontalline.label.font
                 * @publicName font
                 * @type object
                 */
                font: {
                    /**
                    * @name dxchartoptions.crosshair.horizontalline.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions.crosshair.horizontalline.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions.crosshair.horizontalline.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#FFFFFF'
                    */
                    color: '#FFFFFF',
                    /**
                    * @name dxchartoptions.crosshair.horizontalline.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions.crosshair.horizontalline.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                },
                /**
                * @name dxchartoptions.crosshair.horizontalline.label.format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxchartoptions.crosshair.horizontalline.label.precision
                * @publicName precision
                * @extends CommonVizPrecision
                */
                precision: 0,
                /**
                * @name dxchartoptions.crosshair.horizontalline.label.customizetext
                * @publicName customizeText
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
    * @name dxchartoptions.onargumentaxisclick
    * @publicName onArgumentAxisClick
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
    * @name dxchartoptions.legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxchartoptions.legend.customizetext
        * @publicName customizeText
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
        * @name dxchartoptions.legend.customizehint
        * @publicName customizeHint
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        */
        customizeHint: undefined,
        /**
        * @name dxchartoptions.legend.hovermode
        * @publicName hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints',
        /**
        * @name dxchartoptions.legend.position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'outside'
        */
        position: 'outside'
    },
    /**
    * @name dxchartoptions.commonaxissettings
    * @publicName commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxchartoptions.commonaxissettings.setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxchartoptions.commonaxissettings.discreteaxisdivisionMode
        * @publicName discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxchartoptions.commonaxissettings.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxchartoptions.commonaxissettings.color
        * @publicName color
        * @type string
        * @default '#d3d3d3'
        */
        color: '#d3d3d3',
        /**
        * @name dxchartoptions.commonaxissettings.width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxchartoptions.commonaxissettings.opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxchartoptions.commonaxissettings.placeholdersize
        * @publicName placeholderSize
        * @type number
        * @default null
        */
        placeholderSize: null,
        /**
        * @name dxchartoptions.commonaxissettings.breakStyle
        * @publicName breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxchartoptions.commonaxissettings.breakStyle.width
            * @publicName width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxchartoptions.commonaxissettings.breakStyle.color
            * @publicName color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxchartoptions.commonaxissettings.breakStyle.line
            * @publicName line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxchartoptions.commonaxissettings.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions.commonaxissettings.label.alignment
            * @publicName alignment
            * @type Enums.HorizontalAlignment
            * @default undefined
            */
            alignment: undefined,
            /**
            * @name dxchartoptions.commonaxissettings.label.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions.commonaxissettings.label.rotationangle
            * @publicName rotationAngle
            * @type number
            * @default 90
            */
            rotationAngle: 90,
            /**
            * @name dxchartoptions.commonaxissettings.label.staggeringspacing
            * @publicName staggeringSpacing
            * @type number
            * @default 5
            */
            staggeringSpacing: 5,
            /**
            * @name dxchartoptions.commonaxissettings.label.displaymode
            * @publicName displayMode
            * @type Enums.ChartLabelDisplayMode
            * @default 'standard'
            */
            displayMode: "standard",
            /**
            * @name dxchartoptions.commonaxissettings.label.overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @default 'hide'
            * @acceptValues 'stagger' | 'rotate' | 'hide' | 'none'
            * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
            */
            overlappingBehavior: {
                /**
                * @name dxchartoptions.commonaxissettings.label.overlappingBehavior.mode
                * @publicName mode
                * @type string
                * @default 'hide'
                * @acceptValues 'stagger' | 'rotate' | 'hide' | 'none'
                * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
                * @deprecated dxchartoptions.commonaxissettings.label.overlappingBehavior
                */
                mode: 'hide',
                /**
                * @name dxchartoptions.commonaxissettings.label.overlappingBehavior.rotationangle
                * @publicName rotationAngle
                * @type number
                * @default 90
                * @deprecated dxchartoptions.commonaxissettings.label.rotationangle
                */
                rotationAngle: 90,
                /**
                * @name dxchartoptions.commonaxissettings.label.overlappingBehavior.staggeringSpacing
                * @publicName staggeringSpacing
                * @type number
                * @default 5
                * @deprecated dxchartoptions.commonaxissettings.label.staggeringspacing
                */
                staggeringSpacing: 5
            },
            /**
            * @name dxchartoptions.commonaxissettings.label.indentfromaxis
            * @publicName indentFromAxis
            * @type number
            * @default 10
            */
            indentFromAxis: 10,
            /**
            * @name dxchartoptions.commonaxissettings.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxchartoptions.commonaxissettings.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions.commonaxissettings.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions.commonaxissettings.label.font.color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxchartoptions.commonaxissettings.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxchartoptions.commonaxissettings.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        },
        /**
        * @name dxchartoptions.commonaxissettings.grid
        * @publicName grid
        * @type object
        */
        grid: {
            /**
            * @name dxchartoptions.commonaxissettings.grid.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions.commonaxissettings.grid.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions.commonaxissettings.grid.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonaxissettings.grid.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxchartoptions.commonaxissettings.minorgrid
        * @publicName minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxchartoptions.commonaxissettings.minorgrid.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions.commonaxissettings.minorgrid.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions.commonaxissettings.minorgrid.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonaxissettings.minorgrid.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxchartoptions.commonaxissettings.tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxchartoptions.commonaxissettings.tick.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions.commonaxissettings.tick.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions.commonaxissettings.tick.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions.commonaxissettings.tick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonaxissettings.tick.length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
       * @name dxchartoptions.commonaxissettings.minortick
       * @publicName minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxchartoptions.commonaxissettings.minortick.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions.commonaxissettings.minortick.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions.commonaxissettings.minortick.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions.commonaxissettings.minortick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonaxissettings.minortick.length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8,
        },
        /**
        * @name dxchartoptions.commonaxissettings.title
        * @publicName title
        * @type object
        */
        title: {
            /**
            * @name dxchartoptions.commonaxissettings.title.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxchartoptions.commonaxissettings.title.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions.commonaxissettings.title.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions.commonaxissettings.title.font.color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxchartoptions.commonaxissettings.title.font.size
                * @publicName size
                * @type number|string
                * @default 16
                */
                size: 16,
                /**
                * @name dxchartoptions.commonaxissettings.title.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
            * @name dxchartoptions.commonaxissettings.title.margin
            * @publicName margin
            * @type number
            * @default 6
            */
            margin: 6
        },
        /**
        * @name dxchartoptions.commonaxissettings.stripstyle
        * @publicName stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxchartoptions.commonaxissettings.stripstyle.paddingleftright
            * @publicName paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxchartoptions.commonaxissettings.stripstyle.paddingtopbottom
            * @publicName paddingTopBottom
            * @type number
            * @default 5
            */
            paddingTopBottom: 5,
            /**
            * @name dxchartoptions.commonaxissettings.stripstyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.commonaxissettings.stripstyle.label.horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions.commonaxissettings.stripstyle.label.verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'center'
                */
                verticalAlignment: 'center',
                /**
                * @name dxchartoptions.commonaxissettings.stripstyle.label.font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxchartoptions.commonaxissettings.stripstyle.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions.commonaxissettings.stripstyle.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions.commonaxissettings.stripstyle.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxchartoptions.commonaxissettings.stripstyle.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions.commonaxissettings.stripstyle.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxchartoptions.commonaxissettings.constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.paddingleftright
            * @publicName paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.paddingtopbottom
            * @publicName paddingTopBottom
            * @type number
            * @default 10
            */
            paddingTopBottom: 10,
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxchartoptions.commonaxissettings.constantlinestyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.commonaxissettings.constantlinestyle.label.visible
                * @publicName visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxchartoptions.commonaxissettings.constantlinestyle.label.position
                * @publicName position
                * @type Enums.RelativePosition
                * @default 'inside'
                */
                position: 'inside',
                /**
                * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions.commonaxissettings.constantlinestyle.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxchartoptions.commonaxissettings.minvaluemargin
        * @publicName minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxchartoptions.commonaxissettings.maxvaluemargin
        * @publicName maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxchartoptions.commonaxissettings.valuemarginsenabled
        * @publicName valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxchartoptions.commonaxissettings.inverted
        * @publicName inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxchartoptions.commonaxissettings.allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxchartoptions.commonaxissettings.endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxchartoptions.argumentaxis
    * @publicName argumentAxis
    * @type object
    * @inherits dxchartoptions.commonaxissettings
    */
    argumentAxis: {
        /**
        * @name dxchartoptions.argumentaxis.tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxchartoptions.argumentaxis.minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxchartoptions.argumentaxis.minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxchartoptions.argumentaxis.title
        * @publicName title
        * @type string|object
        */
        title: {
            /**
            * @name dxchartoptions.argumentaxis.title.text
            * @publicName text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxchartoptions.argumentaxis.workdaysonly
        * @publicName workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxchartoptions.argumentaxis.workweek
        * @publicName workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxchartoptions.argumentaxis.holidays
        * @publicName holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxchartoptions.argumentaxis.breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @default undefined
        * @inherits ScaleBreak
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxchartoptions.argumentaxis.singleworkdays
        * @publicName singleWorkdays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxchartoptions.argumentaxis.aggregationGroupWidth
        * @publicName aggregationGroupWidth
        * @type number
        * @default undefined
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxchartoptions.argumentaxis.aggregationInterval
        * @publicName aggregationInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
        /**
        * @name dxchartoptions.argumentaxis.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions.argumentaxis.label.customizetext
            * @publicName customizeText
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxchartoptions.argumentaxis.label.customizehint
            * @publicName customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxchartoptions.argumentaxis.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxchartoptions.argumentaxis.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxchartoptions.argumentaxis.strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions.commonaxissettings.stripstyle
        */
        strips: [{
            /**
            * @name dxchartoptions.argumentaxis.strips.startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxchartoptions.argumentaxis.strips.endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxchartoptions.argumentaxis.strips.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxchartoptions.argumentaxis.strips.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.argumentaxis.strips.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxchartoptions.argumentaxis.constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions.argumentaxis.constantlinestyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.argumentaxis.constantlinestyle.label.horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxchartoptions.argumentaxis.constantlinestyle.label.verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxchartoptions.argumentaxis.constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @inherits dxchartoptions.commonaxissettings.constantlinestyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxchartoptions.argumentaxis.constantlines.value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxchartoptions.argumentaxis.constantlines.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.argumentaxis.constantlines.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxchartoptions.argumentaxis.constantlines.label.horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxchartoptions.argumentaxis.constantlines.label.verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxchartoptions.argumentaxis.position
        * @publicName position
        * @type Enums.Position
        * @default 'bottom'
        */
        position: 'bottom',
        /**
        * @name dxchartoptions.argumentaxis.min
        * @publicName min
        * @type number | datetime | string
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxchartoptions.argumentaxis.max
        * @publicName max
        * @type number | datetime | string
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxchartoptions.argumentaxis.axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 70
        */
        axisDivisionFactor: 70,
        /**
        * @name dxchartoptions.argumentaxis.categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxchartoptions.argumentaxis.type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxchartoptions.argumentaxis.logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxchartoptions.argumentaxis.argumenttype
        * @publicName argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxchartoptions.argumentaxis.hovermode
        * @publicName hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none',
        /**
        * @name dxchartoptions.argumentaxis.endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        * @inheritdoc
        */
        endOnTick: false
    },
    /**
    * @name dxchartoptions.valueaxis
    * @publicName valueAxis
    * @type Object|Array<Object>
    * @inherits dxchartoptions.commonaxissettings
    */
    valueAxis: {
        /**
        * @name dxchartoptions.valueaxis.showZero
        * @publicName showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxchartoptions.valueaxis.synchronizedvalue
        * @publicName synchronizedValue
        * @type number
        * @default undefined
        */
        synchronizedValue: undefined,
        /**
        * @name dxchartoptions.valueaxis.multipleaxesspacing
        * @publicName multipleAxesSpacing
        * @type number
        * @default 5
        */
        multipleAxesSpacing: 5,
        /**
        * @name dxchartoptions.valueaxis.tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxchartoptions.valueaxis.minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxchartoptions.valueaxis.minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxchartoptions.valueaxis.breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxchartoptions.valueaxis.autobreaksenabled
        * @publicName autoBreaksEnabled
        * @type boolean
        * @default false
        */
        autoBreaksEnabled: false,
        /**
        * @name dxchartoptions.valueaxis.maxautobreakcount
        * @publicName maxAutoBreakCount
        * @type numeric
        * @default 4
        */
        maxAutoBreakCount: 4,
        /**
        * @name dxchartoptions.valueaxis.title
        * @publicName title
        * @type string|object
        */
        title: {
            /**
            * @name dxchartoptions.valueaxis.title.text
            * @publicName text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxchartoptions.valueaxis.name
        * @publicName name
        * @type string
        * @default undefined
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxchartoptions.valueaxis.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions.valueaxis.label.customizetext
            * @publicName customizeText
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxchartoptions.valueaxis.label.customizehint
            * @publicName customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxchartoptions.valueaxis.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxchartoptions.valueaxis.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxchartoptions.valueaxis.strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions.commonaxissettings.stripstyle
        */
        strips: [{
            /**
            * @name dxchartoptions.valueaxis.strips.startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxchartoptions.valueaxis.strips.endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxchartoptions.valueaxis.strips.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxchartoptions.valueaxis.strips.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.valueaxis.strips.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxchartoptions.valueaxis.constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions.valueaxis.constantlinestyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.valueaxis.constantlinestyle.label.horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions.valueaxis.constantlinestyle.label.verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxchartoptions.valueaxis.constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions.commonaxissettings.constantlinestyle
        */
        constantLines: [{
            /**
            * @name dxchartoptions.valueaxis.constantlines.value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxchartoptions.valueaxis.constantlines.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions.valueaxis.constantlines.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxchartoptions.valueaxis.constantlines.label.horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions.valueaxis.constantlines.label.verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxchartoptions.valueaxis.position
        * @publicName position
        * @type Enums.Position
        * @default 'left'
        */
        position: 'left',
        /**
        * @name dxchartoptions.valueaxis.min
        * @publicName min
        * @type number | datetime | string
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxchartoptions.valueaxis.max
        * @publicName max
        * @type number | datetime | string
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxchartoptions.valueaxis.axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 40
        */
        axisDivisionFactor: 40,
        /**
        * @name dxchartoptions.valueaxis.categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxchartoptions.valueaxis.type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxchartoptions.valueaxis.logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxchartoptions.valueaxis.valuetype
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxchartoptions.valueaxis.pane
        * @publicName pane
        * @type string
        * @default undefined
        */
        pane: undefined,
        /**
        * @name dxchartoptions.valueaxis.endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        * @inheritdoc
        */
        endOnTick: undefined
    },
    /**
    * @name dxchartoptions.tooltip
    * @type object
    * @publicName tooltip
    * @inheritdoc
    **/
    tooltip: {
        /**
        * @name dxchartoptions.tooltip.shared
        * @publicName shared
        * @type boolean
        * @default false
        */
        shared: false,
        /**
        * @name dxchartoptions.tooltip.location
        * @publicName location
        * @type Enums.ChartTooltipLocation
        * @default 'center'
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandlestickSeries
        */
        location: 'center'
    },
    /**
    * @name dxchartoptions.onserieshoverchanged
    * @publicName onSeriesHoverChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesHoverChanged: function() { },
    /**
    * @name dxchartoptions.onseriesselectionchanged
    * @publicName onSeriesSelectionChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:chartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesSelectionChanged: function() { },
    /**
     * @name dxchartoptions.onzoomstart
     * @publicName onZoomStart
     * @extends Action
     * @notUsedInTheme
     * @action
     */
    onZoomStart: function() { },
    /**
     * @name dxchartoptions.onzoomend
     * @publicName onZoomEnd
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 rangeStart:Date|Number
     * @type_function_param1_field5 rangeEnd:Date|Number
     * @notUsedInTheme
     * @action
     */
    onZoomEnd: function() { },
    /**
    * @name dxchartoptions.series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxChartSeriesTypes.CommonSeries
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: [{
        /**
        * @name dxchartoptions.series.name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxchartoptions.series.tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxchartoptions.series.type
        * @publicName type
        * @type Enums.SeriesType
        * @default 'line'
        */
        type: 'line'
    }],
    /**
    * @name dxchartoptions.minbubblesize
    * @publicName minBubbleSize
    * @default 12
    * @type number
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    minBubbleSize: 12,
    /**
    * @name dxchartoptions.maxbubblesize
    * @publicName maxBubbleSize
    * @default 0.2
    * @type number
    * @propertyOf dxChartSeriesTypes.BubbleSeries
    */
    maxBubbleSize: 0.2,

    /**
    * @name dxchartmethods.zoomargument
    * @publicName zoomArgument(startValue,endValue)
    * @param1 startValue:Number|Date|string
    * @param2 endValue:Number|Date|string
    */
    zoomArgument: function() { },
};

/**
* @name dxpiechart
* @publicName dxPieChart
* @inherits BaseChart
* @module viz/pie_chart
* @export default
*/
var dxPieChart = {
    /**
    * @name dxpiechart.options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxpiechartoptions.seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxpiechartoptions.seriestemplate.nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxpiechartoptions.seriestemplate.customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxPieChartOptions.series
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxpiechartoptions.legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxpiechartoptions.legend.hovermode
        * @publicName hoverMode
        * @type Enums.PieChartLegendHoverMode
        * @default 'allArgumentPoints'
        */
        hoverMode: 'allArgumentPoints',
        /**
        * @name dxpiechartoptions.legend.customizetext
        * @publicName customizeText
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
       * @name dxpiechartoptions.legend.customizehint
       * @publicName customizeHint
       * @type function(pointInfo)
       * @type_function_param1 pointInfo:object
       * @type_function_param1_field1 pointName:any
       * @type_function_param1_field2 pointIndex:Number
       * @type_function_param1_field3 pointColor:string
       * @type_function_return string
       */
        customizeHint: undefined,
    },
    /**
    * @name dxpiechartoptions.resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.PieChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxpiechartoptions.palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxpiechartoptions.series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    series: [{
        /**
        * @name dxpiechartoptions.series.name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxpiechartoptions.series.tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxpiechartoptions.series.type
        * @publicName type
        * @type Enums.PieChartType
        * @default 'pie'
        * @deprecated dxpiechartoptions.type
        */
        type: 'pie'
    }],
    /**
    * @name dxpiechartoptions.type
    * @publicName type
    * @type Enums.PieChartType
    * @default 'pie'
    */
    type: 'pie',
    /**
    * @name dxpiechartoptions.commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxpiechartoptions.commonseriessettings.type
        * @publicName type
        * @type Enums.PieChartType
        * @default 'pie'
        * @deprecated dxpiechartoptions.type
        */
        type: 'pie'
    },
    /**
    * @name dxpiechartmethods.getseries
    * @publicName getSeries()
    * @return pieChartSeriesObject
    * @deprecated basechartmethods.getallseries
    */
    getSeries: function() { },
    /**
    * @name dxpiechartoptions.diameter
    * @publicName diameter
    * @type number
    * @default undefined
    */
    diameter: undefined,
    /**
    * @name dxpiechartoptions.mindiameter
    * @publicName minDiameter
    * @type number
    * @default 0.5
    */
    minDiameter: 0.5,
    /**
   * @name dxpiechartoptions.segmentsdirection
   * @publicName segmentsDirection
   * @type Enums.PieChartSegmentsDirection
   * @default 'clockwise'
   */
    segmentsDirection: 'clockwise',
    /**
    * @name dxpiechartoptions.startangle
    * @publicName startAngle
    * @type number
    * @default 0
    */
    startAngle: 0,
    /**
    * @name dxpiechartoptions.innerradius
    * @publicName innerRadius
    * @type number
    * @default 0.5
    * @propertyOf dxChartSeriesTypes.DoughnutSeries
    */
    innerRadius: 0.5,
    /**
    * @name dxpiechartoptions.onlegendclick
    * @publicName onLegendClick
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
    * @name dxpiechartoptions.sizegroup
    * @publicName sizeGroup
    * @type string
    * @default undefined
    */
    sizeGroup: undefined
};

/**
* @name dxpolarchart
* @publicName dxPolarChart
* @inherits BaseChart
* @module viz/polar_chart
* @export default
*/
var dxPolarChart = {
    /**
    * @name dxpolarchart.options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxpolarchartoptions.seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxpolarchartoptions.seriestemplate.nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxpolarchartoptions.seriestemplate.customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxPolarChartOptions.series
        */
        customizeSeries: function() { }
    },
    /**
     * @name dxpolarchartoptions.usespiderweb
     * @publicName useSpiderWeb
     * @type boolean
     * @default false
     */
    useSpiderWeb: false,
    /**
    * @name dxpolarchartoptions.resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.PolarChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxpolarchartoptions.seriesSelectionMode
    * @publicName seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxpolarchartoptions.containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxpolarchartoptions.onseriesclick
    * @publicName onSeriesClick
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
    * @name dxpolarchartoptions.onlegendclick
    * @publicName onLegendClick
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
    * @name dxpolarchartoptions.equalbarwidth
    * @publicName equalBarWidth
    * @type boolean
    * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxpolarchartoptions.barwidth
    * @publicName barWidth
    * @type number
    * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
    */
    barWidth: undefined,
    /**
    * @name dxpolarchartoptions.bargrouppadding
    * @publicName barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxpolarchartoptions.bargroupwidth
    * @publicName barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barGroupWidth: undefined,
    /**
    * @name dxpolarchartoptions.negativesaszeroes
    * @publicName negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxChartSeriesTypes.stackedbarpolarseries
    */
    negativesAsZeroes: false,
    /**
    * @name dxpolarchartoptions.commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxpolarchartoptions.commonseriessettings.type
        * @publicName type
        * @type Enums.PolarChartSeriesType
        * @default 'scatter'
        */
        type: 'scatter',
        /**
        * @name dxpolarchartoptions.commonseriessettings.line
        * @publicName line
        * @type object
        */
        line: {},
        /**
        * @name dxpolarchartoptions.commonseriessettings.area
        * @publicName area
        * @type object
        */
        area: {},
        /**
        * @name dxpolarchartoptions.commonseriessettings.bar
        * @publicName bar
        * @type object
        */
        bar: {},
        /**
        * @name dxpolarchartoptions.commonseriessettings.stackedbar
        * @publicName stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxpolarchartoptions.commonseriessettings.scatter
        * @publicName scatter
        * @type object
        */
        scatter: {}
    },
    /**
    * @name dxpolarchartoptions.dataPrepareSettings
    * @publicName dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxpolarchartoptions.dataPrepareSettings.checkTypeForAllData
        * @publicName checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxpolarchartoptions.dataPrepareSettings.convertToAxisDataType
        * @publicName convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxpolarchartoptions.dataPrepareSettings.sortingMethod
        * @publicName sortingMethod
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
    * @name dxpolarchartoptions.onargumentaxisclick
    * @publicName onArgumentAxisClick
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
    * @name dxpolarchartoptions.legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxpolarchartoptions.legend.customizetext
        * @publicName customizeText
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
        * @name dxpolarchartoptions.legend.customizehint
        * @publicName customizeHint
        * @type function(seriesInfo)
        * @type_function_param1 seriesInfo:object
        * @type_function_param1_field1 seriesName:any
        * @type_function_param1_field2 seriesIndex:Number
        * @type_function_param1_field3 seriesColor:string
        * @type_function_return string
        */
        customizeHint: undefined,
        /**
        * @name dxpolarchartoptions.legend.hovermode
        * @publicName hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints'
    },
    /**
    * @name dxpolarchartoptions.commonaxissettings
    * @publicName commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxpolarchartoptions.commonaxissettings.setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxpolarchartoptions.commonaxissettings.discreteaxisdivisionMode
        * @publicName discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxpolarchartoptions.commonaxissettings.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxpolarchartoptions.commonaxissettings.color
        * @publicName color
        * @type string
        * @default '#d3d3d3'
        */
        color: '#d3d3d3',
        /**
        * @name dxpolarchartoptions.commonaxissettings.width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxpolarchartoptions.commonaxissettings.opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxpolarchartoptions.commonaxissettings.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.label.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions.commonaxissettings.label.overlappingBehavior
            * @publicName overlappingBehavior
            * @type string
            * @default 'hide'
            * @acceptValues 'hide' | 'none'
            * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
            */
            overlappingBehavior: 'hide',
            /**
            * @name dxpolarchartoptions.commonaxissettings.label.indentfromaxis
            * @publicName indentFromAxis
            * @type number
            * @default 5
            */
            indentFromAxis: 5,
            /**
            * @name dxpolarchartoptions.commonaxissettings.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxpolarchartoptions.commonaxissettings.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxpolarchartoptions.commonaxissettings.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxpolarchartoptions.commonaxissettings.label.font.color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxpolarchartoptions.commonaxissettings.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxpolarchartoptions.commonaxissettings.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.grid
        * @publicName grid
        * @type object
        */
        grid: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.grid.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions.commonaxissettings.grid.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions.commonaxissettings.grid.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions.commonaxissettings.grid.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.minorgrid
        * @publicName minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.minorgrid.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions.commonaxissettings.minorgrid.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions.commonaxissettings.minorgrid.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions.commonaxissettings.minorgrid.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.tick.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions.commonaxissettings.tick.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions.commonaxissettings.tick.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxpolarchartoptions.commonaxissettings.tick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions.commonaxissettings.tick.length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
       * @name dxpolarchartoptions.commonaxissettings.minortick
       * @publicName minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.minortick.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxpolarchartoptions.commonaxissettings.minortick.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions.commonaxissettings.minortick.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxpolarchartoptions.commonaxissettings.minortick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions.commonaxissettings.minortick.length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.stripstyle
        * @publicName stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.stripstyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.stripstyle.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.visible
                * @publicName visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font.family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font.weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font.color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font.size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxpolarchartoptions.commonaxissettings.constantlinestyle.label.font.opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxpolarchartoptions.commonaxissettings.inverted
        * @publicName inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxpolarchartoptions.commonaxissettings.allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxpolarchartoptions.commonaxissettings.endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxpolarchartoptions.argumentaxis
    * @publicName argumentAxis
    * @type object
    * @inherits dxpolarchartoptions.commonaxissettings
    */
    argumentAxis: {
        /**
         * @name dxpolarchartoptions.argumentaxis.startangle
         * @publicName startAngle
         * @type number
         * @default 0
         */
        startAngle: 0,
        /**
         * @name dxpolarchartoptions.argumentaxis.firstpointonstartangle
         * @publicName firstPointOnStartAngle
         * @type boolean
         * @default false
         */
        firstPointOnStartAngle: false,
        /**
         * @name dxpolarchartoptions.argumentaxis.period
         * @publicName period
         * @type number
         * @default undefined
         */
        period: 0,
        /**
        * @name dxpolarchartoptions.argumentaxis.originvalue
        * @publicName originValue
        * @type number
        * @default undefined
        */
        originValue: undefined,
        /**
        * @name dxpolarchartoptions.argumentaxis.tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxpolarchartoptions.argumentaxis.minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxpolarchartoptions.argumentaxis.minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxpolarchartoptions.argumentaxis.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions.argumentaxis.label.customizetext
            * @publicName customizeText
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.label.customizehint
            * @publicName customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxpolarchartoptions.argumentaxis.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxpolarchartoptions.argumentaxis.strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions.commonaxissettings.stripstyle
        */
        strips: [{
            /**
            * @name dxpolarchartoptions.argumentaxis.strips.startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.strips.endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.strips.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.strips.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.argumentaxis.strips.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions.argumentaxis.constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @inherits dxpolarchartoptions.commonaxissettings.constantlinestyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxpolarchartoptions.argumentaxis.constantlines.value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxpolarchartoptions.argumentaxis.constantlines.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.argumentaxis.constantlines.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions.argumentaxis.axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 50
        */
        axisDivisionFactor: 50,
        /**
        * @name dxpolarchartoptions.argumentaxis.categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxpolarchartoptions.argumentaxis.type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxpolarchartoptions.argumentaxis.logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxpolarchartoptions.argumentaxis.argumenttype
        * @publicName argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxpolarchartoptions.argumentaxis.hovermode
        * @publicName hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none'
    },
    /**
    * @name dxpolarchartoptions.valueaxis
    * @publicName valueAxis
    * @type object
    * @inherits dxpolarchartoptions.commonaxissettings
    */
    valueAxis: {
        /**
        * @name dxpolarchartoptions.valueaxis.showZero
        * @publicName showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxpolarchartoptions.valueaxis.tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxpolarchartoptions.valueaxis.minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxpolarchartoptions.valueaxis.minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxpolarchartoptions.valueaxis.tick
        * @publicName tick
        * @type object
        * @inheritdoc
        */
        tick: {
            /**
            * @name dxpolarchartoptions.valueaxis.tick.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @inheritdoc
            */
            visible: false,
        },
        /**
        * @name dxpolarchartoptions.valueaxis.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions.valueaxis.label.customizetext
            * @publicName customizeText
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.label.customizehint
            * @publicName customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxpolarchartoptions.valueaxis.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxpolarchartoptions.valueaxis.strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions.commonaxissettings.stripstyle
        */
        strips: [{
            /**
            * @name dxpolarchartoptions.valueaxis.strips.startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.strips.endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.strips.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.strips.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.valueaxis.strips.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions.valueaxis.constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions.commonaxissettings.constantlinestyle
        */
        constantLines: [{
            /**
            * @name dxpolarchartoptions.valueaxis.constantlines.value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxpolarchartoptions.valueaxis.constantlines.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions.valueaxis.constantlines.label.text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions.valueaxis.minvaluemargin
        * @publicName minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxpolarchartoptions.valueaxis.maxvaluemargin
        * @publicName maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxpolarchartoptions.valueaxis.valuemarginsenabled
        * @publicName valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxpolarchartoptions.valueaxis.axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 30
        */
        axisDivisionFactor: 30,
        /**
        * @name dxpolarchartoptions.valueaxis.categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxpolarchartoptions.valueaxis.type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxpolarchartoptions.valueaxis.logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxpolarchartoptions.valueaxis.valuetype
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
         /**
        * @name dxpolarchartoptions.valueaxis.endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        * @inheritdoc
        */
        endOnTick: false
    },
    /**
    * @name dxpolarchartoptions.tooltip
    * @type object
    * @publicName tooltip
    * @inheritdoc
    **/
    tooltip: {
        /**
        * @name dxpolarchartoptions.tooltip.shared
        * @publicName shared
        * @type boolean
        * @default false
        */
        shared: false
    },
    /**
    * @name dxpolarchartoptions.onserieshoverchanged
    * @publicName onSeriesHoverChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesHoverChanged: function() { },
    /**
    * @name dxpolarchartoptions.onseriesselectionchanged
    * @publicName onSeriesSelectionChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:polarChartSeriesObject
    * @notUsedInTheme
    * @action
    */
    onSeriesSelectionChanged: function() { },
    /**
    * @name dxpolarchartoptions.series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: [{
        /**
        * @name dxpolarchartoptions.series.name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxpolarchartoptions.series.tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxpolarchartoptions.series.type
        * @publicName type
        * @type Enums.PolarChartSeriesType
        * @default 'scatter'
        */
        type: 'scatter'
    }],
};
/**
* @name basechart
* @publicName BaseChart
* @type object
* @hidden
* @inherits BaseWidget
*/
var BaseChart = {
    /**
    * @name basechart.options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name basechartoptions.ondone
    * @publicName onDone
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onDone: function() { },
    /**
    * @name basechartoptions.ontooltipshown
    * @publicName onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:basePointObject
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name basechartoptions.ontooltiphidden
    * @publicName onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:basePointObject
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name basechartoptions.pointSelectionMode
    * @publicName pointSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    pointSelectionMode: 'single',
    /**
    * @name basechartoptions.animation
    * @publicName animation
    * @type object|boolean
    */
    animation: {
        /**
        * @name basechartoptions.animation.enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name basechartoptions.animation.duration
        * @publicName duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name basechartoptions.animation.easing
        * @publicName easing
        * @type Enums.VizAnimationEasing
        * @default 'easeOutCubic'
        */
        easing: 'easeOutCubic',
        /**
        * @name basechartoptions.animation.maxpointcountsupported
        * @publicName maxPointCountSupported
        * @type number
        * @default 300
        */
        maxPointCountSupported: 300
    },
    /**
    * @name basechartoptions.tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
       /**
       * @name basechartoptions.tooltip.customizetooltip
       * @publicName customizeTooltip
       * @type function(pointInfo)
       * @type_function_param1 pointInfo:object
       * @type_function_return object
       * @default undefined
       * @notUsedInTheme
       */
        customizeTooltip: undefined,
        /**
        * @name basechartoptions.tooltip.argumentformat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name basechartoptions.tooltip.argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name basechartoptions.tooltip.percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        percentPrecision: 0
    },
    /**
    * @name basechartoptions.onpointclick
    * @publicName onPointClick
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
    * @name basechartoptions.onpointselectionchanged
    * @publicName onPointSelectionChanged
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
    * @name basechartoptions.onpointhoverchanged
    * @publicName onPointHoverChanged
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
    * @name basechartoptions.datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name basechartoptions.palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name basechartoptions.paletteextensionmode
    * @publicName paletteExtensionMode
    * @type Enums.VizPaletteExtensionMode
    * @default 'blend'
    */
    paletteExtensionMode: 'blend',
    /**
    * @name basechartoptions.legend
    * @publicName legend
    * @type object
    */
    legend: {

        /**
        * @name basechartoptions.legend.verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name basechartoptions.legend.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalAlignment: 'right',
        /**
        * @name basechartoptions.legend.orientation
        * @publicName orientation
        * @type Enums.Orientation
        * @default undefined
        */
        orientation: undefined,
        /**
        * @name basechartoptions.legend.itemtextposition
        * @publicName itemTextPosition
        * @type Enums.Position
        * @default undefined
        */
        itemTextPosition: undefined,
        /**
        * @name basechartoptions.legend.itemsalignment
        * @publicName itemsAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        itemsAlignment: undefined,
        /**
        * @name basechartoptions.legend.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name basechartoptions.legend.font.color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name basechartoptions.legend.font.family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name basechartoptions.legend.font.weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name basechartoptions.legend.font.size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name basechartoptions.legend.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name basechartoptions.legend.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name basechartoptions.legend.margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name basechartoptions.legend.margin.top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name basechartoptions.legend.margin.bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name basechartoptions.legend.margin.left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name basechartoptions.legend.margin.right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name basechartoptions.legend.markersize
        * @publicName markerSize
        * @type number
        * @default 20
        */
        markerSize: 20,
        /**
        * @name basechartoptions.legend.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name basechartoptions.legend.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name basechartoptions.legend.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name basechartoptions.legend.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name basechartoptions.legend.border.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name basechartoptions.legend.border.cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name basechartoptions.legend.border.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name basechartoptions.legend.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name basechartoptions.legend.paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name basechartoptions.legend.paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name basechartoptions.legend.columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name basechartoptions.legend.rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name basechartoptions.legend.columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 20
        */
        columnItemSpacing: 20,
        /**
        * @name basechartoptions.legend.rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8
    },
    /**
    * @name basechartoptions.series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @notUsedInTheme
    * @hideDefaults true
    */
    series: [{

    }],
    /**
    * @name basechartoptions.customizepoint
    * @publicName customizePoint
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes.CommonSeries.point
    */
    customizePoint: undefined,
    /**
    * @name basechartoptions.customizelabel
    * @publicName customizeLabel
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes.CommonSeries.label
    */
    customizeLabel: undefined,
    /**
    * @name basechartmethods.clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name basechartmethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name basechartmethods.render
    * @publicName render(renderOptions)
    * @param1 renderOptions:object
    */
    render: function(renderOptions) { },
    /**
    * @name basechartmethods.getallseries
    * @publicName getAllSeries()
    * @return Array<baseSeriesObject>
    */
    getAllSeries: function() { },
    /**
    * @name basechartmethods.getseriesbyname
    * @publicName getSeriesByName(seriesName)
    * @param1 seriesName:any
    * @return chartSeriesObject
    */
    getSeriesByName: function() { },
    /**
    * @name basechartmethods.getseriesbypos
    * @publicName getSeriesByPos(seriesIndex)
    * @param1 seriesIndex:number
    * @return chartSeriesObject
    */
    getSeriesByPos: function() { },
    /**
    * @name basechartmethods.getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
    /**
    * @name basechartoptions.adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    /**
    * @name dxpiechartoptions.adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    /**
    * @name dxpolarchartoptions.adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name basechartoptions.adaptiveLayout.width
        * @publicName width
        * @type number
        * @default 80
        */
        /**
        * @name dxpolarchartoptions.adaptiveLayout.width
        * @publicName width
        * @type number
        * @default 170
        * @inheritdoc
        */
        width: 80,
        /**
        * @name basechartoptions.adaptiveLayout.height
        * @publicName height
        * @type number
        * @default 80
        */
        /**
        * @name dxpolarchartoptions.adaptiveLayout.height
        * @publicName height
        * @type number
        * @default 170
        * @inheritdoc
        */
        height: 80,
        /**
        * @name basechartoptions.adaptiveLayout.keepLabels
        * @publicName keepLabels
        * @type boolean
        * @default true
        */
        /**
        * @name dxpiechartoptions.adaptiveLayout.keepLabels
        * @publicName keepLabels
        * @type boolean
        * @default false
        * @inheritdoc
        */
        keepLabels: true
    }
};
