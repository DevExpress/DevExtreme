/**
* @name dxchart
* @publicName dxChart
* @inherits BaseChart
* @module viz/chart
* @export default
*/
var dxChart = {
    /**
    * @name dxchart_options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxchartoptions_seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxchartoptions_seriestemplate_nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxchartoptions_seriestemplate_customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxChartOptions_series
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxchartoptions_resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.ChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxchartoptions_seriesSelectionMode
    * @publicName seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxchartoptions_containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxchartoptions_onseriesclick
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
    * @name dxchartoptions_onlegendclick
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
    * @name dxchartoptions_equalbarwidth
    * @publicName equalBarWidth
    * @type boolean
    * @deprecated dxChartSeriesTypes_CommonSeries_ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxchartoptions_barwidth
    * @publicName barWidth
    * @type number
    * @deprecated dxChartSeriesTypes_CommonSeries_barPadding
    */
    barWidth: undefined,
    /**
    * @name dxchartoptions_bargrouppadding
    * @publicName barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeriesSeries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxchartoptions_bargroupwidth
    * @publicName barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeriesSeries
    */
    barGroupWidth: undefined,
    /**
    * @name dxchartoptions_negativesaszeroes
    * @publicName negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_StackedAreaSeries,dxChartSeriesTypes_FullStackedAreaSeries,dxChartSeriesTypes_StackedLineSeries,dxChartSeriesTypes_FullStackedLineSeries,dxChartSeriesTypes_StackedSplineSeries,dxChartSeriesTypes_FullStackedSplineSeries,dxChartSeriesTypes_StackedSplineAreaSeries,dxChartSeriesTypes_FullStackedSplineAreaSeries
    */
    negativesAsZeroes: false,
    /**
    * @name dxchartoptions_commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxChartSeriesTypes_CommonSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxchartoptions_commonseriessettings_type
        * @publicName type
        * @type Enums.SeriesType
        * @default 'line'
        */
        type: 'line',
        /**
        * @name dxchartoptions_commonseriessettings_line
        * @publicName line
        * @type object
        */
        line: {},
        /**
        * @name dxchartoptions_commonseriessettings_fullstackedline
        * @publicName fullstackedline
        * @type object
        */
        fullstackedline: {},
        /**
        * @name dxchartoptions_commonseriessettings_fullstackedspline
        * @publicName fullstackedspline
        * @type object
        */
        fullstackedspline: {},
        /**
        * @name dxchartoptions_commonseriessettings_stackedline
        * @publicName stackedline
        * @type object
        */
        stackedline: {},
        /**
        * @name dxchartoptions_commonseriessettings_stackedspline
        * @publicName stackedspline
        * @type object
        */
        stackedspline: {},
        /**
        * @name dxchartoptions_commonseriessettings_stepline
        * @publicName stepline
        * @type object
        */
        stepline: {},
        /**
        * @name dxchartoptions_commonseriessettings_area
        * @publicName area
        * @type object
        */
        area: {},
        /**
        * @name dxchartoptions_commonseriessettings_fullstackedarea
        * @publicName fullstackedarea
        * @type object
        */
        fullstackedarea: {},
        /**
        * @name dxchartoptions_commonseriessettings_fullstackedsplinearea
        * @publicName fullstackedsplinearea
        * @type object
        */
        fullstackedsplinearea: {},
        /**
        * @name dxchartoptions_commonseriessettings_stackedarea
        * @publicName stackedarea
        * @type object
        */
        stackedarea: {},
        /**
        * @name dxchartoptions_commonseriessettings_stackedsplinearea
        * @publicName stackedsplinearea
        * @type object
        */
        stackedsplinearea: {},
        /**
        * @name dxchartoptions_commonseriessettings_steparea
        * @publicName steparea
        * @type object
        */
        steparea: {},
        /**
        * @name dxchartoptions_commonseriessettings_bar
        * @publicName bar
        * @type object
        */
        bar: {},
        /**
        * @name dxchartoptions_commonseriessettings_fullstackedbar
        * @publicName fullstackedbar
        * @type object
        */
        fullstackedbar: {},
        /**
        * @name dxchartoptions_commonseriessettings_stackedbar
        * @publicName stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxchartoptions_commonseriessettings_spline
        * @publicName spline
        * @type object
        */
        spline: {},
        /**
        * @name dxchartoptions_commonseriessettings_splinearea
        * @publicName splinearea
        * @type object
        */
        splinearea: {},
        /**
        * @name dxchartoptions_commonseriessettings_scatter
        * @publicName scatter
        * @type object
        */
        scatter: {},
        /**
        * @name dxchartoptions_commonseriessettings_candlestick
        * @publicName candlestick
        * @type object
        */
        candlestick: {},
        /**
        * @name dxchartoptions_commonseriessettings_stock
        * @publicName stock
        * @type object
        */
        stock: {},
        /**
        * @name dxchartoptions_commonseriessettings_rangebar
        * @publicName rangebar
        * @type object
        */
        rangebar: {},
        /**
        * @name dxchartoptions_commonseriessettings_rangearea
        * @publicName rangearea
        * @type object
        */
        rangearea: {},
        /**
        * @name dxchartoptions_commonseriessettings_bubble
        * @publicName bubble
        * @type object
        */
        bubble: {}
    },
    /**
    * @name dxchartoptions_defaultpane
    * @publicName defaultPane
    * @type string
    * @default undefined
    * @notUsedInTheme
    */
    defaultPane: undefined,
    /**
    * @name dxchartoptions_adjustonzoom
    * @publicName adjustOnZoom
    * @type boolean
    * @default true
    */
    adjustOnZoom: true,
    /**
    * @name dxchartoptions_rotated
    * @publicName rotated
    * @type boolean
    * @default false
    */
    rotated: false,
    /**
    * @name dxchartoptions_synchronizemultiaxes
    * @publicName synchronizeMultiAxes
    * @type boolean
    * @default true
    */
    synchronizeMultiAxes: true,
    /**
    * @name dxchartoptions_commonpanesettings
    * @publicName commonPaneSettings
    * @type object
    */
    commonPaneSettings: {
        /**
        * @name dxchartoptions_commonpanesettings_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default 'none'
        */
        backgroundColor: 'none',
        /**
        * @name dxchartoptions_commonpanesettings_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxchartoptions_commonpanesettings_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions_commonpanesettings_border_top
            * @publicName top
            * @type boolean
            * @default true
            */
            top: true,
            /**
            * @name dxchartoptions_commonpanesettings_border_bottom
            * @publicName bottom
            * @type boolean
            * @default true
            */
            bottom: true,
            /**
            * @name dxchartoptions_commonpanesettings_border_left
            * @publicName left
            * @type boolean
            * @default true
            */
            left: true,
            /**
            * @name dxchartoptions_commonpanesettings_border_right
            * @publicName right
            * @type boolean
            * @default true
            */
            right: true,
            /**
            * @name dxchartoptions_commonpanesettings_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions_commonpanesettings_border_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions_commonpanesettings_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonpanesettings_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxchartoptions_panes
    * @publicName panes
    * @type Object|Array<Object>
    * @inherits dxchartoptions_commonpanesettings
    * @notUsedInTheme
    */
    panes: [{
        /**
        * @name dxchartoptions_panes_name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined
    }],
    /**
    * @name dxchartoptions_dataPrepareSettings
    * @publicName dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxchartoptions_dataPrepareSettings_checkTypeForAllData
        * @publicName checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxchartoptions_dataPrepareSettings_convertToAxisDataType
        * @publicName convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxchartoptions_dataPrepareSettings_sortingMethod
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
    * @name dxchartoptions_scrollbar
    * @publicName scrollBar
    * @type object
    */
    scrollBar: {
        /**
        * @name dxchartoptions_scrollbar_visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxchartoptions_scrollbar_offset
        * @publicName offset
        * @type number
        * @default 5
        */
        offset: 5,
        /**
        * @name dxchartoptions_scrollbar_color
        * @publicName color
        * @type string
        * @default 'gray'
        */
        color: "gray",
       /**
       * @name dxchartoptions_scrollbar_width
       * @publicName width
       * @type number
       * @default 10
       */
        width: 10,
       /**
       * @name dxchartoptions_scrollbar_opacity
       * @publicName opacity
       * @type number
       * @default undefined
       */
        opacity: undefined,
        /**
       * @name dxchartoptions_scrollbar_position
       * @publicName position
       * @type Enums.Position
       * @default 'top'
       */
        position: 'top'
    },
    /**
    * @name dxchartoptions_zoomingmode
    * @publicName zoomingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    */
    zoomingMode: 'none',
    /**
    * @name dxchartoptions_scrollingmode
    * @publicName scrollingMode
    * @type Enums.ChartPointerType
    * @default 'none'
    */
    scrollingMode: 'none',
    /**
    * @name dxchartoptions_useAggregation
    * @publicName useAggregation
    * @type boolean
    * @deprecated dxChartSeriesTypes_CommonSeries_aggregation_enabled
    */
    useAggregation: false,
    /**
    * @name dxchartoptions_crosshair
    * @publicName crosshair
    * @type object
    */
    crosshair: {
        /**
        * @name dxchartoptions_crosshair_enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name dxchartoptions_crosshair_color
        * @publicName color
        * @type string
        * @default '#f05b41'
        */
        color: '#f05b41',
        /**
        * @name dxchartoptions_crosshair_width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxchartoptions_crosshair_dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle: 'solid',
        /**
        * @name dxchartoptions_crosshair_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxchartoptions_crosshair_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions_crosshair_label_backgroundcolor
            * @publicName backgroundColor
            * @type string
            * @default "#f05b41"
            */
            backgroundColor: "#f05b41",
            /**
             * @name dxchartoptions_crosshair_label_visible
             * @publicName visible
             * @type boolean
             * @default false
             */
            visible: false,
            /**
             * @name dxchartoptions_crosshair_label_font
             * @publicName font
             * @type object
             */
            font: {
                /**
                * @name dxchartoptions_crosshair_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions_crosshair_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions_crosshair_label_font_color
                * @publicName color
                * @type string
                * @default '#FFFFFF'
                */
                color: '#FFFFFF',
                /**
                * @name dxchartoptions_crosshair_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxchartoptions_crosshair_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
           * @name dxchartoptions_crosshair_label_format
           * @publicName format
           * @extends CommonVizFormat
           */
            format: '',
            /**
            * @name dxchartoptions_crosshair_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0,
            /**
            * @name dxchartoptions_crosshair_label_customizetext
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
        * @name dxchartoptions_crosshair_verticalline
        * @publicName verticalLine
        * @type object | boolean
        */
        verticalLine: {
            /**
            * @name dxchartoptions_crosshair_verticalline_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions_crosshair_verticalline_color
            * @publicName color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxchartoptions_crosshair_verticalline_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_crosshair_verticalline_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions_crosshair_verticalline_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions_crosshair_verticalline_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_crosshair_verticalline_label_backgroundcolor
                * @publicName backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxchartoptions_crosshair_verticalline_label_visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxchartoptions_crosshair_verticalline_label_font
                 * @publicName font
                 * @type object
                 */
                font: {
                    /**
                    * @name dxchartoptions_crosshair_verticalline_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions_crosshair_verticalline_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions_crosshair_verticalline_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#FFFFFF'
                    */
                    color: '#FFFFFF',
                    /**
                    * @name dxchartoptions_crosshair_verticalline_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions_crosshair_verticalline_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                },
                /**
                * @name dxchartoptions_crosshair_verticalline_label_format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxchartoptions_crosshair_verticalline_label_precision
                * @publicName precision
                * @extends CommonVizPrecision
                */
                precision: 0,
                /**
                * @name dxchartoptions_crosshair_verticalline_label_customizetext
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
        * @name dxchartoptions_crosshair_horizontalline
        * @publicName horizontalLine
        * @type object | boolean
        */
        horizontalLine: {
            /**
            * @name dxchartoptions_crosshair_horizontalline_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions_crosshair_horizontalline_color
            * @publicName color
            * @type string
            * @default "#f05b41"
            */
            color: "#f05b41",
            /**
            * @name dxchartoptions_crosshair_horizontalline_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_crosshair_horizontalline_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions_crosshair_horizontalline_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions_crosshair_horizontalline_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_crosshair_horizontalline_label_backgroundcolor
                * @publicName backgroundColor
                * @type string
                * @default "#f05b41"
                */
                backgroundColor: "#f05b41",
                /**
                 * @name dxchartoptions_crosshair_horizontalline_label_visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxchartoptions_crosshair_horizontalline_label_font
                 * @publicName font
                 * @type object
                 */
                font: {
                    /**
                    * @name dxchartoptions_crosshair_horizontalline_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions_crosshair_horizontalline_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions_crosshair_horizontalline_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#FFFFFF'
                    */
                    color: '#FFFFFF',
                    /**
                    * @name dxchartoptions_crosshair_horizontalline_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions_crosshair_horizontalline_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                },
                /**
                * @name dxchartoptions_crosshair_horizontalline_label_format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxchartoptions_crosshair_horizontalline_label_precision
                * @publicName precision
                * @extends CommonVizPrecision
                */
                precision: 0,
                /**
                * @name dxchartoptions_crosshair_horizontalline_label_customizetext
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
    * @name dxchartoptions_onargumentaxisclick
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
    * @name dxchartoptions_legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxchartoptions_legend_customizetext
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
        * @name dxchartoptions_legend_customizehint
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
        * @name dxchartoptions_legend_hovermode
        * @publicName hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints',
        /**
        * @name dxchartoptions_legend_position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'outside'
        */
        position: 'outside'
    },
    /**
    * @name dxchartoptions_commonaxissettings
    * @publicName commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxchartoptions_commonaxissettings_setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxchartoptions_commonaxissettings_discreteaxisdivisionMode
        * @publicName discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxchartoptions_commonaxissettings_visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxchartoptions_commonaxissettings_color
        * @publicName color
        * @type string
        * @default '#d3d3d3'
        */
        color: '#d3d3d3',
        /**
        * @name dxchartoptions_commonaxissettings_width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxchartoptions_commonaxissettings_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxchartoptions_commonaxissettings_placeholdersize
        * @publicName placeholderSize
        * @type number
        * @default null
        */
        placeholderSize: null,
        /**
        * @name dxchartoptions_commonaxissettings_breakStyle
        * @publicName breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxchartoptions_commonaxissettings_breakStyle_width
            * @publicName width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxchartoptions_commonaxissettings_breakStyle_color
            * @publicName color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxchartoptions_commonaxissettings_breakStyle_line
            * @publicName line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxchartoptions_commonaxissettings_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions_commonaxissettings_label_alignment
            * @publicName alignment
            * @type Enums.HorizontalAlignment
            * @default undefined
            */
            alignment: undefined,
            /**
            * @name dxchartoptions_commonaxissettings_label_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxchartoptions_commonaxissettings_label_rotationangle
            * @publicName rotationAngle
            * @type number
            * @default 90
            */
            rotationAngle: 90,
            /**
            * @name dxchartoptions_commonaxissettings_label_staggeringspacing
            * @publicName staggeringSpacing
            * @type number
            * @default 5
            */
            staggeringSpacing: 5,
            /**
            * @name dxchartoptions_commonaxissettings_label_displaymode
            * @publicName displayMode
            * @type Enums.ChartLabelDisplayMode
            * @default 'standard'
            */
            displayMode: "standard",
            /**
            * @name dxchartoptions_commonaxissettings_label_overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @default 'hide'
            * @acceptValues 'stagger' | 'rotate' | 'hide' | 'none'
            * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
            */
            overlappingBehavior: {
                /**
                * @name dxchartoptions_commonaxissettings_label_overlappingBehavior_mode
                * @publicName mode
                * @type string
                * @default 'hide'
                * @acceptValues 'stagger' | 'rotate' | 'hide' | 'none'
                * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
                * @deprecated dxchartoptions_commonaxissettings_label_overlappingBehavior
                */
                mode: 'hide',
                /**
                * @name dxchartoptions_commonaxissettings_label_overlappingBehavior_rotationangle
                * @publicName rotationAngle
                * @type number
                * @default 90
                * @deprecated dxchartoptions_commonaxissettings_label_rotationangle
                */
                rotationAngle: 90,
                /**
                * @name dxchartoptions_commonaxissettings_label_overlappingBehavior_staggeringSpacing
                * @publicName staggeringSpacing
                * @type number
                * @default 5
                * @deprecated dxchartoptions_commonaxissettings_label_staggeringspacing
                */
                staggeringSpacing: 5
            },
            /**
            * @name dxchartoptions_commonaxissettings_label_indentfromaxis
            * @publicName indentFromAxis
            * @type number
            * @default 10
            */
            indentFromAxis: 10,
            /**
            * @name dxchartoptions_commonaxissettings_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxchartoptions_commonaxissettings_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions_commonaxissettings_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions_commonaxissettings_label_font_color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxchartoptions_commonaxissettings_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxchartoptions_commonaxissettings_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        },
        /**
        * @name dxchartoptions_commonaxissettings_grid
        * @publicName grid
        * @type object
        */
        grid: {
            /**
            * @name dxchartoptions_commonaxissettings_grid_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions_commonaxissettings_grid_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions_commonaxissettings_grid_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonaxissettings_grid_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxchartoptions_commonaxissettings_minorgrid
        * @publicName minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxchartoptions_commonaxissettings_minorgrid_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions_commonaxissettings_minorgrid_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions_commonaxissettings_minorgrid_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonaxissettings_minorgrid_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxchartoptions_commonaxissettings_tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxchartoptions_commonaxissettings_tick_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions_commonaxissettings_tick_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions_commonaxissettings_tick_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions_commonaxissettings_tick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonaxissettings_tick_length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
       * @name dxchartoptions_commonaxissettings_minortick
       * @publicName minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxchartoptions_commonaxissettings_minortick_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxchartoptions_commonaxissettings_minortick_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxchartoptions_commonaxissettings_minortick_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxchartoptions_commonaxissettings_minortick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonaxissettings_minortick_length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8,
        },
        /**
        * @name dxchartoptions_commonaxissettings_title
        * @publicName title
        * @type object
        */
        title: {
            /**
            * @name dxchartoptions_commonaxissettings_title_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxchartoptions_commonaxissettings_title_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxchartoptions_commonaxissettings_title_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxchartoptions_commonaxissettings_title_font_color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxchartoptions_commonaxissettings_title_font_size
                * @publicName size
                * @type number|string
                * @default 16
                */
                size: 16,
                /**
                * @name dxchartoptions_commonaxissettings_title_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
            * @name dxchartoptions_commonaxissettings_title_margin
            * @publicName margin
            * @type number
            * @default 6
            */
            margin: 6
        },
        /**
        * @name dxchartoptions_commonaxissettings_stripstyle
        * @publicName stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxchartoptions_commonaxissettings_stripstyle_paddingleftright
            * @publicName paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxchartoptions_commonaxissettings_stripstyle_paddingtopbottom
            * @publicName paddingTopBottom
            * @type number
            * @default 5
            */
            paddingTopBottom: 5,
            /**
            * @name dxchartoptions_commonaxissettings_stripstyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_commonaxissettings_stripstyle_label_horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions_commonaxissettings_stripstyle_label_verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'center'
                */
                verticalAlignment: 'center',
                /**
                * @name dxchartoptions_commonaxissettings_stripstyle_label_font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxchartoptions_commonaxissettings_stripstyle_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions_commonaxissettings_stripstyle_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions_commonaxissettings_stripstyle_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxchartoptions_commonaxissettings_stripstyle_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions_commonaxissettings_stripstyle_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxchartoptions_commonaxissettings_constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_paddingleftright
            * @publicName paddingLeftRight
            * @type number
            * @default 10
            */
            paddingLeftRight: 10,
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_paddingtopbottom
            * @publicName paddingTopBottom
            * @type number
            * @default 10
            */
            paddingTopBottom: 10,
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxchartoptions_commonaxissettings_constantlinestyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_commonaxissettings_constantlinestyle_label_visible
                * @publicName visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxchartoptions_commonaxissettings_constantlinestyle_label_position
                * @publicName position
                * @type Enums.RelativePosition
                * @default 'inside'
                */
                position: 'inside',
                /**
                * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxchartoptions_commonaxissettings_constantlinestyle_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxchartoptions_commonaxissettings_minvaluemargin
        * @publicName minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxchartoptions_commonaxissettings_maxvaluemargin
        * @publicName maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxchartoptions_commonaxissettings_valuemarginsenabled
        * @publicName valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxchartoptions_commonaxissettings_inverted
        * @publicName inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxchartoptions_commonaxissettings_allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxchartoptions_commonaxissettings_endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxchartoptions_argumentaxis
    * @publicName argumentAxis
    * @type object
    * @inherits dxchartoptions_commonaxissettings
    */
    argumentAxis: {
        /**
        * @name dxchartoptions_argumentaxis_tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxchartoptions_argumentaxis_minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxchartoptions_argumentaxis_minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxchartoptions_argumentaxis_title
        * @publicName title
        * @type string|object
        */
        title: {
            /**
            * @name dxchartoptions_argumentaxis_title_text
            * @publicName text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxchartoptions_argumentaxis_workdaysonly
        * @publicName workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxchartoptions_argumentaxis_workweek
        * @publicName workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxchartoptions_argumentaxis_holidays
        * @publicName holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxchartoptions_argumentaxis_breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @default undefined
        * @inherits ScaleBreak
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxchartoptions_argumentaxis_singleworkdays
        * @publicName singleWorkdays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxchartoptions_argumentaxis_aggregationGroupWidth
        * @publicName aggregationGroupWidth
        * @type number
        * @default undefined
        * @default 10 @for bar
        * @default 10 @for stacked_bar
        * @default 10 @for full-stacked_bar
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxchartoptions_argumentaxis_aggregationInterval
        * @publicName aggregationInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
        /**
        * @name dxchartoptions_argumentaxis_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions_argumentaxis_label_customizetext
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
            * @name dxchartoptions_argumentaxis_label_customizehint
            * @publicName customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxchartoptions_argumentaxis_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxchartoptions_argumentaxis_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxchartoptions_argumentaxis_strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions_commonaxissettings_stripstyle
        */
        strips: [{
            /**
            * @name dxchartoptions_argumentaxis_strips_startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxchartoptions_argumentaxis_strips_endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxchartoptions_argumentaxis_strips_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxchartoptions_argumentaxis_strips_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_argumentaxis_strips_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxchartoptions_argumentaxis_constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions_argumentaxis_constantlinestyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_argumentaxis_constantlinestyle_label_horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxchartoptions_argumentaxis_constantlinestyle_label_verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxchartoptions_argumentaxis_constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @inherits dxchartoptions_commonaxissettings_constantlinestyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxchartoptions_argumentaxis_constantlines_value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxchartoptions_argumentaxis_constantlines_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_argumentaxis_constantlines_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxchartoptions_argumentaxis_constantlines_label_horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'right'
                */
                horizontalAlignment: 'right',
                /**
                * @name dxchartoptions_argumentaxis_constantlines_label_verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxchartoptions_argumentaxis_position
        * @publicName position
        * @type Enums.Position
        * @default 'bottom'
        */
        position: 'bottom',
        /**
        * @name dxchartoptions_argumentaxis_min
        * @publicName min
        * @type number | datetime | string
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxchartoptions_argumentaxis_max
        * @publicName max
        * @type number | datetime | string
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxchartoptions_argumentaxis_axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 70
        */
        axisDivisionFactor: 70,
        /**
        * @name dxchartoptions_argumentaxis_categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxchartoptions_argumentaxis_type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxchartoptions_argumentaxis_logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxchartoptions_argumentaxis_argumenttype
        * @publicName argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxchartoptions_argumentaxis_hovermode
        * @publicName hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none',
        /**
        * @name dxchartoptions_argumentaxis_endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        * @inheritdoc
        */
        endOnTick: false
    },
    /**
    * @name dxchartoptions_valueaxis
    * @publicName valueAxis
    * @type Object|Array<Object>
    * @inherits dxchartoptions_commonaxissettings
    */
    valueAxis: {
        /**
        * @name dxchartoptions_valueaxis_showZero
        * @publicName showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxchartoptions_valueaxis_synchronizedvalue
        * @publicName synchronizedValue
        * @type number
        * @default undefined
        */
        synchronizedValue: undefined,
        /**
        * @name dxchartoptions_valueaxis_multipleaxesspacing
        * @publicName multipleAxesSpacing
        * @type number
        * @default 5
        */
        multipleAxesSpacing: 5,
        /**
        * @name dxchartoptions_valueaxis_tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxchartoptions_valueaxis_minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxchartoptions_valueaxis_minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxchartoptions_valueaxis_breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxchartoptions_valueaxis_autobreaksenabled
        * @publicName autoBreaksEnabled
        * @type boolean
        * @default false
        */
        autoBreaksEnabled: false,
        /**
        * @name dxchartoptions_valueaxis_maxautobreakcount
        * @publicName maxAutoBreakCount
        * @type numeric
        * @default 4
        */
        maxAutoBreakCount: 4,
        /**
        * @name dxchartoptions_valueaxis_title
        * @publicName title
        * @type string|object
        */
        title: {
            /**
            * @name dxchartoptions_valueaxis_title_text
            * @publicName text
            * @type string
            * @default undefined
            */
            text: undefined
        },
        /**
        * @name dxchartoptions_valueaxis_name
        * @publicName name
        * @type string
        * @default undefined
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxchartoptions_valueaxis_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxchartoptions_valueaxis_label_customizetext
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
            * @name dxchartoptions_valueaxis_label_customizehint
            * @publicName customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxchartoptions_valueaxis_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxchartoptions_valueaxis_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxchartoptions_valueaxis_strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions_commonaxissettings_stripstyle
        */
        strips: [{
            /**
            * @name dxchartoptions_valueaxis_strips_startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxchartoptions_valueaxis_strips_endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxchartoptions_valueaxis_strips_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxchartoptions_valueaxis_strips_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_valueaxis_strips_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxchartoptions_valueaxis_constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxchartoptions_valueaxis_constantlinestyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_valueaxis_constantlinestyle_label_horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions_valueaxis_constantlinestyle_label_verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        },
        /**
        * @name dxchartoptions_valueaxis_constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxchartoptions_commonaxissettings_constantlinestyle
        */
        constantLines: [{
            /**
            * @name dxchartoptions_valueaxis_constantlines_value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxchartoptions_valueaxis_constantlines_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxchartoptions_valueaxis_constantlines_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined,
                /**
                * @name dxchartoptions_valueaxis_constantlines_label_horizontalalignment
                * @publicName horizontalAlignment
                * @type Enums.HorizontalAlignment
                * @default 'left'
                */
                horizontalAlignment: 'left',
                /**
                * @name dxchartoptions_valueaxis_constantlines_label_verticalalignment
                * @publicName verticalAlignment
                * @type Enums.VerticalAlignment
                * @default 'top'
                */
                verticalAlignment: 'top'
            }
        }],
        /**
        * @name dxchartoptions_valueaxis_position
        * @publicName position
        * @type Enums.Position
        * @default 'left'
        */
        position: 'left',
        /**
        * @name dxchartoptions_valueaxis_min
        * @publicName min
        * @type number | datetime | string
        * @default undefined
        */
        min: undefined,
        /**
        * @name dxchartoptions_valueaxis_max
        * @publicName max
        * @type number | datetime | string
        * @default undefined
        */
        max: undefined,
        /**
        * @name dxchartoptions_valueaxis_axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 40
        */
        axisDivisionFactor: 40,
        /**
        * @name dxchartoptions_valueaxis_categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxchartoptions_valueaxis_type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxchartoptions_valueaxis_logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxchartoptions_valueaxis_valuetype
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxchartoptions_valueaxis_pane
        * @publicName pane
        * @type string
        * @default undefined
        */
        pane: undefined,
        /**
        * @name dxchartoptions_valueaxis_endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        * @inheritdoc
        */
        endOnTick: undefined
    },
    /**
    * @name dxchartoptions_tooltip
    * @type object
    * @publicName tooltip
    * @inheritdoc
    **/
    tooltip: {
        /**
        * @name dxchartoptions_tooltip_shared
        * @publicName shared
        * @type boolean
        * @default false
        */
        shared: false,
        /**
        * @name dxchartoptions_tooltip_location
        * @publicName location
        * @type Enums.ChartTooltipLocation
        * @default 'center'
        * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_BubbleSeries,dxChartSeriesTypes_StockSeries,dxChartSeriesTypes_CandlestickSeries
        */
        location: 'center'
    },
    /**
    * @name dxchartoptions_onserieshoverchanged
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
    * @name dxchartoptions_onseriesselectionchanged
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
     * @name dxchartoptions_onzoomstart
     * @publicName onZoomStart
     * @extends Action
     * @notUsedInTheme
     * @action
     */
    onZoomStart: function() { },
    /**
     * @name dxchartoptions_onzoomend
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
    * @name dxchartoptions_series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxChartSeriesTypes_CommonSeries
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: [{
        /**
        * @name dxchartoptions_series_name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxchartoptions_series_tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxchartoptions_series_type
        * @publicName type
        * @type Enums.SeriesType
        * @default 'line'
        */
        type: 'line'
    }],
    /**
    * @name dxchartoptions_minbubblesize
    * @publicName minBubbleSize
    * @default 12
    * @type number
    * @propertyOf dxChartSeriesTypes_BubbleSeries
    */
    minBubbleSize: 12,
    /**
    * @name dxchartoptions_maxbubblesize
    * @publicName maxBubbleSize
    * @default 0.2
    * @type number
    * @propertyOf dxChartSeriesTypes_BubbleSeries
    */
    maxBubbleSize: 0.2,

    /**
    * @name dxchartmethods_zoomargument
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
    * @name dxpiechart_options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxpiechartoptions_seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxpiechartoptions_seriestemplate_nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxpiechartoptions_seriestemplate_customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxPieChartOptions_series
        */
        customizeSeries: function() { }
    },
    /**
    * @name dxpiechartoptions_legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxpiechartoptions_legend_hovermode
        * @publicName hoverMode
        * @type Enums.PieChartLegendHoverMode
        * @default 'allArgumentPoints'
        */
        hoverMode: 'allArgumentPoints',
        /**
        * @name dxpiechartoptions_legend_customizetext
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
       * @name dxpiechartoptions_legend_customizehint
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
    * @name dxpiechartoptions_resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.PieChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxpiechartoptions_palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxpiechartoptions_series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxPieChartSeriesTypes_CommonPieChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    series: [{
        /**
        * @name dxpiechartoptions_series_name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxpiechartoptions_series_tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxpiechartoptions_series_type
        * @publicName type
        * @type Enums.PieChartType
        * @default 'pie'
        * @deprecated dxpiechartoptions_type
        */
        type: 'pie'
    }],
    /**
    * @name dxpiechartoptions_type
    * @publicName type
    * @type Enums.PieChartType
    * @default 'pie'
    */
    type: 'pie',
    /**
    * @name dxpiechartoptions_commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxPieChartSeriesTypes_CommonPieChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxpiechartoptions_commonseriessettings_type
        * @publicName type
        * @type Enums.PieChartType
        * @default 'pie'
        * @deprecated dxpiechartoptions_type
        */
        type: 'pie'
    },
    /**
    * @name dxpiechartmethods_getseries
    * @publicName getSeries()
    * @return pieChartSeriesObject
    * @deprecated basechartmethods_getallseries
    */
    getSeries: function() { },
    /**
    * @name dxpiechartoptions_diameter
    * @publicName diameter
    * @type number
    * @default undefined
    */
    diameter: undefined,
    /**
    * @name dxpiechartoptions_mindiameter
    * @publicName minDiameter
    * @type number
    * @default 0.5
    */
    minDiameter: 0.5,
    /**
   * @name dxpiechartoptions_segmentsdirection
   * @publicName segmentsDirection
   * @type Enums.PieChartSegmentsDirection
   * @default 'clockwise'
   */
    segmentsDirection: 'clockwise',
    /**
    * @name dxpiechartoptions_startangle
    * @publicName startAngle
    * @type number
    * @default 0
    */
    startAngle: 0,
    /**
    * @name dxpiechartoptions_innerradius
    * @publicName innerRadius
    * @type number
    * @default 0.5
    * @propertyOf dxChartSeriesTypes_DoughnutSeries
    */
    innerRadius: 0.5,
    /**
    * @name dxpiechartoptions_onlegendclick
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
    * @name dxpiechartoptions_sizegroup
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
    * @name dxpolarchart_options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name dxpolarchartoptions_seriestemplate
    * @publicName seriesTemplate
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    seriesTemplate: {
        /**
        * @name dxpolarchartoptions_seriestemplate_nameField
        * @publicName nameField
        * @type string
        * @default 'series'
        */
        nameField: 'series',
        /**
        * @name dxpolarchartoptions_seriestemplate_customizeSeries
        * @publicName customizeSeries
        * @type function(seriesName)
        * @type_function_param1 seriesName:any
        * @type_function_return dxPolarChartOptions_series
        */
        customizeSeries: function() { }
    },
    /**
     * @name dxpolarchartoptions_usespiderweb
     * @publicName useSpiderWeb
     * @type boolean
     * @default false
     */
    useSpiderWeb: false,
    /**
    * @name dxpolarchartoptions_resolvelabeloverlapping
    * @publicName resolveLabelOverlapping
    * @type Enums.PolarChartResolveLabelOverlapping
    * @default "none"
    */
    resolveLabelOverlapping: "none",
    /**
    * @name dxpolarchartoptions_seriesSelectionMode
    * @publicName seriesSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    seriesSelectionMode: 'single',
    /**
    * @name dxpolarchartoptions_containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxpolarchartoptions_onseriesclick
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
    * @name dxpolarchartoptions_onlegendclick
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
    * @name dxpolarchartoptions_equalbarwidth
    * @publicName equalBarWidth
    * @type boolean
    * @deprecated dxPolarChartSeriesTypes_CommonPolarChartSeries_ignoreEmptyPoints
    */
    equalBarWidth: true,
    /**
    * @name dxpolarchartoptions_barwidth
    * @publicName barWidth
    * @type number
    * @deprecated dxPolarChartSeriesTypes_CommonPolarChartSeries_barPadding
    */
    barWidth: undefined,
    /**
    * @name dxpolarchartoptions_bargrouppadding
    * @publicName barGroupPadding
    * @type number
    * @default 0.3
    * @propertyOf dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
    */
    barGroupPadding: 0.3,
    /**
    * @name dxpolarchartoptions_bargroupwidth
    * @publicName barGroupWidth
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
    */
    barGroupWidth: undefined,
    /**
    * @name dxpolarchartoptions_negativesaszeroes
    * @publicName negativesAsZeroes
    * @type boolean
    * @default false
    * @propertyOf dxChartSeriesTypes_stackedbarpolarseries
    */
    negativesAsZeroes: false,
    /**
    * @name dxpolarchartoptions_commonseriessettings
    * @publicName commonSeriesSettings
    * @type object
    * @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
    * @hideDefaults true
    * @inheritAll
    */
    commonSeriesSettings: {
        /**
        * @name dxpolarchartoptions_commonseriessettings_type
        * @publicName type
        * @type Enums.PolarChartSeriesType
        * @default 'scatter'
        */
        type: 'scatter',
        /**
        * @name dxpolarchartoptions_commonseriessettings_line
        * @publicName line
        * @type object
        */
        line: {},
        /**
        * @name dxpolarchartoptions_commonseriessettings_area
        * @publicName area
        * @type object
        */
        area: {},
        /**
        * @name dxpolarchartoptions_commonseriessettings_bar
        * @publicName bar
        * @type object
        */
        bar: {},
        /**
        * @name dxpolarchartoptions_commonseriessettings_stackedbar
        * @publicName stackedbar
        * @type object
        */
        stackedbar: {},
        /**
        * @name dxpolarchartoptions_commonseriessettings_scatter
        * @publicName scatter
        * @type object
        */
        scatter: {}
    },
    /**
    * @name dxpolarchartoptions_dataPrepareSettings
    * @publicName dataPrepareSettings
    * @type object
    */
    dataPrepareSettings: {
        /**
        * @name dxpolarchartoptions_dataPrepareSettings_checkTypeForAllData
        * @publicName checkTypeForAllData
        * @type boolean
        * @default false
        */
        checkTypeForAllData: false,
        /**
        * @name dxpolarchartoptions_dataPrepareSettings_convertToAxisDataType
        * @publicName convertToAxisDataType
        * @type boolean
        * @default true
        */
        convertToAxisDataType: true,
        /**
        * @name dxpolarchartoptions_dataPrepareSettings_sortingMethod
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
    * @name dxpolarchartoptions_onargumentaxisclick
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
    * @name dxpolarchartoptions_legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxpolarchartoptions_legend_customizetext
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
        * @name dxpolarchartoptions_legend_customizehint
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
        * @name dxpolarchartoptions_legend_hovermode
        * @publicName hoverMode
        * @type Enums.ChartLegendHoverMode
        * @default 'includePoints'
        */
        hoverMode: 'includePoints'
    },
    /**
    * @name dxpolarchartoptions_commonaxissettings
    * @publicName commonAxisSettings
    * @type object
    */
    commonAxisSettings: {
        /**
        * @name dxpolarchartoptions_commonaxissettings_setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxpolarchartoptions_commonaxissettings_discreteaxisdivisionMode
        * @publicName discreteAxisDivisionMode
        * @type Enums.DiscreteAxisDivisionMode
        * @default 'betweenLabels'
        */
        discreteAxisDivisionMode: 'betweenLabels',
        /**
        * @name dxpolarchartoptions_commonaxissettings_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxpolarchartoptions_commonaxissettings_color
        * @publicName color
        * @type string
        * @default '#d3d3d3'
        */
        color: '#d3d3d3',
        /**
        * @name dxpolarchartoptions_commonaxissettings_width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxpolarchartoptions_commonaxissettings_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name dxpolarchartoptions_commonaxissettings_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_label_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions_commonaxissettings_label_overlappingBehavior
            * @publicName overlappingBehavior
            * @type string
            * @default 'hide'
            * @acceptValues 'hide' | 'none'
            * @deprecatedAcceptValues 'ignore' | 'enlargeTickInterval'
            */
            overlappingBehavior: 'hide',
            /**
            * @name dxpolarchartoptions_commonaxissettings_label_indentfromaxis
            * @publicName indentFromAxis
            * @type number
            * @default 5
            */
            indentFromAxis: 5,
            /**
            * @name dxpolarchartoptions_commonaxissettings_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxpolarchartoptions_commonaxissettings_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxpolarchartoptions_commonaxissettings_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxpolarchartoptions_commonaxissettings_label_font_color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxpolarchartoptions_commonaxissettings_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxpolarchartoptions_commonaxissettings_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_grid
        * @publicName grid
        * @type object
        */
        grid: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_grid_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions_commonaxissettings_grid_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions_commonaxissettings_grid_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions_commonaxissettings_grid_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_minorgrid
        * @publicName minorGrid
        * @type object
        */
        minorGrid: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_minorgrid_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions_commonaxissettings_minorgrid_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions_commonaxissettings_minorgrid_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions_commonaxissettings_minorgrid_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_tick_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxpolarchartoptions_commonaxissettings_tick_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions_commonaxissettings_tick_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxpolarchartoptions_commonaxissettings_tick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions_commonaxissettings_tick_length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
       * @name dxpolarchartoptions_commonaxissettings_minortick
       * @publicName minorTick
       * @type object
       */
        minorTick: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_minortick_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxpolarchartoptions_commonaxissettings_minortick_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxpolarchartoptions_commonaxissettings_minortick_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxpolarchartoptions_commonaxissettings_minortick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions_commonaxissettings_minortick_length
            * @publicName length
            * @type number
            * @default 8
            */
            length: 8
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_stripstyle
        * @publicName stripStyle
        * @type object
        */
        stripStyle: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_stripstyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_stripstyle_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_constantlinestyle
        * @publicName constantLineStyle
        * @type object
        */
        constantLineStyle: {
            /**
            * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_visible
                * @publicName visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font
                * @publicName font
                * @type object
                */
                font: {
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font_family
                    * @publicName family
                    * @type string
                    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                    */
                    family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font_weight
                    * @publicName weight
                    * @type number
                    * @default 400
                    */
                    weight: 400,
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font_color
                    * @publicName color
                    * @type string
                    * @default '#767676'
                    */
                    color: '#767676',
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font_size
                    * @publicName size
                    * @type number|string
                    * @default 12
                    */
                    size: 12,
                    /**
                    * @name dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font_opacity
                    * @publicName opacity
                    * @type number
                    * @default undefined
                    */
                    opacity: undefined
                }
            }
        },
        /**
        * @name dxpolarchartoptions_commonaxissettings_inverted
        * @publicName inverted
        * @type boolean
        * @default false
        */
        inverted: false,
        /**
        * @name dxpolarchartoptions_commonaxissettings_allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxpolarchartoptions_commonaxissettings_endontick
        * @publicName endOnTick
        * @type boolean
        * @default undefined
        */
        endOnTick: undefined
    },
    /**
    * @name dxpolarchartoptions_argumentaxis
    * @publicName argumentAxis
    * @type object
    * @inherits dxpolarchartoptions_commonaxissettings
    */
    argumentAxis: {
        /**
         * @name dxpolarchartoptions_argumentaxis_startangle
         * @publicName startAngle
         * @type number
         * @default 0
         */
        startAngle: 0,
        /**
         * @name dxpolarchartoptions_argumentaxis_firstpointonstartangle
         * @publicName firstPointOnStartAngle
         * @type boolean
         * @default false
         */
        firstPointOnStartAngle: false,
        /**
         * @name dxpolarchartoptions_argumentaxis_period
         * @publicName period
         * @type number
         * @default undefined
         */
        period: 0,
        /**
        * @name dxpolarchartoptions_argumentaxis_originvalue
        * @publicName originValue
        * @type number
        * @default undefined
        */
        originValue: undefined,
        /**
        * @name dxpolarchartoptions_argumentaxis_tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxpolarchartoptions_argumentaxis_minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxpolarchartoptions_argumentaxis_minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxpolarchartoptions_argumentaxis_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions_argumentaxis_label_customizetext
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
            * @name dxpolarchartoptions_argumentaxis_label_customizehint
            * @publicName customizeHint
            * @type function(argument)
            * @type_function_param1 argument:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxpolarchartoptions_argumentaxis_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxpolarchartoptions_argumentaxis_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxpolarchartoptions_argumentaxis_strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions_commonaxissettings_stripstyle
        */
        strips: [{
            /**
            * @name dxpolarchartoptions_argumentaxis_strips_startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxpolarchartoptions_argumentaxis_strips_endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxpolarchartoptions_argumentaxis_strips_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxpolarchartoptions_argumentaxis_strips_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_argumentaxis_strips_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions_argumentaxis_constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @inherits dxpolarchartoptions_commonaxissettings_constantlinestyle
        * @notUsedInTheme
        */
        constantLines: [{
            /**
            * @name dxpolarchartoptions_argumentaxis_constantlines_value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxpolarchartoptions_argumentaxis_constantlines_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_argumentaxis_constantlines_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions_argumentaxis_axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 50
        */
        axisDivisionFactor: 50,
        /**
        * @name dxpolarchartoptions_argumentaxis_categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxpolarchartoptions_argumentaxis_type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxpolarchartoptions_argumentaxis_logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxpolarchartoptions_argumentaxis_argumenttype
        * @publicName argumentType
        * @type Enums.ChartDataType
        * @default undefined
        */
        argumentType: undefined,
        /**
        * @name dxpolarchartoptions_argumentaxis_hovermode
        * @publicName hoverMode
        * @type Enums.ArgumentAxisHoverMode
        * @default 'none'
        */
        hoverMode: 'none'
    },
    /**
    * @name dxpolarchartoptions_valueaxis
    * @publicName valueAxis
    * @type object
    * @inherits dxpolarchartoptions_commonaxissettings
    */
    valueAxis: {
        /**
        * @name dxpolarchartoptions_valueaxis_showZero
        * @publicName showZero
        * @type boolean
        * @default undefined
        */
        showZero: undefined,
        /**
        * @name dxpolarchartoptions_valueaxis_tickInterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxpolarchartoptions_valueaxis_minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxpolarchartoptions_valueaxis_minortickcount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxpolarchartoptions_valueaxis_tick
        * @publicName tick
        * @type object
        * @inheritdoc
        */
        tick: {
            /**
            * @name dxpolarchartoptions_valueaxis_tick_visible
            * @publicName visible
            * @type boolean
            * @default false
            * @inheritdoc
            */
            visible: false,
        },
        /**
        * @name dxpolarchartoptions_valueaxis_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxpolarchartoptions_valueaxis_label_customizetext
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
            * @name dxpolarchartoptions_valueaxis_label_customizehint
            * @publicName customizeHint
            * @type function(axisValue)
            * @type_function_param1 axisValue:object
            * @type_function_param1_field1 value:Date|Number|string
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            */
            customizeHint: undefined,
            /**
            * @name dxpolarchartoptions_valueaxis_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name dxpolarchartoptions_valueaxis_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 0
        },
        /**
        * @name dxpolarchartoptions_valueaxis_strips
        * @publicName strips
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions_commonaxissettings_stripstyle
        */
        strips: [{
            /**
            * @name dxpolarchartoptions_valueaxis_strips_startvalue
            * @publicName startValue
            * @type number | datetime | string
            * @default undefined
            */
            startValue: undefined,
            /**
            * @name dxpolarchartoptions_valueaxis_strips_endvalue
            * @publicName endValue
            * @type number | datetime | string
            * @default undefined
            */
            endValue: undefined,
            /**
            * @name dxpolarchartoptions_valueaxis_strips_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxpolarchartoptions_valueaxis_strips_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_valueaxis_strips_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions_valueaxis_constantlines
        * @publicName constantLines
        * @type Array<Object>
        * @notUsedInTheme
        * @inherits dxpolarchartoptions_commonaxissettings_constantlinestyle
        */
        constantLines: [{
            /**
            * @name dxpolarchartoptions_valueaxis_constantlines_value
            * @publicName value
            * @type number | datetime | string
            * @default undefined
            */
            value: undefined,
            /**
            * @name dxpolarchartoptions_valueaxis_constantlines_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxpolarchartoptions_valueaxis_constantlines_label_text
                * @publicName text
                * @type string
                * @default undefined
                */
                text: undefined
            }
        }],
        /**
        * @name dxpolarchartoptions_valueaxis_minvaluemargin
        * @publicName minValueMargin
        * @type number
        * @default undefined
        */
        minValueMargin: 0,
        /**
        * @name dxpolarchartoptions_valueaxis_maxvaluemargin
        * @publicName maxValueMargin
        * @type number
        * @default undefined
        */
        maxValueMargin: 0,
        /**
        * @name dxpolarchartoptions_valueaxis_valuemarginsenabled
        * @publicName valueMarginsEnabled
        * @type boolean
        * @default true
        */
        valueMarginsEnabled: true,
        /**
        * @name dxpolarchartoptions_valueaxis_axisdivisionfactor
        * @publicName axisDivisionFactor
        * @type number
        * @default 30
        */
        axisDivisionFactor: 30,
        /**
        * @name dxpolarchartoptions_valueaxis_categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxpolarchartoptions_valueaxis_type
        * @publicName type
        * @type Enums.AxisScaleType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxpolarchartoptions_valueaxis_logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxpolarchartoptions_valueaxis_valuetype
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
         /**
        * @name dxpolarchartoptions_valueaxis_endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        * @inheritdoc
        */
        endOnTick: false
    },
    /**
    * @name dxpolarchartoptions_tooltip
    * @type object
    * @publicName tooltip
    * @inheritdoc
    **/
    tooltip: {
        /**
        * @name dxpolarchartoptions_tooltip_shared
        * @publicName shared
        * @type boolean
        * @default false
        */
        shared: false
    },
    /**
    * @name dxpolarchartoptions_onserieshoverchanged
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
    * @name dxpolarchartoptions_onseriesselectionchanged
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
    * @name dxpolarchartoptions_series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
    * @hideDefaults true
    * @notUsedInTheme
    * @inheritAll
    */
    series: [{
        /**
        * @name dxpolarchartoptions_series_name
        * @publicName name
        * @type string
        * @default undefined
        */
        name: undefined,
        /**
        * @name dxpolarchartoptions_series_tag
        * @publicName tag
        * @type any
        * @default undefined
        */
        tag: undefined,
        /**
        * @name dxpolarchartoptions_series_type
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
    * @name basechart_options
    * @publicName Options
    * @namespace DevExpress.viz.charts
    * @hidden
    */
    /**
    * @name basechartoptions_ondone
    * @publicName onDone
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onDone: function() { },
    /**
    * @name basechartoptions_ontooltipshown
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
    * @name basechartoptions_ontooltiphidden
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
    * @name basechartoptions_pointSelectionMode
    * @publicName pointSelectionMode
    * @type Enums.ChartElementSelectionMode
    * @default 'single'
    */
    pointSelectionMode: 'single',
    /**
    * @name basechartoptions_animation
    * @publicName animation
    * @type object|boolean
    */
    animation: {
        /**
        * @name basechartoptions_animation_enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name basechartoptions_animation_duration
        * @publicName duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name basechartoptions_animation_easing
        * @publicName easing
        * @type Enums.VizAnimationEasing
        * @default 'easeOutCubic'
        */
        easing: 'easeOutCubic',
        /**
        * @name basechartoptions_animation_maxpointcountsupported
        * @publicName maxPointCountSupported
        * @type number
        * @default 300
        */
        maxPointCountSupported: 300
    },
    /**
    * @name basechartoptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
       /**
       * @name basechartoptions_tooltip_customizetooltip
       * @publicName customizeTooltip
       * @type function(pointInfo)
       * @type_function_param1 pointInfo:object
       * @type_function_return object
       * @default undefined
       * @notUsedInTheme
       */
        customizeTooltip: undefined,
        /**
        * @name basechartoptions_tooltip_argumentformat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name basechartoptions_tooltip_argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name basechartoptions_tooltip_percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        percentPrecision: 0
    },
    /**
    * @name basechartoptions_onpointclick
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
    * @name basechartoptions_onpointselectionchanged
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
    * @name basechartoptions_onpointhoverchanged
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
    * @name basechartoptions_datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name basechartoptions_palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name basechartoptions_paletteextensionmode
    * @publicName paletteExtensionMode
    * @type Enums.VizPaletteExtensionMode
    * @default 'blend'
    */
    paletteExtensionMode: 'blend',
    /**
    * @name basechartoptions_legend
    * @publicName legend
    * @type object
    */
    legend: {

        /**
        * @name basechartoptions_legend_verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name basechartoptions_legend_horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalAlignment: 'right',
        /**
        * @name basechartoptions_legend_orientation
        * @publicName orientation
        * @type Enums.Orientation
        * @default undefined
        */
        orientation: undefined,
        /**
        * @name basechartoptions_legend_itemtextposition
        * @publicName itemTextPosition
        * @type Enums.Position
        * @default undefined
        */
        itemTextPosition: undefined,
        /**
        * @name basechartoptions_legend_itemsalignment
        * @publicName itemsAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        itemsAlignment: undefined,
        /**
        * @name basechartoptions_legend_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name basechartoptions_legend_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name basechartoptions_legend_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name basechartoptions_legend_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name basechartoptions_legend_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name basechartoptions_legend_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name basechartoptions_legend_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name basechartoptions_legend_margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name basechartoptions_legend_margin_top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name basechartoptions_legend_margin_bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name basechartoptions_legend_margin_left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name basechartoptions_legend_margin_right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name basechartoptions_legend_markersize
        * @publicName markerSize
        * @type number
        * @default 20
        */
        markerSize: 20,
        /**
        * @name basechartoptions_legend_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name basechartoptions_legend_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name basechartoptions_legend_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name basechartoptions_legend_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name basechartoptions_legend_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name basechartoptions_legend_border_cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name basechartoptions_legend_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name basechartoptions_legend_border_dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name basechartoptions_legend_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name basechartoptions_legend_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name basechartoptions_legend_columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name basechartoptions_legend_rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name basechartoptions_legend_columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 20
        */
        columnItemSpacing: 20,
        /**
        * @name basechartoptions_legend_rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8
    },
    /**
    * @name basechartoptions_series
    * @publicName series
    * @type Object|Array<Object>
    * @default undefined
    * @notUsedInTheme
    * @hideDefaults true
    */
    series: [{

    }],
    /**
    * @name basechartoptions_customizepoint
    * @publicName customizePoint
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes_CommonSeries_point
    */
    customizePoint: undefined,
    /**
    * @name basechartoptions_customizelabel
    * @publicName customizeLabel
    * @type function(pointInfo)
    * @type_function_param1 pointInfo:object
    * @type_function_return dxChartSeriesTypes_CommonSeries_label
    */
    customizeLabel: undefined,
    /**
    * @name basechartmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name basechartmethods_hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name basechartmethods_render
    * @publicName render(renderOptions)
    * @param1 renderOptions:object
    */
    render: function(renderOptions) { },
    /**
    * @name basechartmethods_getallseries
    * @publicName getAllSeries()
    * @return Array<baseSeriesObject>
    */
    getAllSeries: function() { },
    /**
    * @name basechartmethods_getseriesbyname
    * @publicName getSeriesByName(seriesName)
    * @param1 seriesName:any
    * @return chartSeriesObject
    */
    getSeriesByName: function() { },
    /**
    * @name basechartmethods_getseriesbypos
    * @publicName getSeriesByPos(seriesIndex)
    * @param1 seriesIndex:number
    * @return chartSeriesObject
    */
    getSeriesByPos: function() { },
    /**
    * @name basechartmethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
    /**
    * @name basechartoptions_adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    /**
    * @name dxpiechartoptions_adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    /**
    * @name dxpolarchartoptions_adaptiveLayout
    * @publicName adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name basechartoptions_adaptiveLayout_width
        * @publicName width
        * @type number
        * @default 80
        */
        /**
        * @name dxpolarchartoptions_adaptiveLayout_width
        * @publicName width
        * @type number
        * @default 170
        * @inheritdoc
        */
        width: 80,
        /**
        * @name basechartoptions_adaptiveLayout_height
        * @publicName height
        * @type number
        * @default 80
        */
        /**
        * @name dxpolarchartoptions_adaptiveLayout_height
        * @publicName height
        * @type number
        * @default 170
        * @inheritdoc
        */
        height: 80,
        /**
        * @name basechartoptions_adaptiveLayout_keepLabels
        * @publicName keepLabels
        * @type boolean
        * @default true
        */
        /**
        * @name dxpiechartoptions_adaptiveLayout_keepLabels
        * @publicName keepLabels
        * @type boolean
        * @default false
        * @inheritdoc
        */
        keepLabels: true
    }
};
