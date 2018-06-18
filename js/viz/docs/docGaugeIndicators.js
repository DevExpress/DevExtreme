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
        * @name CommonIndicator.text.precision
        * @extends CommonVizPrecision
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        precision: undefined,
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
        * @type object
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        font: {
            /**
            * @name CommonIndicator.text.font.color
            * @type string
            * @default null
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            color: null,
            /**
            * @name CommonIndicator.text.font.size
            * @type number|string
            * @default 14
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            size: 14,
            /**
            * @name CommonIndicator.text.font.family
            * @extends CommonVizFontFamily
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            family: undefined,
            /**
            * @name CommonIndicator.text.font.weight
            * @type number
            * @default 400
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            weight: 400,
            /**
            * @name CommonIndicator.text.font.opacity
            * @type number
            * @default 1
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
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
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularRectangleNeedle = {
    /**
    * @name circularRectangleNeedle.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularTriangleNeedle
* @publicName TriangleNeedle
* @section circularIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTriangleNeedle = {
    /**
    * @name circularTriangleNeedle.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularTwoColorNeedle
* @publicName TwoColorNeedle
* @section circularIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTwoColorNeedle = {
    /**
    * @name circularTwoColorNeedle.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularRangeBar
* @publicName RangeBar
* @section circularIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularRangeBar = {
    /**
    * @name circularRangeBar.color
    * @type string
    * @inheritdoc
    * @default '#CBC5CF'
    */
    color: '#CBC5CF',
    /**
    * @name circularRangeBar.offset
    * @type number
    * @default 30
    * @inheritdoc
    */
    offset: 30
}
/**
* @name circularTriangleMarker
* @publicName TriangleMarker
* @section circularIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTriangleMarker = {
    /**
    * @name circularTriangleMarker.color
    * @type string
    * @inheritdoc
    * @default '#8798A5'
    */
    color: '#8798A5',
    /**
    * @name circularTriangleMarker.width
    * @type number
    * @default 13
    * @inheritdoc
    */
    width: 13,
    /**
    * @name circularTriangleMarker.length
    * @type number
    * @default 14
    * @inheritdoc
    */
    length: 14,
    /**
     * @name circularTriangleMarker.offset
     * @type number
     * @default 6
     * @inheritdoc
     */
     offset: 6
}
/**
* @name circularTextCloud
* @publicName TextCloud
* @section circularIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTextCloud = {
    /**
    * @name circularTextCloud.color
    * @type string
    * @inheritdoc
    * @default '#679EC5'
    */
    color: '#679EC5',
    /**
    * @name circularTextCloud.text
    * @type object
    * @inheritdoc
    */
    text: {
        /**
        * @name circularTextCloud.text.font
        * @type object
        * @inheritdoc
        */
        font: {
            /**
            * @name circularTextCloud.text.font.color
            * @type string
            * @default '#FFFFFF'
            * @inheritdoc
            */
            color: '#FFFFFF',
            /**
            * @name circularTextCloud.text.font.size
            * @type number|string
            * @default 18
            * @inheritdoc
            */
            size: 18,
        }
    },
    /**
     * @name circularTextCloud.offset
     * @type number
     * @default -6
     * @inheritdoc
     */
     offset: -6
};

/**
* @name linearRectangle
* @publicName Rectangle
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRectangle = {
    /**
    * @name linearRectangle.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearRectangle.width
    * @type number
    * @default 15
    * @inheritdoc
    */
    width: 15,
    /**
    * @name linearRectangle.offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearCircle
* @publicName Circle
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearCircle = {
    /**
    * @name linearCircle.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearCircle.offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearRhombus
* @publicName Rhombus
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRhombus = {
    /**
    * @name linearRhombus.color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearRhombus.width
    * @type number
    * @default 15
    * @inheritdoc
    */
    width: 15,
    /**
    * @name linearRhombus.offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearRangeBar
* @publicName RangeBar
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRangeBar = {
    /**
    * @name linearRangeBar.color
    * @type string
    * @default '#CBC5CF'
    * @inheritdoc
    */
    color: '#CBC5CF',
    /**
    * @name linearRangeBar.offset
  * @type number
    * @default 10
    * @inheritdoc
    */
    offset: 10
}
/**
* @name linearTriangleMarker
* @publicName TriangleMarker
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearTriangleMarker = {
    /**
    * @name linearTriangleMarker.color
    * @type string
    * @inheritdoc
    * @default '#8798A5'
    */
    color: '#8798A5',
    /**
    * @name linearTriangleMarker.width
    * @type number
    * @default 13
    * @inheritdoc
    */
    width: 13,
    /**
    * @name linearTriangleMarker.length
    * @type number
    * @default 14
    * @inheritdoc
    */
    length: 14,
    /**
    * @name linearTriangleMarker.offset
  * @type number
    * @default 10
    * @inheritdoc
    */
    offset: 10
}
/**
* @name linearTextCloud
* @publicName TextCloud
* @section linearIndicators
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearTextCloud = {
    /**
    * @name linearTextCloud.color
    * @type string
    * @inheritdoc
    * @default '#679EC5'
    */
    color: '#679EC5',
    /**
    * @name linearTextCloud.text
    * @type object
    * @inheritdoc
    */
    text: {
        /**
        * @name linearTextCloud.text.font
        * @type object
        * @inheritdoc
        */
        font: {
            /**
            * @name linearTextCloud.text.font.color
            * @type string
            * @default '#FFFFFF'
            * @inheritdoc
            */
        color: '#FFFFFF',
            /**
            * @name linearTextCloud.text.font.size
            * @type number|string
            * @default 18
            * @inheritdoc
            */
        size: 18,
    }
    },
    /**
    * @name linearTextCloud.offset
    * @type number
    * @default -1
    * @inheritdoc
    */
    offset: -1
}
