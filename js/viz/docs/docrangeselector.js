/**
* @name dxRangeSelector
* @inherits BaseWidget
* @module viz/range_selector
* @export default
*/
var dxRangeSelector = {
    /**
    * @name dxRangeSelector.Options
    * @namespace DevExpress.viz.rangeSelector
    * @hidden
    */
    /**
    * @name dxRangeSelectorOptions.scale
    * @type object
    */
    scale: {
        /**
        * @name dxRangeSelectorOptions.scale.valueType
        * @type Enums.ChartDataType
        * @default undefined
        */
        valueType: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.type
        * @type Enums.RangeSelectorAxisScaleType
        * @default undefined
        */
        type: 'continuous',
        /**
        * @name dxRangeSelectorOptions.scale.logarithmBase
        * @type number
        * @default 10
        */
        logarithmBase: 10,
        /**
        * @name dxRangeSelectorOptions.scale.minorTickCount
        * @type number
        * @default undefined
        */
        minorTickCount: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.showCustomBoundaryTicks
        * @type boolean
        * @default true
        */
        showCustomBoundaryTicks: true,
        /**
        * @name dxRangeSelectorOptions.scale.startValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        startValue: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.endValue
        * @type number|date|string
        * @default undefined
        * @notUsedInTheme
        */
        endValue: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.minorTickInterval
        * @inherits VizTimeInterval
        */
        minorTickInterval: {},
        /**
        * @name dxRangeSelectorOptions.scale.breaks
        * @type Array<ScaleBreak>
        * @inherits ScaleBreak
        * @default undefined
        * @notUsedInTheme
        */
        breaks: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.workdaysOnly
        * @type boolean
        * @default false
        */
        workdaysOnly: false,
        /**
        * @name dxRangeSelectorOptions.scale.workWeek
        * @type Array<number>
        * @default [1, 2, 3, 4, 5]
        */
        workWeek: [1, 2, 3, 4, 5],
        /**
        * @name dxRangeSelectorOptions.scale.holidays
        * @type Array<Date, string>| Array<number>
        * @default undefined
        */
        holidays: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.singleWorkdays
        * @type Array<Date, string> | Array<number>
        * @default undefined
        */
        singleWorkdays: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.breakStyle
        * @type object
        */
        breakStyle: {
            /**
            * @name dxRangeSelectorOptions.scale.breakStyle.width
            * @type number
            * @default 5
            */
            width: 5,
            /**
            * @name dxRangeSelectorOptions.scale.breakStyle.color
            * @type string
            * @default "#ababab"
            */
            color: "#ababab",
            /**
            * @name dxRangeSelectorOptions.scale.breakStyle.line
            * @type Enums.ScaleBreakLineStyle
            * @default "waved"
            */
            line: "waved"
        },
        /**
        * @name dxRangeSelectorOptions.scale.tickInterval
        * @inherits VizTimeInterval
        */
        tickInterval: {},
        /**
        * @name dxRangeSelectorOptions.scale.placeholderHeight
        * @type number
        * @default undefined
        */
        placeholderHeight: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.minRange
        * @inherits VizTimeInterval
        */
        minRange: {},
        /**
        * @name dxRangeSelectorOptions.scale.maxRange
        * @inherits VizTimeInterval
        */
        maxRange: {},
        /**
        * @name dxRangeSelectorOptions.scale.label
        * @type object
        */
        label: {
            /**
           * @name dxRangeSelectorOptions.scale.label.visible
           * @type boolean
           * @default true
           */
            visible: true,
            /**
            * @name dxRangeSelectorOptions.scale.label.format
            * @extends CommonVizFormat
            */
            format: undefined,
            /**
            * @name dxRangeSelectorOptions.scale.label.customizeText
            * @type function(scaleValue)
            * @type_function_param1 scaleValue:object
            * @type_function_param1_field1 value:Date|Number
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name dxRangeSelectorOptions.scale.label.topIndent
            * @type number
            * @default 7
            */
            topIndent: 7,
            /**
            * @name dxRangeSelectorOptions.scale.label.font
            * @type object
            */
            font: {
                /**
                * @name dxRangeSelectorOptions.scale.label.font.color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name dxRangeSelectorOptions.scale.label.font.size
                * @type number|string
                * @default 11
                */
                size: 11,
                /**
                * @name dxRangeSelectorOptions.scale.label.font.family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxRangeSelectorOptions.scale.label.font.weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxRangeSelectorOptions.scale.label.font.opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            },
            /**
            * @name dxRangeSelectorOptions.scale.label.overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior
            * @default "hide"
            */
            overlappingBehavior: "hide"
        },
        /**
        * @name dxRangeSelectorOptions.scale.tick
        * @type object
        */
        tick: {
            /**
            * @name dxRangeSelectorOptions.scale.tick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxRangeSelectorOptions.scale.tick.color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxRangeSelectorOptions.scale.tick.opacity
            * @type number
            * @default 0.1
            */
            opacity: 0.1
        },
        /**
        * @name dxRangeSelectorOptions.scale.minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name dxRangeSelectorOptions.scale.minorTick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxRangeSelectorOptions.scale.minorTick.color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxRangeSelectorOptions.scale.minorTick.opacity
            * @type number
            * @default 0.06
            */
            opacity: 0.06,
            /**
            * @name dxRangeSelectorOptions.scale.minorTick.visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name dxRangeSelectorOptions.scale.marker
        * @type object
        */
        marker: {
            /**
            * @name dxRangeSelectorOptions.scale.marker.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxRangeSelectorOptions.scale.marker.separatorHeight
            * @type number
            * @default 33
            */
            separatorHeight: 33,
            /**
            * @name dxRangeSelectorOptions.scale.marker.topIndent
            * @type number
            * @default 10
            */
            topIndent: 10,
            /**
            * @name dxRangeSelectorOptions.scale.marker.textLeftIndent
            * @type number
            * @default 7
            */
            textLeftIndent: 7,
            /**
            * @name dxRangeSelectorOptions.scale.marker.textTopIndent
            * @type number
            * @default 11
            */
            textTopIndent: 11,
            /**
            * @name dxRangeSelectorOptions.scale.marker.label
            * @type object
            */
            label: {
                /**
                * @name dxRangeSelectorOptions.scale.marker.label.format
                * @extends CommonVizFormat
                */
                format: '',
                /**
                * @name dxRangeSelectorOptions.scale.marker.label.customizeText
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
        * @name dxRangeSelectorOptions.scale.categories
        * @type Array<number,string,Date>
        */
        categories: [],
        /**
        * @name dxRangeSelectorOptions.scale.allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined,
        /**
        * @name dxRangeSelectorOptions.scale.endOnTick
        * @type boolean
        * @default false
        */
        endOnTick: false,
        /**
        * @name dxRangeSelectorOptions.scale.aggregationGroupWidth
        * @type number
        * @default undefined
        */
        aggregationGroupWidth: 10,
        /**
        * @name dxRangeSelectorOptions.scale.aggregationInterval
        * @inherits VizTimeInterval
        */
        aggregationInterval: undefined,
    },
    /**
    * @name dxRangeSelectorOptions.sliderMarker
    * @type object
    */
    sliderMarker: {
        /**
        * @name dxRangeSelectorOptions.sliderMarker.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.customizeText
        * @type function(scaleValue)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Date|Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.paddingTopBottom
        * @type number
        * @default 2
        */
        paddingTopBottom: 2,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.paddingLeftRight
        * @type number
        * @default 4
        */
        paddingLeftRight: 4,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.color
        * @type string
        * @default '#9B9B9B'
        */
        color: '#9B9B9B',
        /**
        * @name dxRangeSelectorOptions.sliderMarker.invalidRangeColor
        * @type string
        * @default 'red'
        */
        invalidRangeColor: 'red',
        /**
        * @name dxRangeSelectorOptions.sliderMarker.placeholderHeight
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        placeholderHeight: undefined,
        /**
        * @name dxRangeSelectorOptions.sliderMarker.font
        * @type object
        */
        font: {
            /**
            * @name dxRangeSelectorOptions.sliderMarker.font.color
            * @type string
            * @default 'white'
            */
            color: 'white',
            /**
            * @name dxRangeSelectorOptions.sliderMarker.font.size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxRangeSelectorOptions.sliderMarker.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name dxRangeSelectorOptions.sliderMarker.font.weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxRangeSelectorOptions.sliderMarker.font.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    },
    /**
    * @name dxRangeSelectorOptions.sliderHandle
    * @type object
    */
    sliderHandle: {
        /**
        * @name dxRangeSelectorOptions.sliderHandle.color
        * @type string
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxRangeSelectorOptions.sliderHandle.width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name dxRangeSelectorOptions.sliderHandle.opacity
        * @type number
        * @default 0.2
        */
        opacity: 0.2
    },
    /**
    * @name dxRangeSelectorOptions.shutter
    * @type object
    */
    shutter: {
        /**
        * @name dxRangeSelectorOptions.shutter.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxRangeSelectorOptions.shutter.opacity
        * @type number
        * @default 0.75
        */
        opacity: 0.75
    },
    /**
    *@name dxRangeSelectorOptions.value
    * @type Array<number,string,Date>
    * @fires dxRangeSelectorOptions.onValueChanged
    * @notUsedInTheme
    */
    value: [undefined, undefined],
    /**
    * @name dxRangeSelectorOptions.selectedRangeColor
    * @type string
    * @default "#606060"
    */
    selectedRangeColor: "#606060",
    /**
    * @name dxRangeSelectorOptions.indent
    * @type object
    */
    indent: {
        /**
        * @name dxRangeSelectorOptions.indent.left
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        left: undefined,
        /**
        * @name dxRangeSelectorOptions.indent.right
        * @type number
        * @default undefined
        * @notUsedInTheme
        */
        right: undefined
    },
    /**
    * @name dxRangeSelectorOptions.behavior
    * @type object
    */
    behavior: {
        /**
        * @name dxRangeSelectorOptions.behavior.animationEnabled
        * @type boolean
        * @default true
        */
        animationEnabled: true,
        /**
        * @name dxRangeSelectorOptions.behavior.snapToTicks
        * @type boolean
        * @default true
        */
        snapToTicks: true,
        /**
        * @name dxRangeSelectorOptions.behavior.moveSelectedRangeByClick
        * @type boolean
        * @default true
        */
        moveSelectedRangeByClick: true,
        /**
        * @name dxRangeSelectorOptions.behavior.manualRangeSelectionEnabled
        * @type boolean
        * @default true
        */
        manualRangeSelectionEnabled: true,
        /**
        * @name dxRangeSelectorOptions.behavior.allowSlidersSwap
        * @type boolean
        * @default true
        */
        allowSlidersSwap: true,
        /**
        * @name dxRangeSelectorOptions.behavior.callValueChanged
        * @type Enums.ValueChangedCallMode
        * @default 'onMovingComplete'
        */
        callValueChanged: "onMovingComplete"
    },
    /**
    * @name dxRangeSelectorOptions.background
    * @type object
    */
    background: {
        /**
        * @name dxRangeSelectorOptions.background.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxRangeSelectorOptions.background.color
        * @type string
        * @default '#C0BAE1'
        */
        color: "#C0BAE1",
        /**
        * @name dxRangeSelectorOptions.background.image
        * @type object
        */
        image: {
            /**
            * @name dxRangeSelectorOptions.background.image.url
            * @type string
            * @default undefined
            */
            url: undefined,
            /**
            * @name dxRangeSelectorOptions.background.image.location
            * @type Enums.BackgroundImageLocation
            * @default 'full'
            */
            location: 'full'
        }
    },
    /**
    * @name dxRangeSelectorOptions.tooltip
    * @hidden
    * @inheritdoc
    */
    tooltip: undefined,
    /**
    * @name dxRangeSelectorOptions.chart
    * @type object
    */
    chart: {
        /**
        * @name dxRangeSelectorOptions.chart.commonSeriesSettings
        * @type dxChartOptions.commonSeriesSettings
        */
        commonSeriesSettings: undefined,
        /**
        * @name dxRangeSelectorOptions.chart.bottomIndent
        * @type number
        * @default 0
        */
        bottomIndent: 0,
        /**
        * @name dxRangeSelectorOptions.chart.topIndent
        * @type number
        * @default 0.1
        */
        topIndent: 0.1,
        /**
        * @name dxRangeSelectorOptions.chart.dataPrepareSettings
        * @type object
        */
        dataPrepareSettings: {
            /**
            * @name dxRangeSelectorOptions.chart.dataPrepareSettings.checkTypeForAllData
            * @type boolean
            * @default false
            */
            checkTypeForAllData: false,
            /**
            * @name dxRangeSelectorOptions.chart.dataPrepareSettings.convertToAxisDataType
            * @type boolean
            * @default true
            */
            convertToAxisDataType: true,
            /**
            * @name dxRangeSelectorOptions.chart.dataPrepareSettings.sortingMethod
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
        * @name dxRangeSelectorOptions.chart.useAggregation
        * @type boolean
        * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
        */
        useAggregation: false,
        /**
        * @name dxRangeSelectorOptions.chart.valueAxis
        * @type object
        */
        valueAxis: {
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.min
            * @type number
            * @default undefined
            */
            min: undefined,
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.max
            * @type number
            * @default undefined
            */
            max: undefined,
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.inverted
            * @type boolean
            * @default false
            */
            inverted: false,
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.valueType
            * @type Enums.ChartDataType
            * @default undefined
            */
            valueType: undefined,
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.type
            * @type Enums.RangeSelectorChartAxisScaleType
            * @default undefined
            */
            type: 'continuous',
            /**
            * @name dxRangeSelectorOptions.chart.valueAxis.logarithmBase
            * @type number
            * @default 10
            */
            logarithmBase: 10,
        },
        /**
        * @name dxRangeSelectorOptions.chart.series
        * @type dxChartOptions.series|Array<dxChartOptions.series>
        * @default undefined
        * @notUsedInTheme
        */
        series: undefined,
        /**
        * @name dxRangeSelectorOptions.chart.seriesTemplate
        * @type object
        * @default undefined
        */
        seriesTemplate: {
            /**
            * @name dxRangeSelectorOptions.chart.seriesTemplate.nameField
            * @type string
            * @default 'series'
            */
            nameField: 'series',
            /**
            * @name dxRangeSelectorOptions.chart.seriesTemplate.customizeSeries
            * @type function(seriesName)
            * @type_function_param1 seriesName:any
            * @type_function_return dxChartOptions.series
            */
            customizeSeries: function() { }
        },
        /**
        * @name dxRangeSelectorOptions.chart.equalBarWidth
        * @type boolean
        * @deprecated dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
        */
        equalBarWidth: true,
        /**
        * @name dxRangeSelectorOptions.chart.barWidth
        * @type number
        * @deprecated dxChartSeriesTypes.CommonSeries.barPadding
        */
        barWidth: undefined,
        /**
        * @name dxRangeSelectorOptions.chart.barGroupPadding
        * @type number
        * @default 0.3
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
        */
        barGroupPadding: 0.3,
        /**
        * @name dxRangeSelectorOptions.chart.barGroupWidth
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeriesSeries
        */
        barGroupWidth: undefined,
        /**
        * @name dxRangeSelectorOptions.chart.negativesAsZeroes
        * @type boolean
        * @default false
        */
        negativesAsZeroes: false,
        /**
        * @name dxRangeSelectorOptions.chart.palette
        * @extends CommonVizPalette
        */
        palette: [],
        /**
        * @name dxRangeSelectorOptions.chart.paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend'
    },
    /**
    * @name dxRangeSelectorOptions.dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxRangeSelectorOptions.dataSourceField
    * @type string
    * @default 'arg'
    */
    dataSourceField: undefined,
    /**
    * @name dxRangeSelectorOptions.onValueChanged
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
    * @name dxRangeSelectorOptions.containerBackgroundColor
    * @type string
    * @default '#FFFFFF'
    */
    containerBackgroundColor: '#FFFFFF',
    /**
    * @name dxRangeSelectorMethods.setValue
    * @publicName setValue(value)
    * @param1 value:Array<number,string,Date>
    */
    setValue: function() { },
    /**
    * @name dxRangeSelectorMethods.getValue
    * @publicName getValue()
    * @return Array<number,string,Date>
    */
    getValue: function() { },
    /**
    * @name dxRangeSelectorMethods.render
    * @publicName render(skipChartAnimation)
    * @param1 skipChartAnimation:boolean
    */
    render: function(skipChartAnimation) { },
    /**
    * @name dxRangeSelectorMethods.getDataSource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
