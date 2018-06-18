/**
* @name BaseGauge
* @type object
* @hidden
* @inherits BaseWidget
*/
var BaseGauge = {
    /**
    * @name BaseGauge.Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name BaseGaugeOptions.containerBackgroundColor
    * @type string
    * @default 'none'
    */
    containerBackgroundColor: 'none',
    /**
    * @name BaseGaugeOptions.title
    * @inheritdoc
    */
    title: {
        /**
        * @name BaseGaugeOptions.title.position
        * @type Enums.GaugeTitlePosition
        * @default 'top-center'
        * @deprecated
        */
        position: undefined
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
    * @name BaseGaugeOptions.subtitle
    * @type object|string
    * @deprecated BaseWidgetOptions.title.subtitle
    */
    subtitle: {
        /**
        * @name BaseGaugeOptions.subtitle.text
        * @type string
        * @default undefined
        * @deprecated BaseWidgetOptions.title.subtitle.text
        */
        text: undefined,
        /**
        * @name BaseGaugeOptions.subtitle.font
        * @type object
        * @deprecated BaseWidgetOptions.title.subtitle.font
        */
        font: {
            /**
            * @name BaseGaugeOptions.subtitle.font.family
            * @extends CommonVizFontFamily
            * @deprecated BaseWidgetOptions.title.subtitle.font.family
            */
            family: undefined,
            /**
            * @name BaseGaugeOptions.subtitle.font.weight
            * @type number
            * @default 200
            * @deprecated BaseWidgetOptions.title.subtitle.font.weight
            */
            weight: 200,
            /**
            * @name BaseGaugeOptions.subtitle.font.color
            * @type string
            * @default '#232323'
            * @deprecated BaseWidgetOptions.title.subtitle.font.color
            */
            color: '#232323',
            /**
            * @name BaseGaugeOptions.subtitle.font.size
            * @type number|string
            * @default 16
            * @deprecated BaseWidgetOptions.title.subtitle.font.size
            */
            size: 16,
            /**
            * @name BaseGaugeOptions.subtitle.font.opacity
            * @type number
            * @default 1
            * @deprecated BaseWidgetOptions.title.subtitle.font.opacity
            */
            opacity: 1
        }
    },
    /**
    * @name BaseGaugeOptions.scale
    * @type object
    */
    scale: {
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
        * @name BaseGaugeOptions.scale.hideFirstTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideFirstTick: undefined,
        /**
        * @name BaseGaugeOptions.scale.hideLastTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideLastTick: undefined,
        /**
        * @name BaseGaugeOptions.scale.hideFirstLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideFirstLabel: undefined,
        /**
        * @name BaseGaugeOptions.scale.hideLastLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideLastLabel: undefined,
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
        * @name BaseGaugeOptions.scale.majorTick
        * @type object
        * @deprecated BaseGaugeOptions.scale.tick
        */
        majorTick: {
            /**
            * @name BaseGaugeOptions.scale.majorTick.color
            * @type string
            * @default '#FFFFFF'
            * @deprecated BaseGaugeOptions.scale.tick.color
            */
            color: '#FFFFFF',
            /**
            * @name BaseGaugeOptions.scale.majorTick.length
            * @type number
            * @default 5
            * @deprecated BaseGaugeOptions.scale.tick.length
            */
            length: 5,
            /**
            * @name BaseGaugeOptions.scale.majorTick.width
            * @type number
            * @default 2
            * @deprecated BaseGaugeOptions.scale.tick.width
            */
            width: 2,
            /**
            * @name BaseGaugeOptions.scale.majorTick.customTickValues
            * @type Array<number>
            * @default []
            * @deprecated BaseGaugeOptions.scale.customTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name BaseGaugeOptions.scale.majorTick.useTicksAutoArrangement
            * @type boolean
            * @default true
            * @deprecated BaseGaugeOptions.scale.label.overlappingBehavior
            */
            useTicksAutoArrangement: true,
            /**
            * @name BaseGaugeOptions.scale.majorTick.tickInterval
            * @type number
            * @default undefined
            * @deprecated BaseGaugeOptions.scale.tickInterval
            */
            tickInterval: undefined,
            /**
            * @name BaseGaugeOptions.scale.majorTick.showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name BaseGaugeOptions.scale.majorTick.visible
            * @type boolean
            * @default true
            * @deprecated BaseGaugeOptions.scale.tick.visible
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
            visible: false,
            /**
            * @name BaseGaugeOptions.scale.minorTick.showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name BaseGaugeOptions.scale.minorTick.customTickValues
            * @type Array<number>
            * @default []
            * @deprecated BaseGaugeOptions.scale.customMinorTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name BaseGaugeOptions.scale.minorTick.tickInterval
            * @type number
            * @default undefined
            * @deprecated BaseGaugeOptions.scale.minorTickInterval
            */
            tickInterval: undefined,
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
            * @type string|object
            * @default 'hide'
            * @acceptValues 'hide' | 'none'
            */
            overlappingBehavior: {
                /**
                * @name BaseGaugeOptions.scale.label.overlappingBehavior.useAutoArrangement
                * @type boolean
                * @default true
                * @deprecated BaseGaugeOptions.scale.label.overlappingBehavior
                */
                useAutoArrangement: true
            },
            /**
            * @name BaseGaugeOptions.scale.label.format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name BaseGaugeOptions.scale.label.precision
            * @extends CommonVizPrecision
            */
            precision: 2,
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
            * @type object
            */
            font: {
                /**
                * @name BaseGaugeOptions.scale.label.font.color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name BaseGaugeOptions.scale.label.font.size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name BaseGaugeOptions.scale.label.font.family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name BaseGaugeOptions.scale.label.font.weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name BaseGaugeOptions.scale.label.font.opacity
                * @type number
                * @default 1
                */
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
        customizeTooltip: undefined
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
    */
    value: undefined,
    /**
    * @name BaseGaugeOptions.subvalues
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
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
var dxCircularGauge = {
    /**
    * @name dxCircularGauge.Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
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
            hideFirstOrLast: "last",
            /**
            * @name dxCircularGaugeOptions.scale.label.overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior|object
            * @inheritdoc
            */
            overlappingBehavior: {
                /**
                * @name dxCircularGaugeOptions.scale.label.overlappingBehavior.hideFirstOrLast
                * @type Enums.GaugeOverlappingBehavior
                * @default "last"
                * @deprecated dxCircularGaugeOptions.scale.label.hideFirstOrLast
                */
                hideFirstOrLast: "last"
            }
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
    * @inherits CommonIndicator
    * @type object
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
    * @inherits CommonIndicator
    * @type object
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
var dxLinearGauge = {
    /**
    * @name dxLinearGauge.Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
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
            indentFromTick: -10,
            /**
            * @name dxLinearGaugeOptions.scale.label.overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior|object
            * @inheritdoc
            */
            overlappingBehavior: {
                /**
                * @name dxLinearGaugeOptions.scale.label.overlappingBehavior.hideFirstOrLast
                * @type Enums.GaugeOverlappingBehavior
                * @default "last"
                * @deprecated
                */
                hideFirstOrLast: "last"
            }
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
    * @inherits CommonIndicator
    * @type object
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
    * @inherits CommonIndicator
    * @type object
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
var dxBarGauge = {
    /**
    * @name dxBarGauge.Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name dxBarGaugeOptions.animation
    * @type object
    * @inherits BaseGaugeOptions.animation
    */
    animation: {},
    /**
    * @name dxBarGaugeOptions.title
    * @inheritdoc
    */
    title: {
        /**
        * @name dxBarGaugeOptions.title.position
        * @type Enums.GaugeTitlePosition
        * @default 'top-center'
        * @deprecated
        */
        position: undefined
    },
    /**
    * @name dxBarGaugeOptions.subtitle
    * @type object|string
    * @inherits BaseGaugeOptions.subtitle
    * @deprecated BaseWidgetOptions.title.subtitle
    */
    subtitle: {},
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
        customizeTooltip: undefined
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
        * @name dxBarGaugeOptions.label.precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
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
        * @type object
        */
        font: {
            /**
            * @name dxBarGaugeOptions.label.font.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxBarGaugeOptions.label.font.size
            * @type number|string
            * @default 16
            */
            size: 16,
            /**
            * @name dxBarGaugeOptions.label.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name dxBarGaugeOptions.label.font.weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxBarGaugeOptions.label.font.opacity
            * @type number
            * @default 1
            */
            opacity: 1
        }
    },
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
