import { getHeight, getWidth } from './utils/size';
import $ from '../core/renderer';
import { getWindow, getNavigator, hasWindow } from './utils/window';
import { extend } from './utils/extend';
import { isPlainObject } from './utils/type';
import { each } from './utils/iterator';
import errors from './errors';
import Callbacks from './utils/callbacks';
import readyCallbacks from './utils/ready_callbacks';
import resizeCallbacks from './utils/resize_callbacks';
import { EventsStrategy } from './events_strategy';
import { sessionStorage as SessionStorage } from './utils/storage';
import { changeCallback, value as viewPort } from './utils/view_port';
import Config from './config';

const navigator = getNavigator();
const window = getWindow();

const DEVICE_TYPE = {
    desktop: 'desktop',
    tablet: 'tablet',
    phone: 'phone',
};

const PLATFORM = {
    generic: 'generic',
    ios: 'ios',
    ipad: 'ipad',
    android: 'android',
};

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

const DEFAULT_DEVICE = {
    deviceType: DEVICE_TYPE.desktop,
    platform: PLATFORM.generic,
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
            deviceType: isPhone ? DEVICE_TYPE.phone : isTablet ? DEVICE_TYPE.tablet : DEVICE_TYPE.desktop,
            platform: PLATFORM.generic,
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
            deviceType: isPhone ? DEVICE_TYPE.phone : DEVICE_TYPE.tablet,
            platform: PLATFORM.ios,
            version,
            grade
        };
    },

    ipad(_, navigator) {
        const { maxTouchPoints, platform } = navigator;

        const isIpadOS = (maxTouchPoints > 0 && platform === 'MacIntel') || platform === 'iPad';

        if(!isIpadOS) {
            return;
        }

        return {
            deviceType: DEVICE_TYPE.tablet,
            platform: PLATFORM.ipad,
            grade: 'A',
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
            deviceType: isPhone ? DEVICE_TYPE.phone : DEVICE_TYPE.tablet,
            platform: PLATFORM.android,
            version,
            grade
        };
    }
};

class Devices {
    /**
    * @name DevicesObject.ctor
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
        if(hasWindow()) {
            readyCallbacks.add(this._recalculateOrientation.bind(this));
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
            if(device.deviceType !== DEVICE_TYPE.desktop) {
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
            return this._isSimulator || hasWindow() && this._window.top !== this._window.self && this._window.top['dx-force-device'] || this.isRippleEmulator();
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
                deviceType: DEVICE_TYPE.phone,
                platform: PLATFORM.generic,
                generic: true
            };
        }

        if(isPlainObject(deviceName)) {
            return this._fromConfig(deviceName);
        } else {
            let userAgent;

            if(deviceName) {
                userAgent = KNOWN_UA_TABLE[deviceName];

                if(!userAgent) {
                    throw errors.Error('E0005');
                }
            } else {
                userAgent = navigator.userAgent;
            }

            return this._fromUA(userAgent, navigator);
        }
    }

    _getDeviceOrNameFromWindowScope() {
        let result;

        if(hasWindow() && (this._window.top['dx-force-device-object'] || this._window.top['dx-force-device'])) {
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
            phone: result.deviceType === DEVICE_TYPE.phone,
            tablet: result.deviceType === DEVICE_TYPE.tablet,
            android: result.platform === PLATFORM.android,
            ios: result.platform === PLATFORM.ios,
            generic: result.platform === PLATFORM.generic
        };

        return extend(result, shortcuts);
    }

    _fromUA(userAgent, navigator) {
        let config;

        each(uaParsers, (platform, parser) => {
            config = parser(userAgent, navigator);

            return !config;
        });

        if(config) {
            return this._fromConfig(config);
        }

        return DEFAULT_DEVICE;
    }

    _changeOrientation() {
        const $window = $(this._window);
        const orientation = getHeight($window) > getWidth($window) ? 'portrait' : 'landscape';

        if(this._currentOrientation === orientation) {
            return;
        }

        this._currentOrientation = orientation;

        this._eventsStrategy.fireEvent('orientationChanged', [{
            orientation: orientation
        }]);
    }

    _recalculateOrientation() {
        const windowWidth = getWidth(this._window);

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

const viewPortElement = viewPort();
if(viewPortElement) {
    devices.attachCssClasses(viewPortElement);
}

changeCallback.add((viewPort, prevViewport) => {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort);
});

///#DEBUG
devices.Devices = Devices;
///#ENDDEBUG

export default devices;
