
var BaseGauge = {
    containerBackgroundColor: 'none',

    loadingIndicator: {
        /**
        * @name BaseGaugeOptions.loadingIndicator.enabled
        * @type boolean
        * @hidden
        */
        enabled: false
    },
    animation: {
        enabled: true,
        duration: 1000,
        easing: 'easeOutCubic'
    },
    scale: {
        scaleDivisionFactor: 17,
        startValue: 0,
        endValue: 100,
        tickInterval: undefined,
        minorTickInterval: undefined,
        customTicks: undefined,
        customMinorTicks: undefined,
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
        label: {
            useRangeColors: false,
            overlappingBehavior: "hide",
            format: '',
            customizeText: undefined,
            visible: true,
            font: {
                color: '#767676',
                size: 12,
                family: undefined,
                weight: 400,
                opacity: 1
            }
        },
        allowDecimals: undefined
    },
    rangeContainer: {
        offset: 0,
        backgroundColor: '#808080',
        palette: 'default',
        paletteExtensionMode: 'blend',
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
    tooltip: {
        customizeTooltip: undefined,
        contentTemplate: undefined
    },
    onTooltipShown: function() { },
    onTooltipHidden: function() { },
    value: undefined,
    subvalues: undefined,
    value: function() { },
    value: function() { },
    subvalues: function() { },
    subvalues: function() { }
};

var dxCircularGauge = {
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
    scale: {
        orientation: 'outside',
        label: {
            indentFromTick: 10,
            hideFirstOrLast: "last"
        }
    },
    rangeContainer: {
        width: 5,
        orientation: 'outside'
    },
    valueIndicator: {
        /**
        * @name dxCircularGaugeOptions.valueIndicator.type
        * @type string
        * @default 'rectangleNeedle'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rectangleNeedle'
    },
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

var dxLinearGauge = {
    geometry: {
        /**
        * @name dxLinearGaugeOptions.geometry.orientation
        * @type Enums.Orientation
        * @default 'horizontal'
        */
        orientation: 'horizontal'
    },
    scale: {
        scaleDivisionFactor: 25,
        verticalOrientation: 'bottom',
        horizontalOrientation: 'right',
        label: {
            indentFromTick: -10
        }
    },
    rangeContainer: {
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
        verticalOrientation: 'bottom',
        horizontalOrientation: 'right'
    },
    valueIndicator: {
        /**
        * @name dxLinearGaugeOptions.valueIndicator.type
        * @type string
        * @default 'rangeBar'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rangeBar'
    },
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

var dxBarGauge = {
    animation: {},
    tooltip: {
        customizeTooltip: undefined,
        contentTemplate: undefined
    },
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
    palette: 'Default',
    paletteExtensionMode: 'blend',
    backgroundColor: '#e0e0e0',
    loadingIndicator: {
        /**
        * @name dxBarGaugeOptions.loadingIndicator.enabled
        * @hidden
        */
        enabled: false
    },
    barSpacing: 4,
    relativeInnerRadius: 0.3,
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
    legend: {
        itemTextFormat: undefined,
        visible: false,
        customizeText: undefined,
        customizeHint: undefined,
        customizeItems: undefined,
        markerTemplate: undefined
    },
    resolveLabelOverlapping: "hide",
    startValue: 0,
    endValue: 100,
    baseValue: 0,
    values: [],
    values: function() { },
    values: function() { },
    onTooltipShown: function() { },
    onTooltipHidden: function() { }
};

/**
* @name BarGaugeBarInfo
* @type object
*/
var BarGaugeBarInfo = {
    color: "",
    index: 0,
    value: 0
};

/**
* @name BarGaugeLegendItem
* @type object
* @inherits BaseLegendItem
*/
var legendItem = {
    item: undefined
};
