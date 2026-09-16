/* eslint-disable max-classes-per-file */

import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import { roundFloatPart } from '@js/core/utils/math';
import { clone } from '@js/core/utils/object';
import { overlapping } from '@ts/viz/chart_components/base_chart';
import { plugin as pluginLegend } from '@ts/viz/components/legend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { plugins as centerTemplatePlugins } from '@ts/viz/core/center_template';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import {
  convertAngleToRendererSpace,
  getCosAndSin,
  getVerticallyShiftedAngularCoords,
  normalizeAngle,
  normalizeArcParams,
  normalizeEnum,
  patchFontOptions,
} from '@ts/viz/core/utils';
import type { GaugeFormatOptions } from '@ts/viz/gauges/base_gauge';
import {
  BaseGauge, compareArrays, formatValue, getSampleText,
} from '@ts/viz/gauges/base_gauge';
import type { CircularArea, CircularLayoutMeasurements } from '@ts/viz/gauges/circular_gauge';
import { applyCircularMainLayout, setupCircularCodomain } from '@ts/viz/gauges/circular_gauge';

const PI_DIV_180 = Math.PI / 180;
const ARC_COORD_PREC = 5;
const OPTION_VALUES = 'values';

interface Point {
  x: number;
  y: number;
}

interface BarTranslator {
  translate: (value: number) => number;
  adjust: (value: number) => number;
}

interface BarContext {
  renderer: ThemeValue;
  translator: BarTranslator;
  tracker: ThemeValue;
  group: ThemeValue;
  textEnabled: boolean;
  fontStyles: ThemeValue;
  formatOptions: GaugeFormatOptions;
  textOptions: ThemeValue;
  lineWidth: number;
  lineColor: string | null;
  textY: number;
  textWidth: number;
  textHeight: number;
  backgroundColor: string;
  x: number;
  y: number;
  startAngle: number;
  endAngle: number;
  baseAngle: number;
  barSize: number;
  textRadius: number;
  textIndent: number;
}

interface BarArrangeOptions {
  radius: number;
  color: string;
}

interface BarTooltipParameters {
  x: number;
  y: number;
  offset: number;
  color: string;
  value: number;
}

interface LabelCoords {
  topLeft: Point;
  bottomRight: Point;
}

interface StackedBars {
  left: ThemeValue[];
  right: ThemeValue[];
}

function setAngles(target: ThemeValue, angle1: number, angle2: number): void {
  target.startAngle = angle1 < angle2 ? angle1 : angle2;
  target.endAngle = angle1 < angle2 ? angle2 : angle1;
}

function compareFloats(value1: number, value2: number): boolean {
  return Math.abs(value1 - value2) < 0.0001;
}

function getStartCoordsArc(
  x: number,
  y: number,
  outerR: number,
  startAngleCos: number,
  startAngleSin: number,
): Point {
  return {
    x: Number((x + outerR * startAngleCos).toFixed(ARC_COORD_PREC)),
    y: Number((y - outerR * startAngleSin).toFixed(ARC_COORD_PREC)),
  };
}

class BarWrapper {
  index: number;

  _context: BarContext;

  _tracker: ThemeValue;

  _settings: ThemeValue;

  _background: ThemeValue;

  _bar: ThemeValue;

  _line: ThemeValue;

  _text: ThemeValue;

  _visible?: boolean;

  _angle!: number;

  _color!: string;

  _value!: number;

  _start?: number;

  _delta?: number;

  _isLabelShifted?: boolean;

  constructor(index: number, context: BarContext) {
    this._context = context;
    this._tracker = context.renderer.arc().attr({ 'stroke-linejoin': 'round' });
    this.index = index;
  }

  dispose(): this {
    this._background.dispose();
    this._bar.dispose();
    if (this._context.textEnabled) {
      this._line.dispose();
      this._text.dispose();
    }
    this._context.tracker.detach(this._tracker);
    Object.assign(this, {
      _context: null,
      _settings: null,
      _background: null,
      _bar: null,
      _line: null,
      _text: null,
      _tracker: null,
    });
    return this;
  }

