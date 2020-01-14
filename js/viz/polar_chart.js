const _noop = require('../core/utils/common').noop;
const registerComponent = require('../core/component_registrator');
const extend = require('../core/utils/extend').extend;
const vizUtils = require('./core/utils');
const AdvancedChart = require('./chart_components/advanced_chart').AdvancedChart;
const DEFAULT_PANE_NAME = 'default';

const dxPolarChart = AdvancedChart.inherit({
    _themeSection: 'polar',

    _createPanes: function() {
        return [{ name: DEFAULT_PANE_NAME }];
    },

    _checkPaneName: function() {
        return true;
    },

    _getAxisRenderingOptions: function(typeSelector) {
        const isArgumentAxis = typeSelector === 'argumentAxis';
        let type = isArgumentAxis ? 'circular' : 'linear';
        const useSpiderWeb = this.option('useSpiderWeb');

        if(useSpiderWeb) {
            type += 'Spider';
        }

        return {
            axisType: 'polarAxes',
            drawingType: type
        };
    },

    _prepareAxisOptions: function(typeSelector, axisOptions) {
        const isArgumentAxis = typeSelector === 'argumentAxis';
        const themeManager = this._themeManager;
        const axisUserOptions = this.option('argumentAxis');
        const argumentAxisOptions = themeManager.getOptions('argumentAxis', axisUserOptions) || {};
        const startAngle = isFinite(argumentAxisOptions.startAngle) ? vizUtils.normalizeAngle(argumentAxisOptions.startAngle) : 0;

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
        const that = this;
        const valueAxis = that._getValueAxis();
        const argumentAxis = that.getArgumentAxis();

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
        const valueAxis = this._getValueAxis();
        const argumentAxis = this.getArgumentAxis();

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

    _applyExtraSettings: _noop,

    _applyPointMarkersAutoHiding: _noop,

    _createScrollBar: _noop,

    _applyClipRects: _noop,

    _isRotated: _noop,

    _getCrosshairOptions: _noop,

    _isLegendInside: _noop
});

registerComponent('dxPolarChart', dxPolarChart);

module.exports = dxPolarChart;
