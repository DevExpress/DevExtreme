/**
* @name BaseSparkline
* @type object
* @hidden
* @inherits BaseWidget
*/
var BaseSparkline = {
    /**
    * @name BaseSparklineOptions.redrawOnResize
    * @hidden
    */
    redrawOnResize: undefined,
    /**
    * @name BaseSparklineOptions.title
    * @hidden
    */
    title: undefined,
    /**
    * @name BaseSparklineOptions.export
    * @hidden
    */
    "export": undefined,
    /**
    * @name BaseSparklineOptions.loadingIndicator
    * @hidden
    */
    loadingIndicator: undefined,
    /**
    * @name basesparklinemethods.showLoadingIndicator
    * @publicName showLoadingIndicator()
    * @hidden
    */
    showLoadingIndicator: function() { },
    /**
    * @name basesparklinemethods.hideLoadingIndicator
    * @publicName hideLoadingIndicator()
    * @hidden
    */
    hideLoadingIndicator: function() { },
    /**
    * @name BaseSparklineOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseSparklineOptions.tooltip.enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name BaseSparklineOptions.tooltip.customizeTooltip
        * @type function(pointsInfo)
        * @type_function_param1 pointsInfo:object
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined
    },
    /**
    * @name BaseSparklineOptions.onTooltipShown
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name BaseSparklineOptions.onTooltipHidden
    * @extends Action
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { }
};


/**
* @name dxSparkline
* @inherits BaseSparkline, DataHelperMixin
* @module viz/sparkline
* @export default
*/
var dxSparkline = {
   /**
   * @name dxSparkLineOptions.dataSource
   * @extends CommonVizDataSource
   */
    dataSource: undefined,
    /**
	* @name dxSparkLineOptions.argumentField
	* @type string
	* @default 'arg'
	*/
    argumentField: 'arg',
    /**
	* @name dxSparkLineOptions.valueField
	* @type string
	* @default 'val'
	*/
    valueField: 'val',
    /**
    * @name dxSparkLineOptions.type
    * @type Enums.SparklineType
    * @default 'line'
    */
    type: 'line',
    /**
    * @name dxSparkLineOptions.lineColor
    * @type string
    * @default '#666666'
    */
    lineColor: '#666666',
    /**
    * @name dxSparkLineOptions.lineWidth
    * @type number
    * @default 2
    */
    lineWidth: 2,
    /**
    * @name dxSparkLineOptions.showFirstLast
    * @type boolean
    * @default true
    */
    showFirstLast: true,
    /**
    * @name dxSparkLineOptions.showMinMax
    * @type boolean
    * @default false
    */
    showMinMax: false,
    /**
	* @name dxSparkLineOptions.minColor
	* @type string
	* @default '#e8c267'
	*/
    minColor: '#e8c267',
    /**
	* @name dxSparkLineOptions.maxColor
	* @type string
	* @default '#e55253'
	*/
    maxColor: '#e55253',
    /**
	* @name dxSparkLineOptions.firstLastColor
	* @type string
	* @default '#666666'
	*/
    firstLastColor: '#666666',
    /**
	* @name dxSparkLineOptions.barPositiveColor
	* @type string
	* @default '#a9a9a9'
	*/
    barPositiveColor: '#a9a9a9',
    /**
	* @name dxSparkLineOptions.barNegativeColor
	* @type string
	* @default '#d7d7d7'
	*/
    barNegativeColor: '#d7d7d7',
    /**
	* @name dxSparkLineOptions.winColor
	* @type string
	* @default '#a9a9a9'
	*/
    winColor: '#a9a9a9',
    /**
	* @name dxSparkLineOptions.lossColor
	* @type string
	* @default '#d7d7d7'
	*/
    lossColor: '#d7d7d7',
    /**
    * @name dxSparkLineOptions.pointSymbol
    * @type Enums.VizPointSymbol
    * @default 'circle'
    */
    pointSymbol: 'circle',
    /**
    * @name dxSparkLineOptions.pointSize
    * @type number
    * @default 4
    */
    pointSize: 4,
    /**
    * @name dxSparkLineOptions.pointColor
    * @type string
    * @default '#ffffff'
    */
    pointColor: '#ffffff',
    /**
	* @name dxSparkLineOptions.winlossThreshold
	* @type number
	* @default 0
	*/
    winlossThreshold: 0,
    /**
    * @name dxSparkLineOptions.ignoreEmptyPoints
    * @type boolean
    * @default false
    */
    ignoreEmptyPoints: false,
    /**
    * @name dxSparkLineOptions.minValue
    * @type number
    * @default undefined
    */
    minValue: undefined,
    /**
    * @name dxSparkLineOptions.maxValue
    * @type number
    * @default undefined
    */
    maxValue: undefined
};

/**
* @name dxBullet
* @inherits BaseSparkline
* @module viz/bullet
* @export default
*/
var dxBullet = {
    /**
    * @name dxBulletOptions.value
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    value: 0,
    /**
    * @name dxBulletOptions.target
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    target: 0,
    /**
    * @name dxBulletOptions.startScaleValue
    * @type number
    * @default 0
    * @notUsedInTheme
    */
    startScaleValue: 0,
    /**
    * @name dxBulletOptions.endScaleValue
    * @type number
    * @default undefined
    * @notUsedInTheme
    */
    endScaleValue: undefined,
    /**
    * @name dxBulletOptions.color
    * @type string
    * @default '#e8c267'
    */
    color: '#e8c267',
    /**
    * @name dxBulletOptions.targetColor
    * @type string
    * @default '#666666'
    */
    targetColor: '#666666',
    /**
    * @name dxBulletOptions.targetWidth
    * @type number
    * @default 4
    */
    targetWidth: 4,
    /**
    * @name dxBulletOptions.showTarget
    * @type boolean
    * @default true
    */
    showTarget: true,
    /**
    * @name dxBulletOptions.showZeroLevel
    * @type boolean
    * @default true
    */
    showZeroLevel: true
};
