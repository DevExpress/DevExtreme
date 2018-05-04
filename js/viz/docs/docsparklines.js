/**
* @name basesparkline
* @publicName BaseSparkline
* @type object
* @hidden
* @inherits BaseWidget
*/
var BaseSparkline = {
    /**
    * @name basesparkline.options
    * @publicName Options
    * @namespace DevExpress.viz.sparklines
    * @hidden
    */        
    /**
    * @name basesparklineoptions.redrawOnResize
    * @publicName redrawOnResize
    * @hidden
    * @inheritdoc
    */
    redrawOnResize: undefined,
    /**
    * @name basesparklineoptions.title
    * @publicName title
    * @hidden
    * @inheritdoc
    */
    title: undefined,
    /**
    * @name basesparklineoptions.export
    * @publicName export
    * @hidden
    * @inheritdoc
    */
    "export": undefined,
    /**
    * @name basesparklineoptions.loadingIndicator
    * @publicName loadingIndicator
    * @hidden
    * @inheritdoc
    */
    loadingIndicator: undefined,
    /**
    * @name basesparklinemethods.showLoadingIndicator
    * @publicName showLoadingIndicator()
    * @hidden
    * @inheritdoc
    */
    showLoadingIndicator: function() { },
    /**
    * @name basesparklinemethods.hideLoadingIndicator
    * @publicName hideLoadingIndicator()
    * @hidden
    * @inheritdoc
    */
    hideLoadingIndicator: function() { },
    /**
    * @name basesparklineoptions.tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name basesparklineoptions.tooltip.enabled
        * @type boolean
        * @publicName enabled
        * @default true
        * @inheritdoc
        */
        enabled: true,
        /**
        * @name basesparklineoptions.tooltip.verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default undefined
        * @deprecated
        */
        verticalAlignment: 'top',
        /**
        * @name basesparklineoptions.tooltip.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        * @deprecated
        */
        horizontalAlignment: 'center',
        /**
        * @name basesparklineoptions.tooltip.customizetooltip
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
    * @name basesparklineoptions.ontooltipshown
    * @publicName onTooltipShown
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name basesparklineoptions.ontooltiphidden
    * @publicName onTooltipHidden
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};


/**
* @name dxsparkline
* @publicName dxSparkline
* @inherits BaseSparkline
* @module viz/sparkline
* @export default
*/
var dxSparkline = {
    /**
    * @name dxsparkline.options
    * @publicName Options
    * @namespace DevExpress.viz.sparklines
    * @hidden
    */       
    /**
   * @name dxsparklineoptions.datasource
   * @publicName dataSource
   * @extends CommonVizDataSource
   */
    dataSource: undefined,
    /**
	* @name dxsparklineoptions.argumentfield
	* @publicName argumentField
	* @type string
	* @default 'arg'
	*/
    argumentField: 'arg',
    /**
	* @name dxsparklineoptions.valuefield
	* @publicName valueField
	* @type string
	* @default 'val'
	*/
    valueField: 'val',
    /**
    * @name dxsparklineoptions.type
    * @publicName type
    * @type Enums.SparklineType
    * @default 'line'
    */
    type: 'line',
    /**
	* @name dxsparklineoptions.linecolor
	* @publicName lineColor
	* @type string
	* @default '#666666'
	*/
    lineColor: '#666666',
    /**
	* @name dxsparklineoptions.linewidth
	* @publicName lineWidth
	* @type number
	* @default 2
	*/
    lineWidth: 2,
    /**
    * @name dxsparklineoptions.showfirstlast
    * @publicName showFirstLast
    * @type boolean
    * @default true
    */
    showFirstLast: true,
    /**
    * @name dxsparklineoptions.showminmax
    * @publicName showMinMax
    * @type boolean
    * @default false
    */
    showMinMax: false,
    /**
	* @name dxsparklineoptions.mincolor
	* @publicName minColor
	* @type string
	* @default '#e8c267'
	*/
    minColor: '#e8c267',
    /**
	* @name dxsparklineoptions.maxcolor
	* @publicName maxColor
	* @type string
	* @default '#e55253'
	*/
    maxColor: '#e55253',
    /**
	* @name dxsparklineoptions.firstlastcolor
	* @publicName firstLastColor
	* @type string
	* @default '#666666'
	*/
    firstLastColor: '#666666',
    /**
	* @name dxsparklineoptions.barpositivecolor
	* @publicName barPositiveColor
	* @type string
	* @default '#a9a9a9'
	*/
    barPositiveColor: '#a9a9a9',
    /**
	* @name dxsparklineoptions.barnegativecolor
	* @publicName barNegativeColor
	* @type string
	* @default '#d7d7d7'
	*/
    barNegativeColor: '#d7d7d7',
    /**
	* @name dxsparklineoptions.wincolor
	* @publicName winColor
	* @type string
	* @default '#a9a9a9'
	*/
    winColor: '#a9a9a9',
    /**
	* @name dxsparklineoptions.losscolor
	* @publicName lossColor
	* @type string
	* @default '#d7d7d7'
	*/
    lossColor: '#d7d7d7',
    /**
    * @name dxsparklineoptions.pointsymbol
    * @publicName pointSymbol
    * @type Enums.VizPointSymbol
    * @default 'circle'
    */
    pointSymbol: 'circle',
    /**
    * @name dxsparklineoptions.pointsize
    * @publicName pointSize
    * @type number
    * @default 4
    */
    pointSize: 4,
    /**
    * @name dxsparklineoptions.pointcolor
    * @publicName pointColor
    * @type string
    * @default '#ffffff'
    */
    pointColor: '#ffffff',
    /**
	* @name dxsparklineoptions.winlossthreshold
	* @publicName winlossThreshold
	* @type number
	* @default 0
	*/
    winlossThreshold: 0,
    /**
    * @name dxsparklineoptions.ignoreemptypoints
    * @publicName ignoreEmptyPoints
    * @type boolean
    * @default false
    */
    ignoreEmptyPoints: false,
    /**
    * @name dxsparklineoptions.minvalue
    * @publicName minValue
    * @type number
    * @default undefined
    */
    minValue: undefined,
    /**
    * @name dxsparklineoptions.maxvalue
    * @publicName maxValue
    * @type number
    * @default undefined
    */
    maxValue: undefined,
    /**
    * @name dxsparklinemethods.getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};

/**
* @name dxbullet
* @publicName dxBullet
* @inherits BaseSparkline
* @module viz/bullet
* @export default
*/
var dxBullet = {
    /**
    * @name dxbullet.options
    * @publicName Options
    * @namespace DevExpress.viz.sparklines
    * @hidden
    */       
    /**
    * @name dxbulletoptions.value
    * @publicName value
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    value: 0,
    /**
    * @name dxbulletoptions.target
    * @publicName target
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    target: 0,
    /**
    * @name dxbulletoptions.startscalevalue
    * @publicName startScaleValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startScaleValue: 0,
    /**
    * @name dxbulletoptions.endscalevalue
    * @publicName endScaleValue
    * @type number
    * @default undefined
    * @notUsedInTheme
    */
    endScaleValue: undefined,
    /**
    * @name dxbulletoptions.color
    * @publicName color
    * @type string
    * @default '#e8c267'
    */
    color: '#e8c267',
    /**
    * @name dxbulletoptions.targetcolor
    * @publicName targetColor
    * @type string
    * @default '#666666'
    */
    targetColor: '#666666',
    /**
    * @name dxbulletoptions.targetwidth
    * @publicName targetWidth
    * @type number
    * @default 4
    */
    targetWidth: 4,
    /**
    * @name dxbulletoptions.showtarget
    * @publicName showTarget
    * @type boolean
    * @default true
    */
    showTarget: true,
    /**
    * @name dxbulletoptions.showzerolevel
    * @publicName showZeroLevel
    * @type boolean
    * @default true
    */
    showZeroLevel: true
};
