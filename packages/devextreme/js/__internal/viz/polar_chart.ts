/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import { plugins } from '@ts/viz/core/annotations';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { convertPolarToXY, normalizeAngle } from '@ts/viz/core/utils';

import { AdvancedChart } from './chart_components/advanced_chart';

const DEFAULT_PANE_NAME = 'default';
const DOUBLE_PI_ANGLE = 360;

class PolarChart extends AdvancedChart {
  _createPanes(): ThemeValue {
    super._createPanes();
    return [{ name: DEFAULT_PANE_NAME }];
  }

  _checkPaneName(): ThemeValue {
    return true;
  }

  _getAxisRenderingOptions(typeSelector: string): ThemeValue {
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
  }

  _executeAppendBeforeSeries(append: ThemeValue): void {
    append();
  }

  _prepareAxisOptions(typeSelector: string, axisOptions: ThemeValue): ThemeValue {
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
  }

  _change_USE_SPIDER_WEB(): void {
    this._disposeAxes();
    this._requestChange(['AXES_AND_PANES']);
  }

  _getExtraOptions(): ThemeValue {
    return { spiderWidget: this.option('useSpiderWeb') };
  }

  _prepareToRender(): ThemeValue {
    this._appendAxesGroups();
    return {};
  }

  _calcCanvas(): ThemeValue {
    const canvas = extend({}, this._canvas);
    const argumentAxis = this.getArgumentAxis();
    const margins = argumentAxis.getMargins();
    Object.keys(margins).forEach((margin) => {
      canvas[margin] = canvas[`original${margin[0].toUpperCase()}${margin.slice(1)}`] + margins[margin];
    });
    return canvas;
  }

  _renderAxes(): ThemeValue {
    const valueAxis = this._getValueAxis();
    const argumentAxis = this.getArgumentAxis();

    argumentAxis.draw(this._canvas);
    valueAxis.setSpiderTicks(argumentAxis.getSpiderTicks());

    const canvas = this._calcCanvas();

    argumentAxis.updateSize(canvas);
    valueAxis.draw(canvas);

    return canvas;
  }

  _getValueAxis(): ThemeValue {
    return this._valueAxes[0];
  }

  _shrinkAxes(sizeStorage: ThemeValue): void {
    const valueAxis = this._getValueAxis();
    const argumentAxis = this.getArgumentAxis();

    if (sizeStorage && (sizeStorage.width || sizeStorage.height)
    ) {
      argumentAxis.hideOuterElements();
      const canvas = this._calcCanvas();
      argumentAxis.updateSize(canvas);
      valueAxis.updateSize(canvas);
    }
  }

  checkForMoreSpaceForPanesCanvas(): ThemeValue {
    return this.layoutManager.needMoreSpaceForPanesCanvas([{
      canvas: this.getArgumentAxis().getCanvas(),
    }], this._isRotated());
  }

  _getLayoutTargets(): ThemeValue {
    return [{ canvas: this._canvas }];
  }

  _getSeriesForPane(): ThemeValue {
    return this.series;
  }

  _applyClipRects(): void {
    const canvasClipRectID = this._getCanvasClipRectID();

    this._createClipPathForPane();
    this.getArgumentAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
    this._getValueAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
  }

  _createClipPathForPane(): void {
    const valueAxis = this._getValueAxis();
    let center = valueAxis.getCenter();
    const radius = valueAxis.getRadius();
    const panesClipRects = this._panesClipRects;

    center = { x: Math.round(center.x), y: Math.round(center.y) };

    this._createClipCircle(panesClipRects.fixed, center.x, center.y, radius);
    this._createClipCircle(panesClipRects.base, center.x, center.y, radius);

    if (this.series.some((s) => s.areErrorBarsVisible())) {
      this._createClipCircle(panesClipRects.wide, center.x, center.y, radius);
    } else {
      panesClipRects.wide[0] = null;
    }
  }

  _createClipCircle(clipArray: ThemeValue, left: ThemeValue, top: ThemeValue, radius: number): void {
    let clipCircle = clipArray[0];

    if (!clipCircle) {
      clipCircle = this._renderer.clipCircle(left, top, radius);
      clipArray[0] = clipCircle;
    } else {
      clipCircle.attr({ cx: left, cy: top, r: radius });
    }
  }

  _applyExtraSettings(series: ThemeValue): void {
    const wideClipRect = this._panesClipRects.wide[0];
    series.setClippingParams(this._panesClipRects.base[0].id, wideClipRect && wideClipRect.id, false, false);
  }

  getActualAngle(angle: number): ThemeValue {
    return this.getArgumentAxis().getOptions().inverted ? DOUBLE_PI_ANGLE - angle : angle;
  }

  getXYFromPolar(angle: number, radius: number, argument: ThemeValue, value: ThemeValue): ThemeValue {
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
  }
}

setupWidgetPrototype(PolarChart, {
  _themeSection: 'polar',

  _optionChangesMap: {
    useSpiderWeb: 'USE_SPIDER_WEB',
  },

  _applyPointMarkersAutoHiding: noop,

  _createScrollBar: noop,

  _isRotated: noop,

  _getCrosshairOptions: noop,

  _isLegendInside: noop,
});
PolarChart.addPlugin(plugins.core);
PolarChart.addPlugin(plugins.polarChart);

registerComponent('dxPolarChart', PolarChart);

export default PolarChart;
