var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    eventsEngine = require("../events/core/events_engine"),
    Promise = require("../core/polyfills/promise"),
    fromPromise = require("../core/utils/deferred").fromPromise,
    registerComponent = require("../core/component_registrator"),
    errors = require("./widget/ui.errors"),
    devices = require("../core/devices"),
    Widget = require("./widget/ui.widget"),
    inflector = require("../core/utils/inflector"),
    each = require("../core/utils/iterator").each,
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    isNumeric = require("../core/utils/type").isNumeric,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    config = require("../core/config"),
    wrapToArray = require("../core/utils/array").wrapToArray;

// NOTE external urls must have protocol explicitly specified (because inside Cordova package the protocol is "file:")


var PROVIDERS = {
    googleStatic: require("./map/provider.google_static"),
    google: require("./map/provider.dynamic.google"),
    bing: require("./map/provider.dynamic.bing")
};


var MAP_CLASS = "dx-map",
    MAP_CONTAINER_CLASS = "dx-map-container",
    MAP_SHIELD_CLASS = "dx-map-shield",
    NATIVE_CLICK_CLASS = "dx-native-click";

/**
* @name dxMap
* @inherits Widget
* @module ui/map
* @export default
*/
var Map = Widget.inherit({

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
            /**
            * @name MapLocation.lat
            * @type number
            * @default 0
            */
            /**
            * @name MapLocation.lng
            * @type number
            * @default 0
            */
            /**
            * @name dxMapOptions.center
            * @extends MapLocationType
            * @fires dxMapOptions.onOptionChanged
            * @inherits MapLocation
            */
            center: {
                lat: 0,
                lng: 0
            },

            /**
            * @name dxMapOptions.zoom
            * @type number
            * @default 1
            * @fires dxMapOptions.onOptionChanged
            */
            zoom: 1,

            /**
            * @name dxMapOptions.width
            * @inheritdoc
            * @default 300
            */
            width: 300,

            /**
            * @name dxMapOptions.height
            * @inheritdoc
            * @default 300
            */
            height: 300,

            /**
            * @name dxMapOptions.type
            * @type Enums.GeoMapType
            * @default "roadmap"
            */
            type: "roadmap",

            /**
            * @name dxMapOptions.provider
            * @type Enums.GeoMapProvider
            * @default "google"
            */
            provider: "google",

            /**
            * @name dxMapOptions.autoAdjust
            * @type boolean
            * @default true
            */
            autoAdjust: true,

            /**
            * @name dxMapOptions.markers
            * @type Array<Object>
            * @fires dxMapOptions.onMarkerAdded
            * @fires dxMapOptions.onMarkerRemoved
            */
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

            /**
            * @name dxMapOptions.markerIconSrc
            * @type string
            */
            markerIconSrc: null,

            /**
            * @name dxMapOptions.onMarkerAdded
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 options:object
            * @type_function_param1_field5 originalMarker:object
            * @action
            */
            onMarkerAdded: null,

            /**
            * @name dxMapOptions.onMarkerRemoved
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 options:object
            * @action
            */
            onMarkerRemoved: null,

            /**
            * @name dxMapOptions.routes
            * @type Array<Object>
            * @fires dxMapOptions.onRouteAdded
            * @fires dxMapOptions.onRouteRemoved
            */
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

            /**
            * @name dxMapOptions.onRouteAdded
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 options:object
            * @type_function_param1_field5 originalRoute:object
            * @action
            */
            onRouteAdded: null,

            /**
            * @name dxMapOptions.onRouteRemoved
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 options:object
            * @action
            */
            onRouteRemoved: null,

            /**
            * @name dxMapOptions.key
            * @type string|object
            * @default ""
            */
            key: {
                /**
                * @name dxMapOptions.key.bing
                * @type string
                * @default ""
                */
                bing: "",

                /**
                * @name dxMapOptions.key.google
                * @type string
                * @default ""
                */
                google: "",

                /**
                * @name dxMapOptions.key.googleStatic
                * @type string
                * @default ""
                */
                googleStatic: ""
            },

            /**
            * @name dxMapOptions.controls
            * @default false
            * @type boolean
            */
            controls: false,

            /**
            * @name dxMapOptions.onReady
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 originalMap:object
            * @action
            */
            onReady: null,


            /**
            * @name dxMapOptions.onContentReady
            * @hidden true
            * @action
            */

            // for internal use only
            onUpdated: null,

            /**
            * @name dxMapOptions.onClick
            * @type function(e)|string
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 location:object
            * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field6 event:event
            * @action
            */
            onClick: null
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxMapOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    * @inheritdoc
                    */
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

        this._checkOption("provider");
        this._checkOption("markers");
        this._checkOption("routes");

        this._initContainer();
        this._grabEvents();

        this._rendered = {};
    },

    _checkOption: function(option) {
        var value = this.option(option);

        if(option === "markers" && !Array.isArray(value)) {
            throw errors.Error("E1022");
        }
        if(option === "routes" && !Array.isArray(value)) {
            throw errors.Error("E1023");
        }
    },

    _initContainer: function() {
        this._$container = $("<div>")
            .addClass(MAP_CONTAINER_CLASS);

        this.$element().append(this._$container);
    },

    _grabEvents: function() {
        var eventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);

        eventsEngine.on(this.$element(), eventName, this._cancelEvent.bind(this));
    },

    _cancelEvent: function(e) {
        var cancelByProvider = this._provider && this._provider.isEventsCanceled(e) && !this.option("disabled");
        if(!(config.designMode) && cancelByProvider) {
            e.stopPropagation();
        }
    },

    _saveRendered: function(option) {
        var value = this.option(option);

        this._rendered[option] = value.slice();
    },

    _render: function() {
        this.callBase();

        this._renderShield();

        this._saveRendered("markers");
        this._saveRendered("routes");
        this._provider = new PROVIDERS[this.option("provider")](this, this._$container);
        this._queueAsyncAction("render", this._rendered.markers, this._rendered.routes);
    },

    _renderShield: function() {
        var $shield,
            DevExpress = window.DevExpress;

        if(DevExpress && DevExpress.designMode || this.option("disabled")) {
            $shield = $("<div>").addClass(MAP_SHIELD_CLASS);
            this.$element().append($shield);
        } else {
            $shield = this.$element().find("." + MAP_SHIELD_CLASS);
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
        this.setOptionSilent("bounds", { northEast: null, southWest: null });

        delete this._suppressAsyncAction;
    },

    _optionChanged: function(args) {
        var name = args.name;

        var changeBag = this._optionChangeBag;
        this._optionChangeBag = null;

        switch(name) {
            case "disabled":
                this._renderShield();
                this.callBase(args);
                break;
            case "width":
            case "height":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "provider":
                this._suppressAsyncAction = true;
                this._invalidate();
                break;
            case "key":
                errors.log("W1001");
                break;
            case "bounds":
                this._queueAsyncAction("updateBounds");
                break;
            case "center":
                this._queueAsyncAction("updateCenter");
                break;
            case "zoom":
                this._queueAsyncAction("updateZoom");
                break;
            case "type":
                this._queueAsyncAction("updateMapType");
                break;
            case "controls":
                this._queueAsyncAction("updateControls", this._rendered.markers, this._rendered.routes);
                break;
            case "autoAdjust":
                this._queueAsyncAction("adjustViewport");
                break;
            case "markers":
            case "routes":
                this._checkOption(name);

                var prevValue = this._rendered[name];
                this._saveRendered(name);
                this._queueAsyncAction(
                    "update" + inflector.titleize(name),
                    changeBag ? changeBag.removed : prevValue,
                    changeBag ? changeBag.added : this._rendered[name]
                ).then(function(result) {
                    if(changeBag) {
                        changeBag.resolve(result);
                    }
                });
                break;
            case "markerIconSrc":
                this._queueAsyncAction("updateMarkers", this._rendered.markers, this._rendered.markers);
                break;
            case "onReady":
            case "onUpdated":
            case "onMarkerAdded":
            case "onMarkerRemoved":
            case "onRouteAdded":
            case "onRouteRemoved":
            case "onClick":
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
        this._queueAsyncAction("updateDimensions");
    },

    _queueAsyncAction: function(name) {
        var options = [].slice.call(arguments).slice(1),
            isActionSuppressed = this._suppressAsyncAction;

        this._lastAsyncAction = this._lastAsyncAction.then(function() {
            if(!this._provider || isActionSuppressed) {
                ///#DEBUG
                this._asyncActionSuppressed = true;
                ///#ENDDEBUG
                return Promise.resolve();
            }

            return this._provider[name].apply(this._provider, options).then(function(result) {
                result = wrapToArray(result);

                var mapRefreshed = result[0];
                if(mapRefreshed) {
                    this._triggerReadyAction();
                }
                ///#DEBUG
                if(!mapRefreshed && name !== "clean") {
                    this._triggerUpdateAction();
                }
                ///#ENDDEBUG

                return result[1];
            }.bind(this));
        }.bind(this));

        return this._lastAsyncAction;
    },

    _triggerReadyAction: function() {
        this._createActionByOption("onReady")({ originalMap: this._provider.map() });
    },

    _triggerUpdateAction: function() {
        this._createActionByOption("onUpdated")();
    },

    setOptionSilent: function(name, value) {
        this._setOptionSilent(name, value);
    },

    /**
    * @name dxMapMethods.addmarker
    * @publicName addMarker(markerOptions)
    * @param1 markerOptions:Object|Array<Object>
    * @return Promise<Object>
    */
    addMarker: function(marker) {
        return this._addFunction("markers", marker);
    },

    /**
    * @name dxMapMethods.removemarker
    * @publicName removeMarker(marker)
    * @param1 marker:Object|number|Array<Object>
    * @return Promise<void>
    */
    removeMarker: function(marker) {
        return this._removeFunction("markers", marker);
    },

    /**
    * @name dxMapMethods.addroute
    * @publicName addRoute(routeOptions)
    * @param1 options:object|Array<Object>
    * @return Promise<Object>
    */
    addRoute: function(route) {
        return this._addFunction("routes", route);
    },

    /**
    * @name dxMapMethods.removeroute
    * @publicName removeRoute(route)
    * @param1 route:object|number|Array<Object>
    * @return Promise<void>
    */
    removeRoute: function(route) {
        return this._removeFunction("routes", route);
    },

    _addFunction: function(optionName, addingValue) {
        var optionValue = this.option(optionName),
            addingValues = wrapToArray(addingValue);

        optionValue.push.apply(optionValue, addingValues);

        return this._partialArrayOptionChange(optionName, optionValue, addingValues, []);
    },

    _removeFunction: function(optionName, removingValue) {
        var optionValue = this.option(optionName),
            removingValues = wrapToArray(removingValue);

        each(removingValues, function(removingIndex, removingValue) {
            var index = isNumeric(removingValue)
                ? removingValue
                : inArray(removingValue, optionValue);

            if(index !== -1) {
                var removing = optionValue.splice(index, 1)[0];
                removingValues.splice(removingIndex, 1, removing);
            } else {
                throw errors.log("E1021", inflector.titleize(optionName.substring(0, optionName.length - 1)), removingValue);
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

registerComponent("dxMap", Map);

module.exports = Map;
