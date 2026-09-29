/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined, isNumeric } from '@js/core/utils/type';
import { Axis } from '@ts/viz/axes/base_axis';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { map, normalizeEnum } from '@ts/viz/core/utils';
import { BaseGauge, compareArrays } from '@ts/viz/gauges/base_gauge';

const SHIFT_ANGLE = 90;

const OPTION_VALUE = 'value';
const OPTION_SUBVALUES = 'subvalues';
const DEFAULT_MINOR_AXIS_DIVISION_FACTOR = 5;
const DEFAULT_NUMBER_MULTIPLIERS = [1, 2, 5];

export interface ScaleTypes {
  type: string;
  drawingType: string;
}

export interface ScaleMeasure {
  min?: number;
  max?: number;
  indent?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  inverseHorizontalOffset?: number;
  inverseVerticalOffset?: number;
}

export interface TicksCoefficients {
  inner: number;
  outer: number;
}

function processValue(value: ThemeValue, fallbackValue: ThemeValue): ThemeValue {
  if (value === null) {
    return value;
  }
  return isFinite(value) ? Number(value) : fallbackValue;
}

function parseArrayOfNumbers(arg: ThemeValue): ThemeValue[] | null {
  if (Array.isArray(arg)) {
    return arg;
  }
  return isNumeric(arg) ? [arg] : null;
}

function pickDomainValue(value: ThemeValue, scaleValue: ThemeValue, defaultValue: number): number {
  if (isNumeric(value)) {
    return Number(value);
  }
  return isNumeric(scaleValue) ? Number(scaleValue) : defaultValue;
}

abstract class Gauge extends BaseGauge {
  __value: ThemeValue;

  __subvalues!: ThemeValue[] | null;

  _rangeContainer;

  _subvalueIndicatorContainer;

  _scaleGroup;

  _labelsAxesGroup;

  _scale;

  _valueIndicator;

  _subvalueIndicatorsSet;

  _baseValue!: number;

  _scaleTypes!: ScaleTypes;

  _gridSpacingFactor!: number;

  _initCore(): void {
    const renderer = this._renderer;

    this._setupValue(this.option(OPTION_VALUE));
    this.__subvalues = parseArrayOfNumbers(this.option(OPTION_SUBVALUES));
    this._setupSubvalues(this.__subvalues);

    selectMode(this);
    super._initCore();

    this._rangeContainer = new this._factory.RangeContainer({
      renderer,
      container: renderer.root,
      translator: this._translator,
      themeManager: this._themeManager,
    });
    this._initScale();
    this._subvalueIndicatorContainer = this._renderer.g().attr({ class: 'dxg-subvalue-indicators' })
      .linkOn(this._renderer.root, 'valueIndicator').enableLinks();
  }

  _initScale(): void {
    this._scaleGroup = this._renderer.g().attr({ class: 'dxg-scale' }).linkOn(this._renderer.root, 'scale');
    this._labelsAxesGroup = this._renderer.g().attr({ class: 'dxg-scale-elements' })
      .linkOn(this._renderer.root, 'scale-elements');
    this._scale = new Axis({
      incidentOccurred: this._incidentOccurred,
      renderer: this._renderer,
      axesContainerGroup: this._scaleGroup,
      labelsAxesGroup: this._labelsAxesGroup,
      axisType: this._scaleTypes.type,
      drawingType: this._scaleTypes.drawingType,
      widgetClass: 'dxg',
      getTemplate(): void {},
    });
  }

  _disposeCore(): void {
    super._disposeCore();

    this._scale.dispose();
    this._scaleGroup.linkOff();
    this._labelsAxesGroup.linkOff();

    this._rangeContainer.dispose();
    this._disposeValueIndicators();
    this._subvalueIndicatorContainer.linkOff();

    this._rangeContainer = null;
    this._labelsAxesGroup = null;
    this._scaleGroup = null;
    this._scale = null;
  }

  _disposeValueIndicators(): void {
    if (this._valueIndicator) {
      this._valueIndicator.dispose();
    }
    if (this._subvalueIndicatorsSet) {
      this._subvalueIndicatorsSet.dispose();
    }
    this._subvalueIndicatorsSet = null;
    this._valueIndicator = null;
  }

