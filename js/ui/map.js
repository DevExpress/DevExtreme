const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const Promise = require('../core/polyfills/promise');
const fromPromise = require('../core/utils/deferred').fromPromise;
const registerComponent = require('../core/component_registrator');
const errors = require('./widget/ui.errors');
const devices = require('../core/devices');
const Widget = require('./widget/ui.widget');
const inflector = require('../core/utils/inflector');
const each = require('../core/utils/iterator').each;
const extend = require('../core/utils/extend').extend;
const inArray = require('../core/utils/array').inArray;
const isNumeric = require('../core/utils/type').isNumeric;
const eventUtils = require('../events/utils');
const pointerEvents = require('../events/pointer');
const wrapToArray = require('../core/utils/array').wrapToArray;

// NOTE external urls must have protocol explicitly specified (because inside Cordova package the protocol is "file:")


const PROVIDERS = {
    googleStatic: require('./map/provider.google_static'),
    google: require('./map/provider.dynamic.google'),
    bing: require('./map/provider.dynamic.bing')
};


const MAP_CLASS = 'dx-map';
const MAP_CONTAINER_CLASS = 'dx-map-container';
const MAP_SHIELD_CLASS = 'dx-map-shield';
const NATIVE_CLICK_CLASS = 'dx-native-click';

