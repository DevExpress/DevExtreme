import Config from '@js/core/config';
import errors from '@js/core/errors';
import { EventsStrategy } from '@js/core/events_strategy';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import resizeCallbacks from '@js/core/utils/resize_callbacks';
import { getHeight, getWidth } from '@js/core/utils/size';
import { sessionStorage as SessionStorage } from '@js/core/utils/storage';
import { isPlainObject } from '@js/core/utils/type';
import { changeCallback, value as viewPort } from '@js/core/utils/view_port';
import { getNavigator, getWindow, hasWindow } from '@js/core/utils/window';

export interface Device {
  android?: boolean;
  deviceType?: 'phone' | 'tablet' | 'desktop';
  generic?: boolean;
  grade?: 'A' | 'B' | 'C';
  ios?: boolean;
  phone?: boolean;
  platform?: 'android' | 'ios' | 'generic';
  tablet?: boolean;
  version?: number[];
}

const window = getWindow();

const KNOWN_UA_TABLE = {
  iPhone: 'iPhone',
  iPhone5: 'iPhone',
  iPhone6: 'iPhone',
  iPhone6plus: 'iPhone',
  iPad: 'iPad',
  iPadMini: 'iPad Mini',
  androidPhone: 'Android Mobile',
  androidTablet: 'Android',
  msSurface: 'Windows ARM Tablet PC',
  desktop: 'desktop',
};

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
  mac: false,
};

const UA_PARSERS = {
  generic(userAgent) {
    const isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/);
    const isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
    const isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
    const isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());

    if (!(isPhone || isTablet || isDesktop || isMac)) {
      return null;
    }

    return {
      deviceType: isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop',
      platform: 'generic',
      version: [],
      grade: 'A',
      mac: isMac,
    };
  },

  appleTouchDevice(userAgent) {
    const navigator = getNavigator();
    const isIpadOs = /Macintosh/i.test(userAgent) && navigator?.maxTouchPoints > 2;
    const isAppleDevice = /ip(hone|od|ad)/i.test(userAgent);

    if (!isAppleDevice && !isIpadOs) {
      return null;
    }

    const isPhone = /ip(hone|od)/i.test(userAgent);
    const matches = userAgent.match(/os\s{0,}X? (\d+)_(\d+)_?(\d+)?/i);
    const version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
    const isIPhone4 = window.screen.height === (960 / 2);
    const grade = isIPhone4 ? 'B' : 'A';

    return {
      deviceType: isPhone ? 'phone' : 'tablet',
      platform: 'ios',
      version,
      grade,
    };
  },

  android(userAgent) {
    // TODO: Check this RegExp.
    //  It looks like there may be missing android user agents.
    const isAndroid = /android|htc_|silk/i.test(userAgent);
    const isWinPhone = /windows phone/i.test(userAgent);

    if (!isAndroid || isWinPhone) {
      return null;
    }

    const isPhone = /mobile/i.test(userAgent);
    const matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i);
    const version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const worseThan4_4 = version.length > 1 && (version[0] < 4 || version[0] === 4 && version[1] < 4);
    const grade = worseThan4_4 ? 'B' : 'A';

    return {
      deviceType: isPhone ? 'phone' : 'tablet',
      platform: 'android',
      version,
      grade,
    };
  },
};
const UA_PARSERS_ARRAY = [
  UA_PARSERS.appleTouchDevice,
  UA_PARSERS.android,
  UA_PARSERS.generic,
];

class Devices {
  _window: Window;

  _realDevice: any;

  _currentDevice: any;

  _currentOrientation: any;

  _eventsStrategy: EventsStrategy;

  changed: Callback;

  _forced?: boolean;

  _deviceClasses?: string;

  _isSimulator: any;

  _currentWidth: any;

  /**
    * @name DevicesObject.ctor
    * @publicName ctor(options)
    * @param1 options:object
    * @param1_field1 window:Window
    * @hidden
    */
  constructor(options?: { window?: Window }) {
    this._window = options?.window ?? window;

    this._realDevice = this._getDevice();
    this._currentDevice = undefined;
    this._currentOrientation = undefined;
    this._eventsStrategy = new EventsStrategy(this);

    this.changed = Callbacks();
    if (hasWindow()) {
      readyCallbacks.add(this._recalculateOrientation.bind(this));
      resizeCallbacks.add(this._recalculateOrientation.bind(this));
    }
  }