  arrange(options: BarArrangeOptions): this {
    const context = this._context;

    this._visible = true;
    context.tracker.attach(this._tracker, this, { index: this.index });

    this._background = context.renderer.arc()
      .attr({ 'stroke-linejoin': 'round', fill: context.backgroundColor })
      .append(context.group);
    this._settings = this._settings || {
      x: context.x, y: context.y, startAngle: context.baseAngle, endAngle: context.baseAngle,
    };

    this._bar = context.renderer.arc()
      .attr(extend({ 'stroke-linejoin': 'round' }, this._settings))
      .append(context.group);
    if (context.textEnabled) {
      this._line = context.renderer.path([], 'line')
        .attr({ 'stroke-width': context.lineWidth })
        .append(context.group);
      this._text = context.renderer.text()
        .css(context.fontStyles)
        .attr(context.textOptions)
        .append(context.group);
    }

    this._angle = isFinite(this._angle) ? this._angle : context.baseAngle;

    this._settings.outerRadius = options.radius;
    this._settings.innerRadius = options.radius - context.barSize;
    this._settings.x = context.x;
    this._settings.y = context.y;

    this._background.attr(extend({}, this._settings, {
      startAngle: context.endAngle,
      endAngle: context.startAngle,
      fill: this._context.backgroundColor,
    }));
    this._bar.attr({
      x: context.x,
      y: context.y,
      outerRadius: this._settings.outerRadius,
      innerRadius: this._settings.innerRadius,
      fill: this._color,
    });
    this._tracker.attr(this._settings);
    if (context.textEnabled) {
      this._line.attr({
        points: [
          context.x,
          context.y - this._settings.innerRadius,
          context.x,
          context.y - context.textRadius - context.textIndent,
        ],
        stroke: context.lineColor || this._color,
      }).sharp();
      this._text.css({ fill: context.fontStyles.fill || this._color });
    }
    return this;
  }

  getTooltipParameters(): BarTooltipParameters {
    const cosSin = getCosAndSin((this._angle + this._context.baseAngle) / 2);
    const middleRadius = (this._settings.outerRadius + this._settings.innerRadius) / 2;
    return {
      x: Math.round(this._context.x + middleRadius * cosSin.cos),
      y: Math.round(this._context.y - middleRadius * cosSin.sin),
      offset: 0,
      color: this._color,
      value: this._value,
    };
  }

  setAngle(angle: number): this {
    const context = this._context;
    const settings = this._settings;

    this._angle = angle;
    setAngles(settings, context.baseAngle, angle);
    this._bar.attr(settings);
    this._tracker.attr(settings);
    if (context.textEnabled) {
      const cosSin = getCosAndSin(angle);
      const indent = context.textIndent;
      const radius = context.textRadius + indent;
      let x = context.x + radius * cosSin.cos;
      let y = context.y - radius * cosSin.sin;
      const halfWidth = context.textWidth * 0.5;
      const { textHeight, textY } = context;

      if (Math.abs(x - context.x) > indent) {
        x += x < context.x ? -halfWidth : halfWidth;
      }
      if (Math.abs(y - context.y) <= indent) {
        y -= textY + textHeight * 0.5;
      } else {
        y -= y < context.y ? textY + textHeight : textY;
      }

      const text = formatValue(this._value, context.formatOptions, { index: this.index });
      const visibility = text === '' ? 'hidden' : null;
      this._text.attr({
        text,
        x,
        y,
        visibility,
      });

      this._line.attr({ visibility });
      this._line.rotate(convertAngleToRendererSpace(angle), context.x, context.y);
    }
    return this;
  }

  hideLabel(): void {
    this._text.attr({ visibility: 'hidden' });
    this._line.attr({ visibility: 'hidden' });
  }

  checkIntersect(anotherBar: BarWrapper): boolean {
    const coords = this.calculateLabelCoords();
    const anotherCoords = anotherBar.calculateLabelCoords();

    if (!coords || !anotherCoords) {
      return false;
    }

    const width = Math.max(
      0,
      Math.min(coords.bottomRight.x, anotherCoords.bottomRight.x)
        - Math.max(coords.topLeft.x, anotherCoords.topLeft.x),
    );
    const height = Math.max(
      0,
      Math.min(coords.bottomRight.y, anotherCoords.bottomRight.y)
        - Math.max(coords.topLeft.y, anotherCoords.topLeft.y),
    );

    return (width * height) !== 0;
  }

