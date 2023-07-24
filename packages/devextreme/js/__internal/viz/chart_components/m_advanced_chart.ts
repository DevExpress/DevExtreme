import { noop as _noop } from '@js/core/utils/common';
import { extend as _extend } from '@js/core/utils/extend';
import { each as _each, reverseEach as _reverseEach } from '@js/core/utils/iterator';
import { isDefined as _isDefined, type } from '@js/core/utils/type';
import { Axis } from '@js/viz/axes/base_axis';
import { SeriesFamily } from '@js/viz/core/series_family';
import {
  convertVisualRangeObject, map as _map,
  mergeMarginOptions, rangesAreEqual, setCanvasValues, unique,
} from '@js/viz/core/utils';
import rangeDataCalculator from '@js/viz/series/helpers/range_data_calculator';
import { Range } from '@js/viz/translators/range';

import { BaseChart } from './m_base_chart';

const { isArray } = Array;

const DEFAULT_AXIS_NAME = 'defaultAxisName';
const FONT = 'font';
const COMMON_AXIS_SETTINGS = 'commonAxisSettings';
const DEFAULT_PANE_NAME = 'default';
const VISUAL_RANGE = 'VISUAL_RANGE';

function prepareAxis(axisOptions) {
  return isArray(axisOptions) ? axisOptions.length === 0 ? [{}] : axisOptions : [axisOptions];
}

function processBubbleMargin(opt, bubbleSize) {
  if (opt.processBubbleSize) {
    opt.size = bubbleSize;
  }
  return opt;
}

function estimateBubbleSize(size, panesCount, maxSize, rotated) {
  const width = rotated ? size.width / panesCount : size.width;
  const height = rotated ? size.height : size.height / panesCount;

  return Math.min(width, height) * maxSize;
}

function setAxisVisualRangeByOption(arg, axis, isDirectOption, index?) {
  let options;
  let visualRange;

  if (isDirectOption) {
    visualRange = arg.value;
    options = {
      skipEventRising: true,
    };

    const wrappedVisualRange = wrapVisualRange(arg.fullName, visualRange);
    if (wrappedVisualRange) {
      options = { allowPartialUpdate: true };
      visualRange = wrappedVisualRange;
    }
  } else {
    visualRange = (_isDefined(index) ? arg.value[index] : arg.value).visualRange;
  }
  axis.visualRange(visualRange, options);
}

function getAxisTypes(groupsData, axis, isArgumentAxes) {
  if (isArgumentAxes) {
    return { argumentAxisType: groupsData.argumentAxisType, argumentType: groupsData.argumentType };
  }
  const { valueAxisType, valueType } = groupsData.groups.filter((g) => g.valueAxis === axis)[0];
  return { valueAxisType, valueType };
}

function wrapVisualRange(fullName, value) {
  const pathElements = fullName.split('.');
  const destElem = pathElements[pathElements.length - 1];

  if (destElem === 'endValue' || destElem === 'startValue') {
    return {
      [destElem]: value,
    };
  }
  return undefined;
}

