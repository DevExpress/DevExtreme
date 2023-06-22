import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import { plugins } from '@js/viz/core/annotations';
import { convertPolarToXY, normalizeAngle } from '@js/viz/core/utils';

import { AdvancedChart } from './chart_components/m_advanced_chart';

const DEFAULT_PANE_NAME = 'default';
const DOUBLE_PI_ANGLE = 360;

const dxPolarChart = AdvancedChart.inherit({
  _themeSection: 'polar',

  _createPanes() {
    this.callBase();
    return [{ name: DEFAULT_PANE_NAME }];
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
      drawingType: type,
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
    const startAngle = isFinite(argumentAxisOptions.startAngle) ? normalizeAngle(argumentAxisOptions.startAngle) : 0;

    return {
      type: this.option('useSpiderWeb') && isArgumentAxis ? 'discrete' : axisOptions.type,
      isHorizontal: true,
      showCustomBoundaryTicks: isArgumentAxis,
      startAngle,
      endAngle: startAngle + 360,
    };
  },

  _optionChangesMap: {
    useSpiderWeb: 'USE_SPIDER_WEB',
  },

  _change_USE_SPIDER_WEB() {
    this._disposeAxes();
    this._requestChange(['AXES_AND_PANES']);
  },

  _getExtraOptions() {
    return { spiderWidget: this.option('useSpiderWeb') };
  },

  _prepareToRender() {
    this._appendAxesGroups();
    return {};
  },

  _calcCanvas() {
    const canvas = extend({}, this._canvas);
    const argumentAxis = this.getArgumentAxis();
    const margins = argumentAxis.getMargins();
    Object.keys(margins).forEach((margin) => {
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

    if (sizeStorage && (sizeStorage.width || sizeStorage.height)
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

  _getLayoutTargets() {
    return [{ canvas: this._canvas }];
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
    const that = this;
    const valueAxis = that._getValueAxis();
    let center = valueAxis.getCenter();
    const radius = valueAxis.getRadius();
    const panesClipRects = that._panesClipRects;

    center = { x: Math.round(center.x), y: Math.round(center.y) };

    that._createClipCircle(panesClipRects.fixed, center.x, center.y, radius);
    that._createClipCircle(panesClipRects.base, center.x, center.y, radius);

    if (that.series.some((s) => s.areErrorBarsVisible())) {
      that._createClipCircle(panesClipRects.wide, center.x, center.y, radius);
    } else {
      panesClipRects.wide[0] = null;
    }
  },

  _createClipCircle(clipArray, left, top, radius) {
    const that = this;
    let clipCircle = clipArray[0];

    if (!clipCircle) {
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
    const layoutInfo = {
      angle: undefined,
      radius: undefined,
      x: undefined,
      y: undefined,
    };

    if (!isDefined(angle) && !isDefined(radius) && !isDefined(argument) && !isDefined(value)) {
      return layoutInfo;
    }

    const argAxis = this.getArgumentAxis();
    const startAngle = argAxis.getAngles()[0];
    let argAngle;
    let translatedRadius;

    if (isDefined(argument)) {
      argAngle = argAxis.getTranslator().translate(argument);
    } else if (isFinite(angle)) {
      argAngle = this.getActualAngle(angle);
    } else if (!isDefined(angle)) {
      argAngle = 0;
    }

    if (isDefined(value)) {
      translatedRadius = this.getValueAxis().getTranslator().translate(value);
    } else if (isFinite(radius)) {
      translatedRadius = radius;
    } else if (!isDefined(radius)) {
      translatedRadius = argAxis.getRadius();
    }

    if (isDefined(argAngle) && isDefined(translatedRadius)) {
      const coords = convertPolarToXY(argAxis.getCenter(), startAngle, argAngle, translatedRadius);
      extend(layoutInfo, coords, { angle: argAxis.getTranslatedAngle(argAngle), radius: translatedRadius });
    }

    return layoutInfo;
  },

  _applyPointMarkersAutoHiding: noop,

  _createScrollBar: noop,

  _isRotated: noop,

  _getCrosshairOptions: noop,

  _isLegendInside: noop,
});

dxPolarChart.addPlugin(plugins.core);
dxPolarChart.addPlugin(plugins.polarChart);

registerComponent('dxPolarChart', dxPolarChart);

export default dxPolarChart;