  calculateLabelCoords(): LabelCoords | undefined {
    if (!this._text) {
      return undefined;
    }

    const box = this._text.getBBox();
    return {
      topLeft: {
        x: box.x,
        y: box.y,
      },
      bottomRight: {
        x: box.x + box.width,
        y: box.y + box.height,
      },
    };
  }

  _processValue(value: number): number {
    return this._context.translator.translate(this._context.translator.adjust(value));
  }

  applyValue(): this {
    if (!this._visible) {
      return this;
    }
    return this.setAngle(this._processValue(this.getValue()));
  }

  update({ color, value }: { color: string; value: number }): void {
    this._color = color;
    this._value = value;
  }

  hide(): void {
    this._visible = false;
  }

  getColor(): string {
    return this._color;
  }

  getValue(): number {
    return this._value;
  }

  beginAnimation(): void {
    if (!this._visible) {
      return;
    }
    const angle = this._processValue(this.getValue());
    if (!compareFloats(this._angle, angle)) {
      this._start = this._angle;
      this._delta = angle - this._angle;
      this._tracker.attr({ visibility: 'hidden' });
      if (this._context.textEnabled) {
        this._line.attr({ visibility: 'hidden' });
        this._text.attr({ visibility: 'hidden' });
      }
    } else {
      this.setAngle(this._angle);
    }
  }

  animate(pos: number): void {
    if (!this._visible || this._start === undefined || this._delta === undefined) {
      return;
    }
    this._angle = this._start + this._delta * pos;
    setAngles(this._settings, this._context.baseAngle, this._angle);
    this._bar.attr(this._settings);
  }

  endAnimation(): void {
    if (this._delta !== undefined && this._start !== undefined) {
      if (compareFloats(this._angle, this._start + this._delta)) {
        this._tracker.attr({ visibility: null });
        this.setAngle(this._angle);
      }
    }
    delete this._start;
    delete this._delta;
  }
}

let BarWrapperClass = BarWrapper;

class BarGauge extends BaseGauge {
  _barsGroup;

  _values!: number[];

  _context!: BarContext;

  _animateStep!: (pos: number) => void;

  _animateComplete!: () => void;

  _baseValue!: number;

  _area!: CircularArea;

  _bars!: BarWrapper[];

  _palette;

  _textIndent!: number;

  _outerRadius!: number;

  _innerRadius!: number;

  _barSpacing!: number;

  _dummyBackground;

  _initCore(): void {
    super._initCore();
    this._barsGroup = this._renderer.g()
      .attr({ class: 'dxbg-bars' })
      .linkOn(this._renderer.root, 'bars');
    this._values = [];
    this._context = {
      renderer: this._renderer,
      translator: this._translator,
      tracker: this._tracker,
      group: this._barsGroup,
    } as BarContext;
    this._animateStep = (pos: number): void => {
      this._bars.forEach((bar) => bar.animate(pos));
    };
    this._animateComplete = (): void => {
      this._bars.forEach((bar) => bar.endAnimation());
      this._checkOverlap();
    };
  }

  _disposeCore(): void {
    this._barsGroup.linkOff();
    Object.assign(this, {
      _barsGroup: null,
      _values: null,
      _context: null,
      _animateStep: null,
      _animateComplete: null,
    });
    super._disposeCore();
  }

  _setupDomainCore(): void {
    const startOption = this.option('startValue');
    const endOption = this.option('endValue');
    const startValue = isFinite(startOption) ? startOption : 0;
    const endValue = isFinite(endOption) ? endOption : 100;
    this._translator.setDomain(startValue, endValue);
    const baseValue = this._translator.adjust(this.option('baseValue'));
    const domainMin = startValue < endValue ? startValue : endValue;
    this._baseValue = isFinite(baseValue) ? baseValue : domainMin;
  }

