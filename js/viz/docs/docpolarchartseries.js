/**
* @name dxPolarChartSeriesTypes_CommonPolarChartSeries
* @publicName CommonPolarChartSeries
* @type object
* @hidden
*/
var CommonPolarChartSeries = {
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_color
	* @publicName color
	* @type string
	* @default undefined
	*/
    color: undefined,
    /**
     * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_closed
     * @publicName closed
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_linepolarseries
     */
    closed: true,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_visible
	* @publicName visible
	* @type boolean
	* @default true
	*/
    visible: true,
    /**
    * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_opacity
    * @publicName opacity
    * @type number
    * @default 0.5
    * @propertyOf dxPolarChartSeriesTypes_areapolarseries
    */
    opacity: 0.5,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_width
	* @publicName width
	* @type number
	* @default 2
	* @propertyOf dxPolarChartSeriesTypes_linepolarseries
	*/
    width: 2,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_dashstyle
	* @publicName dashStyle
	* @type string
	* @default 'solid'
	* @acceptValues 'solid'|'longDash'|'dash'|'dot'
	* @propertyOf dxPolarChartSeriesTypes_linepolarseries
	*/
    dashStyle: 'solid',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_stack
	* @publicName stack
	* @type string
	* @default 'default'
	* @propertyOf dxPolarChartSeriesTypes_stackedbarpolarseries
	*/
    stack: 'default',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_axis
	* @publicName axis
	* @type string
	* @default undefined
    * @hidden
	*/
    axis: undefined,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valuefield
	* @publicName valueField
	* @type string
	* @default 'val'
    * @notUsedInTheme
	*/
    valueField: 'val',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'arg'
    * @notUsedInTheme
	*/
    argumentField: 'arg',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_tagfield
	* @publicName tagField
	* @type string
	* @default 'tag'
    * @notUsedInTheme
	*/
    tagField: 'tag',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_border
	* @publicName border
	* @type object
	* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
	*/
    border: {
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_border_visible
		* @publicName visible
		* @type boolean
		* @default false
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        visible: false,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_border_width
		* @publicName width
		* @type number
		* @default 2
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        width: 2,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_border_color
		* @publicName color
		* @type string
		* @default undefined
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        color: undefined,
        /**
	    * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_border_dashstyle
	    * @publicName dashStyle
	    * @type string
	    * @default undefined
	    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
	    * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
	    */
        dashStyle: undefined
    },
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hovermode
	* @publicName hoverMode
	* @type string
	* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries,dxPolarChartSeriesTypes_linepolarseries
	* @acceptValues 'onlyPoint'|'allSeriesPoints'|'allArgumentPoints'|'nearestPoint'|'includePoints'|'excludePoints'|'none'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionmode
	* @publicName selectionMode
	* @type string
	* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries,dxPolarChartSeriesTypes_linepolarseries
	* @acceptValues 'onlyPoint'|'allSeriesPoints'|'allArgumentPoints'|'includePoints'|'excludePoints'|'none'
	*/
    selectionMode: 'includePoints',
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle
	* @publicName hoverStyle
	* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries,dxPolarChartSeriesTypes_linepolarseries
	* @type object
	*/
    hoverStyle: {
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_width
		* @publicName width
		* @type number
		* @default 3
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries
		*/
        width: 3,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_dashstyle
		* @publicName dashStyle
		* @type string
		* @default 'solid'
		* @acceptValues 'solid'|'longDash'|'dash'|'dot'
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries
		*/
        dashStyle: 'solid',
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching
		* @publicName hatching
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'none'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_width
			* @publicName width
			* @type number
			* @default 2
			*/
            width: 2,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_step
			* @publicName step
			* @type number
			* @default 6
			*/
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border
		* @publicName border
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        border: {
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
		    * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_dashstyle
		    * @publicName dashStyle
		    * @type string
		    * @default 'solid'
		    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
		    */
            dashStyle: 'solid'
        }
    },
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle
	* @publicName selectionStyle
	* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries,dxPolarChartSeriesTypes_linepolarseries
	* @type object
	*/
    selectionStyle: {
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_color
		* @publicName color
		* @type string
		* @default undefined
		*/
        color: undefined,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_width
		* @publicName width
		* @type number
		* @default 3
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries
		*/
        width: 3,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_dashstyle
		* @publicName dashStyle
		* @type string
		* @default 'solid'
		* @acceptValues 'solid'|'longDash'|'dash'|'dot'
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries
		*/
        dashStyle: 'solid',
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching
		* @publicName hatching
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_direction
            * @publicName direction
            * @type string
            * @default 'none'
            * @acceptValues 'none'|'right'|'left'
            */
            direction: 'right',
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_width
			* @publicName width
			* @type number
			* @default 2
			*/
            width: 2,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_step
			* @publicName step
			* @type number
			* @default 6
			*/
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border
		* @publicName border
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        border: {
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			*/
            visible: false,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_width
			* @publicName width
			* @type number
			* @default 3
			*/
            width: 3,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_color
			* @publicName color
			* @type string
			* @default undefined
			*/
            color: undefined,
            /**
		    * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_dashstyle
		    * @publicName dashStyle
		    * @type string
		    * @default 'solid'
		    * @acceptValues 'solid'|'longDash'|'dash'|'dot'
		    */
            dashStyle: 'solid'
        }
    },
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point
	* @publicName point
	* @type object
	* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
	*/
    point: {
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hovermode
		* @publicName hoverMode
		* @type string
		* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
        * @default 'onlyPoint'
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        hoverMode: 'onlyPoint',
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionmode
		* @publicName selectionMode
		* @type string
		* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
        * @default 'onlyPoint'
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        selectionMode: 'onlyPoint',
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_color
		* @publicName color
		* @type string
		* @default undefined
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        color: undefined,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_visible
		* @publicName visible
		* @type boolean
		* @default true
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        visible: true,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_symbol
		* @publicName symbol
		* @type string
		* @default 'circle'
		* @acceptValues 'circle' | 'square' | 'polygon' | 'triangle' | 'cross'
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        symbol: 'circle',
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image
		* @publicName image
		* @type string|object
		* @default undefined
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
        */
        image: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_url
            * @publicName url
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
            */
            url: undefined,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_width
            * @publicName width
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
            */
            width: 30,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_height
            * @publicName height
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
            */
            height: 30,
        },
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border
		* @publicName border
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        border: {
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_visible
			* @publicName visible
			* @type boolean
			* @default false
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            visible: false,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_width
			* @publicName width
			* @type number
			* @default 1
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            width: 1,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            color: undefined
        },
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_size
		* @publicName size
		* @type number
		* @default 12
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        size: 12,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle
		* @publicName hoverStyle
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        hoverStyle: {
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            color: undefined,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border
			* @publicName border
			* @type object
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            border: {
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_visible
				* @publicName visible
				* @type boolean
				* @default true
	            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                visible: true,
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_width
				* @publicName width
				* @type number
				* @default 4
	            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                width: 4,
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_color
				* @publicName color
				* @type string
				* @default undefined
	            * @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                color: undefined
            },
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_size
			* @publicName size
			* @type number
			* @default 12
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            size: 12
        },
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle
		* @publicName selectionStyle
		* @type object
		* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
		*/
        selectionStyle: {
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_color
			* @publicName color
			* @type string
			* @default undefined
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            color: undefined,
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border
			* @publicName border
			* @type object
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            border: {
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_visible
				* @publicName visible
				* @type boolean
				* @default true
				* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                visible: true,
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_width
				* @publicName width
				* @type number
				* @default 4
				* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                width: 4,
                /**
				* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_color
				* @publicName color
				* @type string
				* @default undefined
				* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
				*/
                color: undefined
            },
            /**
			* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_size
			* @publicName size
			* @type number
			* @default 12
			* @propertyOf dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_scatterpolarseries
			*/
            size: 12
        }
    },
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_showinlegend
	* @publicName showInLegend
	* @type boolean
	* @default true
	*/
    showInLegend: true,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_maxlabelcount
	* @publicName maxLabelCount
	* @type number
	* @default undefined
	*/
    maxLabelCount: undefined,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_minbarsize
	* @publicName minBarSize
	* @type number
	* @default undefined
	* @propertyOf dxPolarChartSeriesTypes_stackedbarpolarseries,dxPolarChartSeriesTypes_barpolarseries
		*/
    minBarSize: undefined,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_ignoreemptypoints
	* @publicName ignoreEmptyPoints
	* @type boolean
	* @default false
		*/
    ignoreEmptyPoints: false,
    /**
	* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label
	* @publicName label
	* @type object
	*/
    label: {
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_customizetext
		* @publicName customizeText
		* @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
		*/
        customizeText: undefined,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_visible
		* @publicName visible
		* @type boolean
		* @default false
		*/
        visible: false,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_showforzerovalues
		* @publicName showForZeroValues
		* @type boolean
		* @default true
		* @propertyOf dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
		*/
        showForZeroValues: true,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_rotationangle
		* @publicName rotationAngle
		* @type number
		* @default 0
		*/
        rotationAngle: 0,
        /**
		* @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_format
		* @publicName format
		* @extends CommonVizFormat
		*/
        format: '',
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_position
        * @publicName position
        * @type string
        * @default 'outside'
        * @acceptValues 'outside' | 'inside'
        * @propertyOf dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
        */
        position: 'outside',
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font_color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font_size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector
        * @publicName connector
        * @type object
        * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_scatterpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
        */
        connector: {
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_scatterpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_scatterpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_scatterpolarseries,dxPolarChartSeriesTypes_stackedbarpolarseries
            */
            color: undefined
        }
    },
    /**
    * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar
    * @publicName valueErrorBar
    * @type object
    * @propertyOf dxPolarChartSeriesTypes_areapolarseries,dxPolarChartSeriesTypes_barpolarseries,dxPolarChartSeriesTypes_linepolarseries,dxPolarChartSeriesTypes_scatterpolarseries
    */
    valueErrorBar: {
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_displaymode
        * @publicName displayMode
        * @type string
        * @acceptValues 'auto' | 'low' | 'high' | 'none'
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_lowvaluefield
        * @publicName lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_highvaluefield
        * @publicName highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_type
        * @publicName type
        * @type string
        * @default undefined
        * @acceptValues 'percent' | 'stdError' | 'stdDeviation' | 'variance' | 'fixed'
        */
        type: undefined,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_value
        * @publicName value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_color
        * @publicName color
        * @type string
        * @default black
        */
        color: 'black',
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_linewidth
        * @publicName lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_edgelength
        * @publicName edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined
    }
};

