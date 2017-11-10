/**
* @name basegauge
* @publicName BaseGauge
* @type object
* @hidden
* @inherits BaseWidget
*/
var baseGauge = {
    /**
    * @name basegaugeoptions_containerBackgroundColor
    * @publicName containerBackgroundColor
    * @type string
    * @default 'none'
    */
    containerBackgroundColor: 'none',
    /**
    * @name basegaugeoptions_title
    * @publicName title
    * @extend_doc
    */
    title: {
        /**
        * @name basegaugeoptions_title_position
        * @publicName position
        * @type string
        * @default 'top-center'
        * @acceptValues 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
        * @deprecated BaseWidgetOptions_title_horizontalalignment
        */
        position: undefined
    },
    /**
    * @name basegaugeoptions_animation
    * @publicName animation
    * @type object
    */
    animation: {
        /**
        * @name basegaugeoptions_animation_enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name basegaugeoptions_animation_duration
        * @publicName duration
        * @type number
        * @default 1000
        */
        duration: 1000,
        /**
        * @name basegaugeoptions_animation_easing
        * @publicName easing
        * @type string
        * @default 'easeOutCubic'
        * @acceptValues 'easeOutCubic' | 'linear'
        */
        easing: 'easeOutCubic'
    },
    /**
    * @name basegaugeoptions_subtitle
    * @publicName subtitle
    * @type object|string
    * @deprecated BaseWidgetOptions_title_subtitle
    */
    subtitle: {
        /**
        * @name basegaugeoptions_subtitle_text
        * @publicName text
        * @type string
        * @default undefined
        * @deprecated BaseWidgetOptions_title_subtitle_text
        */
        text: undefined,
        /**
        * @name basegaugeoptions_subtitle_font
        * @publicName font
        * @type object
        * @deprecated BaseWidgetOptions_title_subtitle_font
        */
        font: {
            /**
            * @name basegaugeoptions_subtitle_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            * @deprecated BaseWidgetOptions_title_subtitle_font_family
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name basegaugeoptions_subtitle_font_weight
            * @publicName weight
            * @type number
            * @default 200
            * @deprecated BaseWidgetOptions_title_subtitle_font_weight
            */
            weight: 200,
            /**
            * @name basegaugeoptions_subtitle_font_color
            * @publicName color
            * @type string
            * @default '#232323'
            * @deprecated BaseWidgetOptions_title_subtitle_font_color
            */
            color: '#232323',
            /**
            * @name basegaugeoptions_subtitle_font_size
            * @publicName size
            * @type number|string
            * @default 16
            * @deprecated BaseWidgetOptions_title_subtitle_font_size
            */
            size: 16,
            /**
            * @name basegaugeoptions_subtitle_font_opacity
            * @publicName opacity
            * @type number
            * @default 1
            * @deprecated BaseWidgetOptions_title_subtitle_font_opacity
            */
            opacity: 1
        }
    },
    /**
    * @name basegaugeoptions_scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name basegaugeoptions_scale_startValue
        * @publicName startValue
        * @type number
        * @default 0
        * @notUsedInTheme
        */
        startValue: 0,
        /**
        * @name basegaugeoptions_scale_endValue
        * @publicName endValue
        * @type number
        * @default 100
        * @notUsedInTheme
        */
        endValue: 100,
        /**
        * @name basegaugeoptions_scale_hideFirstTick
        * @publicName hideFirstTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions_scale_label_hideFirstOrLast
        */
        hideFirstTick: undefined,
        /**
        * @name basegaugeoptions_scale_hideLastTick
        * @publicName hideLastTick
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions_scale_label_hideFirstOrLast
        */
        hideLastTick: undefined,
        /**
        * @name basegaugeoptions_scale_hideFirstLabel
        * @publicName hideFirstLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions_scale_label_hideFirstOrLast
        */
        hideFirstLabel: undefined,
        /**
        * @name basegaugeoptions_scale_hideLastLabel
        * @publicName hideLastLabel
        * @type boolean
        * @default false
        * @deprecated dxcirculargaugeoptions_scale_label_hideFirstOrLast
        */
        hideLastLabel: undefined,
        /**
        * @name basegaugeoptions_scale_tickInterval
        * @publicName tickInterval
        * @type number
        * @default undefined
        */
        tickInterval: undefined,
        /**
        * @name basegaugeoptions_scale_minorTickInterval
        * @publicName minorTickInterval
        * @type number
        * @default undefined
        */
        minorTickInterval: undefined,
        /**
        * @name basegaugeoptions_scale_customTicks
        * @publicName customTicks
        * @type array
        * @default undefined
        * @notUsedInTheme
        */
        customTicks: undefined,
        /**
        * @name basegaugeoptions_scale_customMinorTicks
        * @publicName customMinorTicks
        * @type array
        * @default undefined
        * @notUsedInTheme
        */
        customMinorTicks: undefined,
        /**
        * @name basegaugeoptions_scale_tick
        * @publicName tick
        * @type object
        */
        tick: {
            /**
            * @name basegaugeoptions_scale_tick_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions_scale_tick_length
            * @publicName length
            * @type number
            * @default 5
            */
            length: 5,
            /**
            * @name basegaugeoptions_scale_tick_width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name basegaugeoptions_scale_tick_opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name basegaugeoptions_scale_tick_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name basegaugeoptions_scale_majorTick
        * @publicName majorTick
        * @type object
        * @deprecated basegaugeoptions_scale_tick
        */
        majorTick: {
            /**
            * @name basegaugeoptions_scale_majorTick_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            * @deprecated basegaugeoptions_scale_tick_color
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions_scale_majorTick_length
            * @publicName length
            * @type number
            * @default 5
            * @deprecated basegaugeoptions_scale_tick_length
            */
            length: 5,
            /**
            * @name basegaugeoptions_scale_majorTick_width
            * @publicName width
            * @type number
            * @default 2
            * @deprecated basegaugeoptions_scale_tick_width
            */
            width: 2,
            /**
            * @name basegaugeoptions_scale_majorTick_customTickValues
            * @publicName customTickValues
            * @type array
            * @default []
            * @deprecated basegaugeoptions_scale_customTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name basegaugeoptions_scale_majorTick_useTicksAutoArrangement
            * @publicName useTicksAutoArrangement
            * @type boolean
            * @default true
            * @deprecated basegaugeoptions_scale_label_overlappingBehavior
            */
            useTicksAutoArrangement: true,
            /**
            * @name basegaugeoptions_scale_majorTick_tickInterval
            * @publicName tickInterval
            * @type number
            * @default undefined
            * @deprecated basegaugeoptions_scale_tickInterval
            */
            tickInterval: undefined,
            /**
            * @name basegaugeoptions_scale_majorTick_showCalculatedTicks
            * @publicName showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name basegaugeoptions_scale_majorTick_visible
            * @publicName visible
            * @type boolean
            * @default true
            * @deprecated basegaugeoptions_scale_tick_visible
            */
            visible: true
        },
        /**
        * @name basegaugeoptions_scale_minorTick
        * @publicName minorTick
        * @type object
        */
        minorTick: {
            /**
            * @name basegaugeoptions_scale_minorTick_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name basegaugeoptions_scale_minorTick_opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1,
            /**
            * @name basegaugeoptions_scale_minorTick_length
            * @publicName length
            * @type number
            * @default 3
            */
            length: 3,
            /**
            * @name basegaugeoptions_scale_minorTick_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name basegaugeoptions_scale_minorTick_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name basegaugeoptions_scale_minorTick_showCalculatedTicks
            * @publicName showCalculatedTicks
            * @type boolean
            * @default true
            * @deprecated
            */
            showCalculatedTicks: true,
            /**
            * @name basegaugeoptions_scale_minorTick_customTickValues
            * @publicName customTickValues
            * @type array
            * @default []
            * @deprecated basegaugeoptions_scale_customMinorTicks
            * @notUsedInTheme
            */
            customTickValues: [],
            /**
            * @name basegaugeoptions_scale_minorTick_tickInterval
            * @publicName tickInterval
            * @type number
            * @default undefined
            * @deprecated basegaugeoptions_scale_minorTickInterval
            */
            tickInterval: undefined,
        },
        /**
        * @name basegaugeoptions_scale_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name basegaugeoptions_scale_label_useRangeColors
            * @publicName useRangeColors
            * @type boolean
            * @default false
            */
            useRangeColors: false,
            /**
            * @name basegaugeoptions_scale_label_overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @default 'hide'
            * @acceptValues 'hide' | 'none'
            */
            overlappingBehavior: {
                /**
                * @name basegaugeoptions_scale_label_overlappingBehavior_useAutoArrangement
                * @publicName useAutoArrangement
                * @type boolean
                * @default true
                * @deprecated basegaugeoptions_scale_label_overlappingBehavior
                */
                useAutoArrangement: true
            },
            /**
            * @name basegaugeoptions_scale_label_format
            * @publicName format
            * @extends CommonVizFormat
            */
            format: '',
            /**
            * @name basegaugeoptions_scale_label_precision
            * @publicName precision
            * @extends CommonVizPrecision
            */
            precision: 2,
            /**
            * @name basegaugeoptions_scale_label_customizeText
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
            * @name basegaugeoptions_scale_label_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name basegaugeoptions_scale_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name basegaugeoptions_scale_label_font_color
                * @publicName color
                * @type string
                * @default '#767676'
                */
                color: '#767676',
                /**
                * @name basegaugeoptions_scale_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name basegaugeoptions_scale_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name basegaugeoptions_scale_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name basegaugeoptions_scale_label_font_opacity
                * @publicName opacity
                * @type number
                * @default 1
                */
                opacity: 1
            }
        }
    },
    /**
    * @name basegaugeoptions_rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name basegaugeoptions_rangeContainer_offset
        * @publicName offset
        * @type number
        * @default 0
        */
        offset: 0,
        /**
        * @name basegaugeoptions_rangeContainer_backgroundColor
        * @publicName backgroundColor
        * @type string
        * @default '#808080'
        */
        backgroundColor: '#808080',
        /**
        * @name basegaugeoptions_rangeContainer_palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name basegaugeoptions_rangeContainer_ranges
        * @publicName ranges
        * @type array
        * @default []
        * @notUsedInTheme
        */
        ranges: [{
            /**
            * @name basegaugeoptions_rangeContainer_ranges_startValue
            * @publicName startValue
            * @type number
            */
            startValue: 0,
            /**
            * @name basegaugeoptions_rangeContainer_ranges_endValue
            * @publicName endValue
            * @type number
            */
            endValue: 20,
            /**
            * @name basegaugeoptions_rangeContainer_ranges_color
            * @publicName color
            * @type string
            */
            color: '#A6C567'
        }]
    },
    /**
    * @name basegaugeoptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name basegaugeoptions_tooltip_customizetooltip
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
    * @name basegaugeoptions_ontooltipshown
    * @publicName onTooltipShown
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name basegaugeoptions_ontooltiphidden
    * @publicName onTooltipHidden
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name basegaugeoptions_value
    * @publicName value
    * @type number
    * @default undefined
    * @notUsedInTheme
    */
    value: undefined,
    /**
    * @name basegaugeoptions_subvalues
    * @publicName subvalues
    * @type array
    * @default undefined
    * @notUsedInTheme
    */
    subvalues: undefined,
    /**
    * @name basegaugemethods_value
    * @publicName value()
    * @return number
    */
    value: function() { },
    /**
    * @name basegaugemethods_value
    * @publicName value(value)
    * @param1 value:number
    */
    value: function() { },
    /**
    * @name basegaugemethods_subvalues
    * @publicName subvalues()
    * @return array
    */
    subvalues: function() { },
    /**
    * @name basegaugemethods_subvalues
    * @publicName subvalues(subvalues)
    * @param1 subvalues:array
    */
    subvalues: function() { }
};

