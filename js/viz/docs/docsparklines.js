/**
* @name basesparkline
* @publicName BaseSparkline
* @type object
* @hidden
* @inherits BaseWidget
*/
var BaseSparkline = {
    /**
    * @name basesparklineoptions_redrawOnResize
    * @publicName redrawOnResize
    * @hidden
    * @extend_doc
    */
    redrawOnResize: undefined,
    /**
    * @name basesparklineoptions_title
    * @publicName title
    * @hidden
    * @extend_doc
    */
    title: undefined,
    /**
    * @name basesparklineoptions_export
    * @publicName export
    * @hidden
    * @extend_doc
    */
    "export": undefined,
    /**
    * @name basesparklineoptions_loadingIndicator
    * @publicName loadingIndicator
    * @hidden
    * @extend_doc
    */
    loadingIndicator: undefined,
    /**
    * @name basesparklinemethods_showLoadingIndicator
    * @publicName showLoadingIndicator()
    * @hidden
    * @extend_doc
    */
    showLoadingIndicator: function() { },
    /**
    * @name basesparklinemethods_hideLoadingIndicator
    * @publicName hideLoadingIndicator()
    * @hidden
    * @extend_doc
    */
    hideLoadingIndicator: function() { },
    /**
    * @name basesparklineoptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name basesparklineoptions_tooltip_enabled
        * @type boolean
        * @publicName enabled
        * @default true
        * @extend_doc
        */
        enabled: true,
        /**
        * @name basesparklineoptions_tooltip_verticalalignment
        * @publicName verticalAlignment
        * @type string
        * @default undefined
        * @acceptValues 'top' | 'bottom'
        * @deprecated
        */
        verticalAlignment: 'top',
        /**
        * @name basesparklineoptions_tooltip_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @default undefined
        * @acceptValues 'left' | 'center' | 'right'
        * @deprecated
        */
        horizontalAlignment: 'center',
        /**
        * @name basesparklineoptions_tooltip_customizetooltip
        * @publicName customizeTooltip
        * @type function(pointsInfo)
        * @type_function_param1 pointsInfo:object
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined
    },
    /**
    * @name basesparklineoptions_ontooltipshown
    * @publicName onTooltipShown
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name basesparklineoptions_ontooltiphidden
    * @publicName onTooltipHidden
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};


/**
* @name dxsparkline
* @publicName dxSparkline
* @inherits BaseSparkline
* @groupName Data Management and Visualization
* @module viz/sparkline
* @export default
*/
var dxSparkline = {
    /**
   * @name dxsparklineoptions_datasource
   * @publicName dataSource
   * @extends CommonVizDataSource
   */
    dataSource: undefined,
    /**
	* @name dxsparklineoptions_argumentfield
	* @publicName argumentField
	* @type string
	* @default 'arg'
	*/
    argumentField: 'arg',
    /**
	* @name dxsparklineoptions_valuefield
	* @publicName valueField
	* @type string
	* @default 'val'
	*/
    valueField: 'val',
    /**
    * @name dxsparklineoptions_type
    * @publicName type
    * @type string
    * @default 'line'
    * @acceptValues 'line' | 'spline' | 'stepline' | 'area' | 'splinearea' | 'steparea' | 'bar' | 'winloss'
    */
    type: 'line',
    /**
	* @name dxsparklineoptions_linecolor
	* @publicName lineColor
	* @type string
	* @default '#666666'
	*/
    lineColor: '#666666',
    /**
	* @name dxsparklineoptions_linewidth
	* @publicName lineWidth
	* @type number
	* @default 2
	*/
    lineWidth: 2,
    /**
    * @name dxsparklineoptions_showfirstlast
    * @publicName showFirstLast
    * @type boolean
    * @default true
    */
    showFirstLast: true,
    /**
    * @name dxsparklineoptions_showminmax
    * @publicName showMinMax
    * @type boolean
    * @default false
    */
    showMinMax: false,
    /**
	* @name dxsparklineoptions_mincolor
	* @publicName minColor
	* @type string
	* @default '#e8c267'
	*/
    minColor: '#e8c267',
    /**
	* @name dxsparklineoptions_maxcolor
	* @publicName maxColor
	* @type string
	* @default '#e55253'
	*/
    maxColor: '#e55253',
    /**
	* @name dxsparklineoptions_firstlastcolor
	* @publicName firstLastColor
	* @type string
	* @default '#666666'
	*/
    firstLastColor: '#666666',
    /**
	* @name dxsparklineoptions_barpositivecolor
	* @publicName barPositiveColor
	* @type string
	* @default '#a9a9a9'
	*/
    barPositiveColor: '#a9a9a9',
    /**
	* @name dxsparklineoptions_barnegativecolor
	* @publicName barNegativeColor
	* @type string
	* @default '#d7d7d7'
	*/
    barNegativeColor: '#d7d7d7',
    /**
	* @name dxsparklineoptions_wincolor
	* @publicName winColor
	* @type string
	* @default '#a9a9a9'
	*/
    winColor: '#a9a9a9',
    /**
	* @name dxsparklineoptions_losscolor
	* @publicName lossColor
	* @type string
	* @default '#d7d7d7'
	*/
    lossColor: '#d7d7d7',
    /**
    * @name dxsparklineoptions_pointsymbol
    * @publicName pointSymbol
    * @type string
    * @default 'circle'
    * @acceptValues 'circle' | 'square' | 'polygon' | 'triangle' | 'cross'
    */
    pointSymbol: 'circle',
    /**
    * @name dxsparklineoptions_pointsize
    * @publicName pointSize
    * @type number
    * @default 4
    */
    pointSize: 4,
    /**
    * @name dxsparklineoptions_pointcolor
    * @publicName pointColor
    * @type string
    * @default '#ffffff'
    */
    pointColor: '#ffffff',
    /**
	* @name dxsparklineoptions_winlossthreshold
	* @publicName winlossThreshold
	* @type number
	* @default 0
	*/
    winlossThreshold: 0,
    /**
    * @name dxsparklineoptions_ignoreemptypoints
    * @publicName ignoreEmptyPoints
    * @type boolean
    * @default false
    */
    ignoreEmptyPoints: false,
    /**
    * @name dxsparklineoptions_minvalue
    * @publicName minValue
    * @type number
    * @default undefined
    */
    minValue: undefined,
    /**
    * @name dxsparklineoptions_maxvalue
    * @publicName maxValue
    * @type number
    * @default undefined
    */
    maxValue: undefined,
    /**
    * @name dxsparklinemethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};

/**
* @name dxbullet
* @publicName dxBullet
* @inherits BaseSparkline
* @groupName Data Management and Visualization
* @module viz/bullet
* @export default
*/
var dxBullet = {
    /**
    * @name dxbulletoptions_value
    * @publicName value
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    value: 0,
    /**
    * @name dxbulletoptions_target
    * @publicName target
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    target: 0,
    /**
    * @name dxbulletoptions_startscalevalue
    * @publicName startScaleValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startScaleValue: 0,
    /**
    * @name dxbulletoptions_endscalevalue
    * @publicName endScaleValue
    * @type number
    * @default undefined
    * @notUsedInTheme
    */
    endScaleValue: undefined,
    /**
    * @name dxbulletoptions_color
    * @publicName color
    * @type string
    * @default '#e8c267'
    */
    color: '#e8c267',
    /**
    * @name dxbulletoptions_targetcolor
    * @publicName targetColor
    * @type string
    * @default '#666666'
    */
    targetColor: '#666666',
    /**
    * @name dxbulletoptions_targetwidth
    * @publicName targetWidth
    * @type number
    * @default 4
    */
    targetWidth: 4,
    /**
    * @name dxbulletoptions_showtarget
    * @publicName showTarget
    * @type boolean
    * @default true
    */
    showTarget: true,
    /**
    * @name dxbulletoptions_showzerolevel
    * @publicName showZeroLevel
    * @type boolean
    * @default true
    */
    showZeroLevel: true
};
