/**
* @name dxrangeselector
* @publicName dxRangeSelector
* @inherits BaseWidget
* @module viz/range_selector
* @export default
*/
var dxRangeSelector = {
    /**
    * @name dxrangeselector.options
    * @publicName Options
    * @namespace DevExpress.viz.rangeSelector
    * @hidden
    */
    /**
    * @name dxrangeselectoroptions.scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxrangeselectoroptions.scale.valueType
        * @publicName valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxrangeselectoroptions.scale.type
        * @publicName type
        * @type Enums.RangeSelectorAxisScaleType
        * @default undefined
        */
        type: 'continuous',
        /**
        * @name dxrangeselectoroptions.scale.logarithmbase
        * @publicName logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxrangeselectoroptions.scale.minorTickCount
        * @publicName minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxrangeselectoroptions.scale.showBoundaryTicks
        * @publicName showCustomBoundaryTicks
        * @type boolean
        * @default true
        */
        showCustomBoundaryTicks: true,
        /**
        * @name dxrangeselectoroptions.scale.startvalue
        * @publicName startValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        startValue: undefined,
        /**
        * @name dxrangeselectoroptions.scale.endvalue
        * @publicName endValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        endValue: undefined,
        /**
        * @name dxrangeselectoroptions.scale.showminorticks
        * @publicName showMinorTicks
        * @type boolean
        * @default true
        * @deprecated dxrangeselectoroptions.scale.minortick.visible
        */
        showMinorTicks: true,
        /**
        * @name dxrangeselectoroptions.scale.minortickinterval
        * @publicName minorTickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxrangeselectoroptions.scale.breaks
        * @publicName breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxrangeselectoroptions.scale.workdaysonly
        * @publicName workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxrangeselectoroptions.scale.workweek
        * @publicName workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxrangeselectoroptions.scale.holidays
        * @publicName holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxrangeselectoroptions.scale.singleworkdays
        * @publicName singleWorkdays
        * @type Array<Date, string> | Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxrangeselectoroptions.scale.breakStyle
        * @publicName breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxrangeselectoroptions.scale.breakStyle.width
            * @publicName width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxrangeselectoroptions.scale.breakStyle.color
            * @publicName color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxrangeselectoroptions.scale.breakStyle.line
            * @publicName line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxrangeselectoroptions.scale.majortickinterval
        * @publicName majorTickInterval
        * @type number|object|Enums.VizTimeInterval
        * @default undefined
        * @deprecated dxrangeselectoroptions.scale.tickinterval
        */
        majorTickInterval: {
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.years
            * @publicName years
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            years: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.months
            * @publicName months
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            months: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.days
            * @publicName days
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            days: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.hours
            * @publicName hours
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            hours: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.minutes
            * @publicName minutes
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            minutes: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.seconds
            * @publicName seconds
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            seconds: undefined,
            /**
            * @name dxrangeselectoroptions.scale.majortickinterval.milliseconds
            * @publicName milliseconds
            * @type number
            * @deprecated dxrangeselectoroptions.scale.tickinterval
            */
            milliseconds: undefined
        },
        /**
        * @name dxrangeselectoroptions.scale.tickinterval
        * @publicName tickInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxrangeselectoroptions.scale.useticksautoarrangement
        * @publicName useTicksAutoArrangement
        * @type boolean
        * @default true
        * @deprecated dxrangeselectoroptions.scale.label.overlappingbehavior
        */
        useTicksAutoArrangement: true,
        /**
        * @name dxrangeselectoroptions.scale.setticksatunitbeginning
        * @publicName setTicksAtUnitBeginning
        * @type boolean
        * @default true
        * @deprecated
        */
        setTicksAtUnitBeginning: true,
        /**
        * @name dxrangeselectoroptions.scale.placeholderheight
        * @publicName placeholderHeight
        * @type number
        * @default undefined
        */
        placeholderHeight: undefined,
        /**
        * @name dxrangeselectoroptions.scale.minrange
        * @publicName minRange
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        minRange: {},
        /**
        * @name dxrangeselectoroptions.scale.maxrange
        * @publicName maxRange
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        maxRange: {},
        /**
        * @name dxrangeselectoroptions.scale.label
        * @publicName label
        * @type object
        */
        label: {
            /**
           * @name dxrangeselectoroptions.scale.label.visible
           * @publicName visible
           * @type boolean
           * @default true
           */
            visible: true,
            /**
            * @name dxrangeselectoroptions.scale.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: undefined,
            /**
            * @name dxrangeselectoroptions.scale.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: undefined,
            /**
            * @name dxrangeselectoroptions.scale.label.customizetext
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
            * @name dxrangeselectoroptions.scale.label.topindent
            * @publicName topIndent
            * @type number
            * @default 7
            */
            topIndent: 7,
            /**
            * @name dxrangeselectoroptions.scale.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxrangeselectoroptions.scale.label.font.color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxrangeselectoroptions.scale.label.font.size
                * @publicName size
                * @type number|string
                * @default 11
                */
                size: 11,
                /**
                * @name dxrangeselectoroptions.scale.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxrangeselectoroptions.scale.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxrangeselectoroptions.scale.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
            * @name dxrangeselectoroptions.scale.label.overlappingbehavior
            * @publicName overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior
            * @default "hide"
            */
            overlappingBehavior: "hide"
        },
        /**
        * @name dxrangeselectoroptions.scale.tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name dxrangeselectoroptions.scale.tick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxrangeselectoroptions.scale.tick.color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxrangeselectoroptions.scale.tick.opacity
            * @publicName opacity
            * @type number
            * @default 0.1
            */
            opacity: 0.1
        },
        /**
        * @name dxrangeselectoroptions.scale.minortick
        * @publicName minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name dxrangeselectoroptions.scale.minortick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxrangeselectoroptions.scale.minortick.color
            * @publicName color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxrangeselectoroptions.scale.minortick.opacity
            * @publicName opacity
            * @type number
            * @default 0.06
            */
            opacity: 0.06,
            /**
            * @name dxrangeselectoroptions.scale.minortick.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name dxrangeselectoroptions.scale.marker
        * @publicName marker
        * @type object
        */
        marker: {
            /**
            * @name dxrangeselectoroptions.scale.marker.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxrangeselectoroptions.scale.marker.separatorheight
            * @publicName separatorHeight
            * @type number
            * @default 33
            */
            separatorHeight: 33,
            /**
            * @name dxrangeselectoroptions.scale.marker.topindent
            * @publicName topIndent
            * @type number
            * @default 10
            */
            topIndent: 10,
            /**
            * @name dxrangeselectoroptions.scale.marker.textleftindent
            * @publicName textLeftIndent
            * @type number
            * @default 7
            */
            textLeftIndent: 7,
            /**
            * @name dxrangeselectoroptions.scale.marker.texttopindent
            * @publicName textTopIndent
            * @type number
            * @default 11
            */
            textTopIndent: 11,
            /**
            * @name dxrangeselectoroptions.scale.marker.label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxrangeselectoroptions.scale.marker.label.format
                * @publicName format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxrangeselectoroptions.scale.marker.label.customizeText
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
        * @name dxrangeselectoroptions.scale.categories
        * @publicName categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxrangeselectoroptions.scale.allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxrangeselectoroptions.scale.endontick
        * @publicName endOnTick
        * @type boolean
        * @default false
        */
        endOnTick: false,
        /**
        * @name dxrangeselectoroptions.scale.aggregationGroupWidth
        * @publicName aggregationGroupWidth
        * @type number
        * @default undefined
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxrangeselectoroptions.scale.aggregationInterval
        * @publicName aggregationInterval
        * @extends VizTimeIntervalEnum
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
    },
    /**
    * @name dxrangeselectoroptions.slidermarker
    * @publicName sliderMarker
    * @type object
    */
    sliderMarker: {
        /**
        * @name dxrangeselectoroptions.slidermarker.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxrangeselectoroptions.slidermarker.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxrangeselectoroptions.slidermarker.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name dxrangeselectoroptions.slidermarker.customizetext
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
        * @name dxrangeselectoroptions.slidermarker.padding
        * @publicName padding
        * @type number
        * @default 6
        * @deprecated
        */
        padding: 6,
        /**
        * @name dxrangeselectoroptions.slidermarker.paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 2
        */
        paddingTopBottom: 2,
        /**
        * @name dxrangeselectoroptions.slidermarker.paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 4
        */
        paddingLeftRight: 4,
        /**
        * @name dxrangeselectoroptions.slidermarker.color
        * @publicName color
        * @type string
        * @default '#9B9B9B'
        */
        color: '#9B9B9B',
        /**
        * @name dxrangeselectoroptions.slidermarker.invalidrangecolor
        * @publicName invalidRangeColor
        * @type string
        * @default 'red'
        */
        invalidRangeColor: 'red',
        /**
        * @name dxrangeselectoroptions.slidermarker.placeholdersize
        * @publicName placeholderSize
        * @type number|object
        * @default undefined
        * @deprecated
        */
        placeholderSize: {
            /**
            * @name dxrangeselectoroptions.slidermarker.placeholdersize.width
            * @publicName width
            * @type number|object
            * @default undefined
            */
            width: {
                /**
                * @name dxrangeselectoroptions.slidermarker.placeholdersize.width.left
                * @publicName left
                * @type number
                * @default undefined
                */
                left: undefined,
                /**
                * @name dxrangeselectoroptions.slidermarker.placeholdersize.width.right
                * @publicName right
                * @type number
                * @default undefined
                */
                right: undefined
            },
            /**
            * @name dxrangeselectoroptions.slidermarker.placeholdersize.height
            * @publicName height
            * @type number
            * @default undefined
            */
            height: undefined
        },
        /**
        * @name dxrangeselectoroptions.slidermarker.placeholderHeight
        * @publicName placeholderHeight
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        placeholderHeight: undefined,
        /**
        * @name dxrangeselectoroptions.slidermarker.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxrangeselectoroptions.slidermarker.font.color
            * @publicName color
            * @type string
            * @default 'white'
            */
            color: 'white',
            /**
            * @name dxrangeselectoroptions.slidermarker.font.size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxrangeselectoroptions.slidermarker.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxrangeselectoroptions.slidermarker.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxrangeselectoroptions.slidermarker.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxrangeselectoroptions.sliderhandle
    * @publicName sliderHandle
    * @type object
    */
    sliderHandle: {
        /**
        * @name dxrangeselectoroptions.sliderhandle.color
        * @publicName color
        * @type string
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxrangeselectoroptions.sliderhandle.width
        * @publicName width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxrangeselectoroptions.sliderhandle.opacity
        * @publicName opacity
        * @type number
        * @default 0.2
        */
        opacity: 0.2
    },
    /**
    * @name dxrangeselectoroptions.shutter
    * @publicName shutter
    * @type object
    */
    shutter: {
        /**
        * @name dxrangeselectoroptions.shutter.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxrangeselectoroptions.shutter.opacity
        * @publicName opacity
        * @type number
        * @default 0.75
        */
        opacity: 0.75
    },
    /**
    * @name dxrangeselectoroptions.selectedrange
    * @publicName selectedRange
    * @type object
    * @deprecated dxrangeselectoroptions.value
    */
    selectedRange: {
        /**
        * @name dxrangeselectoroptions.selectedrange.startvalue
        * @publicName startValue
        * @type number|date|string
        * @notUsedInTheme
        */
        startValue: undefined,
        /**
        * @name dxrangeselectoroptions.selectedrange.endvalue
        * @publicName endValue
        * @type number|date|string
        * @notUsedInTheme
        */
        endValue: undefined
    },
    /**
    *@name dxrangeselectoroptions.value
    * @publicName value
    * @type Array<number,string,Date>
    * @fires dxrangeselectoroptions.onvaluechanged
    * @notUsedInTheme
    */
    value: [undefined, undefined],
    /**
    * @name dxrangeselectoroptions.selectedrangecolor
    * @publicName selectedRangeColor
    * @type string
    * @default "#606060"
    */
    selectedRangeColor: "#606060",
    /**
    * @name dxrangeselectoroptions.indent
    * @publicName indent
    * @type object
    */
    indent: {
        /**
        * @name dxrangeselectoroptions.indent.left
        * @publicName left
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        left: undefined,
        /**
        * @name dxrangeselectoroptions.indent.right
        * @publicName right
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        right: undefined
    },
    /**
    * @name dxrangeselectoroptions.behavior
    * @publicName behavior
    * @type object
    */
    behavior: {
        /**
        * @name dxrangeselectoroptions.behavior.animationenabled
        * @publicName animationEnabled
        * @type boolean
        * @default true
        */
        animationEnabled: true,
        /**
        * @name dxrangeselectoroptions.behavior.snaptoticks
        * @publicName snapToTicks
        * @type boolean
        * @default true
        */
        snapToTicks: true,
        /**
        * @name dxrangeselectoroptions.behavior.moveselectedrangebyclick
        * @publicName moveSelectedRangeByClick
        * @type boolean
        * @default true
        */
        moveSelectedRangeByClick: true,
        /**
        * @name dxrangeselectoroptions.behavior.manualrangeselectionenabled
        * @publicName manualRangeSelectionEnabled
        * @type boolean
        * @default true
        */
        manualRangeSelectionEnabled: true,
        /**
        * @name dxrangeselectoroptions.behavior.allowslidersswap
        * @publicName allowSlidersSwap
        * @type boolean
        * @default true
        */
        allowSlidersSwap: true,
        /**
        * @name dxrangeselectoroptions.behavior.callselectedrangechanged
        * @publicName callSelectedRangeChanged
        * @type Enums.ValueChangedCallMode
        * @default 'onMovingComplete'
        * @deprecated dxrangeselectoroptions.behavior.callvaluechanged
        */
        callSelectedRangeChanged: "onMovingComplete",
        /**
        * @name dxrangeselectoroptions.behavior.callvaluechanged
        * @publicName callValueChanged
        * @type Enums.ValueChangedCallMode
        * @default 'onMovingComplete'
        */
        callValueChanged: "onMovingComplete"
    },
    /**
    * @name dxrangeselectoroptions.background
    * @publicName background
    * @type object
    */
    background: {
        /**
        * @name dxrangeselectoroptions.background.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxrangeselectoroptions.background.color
        * @publicName color
        * @type string
        * @default '#C0BAE1'
        */
        color: "#C0BAE1",
        /**
        * @name dxrangeselectoroptions.background.image
        * @publicName image
        * @type object
        */
        image: {
            /**
            * @name dxrangeselectoroptions.background.image.url
            * @publicName url
            * @type string
            * @default undefined
            */
            url: undefined,
            /**
            * @name dxrangeselectoroptions.background.image.location
            * @publicName location
            * @type Enums.BackgroundImageLocation
            * @default 'full'
            */
            location: 'full'
        }
    },
    /**
    * @name dxrangeselectoroptions.tooltip
    * @publicName tooltip
    * @hidden
    * @inheritdoc
    */
    tooltip: undefined,
    /**
    * @name dxrangeselectoroptions.chart
    * @publicName chart
    * @type object
    */
    chart: {
        /**
        * @name dxrangeselectoroptions.chart.commonseriessettings
        * @publicName commonSeriesSettings
        * @type dxChartOptions.commonSeriesSettings
        */
        commonSeriesSettings: undefined,
        /**
        * @name dxrangeselectoroptions.chart.bottomindent
        * @publicName bottomIndent
        * @type number
        * @default 0
        */
        bottomIndent: 0,
        /**
        * @name dxrangeselectoroptions.chart.topindent
        * @publicName topIndent
        * @type number
        * @default 0.1
        */
        topIndent: 0.1,
        /**
        * @name dxrangeselectoroptions.chart.dataPrepareSettings
        * @publicName dataPrepareSettings
        * @type object
        */
        dataPrepareSettings: {
            /**
            * @name dxrangeselectoroptions.chart.dataPrepareSettings.checkTypeForAllData
            * @publicName checkTypeForAllData
            * @type boolean
            * @default false
            */
            checkTypeForAllData: false,
            /**
            * @name dxrangeselectoroptions.chart.dataPrepareSettings.convertToAxisDataType
            * @publicName convertToAxisDataType
            * @type boolean
            * @default true
            */
            convertToAxisDataType: true,
            /**
            * @name dxrangeselectoroptions.chart.dataPrepareSettings.sortingMethod
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
        * @name dxrangeselectoroptions.chart.useAggregation
        * @publicName useAggregation
        * @type boolean
        * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
        */
        useAggregation: false,
        /**
        * @name dxrangeselectoroptions.chart.valueaxis
        * @publicName valueAxis
        * @type object
        */
        valueAxis: {
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.min
            * @publicName min
            * @type number
            * @default undefined
            */
            min: undefined,
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.max
            * @publicName max
            * @type number
            * @default undefined
            */
            max: undefined,
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.inverted
            * @publicName inverted
            * @type boolean
            * @default false
            */
            inverted: false,
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.valuetype
            * @publicName valueType
            * @type Enums.ChartDataType
            * @default undefined
            */
            valueType: undefined,
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.type
            * @publicName type
            * @type Enums.RangeSelectorChartAxisScaleType
            * @default undefined
            */
            type: 'continuous',
            /**
            * @name dxrangeselectoroptions.chart.valueaxis.logarithmbase
            * @publicName logarithmBase
            * @type number
            * @default 10
            */
            logarithmBase: 10,
        },
        /**
        * @name dxrangeselectoroptions.chart.series
        * @publicName series
        * @type dxChartOptions.series|Array<dxChartOptions.series>
        * @default undefined
        * @notUsedInTheme
        */
        series: undefined,
        /**
        * @name dxrangeselectoroptions.chart.seriestemplate
        * @publicName seriesTemplate
        * @type object
        * @default undefined
        */
        seriesTemplate: {
            /**
            * @name dxrangeselectoroptions.chart.seriestemplate.nameField
            * @publicName nameField
            * @type string
            * @default 'series'
            */
            nameField: 'series',
            /**
            * @name dxrangeselectoroptions.chart.seriestemplate.customizeSeries
            * @publicName customizeSeries
            * @type function(seriesName)
            * @type_function_param1 seriesName:any
            * @type_function_return dxChartOptions.series
            */
            customizeSeries: function() { }
        },
        /**
        * @name dxrangeselectoroptions.chart.equalbarwidth
        * @publicName equalBarWidth
        * @type boolean
        * @deprecated dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
        */
        equalBarWidth: true,
        /**
        * @name dxrangeselectoroptions.chart.barwidth
        * @publicName barWidth
        * @type number
        * @deprecated dxChartSeriesTypes.CommonSeries.barPadding
        */
        barWidth: undefined,
        /**
        * @name dxrangeselectoroptions.chart.bargrouppadding
        * @publicName barGroupPadding
        * @type number
        * @default 0.3
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
        */
        barGroupPadding: 0.3,
        /**
        * @name dxrangeselectoroptions.chart.bargroupwidth
        * @publicName barGroupWidth
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
        */
        barGroupWidth: undefined,
        /**
        * @name dxrangeselectoroptions.chart.negativesaszeroes
        * @publicName negativesAsZeroes
        * @type boolean
        * @default false
        */
        negativesAsZeroes: false,
        /**
        * @name dxrangeselectoroptions.chart.palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: [],
        /**
        * @name dxrangeselectoroptions.chart.paletteextensionmode
        * @publicName paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend'
    },
    /**
    * @name dxrangeselectoroptions.datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxrangeselectoroptions.datasourcefield
    * @publicName dataSourceField
    * @type string
    * @default 'arg'
    */
    dataSourceField: undefined,
    /**
    * @name dxrangeselectoroptions.onselectedrangechanged
    * @publicName onSelectedRangeChanged
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 startValue:Date|Number
    * @type_function_param1_field5 endValue:Date|Number
    * @default null
    * @deprecated dxrangeselectoroptions.onvaluechanged
    * @notUsedInTheme
    * @action
    */
    onSelectedRangeChanged: null,
    /**
    * @name dxrangeselectoroptions.onvaluechanged
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
    * @name dxrangeselectoroptions.containerbackgroundcolor
    * @publicName containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxrangeselectormethods.getSelectedRange
    * @publicName getSelectedRange()
    * @return object
    * @deprecated dxrangeselectormethods.getValue
    */
    getSelectedRange: function() { },
    /**
    * @name dxrangeselectormethods.setSelectedRange
    * @publicName setSelectedRange(selectedRange)
    * @param1 selectedRange:object
    * @param1_field1 startValue:Date|Number|String
    * @param1_field2 endValue:Date|Number|String
    * @deprecated dxrangeselectormethods.setValue
    */
    setSelectedRange: function() { },
    /**
    * @name dxrangeselectormethods.setValue
    * @publicName setValue(value)
    * @param1 value:Array<number,string,Date>
    */
    setValue: function() { },
    /**
    * @name dxrangeselectormethods.getValue
    * @publicName getValue()
    * @return Array<number,string,Date>
    */
    getValue: function() { },
    /**
    * @name dxrangeselectormethods.render
    * @publicName render(skipChartAnimation)
    * @param1 skipChartAnimation:boolean
    */
    render: function(skipChartAnimation) { },
    /**
    * @name dxrangeselectormethods.getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
