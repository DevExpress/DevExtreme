const BaseSparkline = require('./base_sparkline');

const dataValidatorModule = require('../components/data_validator');
const seriesModule = require('../series/base_series');
const MIN_BAR_WIDTH = 1;
const MAX_BAR_WIDTH = 50;
const DEFAULT_BAR_INTERVAL = 4;

const DEFAULT_CANVAS_WIDTH = 250;
const DEFAULT_CANVAS_HEIGHT = 30;

const DEFAULT_POINT_BORDER = 2;

const ALLOWED_TYPES = {
    'line': true,
    'spline': true,
    'stepline': true,
    'area': true,
    'steparea': true,
    'splinearea': true,
    'bar': true,
    'winloss': true
};

const _math = Math;
const _abs = _math.abs;
const _round = _math.round;
const _max = _math.max;
const _min = _math.min;
const _isFinite = isFinite;
const vizUtils = require('../core/utils');
const _map = vizUtils.map;
const _normalizeEnum = vizUtils.normalizeEnum;
const _isDefined = require('../../core/utils/type').isDefined;
const _Number = Number;
const _String = String;

function findMinMax(data, valField) {
    const firstItem = data[0] || {};
    const firstValue = firstItem[valField] || 0;
    let min = firstValue;
    let max = firstValue;
    let minIndexes = [0];
    let maxIndexes = [0];
    const dataLength = data.length;
    let value;
    let i;

    for(i = 1; i < dataLength; i++) {
        value = data[i][valField];
        if(value < min) {
            min = value;
            minIndexes = [i];
        } else if(value === min) {
            minIndexes.push(i);
        }
        if(value > max) {
            max = value;
            maxIndexes = [i];
        } else if(value === max) {
            maxIndexes.push(i);
        }
    }

    if(max === min) {
        minIndexes = maxIndexes = [];
    }
    return { minIndexes, maxIndexes };
}

function parseNumericDataSource(data, argField, valField, ignoreEmptyPoints) {
    return _map(data, function(dataItem, index) {
        let item = null;
        let isDataNumber;
        let value;

        if(dataItem !== undefined) {
            item = {};
            isDataNumber = _isFinite(dataItem);
            item[argField] = isDataNumber ? _String(index) : dataItem[argField];
            value = isDataNumber ? dataItem : dataItem[valField];
            item[valField] = value === null ? ignoreEmptyPoints ? undefined : value : _Number(value);
            item = (item[argField] !== undefined && item[valField] !== undefined) ? item : null;
        }
        return item;
    });
}

function parseWinlossDataSource(data, argField, valField, target) {
    const lowBarValue = -1;
    const zeroBarValue = 0;
    const highBarValue = 1;
    const delta = 0.0001;

    return _map(data, function(dataItem) {
        const item = {};
        item[argField] = dataItem[argField];
        if(_abs(dataItem[valField] - target) < delta) {
            item[valField] = zeroBarValue;
        } else if(dataItem[valField] > target) {
            item[valField] = highBarValue;
        } else {
            item[valField] = lowBarValue;
        }
        return item;
    });
}

function selectPointColor(color, options, index, pointIndexes) {
    if((index === pointIndexes.first) || (index === pointIndexes.last)) {
        color = options.firstLastColor;
    }
    if((pointIndexes.min || []).indexOf(index) >= 0) {
        color = options.minColor;
    }
    if((pointIndexes.max || []).indexOf(index) >= 0) {
        color = options.maxColor;
    }
    return color;
}

function createLineCustomizeFunction(pointIndexes, options) {
    return function() {
        const color = selectPointColor(undefined, options, this.index, pointIndexes);

        return color ? { visible: true, border: { color: color } } : {};
    };
}

function createBarCustomizeFunction(pointIndexes, options, winlossData) {
    return function() {
        const index = this.index;
        const isWinloss = options.type === 'winloss';
        const target = isWinloss ? options.winlossThreshold : 0;
        const value = isWinloss ? winlossData[index][options.valueField] : this.value;
        const positiveColor = isWinloss ? options.winColor : options.barPositiveColor;
        const negativeColor = isWinloss ? options.lossColor : options.barNegativeColor;

        return { color: selectPointColor((value >= target) ? positiveColor : negativeColor, options, index, pointIndexes) };
    };
}

