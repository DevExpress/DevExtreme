"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _annotations = require("../../viz/core/annotations");
var _utils = require("../../viz/core/utils");
var _m_advanced_chart = require("./chart_components/m_advanced_chart");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_PANE_NAME = 'default';
const DOUBLE_PI_ANGLE = 360;
const dxPolarChart = _m_advanced_chart.AdvancedChart.inherit({
  _themeSection: 'polar',
  _createPanes() {
    this.callBase();
    return [{
      name: DEFAULT_PANE_NAME
    }];
  },
  _checkPaneName() {
    return true;
  },
  _getAxisRenderingOptions(typeSelector) {
    const isArgumentAxis = typeSelector === 'argumentAxis';
    let type = isArgumentAxis ? 'circular' : 'linear';
    const useSpiderWeb = this.option('useSpiderWeb');
    if (useSpiderWeb) {
      type += 'Spider';
    }
    return {
      axisType: 'polarAxes',
      drawingType: type
    };
  },
  _executeAppendBeforeSeries(append) {
    append();
  },
  _prepareAxisOptions(typeSelector, axisOptions) {
    const isArgumentAxis = typeSelector === 'argumentAxis';
    const themeManager = this._themeManager;
    const axisUserOptions = this.option('argumentAxis');
    const argumentAxisOptions = themeManager.getOptions('argumentAxis', axisUserOptions) || {};
    const startAngle = isFinite(argumentAxisOptions.startAngle) ? (0, _utils.normalizeAngle)(argumentAxisOptions.startAngle) : 0;
    return {
      type: this.option('useSpiderWeb') && isArgumentAxis ? 'discrete' : axisOptions.type,
      isHorizontal: true,
      showCustomBoundaryTicks: isArgumentAxis,
      startAngle,
      endAngle: startAngle + 360
    };
  },
  _optionChangesMap: {
    useSpiderWeb: 'USE_SPIDER_WEB'
  },
  _change_USE_SPIDER_WEB() {
    this._disposeAxes();
    this._requestChange(['AXES_AND_PANES']);
  },
  _getExtraOptions() {
    return {
      spiderWidget: this.option('useSpiderWeb')
    };
  },
  _prepareToRender() {
    this._appendAxesGroups();
    return {};
  },
  _calcCanvas() {
    const canvas = (0, _extend.extend)({}, this._canvas);
    const argumentAxis = this.getArgumentAxis();
    const margins = argumentAxis.getMargins();
    Object.keys(margins).forEach(margin => {
      canvas[margin] = canvas[`original${margin[0].toUpperCase()}${margin.slice(1)}`] + margins[margin];
    });
    return canvas;
  },
  _renderAxes() {
    const valueAxis = this._getValueAxis();
    const argumentAxis = this.getArgumentAxis();
    argumentAxis.draw(this._canvas);
    valueAxis.setSpiderTicks(argumentAxis.getSpiderTicks());
    const canvas = this._calcCanvas();
    argumentAxis.updateSize(canvas);
    valueAxis.draw(canvas);
    return canvas;
  },
  _getValueAxis() {
    return this._valueAxes[0];
  },
  _shrinkAxes(sizeStorage) {
    const valueAxis = this._getValueAxis();
    const argumentAxis = this.getArgumentAxis();
    if (sizeStorage && (sizeStorage.width || sizeStorage.height)) {
      argumentAxis.hideOuterElements();
      const canvas = this._calcCanvas();
      argumentAxis.updateSize(canvas);
      valueAxis.updateSize(canvas);
    }
  },
  checkForMoreSpaceForPanesCanvas() {
    return this.layoutManager.needMoreSpaceForPanesCanvas([{
      canvas: this.getArgumentAxis().getCanvas()
    }], this._isRotated());
  },
  _getLayoutTargets() {
    return [{
      canvas: this._canvas
    }];
  },
  _getSeriesForPane() {
    return this.series;
  },
  _applyClipRects() {
    const canvasClipRectID = this._getCanvasClipRectID();
    this._createClipPathForPane();
    this.getArgumentAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
    this._getValueAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
  },
  _createClipPathForPane() {
    const valueAxis = this._getValueAxis();
    let center = valueAxis.getCenter();
    const radius = valueAxis.getRadius();
    const panesClipRects = this._panesClipRects;
    center = {
      x: Math.round(center.x),
      y: Math.round(center.y)
    };
    this._createClipCircle(panesClipRects.fixed, center.x, center.y, radius);
    this._createClipCircle(panesClipRects.base, center.x, center.y, radius);
    if (this.series.some(s => s.areErrorBarsVisible())) {
      this._createClipCircle(panesClipRects.wide, center.x, center.y, radius);
    } else {
      panesClipRects.wide[0] = null;
    }
  },
  _createClipCircle(clipArray, left, top, radius) {
    let clipCircle = clipArray[0];
    if (!clipCircle) {
      clipCircle = this._renderer.clipCircle(left, top, radius);
      clipArray[0] = clipCircle;
    } else {
      clipCircle.attr({
        cx: left,
        cy: top,
        r: radius
      });
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
    const layoutInfo = {
      angle: undefined,
      radius: undefined,
      x: undefined,
      y: undefined
    };
    if (!(0, _type.isDefined)(angle) && !(0, _type.isDefined)(radius) && !(0, _type.isDefined)(argument) && !(0, _type.isDefined)(value)) {
      return layoutInfo;
    }
    const argAxis = this.getArgumentAxis();
    const startAngle = argAxis.getAngles()[0];
    let argAngle;
    let translatedRadius;
    if ((0, _type.isDefined)(argument)) {
      argAngle = argAxis.getTranslator().translate(argument);
    } else if (isFinite(angle)) {
      argAngle = this.getActualAngle(angle);
    } else if (!(0, _type.isDefined)(angle)) {
      argAngle = 0;
    }
    if ((0, _type.isDefined)(value)) {
      translatedRadius = this.getValueAxis().getTranslator().translate(value);
    } else if (isFinite(radius)) {
      translatedRadius = radius;
    } else if (!(0, _type.isDefined)(radius)) {
      translatedRadius = argAxis.getRadius();
    }
    if ((0, _type.isDefined)(argAngle) && (0, _type.isDefined)(translatedRadius)) {
      const coords = (0, _utils.convertPolarToXY)(argAxis.getCenter(), startAngle, argAngle, translatedRadius);
      (0, _extend.extend)(layoutInfo, coords, {
        angle: argAxis.getTranslatedAngle(argAngle),
        radius: translatedRadius
      });
    }
    return layoutInfo;
  },
  _applyPointMarkersAutoHiding: _common.noop,
  _createScrollBar: _common.noop,
  _isRotated: _common.noop,
  _getCrosshairOptions: _common.noop,
  _isLegendInside: _common.noop
});
dxPolarChart.addPlugin(_annotations.plugins.core);
dxPolarChart.addPlugin(_annotations.plugins.polarChart);
(0, _component_registrator.default)('dxPolarChart', dxPolarChart);
var _default = exports.default = dxPolarChart;