  _getDefaultSize(): { width: number; height: number } {
    return { width: 300, height: 300 };
  }

  _setupCodomain(): void {
    setupCircularCodomain(this);
  }

  _getApproximateScreenRange(): number {
    const { sides } = this._area;
    const width = this._canvas.width / (sides.right - sides.left);
    const height = this._canvas.height / (sides.down - sides.up);
    const r = width < height ? width : height;
    return -this._translator.getCodomainRange() * r * PI_DIV_180;
  }

  _setupAnimationSettings(): void {
    super._setupAnimationSettings();
    if (this._animationSettings) {
      this._animationSettings.step = this._animateStep;
      this._animationSettings.complete = this._animateComplete;
    }
  }

  _cleanContent(): void {
    this._barsGroup.linkRemove();
    if (this._animationSettings) {
      this._barsGroup.stopAnimation();
    }
    this._barsGroup.clear();
  }

  _renderContent(): void {
    const labelOptions = this.option('label');
    const context = this._context;

    this._barsGroup.linkAppend();
    context.textEnabled = labelOptions === undefined
      || (labelOptions && (!('visible' in labelOptions) || labelOptions.visible));

    if (context.textEnabled) {
      context.fontStyles = patchFontOptions(extend(
        {},
        this._themeManager.theme().label.font,
        labelOptions?.font,
        { color: labelOptions?.font?.color || null },
      ));

      const mergedLabelOptions = extend(true, {}, this._themeManager.theme().label, labelOptions);
      context.formatOptions = {
        format: mergedLabelOptions.format !== undefined
          ? mergedLabelOptions.format
          : this._defaultFormatOptions,
        customizeText: mergedLabelOptions.customizeText,
      };
      context.textOptions = { align: 'center' };

      this._textIndent = mergedLabelOptions.indent > 0 ? Number(mergedLabelOptions.indent) : 0;
      context.lineWidth = mergedLabelOptions.connectorWidth > 0
        ? Number(mergedLabelOptions.connectorWidth)
        : 0;
      context.lineColor = mergedLabelOptions.connectorColor || null;

      const text = this._renderer
        .text(getSampleText(this._translator, context.formatOptions), 0, 0)
        .attr(context.textOptions)
        .css(context.fontStyles)
        .append(this._barsGroup);
      const bBox = text.getBBox();
      text.remove();

      context.textY = bBox.y;
      context.textWidth = bBox.width;
      context.textHeight = bBox.height;
    }

    applyCircularMainLayout(this, this._measureMainElements());
    this._renderBars();
  }

  _measureMainElements(): CircularLayoutMeasurements {
    const result: CircularLayoutMeasurements = { maxRadius: this._area.radius };
    if (this._context.textEnabled) {
      result.horizontalMargin = this._context.textWidth;
      result.verticalMargin = this._context.textHeight;
      result.inverseHorizontalMargin = this._context.textWidth / 2;
      result.inverseVerticalMargin = this._context.textHeight / 2;
    }
    return result;
  }

  _renderBars(): void {
    const options = extend({}, this._themeManager.theme(), this.option());
    const area = this._area;

    const relativeInnerRadius = options.relativeInnerRadius > 0 && options.relativeInnerRadius < 1
      ? Number(options.relativeInnerRadius)
      : 0.1;
    let { radius } = area;
    if (this._context.textEnabled) { //  B253614
      this._textIndent = Math.round(Math.min(this._textIndent, radius / 2));
      radius -= this._textIndent;
    }
    this._outerRadius = Math.floor(radius);
    this._innerRadius = Math.floor(radius * relativeInnerRadius);
    this._barSpacing = options.barSpacing > 0 ? Number(options.barSpacing) : 0;
    extend(this._context, {
      backgroundColor: options.backgroundColor,
      x: area.x,
      y: area.y,
      startAngle: area.startCoord,
      endAngle: area.endCoord,
      baseAngle: this._translator.translate(this._baseValue),
    });

    this._arrangeBars();
  }

