"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdvancedChart = void 0;
var _common = require("../../../core/utils/common");
var _extend2 = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _base_axis = require("../../../viz/axes/base_axis");
var _series_family = require("../../../viz/core/series_family");
var _utils = require("../../../viz/core/utils");
var _range_data_calculator = _interopRequireDefault(require("../../../viz/series/helpers/range_data_calculator"));
var _range = require("../../../viz/translators/range");
var _utils2 = require("../../../viz/utils");
var _m_base_chart = require("./m_base_chart");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
const {
  isArray
} = Array;
const DEFAULT_AXIS_NAME = 'defaultAxisName';
const FONT = 'font';
const COMMON_AXIS_SETTINGS = 'commonAxisSettings';
const DEFAULT_PANE_NAME = 'default';
const VISUAL_RANGE = 'VISUAL_RANGE';
function prepareAxis(axisOptions) {
  if (isArray(axisOptions)) {
    return axisOptions.length === 0 ? [{}] : axisOptions;
  }
  return [axisOptions];
}
function processBubbleMargin(marginOptions, bubbleSize) {
  if (marginOptions.processBubbleSize) {
    marginOptions.size = bubbleSize;
  }
  return marginOptions;
}
function estimateBubbleSize(size, panesCount, maxSize, rotated) {
  const width = rotated ? size.width / panesCount : size.width;
  const height = rotated ? size.height : size.height / panesCount;
  return Math.min(width, height) * maxSize;
}
function setAxisVisualRangeByOption(arg, axis, isDirectOption, index) {
  let options;
  let visualRange;
  if (isDirectOption) {
    visualRange = arg.value;
    options = {
      skipEventRising: true
    };
    const wrappedVisualRange = wrapVisualRange(arg.fullName, visualRange);
    if (wrappedVisualRange) {
      options = {
        allowPartialUpdate: true
      };
      visualRange = wrappedVisualRange;
    }
  } else {
    visualRange = ((0, _type.isDefined)(index) ? arg.value[index] : arg.value).visualRange;
  }
  axis.visualRange(visualRange, options);
}
function getAxisTypes(groupsData, axis, isArgumentAxes) {
  if (isArgumentAxes) {
    return {
      argumentAxisType: groupsData.argumentAxisType,
      argumentType: groupsData.argumentType
    };
  }
  const {
    valueAxisType,
    valueType
  } = groupsData.groups.find(g => g.valueAxis === axis);
  return {
    valueAxisType,
    valueType
  };
}
function wrapVisualRange(fullName, value) {
  const pathElements = fullName.split('.');
  const destElem = pathElements.at(-1);
  if (destElem === 'endValue' || destElem === 'startValue') {
    return {
      [destElem]: value
    };
  }
  return undefined;
}
const AdvancedChart = exports.AdvancedChart = _m_base_chart.BaseChart.inherit({
  _fontFields: [`${COMMON_AXIS_SETTINGS}.label.${FONT}`, `${COMMON_AXIS_SETTINGS}.title.${FONT}`],
  _partialOptionChangesMap: {
    visualRange: VISUAL_RANGE,
    _customVisualRange: VISUAL_RANGE,
    strips: 'REFRESH_AXES',
    constantLines: 'REFRESH_AXES'
  },
  _partialOptionChangesPath: {
    argumentAxis: ['strips', 'constantLines', 'visualRange', '_customVisualRange'],
    valueAxis: ['strips', 'constantLines', 'visualRange', '_customVisualRange']
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
    const disposeObjectsInArray = this._disposeObjectsInArray;
    this.callBase();
    this.panes = null;
    if (this._legend) {
      this._legend.dispose();
      this._legend = null;
    }
    disposeObjectsInArray.call(this, 'panesBackground');
    disposeObjectsInArray.call(this, 'seriesFamilies');
    this._disposeAxes();
  },
  _createPanes() {
    this._cleanPanesClipRects('fixed');
    this._cleanPanesClipRects('base');
    this._cleanPanesClipRects('wide');
  },
  _cleanPanesClipRects(clipArrayName) {
    const clipArray = this._panesClipRects[clipArrayName];
    (clipArray || []).forEach(clipRect => {
      clipRect === null || clipRect === void 0 || clipRect.dispose();
    });
    this._panesClipRects[clipArrayName] = [];
  },
  _getElementsClipRectID(paneName) {
    const clipShape = this._panesClipRects.fixed[this._getPaneIndex(paneName)];
    return clipShape === null || clipShape === void 0 ? void 0 : clipShape.id;
  },
  _getPaneIndex(paneName) {
    const name = paneName || DEFAULT_PANE_NAME;
    return this.panes.findIndex(pane => pane.name === name);
  },
  _updateSize(forceUpdateCanvas) {
    this.callBase();
    if (forceUpdateCanvas && (0, _utils2.areCanvasesDifferent)(this.__currentCanvas, this._canvas)) {
      this.__currentCanvas = (0, _utils2.floorCanvasDimensions)(this._canvas);
    }
    (0, _utils.setCanvasValues)(this._canvas);
  },
  _reinitAxes() {
    this.panes = this._createPanes();
    this._populateAxes();
    this._axesReinitialized = true;
  },
  _populateAxes() {
    const {
      panes
    } = this;
    const rotated = this._isRotated();
    const argumentAxesOptions = prepareAxis(this.option('argumentAxis') || {})[0];
    const valueAxisOption = this.option('valueAxis');
    const valueAxesOptions = prepareAxis(valueAxisOption || {});
    let argumentAxesPopulatedOptions = [];
    const valueAxesPopulatedOptions = [];
    const axisNames = [];
    let valueAxesCounter = 0;
    let paneWithNonVirtualAxis;
    const crosshairMargins = this._getCrosshairMargins();
    function getNextAxisName() {
      const name = DEFAULT_AXIS_NAME + String(valueAxesCounter);
      valueAxesCounter += 1;
      return name;
    }
    if (rotated) {
      paneWithNonVirtualAxis = argumentAxesOptions.position === 'right' ? panes[panes.length - 1].name : panes[0].name;
    } else {
      paneWithNonVirtualAxis = argumentAxesOptions.position === 'top' ? panes[0].name : panes[panes.length - 1].name;
    }
    argumentAxesPopulatedOptions = (0, _utils.map)(panes, pane => {
      const virtual = pane.name !== paneWithNonVirtualAxis;
      return this._populateAxesOptions('argumentAxis', argumentAxesOptions, {
        pane: pane.name,
        name: null,
        optionPath: 'argumentAxis',
        crosshairMargin: rotated ? crosshairMargins.x : crosshairMargins.y
      }, rotated, virtual);
    });
    valueAxesOptions.forEach((axisOptions, priority) => {
      var _axisOptions$panes;
      let axisPanes = [];
      const {
        name
      } = axisOptions;
      if (name && axisNames.includes(name)) {
        this._incidentOccurred('E2102');
        return;
      }
      if (name) {
        axisNames.push(name);
      }
      if (axisOptions.pane) {
        axisPanes.push(axisOptions.pane);
      }
      if ((_axisOptions$panes = axisOptions.panes) !== null && _axisOptions$panes !== void 0 && _axisOptions$panes.length) {
        axisPanes = axisPanes.concat(axisOptions.panes.slice(0));
      }
      axisPanes = (0, _utils.unique)(axisPanes);
      if (!axisPanes.length) {
        axisPanes.push(undefined);
      }
      axisPanes.forEach(pane => {
        const optionPath = isArray(valueAxisOption) ? `valueAxis[${String(priority)}]` : 'valueAxis';
        valueAxesPopulatedOptions.push(this._populateAxesOptions('valueAxis', axisOptions, {
          name: name || getNextAxisName(),
          pane,
          priority,
          optionPath,
          crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
        }, rotated));
      });
    });
    this._redesignAxes(argumentAxesPopulatedOptions, true, paneWithNonVirtualAxis);
    this._redesignAxes(valueAxesPopulatedOptions, false);
  },
  _redesignAxes(options, isArgumentAxes, paneWithNonVirtualAxis) {
    const axesBasis = [];
    let axes = isArgumentAxes ? this._argumentAxes : this._valueAxes;
    options.forEach(opt => {
      var _axes;
      const curAxes = (_axes = axes) === null || _axes === void 0 ? void 0 : _axes.filter(a => a.name === opt.name && (!(0, _type.isDefined)(opt.pane) && this.panes.some(p => p.name === a.pane) || a.pane === opt.pane));
      if (curAxes !== null && curAxes !== void 0 && curAxes.length) {
        curAxes.forEach(axis => {
          const axisTypes = getAxisTypes(this._groupsData, axis, isArgumentAxes); // T891599
          axis.updateOptions(opt);
          if (isArgumentAxes) {
            axis.setTypes(axisTypes.argumentAxisType, axisTypes.argumentType, 'argumentType');
          } else {
            axis.setTypes(axisTypes.valueAxisType, axisTypes.valueType, 'valueType');
          }
          axis.validate();
          axesBasis.push({
            axis
          });
        });
      } else {
        axesBasis.push({
          options: opt
        });
      }
    });
    if (axes) {
      (0, _iterator.reverseEach)(axes, (index, axis) => {
        if (!axesBasis.some(basis => basis.axis && basis.axis === axis)) {
          this._disposeAxis(index, isArgumentAxes);
        }
      });
    } else if (isArgumentAxes) {
      axes = this._argumentAxes = [];
    } else {
      axes = this._valueAxes = [];
    }
    axesBasis.forEach(basis => {
      let {
        axis
      } = basis;
      if (basis.axis && isArgumentAxes) {
        basis.axis.isVirtual = basis.axis.pane !== paneWithNonVirtualAxis;
      } else if (basis.options) {
        axis = this._createAxis(isArgumentAxes, basis.options, isArgumentAxes ? basis.options.pane !== paneWithNonVirtualAxis : undefined);
        axes.push(axis);
      }
      axis.applyVisualRangeSetter(this._getVisualRangeSetter());
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
    const disposeObjectsInArray = this._disposeObjectsInArray;
    disposeObjectsInArray.call(this, '_argumentAxes');
    disposeObjectsInArray.call(this, '_valueAxes');
  },
  _appendAdditionalSeriesGroups() {
    this._crosshairCursorGroup.linkAppend();
    // this._legendGroup.linkAppend();
    if (this._scrollBar) {
      // TODO: Must be appended in the same place where removed (chart)
      this._scrollBarGroup.linkAppend();
    }
  },
  _getLegendTargets() {
    return (this.series || []).map(s => {
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
    for (let i = 0; i < this.series.length; i += 1) {
      this.series[i].drawTrackers();
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
    var _this$seriesFamilies;
    const types = [];
    const families = [];
    let paneSeries;
    const themeManager = this._themeManager;
    const negativesAsZeroes = themeManager.getOptions('negativesAsZeroes');
    const negativesAsZeros = themeManager.getOptions('negativesAsZeros'); // misspelling case
    const familyOptions = {
      minBubbleSize: themeManager.getOptions('minBubbleSize'),
      maxBubbleSize: themeManager.getOptions('maxBubbleSize'),
      barGroupPadding: themeManager.getOptions('barGroupPadding'),
      barGroupWidth: themeManager.getOptions('barGroupWidth'),
      negativesAsZeroes: (0, _type.isDefined)(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros
    };
    if ((_this$seriesFamilies = this.seriesFamilies) !== null && _this$seriesFamilies !== void 0 && _this$seriesFamilies.length) {
      this.seriesFamilies.forEach(family => {
        family.updateOptions(familyOptions);
        family.adjustSeriesValues();
      });
      return;
    }
    this.series.forEach(item => {
      if (!types.includes(item.type)) {
        types.push(item.type);
      }
    });
    this._getLayoutTargets().forEach(pane => {
      paneSeries = this._getSeriesForPane(pane.name);
      types.forEach(type => {
        const family = new _series_family.SeriesFamily({
          type,
          pane: pane.name,
          minBubbleSize: familyOptions.minBubbleSize,
          maxBubbleSize: familyOptions.maxBubbleSize,
          barGroupPadding: familyOptions.barGroupPadding,
          barGroupWidth: familyOptions.barGroupWidth,
          negativesAsZeroes: familyOptions.negativesAsZeroes,
          rotated: this._isRotated()
        });
        family.add(paneSeries);
        family.adjustSeriesValues();
        families.push(family);
      });
    });
    this.seriesFamilies = families;
  },
  _updateSeriesDimensions() {
    const seriesFamilies = this.seriesFamilies || [];
    for (let i = 0; i < seriesFamilies.length; i += 1) {
      const family = seriesFamilies[i];
      family.updateSeriesValues();
      family.adjustSeriesDimensions();
    }
  },
  _getLegendCallBack(series) {
    var _this$_legend;
    return (_this$_legend = this._legend) === null || _this$_legend === void 0 ? void 0 : _this$_legend.getActionCallback(series);
  },
  _appendAxesGroups() {
    this._stripsGroup.linkAppend();
    this._gridGroup.linkAppend();
    this._axesGroup.linkAppend();
    this._labelsAxesGroup.linkAppend();
    this._constantLinesGroup.linkAppend();
    this._stripLabelAxesGroup.linkAppend();
    this._scaleBreaksGroup.linkAppend();
  },
  _populateMarginOptions() {
    const bubbleSize = estimateBubbleSize(this.getSize(), this.panes.length, this._themeManager.getOptions('maxBubbleSize'), this._isRotated());
    let argumentMarginOptions = {};
    this._valueAxes.forEach(valueAxis => {
      const groupSeries = this.series.filter(series => series.getValueAxis() === valueAxis);
      let marginOptions = {};
      groupSeries.forEach(series => {
        if (series.isVisible()) {
          const seriesMarginOptions = processBubbleMargin(series.getMarginOptions(), bubbleSize);
          marginOptions = (0, _utils.mergeMarginOptions)(marginOptions, seriesMarginOptions);
          argumentMarginOptions = (0, _utils.mergeMarginOptions)(argumentMarginOptions, seriesMarginOptions);
        }
      });
      valueAxis.setMarginOptions(marginOptions);
    });
    this._argumentAxes.forEach(a => a.setMarginOptions(argumentMarginOptions));
  },
  _populateBusinessRange(updatedAxis, keepRange) {
    const rotated = this._isRotated();
    const series = this._getVisibleSeries();
    const argRanges = {};
    const commonArgRange = new _range.Range({
      rotated: !!rotated
    });
    const getPaneName = axis => axis.pane || DEFAULT_PANE_NAME;
    this.panes.forEach(p => {
      argRanges[p.name] = new _range.Range({
        rotated: !!rotated
      });
    });
    this._valueAxes.forEach(valueAxis => {
      const groupRange = new _range.Range({
        rotated: !!rotated,
        pane: valueAxis.pane,
        axis: valueAxis.name
      });
      const groupSeries = series.filter(series => series.getValueAxis() === valueAxis);
      groupSeries.forEach(series => {
        const seriesRange = series.getRangeData();
        groupRange.addRange(seriesRange.val);
        argRanges[getPaneName(valueAxis)].addRange(seriesRange.arg);
      });
      if (!updatedAxis || updatedAxis && groupSeries.length && valueAxis === updatedAxis) {
        valueAxis.setGroupSeries(groupSeries);
        valueAxis.setBusinessRange(groupRange, this._axesReinitialized || keepRange, this._argumentAxes[0]._lastVisualRangeUpdateMode);
      }
    });
    if (!updatedAxis || updatedAxis && series.length) {
      Object.keys(argRanges).forEach(p => commonArgRange.addRange(argRanges[p]));
      const commonInterval = commonArgRange.interval;
      this._argumentAxes.forEach(a => {
        const currentInterval = argRanges[getPaneName(a)].interval ?? commonInterval; // T956425
        a.setBusinessRange(new _range.Range(_extends({}, commonArgRange, {
          interval: currentInterval
        })), this._axesReinitialized, undefined, this._groupsData.categories);
      });
    }
    this._populateMarginOptions();
  },
  getArgumentAxis() {
    return (this._argumentAxes || []).find(a => !a.isVirtual);
  },
  getValueAxis(name) {
    return (this._valueAxes || []).find((0, _type.isDefined)(name) ? a => a.name === name : a => a.pane === this.defaultPane);
  },
  _getGroupsData() {
    const groups = [];
    this._valueAxes.forEach(axis => {
      groups.push({
        series: this.series.filter(series => series.getValueAxis() === axis),
        valueAxis: axis,
        valueOptions: axis.getOptions()
      });
    });
    return {
      groups,
      argumentAxes: this._argumentAxes,
      argumentOptions: this._argumentAxes[0].getOptions()
    };
  },
  _groupSeries() {
    this._correctValueAxes(false);
    this._groupsData = this._getGroupsData();
  },
  _processValueAxisFormat() {
    const axesWithFullStackedFormat = [];
    this.series.forEach(series => {
      const axis = series.getValueAxis();
      if (series.isFullStackedSeries()) {
        axis.setPercentLabelFormat();
        axesWithFullStackedFormat.push(axis);
      }
    });
    this._valueAxes.forEach(axis => {
      if (!axesWithFullStackedFormat.includes(axis)) {
        axis.resetAutoLabelFormat(); // B239299
      }
    });
  },
  _populateAxesOptions(typeSelector, userOptions, axisOptions, rotated, virtual) {
    const preparedUserOptions = this._prepareStripsAndConstantLines(typeSelector, userOptions, rotated);
    const options = (0, _extend2.extend)(true, {}, preparedUserOptions, axisOptions, this._prepareAxisOptions(typeSelector, preparedUserOptions, rotated));
    if (virtual) {
      options.visible = false;
      options.tick.visible = false;
      options.minorTick.visible = false;
      options.label.visible = false;
      options.title = {};
    }
    return options;
  },
  _getValFilter(series) {
    return _range_data_calculator.default.getViewPortFilter(series.getValueAxis().visualRange() || {});
  },
  _createAxis(isArgumentAxes, options, virtual) {
    const typeSelector = isArgumentAxes ? 'argumentAxis' : 'valueAxis';
    const renderingSettings = (0, _extend2.extend)({
      renderer: this._renderer,
      incidentOccurred: this._incidentOccurred,
      eventTrigger: this._eventTrigger,
      axisClass: isArgumentAxes ? 'arg' : 'val',
      widgetClass: 'dxc',
      stripsGroup: this._stripsGroup,
      stripLabelAxesGroup: this._stripLabelAxesGroup,
      constantLinesGroup: this._constantLinesGroup,
      scaleBreaksGroup: this._scaleBreaksGroup,
      axesContainerGroup: this._axesGroup,
      labelsAxesGroup: this._labelsAxesGroup,
      gridGroup: this._gridGroup,
      isArgumentAxis: isArgumentAxes,
      getTemplate: template => this._getTemplate(template)
    }, this._getAxisRenderingOptions(typeSelector));
    const axis = new _base_axis.Axis(renderingSettings);
    axis.updateOptions(options);
    axis.isVirtual = virtual;
    return axis;
  },
  _applyVisualRangeByVirtualAxes() {
    return false;
  },
  _applyCustomVisualRangeOption(axis, range) {
    if (axis.getOptions().optionPath) {
      this._parseVisualRangeOption(`${axis.getOptions().optionPath}.visualRange`, range);
    }
  },
  _getVisualRangeSetter() {
    return (axis, _ref) => {
      let {
        skipEventRising,
        range
      } = _ref;
      this._applyCustomVisualRangeOption(axis, range);
      axis.setCustomVisualRange(range);
      axis.skipEventRising = skipEventRising;
      if (!this._applyVisualRangeByVirtualAxes(axis, range)) {
        if (this._applyingChanges) {
          this._change_VISUAL_RANGE();
        } else {
          this._requestChange([VISUAL_RANGE]);
        }
      }
    };
  },
  _getTrackerSettings() {
    return (0, _extend2.extend)(this.callBase(), {
      argumentAxis: this.getArgumentAxis()
    });
  },
  _prepareStripsAndConstantLines(typeSelector, userOptions, rotated) {
    userOptions = this._themeManager.getOptions(typeSelector, userOptions, rotated);
    if (userOptions.strips) {
      userOptions.strips.forEach((line, i) => {
        userOptions.strips[i] = (0, _extend2.extend)(true, {}, userOptions.stripStyle, line);
      });
    }
    if (userOptions.constantLines) {
      userOptions.constantLines.forEach((line, i) => {
        userOptions.constantLines[i] = (0, _extend2.extend)(true, {}, userOptions.constantLineStyle, line);
      });
    }
    return userOptions;
  },
  refresh() {
    this._disposeAxes();
    this.callBase();
  },
  _layoutAxes(drawAxes) {
    drawAxes();
    const needSpace = this.checkForMoreSpaceForPanesCanvas();
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
    const name = fullName.split(/[.[]/)[0];
    let index = fullName.match(/\d+/g);
    index = (0, _type.isDefined)(index) ? parseInt(index[0], 10) : index;
    if (fullName.indexOf('visualRange') > 0) {
      if ((0, _type.type)(value) !== 'object') {
        value = wrapVisualRange(fullName, value) ?? value;
      }
      this._setCustomVisualRange(name, index, value);
    } else if (((0, _type.type)(value) === 'object' || isArray(value)) && name.indexOf('Axis') > 0 && JSON.stringify(value).indexOf('visualRange') > 0) {
      if ((0, _type.isDefined)(value.visualRange)) {
        this._setCustomVisualRange(name, index, value.visualRange);
      } else if (isArray(value)) {
        value.forEach((a, i) => {
          if ((0, _type.isDefined)(a.visualRange)) {
            this._setCustomVisualRange(name, i, a.visualRange);
          }
        });
      }
    }
  },
  _setCustomVisualRange(axesName, index, value) {
    const options = this._options.silent(axesName);
    if (!options) {
      return;
    }
    if (!(0, _type.isDefined)(index)) {
      options._customVisualRange = value;
    } else {
      options[index]._customVisualRange = value;
    }
    this._axesReinitialized = true;
  },
  _raiseZoomEndHandlers() {
    this._valueAxes.forEach(axis => axis.handleZoomEnd());
  },
  _setOptionsByReference() {
    this.callBase();
    (0, _extend2.extend)(this._optionsByReference, {
      'valueAxis.visualRange': true
    });
  },
  _notifyOptionChanged(option, value) {
    this.callBase.apply(this, arguments);
    if (!this._optionChangedLocker) {
      this._parseVisualRangeOption(option, value);
    }
  },
  _notifyVisualRange() {
    this._valueAxes.forEach(axis => {
      const axisPath = axis.getOptions().optionPath;
      if (axisPath) {
        const path = `${axisPath}.visualRange`;
        const visualRange = (0, _utils.convertVisualRangeObject)(axis.visualRange(), !isArray(this.option(path)));
        if (!axis.skipEventRising || !(0, _utils.rangesAreEqual)(visualRange, this.option(path))) {
          if (!this.option(axisPath) && axisPath !== 'valueAxis') {
            this.option(axisPath, {
              name: axis.name,
              visualRange
            });
          } else {
            this.option(path, visualRange);
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
    if (this.option('disableTwoWayBinding') !== true) {
      // for dashboards T732396
      this.skipOptionsRollBack = true; // T1037806
      this._notifyVisualRange();
      this.skipOptionsRollBack = false;
    }
  },
  _getAxesForScaling() {
    return this._valueAxes;
  },
  _getAxesByOptionPath(arg, isDirectOption, optionName) {
    const sourceAxes = this._getAxesForScaling();
    let axes = [];
    if (isDirectOption) {
      let axisPath;
      if (arg.fullName) {
        axisPath = arg.fullName.slice(0, arg.fullName.indexOf('.'));
      }
      axes = sourceAxes.filter(a => a.getOptions().optionPath === axisPath);
    } else if ((0, _type.type)(arg.value) === 'object') {
      axes = sourceAxes.filter(a => a.getOptions().optionPath === arg.name);
    } else if (isArray(arg.value)) {
      arg.value.forEach((v, index) => {
        const axis = sourceAxes.filter(a => a.getOptions().optionPath === `${arg.name}[${index}]`)[0];
        if ((0, _type.isDefined)(v[optionName]) && (0, _type.isDefined)(axis)) {
          axes[index] = axis;
        }
      });
    }
    return axes;
  },
  _optionChanged(arg) {
    if (!this._optionChangedLocker) {
      const optionName = 'visualRange';
      let axes;
      const isDirectOption = arg.fullName.indexOf(optionName) > 0 ? true : this.getPartialChangeOptionsName(arg).indexOf(optionName) > -1 ? false : undefined;
      if ((0, _type.isDefined)(isDirectOption)) {
        axes = this._getAxesByOptionPath(arg, isDirectOption, optionName);
        if (axes) {
          if (axes.length > 1 || isArray(arg.value)) {
            axes.forEach((a, index) => setAxisVisualRangeByOption(arg, a, isDirectOption, index));
          } else if (axes.length === 1) {
            setAxisVisualRangeByOption(arg, axes[0], isDirectOption);
          }
        }
      }
    }
    this.callBase(arg);
  },
  _change_VISUAL_RANGE() {
    this._recreateSizeDependentObjects(false);
    if (!this._changes.has('FULL_RENDER')) {
      const resizePanesOnZoom = this.option('resizePanesOnZoom');
      this._doRender({
        force: true,
        drawTitle: false,
        drawLegend: false,
        adjustAxes: resizePanesOnZoom ?? (this.option('adjustAxesOnZoom') || false),
        animate: false
      });
      this._raiseZoomEndHandlers();
    }
  },
  // API
  resetVisualRange() {
    this._valueAxes.forEach(axis => {
      axis.resetVisualRange(false); // T602156
      this._applyCustomVisualRangeOption(axis);
    });
    this._requestChange([VISUAL_RANGE]);
  },
  _getCrosshairMargins() {
    return {
      x: 0,
      y: 0
    };
  },
  _legendDataField: 'series',
  _adjustSeriesLabels: _common.noop,
  _correctValueAxes: _common.noop
});