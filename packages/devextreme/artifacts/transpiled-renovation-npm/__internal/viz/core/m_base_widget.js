"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _dom_component = _interopRequireDefault(require("../../../core/dom_component"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _base_theme_manager = require("../../../viz/core/base_theme_manager");
var _base_widget = require("../../../viz/core/base_widget.utils");
var _errors_warnings = _interopRequireDefault(require("../../../viz/core/errors_warnings"));
var _helpers = require("../../../viz/core/helpers");
var _layout = _interopRequireDefault(require("../../../viz/core/layout"));
var _renderer2 = require("../../../viz/core/renderers/renderer");
var _utils = require("../../../viz/core/utils");
var _utils2 = require("../../../viz/utils");
var _m_charts = _interopRequireDefault(require("../../common/m_charts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const {
  log
} = _errors_warnings.default;
const OPTION_RTL_ENABLED = 'rtlEnabled';
const SIZED_ELEMENT_CLASS = 'dx-sized-element';
const baseOptionMethod = _dom_component.default.prototype.option;
function getTrue() {
  return true;
}
function getFalse() {
  return false;
}
function defaultOnIncidentOccurred(e) {
  if (!e.component._eventsStrategy.hasEvent('incidentOccurred')) {
    log.apply(null, [e.target.id].concat(e.target.args || []));
  }
}
function pickPositiveValue(values) {
  return values.reduce((result, value) => value > 0 && !result ? value : result, 0);
}
// TODO - Changes handling
// * Provide more validation - something like
//     _changes: [{
//         code: "THEME",
//         options: ["theme"],
//         type: "option",
//         handler: function () {
//             this._setThemeAndRtl();
//         }
//     }, {
//         code: "CONTAINER_SIZE",
//         options: ["size", "option"],
//         type: "layout",
//         handler: function () {
//             this._updateSize();
//         }
//     }]
const getEmptyComponent = function () {
  const emptyComponentConfig = {
    _initTemplates() {},
    ctor(element, options) {
      this.callBase(element, options);
      const sizedElement = _dom_adapter.default.createElement('div');
      const width = options && (0, _type.isNumeric)(options.width) ? `${options.width}px` : '100%';
      const height = options && (0, _type.isNumeric)(options.height) ? `${options.height}px` : `${this._getDefaultSize().height}px`;
      _dom_adapter.default.setStyle(sizedElement, 'width', width);
      _dom_adapter.default.setStyle(sizedElement, 'height', height);
      _dom_adapter.default.setClass(sizedElement, SIZED_ELEMENT_CLASS, false);
      _dom_adapter.default.insertElement(element, sizedElement);
    }
  };
  const EmptyComponent = _dom_component.default.inherit(emptyComponentConfig);
  const originalInherit = EmptyComponent.inherit;
  EmptyComponent.inherit = function (config) {
    Object.keys(config).forEach(field => {
      if ((0, _type.isFunction)(config[field]) && field.substr(0, 1) !== '_' && field !== 'option' || field === '_dispose' || field === '_optionChanged') {
        config[field] = _common.noop;
      }
    });
    return originalInherit.call(this, config);
  };
  return EmptyComponent;
};
function callForEach(functions) {
  functions.forEach(c => c());
}
const isServerSide = !(0, _window.hasWindow)();
function sizeIsValid(value) {
  return (0, _type.isDefined)(value) && value > 0;
}
const baseWidget = isServerSide ? getEmptyComponent() : _dom_component.default.inherit({
  _eventsMap: {
    onIncidentOccurred: {
      name: 'incidentOccurred',
      actionSettings: {
        excludeValidators: ['disabled']
      }
    },
    onDrawn: {
      name: 'drawn',
      actionSettings: {
        excludeValidators: ['disabled']
      }
    }
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onIncidentOccurred: defaultOnIncidentOccurred
    });
  },
  _useLinks: true,
  _init() {
    this._$element.children(`.${SIZED_ELEMENT_CLASS}`).remove();
    this._graphicObjects = {};
    this.callBase(...arguments);
    this._changesLocker = 0;
    this._optionChangedLocker = 0;
    this._asyncFirstDrawing = true;
    this._changes = (0, _helpers.changes)();
    this._suspendChanges();
    this._themeManager = this._createThemeManager();
    this._themeManager.setCallback(() => {
      this._requestChange(this._themeDependentChanges);
    });
    this._renderElementAttributes();
    this._initRenderer();
    // Shouldn't "_useLinks" be passed to the renderer instead of doing 3 checks here?
    const useLinks = this._useLinks;
    // There is an implicit relation between `_useLinks` and `loading indicator` - it uses links
    // Though this relation is not ensured in code
    // we will immediately know when it is broken - `loading indicator` will break on construction
    if (useLinks) {
      this._renderer.root.enableLinks().virtualLink('core').virtualLink('peripheral');
    }
    this._renderVisibilityChange();
    this._attachVisibilityChangeHandlers();
    this._toggleParentsScrollSubscription(this._isVisible());
    this._initEventTrigger();
    this._incidentOccurred = (0, _base_widget.createIncidentOccurred)(this.NAME, this._eventTrigger);
    this._layout = new _layout.default();
    // Such solution is used only to avoid writing lots of "after"
    // for all core elements in all widgets
    // May be later a proper solution would be found
    if (useLinks) {
      this._renderer.root.linkAfter('core');
    }
    this._initPlugins();
    this._initCore();
    if (useLinks) {
      this._renderer.root.linkAfter();
    }
    this._change(this._initialChanges);
  },
  _createThemeManager() {
    return new _base_theme_manager.BaseThemeManager(this._getThemeManagerOptions());
  },
  _getThemeManagerOptions() {
    return {
      themeSection: this._themeSection,
      fontFields: this._fontFields
    };
  },
  _initialChanges: ['LAYOUT', 'RESIZE_HANDLER', 'THEME', 'DISABLED'],
  _initPlugins() {
    (0, _iterator.each)(this._plugins, (_, plugin) => {
      plugin.init.call(this);
    });
  },
  _disposePlugins() {
    (0, _iterator.each)(this._plugins.slice().reverse(), (_, plugin) => {
      plugin.dispose.call(this);
    });
  },
  _change(codes) {
    this._changes.add(codes);
  },
  _suspendChanges() {
    this._changesLocker += 1;
  },
  _resumeChanges() {
    if (--this._changesLocker === 0 && this._changes.count() > 0 && !this._applyingChanges) {
      this._renderer.lock();
      this._applyingChanges = true;
      this._applyChanges();
      this._changes.reset();
      this._applyingChanges = false;
      this._changesApplied();
      this._renderer.unlock();
      if (this._optionsQueue) {
        this._applyQueuedOptions();
      }
      this.resolveItemsDeferred(this._legend ? [this._legend] : []);
      this._optionChangedLocker += 1;
      this._notify();
      this._optionChangedLocker -= 1;
    }
  },
  resolveItemsDeferred(items) {
    this._resolveDeferred(this._getTemplatesItems(items));
  },
  _collectTemplatesFromItems(items) {
    return items.reduce((prev, i) => ({
      items: prev.items.concat(i.getTemplatesDef()),
      groups: prev.groups.concat(i.getTemplatesGroups())
    }), {
      items: [],
      groups: []
    });
  },
  _getTemplatesItems(items) {
    const elements = this._collectTemplatesFromItems(items);
    const extraItems = this._getExtraTemplatesItems();
    return {
      items: extraItems.items.concat(elements.items),
      groups: extraItems.groups.concat(elements.groups),
      launchRequest: [extraItems.launchRequest],
      doneRequest: [extraItems.doneRequest]
    };
  },
  _getExtraTemplatesItems() {
    return {
      items: [],
      groups: [],
      launchRequest: () => {},
      doneRequest: () => {}
    };
  },
  _resolveDeferred(_ref) {
    let {
      items,
      launchRequest,
      doneRequest,
      groups
    } = _ref;
    this._setGroupsVisibility(groups, 'hidden');
    if (this._changesApplying) {
      this._changesApplying = false;
      callForEach(doneRequest);
      return;
    }
    let syncRendering = true;
    _deferred.when.apply(this, items).done(() => {
      if (syncRendering) {
        this._setGroupsVisibility(groups, 'visible');
        return;
      }
      callForEach(launchRequest);
      this._changesApplying = true;
      const changes = ['LAYOUT', 'FULL_RENDER'];
      if (this._asyncFirstDrawing) {
        changes.push('FORCE_FIRST_DRAWING');
        this._asyncFirstDrawing = false;
      } else {
        changes.push('FORCE_DRAWING');
      }
      this._requestChange(changes);
      this._setGroupsVisibility(groups, 'visible');
    });
    syncRendering = false;
  },
  _setGroupsVisibility(groups, visibility) {
    groups.forEach(g => g.attr({
      visibility
    }));
  },
  _applyQueuedOptions() {
    const queue = this._optionsQueue;
    this._optionsQueue = null;
    this.beginUpdate();
    (0, _iterator.each)(queue, (_, action) => {
      action();
    });
    this.endUpdate();
  },
  _requestChange(codes) {
    this._suspendChanges();
    this._change(codes);
    this._resumeChanges();
  },
  _applyChanges() {
    const changes = this._changes;
    const order = this._totalChangesOrder;
    const changesOrderLength = order.length;
    for (let i = 0; i < changesOrderLength; i += 1) {
      if (changes.has(order[i])) {
        this[`_change_${order[i]}`]();
      }
    }
  },
  _optionChangesOrder: ['EVENTS', 'THEME', 'RENDERER', 'RESIZE_HANDLER'],
  _layoutChangesOrder: ['ELEMENT_ATTR', 'CONTAINER_SIZE', 'LAYOUT'],
  _customChangesOrder: ['DISABLED'],
  _change_EVENTS() {
    this._eventTrigger.applyChanges();
  },
  _change_THEME() {
    this._setThemeAndRtl();
  },
  _change_RENDERER() {
    this._setRendererOptions();
  },
  _change_RESIZE_HANDLER() {
    this._setupResizeHandler();
  },
  _change_ELEMENT_ATTR() {
    this._renderElementAttributes();
    this._change(['CONTAINER_SIZE']);
  },
  _change_CONTAINER_SIZE() {
    this._updateSize();
  },
  _change_LAYOUT() {
    this._setContentSize();
  },
  _change_DISABLED() {
    const renderer = this._renderer;
    const {
      root
    } = renderer;
    if (this.option('disabled')) {
      this._initDisabledState = root.attr('pointer-events');
      root.attr({
        'pointer-events': 'none',
        filter: renderer.getGrayScaleFilter().id
      });
    } else if (root.attr('pointer-events') === 'none') {
      root.attr({
        'pointer-events': (0, _type.isDefined)(this._initDisabledState) ? this._initDisabledState : null,
        filter: null
      });
    }
  },
  _themeDependentChanges: ['RENDERER'],
  _initRenderer() {
    // Canvas is calculated before the renderer is created in order to capture actual
    // size of the container
    const rawCanvas = this._calculateRawCanvas();
    this._canvas = (0, _utils2.floorCanvasDimensions)(rawCanvas);
    this._renderer = new _renderer2.Renderer({
      cssClass: `${this._rootClassPrefix} ${this._rootClass}`,
      pathModified: this.option('pathModified'),
      container: this._$element[0]
    });
    this._renderer.resize(this._canvas.width, this._canvas.height);
  },
  _disposeRenderer() {
    
    this._renderer.dispose();
  },
  _disposeGraphicObjects() {
    Object.keys(this._graphicObjects).forEach(id => {
      this._graphicObjects[id].dispose();
    });
    this._graphicObjects = null;
  },
  _getAnimationOptions: _common.noop,
  render() {
    this._requestChange(['CONTAINER_SIZE']);
    const visible = this._isVisible();
    this._toggleParentsScrollSubscription(visible);
    !visible && this._stopCurrentHandling();
  },
  _toggleParentsScrollSubscription(subscribe) {
    let $parents = (0, _renderer.default)(this._renderer.root.element).parents();
    const scrollEvents = 'scroll.viz_widgets';
    if (_devices.default.real().platform === 'generic') {
      $parents = $parents.add((0, _window.getWindow)());
    }
    this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler || function () {
      this._stopCurrentHandling();
    }.bind(this);
    _events_engine.default.off((0, _renderer.default)('').add(this._$prevRootParents), scrollEvents, this._proxiedTargetParentsScrollHandler);
    if (subscribe) {
      _events_engine.default.on($parents, scrollEvents, this._proxiedTargetParentsScrollHandler);
      this._$prevRootParents = $parents;
    }
  },
  _stopCurrentHandling: _common.noop,
  _dispose() {
    if (this._disposed) {
      return;
    }
    this.callBase(...arguments);
    this._toggleParentsScrollSubscription(false);
    this._removeResizeHandler();
    this._layout.dispose();
    this._eventTrigger.dispose();
    this._disposeCore();
    this._disposePlugins();
    this._disposeGraphicObjects();
    this._disposeRenderer();
    this._themeManager.dispose();
    this._themeManager = null;
    this._renderer = null;
    this._eventTrigger = null;
  },
  _initEventTrigger() {
    const callback = (name, actionSettings) => this._createActionByOption(name, actionSettings);
    this._eventTrigger = (0, _base_widget.createEventTrigger)(this._eventsMap, callback);
  },
  _calculateRawCanvas() {
    const size = this.option('size') || {};
    const margin = this.option('margin') || {};
    const defaultCanvas = this._getDefaultSize() || {};
    const getSizeOfSide = (size, side, getter) => {
      if (sizeIsValid(size[side]) || !(0, _window.hasWindow)()) {
        return 0;
      }
      const elementSize = getter(this._$element);
      return elementSize <= 1 ? 0 : elementSize;
    };
    const elementWidth = getSizeOfSide(size, 'width', x => (0, _size.getWidth)(x));
    const elementHeight = getSizeOfSide(size, 'height', x => (0, _size.getHeight)(x));
    let canvas = {
      width: size.width <= 0 ? 0 : pickPositiveValue([size.width, elementWidth, defaultCanvas.width]),
      height: size.height <= 0 ? 0 : pickPositiveValue([size.height, elementHeight, defaultCanvas.height]),
      left: pickPositiveValue([margin.left, defaultCanvas.left]),
      top: pickPositiveValue([margin.top, defaultCanvas.top]),
      right: pickPositiveValue([margin.right, defaultCanvas.right]),
      bottom: pickPositiveValue([margin.bottom, defaultCanvas.bottom])
    };
    // This for backward compatibility - widget was not rendered when canvas is empty.
    // Now it will be rendered but because of "width" and "height"
    // of the root both set to 0 it will not be visible.
    if (canvas.width - canvas.left - canvas.right <= 0 || canvas.height - canvas.top - canvas.bottom <= 0) {
      canvas = {
        width: 0,
        height: 0
      };
    }
    return canvas;
  },
  _updateSize() {
    const rawCanvas = this._calculateRawCanvas();
    if ((0, _utils2.areCanvasesDifferent)(this._canvas, rawCanvas) || this.__forceRender /* for charts */) {
      this._canvas = (0, _utils2.floorCanvasDimensions)(rawCanvas);
      this._recreateSizeDependentObjects(true);
      this._renderer.resize(this._canvas.width, this._canvas.height);
      this._change(['LAYOUT']);
    }
  },
  _recreateSizeDependentObjects: _common.noop,
  _getMinSize() {
    return [0, 0];
  },
  _getAlignmentRect: _common.noop,
  _setContentSize() {
    const canvas = this._canvas;
    const layout = this._layout;
    let rect = canvas.width > 0 && canvas.height > 0 ? [canvas.left, canvas.top, canvas.width - canvas.right, canvas.height - canvas.bottom] : [0, 0, 0, 0];
    rect = layout.forward(rect, this._getMinSize());
    const nextRect = this._applySize(rect) || rect;
    layout.backward(nextRect, this._getAlignmentRect() || nextRect);
  },
  
  _getOption(name, isScalar) {
    const theme = this._themeManager.theme(name);
    const option = this.option(name);
    return isScalar ? option !== undefined ? option : theme : (0, _extend.extend)(true, {}, theme, option);
  },
  _setupResizeHandler() {
    const redrawOnResize = (0, _utils.parseScalar)(this._getOption('redrawOnResize', true), true);
    if (this._disposeResizeHandler) {
      this._removeResizeHandler();
    }
    this._disposeResizeHandler = (0, _base_widget.createResizeHandler)(this._$element[0], redrawOnResize, () => this._requestChange(['CONTAINER_SIZE']));
  },
  _removeResizeHandler() {
    if (this._disposeResizeHandler) {
      this._disposeResizeHandler();
      this._disposeResizeHandler = null;
    }
  },
  // This is actually added only to make loading indicator pluggable.
  // This is bad but much better than entire loading indicator in BaseWidget.
  _onBeginUpdate: _common.noop,
  beginUpdate() {
    // The "_initialized" flag is checked because
    // first time "beginUpdate" is called in the constructor.
    if (this._initialized && this._isUpdateAllowed()) {
      this._onBeginUpdate();
      this._suspendChanges();
    }
    this.callBase(...arguments);
    return this;
  },
  endUpdate() {
    this.callBase();
    this._isUpdateAllowed() && this._resumeChanges();
    return this;
  },
  option(name) {
    // NOTE: `undefined` has to be returned because base option setter returns `undefined`.
    // `argument.length` and `isObject` checks are copypaste from Component.
    if (this._initialized && this._applyingChanges && (arguments.length > 1 || (0, _type.isObject)(name))) {
      this._optionsQueue = this._optionsQueue || [];
      this._optionsQueue.push(this._getActionForUpdating(arguments));
    } else {
      return baseOptionMethod.apply(this, arguments);
    }
  },
  _getActionForUpdating(args) {
    return () => {
      baseOptionMethod.apply(this, args);
    };
  },
  // For quite a long time the following method were abstract (from the Component perspective).
  // Now they are not but that basic functionality is not required here.
  _clean: _common.noop,
  _render: _common.noop,
  _optionChanged(arg) {
    if (this._optionChangedLocker) {
      return;
    }
    const partialChanges = this.getPartialChangeOptionsName(arg);
    let changes = [];
    if (partialChanges.length > 0) {
      partialChanges.forEach(pc => changes.push(this._partialOptionChangesMap[pc]));
    } else {
      changes.push(this._optionChangesMap[arg.name]);
    }
    changes = changes.filter(c => !!c);
    if (this._eventTrigger.change(arg.name)) {
      this._change(['EVENTS']);
    } else if (changes.length > 0) {
      this._change(changes);
    } else {
      this.callBase.apply(this, arguments);
    }
  },
  _notify: _common.noop,
  _changesApplied: _common.noop,
  _optionChangesMap: {
    size: 'CONTAINER_SIZE',
    margin: 'CONTAINER_SIZE',
    redrawOnResize: 'RESIZE_HANDLER',
    theme: 'THEME',
    rtlEnabled: 'THEME',
    encodeHtml: 'THEME',
    elementAttr: 'ELEMENT_ATTR',
    disabled: 'DISABLED'
  },
  _partialOptionChangesMap: {},
  _partialOptionChangesPath: {},
  getPartialChangeOptionsName(changedOption) {
    const {
      fullName
    } = changedOption;
    const sections = fullName.split(/[.]/);
    const {
      name
    } = changedOption;
    const {
      value
    } = changedOption;
    const options = this._partialOptionChangesPath[name];
    const partialChangeOptionsName = [];
    if (options) {
      if (options === true) {
        partialChangeOptionsName.push(name);
      } else {
        options.forEach(op => {
          fullName.indexOf(op) >= 0 && partialChangeOptionsName.push(op);
        });
        if (sections.length === 1) {
          if ((0, _type.type)(value) === 'object') {
            this._addOptionsNameForPartialUpdate(value, options, partialChangeOptionsName);
          } else if ((0, _type.type)(value) === 'array') {
            if (value.length > 0 && value.every(item => this._checkOptionsForPartialUpdate(item, options))) {
              value.forEach(item => {
                this._addOptionsNameForPartialUpdate(item, options, partialChangeOptionsName);
              });
            }
          }
        }
      }
    }
    return partialChangeOptionsName.filter((value, index, self) => self.indexOf(value) === index);
  },
  _checkOptionsForPartialUpdate(optionObject, options) {
    return !Object.keys(optionObject).some(key => options.indexOf(key) === -1);
  },
  _addOptionsNameForPartialUpdate(optionObject, options, partialChangeOptionsName) {
    const optionKeys = Object.keys(optionObject);
    if (this._checkOptionsForPartialUpdate(optionObject, options)) {
      optionKeys.forEach(key => options.indexOf(key) > -1 && partialChangeOptionsName.push(key));
    }
  },
  _visibilityChanged() {
    this.render();
  },
  _setThemeAndRtl() {
    this._themeManager.setTheme(this.option('theme'), this.option(OPTION_RTL_ENABLED));
  },
  _getRendererOptions() {
    return {
      rtl: this.option(OPTION_RTL_ENABLED),
      encodeHtml: this.option('encodeHtml'),
      animation: this._getAnimationOptions()
    };
  },
  _setRendererOptions() {
    this._renderer.setOptions(this._getRendererOptions());
  },
  svg() {
    return this._renderer.svg();
  },
  getSize() {
    const canvas = this._canvas || {};
    return {
      width: canvas.width,
      height: canvas.height
    };
  },
  isReady: getFalse,
  _dataIsReady: getTrue,
  _resetIsReady() {
    this.isReady = getFalse;
  },
  _renderGraphicObjects() {
    const renderer = this._renderer;
    const graphics = _m_charts.default.getGraphicObjects();
    Object.keys(graphics).forEach(id => {
      if (!this._graphicObjects[id]) {
        const {
          type,
          colors,
          rotationAngle,
          template,
          width,
          height
        } = graphics[id];
        switch (type) {
          case 'linear':
            this._graphicObjects[id] = renderer.linearGradient(colors, id, rotationAngle);
            break;
          case 'radial':
            this._graphicObjects[id] = renderer.radialGradient(colors, id);
            break;
          case 'pattern':
            this._graphicObjects[id] = renderer.customPattern(id, this._getTemplate(template), width, height);
            break;
          default:
            break;
        }
      }
    });
  },
  _drawn() {
    this.isReady = getFalse;
    if (this._dataIsReady()) {
      this._renderer.onEndAnimation(() => {
        this.isReady = getTrue;
      });
    }
    this._eventTrigger('drawn', {});
  }
});
var _default = exports.default = baseWidget;
(0, _helpers.replaceInherit)(baseWidget);