const Map = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxMapOptions.bounds
            * @type object
            * @hidden
            */
            bounds: {
                /**
                * @name dxMapOptions.bounds.northEast
                * @type object|string|Array<object>
                * @default null
                * @hidden
                */

                /**
                * @name dxMapOptions.bounds.northEast.lat
                * @type number
                * @hidden
                */

                /**
                * @name dxMapOptions.bounds.northEast.lng
                * @type number
                * @hidden
                */
                northEast: null,

                /**
                * @name dxMapOptions.bounds.southWest
                * @type object|string|Array<object>
                * @default null
                * @hidden
                */

                /**
                * @name dxMapOptions.bounds.southWest.lat
                * @type number
                * @hidden
                */

                /**
                * @name dxMapOptions.bounds.southWest.lng
                * @type number
                * @hidden
                */
                southWest: null
            },

            /**
            * @pseudo MapLocationType
            * @type Object|string|Array<number>
            */
            /**
            * @name MapLocation
            * @hidden
            */
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

            /**
            * @name dxMapOptions.markers.location
            * @extends MapLocationType
            * @inherits MapLocation
            */
            /**
            * @name dxMapOptions.markers.tooltip
            * @type string|object
            */
            /**
            * @name dxMapOptions.markers.tooltip.text
            * @type string
            */
            /**
            * @name dxMapOptions.markers.tooltip.isShown
            * @type boolean
            * @default false
            */
            /**
            * @name dxMapOptions.markers.onClick
            * @type function
            */
            /**
            * @name dxMapOptions.markers.iconSrc
            * @type string
            */
            markers: [],

            markerIconSrc: null,

            onMarkerAdded: null,

            onMarkerRemoved: null,

            /**
            * @name dxMapOptions.routes.locations
            * @extends MapLocationType
            * @inherits MapLocation
            * @type Array<Object>
            */
            /**
            * @name dxMapOptions.routes.mode
            * @type Enums.GeoMapRouteMode
            * @default 'driving'
            */
            /**
            * @name dxMapOptions.routes.color
            * @type string
            * @default '#0000FF'
            */
            /**
            * @name dxMapOptions.routes.weight
            * @type number
            * @default 5
            */
            /**
            * @name dxMapOptions.routes.opacity
            * @type number
            * @default 0.5
            */
            routes: [],

            onRouteAdded: null,

            onRouteRemoved: null,

            key: {
                /**
                * @name dxMapOptions.key.bing
                * @type string
                * @default ""
                */
                bing: '',

                /**
                * @name dxMapOptions.key.google
                * @type string
                * @default ""
                */
                google: '',

                /**
                * @name dxMapOptions.key.googleStatic
                * @type string
                * @default ""
                */
                googleStatic: ''
            },

            controls: false,

            onReady: null,


            /**
            * @name dxMapOptions.onContentReady
            * @hidden true
            * @action
            */

            // for internal use only
            onUpdated: null,

            onClick: null
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.$element()
            .addClass(MAP_CLASS)
            .addClass(NATIVE_CLICK_CLASS);

        this._lastAsyncAction = Promise.resolve();

        this._checkOption('provider');
        this._checkOption('markers');
        this._checkOption('routes');

        this._initContainer();
        this._grabEvents();

        this._rendered = {};
    },

    _checkOption: function(option) {
        const value = this.option(option);

        if(option === 'markers' && !Array.isArray(value)) {
            throw errors.Error('E1022');
        }
        if(option === 'routes' && !Array.isArray(value)) {
            throw errors.Error('E1023');
        }
    },

    _initContainer: function() {
        this._$container = $('<div>')
            .addClass(MAP_CONTAINER_CLASS);

        this.$element().append(this._$container);
    },

    _grabEvents: function() {
        const eventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);

        eventsEngine.on(this.$element(), eventName, this._cancelEvent.bind(this));
    },

    _cancelEvent: function(e) {
        const cancelByProvider = this._provider && this._provider.isEventsCanceled(e) && !this.option('disabled');
        if(cancelByProvider) {
            e.stopPropagation();
        }
    },

    _saveRendered: function(option) {
        const value = this.option(option);

        this._rendered[option] = value.slice();
    },

    _render: function() {
        this.callBase();

        this._renderShield();

        this._saveRendered('markers');
        this._saveRendered('routes');
        this._provider = new PROVIDERS[this.option('provider')](this, this._$container);
        this._queueAsyncAction('render', this._rendered.markers, this._rendered.routes);
    },

    _renderShield: function() {
        let $shield;

        if(this.option('disabled')) {
            $shield = $('<div>').addClass(MAP_SHIELD_CLASS);
            this.$element().append($shield);
        } else {
            $shield = this.$element().find('.' + MAP_SHIELD_CLASS);
            $shield.remove();
        }
    },

    _clean: function() {
        this._cleanFocusState();
        if(this._provider) {
            this._provider.clean();
        }
        this._provider = null;
        this._lastAsyncAction = Promise.resolve();
        this.setOptionSilent('bounds', { northEast: null, southWest: null });

        delete this._suppressAsyncAction;
    },

    _optionChanged: function(args) {
        const name = args.name;

        const changeBag = this._optionChangeBag;
        this._optionChangeBag = null;

        switch(name) {
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
            case 'key':
                errors.log('W1001');
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
                this._checkOption(name);

                var prevValue = this._rendered[name];
                this._saveRendered(name);
                this._queueAsyncAction(
                    'update' + inflector.titleize(name),
                    changeBag ? changeBag.removed : prevValue,
                    changeBag ? changeBag.added : this._rendered[name]
                ).then(function(result) {
                    if(changeBag) {
                        changeBag.resolve(result);
                    }
                });
                break;
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

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        this._queueAsyncAction('updateDimensions');
    },

    _queueAsyncAction: function(name) {
        const options = [].slice.call(arguments).slice(1);
        const isActionSuppressed = this._suppressAsyncAction;

        this._lastAsyncAction = this._lastAsyncAction.then(function() {
            if(!this._provider || isActionSuppressed) {
                ///#DEBUG
                this._asyncActionSuppressed = true;
                ///#ENDDEBUG
                return Promise.resolve();
            }

            return this._provider[name].apply(this._provider, options).then(function(result) {
                result = wrapToArray(result);

                const mapRefreshed = result[0];
                if(mapRefreshed) {
                    this._triggerReadyAction();
                }
                ///#DEBUG
                if(!mapRefreshed && name !== 'clean') {
                    this._triggerUpdateAction();
                }
                ///#ENDDEBUG

                return result[1];
            }.bind(this));
        }.bind(this));

        return this._lastAsyncAction;
    },

    _triggerReadyAction: function() {
        this._createActionByOption('onReady')({ originalMap: this._provider.map() });
    },

    _triggerUpdateAction: function() {
        this._createActionByOption('onUpdated')();
    },

    setOptionSilent: function(name, value) {
        this._setOptionSilent(name, value);
    },

    addMarker: function(marker) {
        return this._addFunction('markers', marker);
    },

    removeMarker: function(marker) {
        return this._removeFunction('markers', marker);
    },

    addRoute: function(route) {
        return this._addFunction('routes', route);
    },

    removeRoute: function(route) {
        return this._removeFunction('routes', route);
    },

    _addFunction: function(optionName, addingValue) {
        const optionValue = this.option(optionName);
        const addingValues = wrapToArray(addingValue);

        optionValue.push.apply(optionValue, addingValues);

        return this._partialArrayOptionChange(optionName, optionValue, addingValues, []);
    },

    _removeFunction: function(optionName, removingValue) {
        const optionValue = this.option(optionName);
        const removingValues = wrapToArray(removingValue);

        each(removingValues, function(removingIndex, removingValue) {
            const index = isNumeric(removingValue)
                ? removingValue
                : inArray(removingValue, optionValue);

            if(index !== -1) {
                const removing = optionValue.splice(index, 1)[0];
                removingValues.splice(removingIndex, 1, removing);
            } else {
                throw errors.log('E1021', inflector.titleize(optionName.substring(0, optionName.length - 1)), removingValue);
            }
        });

        return this._partialArrayOptionChange(optionName, optionValue, [], removingValues);
    },

    _partialArrayOptionChange: function(optionName, optionValue, addingValues, removingValues) {
        return fromPromise(new Promise(function(resolve) {
            this._optionChangeBag = {
                resolve: resolve,
                added: addingValues,
                removed: removingValues
            };
            this.option(optionName, optionValue);
        }.bind(this)).then(function(result) {
            return (result && result.length === 1) ? result[0] : result;
        }), this);
    }

});

registerComponent('dxMap', Map);

module.exports = Map;
