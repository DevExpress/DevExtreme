import { noop } from '../core/utils/common';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import vizUtils from './core/utils';
import { AdvancedChart } from './chart_components/advanced_chart';
import { isDefined } from '../core/utils/type';

const DEFAULT_PANE_NAME = 'default';
const DOUBLE_PI_ANGLE = 360;

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
        var isArgumentAxis = typeSelector === 'argumentAxis',
            type = isArgumentAxis ? 'circular' : 'linear',
            useSpiderWeb = this.option('useSpiderWeb');

        if(useSpiderWeb) {
            type += 'Spider';
        }

        return {
            axisType: 'polarAxes',
            drawingType: type
        };
    },

    _prepareAxisOptions: function(typeSelector, axisOptions) {
        var isArgumentAxis = typeSelector === 'argumentAxis',
            themeManager = this._themeManager,
            axisUserOptions = this.option('argumentAxis'),
            argumentAxisOptions = themeManager.getOptions('argumentAxis', axisUserOptions) || {},
            startAngle = isFinite(argumentAxisOptions.startAngle) ? vizUtils.normalizeAngle(argumentAxisOptions.startAngle) : 0;

        return {
            type: this.option('useSpiderWeb') && isArgumentAxis ? 'discrete' : axisOptions.type,
            isHorizontal: true,
            showCustomBoundaryTicks: isArgumentAxis,
            startAngle: startAngle,
            endAngle: startAngle + 360
        };
    },

    _optionChangesMap: {
        useSpiderWeb: 'AXES_AND_PANES'
    },

    _getExtraOptions: function() {
        return { spiderWidget: this.option('useSpiderWeb') };
    },

    _prepareToRender: function() {
        this._appendAxesGroups();
        return {};
    },

    _calcCanvas: function() {
        const canvas = extend({}, this._canvas);
        const argumentAxis = this.getArgumentAxis();
        const margins = argumentAxis.getMargins();
        Object.keys(margins).forEach(margin => canvas[margin] = canvas[`original${margin[0].toUpperCase()}${margin.slice(1)}`] + margins[margin]);
        return canvas;
    },

    _renderAxes: function(drawOptions) {
        var that = this,
            valueAxis = that._getValueAxis(),
            argumentAxis = that.getArgumentAxis();

        argumentAxis.draw(that._canvas);
        valueAxis.setSpiderTicks(argumentAxis.getSpiderTicks());

        const canvas = that._calcCanvas();

        argumentAxis.updateSize(canvas);
        valueAxis.draw(canvas);

        return canvas;
    },

    _getValueAxis: function() {
        return this._valueAxes[0];
    },

    _shrinkAxes: function(sizeStorage) {
        var valueAxis = this._getValueAxis(),
            argumentAxis = this.getArgumentAxis();

        if(sizeStorage && (sizeStorage.width || sizeStorage.height)
        ) {
            argumentAxis.hideOuterElements();
            const canvas = this._calcCanvas();
            argumentAxis.updateSize(canvas);
            valueAxis.updateSize(canvas);
        }
    },

    checkForMoreSpaceForPanesCanvas() {
        return this.layoutManager.needMoreSpaceForPanesCanvas([{ canvas: this.getArgumentAxis().getCanvas() }], this._isRotated());
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
        that._createClipCircle(panesClipRects.base, center.x, center.y, radius);

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
            clipCircle.attr({ cx: left, cy: top, r: radius });
        }
    },

    _applyExtraSettings(series) {
        const wideClipRect = this._panesClipRects.wide[0];
        series.setClippingParams(this._panesClipRects.base[0].id, wideClipRect && wideClipRect.id, false, false);
    },

    getActualAngle(angle) {
        return this.getArgumentAxis().getOptions().inverted ? DOUBLE_PI_ANGLE - angle : angle;
    },

    getXYFromPolar(angle, radius, argument, value) {
        let layoutInfo = {
            angle: undefined,
            radius: undefined,
            x: undefined,
            y: undefined
        };

        if(!isDefined(angle) && !isDefined(radius) && !isDefined(argument) && !isDefined(value)) {
            return layoutInfo;
        }

        const argAxis = this.getArgumentAxis();
        const startAngle = argAxis.getAngles()[0];
        let argAngle;
        let translatedRadius;

        if(isDefined(argument)) {
            argAngle = argAxis.getTranslator().translate(argument);
        } else if(isFinite(angle)) {
            argAngle = this.getActualAngle(angle);
        } else if(!isDefined(angle)) {
            argAngle = 0;
        }

        if(isDefined(value)) {
            translatedRadius = this.getValueAxis().getTranslator().translate(value);
        } else if(isFinite(radius)) {
            translatedRadius = radius;
        } else if(!isDefined(radius)) {
            translatedRadius = argAxis.getRadius();
        }

        if(isDefined(argAngle) && isDefined(translatedRadius)) {
            const coords = vizUtils.convertPolarToXY(argAxis.getCenter(), startAngle, argAngle, translatedRadius);
            extend(layoutInfo, coords, { angle: argAxis.getTranslatedAngle(argAngle), radius: translatedRadius });
        }

        return layoutInfo;
    },

    _applyPointMarkersAutoHiding: noop,

    _createScrollBar: noop,

    _isRotated: noop,

    _getCrosshairOptions: noop,

    _isLegendInside: noop
});

dxPolarChart.addPlugin(require('./core/annotations').plugins.core);
dxPolarChart.addPlugin(require('./core/annotations').plugins.polarChart);

registerComponent('dxPolarChart', dxPolarChart);

module.exports = dxPolarChart;
