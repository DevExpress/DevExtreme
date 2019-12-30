/**
* @name BaseGauge
* @type object
* @hidden
* @inherits BaseWidget
*/
const BaseGauge = {
    /**
    * @name BaseGaugeOptions.containerBackgroundColor
    * @type string
    * @default 'none'
    */
    containerBackgroundColor: 'none',

    /**
    * @name BaseGaugeOptions.loadingIndicator
    * @type object
    */
    loadingIndicator: {
        /**
        * @name BaseGaugeOptions.loadingIndicator.enabled
        * @type boolean
        * @hidden
        */
        enabled: false
    },
    /**
    * @name BaseGaugeOptions.animation
    * @type object
    */
    animation: {
        /**
        * @name BaseGaugeOptions.animation.enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name BaseGaugeOptions.animation.duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name BaseGaugeOptions.animation.easing
        * @type Enums.VizAnimationEasing
        * @default 'easeOutCubic'
        */
        easing: 'easeOutCubic'
    },
    /**
    * @name BaseGaugeOptions.scale
    * @type object
    */
    scale: {
        /**
        * @name BaseGaugeOptions.scale.scaleDivisionFactor
        * @type number
        * @default 17
        */
        scaleDivisionFactor: 17,
        /**
        * @name BaseGaugeOptions.scale.startValue
        * @type number
        * @default 0
        * @notUsedInTheme
        */
        startValue: 0,
        /**
        * @name BaseGaugeOptions.scale.endValue
        * @type number
        * @default 100
        * @notUsedInTheme
        */
        endValue: 100,
        /**
        * @name BaseGaugeOptions.scale.tickInterval
        * @type number
        * @default undefined
        */
        tickInterval: undefined,
        /**
        * @name BaseGaugeOptions.scale.minorTickInterval
        * @type number
        * @default undefined
        */
        minorTickInterval: undefined,
        /**
        * @name BaseGaugeOptions.scale.customTicks
        * @type Array<number>
        * @default undefined
        * @notUsedInTheme
        */
        customTicks: undefined,
        /**
        * @name BaseGaugeOptions.scale.customMinorTicks
        * @type Array<number>
        * @default undefined
        * @notUsedInTheme
        */
        customMinorTicks: undefined,
        /**
        * @name BaseGaugeOptions.scale.tick
        * @type object
        */
        tick: {
            /**
            * @name BaseGaugeOptions.scale.tick.color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name BaseGaugeOptions.scale.tick.length
            * @type number
            * @default 5
            */
            length: 5,
            /**
            * @name BaseGaugeOptions.scale.tick.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name BaseGaugeOptions.scale.tick.opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name BaseGaugeOptions.scale.tick.visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name BaseGaugeOptions.scale.minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name BaseGaugeOptions.scale.minorTick.color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name BaseGaugeOptions.scale.minorTick.opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name BaseGaugeOptions.scale.minorTick.length
            * @type number
            * @default 3
            */
            length: 3,
            /**
            * @name BaseGaugeOptions.scale.minorTick.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name BaseGaugeOptions.scale.minorTick.visible
            * @type boolean
            * @default false
            */
            visible: false
        },
        /**
        * @name BaseGaugeOptions.scale.label
        * @type object
        */
        label: {
            /**
            * @name BaseGaugeOptions.scale.label.useRangeColors
            * @type boolean
            * @default false
            */
            useRangeColors: false,
            /**
            * @name BaseGaugeOptions.scale.label.overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior
            * @default 'hide'
            */
            overlappingBehavior: "hide",
            /**
            * @name BaseGaugeOptions.scale.label.format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name BaseGaugeOptions.scale.label.customizeText
            * @type function(scaleValue)
            * @type_function_param1 scaleValue:object
            * @type_function_param1_field1 value:Number
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name BaseGaugeOptions.scale.label.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name BaseGaugeOptions.scale.label.font
            * @type Font
            * @default '#767676' @prop color
            */
            font: {
                color: '#767676',
                size: 12,
                family: undefined,
                weight: 400,
                opacity: 1
            }
        },
        /**
        * @name BaseGaugeOptions.scale.allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined
    },
    /**
    * @name BaseGaugeOptions.rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name BaseGaugeOptions.rangeContainer.offset
        * @type number
        * @default 0
        */
        offset: 0,
        /**
        * @name BaseGaugeOptions.rangeContainer.backgroundColor
        * @type string
        * @default '#808080'
        */
        backgroundColor: '#808080',
        /**
        * @name BaseGaugeOptions.rangeContainer.palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name BaseGaugeOptions.rangeContainer.paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend',
        /**
        * @name BaseGaugeOptions.rangeContainer.ranges
        * @type Array<Object>
        * @default []
        * @notUsedInTheme
        */
        ranges: [{
            /**
            * @name BaseGaugeOptions.rangeContainer.ranges.startValue
            * @type number
            */
            startValue: 0,
            /**
            * @name BaseGaugeOptions.rangeContainer.ranges.endValue
            * @type number
            */
            endValue: 20,
            /**
            * @name BaseGaugeOptions.rangeContainer.ranges.color
            * @type string
            */
            color: '#A6C567'
        }]
    },
    /**
    * @name BaseGaugeOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseGaugeOptions.tooltip.customizeTooltip
        * @default undefined
        * @type function(scaleValue)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return object
        */
        customizeTooltip: undefined,
        /**
        * @name BaseGaugeOptions.tooltip.contentTemplate
        * @type template|function(scaleValue, element)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_param2 element:dxElement
        * @type_function_return string|Node|jQuery
        * @default undefined
        */
        contentTemplate: undefined
    },
    /**
    * @name BaseGaugeOptions.onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name BaseGaugeOptions.onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name BaseGaugeOptions.value
    * @type number
    * @default undefined
    * @notUsedInTheme
    * @fires BaseWidgetOptions.onOptionChanged
    */
    value: undefined,
    /**
    * @name BaseGaugeOptions.subvalues
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
    * @fires BaseWidgetOptions.onOptionChanged
    */
    subvalues: undefined,
    /**
    * @name BaseGaugeMethods.value
    * @publicName value()
    * @return number
    */
    value: function() { },
    /**
    * @name BaseGaugeMethods.value
    * @publicName value(value)
    * @param1 value:number
    */
    value: function() { },
    /**
    * @name BaseGaugeMethods.subvalues
    * @publicName subvalues()
    * @return Array<number>
    */
    subvalues: function() { },
    /**
    * @name BaseGaugeMethods.subvalues
    * @publicName subvalues(subvalues)
    * @param1 subvalues:Array<number>
    */
    subvalues: function() { }
};

