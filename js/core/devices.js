var $ = require("../core/renderer"),
    windowUtils = require("./utils/window"),
    navigator = windowUtils.getNavigator(),
    window = windowUtils.getWindow(),
    extend = require("./utils/extend").extend,
    isPlainObject = require("./utils/type").isPlainObject,
    each = require("./utils/iterator").each,
    Class = require("./class"),
    errors = require("./errors"),
    Callbacks = require("./utils/callbacks"),
    resizeCallbacks = require("./utils/resize_callbacks"),
    EventsStrategy = require("./events_strategy").EventsStrategy,
    SessionStorage = require("./utils/storage").sessionStorage,
    viewPort = require("./utils/view_port"),
    Config = require("./config");

var KNOWN_UA_TABLE = {
    "iPhone": "iPhone",
    "iPhone5": "iPhone",
    "iPhone6": "iPhone",
    "iPhone6plus": "iPhone",
    "iPad": "iPad",
    "iPadMini": "iPad Mini",
    "androidPhone": "Android Mobile",
    "androidTablet": "Android",
    "msSurface": "Windows ARM Tablet PC",
    "desktop": "desktop"
};

/**
* @name Device
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/devices
* @export default
*/
var DEFAULT_DEVICE = {
    /**
    * @name Device.deviceType
    * @type string
    * @acceptValues 'phone'|'tablet'|'desktop'
    */
    deviceType: "desktop",
    /**
    * @name Device.platform
    * @type string
    * @acceptValues 'android'|'ios'|'generic'
    */
    platform: "generic",
    /**
    * @name Device.version
    * @type Array<number>
    */
    version: [],
    /**
    * @name Device.phone
    * @type boolean
    */
    phone: false,
    /**
    * @name Device.tablet
    * @type boolean
    */
    tablet: false,
    /**
    * @name Device.android
    * @type boolean
    */
    android: false,
    /**
    * @name Device.ios
    * @type boolean
    */
    ios: false,
    /**
    * @name Device.generic
    * @type boolean
    */
    generic: true,
    /**
    * @name Device.grade
    * @type string
    * @acceptValues 'A'|'B'|'C'
    */
    grade: "A",

    // TODO: For internal use (draft, do not document these options!)
    mac: false
};

var uaParsers = {
    generic: function(userAgent) {
        var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/),
            isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent),
            isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent),
            isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());

        if(!(isPhone || isTablet || isDesktop || isMac)) {
            return;
        }

        return {
            deviceType: isPhone ? "phone" : isTablet ? "tablet" : "desktop",
            platform: "generic",
            version: [],
            grade: "A",
            mac: isMac
        };
    },

    ios: function(userAgent) {
        if(!/ip(hone|od|ad)/i.test(userAgent)) {
            return;
        }

        var isPhone = /ip(hone|od)/i.test(userAgent),
            matches = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/i),
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [],
            isIPhone4 = (window.screen.height === (960 / 2)),
            grade = isIPhone4 ? "B" : "A";

        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "ios",
            version: version,
            grade: grade
        };
    },

    android: function(userAgent) {
        if(!/android|htc_|silk/i.test(userAgent)) {
            return;
        }

        var isPhone = /mobile/i.test(userAgent),
            matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i),
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [],
            worseThan4_4 = version.length > 1 && (version[0] < 4 || version[0] === 4 && version[1] < 4),
            grade = worseThan4_4 ? "B" : "A";

        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "android",
            version: version,
            grade: grade
        };
    }
};

/**
 * @name DevicesObject
 * @publicName devices
 * @section Utils
 * @namespace DevExpress
 * @module core/devices
 * @export default
 */