/**
* @name dxPolarChartSeriesTypes_areapolarseries
* @publicName AreaSeries
* @type object
* @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
* @hidePropertyOf
*/
var areaPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes_areapolarseries_point
    * @publicName point
    * @type object
    * @extend_doc
    */
    point: {
        /**
		* @name dxPolarChartSeriesTypes_areapolarseries_point_visible
		* @publicName visible
        * @type boolean
		* @default false
		* @extend_doc
		*/
        visible: false
    },
    /**
	* @name dxPolarChartSeriesTypes_areapolarseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxPolarChartSeriesTypes_areapolarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxPolarChartSeriesTypes_barpolarseries
* @publicName BarSeries
* @type object
* @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
* @hidePropertyOf
*/
var barPolarSeries = {
    /**
	* @name dxPolarChartSeriesTypes_barpolarseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    hoverMode: 'onlyPoint',
    /**
	* @name dxPolarChartSeriesTypes_barpolarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};
/**
* @name dxPolarChartSeriesTypes_linepolarseries
* @publicName LineSeries
* @type object
* @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
* @hidePropertyOf
*/
var linePolarSeries = {
    /**
	* @name dxPolarChartSeriesTypes_linepolarseries_hovermode
	* @publicName hoverMode
	* @type string
	* @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'excludePoints'
	*/
    hoverMode: 'nearestPoint',
    /**
	* @name dxPolarChartSeriesTypes_linepolarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
	*/
    selectionMode: 'includePoints'
};

/**
* @name dxPolarChartSeriesTypes_scatterpolarseries
* @publicName ScatterSeries
* @type object
* @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
* @hidePropertyOf
*/
var scatterPolarSeries = {};
/**
* @name dxPolarChartSeriesTypes_stackedbarpolarseries
* @publicName StackedBarSeries
* @type object
* @inherits dxPolarChartSeriesTypes_CommonPolarChartSeries
* @hidePropertyOf
*/
var stackedbarPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes_stackedbarpolarseries_label
    * @publicName label
    * @type object
    * @extend_doc
    */
    /**
    * @name dxPolarChartSeriesTypes_stackedbarpolarseries_label_position
    * @publicName position
    * @type string
    * @default 'inside'
    * @extend_doc
    */
    /**
    * @name dxPolarChartSeriesTypes_stackedbarpolarseries_hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
	* @name dxPolarChartSeriesTypes_stackedbarpolarseries_selectionmode
	* @publicName selectionMode
	* @type string
	* @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
	*/
    selectionMode: 'onlyPoint'
};