  _setupDomainCore(): void {
    const scaleOption = this.option('scale') || {};
    const startValue = pickDomainValue(this.option('startValue'), scaleOption.startValue, 0);
    const endValue = pickDomainValue(this.option('endValue'), scaleOption.endValue, 100);

    this._baseValue = startValue < endValue ? startValue : endValue;
    this._translator.setDomain(startValue, endValue);
  }

  _cleanContent(): void {
    this._rangeContainer.clean();
    this._cleanValueIndicators();
  }

  _measureScale(scaleOptions: ThemeValue): ScaleMeasure {
    const majorTick = scaleOptions.tick;
    const majorTickEnabled = majorTick.visible && majorTick.length > 0 && majorTick.width > 0;
    const { minorTick } = scaleOptions;
    const minorTickEnabled = minorTick.visible && minorTick.length > 0 && minorTick.width > 0;
    const { label } = scaleOptions;
    const indentFromTick = Number(label.indentFromTick);

    if (!majorTickEnabled && !minorTickEnabled && !label.visible) { return {}; }

    const textParams = this._scale.measureLabels(extend({}, this._canvas));
    const layoutValue = this._getScaleLayoutValue();
    const result: ScaleMeasure = { min: layoutValue, max: layoutValue };
    const coefs = this._getTicksCoefficients(scaleOptions);
    const innerCoef = coefs.inner;
    const outerCoef = coefs.outer;

    if (majorTickEnabled) {
      result.min = Math.min(result.min as number, layoutValue - innerCoef * majorTick.length);
      result.max = Math.max(result.max as number, layoutValue + outerCoef * majorTick.length);
    }
    if (minorTickEnabled) {
      result.min = Math.min(result.min as number, layoutValue - innerCoef * minorTick.length);
      result.max = Math.max(result.max as number, layoutValue + outerCoef * minorTick.length);
    }
    if (label.visible) {
      this._correctScaleIndents(result, indentFromTick, textParams);
    }

    return result;
  }

  _renderContent(): void {
    const scaleOptions = this._prepareScaleSettings();

    this._rangeContainer.render(extend(this._getOption('rangeContainer'), { vertical: this._area.vertical }));
    this._renderScale(scaleOptions);
    this._subvalueIndicatorContainer.linkAppend();

    const elements: ThemeValue[] = map(
      [this._rangeContainer].concat(this._prepareValueIndicators()),
      (element) => (element && element.enabled ? element : null),
    );

    this._applyMainLayout(elements, this._measureScale(scaleOptions));
    elements.forEach((element) => element.resize(this._getElementLayout(element.getOffset())));
    this._shiftScale(this._getElementLayout(0), scaleOptions);

    this._beginValueChanging();
    this._updateActiveElements();
    this._endValueChanging();
  }

  _prepareScaleSettings(): ThemeValue {
    const userOptions = this.option('scale');
    const scaleOptions = extend(true, {}, this._themeManager.theme('scale'), userOptions);

    scaleOptions.label.indentFromAxis = 0;
    scaleOptions.isHorizontal = !this._area.vertical;
    // eslint-disable-next-line no-bitwise
    scaleOptions.forceUserTickInterval |= Number(
      isDefined(userOptions)
      && isDefined(userOptions.tickInterval)
      && !isDefined(userOptions.scaleDivisionFactor),
    );
    scaleOptions.axisDivisionFactor = scaleOptions.scaleDivisionFactor || this._gridSpacingFactor;
    scaleOptions.minorAxisDivisionFactor = scaleOptions.minorScaleDivisionFactor
      || DEFAULT_MINOR_AXIS_DIVISION_FACTOR;
    scaleOptions.numberMultipliers = DEFAULT_NUMBER_MULTIPLIERS;
    scaleOptions.tickOrientation = this._getTicksOrientation(scaleOptions);
    if (scaleOptions.label.useRangeColors) {
      const getColorForValue = (value: number): ThemeValue => this._rangeContainer
        .getColorForValue(value);
      scaleOptions.label.customizeColor = function customizeColor(
        this: { value: number },
      ): ThemeValue {
        return getColorForValue(this.value);
      };
    }

    return scaleOptions;
  }

