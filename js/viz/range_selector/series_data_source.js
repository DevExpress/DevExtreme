"use strict";

var seriesModule = require("../series/base_series"),
    seriesFamilyModule = require("../core/series_family"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    each = require("../../core/utils/iterator").each,
    vizUtils = require("../core/utils"),
    rangeModule = require("../translators/range"),
    dataValidatorModule = require("../components/data_validator"),
    ChartThemeManager = require("../components/chart_theme_manager").ThemeManager,
    SeriesDataSource;

var createThemeManager = function(chartOptions) {
    return new ChartThemeManager(chartOptions, 'rangeSelector.chart');
};

var processSeriesFamilies = function(series, equalBarWidth, minBubbleSize, maxBubbleSize, barOptions, negativesAsZeroes) {
    var families = [],
        types = [];

    each(series, function(i, item) {
        if(inArray(item.type, types) === -1) {
            types.push(item.type);
        }
    });

    each(types, function(_, type) {
        var family = new seriesFamilyModule.SeriesFamily({
            type: type,
            equalBarWidth: equalBarWidth,
            minBubbleSize: minBubbleSize,
            maxBubbleSize: maxBubbleSize,
            barWidth: barOptions.barWidth,
            barGroupPadding: barOptions.barGroupPadding,
            barGroupWidth: barOptions.barGroupWidth,
            negativesAsZeroes: negativesAsZeroes
        });
        family.add(series);
        family.adjustSeriesValues();
        families.push(family);
    });

    return families;
};

// TODO: This is copypaste from the same name method in the advancedChart.js
function setTemplateFields(data, templateData, series) {
    each(data, function(_, data) {
        each(series.getTemplateFields(), function(_, field) {
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

    that._series = that._calculateSeries(options, templatedSeries);

    negativesAsZeroes = themeManager.getOptions("negativesAsZeroes");
    negativesAsZeros = themeManager.getOptions("negativesAsZeros"); // misspelling case

    that._seriesFamilies = processSeriesFamilies(that._series,
        themeManager.getOptions('equalBarWidth'),
        themeManager.getOptions('minBubbleSize'),
        themeManager.getOptions('maxBubbleSize'),
        {
            barWidth: themeManager.getOptions('barWidth'),
            barGroupPadding: themeManager.getOptions('barGroupPadding'),
            barGroupWidth: themeManager.getOptions('barGroupWidth')
        },
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
            dataSourceField,
            valueAxis = that._valueAxis,
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

            seriesTheme = chartThemeManager.getOptions("series", particularSeriesOptions, allSeriesOptions.length);
            seriesTheme.argumentField = seriesTheme.argumentField || options.dataSourceField;// B253068
            if(data && data.length > 0) {
                // TODO
                newSeries = new seriesModule.Series({
                    renderer: options.renderer,
                    argumentAxis: options.argumentAxis,
                    valueAxis: options.valueAxis
                }, seriesTheme);
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
                        type: valueAxis.type,
                        valueType: dataSourceField ? options.valueType : valueAxis.valueType
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

    createPoints() {
        if(this._series.length === 0) {
            return;
        }

        var series = this._series,
            viewport = new rangeModule.Range(),
            axis = series[0].getArgumentAxis();

        series.forEach(function(s) {
            viewport.addRange(s.getArgumentRange());
        });

        axis.getTranslator().updateBusinessRange(viewport);

        series.forEach(function(s) { s.createPoints(); });
    },

    adjustSeriesDimensions: function() {
        each(this._seriesFamilies, function(_, family) {
            family.adjustSeriesDimensions();
        });
    },

    getBoundRange: function() {
        var that = this,
            rangeData,
            valueAxis = that._valueAxis,
            valRange = new rangeModule.Range({
                min: valueAxis.min,
                minVisible: valueAxis.min,
                max: valueAxis.max,
                maxVisible: valueAxis.max,
                axisType: valueAxis.type,
                base: valueAxis.logarithmBase
            }),
            argRange = new rangeModule.Range({}),
            rangeYSize,
            rangeVisibleSizeY,
            minIndent,
            maxIndent;

        each(that._series, function(_, series) {
            rangeData = series.getRangeData();
            valRange.addRange(rangeData.val);
            argRange.addRange(rangeData.arg);
        });

        if(valRange.isDefined() && argRange.isDefined()) {
            minIndent = valueAxis.inverted ? that._indent.top : that._indent.bottom;
            maxIndent = valueAxis.inverted ? that._indent.bottom : that._indent.top;
            rangeYSize = valRange.max - valRange.min;
            rangeVisibleSizeY = (typeUtils.isNumeric(valRange.maxVisible) ? valRange.maxVisible : valRange.max) - (typeUtils.isNumeric(valRange.minVisible) ? valRange.minVisible : valRange.min);
            // B253717
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
            valRange.invert = valueAxis.inverted;
        }

        return { arg: argRange, val: valRange };
    },

    getMarginOptions: function(canvas) {
        var bubbleSize = Math.min(canvas.width, canvas.height) * this._themeManager.getOptions("maxBubbleSize");

        return this._series.reduce(function(marginOptions, series) {
            var seriesOptions = series.getMarginOptions();

            if(seriesOptions.processBubbleSize === true) {
                seriesOptions.size = bubbleSize;
            }

            return {
                checkInterval: marginOptions.checkInterval || seriesOptions.checkInterval,
                size: Math.max(marginOptions.size || 0, seriesOptions.size || 0)
            };
        }, {});
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