export const AdvancedChart = BaseChart.inherit({

  _fontFields: [`${COMMON_AXIS_SETTINGS}.label.${FONT}`, `${COMMON_AXIS_SETTINGS}.title.${FONT}`],

  _partialOptionChangesMap: {
    visualRange: VISUAL_RANGE,
    _customVisualRange: VISUAL_RANGE,
    strips: 'REFRESH_AXES',
    constantLines: 'REFRESH_AXES',
  },

  _partialOptionChangesPath: {
    argumentAxis: ['strips', 'constantLines', 'visualRange', '_customVisualRange'],
    valueAxis: ['strips', 'constantLines', 'visualRange', '_customVisualRange'],
  },

  _initCore() {
    this._panesClipRects = {};
    this.callBase();
  },

  _disposeCore() {
    const disposeObjectsInArray = this._disposeObjectsInArray;
    const panesClipRects = this._panesClipRects;

    this.callBase();
    disposeObjectsInArray.call(panesClipRects, 'fixed');
    disposeObjectsInArray.call(panesClipRects, 'base');
    disposeObjectsInArray.call(panesClipRects, 'wide');
    this._panesClipRects = null;
    this._labelsAxesGroup.linkOff();
    this._labelsAxesGroup.dispose();
    this._labelsAxesGroup = null;
  },

  _dispose() {
    const that = this;
    const disposeObjectsInArray = this._disposeObjectsInArray;

    that.callBase();

    that.panes = null;
    if (that._legend) {
      that._legend.dispose();
      that._legend = null;
    }
    disposeObjectsInArray.call(that, 'panesBackground');
    disposeObjectsInArray.call(that, 'seriesFamilies');
    that._disposeAxes();
  },

  _createPanes() {
    this._cleanPanesClipRects('fixed');
    this._cleanPanesClipRects('base');
    this._cleanPanesClipRects('wide');
  },

  _cleanPanesClipRects(clipArrayName) {
    const clipArray = this._panesClipRects[clipArrayName];
    (clipArray || []).forEach((clipRect) => clipRect && clipRect.dispose());
    this._panesClipRects[clipArrayName] = [];
  },

  _getElementsClipRectID(paneName) {
    const clipShape = this._panesClipRects.fixed[this._getPaneIndex(paneName)];
    return clipShape && clipShape.id;
  },

  _getPaneIndex(paneName) {
    let paneIndex;
    const name = paneName || DEFAULT_PANE_NAME;

    _each(this.panes, (index, pane) => {
      if (pane.name === name) {
        paneIndex = index;
        return false;
      }
      return undefined;
    });
    return paneIndex;
  },

  _updateSize() {
    this.callBase();
    setCanvasValues(this._canvas);
  },

  _reinitAxes() {
    this.panes = this._createPanes();
    this._populateAxes();
    this._axesReinitialized = true;
  },

  _populateAxes() {
    const that = this;
    const { panes } = that;
    const rotated = that._isRotated();
    const argumentAxesOptions = prepareAxis(that.option('argumentAxis') || {})[0];
    const valueAxisOption = that.option('valueAxis');
    const valueAxesOptions = prepareAxis(valueAxisOption || {});
    let argumentAxesPopulatedOptions = [];
    const valueAxesPopulatedOptions = [];
    const axisNames = [];
    let valueAxesCounter = 0;
    let paneWithNonVirtualAxis;
    const crosshairMargins = that._getCrosshairMargins();

    function getNextAxisName() {
      return DEFAULT_AXIS_NAME + valueAxesCounter++;
    }

    if (rotated) {
      paneWithNonVirtualAxis = argumentAxesOptions.position === 'right' ? panes[panes.length - 1].name : panes[0].name;
    } else {
      paneWithNonVirtualAxis = argumentAxesOptions.position === 'top' ? panes[0].name : panes[panes.length - 1].name;
    }

    argumentAxesPopulatedOptions = _map(panes, (pane) => {
      const virtual = pane.name !== paneWithNonVirtualAxis;
      return that._populateAxesOptions(
        'argumentAxis',
        argumentAxesOptions,
        {
          pane: pane.name,
          name: null,
          optionPath: 'argumentAxis',
          crosshairMargin: rotated ? crosshairMargins.x : crosshairMargins.y,
        },
        rotated,
        virtual,
      );
    }) as any;

    _each(valueAxesOptions, (priority, axisOptions) => {
      let axisPanes = [];
      const { name } = axisOptions;

      if (name && axisNames.includes(name as never)) {
        that._incidentOccurred('E2102');
        return;
      }
      if (name) {
        axisNames.push(name as never);
      }

      if (axisOptions.pane) {
        axisPanes.push(axisOptions.pane as never);
      }
      if (axisOptions.panes?.length) {
        axisPanes = axisPanes.concat(axisOptions.panes.slice(0));
      }
      axisPanes = unique(axisPanes) as any;
      if (!axisPanes.length) {
        axisPanes.push(undefined as never);
      }

      _each(axisPanes, (_, pane) => {
        const optionPath = isArray(valueAxisOption) ? `valueAxis[${priority}]` : 'valueAxis';

        valueAxesPopulatedOptions.push(that._populateAxesOptions('valueAxis', axisOptions, {
          name: name || getNextAxisName(),
          pane,
          priority,
          optionPath,
          crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x,
        }, rotated) as never);
      });
    });

    that._redesignAxes(argumentAxesPopulatedOptions, true, paneWithNonVirtualAxis);
    that._redesignAxes(valueAxesPopulatedOptions, false);
  },

  _redesignAxes(options, isArgumentAxes, paneWithNonVirtualAxis) {
    const that = this;
    const axesBasis = [];
    let axes = isArgumentAxes ? that._argumentAxes : that._valueAxes;

    _each(options, (_, opt) => {
      const curAxes = axes && axes.filter((a) => a.name === opt.name
                && (!_isDefined(opt.pane) && that.panes.some((p) => p.name === a.pane) || a.pane === opt.pane));
      if (curAxes && curAxes.length > 0) {
        _each(curAxes, (_, axis) => {
          const axisTypes = getAxisTypes(that._groupsData, axis, isArgumentAxes);// T891599
          axis.updateOptions(opt);
          if (isArgumentAxes) {
            axis.setTypes(axisTypes.argumentAxisType, axisTypes.argumentType, 'argumentType');
          } else {
            axis.setTypes(axisTypes.valueAxisType, axisTypes.valueType, 'valueType');
          }
          axis.validate();
          axesBasis.push({ axis } as never);
        });
      } else {
        axesBasis.push({ options: opt } as never);
      }
    });

    if (axes) {
      _reverseEach(axes, (index, axis) => {
        if (!axesBasis.some((basis: any) => basis.axis && basis.axis === axis)) {
          that._disposeAxis(index, isArgumentAxes);
        }
      });
    } else if (isArgumentAxes) {
      axes = that._argumentAxes = [];
    } else {
      axes = that._valueAxes = [];
    }

    _each(axesBasis, (_, basis: any) => {
      let { axis } = basis;
      if (basis.axis && isArgumentAxes) {
        basis.axis.isVirtual = basis.axis.pane !== paneWithNonVirtualAxis;
      } else if (basis.options) {
        axis = that._createAxis(
          isArgumentAxes,
          basis.options,
          isArgumentAxes ? basis.options.pane !== paneWithNonVirtualAxis : undefined,
        );
        axes.push(axis);
      }
      axis.applyVisualRangeSetter(that._getVisualRangeSetter());
    });
  },

  _disposeAxis(index, isArgumentAxis) {
    const axes = isArgumentAxis ? this._argumentAxes : this._valueAxes;
    const axis = axes[index];

    if (!axis) return;

    axis.dispose();
    axes.splice(index, 1);
  },

  _disposeAxes() {
    const that = this;
    const disposeObjectsInArray = that._disposeObjectsInArray;
    disposeObjectsInArray.call(that, '_argumentAxes');
    disposeObjectsInArray.call(that, '_valueAxes');
  },

  _appendAdditionalSeriesGroups() {
    this._crosshairCursorGroup.linkAppend();
    // this._legendGroup.linkAppend();
    this._scrollBar && this._scrollBarGroup.linkAppend(); // TODO: Must be appended in the same place where removed (chart)
  },
  _getLegendTargets() {
    return (this.series || []).map((s) => {
      const item = this._getLegendOptions(s);
      item.legendData.series = s;
      if (!s.getOptions().showInLegend) {
        item.legendData.visible = false;
      }
      return item;
    });
  },
  _legendItemTextField: 'name',

  _seriesPopulatedHandlerCore() {
    this._processSeriesFamilies();
    this._processValueAxisFormat();
  },

  _renderTrackers() {
    const that = this;
    let i;
    for (i = 0; i < that.series.length; ++i) {
      that.series[i].drawTrackers();
    }
    // TODO we don't need it
    // if (that._legend) {
    //    legendHasInsidePosition && that._legendGroup.append(that._renderer.root);
    // }
  },

  _specialProcessSeries() {
    this._processSeriesFamilies();
  },

  _processSeriesFamilies() {
    const that = this;
    const types = [];
    const families = [];
    let paneSeries;
    const themeManager = that._themeManager;
    const negativesAsZeroes = themeManager.getOptions('negativesAsZeroes');
    const negativesAsZeros = themeManager.getOptions('negativesAsZeros'); // misspelling case
    const familyOptions = {
      minBubbleSize: themeManager.getOptions('minBubbleSize'),
      maxBubbleSize: themeManager.getOptions('maxBubbleSize'),
      barGroupPadding: themeManager.getOptions('barGroupPadding'),
      barGroupWidth: themeManager.getOptions('barGroupWidth'),
      negativesAsZeroes: _isDefined(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros,
    };

    if (that.seriesFamilies?.length) {
      _each(that.seriesFamilies, (_, family) => {
        family.updateOptions(familyOptions);
        family.adjustSeriesValues();
      });
      return;
    }

    _each(that.series, (_, item) => {
      if (!types.includes(item.type as never)) {
        types.push(item.type as never);
      }
    });

    _each(that._getLayoutTargets(), (_, pane) => {
      paneSeries = that._getSeriesForPane(pane.name);

      _each(types, (_, type) => {
        const family = new SeriesFamily({
          type,
          pane: pane.name,
          minBubbleSize: familyOptions.minBubbleSize,
          maxBubbleSize: familyOptions.maxBubbleSize,
          barGroupPadding: familyOptions.barGroupPadding,
          barGroupWidth: familyOptions.barGroupWidth,
          negativesAsZeroes: familyOptions.negativesAsZeroes,
          rotated: that._isRotated(),
        });

        family.add(paneSeries);
        family.adjustSeriesValues();
        families.push(family as never);
      });
    });
    that.seriesFamilies = families;
  },

  _updateSeriesDimensions() {
    const that = this;
    let i;
    const seriesFamilies = that.seriesFamilies || [];

    for (i = 0; i < seriesFamilies.length; i++) {
      const family = seriesFamilies[i];

      family.updateSeriesValues();
      family.adjustSeriesDimensions();
    }
  },

  _getLegendCallBack(series) {
    return this._legend && this._legend.getActionCallback(series);
  },

  _appendAxesGroups() {
    const that = this;
    that._stripsGroup.linkAppend();
    that._gridGroup.linkAppend();
    that._axesGroup.linkAppend();
    that._labelsAxesGroup.linkAppend();
    that._constantLinesGroup.linkAppend();
    that._stripLabelAxesGroup.linkAppend();
    that._scaleBreaksGroup.linkAppend();
  },

  _populateMarginOptions() {
    const that = this;
    const bubbleSize = estimateBubbleSize(that.getSize(), that.panes.length, that._themeManager.getOptions('maxBubbleSize'), that._isRotated());
    let argumentMarginOptions = {};

    that._valueAxes.forEach((valueAxis) => {
      const groupSeries = that.series.filter((series) => series.getValueAxis() === valueAxis);
      let marginOptions = {};

      groupSeries.forEach((series) => {
        if (series.isVisible()) {
          const seriesMarginOptions = processBubbleMargin(series.getMarginOptions(), bubbleSize);

          marginOptions = mergeMarginOptions(marginOptions, seriesMarginOptions);
          argumentMarginOptions = mergeMarginOptions(argumentMarginOptions, seriesMarginOptions);
        }
      });

      valueAxis.setMarginOptions(marginOptions);
    });

    that._argumentAxes.forEach((a) => a.setMarginOptions(argumentMarginOptions));
  },

  _populateBusinessRange(updatedAxis, keepRange) {
    const that = this;
    const rotated = that._isRotated();
    const series = that._getVisibleSeries();
    const argRanges = {};
    const commonArgRange = new Range({ rotated: !!rotated });
    const getPaneName = (axis) => axis.pane || DEFAULT_PANE_NAME;

    that.panes.forEach((p) => {
      argRanges[p.name] = new Range({ rotated: !!rotated });
    });

    that._valueAxes.forEach((valueAxis) => {
      const groupRange = new Range({
        rotated: !!rotated,
        pane: valueAxis.pane,
        axis: valueAxis.name,
      });
      const groupSeries = series.filter((series) => series.getValueAxis() === valueAxis);

      groupSeries.forEach((series) => {
        const seriesRange = series.getRangeData();

        groupRange.addRange(seriesRange.val);
        argRanges[getPaneName(valueAxis)].addRange(seriesRange.arg);
      });

      if (!updatedAxis || updatedAxis && groupSeries.length && valueAxis === updatedAxis) {
        valueAxis.setGroupSeries(groupSeries);
        valueAxis.setBusinessRange(groupRange, that._axesReinitialized || keepRange, that._argumentAxes[0]._lastVisualRangeUpdateMode);
      }
    });

    if (!updatedAxis || updatedAxis && series.length) {
      Object.keys(argRanges).forEach((p) => commonArgRange.addRange(argRanges[p]));
      const commonInterval = commonArgRange.interval;
      that._argumentAxes.forEach((a) => {
        const currentInterval = argRanges[getPaneName(a)].interval ?? commonInterval; // T956425
        a.setBusinessRange(new Range({ ...commonArgRange, interval: currentInterval }), that._axesReinitialized, undefined, that._groupsData.categories);
      });
    }

    that._populateMarginOptions();
  },

  getArgumentAxis() {
    return (this._argumentAxes || []).filter((a) => !a.isVirtual)[0];
  },

  getValueAxis(name) {
    return (this._valueAxes || []).filter(_isDefined(name) ? (a) => a.name === name : (a) => a.pane === this.defaultPane)[0];
  },

  _getGroupsData() {
    const groups = [];

    this._valueAxes.forEach((axis) => {
      groups.push({
        series: this.series.filter((series) => series.getValueAxis() === axis),
        valueAxis: axis,
        valueOptions: axis.getOptions(),
      } as never);
    });

    return {
      groups,
      argumentAxes: this._argumentAxes,
      argumentOptions: this._argumentAxes[0].getOptions(),
    };
  },

  _groupSeries() {
    const that = this;
    that._correctValueAxes(false);
    that._groupsData = that._getGroupsData();
  },

  _processValueAxisFormat() {
    const axesWithFullStackedFormat = [];

    this.series.forEach((series) => {
      const axis = series.getValueAxis();
      if (series.isFullStackedSeries()) {
        axis.setPercentLabelFormat();
        axesWithFullStackedFormat.push(axis as never);
      }
    });

    this._valueAxes.forEach((axis) => {
      if (!axesWithFullStackedFormat.includes(axis as never)) {
        axis.resetAutoLabelFormat(); // B239299
      }
    });
  },

  _populateAxesOptions(typeSelector, userOptions, axisOptions, rotated, virtual) {
    const that = this;
    const preparedUserOptions = that._prepareStripsAndConstantLines(typeSelector, userOptions, rotated);
    const options = _extend(true, {}, preparedUserOptions, axisOptions, that._prepareAxisOptions(typeSelector, preparedUserOptions, rotated));
    if (virtual) {
      options.visible = options.tick.visible = options.minorTick.visible = options.label.visible = false;
      options.title = {};
    }

    return options;
  },

  _getValFilter(series) {
    return rangeDataCalculator.getViewPortFilter(series.getValueAxis().visualRange() || {});
  },

  _createAxis(isArgumentAxes, options, virtual) {
    const that = this;
    const typeSelector = isArgumentAxes ? 'argumentAxis' : 'valueAxis';
    const renderingSettings = _extend({
      renderer: that._renderer,
      incidentOccurred: that._incidentOccurred,
      eventTrigger: that._eventTrigger,
      axisClass: isArgumentAxes ? 'arg' : 'val',
      widgetClass: 'dxc',
      stripsGroup: that._stripsGroup,
      stripLabelAxesGroup: that._stripLabelAxesGroup,
      constantLinesGroup: that._constantLinesGroup,
      scaleBreaksGroup: that._scaleBreaksGroup,
      axesContainerGroup: that._axesGroup,
      labelsAxesGroup: that._labelsAxesGroup,
      gridGroup: that._gridGroup,
      isArgumentAxis: isArgumentAxes,
      getTemplate(template) {
        return that._getTemplate(template);
      },
    }, that._getAxisRenderingOptions(typeSelector));
    const axis = new Axis(renderingSettings) as any;
    axis.updateOptions(options);
    axis.isVirtual = virtual;

    return axis;
  },

  _applyVisualRangeByVirtualAxes() {
    return false;
  },

  _applyCustomVisualRangeOption(axis, range) {
    const that = this;
    if (axis.getOptions().optionPath) {
      that._parseVisualRangeOption(`${axis.getOptions().optionPath}.visualRange`, range);
    }
  },

  _getVisualRangeSetter() {
    const chart = this;
    return function (axis, { skipEventRising, range }) {
      chart._applyCustomVisualRangeOption(axis, range);
      axis.setCustomVisualRange(range);

      axis.skipEventRising = skipEventRising;

      if (!chart._applyVisualRangeByVirtualAxes(axis, range)) {
        if (chart._applyingChanges) {
          chart._change_VISUAL_RANGE();
        } else {
          chart._requestChange([VISUAL_RANGE]);
        }
      }
    };
  },

  _getTrackerSettings() {
    return _extend(this.callBase(), {
      argumentAxis: this.getArgumentAxis(),
    });
  },

  _prepareStripsAndConstantLines(typeSelector, userOptions, rotated) {
    userOptions = this._themeManager.getOptions(typeSelector, userOptions, rotated);
    if (userOptions.strips) {
      _each(userOptions.strips, (i) => {
        userOptions.strips[i] = _extend(true, {}, userOptions.stripStyle, userOptions.strips[i]);
      });
    }
    if (userOptions.constantLines) {
      _each(userOptions.constantLines, (i, line) => {
        userOptions.constantLines[i] = _extend(true, {}, userOptions.constantLineStyle, line);
      });
    }
    return userOptions;
  },

  refresh() {
    this._disposeAxes();
    this.callBase();
  },

  _layoutAxes(drawAxes) {
    const that = this;
    drawAxes();
    const needSpace = that.checkForMoreSpaceForPanesCanvas();

    if (needSpace) {
      const rect = this._rect.slice();
      const size = this._layout.backward(rect, rect, [needSpace.width, needSpace.height]);
      needSpace.width = Math.max(0, size[0]);
      needSpace.height = Math.max(0, size[1]);
      this._canvas = this._createCanvasFromRect(rect);

      drawAxes(needSpace);
    }
  },

  checkForMoreSpaceForPanesCanvas() {
    return this.layoutManager.needMoreSpaceForPanesCanvas(this._getLayoutTargets(), this._isRotated());
  },

  _parseVisualRangeOption(fullName, value) {
    const that = this;
    const name = fullName.split(/[.[]/)[0];
    let index = fullName.match(/\d+/g);

    index = _isDefined(index) ? parseInt(index[0], 10) : index;

    if (fullName.indexOf('visualRange') > 0) {
      if (type(value) !== 'object') {
        value = wrapVisualRange(fullName, value) ?? value;
      }
      that._setCustomVisualRange(name, index, value);
    } else if ((type(value) === 'object' || isArray(value)) && name.indexOf('Axis') > 0 && JSON.stringify(value).indexOf('visualRange') > 0) {
      if (_isDefined(value.visualRange)) {
        that._setCustomVisualRange(name, index, value.visualRange);
      } else if (isArray(value)) {
        value.forEach((a, i) => _isDefined(a.visualRange) && that._setCustomVisualRange(name, i, a.visualRange));
      }
    }
  },

  _setCustomVisualRange(axesName, index, value) {
    const that = this;
    const options = that._options.silent(axesName);

    if (!options) {
      return;
    }

    if (!_isDefined(index)) {
      options._customVisualRange = value;
    } else {
      options[index]._customVisualRange = value;
    }

    that._axesReinitialized = true;
  },

  _raiseZoomEndHandlers() {
    this._valueAxes.forEach((axis) => axis.handleZoomEnd());
  },

  _setOptionsByReference() {
    this.callBase();

    _extend(this._optionsByReference, {
      'valueAxis.visualRange': true,
    });
  },

  _notifyOptionChanged(option, value) {
    this.callBase.apply(this, arguments);
    if (!this._optionChangedLocker) {
      this._parseVisualRangeOption(option, value);
    }
  },

  _notifyVisualRange() {
    const that = this;

    that._valueAxes.forEach((axis) => {
      const axisPath = axis.getOptions().optionPath;
      if (axisPath) {
        const path = `${axisPath}.visualRange`;
        const visualRange = convertVisualRangeObject(axis.visualRange(), !isArray(that.option(path)));

        if (!axis.skipEventRising || !rangesAreEqual(visualRange, that.option(path))) {
          if (!that.option(axisPath) && axisPath !== 'valueAxis') {
            that.option(axisPath, {
              name: axis.name,
              visualRange,
            });
          } else {
            that.option(path, visualRange);
          }
        } else {
          axis.skipEventRising = null;
        }
      }
    });
  },

  _notify() {
    this.callBase();
    this._axesReinitialized = false;

    if (this.option('disableTwoWayBinding') !== true) { // for dashboards T732396
      this.skipOptionsRollBack = true;// T1037806
      this._notifyVisualRange();
      this.skipOptionsRollBack = false;
    }
  },

  _getAxesForScaling() {
    return this._valueAxes;
  },

  _getAxesByOptionPath(arg, isDirectOption, optionName) {
    const that = this;
    const sourceAxes = that._getAxesForScaling();
    let axes = [];

    if (isDirectOption) {
      let axisPath;
      if (arg.fullName) {
        axisPath = arg.fullName.slice(0, arg.fullName.indexOf('.'));
      }
      axes = sourceAxes.filter((a) => a.getOptions().optionPath === axisPath);
    } else if (type(arg.value) === 'object') {
      axes = sourceAxes.filter((a) => a.getOptions().optionPath === arg.name);
    } else if (isArray(arg.value)) {
      arg.value.forEach((v, index) => {
        const axis = sourceAxes.filter((a) => a.getOptions().optionPath === `${arg.name}[${index}]`)[0];
        _isDefined(v[optionName]) && _isDefined(axis) && (axes[index] = axis as never);
      });
    }

    return axes;
  },

  _optionChanged(arg) {
    const that = this;
    if (!that._optionChangedLocker) {
      const optionName = 'visualRange';
      let axes;
      const isDirectOption = arg.fullName.indexOf(optionName) > 0 ? true
        : that.getPartialChangeOptionsName(arg).indexOf(optionName) > -1 ? false : undefined;

      if (_isDefined(isDirectOption)) {
        axes = that._getAxesByOptionPath(arg, isDirectOption, optionName);

        if (axes) {
          if (axes.length > 1 || isArray(arg.value)) {
            axes.forEach((a, index) => setAxisVisualRangeByOption(arg, a, isDirectOption, index));
          } else if (axes.length === 1) {
            setAxisVisualRangeByOption(arg, axes[0], isDirectOption);
          }
        }
      }
    }
    that.callBase(arg);
  },

  _change_VISUAL_RANGE() {
    const that = this;

    that._recreateSizeDependentObjects(false);
    if (!that._changes.has('FULL_RENDER')) {
      const resizePanesOnZoom = that.option('resizePanesOnZoom');
      that._doRender({
        force: true,
        drawTitle: false,
        drawLegend: false,
        adjustAxes: resizePanesOnZoom ?? (that.option('adjustAxesOnZoom') || false),
        animate: false,
      });
      that._raiseZoomEndHandlers();
    }
  },

  // API
  resetVisualRange() {
    const that = this;

    that._valueAxes.forEach((axis) => {
      axis.resetVisualRange(false); // T602156
      that._applyCustomVisualRangeOption(axis);
    });
    that._requestChange([VISUAL_RANGE]);
  },

  _getCrosshairMargins() {
    return { x: 0, y: 0 };
  },

  _legendDataField: 'series',

  _adjustSeriesLabels: _noop,

  _correctValueAxes: _noop,
});