  _renderScale(scaleOptions: ThemeValue): void {
    const bounds = this._translator.getDomain();
    const startValue = bounds[0];
    const endValue = bounds[1];
    const angles = this._translator.getCodomain();
    const invert = (startValue > endValue) !== Boolean(scaleOptions.inverted);
    const min = Math.min(startValue, endValue);
    const max = Math.max(startValue, endValue);

    scaleOptions.min = min;
    scaleOptions.max = max;
    scaleOptions.startAngle = SHIFT_ANGLE - angles[0];
    scaleOptions.endAngle = SHIFT_ANGLE - angles[1];
    scaleOptions.skipViewportExtending = true;
    scaleOptions.inverted = invert;
    this._scale.updateOptions(scaleOptions);
    this._scale.setBusinessRange({
      axisType: 'continuous',
      dataType: 'numeric',
      min,
      max,
      invert,
    });
    this._updateScaleTickIndent(scaleOptions);

    this._scaleGroup.linkAppend();
    this._labelsAxesGroup.linkAppend();
    this._scale.draw(extend({}, this._canvas));
  }

  _updateIndicatorSettings(settings: ThemeValue): void {
    settings.baseValue = isFinite(this._translator.translate(settings.baseValue))
      ? Number(settings.baseValue)
      : this._baseValue;
    settings.currentValue = settings.baseValue;
    settings.vertical = this._area.vertical;
    if (settings.text && !settings.text.format) {
      settings.text.format = this._defaultFormatOptions;
    }
  }

  _prepareIndicatorSettings(options: ThemeValue, defaultTypeField: string): ThemeValue {
    const theme = this._themeManager.theme('valueIndicators');
    const type = normalizeEnum(options.type || this._themeManager.theme(defaultTypeField));
    const settings = extend(true, {}, theme._default, theme[type], options);
    settings.type = type;
    settings.animation = this._animationSettings;
    settings.containerBackgroundColor = this._containerBackgroundColor;
    this._updateIndicatorSettings(settings);
    return settings;
  }

  _cleanValueIndicators(): void {
    if (this._valueIndicator) {
      this._valueIndicator.clean();
    }
    if (this._subvalueIndicatorsSet) {
      this._subvalueIndicatorsSet.clean();
    }
  }

  _prepareValueIndicators(): ThemeValue[] {
    this._prepareValueIndicator();
    if (this.__subvalues !== null) {
      this._prepareSubvalueIndicators();
    }
    return [this._valueIndicator, this._subvalueIndicatorsSet];
  }

  _updateActiveElements(): void {
    this._updateValueIndicator();
    this._updateSubvalueIndicators();
  }

  _prepareValueIndicator(): void {
    let target = this._valueIndicator;
    const settings = this._prepareIndicatorSettings(this.option('valueIndicator') || {}, 'valueIndicatorType');
    if (target && target.type !== settings.type) {
      target.dispose();
      target = null;
    }
    if (!target) {
      this._valueIndicator = this._createIndicator(settings.type, this._renderer.root, 'dxg-value-indicator', 'value-indicator');
      target = this._valueIndicator;
    }
    target.render(settings);
  }

  _createSubvalueIndicatorsSet(): ValueIndicatorsSet {
    const root = this._subvalueIndicatorContainer;
    return new ValueIndicatorsSet({
      createIndicator: (type: string, i?: number): ThemeValue => this._createIndicator(type, root, 'dxg-subvalue-indicator', 'subvalue-indicator', i),
      createPalette: (palette: ThemeValue): ThemeValue => this._themeManager.createPalette(palette),
    });
  }

  _prepareSubvalueIndicators(): void {
    let target = this._subvalueIndicatorsSet;
    const settings = this._prepareIndicatorSettings(this.option('subvalueIndicator') || {}, 'subvalueIndicatorType');
    if (!target) {
      this._subvalueIndicatorsSet = this._createSubvalueIndicatorsSet();
      target = this._subvalueIndicatorsSet;
    }
    const isRecreate = settings.type !== target.type;
    target.type = settings.type;
    const dummy = this._createIndicator(settings.type, this._renderer.root);
    if (dummy) {
      dummy.dispose();
      target.render(settings, isRecreate);
    }
  }

  _setupValue(value: ThemeValue): void {
    this.__value = processValue(value, this.__value);
  }

  _setupSubvalues(subvalues?: ThemeValue): void {
    const vals = subvalues === undefined ? this.__subvalues : parseArrayOfNumbers(subvalues);
    if (vals === null) return;
    const current = this.__subvalues as ThemeValue[];
    const list: ThemeValue[] = [];
    for (let i = 0; i < vals.length; i += 1) {
      list.push(processValue(vals[i], current[i]));
    }
    this.__subvalues = list;
  }