  _arrangeBars(): void {
    const availableRadius = this._outerRadius - this._innerRadius;
    const context = this._context;
    const count = this._bars.length;

    this._beginValueChanging();
    context.barSize = count > 0
      ? Math.max((availableRadius - (count - 1) * this._barSpacing) / count, 1)
      : 0;
    const spacing = count > 1
      ? Math.max(
        Math.min((availableRadius - count * context.barSize) / (count - 1), this._barSpacing),
        0,
      )
      : 0;
    const visibleCount = Math.min(
      Math.floor((availableRadius + spacing) / context.barSize),
      count,
    );
    this._setBarsCount();
    context.textRadius = this._outerRadius;
    context.textIndent = this._textIndent;
    this._palette.reset();
    const unitOffset = context.barSize + spacing;
    const colors = this._palette.generateColors(visibleCount);
    let radius = this._outerRadius;
    for (let i = 0; i < visibleCount; i += 1) {
      this._bars[i].arrange({
        radius,
        color: colors[i],
      });
      radius -= unitOffset;
    }

    for (let i = visibleCount; i < count; i += 1) {
      this._bars[i].hide();
    }

    if (this._animationSettings && !this._noAnimation) {
      this._animateBars();
    } else {
      this._updateBars();
    }
    this._endValueChanging();
  }

  _setBarsCount(): void {
    if (this._bars.length > 0) {
      if (this._dummyBackground) {
        this._dummyBackground.dispose();
        this._dummyBackground = null;
      }
    } else {
      if (!this._dummyBackground) {
        this._dummyBackground = this._renderer.arc().attr({ 'stroke-linejoin': 'round' });
      }
      this._dummyBackground.attr({ //  Because of vizMocks
        x: this._context.x,
        y: this._context.y,
        outerRadius: this._outerRadius,
        innerRadius: this._innerRadius,
        startAngle: this._context.endAngle,
        endAngle: this._context.startAngle,
        fill: this._context.backgroundColor,
      }).append(this._barsGroup);
    }
  }

  _getCenter(): Point {
    return { x: this._context.x, y: this._context.y };
  }

  _updateBars(): void {
    this._bars.forEach((bar) => bar.applyValue());
    this._checkOverlap();
  }

  _checkOverlap(): void {
    const overlapStrategy = normalizeEnum(this._getOption('resolveLabelOverlapping', true));
    const shiftFunction = (box: ThemeValue, length: number): ThemeValue => (
      getVerticallyShiftedAngularCoords(box, -length, this._context)
    );

    if (overlapStrategy === 'none') {
      return;
    }
    if (overlapStrategy === 'shift') {
      const newBars = this._dividePoints();
      overlapping.resolveLabelOverlappingInOneDirection(
        newBars.left,
        this._canvas,
        false,
        false,
        shiftFunction,
      );
      overlapping.resolveLabelOverlappingInOneDirection(
        newBars.right,
        this._canvas,
        false,
        false,
        shiftFunction,
      );
      this._clearLabelsCrossTitle();
      this._drawConnector();
    } else {
      this._clearOverlappingLabels();
    }
  }

  _drawConnector(): void {
    const { connectorWidth } = this._getOption('label');

    this._bars.forEach((bar) => {
      if (!bar._isLabelShifted) {
        return;
      }

      const x = bar._bar.attr('x');
      const y = bar._bar.attr('y');
      const innerRadius = bar._bar.attr('innerRadius');
      const outerRadius = bar._bar.attr('outerRadius');
      const startAngle = bar._bar.attr('startAngle');
      const endAngle = bar._bar.attr('endAngle');
      const [arcX, arcY, , arcOuterRadius, startAngleCos, startAngleSin] = normalizeArcParams(
        x,
        y,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
      );
      const coordStart = getStartCoordsArc(
        arcX,
        arcY,
        arcOuterRadius,
        startAngleCos,
        startAngleSin,
      );
      const { cos, sin } = getCosAndSin(bar._angle);
      const xStart = coordStart.x - (sin * connectorWidth) / 2 - cos;
      const yStart = coordStart.y - (cos * connectorWidth) / 2 + sin;
      const box = bar._text.getBBox();
      const lastCoords = bar._text._lastCoords;
      const indentFromLabel = this._context.textWidth / 2;
      const originalXLabelCoord = box.x + box.width / 2 + lastCoords.x;
      const originalPoints = [
        xStart,
        yStart,
        originalXLabelCoord,
        box.y + lastCoords.y,
      ];

      if (bar._angle > 90) {
        originalPoints[2] += indentFromLabel;
      } else {
        originalPoints[2] -= indentFromLabel;
      }

      if (bar._angle <= 180 && bar._angle > 0) {
        originalPoints[3] += box.height;
      }

      if (connectorWidth % 2) {
        const xDeviation = -sin / 2;
        const yDeviation = -cos / 2;

        if (bar._angle > 180) {
          originalPoints[0] -= xDeviation;
          originalPoints[1] -= yDeviation;
        } else if (bar._angle > 0 && bar._angle <= 90) {
          originalPoints[0] += xDeviation;
          originalPoints[1] += yDeviation;
        }
      }

      const points = originalPoints.map((coordinate) => roundFloatPart(coordinate, 4));
      bar._line.attr({ points });
      bar._line.rotate(0);
      bar._isLabelShifted = false;
    });
  }

