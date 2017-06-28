"use strict";

var $ = require("../../core/renderer"),
    seriesModule = require("../series/base_series"),
    seriesFamilyModule = require("../core/series_family"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    vizUtils = require("../core/utils"),
    rangeModule = require("../translators/range"),
    dataValidatorModule = require("../components/data_validator"),
    ChartThemeManager = require("../components/chart_theme_manager").ThemeManager,
    SeriesDataSource;

var createThemeManager = function(chartOptions) {
    return new ChartThemeManager(chartOptions, 'rangeSelector.chart');
};

var processSeriesFamilies = function(series, equalBarWidth, minBubbleSize, maxBubbleSize, barWidth, negativesAsZeroes) {
    var families = [],
        types = [];

    $.each(series, function(i, item) {
        if(inArray(item.type, types) === -1) {
            types.push(item.type);
        }
    });

    $.each(types, function(_, type) {
        var family = new seriesFamilyModule.SeriesFamily({
            type: type,
            equalBarWidth: equalBarWidth,
            minBubbleSize: minBubbleSize,
            maxBubbleSize: maxBubbleSize,
            barWidth: barWidth,
            negativesAsZeroes: negativesAsZeroes
        });
        family.add(series);
        family.adjustSeriesValues();
        families.push(family);
    });

    return families;
};

var isStickType = function(type) {
    var nonStickTypes = ["bar", "candlestick", "stock", "bubble"],
        stickType = true;

    type = vizUtils.normalizeEnum(type);
    $.each(nonStickTypes, function(_, item) {
        if(type.indexOf(item) !== -1) {
            stickType = false;
            return false;
        }
    });


    return stickType;
};

// TODO: This is copypaste from the same name method in the advancedChart.js
function setTemplateFields(data, templateData, series) {
    $.each(data, function(_, data) {
        $.each(series.getTemplateFields(), function(_, field) {
            data[field.templateField] = data[field.originalField];
        });
        templateData.push(data);
    });
    series.updateTemplateFieldNames();
}

SeriesDataSource = function(options) {
    var that = this,
        templatedSeries,
        seriesTemplate,
        themeManager = that._themeManager = createThemeManager(options.chart),
        topIndent,
        bottomIndent,
        negativesAsZeroes,
        negativesAsZeros;

    themeManager._fontFields = ["commonSeriesSettings.label.font"];
    themeManager.setTheme(options.chart.theme);
    topIndent = themeManager.getOptions('topIndent');
    bottomIndent = themeManager.getOptions('bottomIndent');

    that._indent = {
        top: (topIndent >= 0 && topIndent < 1) ? topIndent : 0,
        bottom: (bottomIndent >= 0 && bottomIndent < 1) ? bottomIndent : 0
    };
    that._valueAxis = themeManager.getOptions('valueAxisRangeSelector') || {};
    that._hideChart = false;

    seriesTemplate = themeManager.getOptions('seriesTemplate');

    if(options.dataSource && seriesTemplate) {
        templatedSeries = vizUtils.processSeriesTemplate(seriesTemplate, options.dataSource);
    }
    that._useAggregation = options.chart.useAggregation;
    that._series = that._calculateSeries(options, templatedSeries);

    negativesAsZeroes = themeManager.getOptions("negativesAsZeroes");
    negativesAsZeros = themeManager.getOptions("negativesAsZeros"); //misspelling case

    that._seriesFamilies = processSeriesFamilies(that._series,
        themeManager.getOptions('equalBarWidth'),
        themeManager.getOptions('minBubbleSize'),
        themeManager.getOptions('maxBubbleSize'),
        themeManager.getOptions('barWidth'),
        typeUtils.isDefined(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros);
};

SeriesDataSource.prototype = {
    constructor: SeriesDataSource,

    _calculateSeries: function(options, templatedSeries) {
        var that = this,
            series = [],
            particularSeriesOptions,
            seriesTheme,
            data,
            parsedData,
            chartThemeManager = that._themeManager,
            hasSeriesTemplate = !!chartThemeManager.getOptions('seriesTemplate'),
            allSeriesOptions = hasSeriesTemplate ? templatedSeries : options.chart.series,
            seriesValueType = options.chart.valueAxis && options.chart.valueAxis.valueType,
            dataSourceField,
            i,
            newSeries,
            groupsData;

        that.templateData = [];
        if(options.dataSource && !allSeriesOptions) {
            dataSourceField = options.dataSourceField || 'arg';
            allSeriesOptions = {
                argumentField: dataSourceField,
                valueField: dataSourceField
            };
            that._hideChart = true;
        }

        allSeriesOptions = (Array.isArray(allSeriesOptions) ? allSeriesOptions : (allSeriesOptions ? [allSeriesOptions] : []));

        for(i = 0; i < allSeriesOptions.length; i++) {
            particularSeriesOptions = extend(true, {
                incidentOccurred: options.incidentOccurred
            }, allSeriesOptions[i]);

            particularSeriesOptions.rotated = false;

            data = particularSeriesOptions.data || options.dataSource;

            seriesTheme = chartThemeManager.getOptions("series", particularSeriesOptions);
            seriesTheme.argumentField = seriesTheme.argumentField || options.dataSourceField;//B253068
            if(data && data.length > 0) {
                //TODO
                newSeries = new seriesModule.Series({ renderer: options.renderer }, seriesTheme);
                series.push(newSeries);
            }
            if(hasSeriesTemplate) {
                setTemplateFields(data, that.templateData, newSeries);
            }
        }
        data = hasSeriesTemplate ? that.templateData : data;

        if(series.length) {
            groupsData = {
                groups: [{
                    series: series,
                    valueOptions: {
                        valueType: dataSourceField ? options.valueType : seriesValueType
                    }
                }],
                argumentOptions: {
                    categories: options.categories,
                    argumentType: options.valueType,
                    type: options.axisType
                }
            };
            parsedData = dataValidatorModule.validateData(data, groupsData, options.incidentOccurred, chartThemeManager.getOptions("dataPrepareSettings"));
            that.argCategories = groupsData.categories;
            for(i = 0; i < series.length; i++) {
                series[i].updateData(parsedData[series[i].getArgumentField()]);

            }
        }
        return series;
    },

    adjustSeriesDimensions: function(translators) {
        if(this._useAggregation) {
            $.each(this._series, function(_, s) {
                s.resamplePoints(translators.x);
            });
        }
        $.each(this._seriesFamilies, function(_, family) {
            family.adjustSeriesDimensions({ arg: translators.x, val: translators.y });
        });
    },

    getBoundRange: function() {
        var that = this,
            rangeData,
            valueAxisMin = that._valueAxis.min,
            valueAxisMax = that._valueAxis.max,
            valRange = new rangeModule.Range({
                min: valueAxisMin,
                minVisible: valueAxisMin,
                max: valueAxisMax,
                maxVisible: valueAxisMax,
                axisType: that._valueAxis.type,
                base: that._valueAxis.logarithmBase
            }),
            argRange = new rangeModule.Range({}),
            rangeYSize,
            rangeVisibleSizeY,
            minIndent,
            maxIndent;

        $.each(that._series, function(_, series) {
            rangeData = series.getRangeData();
            valRange.addRange(rangeData.val);
            argRange.addRange(rangeData.arg);
            if(!isStickType(series.type)) {
                argRange.addRange({ stick: false });
            }
        });

        if(valRange.isDefined() && argRange.isDefined()) {
            minIndent = that._valueAxis.inverted ? that._indent.top : that._indent.bottom;
            maxIndent = that._valueAxis.inverted ? that._indent.bottom : that._indent.top;
            rangeYSize = valRange.max - valRange.min;
            rangeVisibleSizeY = (typeUtils.isNumeric(valRange.maxVisible) ? valRange.maxVisible : valRange.max) - (typeUtils.isNumeric(valRange.minVisible) ? valRange.minVisible : valRange.min);
            //B253717
            if(typeUtils.isDate(valRange.min)) {
                valRange.min = new Date(valRange.min.valueOf() - rangeYSize * minIndent);
            } else {
                valRange.min -= rangeYSize * minIndent;
            }
            if(typeUtils.isDate(valRange.max)) {
                valRange.max = new Date(valRange.max.valueOf() + rangeYSize * maxIndent);
            } else {
                valRange.max += rangeYSize * maxIndent;
            }

            if(typeUtils.isNumeric(rangeVisibleSizeY)) {
                valRange.maxVisible = valRange.maxVisible ? valRange.maxVisible + rangeVisibleSizeY * maxIndent : undefined;
                valRange.minVisible = valRange.minVisible ? valRange.minVisible - rangeVisibleSizeY * minIndent : undefined;
            }
            valRange.invert = that._valueAxis.inverted;
        }

        return { arg: argRange, val: valRange };
    },

    getSeries: function() {
        return this._series;
    },

    isEmpty: function() {
        return this.getSeries().length === 0;
    },

    isShowChart: function() {
        return !this._hideChart;
    },

    getCalculatedValueType: function() {
        var series = this._series[0];
        return series && series.argumentType;
    },

    getThemeManager: function() {
        return this._themeManager;
    }
};

exports.SeriesDataSource = SeriesDataSource;