  _updateValueIndicator(): void {
    if (this._valueIndicator) {
      this._valueIndicator.value(this.__value, this._noAnimation);
    }
  }

  _updateSubvalueIndicators(): void {
    if (this._subvalueIndicatorsSet) {
      this._subvalueIndicatorsSet.values(this.__subvalues, this._noAnimation);
    }
  }

  value(arg?: ThemeValue): this | ThemeValue {
    if (arg !== undefined) {
      this._changeValue(arg);
      return this;
    }
    return this.__value;
  }

  subvalues(arg?: ThemeValue): this | ThemeValue[] | undefined {
    if (arg !== undefined) {
      this._changeSubvalues(arg);
      return this;
    }
    return this.__subvalues !== null ? this.__subvalues.slice() : undefined;
  }

  _changeValue(value: ThemeValue): void {
    this._setupValue(value);
    this._beginValueChanging();
    this._updateValueIndicator();
    this._updateExtraElements();
    if (this.__value !== this.option(OPTION_VALUE)) {
      this.option(OPTION_VALUE, this.__value);
    }
    this._endValueChanging();
  }

  _changeSubvalues(subvalues: ThemeValue): void {
    if (this.__subvalues !== null) {
      this._setupSubvalues(subvalues);
      this._beginValueChanging();
      this._updateSubvalueIndicators();
      this._updateExtraElements();
      this._endValueChanging();
    } else {
      this.__subvalues = parseArrayOfNumbers(subvalues);
      this._setContentSize();
      this._renderContent();
    }

    if (!compareArrays(this.__subvalues, this.option(OPTION_SUBVALUES))) {
      this.option(OPTION_SUBVALUES, this.__subvalues);
    }
  }

  _change_VALUE(): void {
    this._changeValue(this.option(OPTION_VALUE));
  }

  _change_SUBVALUES(): void {
    this._changeSubvalues(this.option(OPTION_SUBVALUES));
  }

  _createIndicator(
    type: string,
    owner: ThemeValue,
    className?: string,
    trackerType?: string,
    trackerIndex?: number,
    strict?: boolean,
  ): ThemeValue {
    const indicator = this._factory.createIndicator({
      renderer: this._renderer,
      translator: this._translator,
      owner,
      tracker: this._tracker,
      className,
    }, type, strict);
    if (indicator) {
      indicator.type = type;
      indicator._trackerInfo = { type: trackerType, index: trackerIndex };
    }
    return indicator;
  }

  abstract _updateScaleTickIndent(scaleOptions: ThemeValue): void;

  abstract _shiftScale(layout: ThemeValue, scaleOptions: ThemeValue): void;

  abstract _getScaleLayoutValue(): number;

  abstract _getTicksOrientation(scaleOptions: ThemeValue): string;

  abstract _getTicksCoefficients(scaleOptions: ThemeValue): TicksCoefficients;

  abstract _correctScaleIndents(
    result: ScaleMeasure,
    indentFromTick: number,
    textParams: ThemeValue,
  ): void;

  abstract _applyMainLayout(elements: ThemeValue[], scaleMeasurement: ScaleMeasure): void;

  abstract _getElementLayout(offset?: number): ThemeValue;
}

setupWidgetPrototype(Gauge, {
  _fontFields: [
    'scale.label.font',
    'valueIndicators.rangebar.text.font',
    'valueIndicators.textcloud.text.font',
    'indicator.text.font',
  ],
  _optionChangesMap: {
    scale: 'DOMAIN',
    rangeContainer: 'MOSTLY_TOTAL',
    valueIndicator: 'MOSTLY_TOTAL',
    subvalueIndicator: 'MOSTLY_TOTAL',
    containerBackgroundColor: 'MOSTLY_TOTAL',
    value: 'VALUE',
    subvalues: 'SUBVALUES',
    valueIndicators: 'MOSTLY_TOTAL',
  },
  _customChangesOrder: ['VALUE', 'SUBVALUES'],
});

function valueGetter(arg: ThemeValue): ThemeValue {
  return arg ? arg.value : null;
}

