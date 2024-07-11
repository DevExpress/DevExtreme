"use strict";

exports.plugins = exports.createAnnotations = void 0;
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _type = require("../../core/utils/type");
var _tooltip = require("../core/tooltip");
var _extend = require("../../core/utils/extend");
var _utils = require("./utils");
var _plaque = require("./plaque");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _drag = require("../../events/drag");
var _index = require("../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getDocument = _dom_adapter.default.getDocument;
const EVENT_NS = 'annotations';
const DOT_EVENT_NS = '.' + EVENT_NS;
const POINTER_ACTION = (0, _index.addNamespace)([_pointer.default.down, _pointer.default.move], EVENT_NS);
const POINTER_UP_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.up, EVENT_NS);
const DRAG_START_EVENT_NAME = _drag.start + DOT_EVENT_NS;
const DRAG_EVENT_NAME = _drag.move + DOT_EVENT_NS;
const DRAG_END_EVENT_NAME = _drag.end + DOT_EVENT_NS;
function coreAnnotation(options, contentTemplate) {
  return {
    draw: function (widget, group) {
      const annotationGroup = widget._renderer.g().append(group).css((0, _utils.patchFontOptions)(options.font));
      if (this.plaque) {
        this.plaque.clear();
      }
      this.plaque = new _plaque.Plaque((0, _extend.extend)(true, {}, options, {
        cornerRadius: (options.border || {}).cornerRadius
      }), widget, annotationGroup, contentTemplate, widget._isAnnotationBounded(options));
      this.plaque.draw(widget._getAnnotationCoords(this));
      if (options.allowDragging) {
        annotationGroup.on(DRAG_START_EVENT_NAME, {
          immediate: true
        }, e => {
          this._dragOffsetX = this.plaque.x - e.pageX;
          this._dragOffsetY = this.plaque.y - e.pageY;
        }).on(DRAG_EVENT_NAME, e => {
          this.plaque.move(e.pageX + this._dragOffsetX, e.pageY + this._dragOffsetY);
        }).on(DRAG_END_EVENT_NAME, e => {
          this.offsetX = (this.offsetX || 0) + e.offset.x;
          this.offsetY = (this.offsetY || 0) + e.offset.y;
        });
      }
    },
    hitTest(x, y) {
      return this.plaque.hitTest(x, y);
    },
    showTooltip(tooltip, _ref) {
      let {
        x,
        y
      } = _ref;
      const that = this;
      const options = that.options;
      if (tooltip.annotation !== that) {
        tooltip.setTemplate(options.tooltipTemplate);
        const callback = result => {
          result && (tooltip.annotation = that);
        };
        callback(tooltip.show(options, {
          x,
          y
        }, {
          target: options
        }, options.customizeTooltip, callback));
      } else {
        if (!tooltip.isCursorOnTooltip(x, y)) {
          tooltip.move(x, y);
        }
      }
    }
  };
}
function getTemplateFunction(options, widget) {
  let template;
  if (options.type === 'text') {
    template = function (item, groupElement) {
      const text = widget._renderer.text(item.text).attr({
        'class': item.cssClass
      }).append({
        element: groupElement
      });
      if (item.width > 0 || item.height > 0) {
        text.setMaxSize(item.width, item.height, {
          wordWrap: item.wordWrap,
          textOverflow: item.textOverflow
        });
      }
    };
  } else if (options.type === 'image') {
    template = function (item, groupElement) {
      const {
        width,
        height,
        url,
        location
      } = item.image || {};
      const {
        width: outerWidth,
        height: outerHeight
      } = item;
      const imageWidth = outerWidth > 0 ? Math.min(width, outerWidth) : width;
      const imageHeight = outerHeight > 0 ? Math.min(height, outerHeight) : height;
      widget._renderer.image(0, 0, imageWidth, imageHeight, url, location || 'center').append({
        element: groupElement
      });
    };
  } else if (options.type === 'custom') {
    template = options.template;
  }
  return template;
}
function getImageObject(image) {
  return typeof image === 'string' ? {
    url: image
  } : image;
}
let createAnnotations = function (widget, items) {
  let commonAnnotationSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let customizeAnnotation = arguments.length > 3 ? arguments[3] : undefined;
  let pullOptions = arguments.length > 4 ? arguments[4] : undefined;
  const commonImageOptions = getImageObject(commonAnnotationSettings.image);
  return items.reduce((arr, item) => {
    const currentImageOptions = getImageObject(item.image);
    const customizedItem = (0, _type.isFunction)(customizeAnnotation) ? customizeAnnotation(item) : {};
    if (customizedItem) {
      customizedItem.image = getImageObject(customizedItem.image); // T881143
    }
    const options = (0, _extend.extend)(true, {}, commonAnnotationSettings, item, {
      image: commonImageOptions
    }, {
      image: currentImageOptions
    }, customizedItem);
    const templateFunction = getTemplateFunction(options, widget);
    const annotation = templateFunction && (0, _extend.extend)(true, pullOptions(options), coreAnnotation(options, widget._getTemplate(templateFunction)));
    annotation && arr.push(annotation);
    return arr;
  }, []);
};
exports.createAnnotations = createAnnotations;
const chartPlugin = {
  name: 'annotations_chart',
  init() {},
  dispose() {},
  members: {
    _getAnnotationCoords(annotation) {
      var _axis, _axis2;
      const coords = {
        offsetX: annotation.offsetX,
        offsetY: annotation.offsetY
      };
      const argCoordName = this._options.silent('rotated') ? 'y' : 'x';
      const valCoordName = this._options.silent('rotated') ? 'x' : 'y';
      const argAxis = this.getArgumentAxis();
      const argument = argAxis.validateUnit(annotation.argument);
      let axis = this.getValueAxis(annotation.axis);
      let series;
      let pane = (_axis = axis) === null || _axis === void 0 ? void 0 : _axis.pane;
      if (annotation.series) {
        var _series;
        series = this.series.filter(s => s.name === annotation.series)[0];
        axis = (_series = series) === null || _series === void 0 ? void 0 : _series.getValueAxis();
        (0, _type.isDefined)(axis) && (pane = axis.pane);
      }
      if ((0, _type.isDefined)(argument)) {
        if (series) {
          const center = series.getPointCenterByArg(argument);
          center && (coords[argCoordName] = center[argCoordName]);
        } else {
          coords[argCoordName] = argAxis.getTranslator().translate(argument);
        }
        !(0, _type.isDefined)(pane) && (pane = argAxis.pane);
      }
      const value = (_axis2 = axis) === null || _axis2 === void 0 ? void 0 : _axis2.validateUnit(annotation.value);
      if ((0, _type.isDefined)(value)) {
        var _axis3;
        coords[valCoordName] = (_axis3 = axis) === null || _axis3 === void 0 ? void 0 : _axis3.getTranslator().translate(value);
        !(0, _type.isDefined)(pane) && (0, _type.isDefined)(axis) && (pane = axis.pane);
      }
      coords.canvas = this._getCanvasForPane(pane);
      if ((0, _type.isDefined)(coords[argCoordName]) && !(0, _type.isDefined)(value)) {
        var _series2;
        if (!(0, _type.isDefined)(axis) && !(0, _type.isDefined)(series)) {
          coords[valCoordName] = argAxis.getAxisPosition();
        } else if ((0, _type.isDefined)(axis) && !(0, _type.isDefined)(series)) {
          coords[valCoordName] = this._argumentAxes.filter(a => a.pane === axis.pane)[0].getAxisPosition();
        } else if ((_series2 = series) !== null && _series2 !== void 0 && _series2.checkSeriesViewportCoord(argAxis, coords[argCoordName])) {
          coords[valCoordName] = series.getSeriesPairCoord(coords[argCoordName], true);
        }
      }
      if (!(0, _type.isDefined)(argument) && (0, _type.isDefined)(coords[valCoordName])) {
        if ((0, _type.isDefined)(axis) && !(0, _type.isDefined)(series)) {
          coords[argCoordName] = axis.getAxisPosition();
        } else if ((0, _type.isDefined)(series)) {
          if (series.checkSeriesViewportCoord(axis, coords[valCoordName])) {
            coords[argCoordName] = series.getSeriesPairCoord(coords[valCoordName], false);
          }
        }
      }
      return coords;
    },
    _annotationsPointerEventHandler(event) {
      if (this._disposed) {
        return;
      }
      const originalEvent = event.originalEvent || {};
      const touch = originalEvent.touches && originalEvent.touches[0] || {};
      const rootOffset = this._renderer.getRootOffset();
      const coords = {
        x: touch.pageX || originalEvent.pageX || event.pageX,
        y: touch.pageY || originalEvent.pageY || event.pageY
      };
      const annotation = this._annotations.items.filter(a => a.hitTest(coords.x - rootOffset.left, coords.y - rootOffset.top))[0];
      if (!annotation || !annotation.options.tooltipEnabled) {
        this._annotations.hideTooltip();
        return;
      }
      this._clear();
      if (annotation.options.allowDragging && event.type === _pointer.default.down) {
        this._annotations._hideToolTipForDrag = true;
      }
      if (!this._annotations._hideToolTipForDrag) {
        annotation.showTooltip(this._annotations.tooltip, coords);
        event.stopPropagation();
      }
    },
    _isAnnotationBounded(options) {
      return (0, _type.isDefined)(options.value) || (0, _type.isDefined)(options.argument);
    },
    _pullOptions(options) {
      return {
        type: options.type,
        name: options.name,
        x: options.x,
        y: options.y,
        value: options.value,
        argument: options.argument,
        axis: options.axis,
        series: options.series,
        options: options,
        offsetX: options.offsetX,
        offsetY: options.offsetY
      };
    },
    _forceAnnotationRender() {
      this._change(['FORCE_RENDER']);
    },
    _clear() {
      this.hideTooltip();
      this.clearHover();
    }
  }
};
const polarChartPlugin = {
  name: 'annotations_polar_chart',
  init() {},
  dispose() {},
  members: {
    _getAnnotationCoords(annotation) {
      const coords = {
        offsetX: annotation.offsetX,
        offsetY: annotation.offsetY,
        canvas: this._calcCanvas()
      };
      const argAxis = this.getArgumentAxis();
      let argument = argAxis.validateUnit(annotation.argument);
      const value = this.getValueAxis().validateUnit(annotation.value);
      const radius = annotation.radius;
      const angle = annotation.angle;
      let pointCoords;
      let series;
      if (annotation.series) {
        series = this.series.filter(s => s.name === annotation.series)[0];
      }
      (0, _extend.extend)(true, coords, this.getXYFromPolar(angle, radius, argument, value));
      if ((0, _type.isDefined)(series)) {
        if ((0, _type.isDefined)(coords.angle) && !(0, _type.isDefined)(value) && !(0, _type.isDefined)(radius)) {
          if (!(0, _type.isDefined)(argument)) {
            argument = argAxis.getTranslator().from(isFinite(angle) ? this.getActualAngle(angle) : coords.angle);
          }
          pointCoords = series.getSeriesPairCoord({
            argument,
            angle: -coords.angle
          }, true);
        } else if ((0, _type.isDefined)(coords.radius) && !(0, _type.isDefined)(argument) && !(0, _type.isDefined)(angle)) {
          pointCoords = series.getSeriesPairCoord({
            radius: coords.radius
          }, false);
        }
        if ((0, _type.isDefined)(pointCoords)) {
          coords.x = pointCoords.x;
          coords.y = pointCoords.y;
        }
      }
      if (annotation.series && !(0, _type.isDefined)(pointCoords)) {
        coords.x = coords.y = undefined;
      }
      return coords;
    },
    _annotationsPointerEventHandler: chartPlugin.members._annotationsPointerEventHandler,
    _isAnnotationBounded: chartPlugin.members._isAnnotationBounded,
    _pullOptions(options) {
      const polarOptions = (0, _extend.extend)({}, {
        radius: options.radius,
        angle: options.angle
      }, chartPlugin.members._pullOptions(options));
      delete polarOptions.axis;
      return polarOptions;
    },
    _forceAnnotationRender: chartPlugin.members._forceAnnotationRender,
    _clear: chartPlugin.members._clear
  }
};
const vectorMapPlugin = {
  name: 'annotations_vector_map',
  init() {},
  dispose() {
    this._annotations._offTracker();
    this._annotations._offTracker = null;
  },
  members: {
    _getAnnotationCoords(annotation) {
      const coords = {
        offsetX: annotation.offsetX,
        offsetY: annotation.offsetY
      };
      coords.canvas = this._projection.getCanvas();
      if (annotation.coordinates) {
        const data = this._projection.toScreenPoint(annotation.coordinates);
        coords.x = data[0];
        coords.y = data[1];
      }
      return coords;
    },
    _annotationsPointerEventHandler: chartPlugin.members._annotationsPointerEventHandler,
    _isAnnotationBounded(options) {
      return (0, _type.isDefined)(options.coordinates);
    },
    _pullOptions(options) {
      const vectorMapOptions = (0, _extend.extend)({}, {
        coordinates: options.coordinates
      }, chartPlugin.members._pullOptions(options));
      delete vectorMapOptions.axis;
      delete vectorMapOptions.series;
      delete vectorMapOptions.argument;
      delete vectorMapOptions.value;
      return vectorMapOptions;
    },
    _forceAnnotationRender() {
      this._change(['EXTRA_ELEMENTS']);
    },
    _getAnnotationStyles() {
      return {
        'text-anchor': 'start'
      };
    },
    _clear() {}
  },
  extenders: {
    _prepareExtraElements() {
      const that = this;
      const renderElements = () => {
        that._renderExtraElements();
      };
      that._annotations._offTracker = that._tracker.on({
        'move': renderElements,
        'zoom': renderElements,
        'end': renderElements
      });
    }
  }
};
const pieChartPlugin = {
  name: 'annotations_pie_chart',
  init() {},
  dispose() {},
  members: {
    _getAnnotationCoords(annotation) {
      let series;
      const coords = {
        offsetX: annotation.offsetX,
        offsetY: annotation.offsetY,
        canvas: this._canvas
      };
      if (annotation.argument) {
        if (annotation.series) {
          series = this.getSeriesByName(annotation.series);
        } else {
          series = this.series[0];
        }
        const argument = series.getPointsByArg(annotation.argument)[0];
        const {
          x,
          y
        } = argument.getAnnotationCoords(annotation.location);
        coords.x = x;
        coords.y = y;
      }
      return coords;
    },
    _isAnnotationBounded(options) {
      return options.argument;
    },
    _annotationsPointerEventHandler: chartPlugin.members._annotationsPointerEventHandler,
    _pullOptions(options) {
      const pieChartOptions = (0, _extend.extend)({}, {
        location: options.location
      }, chartPlugin.members._pullOptions(options));
      delete pieChartOptions.axis;
      return pieChartOptions;
    },
    _clear: chartPlugin.members._clear,
    _forceAnnotationRender: chartPlugin.members._forceAnnotationRender
  }
};
const corePlugin = {
  name: 'annotations_core',
  init() {
    this._annotations = {
      items: [],
      _hideToolTipForDrag: false,
      tooltip: new _tooltip.Tooltip({
        cssClass: `${this._rootClassPrefix}-annotation-tooltip`,
        eventTrigger: this._eventTrigger,
        widgetRoot: this.element(),
        widget: this
      }),
      hideTooltip() {
        this.tooltip.annotation = null;
        this.tooltip.hide();
      },
      clearItems() {
        this.items.forEach(i => i.plaque.clear());
        this.items = [];
      }
    };
    this._annotations.tooltip.setRendererOptions(this._getRendererOptions());
  },
  dispose() {
    this._annotationsGroup.linkRemove().linkOff();
    _events_engine.default.off(getDocument(), DOT_EVENT_NS);
    this._annotationsGroup.off(DOT_EVENT_NS);
    this._annotations.tooltip && this._annotations.tooltip.dispose();
  },
  extenders: {
    _createHtmlStructure() {
      this._annotationsGroup = this._renderer.g().attr({
        'class': `${this._rootClassPrefix}-annotations`
      }).css(this._getAnnotationStyles()).linkOn(this._renderer.root, 'annotations').linkAppend();
      _events_engine.default.on(getDocument(), POINTER_ACTION, e => {
        if (this._disposed) {
          return;
        }
        if (!this._annotations.tooltip.isCursorOnTooltip(e.pageX, e.pageY)) {
          this._annotations.hideTooltip();
        }
      });
      _events_engine.default.on(getDocument(), POINTER_UP_EVENT_NAME, event => {
        this._annotations._hideToolTipForDrag = false;
        this._annotationsPointerEventHandler(event);
      });
      this._annotationsGroup.on(POINTER_ACTION, this._annotationsPointerEventHandler.bind(this));
    },
    _renderExtraElements() {
      this._annotationsGroup.clear();
      this._annotations.items.forEach(item => item.draw(this, this._annotationsGroup));
    },
    _stopCurrentHandling() {
      this._annotations.hideTooltip();
    }
  },
  members: {
    _buildAnnotations() {
      this._annotations.clearItems();
      const items = this._getOption('annotations', true);
      if (!(items !== null && items !== void 0 && items.length)) {
        return;
      }
      this._annotations.items = createAnnotations(this, items, this._getOption('commonAnnotationSettings'), this._getOption('customizeAnnotation', true), this._pullOptions);
    },
    _setAnnotationTooltipOptions() {
      const tooltipOptions = (0, _extend.extend)({}, this._getOption('tooltip'));
      tooltipOptions.contentTemplate = tooltipOptions.customizeTooltip = undefined;
      this._annotations.tooltip.update(tooltipOptions);
    },
    _getAnnotationCoords() {
      return {};
    },
    _pullOptions() {
      return {};
    },
    _getAnnotationStyles() {
      return {};
    }
  },
  customize(constructor) {
    constructor.addChange({
      code: 'ANNOTATIONITEMS',
      handler() {
        this._requestChange(['ANNOTATIONS']);
      },
      isOptionChange: true,
      option: 'annotations'
    });
    constructor.addChange({
      code: 'ANNOTATIONSSETTINGS',
      handler() {
        this._requestChange(['ANNOTATIONS']);
      },
      isOptionChange: true,
      option: 'commonAnnotationSettings'
    });
    constructor.addChange({
      code: 'ANNOTATIONS',
      handler() {
        this._buildAnnotations();
        this._setAnnotationTooltipOptions();
        this._forceAnnotationRender();
      },
      isThemeDependent: true,
      isOptionChange: true
    });
  },
  fontFields: ['commonAnnotationSettings.font']
};
const plugins = exports.plugins = {
  core: corePlugin,
  chart: chartPlugin,
  polarChart: polarChartPlugin,
  vectorMap: vectorMapPlugin,
  pieChart: pieChartPlugin
};