/**
* @name dxCircularGauge
* @inherits BaseGauge
* @module viz/circular_gauge
* @export default
*/
const dxCircularGauge = {
    /**
    * @name dxCircularGaugeOptions.geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxCircularGaugeOptions.geometry.startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxCircularGaugeOptions.geometry.endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxCircularGaugeOptions.scale
    * @type object
    */
    scale: {
        /**
        * @name dxCircularGaugeOptions.scale.orientation
        * @type Enums.CircularGaugeElementOrientation
        * @default 'outside'
        */
        orientation: 'outside',
        /**
        * @name dxCircularGaugeOptions.scale.label
        * @type object
        */
        label: {
            /**
            * @name dxCircularGaugeOptions.scale.label.indentFromTick
            * @type number
            * @default 10
            */
            indentFromTick: 10,
            /**
            * @name dxCircularGaugeOptions.scale.label.hideFirstOrLast
            * @type Enums.GaugeOverlappingBehavior
            * @default 'last'
            */
            hideFirstOrLast: "last"
        }
    },
    /**
    * @name dxCircularGaugeOptions.rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxCircularGaugeOptions.rangeContainer.width
        * @type number
        * @default 5
        */
        width: 5,
        /**
        * @name dxCircularGaugeOptions.rangeContainer.orientation
        * @type Enums.CircularGaugeElementOrientation
        * @default 'outside'
        */
        orientation: 'outside'
    },
    /**
    * @name dxCircularGaugeOptions.valueIndicator
    * @type GaugeIndicator
    * @inheritAll
    */
    valueIndicator: {
        /**
        * @name dxCircularGaugeOptions.valueIndicator.type
        * @type string
        * @default 'rectangleNeedle'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rectangleNeedle'
    },
    /**
    * @name dxCircularGaugeOptions.subvalueIndicator
    * @type GaugeIndicator
    * @inheritAll
    */
    subvalueIndicator: {
        /**
        * @name dxCircularGaugeOptions.subvalueIndicator.type
        * @type string
        * @default 'triangleMarker'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'triangleMarker'
    }
};

/**
* @name dxLinearGauge
* @inherits BaseGauge
* @module viz/linear_gauge
* @export default
*/
const dxLinearGauge = {
    /**
    * @name dxLinearGaugeOptions.geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxLinearGaugeOptions.geometry.orientation
        * @type Enums.Orientation
        * @default 'horizontal'
        */
        orientation: 'horizontal'
    },
    /**
    * @name dxLinearGaugeOptions.scale
    * @type object
    */
    scale: {
        /**
        * @name dxLinearGaugeOptions.scale.scaleDivisionFactor
        * @type number
        * @default 25
        */
        scaleDivisionFactor: 25,
        /**
        * @name dxLinearGaugeOptions.scale.verticalOrientation
        * @type Enums.VerticalAlignment
        * @default 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxLinearGaugeOptions.scale.horizontalOrientation
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalOrientation: 'right',
        /**
        * @name dxLinearGaugeOptions.scale.label
        * @type object
        */
        label: {
            /**
            * @name dxLinearGaugeOptions.scale.label.indentFromTick
            * @type number
            * @default -10
            */
            indentFromTick: -10
        }
    },
    /**
    * @name dxLinearGaugeOptions.rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxLinearGaugeOptions.rangeContainer.width
        * @type object|number
        */
        width: {
            /**
            * @name dxLinearGaugeOptions.rangeContainer.width.start
            * @type number
            * @default 5
            */
            start: 5,

            /**
            * @name dxLinearGaugeOptions.rangeContainer.width.end
            * @type number
            * @default 5
            */
            end: 5
        },
        /**
        * @name dxLinearGaugeOptions.rangeContainer.verticalOrientation
        * @type Enums.VerticalAlignment
        * @default 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxLinearGaugeOptions.rangeContainer.horizontalOrientation
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalOrientation: 'right'
    },
    /**
    * @name dxLinearGaugeOptions.valueIndicator
    * @type GaugeIndicator
    * @inheritAll
    */
    valueIndicator: {
        /**
        * @name dxLinearGaugeOptions.valueIndicator.type
        * @type string
        * @default 'rangeBar'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rangeBar'
    },
    /**
    * @name dxLinearGaugeOptions.subvalueIndicator
    * @type GaugeIndicator
    * @inheritAll
    */
    subvalueIndicator: {
        /**
        * @name dxLinearGaugeOptions.subvalueIndicator.type
        * @type string
        * @default 'triangleMarker'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'triangleMarker'
    }
};

/**
* @name dxBarGauge
* @inherits BaseWidget
* @module viz/bar_gauge
* @export default
*/
const dxBarGauge = {
    /**
    * @name dxBarGaugeOptions.animation
    * @type object
    * @inherits BaseGaugeOptions.animation
    */
    animation: {},
    /**
    * @name dxBarGaugeOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxBarGaugeOptions.tooltip.customizeTooltip
        * @default undefined
        * @type function(scaleValue)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_param1_field3 index:number
        * @type_function_return object
        */
        customizeTooltip: undefined,
        /**
        * @name dxBarGaugeOptions.tooltip.contentTemplate
        * @type template|function(scaleValue, element)
        * @type_function_param1 scaleValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_param1_field3 index:number
        * @type_function_param2 element:dxElement
        * @type_function_return string|Node|jQuery
        * @default undefined
        */
        contentTemplate: undefined
    },
    /**
    * @name dxBarGaugeOptions.geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxBarGaugeOptions.geometry.startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxBarGaugeOptions.geometry.endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxBarGaugeOptions.palette
    * @extends CommonVizPalette
    */
    palette: 'Default',
    /**
    * @name dxBarGaugeOptions.paletteExtensionMode
    * @default 'blend'
    * @type Enums.VizPaletteExtensionMode
    */
    paletteExtensionMode: 'blend',
    /**
    * @name dxBarGaugeOptions.backgroundColor
    * @type string
    * @default '#e0e0e0'
    */
    backgroundColor: '#e0e0e0',
    /**
    * @name dxBarGaugeOptions.loadingIndicator
    * @type object
    */
    loadingIndicator: {
        /**
        * @name dxBarGaugeOptions.loadingIndicator.enabled
        * @hidden
        */
        enabled: false
    },
    /**
    * @name dxBarGaugeOptions.barSpacing
    * @type number
    * @default 4
    */
    barSpacing: 4,
    /**
    * @name dxBarGaugeOptions.relativeInnerRadius
    * @type number
    * @default 0.3
    */
    relativeInnerRadius: 0.3,
    /**
    * @name dxBarGaugeOptions.label
    * @type object
    */
    label: {
        /**
        * @name dxBarGaugeOptions.label.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxBarGaugeOptions.label.indent
        * @type number
        * @default 20
        */
        indent: 20,
        /**
        * @name dxBarGaugeOptions.label.connectorWidth
        * @type number
        * @default 2
        */
        connectorWidth: 2,
        /**
        * @name dxBarGaugeOptions.label.connectorColor
        * @type string
        * @default undefined
        */
        connectorColor: undefined,
        /**
        * @name dxBarGaugeOptions.label.format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxBarGaugeOptions.label.customizeText
        * @type function(barValue)
        * @type_function_param1 barValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxBarGaugeOptions.label.font
        * @type Font
        * @default 16 @prop size
        */
        font: {
            color: undefined,
            size: 16,
            family: undefined,
            weight: 400,
            opacity: 1
        }
    },
    /**
    * @name dxBarGaugeOptions.legend
    * @inherits BaseLegend
    * @type object
    */
    legend: {
        /**
        * @name dxBarGaugeOptions.legend.itemTextFormat
        * @extends CommonVizFormat
        */
        itemTextFormat: undefined,
        /**
        * @name dxBarGaugeOptions.legend.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxBarGaugeOptions.legend.customizeText
        * @type function(arg)
        * @type_function_param1 arg:object
        * @type_function_param1_field1 item:BarGaugeBarInfo
        * @type_function_param1_field2 text:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxBarGaugeOptions.legend.customizeHint
        * @type function(arg)
        * @type_function_param1 arg:object
        * @type_function_param1_field1 item:BarGaugeBarInfo
        * @type_function_param1_field2 text:string
        * @type_function_return string
        */
        customizeHint: undefined,
        /**
        * @name dxBarGaugeOptions.legend.customizeItems
        * @type function(items)
        * @type_function_param1 items:Array<BarGaugeLegendItem>
        * @type_function_return Array<BarGaugeLegendItem>
        */
        customizeItems: undefined,
        /**
        * @name dxBarGaugeOptions.legend.markerTemplate
        * @type template|function
        * @default undefined
        * @type_function_param1 legendItem:BarGaugeLegendItem
        * @type_function_param2 element:SVGGElement
        * @type_function_return string|SVGElement|jQuery
        */
        markerTemplate: undefined
    },
    /**
    * @name dxBarGaugeOptions.resolveLabelOverlapping
    * @type Enums.BarGaugeResolveLabelOverlapping
    * @default 'hide'
    */
    resolveLabelOverlapping: "hide",
    /**
    * @name dxBarGaugeOptions.startValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startValue: 0,
    /**
    * @name dxBarGaugeOptions.endValue
    * @type number
    * @default 100
    * @notUsedInTheme
    */
    endValue: 100,
    /**
    * @name dxBarGaugeOptions.baseValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    baseValue: 0,
    /**
    * @name dxBarGaugeOptions.values
    * @type Array<number>
    * @default []
    * @notUsedInTheme
    * @fires BaseWidgetOptions.onOptionChanged
    */
    values: [],
    /**
    * @name dxbargaugemethods.values
    * @publicName values()
    * @return Array<number>
    */
    values: function() { },
    /**
    * @name dxbargaugemethods.values
    * @publicName values(newValues)
    * @param1 values:Array<number>
    */
    values: function() { },
    /**
    * @name dxBarGaugeOptions.onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxBarGaugeOptions.onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};

/**
* @name BarGaugeBarInfo
* @type object
*/
const BarGaugeBarInfo = {
    /**
    * @name BarGaugeBarInfo.color
    * @type string
    */
    color: "",
    /**
    * @name BarGaugeBarInfo.index
    * @type number
    */
    index: 0,
    /**
    * @name BarGaugeBarInfo.value
    * @type number
    */
    value: 0
};

/**
* @name BarGaugeLegendItem
* @type object
* @inherits BaseLegendItem
*/
const legendItem = {
    /**
    * @name BarGaugeLegendItem.item
    * @type BarGaugeBarInfo
    */
    item: undefined
};
