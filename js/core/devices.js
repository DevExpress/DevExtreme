"use strict";

var $ = require("../core/renderer"),
    extend = require("./utils/extend").extend,
    isPlainObject = require("./utils/type").isPlainObject,
    each = require("./utils/iterator").each,
    Class = require("./class"),
    errors = require("./errors"),
    themes = require("../ui/themes"),
    themeReadyCallback = require("../ui/themes_callback"),
    ready = require("./utils/ready"),
    resizeCallbacks = require("./utils/window").resizeCallbacks,
    EventsMixin = require("./events_mixin"),
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
    "win8": "MSAppHost",
    "win8Phone": "Windows Phone 8.0",
    "msSurface": "Windows ARM Tablet PC",
    "desktop": "desktop",
    "win10Phone": "Windows Phone 10.0",
    "win10": "MSAppHost/3.0"
};

/**
* @name device
* @section commonObjectStructures
* @publicName Device
* @type object
* @namespace DevExpress
* @module core/devices
* @export default
*/
var DEFAULT_DEVICE = {
    /**
    * @name device_devicetype
    * @publicName deviceType
    * @type string
    * @acceptValues 'phone'|'tablet'|'desktop'
    */
    deviceType: "desktop",
    /**
    * @name device_platform
    * @publicName platform
    * @type string
    * @acceptValues 'android'|'ios'|'win'|'generic'
    */
    platform: "generic",
    /**
    * @name device_version
    * @publicName version
    * @type Array<number>
    */
    version: [],
    /**
    * @name device_phone
    * @publicName phone
    * @type boolean
    */
    phone: false,
    /**
    * @name device_tablet
    * @publicName tablet
    * @type boolean
    */
    tablet: false,
    /**
    * @name device_android
    * @publicName android
    * @type boolean
    */
    android: false,
     /**
    * @name device_ios
    * @publicName ios
    * @type boolean
    */
    ios: false,
    /**
    * @name device_win
    * @publicName win
    * @type boolean
    */
    win: false,
    /**
    * @name device_generic
    * @publicName generic
    * @type boolean
    */
    generic: true,
    /**
    * @name device_grade
    * @publicName grade
    * @type string
    * @acceptValues 'A'|'B'|'C'
    */
    grade: "A",

    // TODO: For internal use (draft, do not document these options!)
    mac: false
};

var uaParsers = {
    win: function(userAgent) {
        var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/),
            isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent),
            isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);

        if(!(isPhone || isTablet || isDesktop)) {
            return;
        }

        var matches = userAgent.match(/windows phone (\d+).(\d+)/i) || userAgent.match(/windows nt (\d+).(\d+)/i),
            version = [];

        if(matches) {
            version.push(parseInt(matches[1], 10), parseInt(matches[2], 10));
        } else {
            matches = userAgent.match(/msapphost(\/(\d+).(\d+))?/i);
            matches && version.push(parseInt(matches[2], 10) === 3 ? 10 : 8);
        }

        return {
            deviceType: isPhone ? "phone" : isTablet ? "tablet" : "desktop",
            platform: "win",
            version: version,
            grade: "A"
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
            matches = userAgent.match(/android (\d+)\.(\d+)\.?(\d+)?/i),
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [],
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
 * @name devices
 * @section Utils
 * @publicName devices
 * @inherits EventsMixin
 */
var Devices = Class.inherit({
    /**
    * @name devicesevents_orientationChanged
    * @publicName orientationChanged
    * @type classEventType
    * @type_function_param1 e:object
    * @type_function_param1_field1 orientation:String
    */
    /**
    * @name DevicesMethods_ctor
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

        themes.init({
            theme: themeNameFromDevice(this.current()),
            _autoInit: true,
            loadCallback: function() {
                themeReadyCallback.fire();
            }
        });
        ready(themes.checkThemeLinks);

        this._recalculateOrientation();
        resizeCallbacks.add(this._recalculateOrientation.bind(this));
    },
    /**
    * @name devicesmethods_current
    * @publicName current()
    * @return Device
    */
    /**
    * @name devicesmethods_current
    * @publicName current(deviceName)
    * @param1 deviceName:string|Device
    */
    current: function(deviceOrName) {
        if(deviceOrName) {
            this._currentDevice = this._getDevice(deviceOrName);
            this._forced = true;
            themes.init({ theme: themeNameFromDevice(this.current()), _autoInit: true });

            if(this._currentDevice.platform === "win" && this._currentDevice.version[0] === 8) {
                errors.log("W0010", "the 'win8' theme", "16.1", "Use the 'win10' theme instead.");
            }

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
    * @name devicesmethods_real
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
     * @name devicesmethods_orientation
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
            return this._isSimulator || this._window.top !== this._window.self && this._window.top["dx-force-device"] || this.isRippleEmulator();
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

        if(this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"]) {
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
                win: result.platform === "win",
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

        var isMac = /(mac os)/.test(ua.toLowerCase()),
            deviceWithOS = DEFAULT_DEVICE;

        deviceWithOS.mac = isMac;

        return deviceWithOS;
    },

    _changeOrientation: function() {
        var $window = $(this._window),
            orientation = $window.height() > $window.width() ? "portrait" : "landscape";

        if(this._currentOrientation === orientation) {
            return;
        }

        this._currentOrientation = orientation;

        this.fireEvent("orientationChanged", [{
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

    }
}).include(EventsMixin);

var devices = new Devices();

viewPort.changeCallback.add(function(viewPort, prevViewport) {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort);
});

// TODO: remove with win8 theme
if(!devices.isForced() && devices.current().platform === "win") {
    devices.current({ version: [10] });
}

function themeNameFromDevice(device) {
    var themeName = device.platform;
    var majorVersion = device.version && device.version[0];

    switch(themeName) {
        case "ios":
            themeName += "7";
            break;
        case "android":
            themeName += "5";
            break;
        case "win":
            themeName += (majorVersion && majorVersion === 8) ? "8" : "10";
            break;
    }

    return themeName;
}

module.exports = devices;
module.exports.themeNameFromDevice = themeNameFromDevice;