function setupValues(that: ThemeValue, fieldName: string, optionItems: ThemeValue): void {
  const currentValues = that[fieldName];
  const newValues: ThemeValue[] = Array.isArray(optionItems) ? map(optionItems, valueGetter) : [];
  const list: ThemeValue[] = [];
  for (let i = 0; i < newValues.length; i += 1) {
    list.push(processValue(newValues[i], currentValues[i]));
  }
  that[fieldName] = list;
}

function selectMode(gauge: ThemeValue): void {
  if (gauge.option(OPTION_VALUE) === undefined && gauge.option(OPTION_SUBVALUES) === undefined) {
    if (gauge.option('valueIndicators') !== undefined) {
      disableDefaultMode(gauge);
      selectHardMode(gauge);
    }
  }
}

function disableDefaultMode(that: ThemeValue): void {
  that.subvalues = noop;
  that.value = noop;
  that._updateSubvalueIndicators = null;
  that._updateValueIndicator = null;
  that._setupSubvalues = null;
  that._setupValue = null;
}

function selectHardMode(that: ThemeValue): void {
  that._indicatorValues = [];
  setupValues(that, '_indicatorValues', that.option('valueIndicators'));
  that._valueIndicators = [];
  const applyMostlyTotalChange = that._applyMostlyTotalChange;
  that._applyMostlyTotalChange = function applyMostlyTotalChangeHardMode(this: ThemeValue): void {
    setupValues(this, '_indicatorValues', this.option('valueIndicators'));
    applyMostlyTotalChange.call(this);
  };
  that._updateActiveElements = updateActiveElementsHardMode;
  that._prepareValueIndicators = prepareValueIndicatorsHardMode;
  that._disposeValueIndicators = disposeValueIndicatorsHardMode;
  that._cleanValueIndicators = cleanValueIndicatorsHardMode;
  that.indicatorValue = indicatorValueHardMode;
}

function updateActiveElementsHardMode(this: ThemeValue): void {
  this._valueIndicators.forEach((valueIndicator) => {
    valueIndicator.value(this._indicatorValues[valueIndicator.index], this._noAnimation);
  });
}

function prepareValueIndicatorsHardMode(this: ThemeValue): ThemeValue[] {
  const valueIndicators = this._valueIndicators || [];
  const userOptions = this.option('valueIndicators');
  const optionList: ThemeValue[] = [];
  let i = 0;
  for (const ii = Array.isArray(userOptions) ? userOptions.length : 0; i < ii; i += 1) {
    optionList.push(userOptions[i]);
  }
  for (const ii = valueIndicators.length; i < ii; i += 1) {
    optionList.push(null);
  }
  const newValueIndicators: ThemeValue[] = [];
  optionList.forEach((userSettings, index) => {
    let valueIndicator = valueIndicators[index];
    if (!userSettings) {
      if (valueIndicator) {
        valueIndicator.dispose();
      }
      return;
    }
    const settings = this._prepareIndicatorSettings(userSettings, 'valueIndicatorType');
    if (valueIndicator && valueIndicator.type !== settings.type) {
      valueIndicator.dispose();
      valueIndicator = null;
    }
    if (!valueIndicator) {
      valueIndicator = this._createIndicator(settings.type, this._renderer.root, 'dxg-value-indicator', 'value-indicator', index, true);
    }
    if (valueIndicator) {
      valueIndicator.index = index;
      valueIndicator.render(settings);
      newValueIndicators.push(valueIndicator);
    }
  });
  this._valueIndicators = newValueIndicators;
  return this._valueIndicators;
}

function disposeValueIndicatorsHardMode(this: ThemeValue): void {
  this._valueIndicators.forEach((valueIndicator) => valueIndicator.dispose());
  this._valueIndicators = null;
}

function cleanValueIndicatorsHardMode(this: ThemeValue): void {
  this._valueIndicators.forEach((valueIndicator) => valueIndicator.clean());
}

function indicatorValueHardMode(this: ThemeValue, index: number, value?: ThemeValue): ThemeValue {
  return accessPointerValue(this, this._valueIndicators, this._indicatorValues, index, value);
}

function accessPointerValue(
  that: ThemeValue,
  pointers: ThemeValue[],
  values: ThemeValue[],
  index: number,
  value?: ThemeValue,
): ThemeValue {
  if (value !== undefined) {
    if (values[index] !== undefined) {
      values[index] = processValue(value, values[index]);
      if (pointers[index]) {
        pointers[index].value(values[index]);
      }
    }
    return that;
  }
  return values[index];
}

