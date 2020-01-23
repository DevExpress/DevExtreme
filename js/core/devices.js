import $ from '../core/renderer';
import windowUtils from './utils/window';
import { extend } from './utils/extend';
import { isPlainObject } from './utils/type';
import { each } from './utils/iterator';
import errors from './errors';
import Callbacks from './utils/callbacks';
import resizeCallbacks from './utils/resize_callbacks';
import { EventsStrategy } from './events_strategy';
import { sessionStorage as SessionStorage } from './utils/storage';
import viewPort from './utils/view_port';
import Config from './config';

const navigator = windowUtils.getNavigator();
const window = windowUtils.getWindow();

const KNOWN_UA_TABLE = {
    'iPhone': 'iPhone',
    'iPhone5': 'iPhone',
    'iPhone6': 'iPhone',
    'iPhone6plus': 'iPhone',
    'iPad': 'iPad',
    'iPadMini': 'iPad Mini',
    'androidPhone': 'Android Mobile',
    'androidTablet': 'Android',
    'msSurface': 'Windows ARM Tablet PC',
    'desktop': 'desktop'
};

/**
* @name Device
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/devices
* @export default
*/
const DEFAULT_DEVICE = {
    deviceType: 'desktop',
    platform: 'generic',
    version: [],
    phone: false,
    tablet: false,
    android: false,
    ios: false,
    generic: true,
    grade: 'A',

    // TODO: For internal use (draft, do not document these options!)
    mac: false
};

const uaParsers = {
    generic(userAgent) {
        const isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/);
        const isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
        const isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
        const isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());

        if(!(isPhone || isTablet || isDesktop || isMac)) {
            return;
        }

        return {
            deviceType: isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop',
            platform: 'generic',
            version: [],
            grade: 'A',
            mac: isMac
        };
    },

    ios(userAgent) {
        if(!/ip(hone|od|ad)/i.test(userAgent)) {
            return;
        }

        const isPhone = /ip(hone|od)/i.test(userAgent);
        const matches = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/i);
        const version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
        const isIPhone4 = (window.screen.height === (960 / 2));
        const grade = isIPhone4 ? 'B' : 'A';

        return {
            deviceType: isPhone ? 'phone' : 'tablet',
            platform: 'ios',
            version,
            grade
        };
    },

    android(userAgent) {
        if(!/android|htc_|silk/i.test(userAgent)) {
            return;
        }

        const isPhone = /mobile/i.test(userAgent);
        const matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i);
        const version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [];
        const worseThan4_4 = version.length > 1 && (version[0] < 4 || version[0] === 4 && version[1] < 4);
        const grade = worseThan4_4 ? 'B' : 'A';

        return {
            deviceType: isPhone ? 'phone' : 'tablet',
            platform: 'android',
            version,
            grade
        };
    }
};

class Devices {
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
    constructor(options) {
        this._window = options?.window || window;

        this._realDevice = this._getDevice();
        this._currentDevice = undefined;
        this._currentOrientation = undefined;
        this._eventsStrategy = new EventsStrategy(this);

        this.changed = Callbacks();
        if(windowUtils.hasWindow()) {
            this._recalculateOrientation();
            resizeCallbacks.add(this._recalculateOrientation.bind(this));
        }
    }

    current(deviceOrName) {
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
    }

    real(forceDevice) {
        ///#DEBUG
        if(isPlainObject(forceDevice)) {
            extend(this._realDevice, forceDevice);
            return;
        }
        ///#ENDDEBUG
        return extend({}, this._realDevice);
    }

    orientation() {
        return this._currentOrientation;
    }

    isForced() {
        return this._forced;
    }

    isRippleEmulator() {
        return !!this._window.tinyHippos;
    }

    _getCssClasses(device) {
        const result = [];
        const realDevice = this._realDevice;

        device = device || this.current();

        // TODO: use real device here?
        if(device.deviceType) {
            result.push(`dx-device-${device.deviceType}`);
            if(device.deviceType !== 'desktop') {
                result.push('dx-device-mobile');
            }
        }

        result.push(`dx-device-${realDevice.platform}`);

        if(realDevice.version && realDevice.version.length) {
            result.push(`dx-device-${realDevice.platform}-${realDevice.version[0]}`);
        }

        if(this.isSimulator()) {
            result.push('dx-simulator');
        }

        if(Config().rtlEnabled) {
            result.push('dx-rtl');
        }

        return result;
    }

    attachCssClasses(element, device) {
        this._deviceClasses = this._getCssClasses(device).join(' ');
        $(element).addClass(this._deviceClasses);
    }

    detachCssClasses(element) {
        $(element).removeClass(this._deviceClasses);
    }

    isSimulator() {
        // NOTE: error may happen due to same-origin policy
        try {
            return this._isSimulator || windowUtils.hasWindow() && this._window.top !== this._window.self && this._window.top['dx-force-device'] || this.isRippleEmulator();
        } catch(e) {
            return false;
        }
    }

    forceSimulator() {
        this._isSimulator = true;
    }

    _getDevice(deviceName) {
        if(deviceName === 'genericPhone') {
            deviceName = {
                deviceType: 'phone',
                platform: 'generic',
                generic: true
            };
        }

        if(isPlainObject(deviceName)) {
            return this._fromConfig(deviceName);
        } else {
            let ua;
            if(deviceName) {
                ua = KNOWN_UA_TABLE[deviceName];
                if(!ua) {
                    throw errors.Error('E0005');
                }
            } else {
                ua = navigator.userAgent;
            }
            return this._fromUA(ua);
        }
    }

    _getDeviceOrNameFromWindowScope() {
        let result;

        if(windowUtils.hasWindow() && (this._window.top['dx-force-device-object'] || this._window.top['dx-force-device'])) {
            result = this._window.top['dx-force-device-object'] || this._window.top['dx-force-device'];
        }

        return result;
    }

    _getDeviceNameFromSessionStorage() {
        const sessionStorage = SessionStorage();

        if(!sessionStorage) {
            return;
        }

        const deviceOrName = sessionStorage.getItem('dx-force-device');

        try {
            return JSON.parse(deviceOrName);
        } catch(ex) {
            return deviceOrName;
        }
    }

    _fromConfig(config) {
        const result = extend({}, DEFAULT_DEVICE, this._currentDevice, config);
        const shortcuts = {
            phone: result.deviceType === 'phone',
            tablet: result.deviceType === 'tablet',
            android: result.platform === 'android',
            ios: result.platform === 'ios',
            generic: result.platform === 'generic'
        };

        return extend(result, shortcuts);
    }

    _fromUA(ua) {
        let config;

        each(uaParsers, (platform, parser) => {
            config = parser(ua);
            return !config;
        });

        if(config) {
            return this._fromConfig(config);
        }

        return DEFAULT_DEVICE;
    }

    _changeOrientation() {
        const $window = $(this._window);
        const orientation = $window.height() > $window.width() ? 'portrait' : 'landscape';

        if(this._currentOrientation === orientation) {
            return;
        }

        this._currentOrientation = orientation;

        this._eventsStrategy.fireEvent('orientationChanged', [{
            orientation: orientation
        }]);
    }

    _recalculateOrientation() {
        const windowWidth = $(this._window).width();

        if(this._currentWidth === windowWidth) {
            return;
        }
        this._currentWidth = windowWidth;

        this._changeOrientation();

    }

    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    }

    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    }
}

const devices = new Devices();

viewPort.changeCallback.add((viewPort, prevViewport) => {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort);
});

module.exports = devices;
