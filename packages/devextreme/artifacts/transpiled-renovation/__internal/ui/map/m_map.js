"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _array = require("../../../core/utils/array");
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _inflector = require("../../../core/utils/inflector");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _ui2 = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
var _m_providerDynamic = _interopRequireDefault(require("./m_provider.dynamic.bing"));
var _m_providerDynamic2 = _interopRequireDefault(require("./m_provider.dynamic.google"));
var _m_provider = _interopRequireDefault(require("./m_provider.google_static"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// NOTE external urls must have protocol explicitly specified (because inside Cordova package the protocol is "file:")

const PROVIDERS = {
  googleStatic: _m_provider.default,
  google: _m_providerDynamic2.default,
  bing: _m_providerDynamic.default
};
const MAP_CLASS = 'dx-map';
const MAP_CONTAINER_CLASS = 'dx-map-container';
const MAP_SHIELD_CLASS = 'dx-map-shield';
// @ts-expect-error
const Map = _ui2.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      bounds: {
        northEast: null,
        southWest: null
      },
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 1,
      width: 300,
      height: 300,
      type: 'roadmap',
      provider: 'google',
      autoAdjust: true,
      markers: [],
      markerIconSrc: null,
      onMarkerAdded: null,
      onMarkerRemoved: null,
      routes: [],
      onRouteAdded: null,
      onRouteRemoved: null,
      apiKey: {
        bing: '',
        google: '',
        googleStatic: ''
      },
      controls: false,
      onReady: null,
      // for internal use only
      onUpdated: null,
      onClick: null
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _renderFocusTarget: _common.noop,
  _init() {
    this.callBase();
    this.$element().addClass(MAP_CLASS);
    this._lastAsyncAction = Promise.resolve();
    this._checkOption('provider');
    this._checkOption('markers');
    this._checkOption('routes');
    this._initContainer();
    this._grabEvents();
    this._rendered = {};
  },
  _useTemplates() {
    return false;
  },
  _checkOption(option) {
    const value = this.option(option);
    if (option === 'markers' && !Array.isArray(value)) {
      throw _ui.default.Error('E1022');
    }
    if (option === 'routes' && !Array.isArray(value)) {
      throw _ui.default.Error('E1023');
    }
  },
  _initContainer() {
    this._$container = (0, _renderer.default)('<div>').addClass(MAP_CONTAINER_CLASS);
    this.$element().append(this._$container);
  },
  _grabEvents() {
    const eventName = (0, _index.addNamespace)(_pointer.default.down, this.NAME);
    _events_engine.default.on(this.$element(), eventName, this._cancelEvent.bind(this));
  },
  _cancelEvent(e) {
    const cancelByProvider = this._provider && this._provider.isEventsCanceled(e) && !this.option('disabled');
    if (cancelByProvider) {
      e.stopPropagation();
    }
  },
  _saveRendered(option) {
    const value = this.option(option);
    this._rendered[option] = value.slice();
  },
  _render() {
    this.callBase();
    this._renderShield();
    this._saveRendered('markers');
    this._saveRendered('routes');
    this._provider = new PROVIDERS[this.option('provider')](this, this._$container);
    this._queueAsyncAction('render', this._rendered.markers, this._rendered.routes);
  },
  _renderShield() {
    let $shield;
    if (this.option('disabled')) {
      $shield = (0, _renderer.default)('<div>').addClass(MAP_SHIELD_CLASS);
      this.$element().append($shield);
    } else {
      $shield = this.$element().find(`.${MAP_SHIELD_CLASS}`);
      $shield.remove();
    }
  },
  _clean() {
    this._cleanFocusState();
    if (this._provider) {
      this._provider.clean();
    }
    this._provider = null;
    this._lastAsyncAction = Promise.resolve();
    this.setOptionSilent('bounds', {
      northEast: null,
      southWest: null
    });
    delete this._suppressAsyncAction;
  },
  _optionChanged(args) {
    const {
      name
    } = args;
    const changeBag = this._optionChangeBag;
    this._optionChangeBag = null;
    switch (name) {
      case 'disabled':
        this._renderShield();
        this.callBase(args);
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        this._dimensionChanged();
        break;
      case 'provider':
        this._suppressAsyncAction = true;
        this._invalidate();
        break;
      case 'apiKey':
        _ui.default.log('W1001');
        break;
      case 'bounds':
        this._queueAsyncAction('updateBounds');
        break;
      case 'center':
        this._queueAsyncAction('updateCenter');
        break;
      case 'zoom':
        this._queueAsyncAction('updateZoom');
        break;
      case 'type':
        this._queueAsyncAction('updateMapType');
        break;
      case 'controls':
        this._queueAsyncAction('updateControls', this._rendered.markers, this._rendered.routes);
        break;
      case 'autoAdjust':
        this._queueAsyncAction('adjustViewport');
        break;
      case 'markers':
      case 'routes':
        {
          this._checkOption(name);
          const prevValue = this._rendered[name];
          this._saveRendered(name);
          this._queueAsyncAction(`update${(0, _inflector.titleize)(name)}`, changeBag ? changeBag.removed : prevValue, changeBag ? changeBag.added : this._rendered[name]).then(result => {
            if (changeBag) {
              changeBag.resolve(result);
            }
          });
          break;
        }
      case 'markerIconSrc':
        this._queueAsyncAction('updateMarkers', this._rendered.markers, this._rendered.markers);
        break;
      case 'onReady':
      case 'onUpdated':
      case 'onMarkerAdded':
      case 'onMarkerRemoved':
      case 'onRouteAdded':
      case 'onRouteRemoved':
      case 'onClick':
        break;
      default:
        this.callBase.apply(this, arguments);
    }
  },
  _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged() {
    this._queueAsyncAction('updateDimensions');
  },
  _queueAsyncAction(name) {
    const options = [].slice.call(arguments).slice(1);
    const isActionSuppressed = this._suppressAsyncAction;
    this._lastAsyncAction = this._lastAsyncAction.then(() => {
      if (!this._provider || isActionSuppressed) {
        /// #DEBUG
        this._asyncActionSuppressed = true;
        /// #ENDDEBUG
        return Promise.resolve();
      }
      return this._provider[name].apply(this._provider, options).then(result => {
        result = (0, _array.wrapToArray)(result);
        const mapRefreshed = result[0];
        if (mapRefreshed && !this._disposed) {
          this._triggerReadyAction();
        }
        /// #DEBUG
        if (!mapRefreshed && name !== 'clean' && !this._disposed) {
          this._triggerUpdateAction();
        }
        /// #ENDDEBUG
        return result[1];
      });
    });
    return this._lastAsyncAction;
  },
  _triggerReadyAction() {
    this._createActionByOption('onReady')({
      originalMap: this._provider.map()
    });
  },
  _triggerUpdateAction() {
    this._createActionByOption('onUpdated')();
  },
  setOptionSilent(name, value) {
    this._setOptionWithoutOptionChange(name, value);
  },
  addMarker(marker) {
    return this._addFunction('markers', marker);
  },
  removeMarker(marker) {
    return this._removeFunction('markers', marker);
  },
  addRoute(route) {
    return this._addFunction('routes', route);
  },
  removeRoute(route) {
    return this._removeFunction('routes', route);
  },
  _addFunction(optionName, addingValue) {
    const optionValue = this.option(optionName);
    const addingValues = (0, _array.wrapToArray)(addingValue);
    optionValue.push.apply(optionValue, addingValues);
    return this._partialArrayOptionChange(optionName, optionValue, addingValues, []);
  },
  _removeFunction(optionName, removingValue) {
    const optionValue = this.option(optionName);
    const removingValues = (0, _array.wrapToArray)(removingValue);
    (0, _iterator.each)(removingValues, (removingIndex, removingValue) => {
      const index = (0, _type.isNumeric)(removingValue) ? removingValue : optionValue === null || optionValue === void 0 ? void 0 : optionValue.indexOf(removingValue);
      if (index !== -1) {
        const removing = optionValue.splice(index, 1)[0];
        removingValues.splice(removingIndex, 1, removing);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw _ui.default.log('E1021', (0, _inflector.titleize)(optionName.substring(0, optionName.length - 1)), removingValue);
      }
    });
    return this._partialArrayOptionChange(optionName, optionValue, [], removingValues);
  },
  _partialArrayOptionChange(optionName, optionValue, addingValues, removingValues) {
    return (0, _deferred.fromPromise)(new Promise(resolve => {
      this._optionChangeBag = {
        resolve,
        added: addingValues,
        removed: removingValues
      };
      this.option(optionName, optionValue);
      // @ts-expect-error
    }).then(result => result && result.length === 1 ? result[0] : result), this);
  }
});
(0, _component_registrator.default)('dxMap', Map);
var _default = exports.default = Map;