interface ValueIndicatorsSetParameters {
  createIndicator: (type: string, index?: number) => ThemeValue;
  createPalette: (palette: ThemeValue) => ThemeValue;
}

class ValueIndicatorsSet {
  _parameters: ValueIndicatorsSetParameters;

  _indicators: ThemeValue[];

  _options: ThemeValue;

  _sample: ThemeValue;

  _palette: ThemeValue;

  _colorPalette: ThemeValue;

  _layout: ThemeValue;

  type?: string;

  enabled?: boolean;

  constructor(parameters: ValueIndicatorsSetParameters) {
    this._parameters = parameters;
    this._indicators = [];
  }

  dispose(): this {
    this._indicators.forEach((indicator) => indicator.dispose());
    Object.assign(this, {
      _palette: null, _colorPalette: null, _indicators: null, _options: null, _parameters: null,
    });
    return this;
  }

  clean(): this {
    if (this._sample) {
      this._sample.clean().dispose();
    }
    this._indicators.forEach((indicator) => indicator.clean());
    this._palette = null;
    this._options = null;
    this._sample = null;
    return this;
  }

  render(options: ThemeValue, isRecreate?: boolean): this {
    this._options = options;
    this._sample = this._parameters.createIndicator(this.type as string);
    this._sample.render(options);
    this.enabled = this._sample.enabled;
    this._palette = isDefined(options.palette)
      ? this._parameters.createPalette(options.palette)
      : null;
    if (this.enabled) {
      this._generatePalette(this._indicators.length);
      this._indicators = map(this._indicators, (indicator, i) => {
        let current = indicator;
        if (isRecreate) {
          current.dispose();
          current = this._parameters.createIndicator(this.type as string, i);
        }
        current.render(this._getIndicatorOptions(i));
        return current;
      });
    }
    return this;
  }

  getOffset(): number {
    return this._sample.getOffset();
  }

  resize(layout: ThemeValue): this {
    this._layout = layout;
    this._indicators.forEach((indicator) => indicator.resize(layout));
    return this;
  }

  measure(layout: ThemeValue): ThemeValue {
    return this._sample.measure(layout);
  }

  _getIndicatorOptions(index: number): ThemeValue {
    let result = this._options;
    if (this._colorPalette) {
      result = extend({}, result, { color: this._colorPalette[index] });
    }
    return result;
  }

  _generatePalette(count: number): void {
    let colors = null;
    if (this._palette) {
      this._palette.reset();
      colors = this._palette.generateColors(count, { repeat: true });
    }
    this._colorPalette = colors;
  }

  _adjustIndicatorsCount(count: number): void {
    const indicators = this._indicators;
    const indicatorsLen = indicators.length;

    if (indicatorsLen > count) {
      for (let i = count; i < indicatorsLen; i += 1) {
        indicators[i].clean().dispose();
      }
      this._indicators = indicators.slice(0, count);
      this._generatePalette(indicators.length);
    } else if (indicatorsLen < count) {
      this._generatePalette(count);
      for (let i = indicatorsLen; i < count; i += 1) {
        const indicator = this._parameters.createIndicator(this.type as string, i);
        indicator.render(this._getIndicatorOptions(i)).resize(this._layout);
        indicators.push(indicator);
      }
    }
  }

  values(arg?: ThemeValue, noAnimation?: boolean): this | ThemeValue[] | undefined {
    if (!this.enabled) return undefined;
    if (arg !== undefined) {
      let values = arg;
      if (!Array.isArray(values)) {
        values = isFinite(values) ? [Number(values)] : null;
      }
      if (values) {
        this._adjustIndicatorsCount(values.length);
        this._indicators.forEach((indicator, i) => indicator.value(values[i], noAnimation));
      }
      return this;
    }
    return map(this._indicators, (indicator) => indicator.value());
  }
}

export function createIndicatorCreator(
  indicators: Record<string, ThemeValue>,
): (parameters: ThemeValue, type: string, strict?: boolean) => ThemeValue {
  return function createIndicator(
    parameters: ThemeValue,
    type: string,
    strict?: boolean,
  ): ThemeValue {
    const IndicatorType = indicators[normalizeEnum(type)] || (!strict && indicators._default);
    return IndicatorType ? new IndicatorType(parameters) : null;
  };
}

export { Gauge as dxGauge };
