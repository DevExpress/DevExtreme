/**
* @name dxrangeselector
* @publicName dxRangeSelector
* @inherits BaseWidget
* @module viz/range_selector
* @export default
*/
var dxRangeSelector = {
    /**
    * @name dxrangeselector_options
    * @publicName Options
    * @namespace DevExpress.viz.rangeSelector
    * @hidden
    */
    /**
    * @name dxrangeselectoroptions_scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxrangeselectoroptions_scale_valueType
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxrangeselectoroptions_scale_type
        * @publicName type
        * @type Enums.RangeSelectorAxisScaleType
        * @default undefined
        */
        type: 'continuous',
        /**
        * @name dxrangeselectoroptions_scale_logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxrangeselectoroptions_scale_minorTickCount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxrangeselectoroptions_scale_showBoundaryTicks
        * @publicName showCustomBoundaryTicks
        * @type boolean
        * @default true
        */
        showCustomBoundaryTicks: true,
        /**
        * @name dxrangeselectoroptions_scale_startvalue
        * @publicName startValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        startValue: undefined,
        /**
        * @name dxrangeselectoroptions_scale_endvalue
        * @publicName endValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        endValue: undefined,
        /**
        * @name dxrangeselectoroptions_scale_showminorticks
        * @publicName showMinorTicks
        * @type boolean
        * @default true
        * @deprecated dxrangeselectoroptions_scale_minortick_visible
        */
        showMinorTicks: true,
        /**
        * @name dxrangeselectoroptions_scale_minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxrangeselectoroptions_scale_breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxrangeselectoroptions_scale_workdaysonly
        * @publicName workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxrangeselectoroptions_scale_workweek
        * @publicName workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxrangeselectoroptions_scale_holidays
        * @publicName holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxrangeselectoroptions_scale_singleworkdays
        * @publicName singleWorkdays
        * @type Array<Date, string> | Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxrangeselectoroptions_scale_breakStyle
        * @publicName breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxrangeselectoroptions_scale_breakStyle_width
            * @publicName width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxrangeselectoroptions_scale_breakStyle_color
            * @publicName color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxrangeselectoroptions_scale_breakStyle_line
            * @publicName line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxrangeselectoroptions_scale_majortickinterval
        * @publicName majorTickInterval
        * @type number|object|Enums.VizTimeInterval
        * @default undefined
        * @deprecated dxrangeselectoroptions_scale_tickinterval
        */
        majorTickInterval: {
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_years
            * @publicName years
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            years: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_months
            * @publicName months
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            months: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_days
            * @publicName days
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            days: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_hours
            * @publicName hours
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            hours: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_minutes
            * @publicName minutes
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            minutes: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_seconds
            * @publicName seconds
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            seconds: undefined,
            /**
            * @name dxrangeselectoroptions_scale_majortickinterval_milliseconds
            * @publicName milliseconds
            * @type number
            * @deprecated dxrangeselectoroptions_scale_tickinterval
            */
            milliseconds: undefined
        },
        /**
        * @name dxrangeselectoroptions_scale_tickinterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxrangeselectoroptions_scale_useticksautoarrangement
        * @publicName useTicksAutoArrangement
        * @type boolean
        * @default true
        * @deprecated dxrangeselectoroptions_scale_label_overlappingbehavior
        */
        useTicksAutoArrangement: true,
        /**
        * @name dxrangeselectoroptions_scale_setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxrangeselectoroptions_scale_placeholderheight
        * @publicName placeholderHeight
        * @type number
        * @default undefined
        */
        placeholderHeight: undefined,
        /**
        * @name dxrangeselectoroptions_scale_minrange
        * @publicName minRange
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minRange: {},
        /**
        * @name dxrangeselectoroptions_scale_maxrange
        * @publicName maxRange
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        maxRange: {},
        /**
        * @name dxrangeselectoroptions_scale_label
        * @publicName label
        * @type object
        */
        label: {
            /**
           * @name dxrangeselectoroptions_scale_label_visible
           * @publicName visible
           * @type boolean
           * @default true
           */
            visible: true,
            /**
            * @name dxrangeselectoroptions_scale_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: undefined,
            /**
            * @name dxrangeselectoroptions_scale_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: undefined,
            /**
            * @name dxrangeselectoroptions_scale_label_customizetext
            * @publicName customizeText
            * @type function(scaleValue)
            * @type_function_param1 scaleValue:object
            * @type_function_param1_field1 value:Date|Number
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxrangeselectoroptions_scale_label_topindent
            * @publicName topIndent
            * @type number
            * @default 7
            */
            topIndent: 7,
            /**
            * @name dxrangeselectoroptions_scale_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxrangeselectoroptions_scale_label_font_color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxrangeselectoroptions_scale_label_font_size
                * @publicName size
                * @type number|string
                * @default 11
                */
                size: 11,
                /**
                * @name dxrangeselectoroptions_scale_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxrangeselectoroptions_scale_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxrangeselectoroptions_scale_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
            * @name dxrangeselectoroptions_scale_label_overlappingbehavior
            * @publicName overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior
            * @default "hide"
            */
            overlappingBehavior: "hide"
        },
        /**
        * @name dxrangeselectoroptions_scale_tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxrangeselectoroptions_scale_tick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxrangeselectoroptions_scale_tick_color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxrangeselectoroptions_scale_tick_opacity
            * @publicName opacity
            * @type number
            * @default 0.1
            */
            opacity: 0.1
        },
        /**
        * @name dxrangeselectoroptions_scale_minortick
        * @publicName minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name dxrangeselectoroptions_scale_minortick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxrangeselectoroptions_scale_minortick_color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxrangeselectoroptions_scale_minortick_opacity
            * @publicName opacity
            * @type number
            * @default 0.06
            */
            opacity: 0.06,
            /**
            * @name dxrangeselectoroptions_scale_minortick_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name dxrangeselectoroptions_scale_marker
        * @publicName marker
        * @type object
        */
        marker: {
            /**
            * @name dxrangeselectoroptions_scale_marker_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxrangeselectoroptions_scale_marker_separatorheight
            * @publicName separatorHeight
            * @type number
            * @default 33
            */
            separatorHeight: 33,
            /**
            * @name dxrangeselectoroptions_scale_marker_topindent
            * @publicName topIndent
            * @type number
            * @default 10
            */
            topIndent: 10,
            /**
            * @name dxrangeselectoroptions_scale_marker_textleftindent
            * @publicName textLeftIndent
            * @type number
            * @default 7
            */
            textLeftIndent: 7,
            /**
            * @name dxrangeselectoroptions_scale_marker_texttopindent
            * @publicName textTopIndent
            * @type number
            * @default 11
            */
            textTopIndent: 11,
            /**
            * @name dxrangeselectoroptions_scale_marker_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxrangeselectoroptions_scale_marker_label_format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxrangeselectoroptions_scale_marker_label_customizeText
                * @publicName customizeText
                * @type function(markerValue)
                * @type_function_param1 markerValue:object
                * @type_function_param1_field1 value:Date|Number
                * @type_function_param1_field2 valueText:string
                * @type_function_return string
                * @notUsedInTheme
                */
                customizeText: undefined
            }
        },
        /**
        * @name dxrangeselectoroptions_scale_categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxrangeselectoroptions_scale_allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxrangeselectoroptions_scale_endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        */
        endOnTick: false,
        /**
        * @name dxrangeselectoroptions_scale_aggregationGroupWidth
        * @publicName aggregationGroupWidth
        * @type number
        * @default undefined
        * @default 10 @for dxChartSeriesTypes_BarSeries
        * @default 10 @for dxChartSeriesTypes_StackedBarSeries
        * @default 10 @for dxChartSeriesTypes_FullStackedBarSeries
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxrangeselectoroptions_scale_aggregationInterval
        * @publicName aggregationInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
    },
    /**
    * @name dxrangeselectoroptions_slidermarker
    * @publicName sliderMarker
    * @type object
    */
    sliderMarker: {
        /**
        * @name dxrangeselectoroptions_slidermarker_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxrangeselectoroptions_slidermarker_format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxrangeselectoroptions_slidermarker_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name dxrangeselectoroptions_slidermarker_customizetext
        * @publicName customizeText
        * @type function(scaleValue)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Date|Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxrangeselectoroptions_slidermarker_padding
        * @publicName padding
        * @type number
        * @default 6
        * @deprecated
        */
        padding: 6,
        /**
        * @name dxrangeselectoroptions_slidermarker_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 2
        */
        paddingTopBottom: 2,
        /**
        * @name dxrangeselectoroptions_slidermarker_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 4
        */
        paddingLeftRight: 4,
        /**
        * @name dxrangeselectoroptions_slidermarker_color
        * @publicName color
        * @type string
        * @default '#9B9B9B'
        */
        color: '#9B9B9B',
        /**
        * @name dxrangeselectoroptions_slidermarker_invalidrangecolor
        * @publicName invalidRangeColor
        * @type string
        * @default 'red'
        */
        invalidRangeColor: 'red',
        /**
        * @name dxrangeselectoroptions_slidermarker_placeholdersize
        * @publicName placeholderSize
        * @type number|object
        * @default undefined
        * @deprecated
        */
        placeholderSize: {
            /**
            * @name dxrangeselectoroptions_slidermarker_placeholdersize_width
            * @publicName width
            * @type number|object
            * @default undefined
            */
            width: {
                /**
                * @name dxrangeselectoroptions_slidermarker_placeholdersize_width_left
                * @publicName left
                * @type number
                * @default undefined
                */
                left: undefined,
                /**
                * @name dxrangeselectoroptions_slidermarker_placeholdersize_width_right
                * @publicName right
                * @type number
                * @default undefined
                */
                right: undefined
            },
            /**
            * @name dxrangeselectoroptions_slidermarker_placeholdersize_height
            * @publicName height
            * @type number
            * @default undefined
            */
            height: undefined
        },
        /**
        * @name dxrangeselectoroptions_slidermarker_placeholderHeight
        * @publicName placeholderHeight
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        placeholderHeight: undefined,
        /**
        * @name dxrangeselectoroptions_slidermarker_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxrangeselectoroptions_slidermarker_font_color
            * @publicName color
            * @type string
            * @default 'white'
            */
            color: 'white',
            /**
            * @name dxrangeselectoroptions_slidermarker_font_size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxrangeselectoroptions_slidermarker_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxrangeselectoroptions_slidermarker_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxrangeselectoroptions_slidermarker_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxrangeselectoroptions_sliderhandle
    * @publicName sliderHandle
    * @type object
    */
    sliderHandle: {
        /**
        * @name dxrangeselectoroptions_sliderhandle_color
        * @publicName color
        * @type string
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxrangeselectoroptions_sliderhandle_width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxrangeselectoroptions_sliderhandle_opacity
        * @publicName opacity
        * @type number
        * @default 0.2
        */
        opacity: 0.2
    },
    /**
    * @name dxrangeselectoroptions_shutter
    * @publicName shutter
    * @type object
    */
    shutter: {
        /**
        * @name dxrangeselectoroptions_shutter_color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxrangeselectoroptions_shutter_opacity
        * @publicName opacity
        * @type number
        * @default 0.75
        */
        opacity: 0.75
    },
    /**
    * @name dxrangeselectoroptions_selectedrange
    * @publicName selectedRange
    * @type object
    * @deprecated dxrangeselectoroptions_value
    */
    selectedRange: {
        /**
        * @name dxrangeselectoroptions_selectedrange_startvalue
        * @publicName startValue
        * @type number|date|string
        * @notUsedInTheme
        */
        startValue: undefined,
        /**
        * @name dxrangeselectoroptions_selectedrange_endvalue
        * @publicName endValue
        * @type number|date|string
        * @notUsedInTheme
        */
        endValue: undefined
    },
    /**
    *@name dxrangeselectoroptions_value
    * @publicName value
    * @type Array<number,string,Date>
    * @fires dxrangeselectoroptions_onvaluechanged
    * @notUsedInTheme
    */
    value: [undefined, undefined],
    /**
    * @name dxrangeselectoroptions_selectedrangecolor
    * @publicName selectedRangeColor
    * @type string
    * @default "#606060"
    */
    selectedRangeColor: "#606060",
    /**
    * @name dxrangeselectoroptions_indent
    * @publicName indent
    * @type object
    */
    indent: {
        /**
        * @name dxrangeselectoroptions_indent_left
        * @publicName left
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        left: undefined,
        /**
        * @name dxrangeselectoroptions_indent_right
        * @publicName right
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        right: undefined
    },
    /**
    * @name dxrangeselectoroptions_behavior
    * @publicName behavior
    * @type object
    */
    behavior: {
        /**
        * @name dxrangeselectoroptions_behavior_animationenabled
        * @publicName animationEnabled
        * @type boolean
        * @default true
        */
        animationEnabled: true,
        /**
        * @name dxrangeselectoroptions_behavior_snaptoticks
        * @publicName snapToTicks
        * @type boolean
        * @default true
        */
        snapToTicks: true,
        /**
        * @name dxrangeselectoroptions_behavior_moveselectedrangebyclick
        * @publicName moveSelectedRangeByClick
        * @type boolean
        * @default true
        */
        moveSelectedRangeByClick: true,
        /**
        * @name dxrangeselectoroptions_behavior_manualrangeselectionenabled
        * @publicName manualRangeSelectionEnabled
        * @type boolean
        * @default true
        */
        manualRangeSelectionEnabled: true,
        /**
        * @name dxrangeselectoroptions_behavior_allowslidersswap
        * @publicName allowSlidersSwap
        * @type boolean
        * @default true
        */
        allowSlidersSwap: true,
        /**
        * @name dxrangeselectoroptions_behavior_callselectedrangechanged
        * @publicName callSelectedRangeChanged
        * @type Enums.ValueChangedCallMode
        * @default 'onMovingComplete'
        * @deprecated dxrangeselectoroptions_behavior_callvaluechanged
        */
        callSelectedRangeChanged: "onMovingComplete",
        /**
        * @name dxrangeselectoroptions_behavior_callvaluechanged
        * @publicName callValueChanged
        * @type Enums.ValueChangedCallMode
        * @default 'onMovingComplete'
        */
        callValueChanged: "onMovingComplete"
    },
    /**
    * @name dxrangeselectoroptions_background
    * @publicName background
    * @type object
    */
    background: {
        /**
        * @name dxrangeselectoroptions_background_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxrangeselectoroptions_background_color
        * @publicName color
        * @type string
        * @default '#C0BAE1'
        */
        color: "#C0BAE1",
        /**
        * @name dxrangeselectoroptions_background_image
        * @publicName image
        * @type object
        */
        image: {
            /**
            * @name dxrangeselectoroptions_background_image_url
            * @publicName url
            * @type string
            * @default undefined
            */
            url: undefined,
            /**
            * @name dxrangeselectoroptions_background_image_location
            * @publicName location
            * @type Enums.BackgroundImageLocation
            * @default 'full'
            */
            location: 'full'
        }
    },
    /**
    * @name dxrangeselectoroptions_tooltip
    * @publicName tooltip
    * @hidden
    * @inheritdoc
    */
    tooltip: undefined,
    /**
    * @name dxrangeselectoroptions_chart
    * @publicName chart
    * @type object
    */
    chart: {
        /**
        * @name dxrangeselectoroptions_chart_commonseriessettings
        * @publicName commonSeriesSettings
        * @type dxChartOptions_commonSeriesSettings
        */
        commonSeriesSettings: undefined,
        /**
        * @name dxrangeselectoroptions_chart_bottomindent
        * @publicName bottomIndent
        * @type number
        * @default 0
        */
        bottomIndent: 0,
        /**
        * @name dxrangeselectoroptions_chart_topindent
        * @publicName topIndent
        * @type number
        * @default 0.1
        */
        topIndent: 0.1,
        /**
        * @name dxrangeselectoroptions_chart_dataPrepareSettings
        * @publicName dataPrepareSettings
        * @type object
        */
        dataPrepareSettings: {
            /**
            * @name dxrangeselectoroptions_chart_dataPrepareSettings_checkTypeForAllData
            * @publicName checkTypeForAllData
            * @type boolean
            * @default false
            */
            checkTypeForAllData: false,
            /**
            * @name dxrangeselectoroptions_chart_dataPrepareSettings_convertToAxisDataType
            * @publicName convertToAxisDataType
            * @type boolean
            * @default true
            */
            convertToAxisDataType: true,
            /**
            * @name dxrangeselectoroptions_chart_dataPrepareSettings_sortingMethod
            * @publicName sortingMethod
            * @type Boolean|function(a,b)
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
        * @name dxrangeselectoroptions_chart_useAggregation
        * @publicName useAggregation
        * @type boolean
        * @deprecated dxChartSeriesTypes_CommonSeries_aggregation_enabled
        */
        useAggregation: false,
        /**
        * @name dxrangeselectoroptions_chart_valueaxis
        * @publicName valueAxis
        * @type object
        */
        valueAxis: {
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_min
            * @publicName min
            * @type number
            * @default undefined
            */
            min: undefined,
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_max
            * @publicName max
            * @type number
            * @default undefined
            */
            max: undefined,
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_inverted
            * @publicName inverted
            * @type boolean
            * @default false
            */
            inverted: false,
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_valuetype
            * @publicName valueType
            * @type Enums.ChartDataType
            * @default undefined
            */
            valueType: undefined,
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_type
            * @publicName type
            * @type Enums.RangeSelectorChartAxisScaleType
            * @default undefined
            */
            type: 'continuous',
            /**
            * @name dxrangeselectoroptions_chart_valueaxis_logarithmbase
            * @publicName logarithmBase
            * @type number
            * @default 10
            */
            logarithmBase: 10,
        },
        /**
        * @name dxrangeselectoroptions_chart_series
        * @publicName series
        * @type dxChartOptions_series|Array<dxChartOptions_series>
        * @default undefined
        * @notUsedInTheme
        */
        series: undefined,
        /**
        * @name dxrangeselectoroptions_chart_seriestemplate
        * @publicName seriesTemplate
        * @type object
        * @default undefined
        */
        seriesTemplate: {
            /**
            * @name dxrangeselectoroptions_chart_seriestemplate_nameField
            * @publicName nameField
            * @type string
            * @default 'series'
            */
            nameField: 'series',
            /**
            * @name dxrangeselectoroptions_chart_seriestemplate_customizeSeries
            * @publicName customizeSeries
            * @type function(seriesName)
            * @type_function_param1 seriesName:any
            * @type_function_return dxChartOptions_series
            */
            customizeSeries: function() { }
        },
        /**
        * @name dxrangeselectoroptions_chart_equalbarwidth
        * @publicName equalBarWidth
        * @type boolean
        * @deprecated dxChartSeriesTypes_CommonSeries_ignoreEmptyPoints
        */
        equalBarWidth: true,
        /**
        * @name dxrangeselectoroptions_chart_barwidth
        * @publicName barWidth
        * @type number
        * @deprecated dxChartSeriesTypes_CommonSeries_barPadding
        */
        barWidth: undefined,
        /**
        * @name dxrangeselectoroptions_chart_bargrouppadding
        * @publicName barGroupPadding
        * @type number
        * @default 0.3
        * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeriesSeries
        */
        barGroupPadding: 0.3,
        /**
        * @name dxrangeselectoroptions_chart_bargroupwidth
        * @publicName barGroupWidth
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes_BarSeries,dxChartSeriesTypes_StackedBarSeries,dxChartSeriesTypes_FullStackedBarSeries,dxChartSeriesTypes_RangeBarSeriesSeries
        */
        barGroupWidth: undefined,
        /**
        * @name dxrangeselectoroptions_chart_negativesaszeroes
        * @publicName negativesAsZeroes
        * @type boolean
        * @default false
        */
        negativesAsZeroes: false,
        /**
        * @name dxrangeselectoroptions_chart_palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: [],
        /**
        * @name dxrangeselectoroptions_chart_paletteextensionmode
        * @publicName paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend'
    },
    /**
    * @name dxrangeselectoroptions_datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxrangeselectoroptions_datasourcefield
    * @publicName dataSourceField
    * @type string
    * @default 'arg'
    */
    dataSourceField: undefined,
    /**
    * @name dxrangeselectoroptions_onselectedrangechanged
    * @publicName onSelectedRangeChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 startValue:Date|Number
    * @type_function_param1_field5 endValue:Date|Number
    * @default null
    * @deprecated dxrangeselectoroptions_onvaluechanged
    * @notUsedInTheme
    * @action
    */
    onSelectedRangeChanged: null,
    /**
    * @name dxrangeselectoroptions_onvaluechanged
    * @publicName onValueChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 value:Array<number,string,Date>
    * @type_function_param1_field5 previousValue:Array<number,string,Date>
    * @default null
    * @notUsedInTheme
    * @action
    */
    onValueChanged: null,
    /**
    * @name dxrangeselectoroptions_containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxrangeselectormethods_getSelectedRange
    * @publicName getSelectedRange()
    * @return object
    * @deprecated dxrangeselectormethods_getValue
    */
    getSelectedRange: function() { },
    /**
    * @name dxrangeselectormethods_setSelectedRange
    * @publicName setSelectedRange(selectedRange)
    * @param1 selectedRange:object
    * @param1_field1 startValue:Date|Number|String
    * @param1_field2 endValue:Date|Number|String
    * @deprecated dxrangeselectormethods_setValue
    */
    setSelectedRange: function() { },
    /**
    * @name dxrangeselectormethods_setValue
    * @publicName setValue(value)
    * @param1 value:Array<number,string,Date>
    */
    setValue: function() { },
    /**
    * @name dxrangeselectormethods_getValue
    * @publicName getValue()
    * @return Array<number,string,Date>
    */
    getValue: function() { },
    /**
    * @name dxrangeselectormethods_render
    * @publicName render(skipChartAnimation)
    * @param1 skipChartAnimation:boolean
    */
    render: function(skipChartAnimation) { },
    /**
    * @name dxrangeselectormethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
