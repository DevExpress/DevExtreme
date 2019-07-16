/**
 * @name GaugeIndicator
 * @inherits CommonIndicator
 * @hidden
 */
/**
 * @name GaugeIndicator.type
 * @type string
 * @acceptValues 'circle'|'rangeBar'|'rectangle'|'rectangleNeedle'|'rhombus'|'textCloud'|'triangleMarker'|'triangleNeedle'|'twoColorNeedle'
 */

/**
* @name CommonIndicator
* @section CommonIndicators
* @type object
* @hidden
*/
var CommonIndicator = {
    /**
    * @name CommonIndicator.color
    * @type string
    */
    color: undefined,
    /**
    * @name CommonIndicator.baseValue
    * @type number
    * @default undefined
    * @notUsedInTheme
    * @propertyOf circularRangeBar,linearRangeBar
    */
    baseValue: undefined,
    /**
    * @name CommonIndicator.size
    * @type number
    * @default 10
    * @propertyOf circularRangeBar,linearRangeBar
    */
    size: 10,
    /**
    * @name CommonIndicator.backgroundColor
    * @type string
    * @default 'none'
    * @propertyOf circularRangeBar,linearRangeBar
    */
    backgroundColor: 'none',
    /**
    * @name CommonIndicator.text
    * @type object
    * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
    */
    text: {
        /**
        * @name CommonIndicator.text.indent
        * @type number
        * @default 0
        * @propertyOf circularRangeBar,linearRangeBar
        */
        indent: 0,
        /**
        * @name CommonIndicator.text.format
        * @extends CommonVizFormat
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        format: undefined,
        /**
        * @name CommonIndicator.text.customizeText
        * @type function(indicatedValue)
        * @type_function_param1 indicatedValue:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_return string
        * @notUsedInTheme
        * @default undefined
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        customizeText: undefined,
        /**
        * @name CommonIndicator.text.font
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        * @type Font
        * @default 14 @prop size
        */
        font: {
            color: null,
            size: 14,
            family: undefined,
            weight: 400,
            opacity: 1
        }
    },
    /**
    * @name CommonIndicator.length
    * @type number
    * @default 15
    * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
    */
    length: 15,
    /**
    * @name CommonIndicator.width
    * @type number
    * @default 2
    * @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
    */
    width: 2,
    /**
    * @name CommonIndicator.arrowLength
    * @type number
    * @default 5
    * @propertyOf circularTextCloud,linearTextCloud
    */
    arrowLength: 5,
    /**
    * @name CommonIndicator.palette
    * @extends CommonVizPalette
    */
    palette: undefined,
    /**
    * @name CommonIndicator.offset
    * @type number
    */
    offset: undefined,
    /**
    * @name CommonIndicator.indentFromCenter
    * @type number
    * @default 0
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    indentFromCenter: 0,
    /**
    * @name CommonIndicator.beginAdaptingAtRadius
    * @type number
    * @default 50
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    beginAdaptingAtRadius: 50,
    /**
    * @name CommonIndicator.secondColor
    * @type string
    * @default '#E18E92'
    * @propertyOf circularTwoColorNeedle
    */
    secondColor: '#E18E92',
    /**
    * @name CommonIndicator.secondFraction
    * @type number
    * @default 0.4
    * @propertyOf circularTwoColorNeedle
    */
    secondFraction: 0.4,
    /**
    * @name CommonIndicator.spindleSize
    * @type number
    * @default 14
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    spindleSize: 14,
    /**
    * @name CommonIndicator.spindleGapSize
    * @type number
    * @default 10
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    spindleGapSize: 10,
    /**
    * @name CommonIndicator.horizontalOrientation
    * @type Enums.HorizontalEdge
    * @default 'right' @for value_indicators
    * @default 'left' @for subvalue_indicators
        * @propertyOf linearRangeBar
    */
    horizontalOrientation: 'right',
    /**
    * @name CommonIndicator.verticalOrientation
    * @type Enums.VerticalEdge
    * @default 'bottom' @for value_indicators
    * @default 'top' @for subvalue_indicators
        * @propertyOf linearRangeBar
    */
    verticalOrientation: 'bottom'
};


/**
* @name circularRectangleNeedle
* @publicName RectangleNeedle
* @section circularIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
*/
var circularRectangleNeedle = {
    color: '#C2C2C2'
}
/**
* @name circularTriangleNeedle
* @publicName TriangleNeedle
* @section circularIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
*/
var circularTriangleNeedle = {
    color: '#C2C2C2'
}
/**
* @name circularTwoColorNeedle
* @publicName TwoColorNeedle
* @section circularIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
*/
var circularTwoColorNeedle = {
    color: '#C2C2C2'
}
/**
* @name circularRangeBar
* @publicName RangeBar
* @section circularIndicators
* @type CommonIndicator
* @default '#CBC5CF' @prop color
* @default 30 @prop offset
*/
var circularRangeBar = {
    color: '#CBC5CF',
    offset: 30
}
/**
* @name circularTriangleMarker
* @publicName TriangleMarker
* @section circularIndicators
* @type CommonIndicator
* @default '#8798A5' @prop color
* @default 13 @prop width
* @default 14 @prop length
* @default 6 @prop offset
*/
var circularTriangleMarker = {
    color: '#8798A5',
    width: 13,
    length: 14,
    offset: 6
}
/**
* @name circularTextCloud
* @publicName TextCloud
* @section circularIndicators
* @type CommonIndicator
* @default '#679EC5' @prop color
* @default '#FFFFFF' @prop text.font.color
* @default 18 @prop text.font.size
* @default -6 @prop offset
*/
var circularTextCloud = {
    color: '#679EC5',
    text: {
        font: {
            color: '#FFFFFF',
            size: 18,
        }
    },
     offset: -6
};

/**
* @name linearRectangle
* @publicName Rectangle
* @section linearIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
* @default 15 @prop width
* @default 2.5 @prop offset
*/
var linearRectangle = {
    color: '#C2C2C2',
    width: 15,
    offset: 2.5
}
/**
* @name linearCircle
* @publicName Circle
* @section linearIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
* @default 2.5 @prop offset
*/
var linearCircle = {
    color: '#C2C2C2',
    offset: 2.5
}
/**
* @name linearRhombus
* @publicName Rhombus
* @section linearIndicators
* @type CommonIndicator
* @default '#C2C2C2' @prop color
* @default 15 @prop width
* @default 2.5 @prop offset
*/
var linearRhombus = {
    color: '#C2C2C2',
    width: 15,
    offset: 2.5
}
/**
* @name linearRangeBar
* @publicName RangeBar
* @section linearIndicators
* @type CommonIndicator
* @default '#CBC5CF' @prop color
* @default 10 @prop offset
*/
var linearRangeBar = {
    color: '#CBC5CF',
    offset: 10
}
/**
* @name linearTriangleMarker
* @publicName TriangleMarker
* @section linearIndicators
* @type CommonIndicator
* @default '#8798A5' @prop color
* @default 13 @prop width
* @default 14 @prop length
* @default 10 @prop offset
*/
var linearTriangleMarker = {
    color: '#8798A5',
    width: 13,
    length: 14,
    offset: 10
}
/**
* @name linearTextCloud
* @publicName TextCloud
* @section linearIndicators
* @type CommonIndicator
* @default '#679EC5' @prop color
* @default '#FFFFFF' @prop text.font.color
* @default 18 @prop text.font.size
* @default -1 @prop offset
*/
var linearTextCloud = {
    color: '#679EC5',
    text: {
        font: {
        color: '#FFFFFF',
        size: 18,
        }
    },
    offset: -1
}