const dxSparkline = BaseSparkline.inherit({
    _rootClassPrefix: 'dxsl',

    _rootClass: 'dxsl-sparkline',

    _themeSection: 'sparkline',

    _defaultSize: {
        width: DEFAULT_CANVAS_WIDTH,
        height: DEFAULT_CANVAS_HEIGHT
    },

    _initCore: function() {
        this.callBase();
        this._createSeries();
    },

    _initialChanges: ['DATA_SOURCE'],

    _dataSourceChangedHandler: function() {
        this._requestChange(['UPDATE']);
    },

    _updateWidgetElements: function() {
        this._updateSeries();
        this.callBase();
    },

    _disposeWidgetElements: function() {
        const that = this;

        that._series && that._series.dispose();
        that._series = that._seriesGroup = that._seriesLabelGroup = null;
    },

    _cleanWidgetElements: function() {
        this._seriesGroup.remove();
        this._seriesLabelGroup.remove();
        this._seriesGroup.clear();
        this._seriesLabelGroup.clear();
    },

    _drawWidgetElements: function() {
        if(this._dataIsLoaded()) {
            this._drawSeries();
            this._drawn();
        }
    },

    _getCorrectCanvas: function() {
        const options = this._allOptions;
        const canvas = this._canvas;
        const halfPointSize = options.pointSize && Math.ceil(options.pointSize / 2) + DEFAULT_POINT_BORDER;
        const type = options.type;
        if(type !== 'bar' && type !== 'winloss' && (options.showFirstLast || options.showMinMax)) {
            return {
                width: canvas.width,
                height: canvas.height,
                left: canvas.left + halfPointSize,
                right: canvas.right + halfPointSize,
                top: canvas.top + halfPointSize,
                bottom: canvas.bottom + halfPointSize
            };
        }
        return canvas;
    },

    _prepareOptions: function() {
        const that = this;

        that._allOptions = that.callBase();

        that._allOptions.type = _normalizeEnum(that._allOptions.type);
        if(!ALLOWED_TYPES[that._allOptions.type]) {
            that._allOptions.type = 'line';
        }
    },

    _createHtmlElements: function() {
        this._seriesGroup = this._renderer.g().attr({ 'class': 'dxsl-series' });
        this._seriesLabelGroup = this._renderer.g().attr({ 'class': 'dxsl-series-labels' });
    },

    _createSeries: function() {
        this._series = new seriesModule.Series({
            renderer: this._renderer,
            seriesGroup: this._seriesGroup,
            labelsGroup: this._seriesLabelGroup,

            argumentAxis: this._argumentAxis,
            valueAxis: this._valueAxis
        }, {
            widgetType: 'chart',
            type: 'line'
        });
    },

    ///#DEBUG
    getSeriesOptions: function() {
        return this._series.getOptions();
    },
    ///#ENDDEBUG

    _updateSeries: function() {
        const that = this;
        let groupsData;
        let seriesOptions;
        const singleSeries = that._series;

        that._prepareDataSource();
        seriesOptions = that._prepareSeriesOptions();
        singleSeries.updateOptions(seriesOptions);

        groupsData = { groups: [{ series: [singleSeries] }] };
        groupsData.argumentOptions = {
            type: seriesOptions.type === 'bar' ? 'discrete' : undefined
        };

        that._simpleDataSource = dataValidatorModule.validateData(that._simpleDataSource, groupsData, that._incidentOccurred, {
            checkTypeForAllData: false,
            convertToAxisDataType: true,
            sortingMethod: true
        })[singleSeries.getArgumentField()];

        seriesOptions.customizePoint = that._getCustomizeFunction();
        singleSeries.updateData(that._simpleDataSource);
        singleSeries.createPoints();

        that._groupsDataCategories = groupsData.categories;
    },

    _optionChangesMap: {
        dataSource: 'DATA_SOURCE'
    },

    _optionChangesOrder: ['DATA_SOURCE'],

    _change_DATA_SOURCE: function() {
        this._updateDataSource();
    },

    _prepareDataSource: function() {
        const that = this;
        const options = that._allOptions;
        const argField = options.argumentField;
        const valField = options.valueField;
        const dataSource = that._dataSourceItems() || [];
        const data = parseNumericDataSource(dataSource, argField, valField, that.option('ignoreEmptyPoints'));

        if(options.type === 'winloss') {
            that._winlossDataSource = data;
            that._simpleDataSource = parseWinlossDataSource(data, argField, valField, options.winlossThreshold);
        } else {
            that._simpleDataSource = data;
        }
    },

    _prepareSeriesOptions: function() {
        const that = this;
        const options = that._allOptions;
        const type = (options.type === 'winloss') ? 'bar' : options.type;

        return {
            visible: true,
            argumentField: options.argumentField,
            valueField: options.valueField,
            color: options.lineColor,
            width: options.lineWidth,
            widgetType: 'chart',
            type: type,
            opacity: type.indexOf('area') !== -1 ? that._allOptions.areaOpacity : undefined,
            point: {
                size: options.pointSize,
                symbol: options.pointSymbol,
                border: {
                    visible: true,
                    width: DEFAULT_POINT_BORDER
                },
                color: options.pointColor,
                visible: false,
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                }
            },
            border: {
                color: options.lineColor,
                width: options.lineWidth,
                visible: type !== 'bar'
            }
        };
    },

    _getCustomizeFunction: function() {
        const that = this;
        const options = that._allOptions;
        const dataSource = that._winlossDataSource || that._simpleDataSource;
        const drawnPointIndexes = that._getExtremumPointsIndexes(dataSource);
        let customizeFunction;

        if((options.type === 'winloss') || (options.type === 'bar')) {
            customizeFunction = createBarCustomizeFunction(drawnPointIndexes, options, that._winlossDataSource);
        } else {
            customizeFunction = createLineCustomizeFunction(drawnPointIndexes, options);
        }
        return customizeFunction;
    },

    _getExtremumPointsIndexes: function(data) {
        const that = this;
        const options = that._allOptions;
        const lastIndex = data.length - 1;
        const indexes = {};

        that._minMaxIndexes = findMinMax(data, options.valueField);

        if(options.showFirstLast) {
            indexes.first = 0;
            indexes.last = lastIndex;
        }
        if(options.showMinMax) {
            indexes.min = that._minMaxIndexes.minIndexes;
            indexes.max = that._minMaxIndexes.maxIndexes;
        }

        return indexes;
    },

    _getStick: function() {
        return {
            stick: this._series.type !== 'bar'
        };
    },

    _updateRange: function() {
        const that = this;
        const series = that._series;
        const type = series.type;
        const isBarType = type === 'bar';
        const isWinlossType = type === 'winloss';

        const DEFAULT_VALUE_RANGE_MARGIN = 0.15;
        const DEFAULT_ARGUMENT_RANGE_MARGIN = 0.1;
        const WINLOSS_MAX_RANGE = 1;
        const WINLOSS_MIN_RANGE = -1;

        const rangeData = series.getRangeData();
        const minValue = that._allOptions.minValue;
        const hasMinY = _isDefined(minValue) && _isFinite(minValue);
        const maxValue = that._allOptions.maxValue;
        const hasMaxY = _isDefined(maxValue) && _isFinite(maxValue);
        let valCoef;
        let argCoef;

        valCoef = (rangeData.val.max - rangeData.val.min) * DEFAULT_VALUE_RANGE_MARGIN;
        if(isBarType || isWinlossType || type === 'area') {
            if(rangeData.val.min !== 0) {
                rangeData.val.min -= valCoef;
            }
            if(rangeData.val.max !== 0) {
                rangeData.val.max += valCoef;
            }
        } else {
            rangeData.val.min -= valCoef;
            rangeData.val.max += valCoef;
        }

        if(hasMinY || hasMaxY) {
            if(hasMinY && hasMaxY) {
                rangeData.val.minVisible = _min(minValue, maxValue);
                rangeData.val.maxVisible = _max(minValue, maxValue);
            } else {
                rangeData.val.minVisible = hasMinY ? _Number(minValue) : undefined;
                rangeData.val.maxVisible = hasMaxY ? _Number(maxValue) : undefined;
            }

            if(isWinlossType) {
                rangeData.val.minVisible = hasMinY ? _max(rangeData.val.minVisible, WINLOSS_MIN_RANGE) : undefined;
                rangeData.val.maxVisible = hasMaxY ? _min(rangeData.val.maxVisible, WINLOSS_MAX_RANGE) : undefined;
            }
        }

        if(series.getPoints().length > 1) {
            if(isBarType) {
                argCoef = (rangeData.arg.max - rangeData.arg.min) * DEFAULT_ARGUMENT_RANGE_MARGIN;
                rangeData.arg.min = rangeData.arg.min - argCoef;
                rangeData.arg.max = rangeData.arg.max + argCoef;
            }
        }

        rangeData.arg.categories = that._groupsDataCategories;
        that._ranges = rangeData;
    },

    _getBarWidth: function(pointsCount) {
        const that = this;
        const canvas = that._canvas;
        const intervalWidth = pointsCount * DEFAULT_BAR_INTERVAL;
        const rangeWidth = canvas.width - canvas.left - canvas.right - intervalWidth;
        let width = _round(rangeWidth / pointsCount);

        if(width < MIN_BAR_WIDTH) {
            width = MIN_BAR_WIDTH;
        }
        if(width > MAX_BAR_WIDTH) {
            width = MAX_BAR_WIDTH;
        }
        return width;
    },

    _correctPoints: function() {
        const that = this;
        const seriesType = that._allOptions.type;
        const seriesPoints = that._series.getPoints();
        const pointsLength = seriesPoints.length;
        let barWidth;
        let i;

        if(seriesType === 'bar' || seriesType === 'winloss') {
            barWidth = that._getBarWidth(pointsLength);
            for(i = 0; i < pointsLength; i++) {
                seriesPoints[i].correctCoordinates({ width: barWidth, offset: 0 });
            }
        }
    },

    _drawSeries: function() {
        const that = this;

        if(that._simpleDataSource.length > 0) {
            that._correctPoints();
            that._series.draw();
            that._seriesGroup.append(that._renderer.root);
        }
    },

    _isTooltipEnabled: function() {
        return !!this._simpleDataSource.length;
    },

    _getTooltipData: function() {
        const that = this;
        const options = that._allOptions;
        const dataSource = that._winlossDataSource || that._simpleDataSource;
        const tooltip = that._tooltip;

        if(dataSource.length === 0) {
            return {};
        }

        const minMax = that._minMaxIndexes;
        const valueField = options.valueField;
        const first = dataSource[0][valueField];
        const last = dataSource[dataSource.length - 1][valueField];
        const min = _isDefined(minMax.minIndexes[0]) ? dataSource[minMax.minIndexes[0]][valueField] : first;
        const max = _isDefined(minMax.maxIndexes[0]) ? dataSource[minMax.maxIndexes[0]][valueField] : first;
        const formattedFirst = tooltip.formatValue(first);
        const formattedLast = tooltip.formatValue(last);
        const formattedMin = tooltip.formatValue(min);
        const formattedMax = tooltip.formatValue(max);
        const customizeObject = {
            firstValue: formattedFirst,
            lastValue: formattedLast,
            minValue: formattedMin,
            maxValue: formattedMax,
            originalFirstValue: first,
            originalLastValue: last,
            originalMinValue: min,
            originalMaxValue: max,
            valueText: ['Start:', formattedFirst, 'End:', formattedLast, 'Min:', formattedMin, 'Max:', formattedMax]
        };

        if(options.type === 'winloss') {
            customizeObject.originalThresholdValue = options.winlossThreshold;
            customizeObject.thresholdValue = tooltip.formatValue(options.winlossThreshold);
        }

        return customizeObject;
    }
});

_map(['lineColor', 'lineWidth', 'areaOpacity', 'minColor', 'maxColor', 'barPositiveColor', 'barNegativeColor',
    'winColor', 'lessColor', 'firstLastColor', 'pointSymbol', 'pointColor', 'pointSize',
    'type', 'argumentField', 'valueField', 'winlossThreshold', 'showFirstLast', 'showMinMax',
    'ignoreEmptyPoints', 'minValue', 'maxValue'
], function(name) {
    dxSparkline.prototype._optionChangesMap[name] = 'OPTIONS';
});

require('../../core/component_registrator')('dxSparkline', dxSparkline);

module.exports = dxSparkline;
// PLUGINS_SECTION
dxSparkline.addPlugin(require('../core/data_source').plugin);