var Devices = Class.inherit({
    /**
    * @name DevicesObjectevents.orientationChanged
    * @type classEventType
    * @type_function_param1 e:object
    * @type_function_param1_field1 orientation:String
    */
    /**
    * @name DevicesObjectMethods.ctor
    * @publicName ctor(options)
    * @param1 options:object
    * @param1_field1 window:Window
    * @hidden
    */
    ctor: function(options) {
        this._window = options && options.window || window;

        this._realDevice = this._getDevice();
        this._currentDevice = undefined;
        this._currentOrientation = undefined;
        this._eventsStrategy = new EventsStrategy(this);

        this.changed = Callbacks();
        if(windowUtils.hasWindow()) {
            this._recalculateOrientation();
            resizeCallbacks.add(this._recalculateOrientation.bind(this));
        }
    },
    /**
    * @name DevicesObjectmethods.current
    * @publicName current()
    * @return Device
    */
    /**
    * @name DevicesObjectmethods.current
    * @publicName current(deviceName)
    * @param1 deviceName:string|Device
    */
    current: function(deviceOrName) {
        if(deviceOrName) {
            this._currentDevice = this._getDevice(deviceOrName);
            this._forced = true;
            this.changed.fire();

            return;
        }

        if(!this._currentDevice) {
            deviceOrName = undefined;
            try {
                deviceOrName = this._getDeviceOrNameFromWindowScope();
            } catch(e) {
                deviceOrName = this._getDeviceNameFromSessionStorage();
            } finally {
                if(!deviceOrName) {
                    deviceOrName = this._getDeviceNameFromSessionStorage();
                }
                if(deviceOrName) {
                    this._forced = true;
                }
            }
            this._currentDevice = this._getDevice(deviceOrName);
        }

        return this._currentDevice;
    },

    /**
    * @name DevicesObjectMethods.real
    * @publicName real()
    * @return Device
    */
    real: function() {
        ///#DEBUG
        var forceDevice = arguments[0];
        if(isPlainObject(forceDevice)) {
            extend(this._realDevice, forceDevice);
            return;
        }
        ///#ENDDEBUG
        return extend({}, this._realDevice);
    },

    /**
     * @name DevicesObjectMethods.orientation
     * @publicName orientation()
     * @return String
     */
    orientation: function() {
        return this._currentOrientation;
    },

    isForced: function() {
        return this._forced;
    },

    isRippleEmulator: function() {
        return !!this._window.tinyHippos;
    },

    _getCssClasses: function(device) {
        var result = [];
        var realDevice = this._realDevice;

        device = device || this.current();

        // TODO: use real device here?
        if(device.deviceType) {
            result.push("dx-device-" + device.deviceType);
            if(device.deviceType !== "desktop") {
                result.push("dx-device-mobile");
            }
        }

        result.push("dx-device-" + realDevice.platform);

        if(realDevice.version && realDevice.version.length) {
            result.push("dx-device-" + realDevice.platform + "-" + realDevice.version[0]);
        }

        if(devices.isSimulator()) {
            result.push("dx-simulator");
        }

        if(Config().rtlEnabled) {
            result.push("dx-rtl");
        }

        return result;
    },

    attachCssClasses: function(element, device) {
        this._deviceClasses = this._getCssClasses(device).join(" ");
        $(element).addClass(this._deviceClasses);
    },

    detachCssClasses: function(element) {
        $(element).removeClass(this._deviceClasses);
    },

    isSimulator: function() {
        // NOTE: error may happen due to same-origin policy
        try {
            return this._isSimulator || windowUtils.hasWindow() && this._window.top !== this._window.self && this._window.top["dx-force-device"] || this.isRippleEmulator();
        } catch(e) {
            return false;
        }
    },

    forceSimulator: function() {
        this._isSimulator = true;
    },

    _getDevice: function(deviceName) {
        if(deviceName === "genericPhone") {
            deviceName = {
                deviceType: "phone",
                platform: "generic",
                generic: true
            };
        }

        if(isPlainObject(deviceName)) {
            return this._fromConfig(deviceName);
        } else {
            var ua;
            if(deviceName) {
                ua = KNOWN_UA_TABLE[deviceName];
                if(!ua) {
                    throw errors.Error("E0005");
                }
            } else {
                ua = navigator.userAgent;
            }
            return this._fromUA(ua);
        }
    },

    _getDeviceOrNameFromWindowScope: function() {
        var result;

        if(windowUtils.hasWindow() && (this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"])) {
            result = this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"];
        }

        return result;
    },

    _getDeviceNameFromSessionStorage: function() {
        var sessionStorage = SessionStorage();

        if(!sessionStorage) {
            return;
        }

        var deviceOrName = sessionStorage.getItem("dx-force-device");

        try {
            return JSON.parse(deviceOrName);
        } catch(ex) {
            return deviceOrName;
        }
    },

    _fromConfig: function(config) {
        var result = extend({}, DEFAULT_DEVICE, this._currentDevice, config),
            shortcuts = {
                phone: result.deviceType === "phone",
                tablet: result.deviceType === "tablet",
                android: result.platform === "android",
                ios: result.platform === "ios",
                generic: result.platform === "generic"
            };

        return extend(result, shortcuts);
    },

    _fromUA: function(ua) {
        var config;

        each(uaParsers, function(platform, parser) {
            config = parser(ua);
            return !config;
        });

        if(config) {
            return this._fromConfig(config);
        }

        return DEFAULT_DEVICE;
    },

    _changeOrientation: function() {
        var $window = $(this._window),
            orientation = $window.height() > $window.width() ? "portrait" : "landscape";

        if(this._currentOrientation === orientation) {
            return;
        }

        this._currentOrientation = orientation;

        this._eventsStrategy.fireEvent("orientationChanged", [{
            orientation: orientation
        }]);
    },

    _recalculateOrientation: function() {
        var windowWidth = $(this._window).width();

        if(this._currentWidth === windowWidth) {
            return;
        }
        this._currentWidth = windowWidth;

        this._changeOrientation();

    },

    /**
     * @name DevicesObjectMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name DevicesObjectMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     */
    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    /**
     * @name DevicesObjectMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
    /**
     * @name DevicesObjectMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    }
});

var devices = new Devices();

viewPort.changeCallback.add(function(viewPort, prevViewport) {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort);
});

/**
 * @const devices
 * @type DevicesObject
 * @namespace DevExpress
 * @hidden
 */
module.exports = devices;