  _dividePoints(): StackedBars {
    const stackedBars: StackedBars = { left: [], right: [] };
    return this._bars.reduce((stackBars, bar) => {
      const angle = normalizeAngle(bar._angle);
      const isRightSide = angle <= 90 || angle >= 270;
      bar._text._lastCoords = { x: 0, y: 0 };
      const barToExtend = isRightSide ? stackBars.right : stackBars.left;

      barToExtend
        .push({
          series: {
            isStackedSeries: (): boolean => false,
            isFullStackedSeries: (): boolean => false,
          },
          getLabels: (): ThemeValue[] => [{
            isVisible: (): boolean => true,
            getBoundingRect: (): ThemeValue => {
              const {
                height, width, x, y,
              } = bar._text.getBBox();
              const lastCoords = bar._text._lastCoords;

              return {
                x: x + lastCoords.x,
                y: y + lastCoords.y,
                width,
                height,
              };
            },
            shift: (x: number, y: number): void => {
              const box = bar._text.getBBox();

              bar._text._lastCoords = { x: x - box.x, y: y - box.y };
              bar._text.attr({ translateX: x - box.x, translateY: y - box.y });
              bar._isLabelShifted = true;
            },
            draw: (): void => bar.hideLabel(),
            getData: (): { value: number } => ({ value: bar.getValue() }),
            hideInsideLabel: (): boolean => false,
          }],
        });
      return stackBars;
    }, stackedBars);
  }

  _clearOverlappingLabels(): void {
    let currentIndex = 0;
    let nextIndex = 1;
    const sortedBars = this._bars.concat().sort((a, b) => a.getValue() - b.getValue());

    while (currentIndex < sortedBars.length && nextIndex < sortedBars.length) {
      const current = sortedBars[currentIndex];
      const next = sortedBars[nextIndex];

      if (current.checkIntersect(next)) {
        next.hideLabel();
        nextIndex += 1;
      } else {
        currentIndex = nextIndex;
        nextIndex = currentIndex + 1;
      }
    }
  }

  _clearLabelsCrossTitle(): void {
    const titleCoords = this._title.getLayoutOptions() || {
      x: 0, y: 0, height: 0, width: 0,
    };
    const minY = titleCoords.y + titleCoords.height;

    this._bars.forEach((bar) => {
      const box = bar._text.getBBox();
      const lastCoords = bar._text._lastCoords;

      if (minY > box.y + lastCoords.y) {
        bar.hideLabel();
      }
    });
  }

  _animateBars(): void {
    if (this._bars.length > 0) {
      this._bars.forEach((bar) => bar.beginAnimation());
      this._barsGroup.animate({ _: 0 }, this._animationSettings);
    }
  }

