"use strict";

var $ = require("jquery"),
    registerComponent = require("../core/component_registrator"),
    vizUtils = require("./core/utils"),
    polarTranslatorModule = require("./translators/polar_translator"),
    rangeModule = require("./translators/range"),
    AdvancedChart = require("./chart_components/advanced_chart").AdvancedChart,
    _noop = $.noop,
    DEFAULT_PANE_NAME = 'default';

var dxPolarChart = AdvancedChart.inherit({
    _chartType: 'polar',

    _createPanes: function() {
        return [{ name: DEFAULT_PANE_NAME }];
    },

    _checkPaneName: function() {
        return true;
    },

    _getAxisRenderingOptions: function(typeSelector) {
        var isArgumentAxis = typeSelector === "argumentAxis",
            type = isArgumentAxis ? "circular" : "linear",
            useSpiderWeb = this.option("useSpiderWeb");

        if(useSpiderWeb) {
            type += "Spider";
        }

        return {
            axisType: "polarAxes",
            drawingType: type
        };
    },

    _prepareAxisOptions: function(typeSelector, axisOptions) {
        var isArgumentAxis = typeSelector === "argumentAxis";
        return {
            type: this.option("useSpiderWeb") && isArgumentAxis ? "discrete" : axisOptions.type,
            isHorizontal: true,
            showCustomBoundaryTicks: isArgumentAxis
        };
    },

    _optionChangesMap: {
        useSpiderWeb: "REINIT"
    },

    _getExtraOptions: function() {
        return { spiderWidget: this.option("useSpiderWeb") };
    },

    _groupSeries: function() {
        var that = this;

        that._groupsData = {
            groups: [{
                series: that.series,
                valueAxis: that._valueAxes[0],
                valueOptions: that._valueAxes[0].getOptions()
            }],
            argumentAxes: that._argumentAxes,
            argumentOptions: that._argumentAxes[0].getOptions()
        };
    },

    _prepareToRender: function() {
        this._appendAxesGroups();
        return {};
    },

    _renderAxes: function(drawOptions, _, __, adjustUnits) {
        this._drawAxes({}, drawOptions, adjustUnits);
    },

    _getAxisDrawingMethods: function(drawOptions, preparedOptions, isRotated, adjustUnits) {
        var that = this;
        return function() {
            that._renderAxes(drawOptions, preparedOptions, isRotated, adjustUnits);
        };
    },

    _reinitTranslators: function() {
        var that = this,
            valueAxes = that._valueAxes,
            argumentAxes = that._argumentAxes,
            translator = that._createTranslator({
                arg: new rangeModule.Range(that.businessRanges[0].arg),
                val: new rangeModule.Range(that.businessRanges[0].val)
            }),
            argTranslator = translator.getComponent("arg"),
            valTranslator = translator.getComponent("val"),
            i = 0;

        that.translator = translator;

        argumentAxes[0].setTranslator(argTranslator, valTranslator);

        for(i; i < valueAxes.length; i++) {
            valueAxes[i].setTranslator(valTranslator, argTranslator);
        }
    },

    _prepareAxesAndDraw: function(drawAxes, drawStaticAxisElements) {
        var that = this,
            valueAxes = that._valueAxes,
            argAxes = that._argumentAxes,
            argumentAxis = argAxes[0];

        that._calcCanvas(argumentAxis.measureLabels(true));
        that.translator.reinit();
        drawAxes(argAxes);
        $.each(valueAxes, function(_, valAxis) {
            valAxis.setSpiderTicks(argumentAxis.getSpiderTicks());
        });
        drawAxes(valueAxes);
        drawStaticAxisElements(argAxes);
        drawStaticAxisElements(valueAxes);
    },

    _calcCanvas: function(measure) {
        var canvas = this.translator.canvas;

        canvas.left += measure.width;
        canvas.right += measure.width;
        canvas.top += measure.height;
        canvas.bottom += measure.height;
    },

    _getLayoutTargets: function() {
        return [{ canvas: this._canvas }];
    },

    _getAxesForTransform: function() {
        var argAxes = this._getArgumentAxes();
        return { verticalAxes: argAxes, horizontalAxes: argAxes };
    },

    _getTranslator: function() {
        var translator = this.translator;
        return { val: translator, arg: translator };
    },

    _prepareTranslators: function() {
        return this.translator;
    },

    _createTranslator: function(br) {
        var themeManager = this._themeManager,
            axisUserOptions = this.option("argumentAxis"),
            axisOptions = themeManager.getOptions("argumentAxis", axisUserOptions) || {},
            startAngle = isFinite(axisOptions.startAngle) ? vizUtils.normalizeAngle(axisOptions.startAngle) : 0;

        return new polarTranslatorModule.PolarTranslator(br, $.extend(true, {}, this._canvas), { startAngle: startAngle, endAngle: startAngle + 360 });
    },

    _getSeriesForPane: function() {
        return this.series;
    },

    _applyExtraSettings: _noop,

    _updateLegendPosition: _noop,

    _createScrollBar: _noop,

    _applyClipRects: _noop,

    _isRotated: _noop,

    _getCrosshairOptions: _noop,

    _isLegendInside: _noop,

    _processSingleSeries: _noop
});

registerComponent("dxPolarChart", dxPolarChart);

module.exports = dxPolarChart;
