/**
* @name basegauge
* @publicName BaseGauge
* @type object
* @hidden
* @inherits BaseWidget
*/
var baseGauge = {
    /**
    * @name basegauge.options
    * @publicName Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name basegaugeoptions.containerBackgroundColor
    * @publicName containerBackgroundColor
    * @type string
    * @default 'none'
    */
    containerBackgroundColor: 'none',
    /**
    * @name basegaugeoptions.title
    * @publicName title
    * @inheritdoc
    */
    title: {
        /**
        * @name basegaugeoptions.title.position
        * @publicName position
        * @type Enums.GaugeTitlePosition
        * @default 'top-center'
        * @deprecated
        */
        position: undefined
    },
    /**
    * @name basegaugeoptions.animation
    * @publicName animation
    * @type object
    */
    animation: {
        /**
        * @name basegaugeoptions.animation.enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name basegaugeoptions.animation.duration
        * @publicName duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name basegaugeoptions.animation.easing
        * @publicName easing
        * @type Enums.VizAnimationEasing
        * @default 'easeOutCubic'
        */
        easing: 'easeOutCubic'
    },
    /**
    * @name basegaugeoptions.subtitle
    * @publicName subtitle
    * @type object|string
    * @deprecated BaseWidgetOptions.title.subtitle
    */
    subtitle: {
        /**
        * @name basegaugeoptions.subtitle.text
        * @publicName text
        * @type string
        * @default undefined
        * @deprecated BaseWidgetOptions.title.subtitle.text
        */
        text: undefined,
        /**
        * @name basegaugeoptions.subtitle.font
        * @publicName font
        * @type object
        * @deprecated BaseWidgetOptions.title.subtitle.font
        */
        font: {
            /**
            * @name basegaugeoptions.subtitle.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            * @deprecated BaseWidgetOptions.title.subtitle.font.family
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name basegaugeoptions.subtitle.font.weight
            * @publicName weight
            * @type number
            * @default 200
            * @deprecated BaseWidgetOptions.title.subtitle.font.weight
            */
            weight: 200,
            /**
            * @name basegaugeoptions.subtitle.font.color
            * @publicName color
            * @type string
            * @default '#232323'
            * @deprecated BaseWidgetOptions.title.subtitle.font.color
            */
            color: '#232323',
            /**
            * @name basegaugeoptions.subtitle.font.size
            * @publicName size
            * @type number|string
            * @default 16
            * @deprecated BaseWidgetOptions.title.subtitle.font.size
            */
            size: 16,
            /**
            * @name basegaugeoptions.subtitle.font.opacity
            * @publicName opacity
            * @type number
            * @default 1
            * @deprecated BaseWidgetOptions.title.subtitle.font.opacity
            */
            opacity: 1
        }
    },
    /**
    * @name basegaugeoptions.scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name basegaugeoptions.scale.startValue
        * @publicName startValue
        * @type number
        * @default 0
        * @notUsedInTheme
        */
        startValue: 0,
        /**
        * @name basegaugeoptions.scale.endValue
        * @publicName endValue
        * @type number
        * @default 100
        * @notUsedInTheme
        */
        endValue: 100,
        /**
        * @name basegaugeoptions.scale.hideFirstTick
        * @publicName hideFirstTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideFirstTick: undefined,
        /**
        * @name basegaugeoptions.scale.hideLastTick
        * @publicName hideLastTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideLastTick: undefined,
        /**
        * @name basegaugeoptions.scale.hideFirstLabel
        * @publicName hideFirstLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideFirstLabel: undefined,
        /**
        * @name basegaugeoptions.scale.hideLastLabel
        * @publicName hideLastLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
        */
        hideLastLabel: undefined,
        /**
        * @name basegaugeoptions.scale.tickInterval
        * @publicName tickInterval
        * @type number
        * @default undefined
        */
        tickInterval: undefined,
        /**
        * @name basegaugeoptions.scale.minorTickInterval
        * @publicName minorTickInterval
        * @type number
        * @default undefined
        */
        minorTickInterval: undefined,
        /**
        * @name basegaugeoptions.scale.customTicks
        * @publicName customTicks
        * @type Array<number>
        * @default undefined
        * @notUsedInTheme
        */
        customTicks: undefined,
        /**
        * @name basegaugeoptions.scale.customMinorTicks
        * @publicName customMinorTicks
        * @type Array<number>
        * @default undefined
        * @notUsedInTheme
        */
        customMinorTicks: undefined,
        /**
        * @name basegaugeoptions.scale.tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name basegaugeoptions.scale.tick.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions.scale.tick.length
            * @publicName length
            * @type number
            * @default 5
            */
            length: 5,
            /**
            * @name basegaugeoptions.scale.tick.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name basegaugeoptions.scale.tick.opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name basegaugeoptions.scale.tick.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name basegaugeoptions.scale.majorTick
        * @publicName majorTick
        * @type object
        * @deprecated basegaugeoptions.scale.tick
        */
        majorTick: {
            /**
            * @name basegaugeoptions.scale.majorTick.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            * @deprecated basegaugeoptions.scale.tick.color
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions.scale.majorTick.length
            * @publicName length
            * @type number
            * @default 5
            * @deprecated basegaugeoptions.scale.tick.length
            */
            length: 5,
            /**
            * @name basegaugeoptions.scale.majorTick.width
            * @publicName width
            * @type number
            * @default 2
            * @deprecated basegaugeoptions.scale.tick.width
            */
            width: 2,
            /**
            * @name basegaugeoptions.scale.majorTick.customTickValues
            * @publicName customTickValues
            * @type Array<number>
            * @default []
            * @deprecated basegaugeoptions.scale.customTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name basegaugeoptions.scale.majorTick.useTicksAutoArrangement
            * @publicName useTicksAutoArrangement
            * @type boolean
            * @default true
            * @deprecated basegaugeoptions.scale.label.overlappingBehavior
            */
            useTicksAutoArrangement: true,
            /**
            * @name basegaugeoptions.scale.majorTick.tickInterval
            * @publicName tickInterval
            * @type number
            * @default undefined
            * @deprecated basegaugeoptions.scale.tickInterval
            */
            tickInterval: undefined,
            /**
            * @name basegaugeoptions.scale.majorTick.showCalculatedTicks
            * @publicName showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name basegaugeoptions.scale.majorTick.visible
            * @publicName visible
            * @type boolean
            * @default true
            * @deprecated basegaugeoptions.scale.tick.visible
            */
            visible: true
        },
        /**
        * @name basegaugeoptions.scale.minorTick
        * @publicName minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name basegaugeoptions.scale.minorTick.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions.scale.minorTick.opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name basegaugeoptions.scale.minorTick.length
            * @publicName length
            * @type number
            * @default 3
            */
            length: 3,
            /**
            * @name basegaugeoptions.scale.minorTick.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name basegaugeoptions.scale.minorTick.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name basegaugeoptions.scale.minorTick.showCalculatedTicks
            * @publicName showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name basegaugeoptions.scale.minorTick.customTickValues
            * @publicName customTickValues
            * @type Array<number>
            * @default []
            * @deprecated basegaugeoptions.scale.customMinorTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name basegaugeoptions.scale.minorTick.tickInterval
            * @publicName tickInterval
            * @type number
            * @default undefined
            * @deprecated basegaugeoptions.scale.minorTickInterval
            */
            tickInterval: undefined,
        },
        /**
        * @name basegaugeoptions.scale.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name basegaugeoptions.scale.label.useRangeColors
            * @publicName useRangeColors
            * @type boolean
            * @default false
            */
            useRangeColors: false,
            /**
            * @name basegaugeoptions.scale.label.overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @default 'hide'
            * @acceptValues 'hide' | 'none'
            */
            overlappingBehavior: {
                /**
                * @name basegaugeoptions.scale.label.overlappingBehavior.useAutoArrangement
                * @publicName useAutoArrangement
                * @type boolean
                * @default true
                * @deprecated basegaugeoptions.scale.label.overlappingBehavior
                */
                useAutoArrangement: true
            },
            /**
            * @name basegaugeoptions.scale.label.format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name basegaugeoptions.scale.label.precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 2,
            /**
            * @name basegaugeoptions.scale.label.customizeText
            * @publicName customizeText
            * @type function(scaleValue)
            * @type_function_param1 scaleValue:object
            * @type_function_param1_field1 value:Number
            * @type_function_param1_field2 valueText:string
            * @type_function_return string
            * @notUsedInTheme
            */
            customizeText: undefined,
            /**
            * @name basegaugeoptions.scale.label.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name basegaugeoptions.scale.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name basegaugeoptions.scale.label.font.color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name basegaugeoptions.scale.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name basegaugeoptions.scale.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name basegaugeoptions.scale.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name basegaugeoptions.scale.label.font.opacity
                * @publicName opacity
                * @type number
                * @default 1
                */
                opacity: 1
            }
        },
        /**
        * @name basegaugeoptions.scale.allowdecimals
        * @publicName allowDecimals
        * @type boolean
        * @default undefined
        */
        allowDecimals: undefined
    },
    /**
    * @name basegaugeoptions.rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name basegaugeoptions.rangeContainer.offset
        * @publicName offset
        * @type number
        * @default 0
        */
        offset: 0,
        /**
        * @name basegaugeoptions.rangeContainer.backgroundColor
        * @publicName backgroundColor
        * @type string
        * @default '#808080'
        */
        backgroundColor: '#808080',
        /**
        * @name basegaugeoptions.rangeContainer.palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name basegaugeoptions.rangeContainer.paletteextensionmode
        * @publicName paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend',
        /**
        * @name basegaugeoptions.rangeContainer.ranges
        * @publicName ranges
        * @type Array<Object>
        * @default []
        * @notUsedInTheme
        */
        ranges: [{
            /**
            * @name basegaugeoptions.rangeContainer.ranges.startValue
            * @publicName startValue
            * @type number
            */
            startValue: 0,
            /**
            * @name basegaugeoptions.rangeContainer.ranges.endValue
            * @publicName endValue
            * @type number
            */
            endValue: 20,
            /**
            * @name basegaugeoptions.rangeContainer.ranges.color
            * @publicName color
            * @type string
            */
            color: '#A6C567'
        }]
    },
    /**
    * @name basegaugeoptions.tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name basegaugeoptions.tooltip.customizetooltip
        * @publicName customizeTooltip
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
    * @name basegaugeoptions.ontooltipshown
    * @publicName onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name basegaugeoptions.ontooltiphidden
    * @publicName onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name basegaugeoptions.value
    * @publicName value
    * @type number
    * @default undefined
    * @notUsedInTheme
    */
    value: undefined,
    /**
    * @name basegaugeoptions.subvalues
    * @publicName subvalues
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
    */
    subvalues: undefined,
    /**
    * @name basegaugemethods.value
    * @publicName value()
    * @return number
    */
    value: function() { },
    /**
    * @name basegaugemethods.value
    * @publicName value(value)
    * @param1 value:number
    */
    value: function() { },
    /**
    * @name basegaugemethods.subvalues
    * @publicName subvalues()
    * @return Array<number>
    */
    subvalues: function() { },
    /**
    * @name basegaugemethods.subvalues
    * @publicName subvalues(subvalues)
    * @param1 subvalues:Array<number>
    */
    subvalues: function() { }
};

