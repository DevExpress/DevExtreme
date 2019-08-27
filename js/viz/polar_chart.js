var _noop = require("../core/utils/common").noop,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    vizUtils = require("./core/utils"),
    AdvancedChart = require("./chart_components/advanced_chart").AdvancedChart,
    DEFAULT_PANE_NAME = 'default';

var dxPolarChart = AdvancedChart.inherit({
    _themeSection: 'polar',

    _createPanes: function() {
        this.callBase();
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
        var isArgumentAxis = typeSelector === "argumentAxis",
            themeManager = this._themeManager,
            axisUserOptions = this.option("argumentAxis"),
            argumentAxisOptions = themeManager.getOptions("argumentAxis", axisUserOptions) || {},
            startAngle = isFinite(argumentAxisOptions.startAngle) ? vizUtils.normalizeAngle(argumentAxisOptions.startAngle) : 0;

        return {
            type: this.option("useSpiderWeb") && isArgumentAxis ? "discrete" : axisOptions.type,
            isHorizontal: true,
            showCustomBoundaryTicks: isArgumentAxis,
            startAngle: startAngle,
            endAngle: startAngle + 360
        };
    },

    _optionChangesMap: {
        useSpiderWeb: "AXES_AND_PANES"
    },

    _getExtraOptions: function() {
        return { spiderWidget: this.option("useSpiderWeb") };
    },

    _prepareToRender: function() {
        this._appendAxesGroups();
        return {};
    },

    _renderAxes: function(drawOptions) {
        var that = this,
            valueAxis = that._getValueAxis(),
            argumentAxis = that.getArgumentAxis();

        var canvas = that._calcCanvas(argumentAxis.measureLabels(extend({}, that._canvas), true));

        argumentAxis.draw(canvas);
        valueAxis.setSpiderTicks(argumentAxis.getSpiderTicks());
        valueAxis.draw(canvas);
    },

    _getValueAxis: function() {
        return this._valueAxes[0];
    },

    _shrinkAxes: function(sizeShortage) {
        var valueAxis = this._getValueAxis(),
            argumentAxis = this.getArgumentAxis();

        if(sizeShortage && (sizeShortage.width || sizeShortage.height)) {
            argumentAxis.hideOuterElements();
            argumentAxis.updateSize(this._canvas);
            valueAxis.updateSize(this._canvas);
        }
    },

    _calcCanvas: function(measure) {
        var canvas = extend({}, this._canvas);

        canvas.left += measure.width;
        canvas.right += measure.width;
        canvas.top += measure.height;
        canvas.bottom += measure.height;
        return canvas;
    },

    _getLayoutTargets: function() {
        return [{ canvas: this._canvas }];
    },

    _getSeriesForPane: function() {
        return this.series;
    },

    _applyClipRects() {
        const canvasClipRectID = this._getCanvasClipRectID();

        this._createClipPathForPane();
        this.getArgumentAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
        this._getValueAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
    },

    _createClipPathForPane() {
        const that = this;
        const valueAxis = that._getValueAxis();
        let center = valueAxis.getCenter();
        const radius = valueAxis.getRadius();
        const panesClipRects = that._panesClipRects;

        center = { x: Math.round(center.x), y: Math.round(center.y) };

        that._createClipCircle(panesClipRects.fixed, center.x, center.y, radius);

        if(that.series.some(s => s.areErrorBarsVisible())) {
            that._createClipCircle(panesClipRects.wide, center.x, center.y, radius);
        } else {
            panesClipRects.wide[0] = null;
        }
    },

    _createClipCircle(clipArray, left, top, radius) {
        const that = this;
        let clipCircle = clipArray[0];

        if(!clipCircle) {
            clipCircle = that._renderer.clipCircle(left, top, radius);
            clipArray[0] = clipCircle;
        } else {
            clipCircle.attr({ x: left, y: top, r: radius });
        }
    },

    _applyExtraSettings(series) {
        const wideClipRect = this._panesClipRects.wide[0];
        if(wideClipRect) {
            series.setClippingParams(null, wideClipRect.id, false);
        }
    },

    _applyPointMarkersAutoHiding: _noop,

    _createScrollBar: _noop,

    _isRotated: _noop,

    _getCrosshairOptions: _noop,

    _isLegendInside: _noop
});

registerComponent("dxPolarChart", dxPolarChart);

module.exports = dxPolarChart;
