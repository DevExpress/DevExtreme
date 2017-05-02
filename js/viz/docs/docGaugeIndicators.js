/**
* @name commonIndicator
* @section commonIndicators
* @publicName CommonIndicator
* @type object
* @hidden
*/
var commonIndicator = {
    /**
	* @name commonIndicatoroptions_color
	* @publicName color
	* @type string
	* @custom_default_for_value_indicators '#C2C2C2'
	* @custom_default_for_subvalue_indicators '#8798a5'
	*/
    color: '#C2C2C2',
    /**
	* @name commonIndicatoroptions_baseValue
	* @publicName baseValue
	* @type number
	* @default undefined
	* @notUsedInTheme
	* @propertyOf circularRangeBar,linearRangeBar
	*/
    baseValue: undefined,
    /**
	* @name commonIndicatoroptions_size
	* @publicName size
	* @type number
	* @default 10
	* @propertyOf circularRangeBar,linearRangeBar
	*/
    size: 10,
    /**
	* @name commonIndicatoroptions_backgroundColor
	* @publicName backgroundColor
	* @type string
	* @default 'none'
	* @propertyOf circularRangeBar,linearRangeBar
	*/
    backgroundColor: 'none',
    /**
	* @name commonIndicatoroptions_text
	* @publicName text
	* @type object
	* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
	*/
    text: {
        /**
		* @name commonIndicatoroptions_text_indent
		* @publicName indent
		* @type number
		* @default 0
		* @propertyOf circularRangeBar,linearRangeBar
		*/
        indent: 0,
        /**
		* @name commonIndicatoroptions_text_format
		* @publicName format
		* @extends CommonVizFormat
		* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
		*/
        format: undefined,
        /**
		* @name commonIndicatoroptions_text_precision
		* @publicName precision
		* @extends CommonVizPrecision
		* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
		*/
        precision: undefined,
        /**
		* @name commonIndicatoroptions_text_customizeText
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
		* @name commonIndicatoroptions_text_font
		* @publicName font
		* @type object
		* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
		*/
        font: {
            /**
			* @name commonIndicatoroptions_text_font_color
			* @publicName color
			* @type string
			* @default null
			* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
			*/
            color: null,
            /**
			* @name commonIndicatoroptions_text_font_size
			* @publicName size
			* @type number|string
			* @default 14
			* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
			*/
            size: 14,
            /**
			* @name commonIndicatoroptions_text_font_family
			* @publicName family
			* @type string
			* @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
			* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
			*/
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
			* @name commonIndicatoroptions_text_font_weight
			* @publicName weight
			* @type number
			* @default 400
			* @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
			*/
            weight: 400,
            /**
            * @name commonIndicatoroptions_text_font_opacity
            * @publicName opacity
            * @type number
            * @default 1
            * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
            */
            opacity: 1
        }
    },
    /**
	* @name commonIndicatoroptions_length
	* @publicName length
	* @type number
	* @default 15
	* @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
	*/
    length: 15,
    /**
	* @name commonIndicatoroptions_width
	* @publicName width
	* @type number
	* @default 2
	* @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
	*/
    width: 2,
    /**
	* @name commonIndicatoroptions_arrowLength
	* @publicName arrowLength
	* @type number
	* @default 5
	* @propertyOf circularTextCloud,linearTextCloud
	*/
    arrowLength: 5,
    /**
	* @name commonIndicatoroptions_palette
	* @publicName palette
	* @extends CommonVizPalette
	*/
    palette: undefined,
    /**
	* @name commonIndicatoroptions_offset
	* @publicName offset
	* @type number
	* @custom_default_for_value_indicators 20
	* @custom_default_for_subvalue_indicators 6
	*/
    offset: 20,
    /**
	* @name commonIndicatoroptions_indentFromCenter
	* @publicName indentFromCenter
	* @type number
	* @default 0
	* @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
	*/
    indentFromCenter: 0,
    /**
	* @name commonIndicatoroptions_secondColor
	* @publicName secondColor
	* @type string
	* @default '#E18E92'
	* @propertyOf circularTwoColorNeedle
	*/
    secondColor: '#E18E92',
    /**
	* @name commonIndicatoroptions_secondFraction
	* @publicName secondFraction
	* @type number
	* @default 0.4
	* @propertyOf circularTwoColorNeedle
	*/
    secondFraction: 0.4,
    /**
	* @name commonIndicatoroptions_spindleSize
	* @publicName spindleSize
	* @type number
	* @default 14
	* @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
	*/
    spindleSize: 14,
    /**
	* @name commonIndicatoroptions_spindleGapSize
	* @publicName spindleGapSize
	* @type number
	* @default 10
	* @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
	*/
    spindleGapSize: 10,
    /**
	* @name commonIndicatoroptions_horizontalOrientation
	* @publicName horizontalOrientation
	* @type string
	* @custom_default_for_value_indicators 'right'
	* @custom_default_for_subvalue_indicators 'left'
	* @acceptValues 'left' | 'right'
	* @propertyOf linearRangeBar
	*/
    horizontalOrientation: 'right',
    /**
	* @name commonIndicatoroptions_verticalOrientation
	* @publicName verticalOrientation
	* @type string
	* @custom_default_for_value_indicators 'bottom'
	* @custom_default_for_subvalue_indicators 'top'
	* @acceptValues 'top' | 'bottom'
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
var circularRectangleNeedle = {}
/**
* @name circularTriangleNeedle
* @section circularIndicators
* @publicName TriangleNeedle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTriangleNeedle = {}
/**
* @name circularTwoColorNeedle
* @section circularIndicators
* @publicName TwoColorNeedle
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularTwoColorNeedle = {}
/**
* @name circularRangeBar
* @section circularIndicators
* @publicName RangeBar
* @type object
* @inherits CommonIndicator
* @hidePropertyOf
*/
var circularRangeBar = {}
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
	* @name circularTriangleMarkeroptions_width
	* @publicName width
    * @type number
	* @default 13
	* @extend_doc
	*/
    width: 13,
	/**
	* @name circularTriangleMarkeroptions_length
	* @publicName length
    * @type number
	* @default 14
	* @extend_doc
	*/
    length: 14,
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
	* @name circularTextCloudoptions_text
	* @publicName text
    * @type object
	* @extend_doc
	*/
    text: {
        /**
		* @name circularTextCloudoptions_text_font
		* @publicName font
        * @type object
		* @extend_doc
		*/
        font: {
            /**
			* @name circularTextCloudoptions_text_font_color
			* @publicName color
            * @type string
			* @default '#FFFFFF'
			* @extend_doc
			*/
            color: '#FFFFFF',
            /**
			* @name circularTextCloudoptions_text_font_size
			* @publicName size
            * @type number|string
			* @default 18
			* @extend_doc
			*/
            size: 18,
        }
    }
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
	* @name linearRectangleoptions_width
	* @publicName width
    * @type number
	* @default 15
	* @extend_doc
	*/
    width: 15,
	/**
	* @name linearRectangleoptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
	*/
    offset: 10
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
	* @name linearCircleoptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
	*/
    offset: 10
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
	* @name linearRhombusoptions_width
	* @publicName width
    * @type number
	* @default 15
	* @extend_doc
	*/
    width: 15,
	/**
	* @name linearRhombusoptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
	*/
    offset: 10
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
	* @name linearRangeBaroptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
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
	* @name linearTriangleMarkeroptions_width
	* @publicName width
    * @type number
	* @default 13
	* @extend_doc
	*/
    width: 13,
	/**
	* @name linearTriangleMarkeroptions_length
	* @publicName length
    * @type number
	* @default 14
	* @extend_doc
	*/
    length: 14,
	/**
	* @name linearTriangleMarkeroptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
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
	* @name linearTextCloudoptions_text
	* @publicName text
    * @type object
	* @extend_doc
	*/
    text: {
		/**
		* @name linearTextCloudoptions_text_font
		* @publicName font
        * @type object
		* @extend_doc
		*/
        font: {
			/**
			* @name linearTextCloudoptions_text_font_color
			* @publicName color
            * @type string
			* @default '#FFFFFF'
			* @extend_doc
			*/
        color: '#FFFFFF',
			/**
			* @name linearTextCloudoptions_text_font_size
			* @publicName size
            * @type number|string
			* @default 18
			* @extend_doc
			*/
        size: 18,
    }
    },
	/**
	* @name linearTextCloudoptions_offset
	* @publicName offset
    * @type number
	* @custom_default_for_value_and_subvalue_indicators 10
	* @extend_doc
	*/
    offset: 10
}