/**
* @name dxcirculargauge
* @publicName dxCircularGauge
* @inherits BaseGauge
* @module viz/circular_gauge
* @export default
*/
var dxCircularGauge = {
    /**
    * @name dxcirculargauge.options
    * @publicName Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name dxcirculargaugeoptions.geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxcirculargaugeoptions.geometry.startAngle
        * @publicName startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxcirculargaugeoptions.geometry.endAngle
        * @publicName endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxcirculargaugeoptions.scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxcirculargaugeoptions.scale.orientation
        * @publicName orientation
        * @type Enums.CircularGaugeElementOrientation
        * @default 'outside'
        */
        orientation: 'outside',
        /**
        * @name dxcirculargaugeoptions.scale.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxcirculargaugeoptions.scale.label.indentFromTick
            * @publicName indentFromTick
            * @type number
            * @default 10
            */
            indentFromTick: 10,
            /**
            * @name dxcirculargaugeoptions.scale.label.hideFirstOrLast
            * @publicName hideFirstOrLast
            * @type Enums.GaugeOverlappingBehavior
            * @default 'last'
            */
            hideFirstOrLast: "last",
            /**
            * @name dxcirculargaugeoptions.scale.label.overlappingBehavior
            * @publicName overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior|object
            * @inheritdoc
            */
            overlappingBehavior: {
                /**
                * @name dxcirculargaugeoptions.scale.label.overlappingBehavior.hideFirstOrLast
                * @publicName hideFirstOrLast
                * @type Enums.GaugeOverlappingBehavior
                * @default "last"
                * @deprecated dxcirculargaugeoptions.scale.label.hideFirstOrLast
                */
                hideFirstOrLast: "last"
            }
        }
    },
    /**
    * @name dxcirculargaugeoptions.rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxcirculargaugeoptions.rangeContainer.width
        * @publicName width
        * @type number
        * @default 5
        */
        width: 5,
        /**
        * @name dxcirculargaugeoptions.rangeContainer.orientation
        * @publicName orientation
        * @type Enums.CircularGaugeElementOrientation
        * @default 'outside'
        */
        orientation: 'outside'
    },
    /**
    * @name dxcirculargaugeoptions.valueIndicator
    * @publicName valueIndicator
    * @inherits CommonIndicator
    * @type object
    * @inheritAll
    */
    valueIndicator: {
        /**
        * @name dxcirculargaugeoptions.valueIndicator.type
        * @publicName type
        * @type string
        * @default 'rectangleNeedle'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rectangleNeedle'
    },
    /**
    * @name dxcirculargaugeoptions.subvalueIndicator
    * @publicName subvalueIndicator
    * @inherits CommonIndicator
    * @type object
    * @inheritAll
    */
    subvalueIndicator: {
        /**
        * @name dxcirculargaugeoptions.subvalueIndicator.type
        * @publicName type
        * @type string
        * @default 'triangleMarker'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'triangleMarker'
    }
};

/**
* @name dxlineargauge
* @publicName dxLinearGauge
* @inherits BaseGauge
* @module viz/linear_gauge
* @export default
*/
var dxLinearGauge = {
    /**
    * @name dxlineargauge.options
    * @publicName Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name dxlineargaugeoptions.geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxlineargaugeoptions.geometry.orientation
        * @publicName orientation
        * @type Enums.Orientation
        * @default 'horizontal'
        */
        orientation: 'horizontal'
    },
    /**
    * @name dxlineargaugeoptions.scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxlineargaugeoptions.scale.verticalOrientation
        * @publicName verticalOrientation
        * @type Enums.VerticalAlignment
        * @default 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxlineargaugeoptions.scale.horizontalOrientation
        * @publicName horizontalOrientation
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalOrientation: 'right',
        /**
        * @name dxlineargaugeoptions.scale.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxlineargaugeoptions.scale.label.indentFromTick
            * @publicName indentFromTick
            * @type number
            * @default -10
            */
            indentFromTick: -10,
            /**
            * @name dxlineargaugeoptions.scale.label.overlappingBehavior
            * @publicName overlappingBehavior
            * @type Enums.ScaleLabelOverlappingBehavior|object
            * @inheritdoc
            */
            overlappingBehavior: {
                /**
                * @name dxlineargaugeoptions.scale.label.overlappingBehavior.hideFirstOrLast
                * @publicName hideFirstOrLast
                * @type Enums.GaugeOverlappingBehavior
                * @default "last"
                * @deprecated
                */
                hideFirstOrLast: "last"
            }
        }
    },
    /**
    * @name dxlineargaugeoptions.rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxlineargaugeoptions.rangeContainer.width
        * @publicName width
        * @type object|number
        */
        width: {
            /**
            * @name dxlineargaugeoptions.rangeContainer.width.start
            * @publicName start
            * @type number
            * @default 5
            */
            start: 5,

            /**
            * @name dxlineargaugeoptions.rangeContainer.width.end
            * @publicName end
            * @type number
            * @default 5
            */
            end: 5
        },
        /**
        * @name dxlineargaugeoptions.rangeContainer.verticalOrientation
        * @publicName verticalOrientation
        * @type Enums.VerticalAlignment
        * @default 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxlineargaugeoptions.rangeContainer.horizontalOrientation
        * @publicName horizontalOrientation
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalOrientation: 'right'
    },
    /**
    * @name dxlineargaugeoptions.valueIndicator
    * @publicName valueIndicator
    * @inherits CommonIndicator
    * @type object
    * @inheritAll
    */
    valueIndicator: {
        /**
        * @name dxlineargaugeoptions.valueIndicator.type
        * @publicName type
        * @type string
        * @default 'rangeBar'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rangeBar'
    },
    /**
    * @name dxlineargaugeoptions.subvalueIndicator
    * @publicName subvalueIndicator
    * @inherits CommonIndicator
    * @type object
    * @inheritAll
    */
    subvalueIndicator: {
        /**
        * @name dxlineargaugeoptions.subvalueIndicator.type
        * @publicName type
        * @type string
        * @default 'triangleMarker'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'triangleMarker'
    }
};

/**
* @name dxbargauge
* @publicName dxBarGauge
* @inherits BaseWidget
* @module viz/bar_gauge
* @export default
*/
var dxBarGauge = {
    /**
    * @name dxbargauge.options
    * @publicName Options
    * @namespace DevExpress.viz.gauges
    * @hidden
    */
    /**
    * @name dxbargaugeoptions.animation
    * @publicName animation
    * @type object
    * @inherits basegaugeoptions.animation
    */
    animation: {},
    /**
    * @name dxbargaugeoptions.title
    * @publicName title
    * @inheritdoc
    */
    title: {
        /**
        * @name dxbargaugeoptions.title.position
        * @publicName position
        * @type Enums.GaugeTitlePosition
        * @default 'top-center'
        * @deprecated
        */
        position: undefined
    },
    /**
    * @name dxbargaugeoptions.subtitle
    * @publicName subtitle
    * @type object|string
    * @inherits basegaugeoptions.subtitle
    * @deprecated BaseWidgetOptions.title.subtitle
    */
    subtitle: {},
    /**
    * @name dxbargaugeoptions.tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxbargaugeoptions.tooltip.customizetooltip
        * @publicName customizeTooltip
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
    * @name dxbargaugeoptions.geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxbargaugeoptions.geometry.startAngle
        * @publicName startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxbargaugeoptions.geometry.endAngle
        * @publicName endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxbargaugeoptions.palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: 'Default',
    /**
    * @name dxbargaugeoptions.paletteextensionmode
    * @publicName paletteExtensionMode
    * @default 'blend'
    * @type Enums.VizPaletteExtensionMode
    */
    paletteExtensionMode: 'blend',
    /**
    * @name dxbargaugeoptions.backgroundColor
    * @publicName backgroundColor
    * @type string
    * @default '#e0e0e0'
    */
    backgroundColor: '#e0e0e0',
    /**
    * @name dxbargaugeoptions.barSpacing
    * @publicName barSpacing
    * @type number
    * @default 4
    */
    barSpacing: 4,
    /**
    * @name dxbargaugeoptions.relativeInnerRadius
    * @publicName relativeInnerRadius
    * @type number
    * @default 0.3
    */
    relativeInnerRadius: 0.3,
    /**
    * @name dxbargaugeoptions.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxbargaugeoptions.label.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxbargaugeoptions.label.indent
        * @publicName indent
        * @type number
        * @default 20
        */
        indent: 20,
        /**
        * @name dxbargaugeoptions.label.connectorWidth
        * @publicName connectorWidth
        * @type number
        * @default 2
        */
        connectorWidth: 2,
        /**
        * @name dxbargaugeoptions.label.connectorColor
        * @publicName connectorColor
        * @type string
        * @default undefined
        */
        connectorColor: undefined,
        /**
        * @name dxbargaugeoptions.label.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxbargaugeoptions.label.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name dxbargaugeoptions.label.customizeText
        * @publicName customizeText
        * @type function(barValue)
        * @type_function_param1 barValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxbargaugeoptions.label.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxbargaugeoptions.label.font.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxbargaugeoptions.label.font.size
            * @publicName size
            * @type number|string
            * @default 16
            */
            size: 16,
            /**
            * @name dxbargaugeoptions.label.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxbargaugeoptions.label.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxbargaugeoptions.label.font.opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1
        }
    },
    /**
    * @name dxbargaugeoptions.startValue
    * @publicName startValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startValue: 0,
    /**
    * @name dxbargaugeoptions.endValue
    * @publicName endValue
    * @type number
    * @default 100
    * @notUsedInTheme
    */
    endValue: 100,
    /**
    * @name dxbargaugeoptions.baseValue
    * @publicName baseValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    baseValue: 0,
    /**
    * @name dxbargaugeoptions.values
    * @publicName values
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
    * @name dxbargaugeoptions.ontooltipshown
    * @publicName onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxbargaugeoptions.ontooltiphidden
    * @publicName onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};
