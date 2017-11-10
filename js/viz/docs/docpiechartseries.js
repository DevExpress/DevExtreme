/**
* @name dxPieChartSeriesTypes_CommonPieChartSeries
* @publicName CommonPieChartSeries
* @type object
* @hidden
*/
var commonPieChartSeries = {
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_color
	* @publicName color
	* @type string
	* @default undefined
	*/
    color: undefined,
    /**
    * @name dxPieChartSeriesTypes_CommonPieChartSeries_minsegmentsize
    * @publicName minSegmentSize
    * @type number
    * @default undefined
    */
    minSegmentSize: undefined,
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping
	* @publicName smallValuesGrouping
	* @type object
	*/
    smallValuesGrouping: {
        /**
         * @name dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_mode
         * @publicName mode
         * @type string
         * @default 'none'
         * @acceptValues 'topN' | 'smallValueThreshold' | 'none'
         */
        mode: 'none',
        /**
         * @name dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_topcount
         * @publicName topCount
         * @type number
         * @default undefined
         */
        topCount: undefined,
        /**
         * @name dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_threshold
         * @publicName threshold
         * @type number
         * @default undefined
         */
        threshold: undefined,
        /**
         * @name dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_groupname
         * @publicName groupName
         * @type string
         * @default 'others'
         */
        groupName: 'others',
    },
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_valuefield
	* @publicName valueField
	* @type string
	* @default 'val'
	*/
    valueField: 'val',
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'arg'
	*/
    argumentField: 'arg',
    /**
    * @name dxPieChartSeriesTypes_CommonPieChartSeries_argumentType
    * @publicName argumentType
    * @type string
    * @default undefined
    * @acceptValues 'numeric' | 'datetime' | 'string'
    */
    argumentType: undefined,
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_tagfield
	* @publicName tagField
	* @type string
	* @default 'tag'
	*/
    tagField: 'tag',
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_border
	* @publicName border
	* @type object
	*/
    border: {
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_border_visible
		* @publicName visible
		* @type boolean
		* @default false
		*/
        visible: false,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_border_width
		* @publicName width
		* @type number
		* @default 2
		*/
        width: 2,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_border_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
       * @name dxPieChartSeriesTypes_CommonPieChartSeries_border_dashstyle
       * @publicName dashStyle
       * @type string
       * @default undefined
       * @acceptValues 'solid'|'longDash'|'dash'|'dot'
       */
        dashStyle: undefined
    },
    /**
    * @name dxPieChartSeriesTypes_CommonPieChartSeries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint',
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle
	* @publicName hoverStyle
	* @type object
	*/
    hoverStyle: {
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching
		* @publicName hatching
		* @type object
		*/
        hatching: {
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'right'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_width
			* @publicName width
			* @type number
			* @default 4
			*/
            width: 4,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_step
			* @publicName step
			* @type number
			* @default 10
			*/
            step: 10,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border
		* @publicName border
		* @type object
		*/
        border: {
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default undefined
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: undefined
        }
    },
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle
	* @publicName selectionStyle
	* @type object
	*/
    selectionStyle: {
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching
		* @publicName hatching
		* @type object
		*/
        hatching: {
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'right'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_width
			* @publicName width
			* @type number
			* @default 4
			*/
            width: 4,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_step
			* @publicName step
			* @type number
			* @default 10
			*/
            step: 10,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border
		* @publicName border
		* @type object
		*/
        border: {
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default undefined
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: undefined
        }
    },
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_maxlabelcount
	* @publicName maxLabelCount
	* @type number
	* @default undefined
	*/
    maxLabelCount: undefined,
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_segmentsdirection
	* @publicName segmentsDirection
	* @type string
	* @default 'clockwise'
	* @acceptValues 'clockwise' | 'anticlockwise'
    * @deprecated dxpiechartoptions_segmentsdirection
	*/
    segmentsDirection: 'clockwise',
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_startangle
	* @publicName startAngle
	* @type number
	* @default 0
    * @deprecated dxpiechartoptions_startangle
	*/
    startAngle: 0,
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_innerradius
	* @publicName innerRadius
	* @type number
	* @default 0.5
	* @propertyOf dxPieChartSeriesTypes_DoughnutSeries
    * @deprecated dxpiechartoptions_innerradius
	*/
    innerRadius: 0.5,
    /**
	* @name dxPieChartSeriesTypes_CommonPieChartSeries_label
	* @publicName label
	* @type object
	*/
    label: {
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_label_visible
		* @publicName visible
		* @type boolean
		* @default false
		*/
        visible: false,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_label_rotationangle
		* @publicName rotationAngle
		* @type number
		* @default 0
		*/
        rotationAngle: 0,
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_radialoffset
        * @publicName radialOffset
        * @type number
        * @default 0
        */
        radialOffset: 0,
        /**
		* @name dxPieChartSeriesTypes_CommonPieChartSeries_label_format
		* @publicName format
		* @extends CommonVizFormat
		*/
        format: '',
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        percentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_position
        * @publicName position
        * @type string
        * @default 'outside'
        * @acceptValues 'outside' | 'inside' | 'columns'
        */
        position: 'outside',
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font_size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_border_color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_connector
        * @publicName connector
        * @type object
        */
        connector: {
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        }
    }
};

/**
* @name dxPieChartSeriesTypes_DoughnutSeries
* @publicName DoughnutSeries
* @type object
* @inherits dxPieChartSeriesTypes_CommonPieChartSeries
* @hidePropertyOf
*/
var doughnutSeries = {

};

/**
* @name dxPieChartSeriesTypes_PieSeries
* @publicName PieSeries
* @type object
* @inherits dxPieChartSeriesTypes_CommonPieChartSeries
* @hidePropertyOf
*/
var pieSeries = {

};


