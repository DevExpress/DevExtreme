/**
* @name commonIndicator
* @section commonIndicators
* @publicName CommonIndicator
* @type object
* @hidden
*/
var commonIndicator = {
    /**
    * @name commonIndicator.color
    * @publicName color
    * @type string
    */
    color: undefined,
    /**
    * @name commonIndicator.baseValue
    * @publicName baseValue
    * @type number
    * @default undefined
    * @notUsedInTheme
    * @propertyOf circularRangeBar,linearRangeBar
    */
    baseValue: undefined,
    /**
    * @name commonIndicator.size
    * @publicName size
    * @type number
    * @default 10
    * @propertyOf circularRangeBar,linearRangeBar
    */
    size: 10,
    /**
    * @name commonIndicator.backgroundColor
    * @publicName backgroundColor
    * @type string
    * @default 'none'
    * @propertyOf circularRangeBar,linearRangeBar
    */
    backgroundColor: 'none',
    /**
    * @name commonIndicator.text
    * @publicName text
    * @type object
    * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
    */
    text: {
        /**
        * @name commonIndicator.text.indent
        * @publicName indent
        * @type number
        * @default 0
        * @propertyOf circularRangeBar,linearRangeBar
        */
        indent: 0,
        /**
        * @name commonIndicator.text.format
        * @publicName format
        * @extends CommonVizFormat
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        format: undefined,
        /**
        * @name commonIndicator.text.precision
        * @publicName precision
        * @extends CommonVizPrecision
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        precision: undefined,
        /**
        * @name commonIndicator.text.customizeText
        * @publicName customizeText
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
        * @name commonIndicator.text.font
        * @publicName font
        * @type object
        * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
        */
        font: {
            /**
            * @name commonIndicator.text.font.color
            * @publicName color
            * @type string
            * @default null
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            color: null,
            /**
            * @name commonIndicator.text.font.size
            * @publicName size
            * @type number|string
            * @default 14
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            size: 14,
            /**
            * @name commonIndicator.text.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name commonIndicator.text.font.weight
            * @publicName weight
            * @type number
            * @default 400
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            weight: 400,
            /**
            * @name commonIndicator.text.font.opacity
            * @publicName opacity
            * @type number
            * @default 1
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            opacity: 1
        }
    },
    /**
    * @name commonIndicator.length
    * @publicName length
    * @type number
    * @default 15
    * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
    */
    length: 15,
    /**
    * @name commonIndicator.width
    * @publicName width
    * @type number
    * @default 2
    * @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
    */
    width: 2,
    /**
    * @name commonIndicator.arrowLength
    * @publicName arrowLength
    * @type number
    * @default 5
    * @propertyOf circularTextCloud,linearTextCloud
    */
    arrowLength: 5,
    /**
    * @name commonIndicator.palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: undefined,
    /**
    * @name commonIndicator.offset
    * @publicName offset
    * @type number
    */
    offset: undefined,
    /**
    * @name commonIndicator.indentFromCenter
    * @publicName indentFromCenter
    * @type number
    * @default 0
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    indentFromCenter: 0,
    /**
    * @name commonIndicator.beginAdaptingAtRadius
    * @publicName beginAdaptingAtRadius
    * @type number
    * @default 50
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    beginAdaptingAtRadius: 50,
    /**
    * @name commonIndicator.secondColor
    * @publicName secondColor
    * @type string
    * @default '#E18E92'
    * @propertyOf circularTwoColorNeedle
    */
    secondColor: '#E18E92',
    /**
    * @name commonIndicator.secondFraction
    * @publicName secondFraction
    * @type number
    * @default 0.4
    * @propertyOf circularTwoColorNeedle
    */
    secondFraction: 0.4,
    /**
    * @name commonIndicator.spindleSize
    * @publicName spindleSize
    * @type number
    * @default 14
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    spindleSize: 14,
    /**
    * @name commonIndicator.spindleGapSize
    * @publicName spindleGapSize
    * @type number
    * @default 10
    * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
    */
    spindleGapSize: 10,
    /**
    * @name commonIndicator.horizontalOrientation
    * @publicName horizontalOrientation
    * @type Enums.HorizontalEdge
    * @default 'right' @for value_indicators
    * @default 'left' @for subvalue_indicators
        * @propertyOf linearRangeBar
    */
    horizontalOrientation: 'right',
    /**
    * @name commonIndicator.verticalOrientation
    * @publicName verticalOrientation
    * @type Enums.VerticalEdge
    * @default 'bottom' @for value_indicators
    * @default 'top' @for subvalue_indicators
        * @propertyOf linearRangeBar
    */
    verticalOrientation: 'bottom'
};


/**
* @name circularRectangleNeedle
* @section circularIndicators
* @publicName RectangleNeedle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularRectangleNeedle = {
    /**
    * @name circularRectangleNeedle.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularTriangleNeedle
* @section circularIndicators
* @publicName TriangleNeedle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTriangleNeedle = {
    /**
    * @name circularTriangleNeedle.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularTwoColorNeedle
* @section circularIndicators
* @publicName TwoColorNeedle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTwoColorNeedle = {
    /**
    * @name circularTwoColorNeedle.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2'
}
/**
* @name circularRangeBar
* @section circularIndicators
* @publicName RangeBar
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularRangeBar = {
    /**
    * @name circularRangeBar.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#CBC5CF'
    */
    color: '#CBC5CF',
    /**
    * @name circularRangeBar.offset
    * @publicName offset
    * @type number
    * @default 30
    * @inheritdoc
    */
    offset: 30
}
/**
* @name circularTriangleMarker
* @section circularIndicators
* @publicName TriangleMarker
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTriangleMarker = {
    /**
    * @name circularTriangleMarker.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#8798A5'
    */
    color: '#8798A5',
    /**
    * @name circularTriangleMarker.width
    * @publicName width
    * @type number
    * @default 13
    * @inheritdoc
    */
    width: 13,
    /**
    * @name circularTriangleMarker.length
    * @publicName length
    * @type number
    * @default 14
    * @inheritdoc
    */
    length: 14,
    /**
     * @name circularTriangleMarker.offset
     * @publicName offset
     * @type number
     * @default 6
     * @inheritdoc
     */
     offset: 6
}
/**
* @name circularTextCloud
* @section circularIndicators
* @publicName TextCloud
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTextCloud = {
    /**
    * @name circularTextCloud.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#679EC5'
    */
    color: '#679EC5',
    /**
    * @name circularTextCloud.text
    * @publicName text
    * @type object
    * @inheritdoc
    */
    text: {
        /**
        * @name circularTextCloud.text.font
        * @publicName font
        * @type object
        * @inheritdoc
        */
        font: {
            /**
            * @name circularTextCloud.text.font.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            * @inheritdoc
            */
            color: '#FFFFFF',
            /**
            * @name circularTextCloud.text.font.size
            * @publicName size
            * @type number|string
            * @default 18
            * @inheritdoc
            */
            size: 18,
        }
    },
    /**
     * @name circularTextCloud.offset
     * @publicName offset
     * @type number
     * @default -6
     * @inheritdoc
     */
     offset: -6
};