  _buildNodes(): void {
    const options = this._options.silent();

    const legendOptions = this._themeManager.theme('legend');
    legendOptions._incidentOccurred = this._incidentOccurred;

    this._palette = this._themeManager.createPalette(options.palette, {
      useHighlight: true,
      extensionMode: options.paletteExtensionMode,
    });

    this._palette.reset();

    this._bars = this._bars || [];

    if (this._animationSettings) {
      this._barsGroup.stopAnimation();
    }

    const barValues = this._values.filter(isFinite);
    const count = barValues.length;

    if (this._bars.length > count) {
      const ii = this._bars.length;
      for (let i = count; i < ii; i += 1) {
        this._bars[i].dispose();
      }
      this._bars.splice(count, ii - count);
    } else if (this._bars.length < count) {
      for (let i = this._bars.length; i < count; i += 1) {
        this._bars.push(new BarWrapperClass(i, this._context));
      }
    }

    this._bars.forEach((bar, index) => {
      bar.update({
        color: this._palette.getNextColor(count),
        value: barValues[index],
      });
    });
  }

  _updateValues(values: ThemeValue): void {
    const list: ThemeValue[] = (Array.isArray(values) && values)
      || (isFinite(values) && [values])
      || [];
    const ii = list.length;
    this._values.length = ii;
    for (let i = 0; i < ii; i += 1) {
      const value = list[i];
      this._values[i] = Number(isFinite(value) ? value : this._values[i]);
    }

    if (!this._resizing) {
      if (!compareArrays(this._values, this.option(OPTION_VALUES))) {
        this.option(OPTION_VALUES, this._values.slice());
      }
    }

    this._change(['NODES']);
  }

  values(arg?: ThemeValue): this | number[] {
    if (arg !== undefined) {
      this._updateValues(arg);
      return this;
    }
    return this._values.slice(0);
  }

  _change_VALUES(): void {
    this._updateValues(this.option(OPTION_VALUES));
  }

  _getChangesRequireCoreUpdate(): string[] {
    return [
      ...super._getChangesRequireCoreUpdate(),
      'LEGEND',
    ];
  }

  _change_NODES(): void {
    this._buildNodes();
  }

  _change_MOSTLY_TOTAL(): void {
    this._change(['NODES']);
    super._change_MOSTLY_TOTAL();
  }

  _getLegendData(): ThemeValue[] {
    const options = this._options.silent();
    const labelFormatOptions = (options.label || {}).format;
    const legendFormatOptions = (options.legend || {}).itemTextFormat;
    const formatOptions: GaugeFormatOptions = {
      format: legendFormatOptions || labelFormatOptions || this._defaultFormatOptions,
    };

    return (this._bars || []).map((bar) => ({
      id: bar.index,
      item: {
        value: bar.getValue(),
        color: bar.getColor(),
        index: bar.index,
      },
      text: formatValue(bar.getValue(), formatOptions),
      visible: true,
      states: { normal: { fill: bar.getColor() } },
    }));
  }
}

setupWidgetPrototype(BarGauge, {
  _rootClass: 'dxbg-bar-gauge',
  _themeSection: 'barGauge',
  _fontFields: ['label.font', 'legend.font', 'legend.title.font', 'legend.title.subtitle.font'],
  _optionChangesMap: {
    backgroundColor: 'MOSTLY_TOTAL',
    relativeInnerRadius: 'MOSTLY_TOTAL',
    barSpacing: 'MOSTLY_TOTAL',
    label: 'MOSTLY_TOTAL',
    resolveLabelOverlapping: 'MOSTLY_TOTAL',
    palette: 'MOSTLY_TOTAL',
    paletteExtensionMode: 'MOSTLY_TOTAL',
    values: 'VALUES',
  },
  _factory: clone(BaseGauge.prototype._factory),
  _optionChangesOrder: ['VALUES', 'NODES'],
  _initialChanges: ['VALUES'],
  _proxyData: [],
});

registerComponent('dxBarGauge', BarGauge);

BarGauge.addPlugin(pluginLegend);
BarGauge.addPlugin(centerTemplatePlugins.gauge);

export { BarGauge as dxBarGauge };

/// #DEBUG
export { BarWrapper };

export function stubBarWrapper(barWrapperStub: typeof BarWrapper): void {
  BarWrapperClass = barWrapperStub;
}

export function restoreBarWrapper(): void {
  BarWrapperClass = BarWrapper;
}
/// #ENDDEBUG