  current(deviceOrName?: string | Device) {
    if (deviceOrName) {
      this._currentDevice = this._getDevice(deviceOrName);
      this._forced = true;
      this.changed.fire();

      return;
    }

    if (!this._currentDevice) {
      deviceOrName = undefined;
      try {
        deviceOrName = this._getDeviceOrNameFromWindowScope();
      } catch (e) {
        deviceOrName = this._getDeviceNameFromSessionStorage();
      } finally {
        if (!deviceOrName) {
          deviceOrName = this._getDeviceNameFromSessionStorage();
        }
        if (deviceOrName) {
          this._forced = true;
        }
      }
      this._currentDevice = this._getDevice(deviceOrName);
    }

    return this._currentDevice;
  }

  real(forceDevice?) {
    /// #DEBUG
    if (isPlainObject(forceDevice)) {
      extend(this._realDevice, forceDevice);
      return;
    }
    /// #ENDDEBUG
    return extend({}, this._realDevice);
  }

  orientation() {
    return this._currentOrientation;
  }

  isForced() {
    return this._forced;
  }

  isRippleEmulator() {
    // @ts-expect-error
    return !!this._window.tinyHippos;
  }

  _getCssClasses(device) {
    const result: any[] = [];
    const realDevice = this._realDevice;

    device = device || this.current();

    // TODO: use real device here?
    if (device.deviceType) {
      result.push(`dx-device-${device.deviceType}`);
      if (device.deviceType !== 'desktop') {
        result.push('dx-device-mobile');
      }
    }

    result.push(`dx-device-${realDevice.platform}`);

    if (realDevice.version && realDevice.version.length) {
      result.push(`dx-device-${realDevice.platform}-${realDevice.version[0]}`);
    }

    if (this.isSimulator()) {
      result.push('dx-simulator');
    }

    if (Config().rtlEnabled) {
      result.push('dx-rtl');
    }

    return result;
  }

  attachCssClasses(element, device?) {
    this._deviceClasses = this._getCssClasses(device).join(' ');
    $(element).addClass(this._deviceClasses);
  }

  detachCssClasses(element) {
    $(element).removeClass(this._deviceClasses!);
  }

  isSimulator() {
    // NOTE: error may happen due to same-origin policy
    try {
      return this._isSimulator || hasWindow() && this._window.top !== this._window.self && this._window.top?.['dx-force-device'] || this.isRippleEmulator();
    } catch (e) {
      return false;
    }
  }

  forceSimulator() {
    this._isSimulator = true;
  }

  _getDevice(deviceName?) {
    if (deviceName === 'genericPhone') {
      deviceName = {
        deviceType: 'phone',
        platform: 'generic',
        generic: true,
      };
    }

    if (isPlainObject(deviceName)) {
      return this._fromConfig(deviceName);
    }
    let ua;
    if (deviceName) {
      ua = KNOWN_UA_TABLE[deviceName];
      if (!ua) {
        throw errors.Error('E0005');
      }
    } else {
      const navigator = getNavigator();
      ua = navigator.userAgent;
    }
    return this._fromUA(ua);
  }

  _getDeviceOrNameFromWindowScope() {
    let result;

    if (hasWindow() && (this._window.top?.['dx-force-device-object'] || this._window.top?.['dx-force-device'])) {
      result = this._window.top?.['dx-force-device-object'] || this._window.top?.['dx-force-device'];
    }

    return result;
  }

  _getDeviceNameFromSessionStorage() {
    const sessionStorage = SessionStorage();

    if (!sessionStorage) {
      return;
    }

    const deviceOrName = sessionStorage.getItem('dx-force-device');

    try {
      return JSON.parse(deviceOrName);
    } catch (ex) {
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
      generic: result.platform === 'generic',
    };

    return extend(result, shortcuts);
  }

  _fromUA(ua) {
    for (let idx = 0; idx < UA_PARSERS_ARRAY.length; idx += 1) {
      const parser = UA_PARSERS_ARRAY[idx];
      const config = parser(ua);

      if (config) {
        return this._fromConfig(config);
      }
    }

    return DEFAULT_DEVICE;
  }

  _changeOrientation() {
    // @ts-expect-error
    const $window = $(this._window);
    const orientation = getHeight($window) > getWidth($window) ? 'portrait' : 'landscape';

    if (this._currentOrientation === orientation) {
      return;
    }

    this._currentOrientation = orientation;

    this._eventsStrategy.fireEvent('orientationChanged', [{
      orientation,
    }]);
  }

  _recalculateOrientation() {
    const windowWidth = getWidth(this._window);

    if (this._currentWidth === windowWidth) {
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
if (viewPortElement) {
  devices.attachCssClasses(viewPortElement);
}

changeCallback.add((viewPort, prevViewport) => {
  devices.detachCssClasses(prevViewport);
  devices.attachCssClasses(viewPort);
});

/// #DEBUG
// @ts-expect-error
devices.Devices = Devices;
/// #ENDDEBUG

export default devices;