/**
* @name linearRectangle
* @section linearIndicators
* @publicName Rectangle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRectangle = {
    /**
    * @name linearRectangle.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearRectangle.width
    * @publicName width
    * @type number
    * @default 15
    * @inheritdoc
    */
    width: 15,
    /**
    * @name linearRectangle.offset
    * @publicName offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearCircle
* @section linearIndicators
* @publicName Circle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearCircle = {
    /**
    * @name linearCircle.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearCircle.offset
    * @publicName offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearRhombus
* @section linearIndicators
* @publicName Rhombus
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRhombus = {
    /**
    * @name linearRhombus.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#C2C2C2'
    */
    color: '#C2C2C2',
    /**
    * @name linearRhombus.width
    * @publicName width
    * @type number
    * @default 15
    * @inheritdoc
    */
    width: 15,
    /**
    * @name linearRhombus.offset
    * @publicName offset
  * @type number
    * @default 2.5
    * @inheritdoc
    */
    offset: 2.5
}
/**
* @name linearRangeBar
* @section linearIndicators
* @publicName RangeBar
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearRangeBar = {
    /**
    * @name linearRangeBar.color
    * @publicName color
    * @type string
    * @default '#CBC5CF'
    * @inheritdoc
    */
    color: '#CBC5CF',
    /**
    * @name linearRangeBar.offset
    * @publicName offset
  * @type number
    * @default 10
    * @inheritdoc
    */
    offset: 10
}
/**
* @name linearTriangleMarker
* @section linearIndicators
* @publicName TriangleMarker
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearTriangleMarker = {
    /**
    * @name linearTriangleMarker.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#8798A5'
    */
    color: '#8798A5',
    /**
    * @name linearTriangleMarker.width
    * @publicName width
    * @type number
    * @default 13
    * @inheritdoc
    */
    width: 13,
    /**
    * @name linearTriangleMarker.length
    * @publicName length
    * @type number
    * @default 14
    * @inheritdoc
    */
    length: 14,
    /**
    * @name linearTriangleMarker.offset
    * @publicName offset
  * @type number
    * @default 10
    * @inheritdoc
    */
    offset: 10
}
/**
* @name linearTextCloud
* @section linearIndicators
* @publicName TextCloud
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var linearTextCloud = {
    /**
    * @name linearTextCloud.color
    * @publicName color
    * @type string
    * @inheritdoc
    * @default '#679EC5'
    */
    color: '#679EC5',
    /**
    * @name linearTextCloud.text
    * @publicName text
    * @type object
    * @inheritdoc
    */
    text: {
        /**
        * @name linearTextCloud.text.font
        * @publicName font
        * @type object
        * @inheritdoc
        */
        font: {
            /**
            * @name linearTextCloud.text.font.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            * @inheritdoc
            */
        color: '#FFFFFF',
            /**
            * @name linearTextCloud.text.font.size
            * @publicName size
            * @type number|string
            * @default 18
            * @inheritdoc
            */
        size: 18,
    }
    },
    /**
    * @name linearTextCloud.offset
    * @publicName offset
  * @type number
    * @default -1
    * @inheritdoc
    */
    offset: -1
}