/**
* @name dxcirculargauge
* @publicName dxCircularGauge
* @inherits BaseGauge
* @groupName Data Management and Visualization
* @module viz/circular_gauge
* @export default
*/
var dxCircularGauge = {
    /**
    * @name dxcirculargaugeoptions_geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxcirculargaugeoptions_geometry_startAngle
        * @publicName startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxcirculargaugeoptions_geometry_endAngle
        * @publicName endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxcirculargaugeoptions_scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxcirculargaugeoptions_scale_orientation
        * @publicName orientation
        * @type string
        * @default 'outside'
        * @acceptValues 'outside' | 'center' | 'inside'
        */
        orientation: 'outside',
        /**
        * @name dxcirculargaugeoptions_scale_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxcirculargaugeoptions_scale_label_indentFromTick
            * @publicName indentFromTick
            * @type number
            * @default 10
            */
            indentFromTick: 10,
            /**
            * @name dxcirculargaugeoptions_scale_label_hideFirstOrLast
            * @publicName hideFirstOrLast
            * @type string
            * @default 'last'
            * @acceptValues 'last' | 'first'
            */
            hideFirstOrLast: "last",
            /**
            * @name dxcirculargaugeoptions_scale_label_overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @extend_doc
            */
            overlappingBehavior: {
                /**
                * @name dxcirculargaugeoptions_scale_label_overlappingBehavior_hideFirstOrLast
                * @publicName hideFirstOrLast
                * @type string
                * @default "last"
                * @acceptValues 'last' | 'first'
                * @deprecated dxcirculargaugeoptions_scale_label_hideFirstOrLast
                */
                hideFirstOrLast: "last"
            }
        }
    },
    /**
    * @name dxcirculargaugeoptions_rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxcirculargaugeoptions_rangeContainer_width
        * @publicName width
        * @type number
        * @default 5
        */
        width: 5,
        /**
        * @name dxcirculargaugeoptions_rangeContainer_orientation
        * @publicName orientation
        * @type string
        * @default 'outside'
        * @acceptValues 'outside' | 'center' | 'inside'
        */
        orientation: 'outside'
    },
    /**
    * @name dxcirculargaugeoptions_valueIndicator
    * @publicName valueIndicator
    * @type object
    */
    valueIndicator: {
        /**
        * @name dxcirculargaugeoptions_valueIndicator_type
        * @publicName type
        * @type string
        * @default 'rectangleNeedle'
        * @acceptValues 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rectangleNeedle'
    },
    /**
    * @name dxcirculargaugeoptions_subvalueIndicator
    * @publicName subvalueIndicator
    * @type object
    */
    subvalueIndicator: {
        /**
        * @name dxcirculargaugeoptions_subvalueIndicator_type
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
* @groupName Data Management and Visualization
* @module viz/linear_gauge
* @export default
*/
var dxLinearGauge = {
    /**
    * @name dxlineargaugeoptions_geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxlineargaugeoptions_geometry_orientation
        * @publicName orientation
        * @type string
        * @default 'horizontal'
        * @acceptValues 'horizontal' | 'vertical'
        */
        orientation: 'horizontal'
    },
    /**
    * @name dxlineargaugeoptions_scale
    * @publicName scale
    * @type object
    */
    scale: {
        /**
        * @name dxlineargaugeoptions_scale_verticalOrientation
        * @publicName verticalOrientation
        * @type string
        * @default 'bottom'
        * @acceptValues 'top' | 'center' | 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxlineargaugeoptions_scale_horizontalOrientation
        * @publicName horizontalOrientation
        * @type string
        * @default 'right'
        * @acceptValues 'left' | 'center' | 'right'
        */
        horizontalOrientation: 'right',
        /**
        * @name dxlineargaugeoptions_scale_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxlineargaugeoptions_scale_label_indentFromTick
            * @publicName indentFromTick
            * @type number
            * @default -10
            */
            indentFromTick: -10,
            /**
            * @name dxlineargaugeoptions_scale_label_overlappingBehavior
            * @publicName overlappingBehavior
            * @type string|object
            * @extend_doc
            */
            overlappingBehavior: {
                /**
                * @name dxlineargaugeoptions_scale_label_overlappingBehavior_hideFirstOrLast
                * @publicName hideFirstOrLast
                * @type string
                * @default "last"
                * @acceptValues 'last' | 'first'
                * @deprecated
                */
                hideFirstOrLast: "last"
            }
        }
    },
    /**
    * @name dxlineargaugeoptions_rangeContainer
    * @publicName rangeContainer
    * @type object
    */
    rangeContainer: {
        /**
        * @name dxlineargaugeoptions_rangeContainer_width
        * @publicName width
        * @type object|number
        */
        width: {
            /**
            * @name dxlineargaugeoptions_rangeContainer_width_start
            * @publicName start
            * @type number
            * @default 5
            */
            start: 5,

            /**
            * @name dxlineargaugeoptions_rangeContainer_width_end
            * @publicName end
            * @type number
            * @default 5
            */
            end: 5
        },
        /**
        * @name dxlineargaugeoptions_rangeContainer_verticalOrientation
        * @publicName verticalOrientation
        * @type string
        * @default 'bottom'
        * @acceptValues 'top' | 'center' | 'bottom'
        */
        verticalOrientation: 'bottom',
        /**
        * @name dxlineargaugeoptions_rangeContainer_horizontalOrientation
        * @publicName horizontalOrientation
        * @type string
        * @default 'right'
        * @acceptValues 'left' | 'center' | 'right'
        */
        horizontalOrientation: 'right'
    },
    /**
    * @name dxlineargaugeoptions_valueIndicator
    * @publicName valueIndicator
    * @type object
    */
    valueIndicator: {
        /**
        * @name dxlineargaugeoptions_valueIndicator_type
        * @publicName type
        * @type string
        * @default 'rangeBar'
        * @acceptValues 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud'
        */
        type: 'rangeBar'
    },
    /**
    * @name dxlineargaugeoptions_subvalueIndicator
    * @publicName subvalueIndicator
    * @type object
    */
    subvalueIndicator: {
        /**
        * @name dxlineargaugeoptions_subvalueIndicator_type
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
* @groupName Data Management and Visualization
* @module viz/bar_gauge
* @export default
*/
var dxBarGauge = {
    /**
    * @name dxbargaugeoptions_animation
    * @publicName animation
    * @type object
    * @inherits basegaugeoptions_animation
    */
    animation: {},
    /**
    * @name dxbargaugeoptions_title
    * @publicName title
    * @extend_doc
    */
    title: {
        /**
        * @name dxbargaugeoptions_title_position
        * @publicName position
        * @type string
        * @default 'top-center'
        * @acceptValues 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
        * @deprecated BaseWidgetOptions_title_horizontalalignment
        */
        position: undefined
    },
    /**
    * @name dxbargaugeoptions_subtitle
    * @publicName subtitle
    * @type object|string
    * @inherits basegaugeoptions_subtitle
    * @deprecated BaseWidgetOptions_title_subtitle
    */
    subtitle: {},
    /**
    * @name dxbargaugeoptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxbargaugeoptions_tooltip_customizetooltip
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
    * @name dxbargaugeoptions_geometry
    * @publicName geometry
    * @type object
    */
    geometry: {
        /**
        * @name dxbargaugeoptions_geometry_startAngle
        * @publicName startAngle
        * @type number
        * @default 225
        */
        startAngle: 225,
        /**
        * @name dxbargaugeoptions_geometry_endAngle
        * @publicName endAngle
        * @type number
        * @default 315
        */
        endAngle: 315
    },
    /**
    * @name dxbargaugeoptions_palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: 'Default',
    /**
    * @name dxbargaugeoptions_backgroundColor
    * @publicName backgroundColor
    * @type string
    * @default '#e0e0e0'
    */
    backgroundColor: '#e0e0e0',
    /**
    * @name dxbargaugeoptions_barSpacing
    * @publicName barSpacing
    * @type number
    * @default 4
    */
    barSpacing: 4,
    /**
    * @name dxbargaugeoptions_relativeInnerRadius
    * @publicName relativeInnerRadius
    * @type number
    * @default 0.3
    */
    relativeInnerRadius: 0.3,
    /**
    * @name dxbargaugeoptions_label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxbargaugeoptions_label_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxbargaugeoptions_label_indent
        * @publicName indent
        * @type number
        * @default 20
        */
        indent: 20,
        /**
        * @name dxbargaugeoptions_label_connectorWidth
        * @publicName connectorWidth
        * @type number
        * @default 2
        */
        connectorWidth: 2,
        /**
        * @name dxbargaugeoptions_label_connectorColor
        * @publicName connectorColor
        * @type string
        * @default undefined
        */
        connectorColor: undefined,
        /**
        * @name dxbargaugeoptions_label_format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name dxbargaugeoptions_label_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name dxbargaugeoptions_label_customizeText
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
        * @name dxbargaugeoptions_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxbargaugeoptions_label_font_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxbargaugeoptions_label_font_size
            * @publicName size
            * @type number|string
            * @default 16
            */
            size: 16,
            /**
            * @name dxbargaugeoptions_label_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxbargaugeoptions_label_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxbargaugeoptions_label_font_opacity
            * @publicName opacity
            * @type number
            * @default 1
            */
            opacity: 1
        }
    },
    /**
    * @name dxbargaugeoptions_startValue
    * @publicName startValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startValue: 0,
    /**
    * @name dxbargaugeoptions_endValue
    * @publicName endValue
    * @type number
    * @default 100
    * @notUsedInTheme
    */
    endValue: 100,
    /**
    * @name dxbargaugeoptions_baseValue
    * @publicName baseValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    baseValue: 0,
    /**
    * @name dxbargaugeoptions_values
    * @publicName values
    * @type array
    * @default []
    * @notUsedInTheme
    */
    values: [],
    /**
    * @name dxbargaugemethods_values
    * @publicName values()
    * @return array
    */
    values: function() { },
    /**
    * @name dxbargaugemethods_values
    * @publicName values(newValues)
    * @param1 values:array
    */
    values: function() { },
    /**
    * @name dxbargaugeoptions_ontooltipshown
    * @publicName onTooltipShown
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxbargaugeoptions_ontooltiphidden
    * @publicName onTooltipHidden
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};
