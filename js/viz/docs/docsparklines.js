
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
    tooltip: {
        enabled: true,
        customizeTooltip: undefined,
        contentTemplate: undefined
    },
    onTooltipShown: function() { },
    onTooltipHidden: function() { }
};


var dxSparkline = {
    dataSource: undefined,
    argumentField: 'arg',
    valueField: 'val',
    type: 'line',
    lineColor: '#666666',
    lineWidth: 2,
    showFirstLast: true,
    showMinMax: false,
    minColor: '#e8c267',
    maxColor: '#e55253',
    firstLastColor: '#666666',
    barPositiveColor: '#a9a9a9',
    barNegativeColor: '#d7d7d7',
    winColor: '#a9a9a9',
    lossColor: '#d7d7d7',
    pointSymbol: 'circle',
    pointSize: 4,
    pointColor: '#ffffff',
    winlossThreshold: 0,
    ignoreEmptyPoints: false,
    minValue: undefined,
    maxValue: undefined
};

var dxBullet = {
    value: 0,
    target: 0,
    startScaleValue: 0,
    endScaleValue: undefined,
    color: '#e8c267',
    targetColor: '#666666',
    targetWidth: 4,
    showTarget: true,
    showZeroLevel: true
};
