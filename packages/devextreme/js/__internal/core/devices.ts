import Config from '@js/core/config';
import errors from '@js/core/errors';
import { EventsStrategy } from '@js/core/events_strategy';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import resizeCallbacks from '@js/core/utils/resize_callbacks';
import { getHeight, getWidth } from '@js/core/utils/size';
import { sessionStorage as SessionStorage } from '@js/core/utils/storage';
import { isPlainObject } from '@js/core/utils/type';
import { changeCallback, value as viewPort } from '@js/core/utils/view_port';
import { getNavigator, getWindow, hasWindow } from '@js/core/utils/window';
import type { EventHandler, EventHandlers } from '@ts/core/events_strategy';
import { uiLayerInitialized } from '@ts/core/utils/m_common';

export type DeviceType = 'phone' | 'tablet' | 'desktop';

export type DevicePlatform = 'android' | 'ios' | 'generic';

export type DeviceGrade = 'A' | 'B' | 'C';

export type Orientation = 'portrait' | 'landscape';

export interface Device {
  android?: boolean;
  deviceType?: DeviceType;
  generic?: boolean;
  grade?: DeviceGrade;
  ios?: boolean;
  mac?: boolean;
  phone?: boolean;
  platform?: DevicePlatform;
  tablet?: boolean;
  version?: number[];
}

type ResolvedDevice = Required<Device>;

type ForcedDevice = string | Device | null | undefined;

interface ParsedUserAgent {
  deviceType: DeviceType;
  platform: DevicePlatform;
  version: number[];
  grade: DeviceGrade;
  mac?: boolean;
}

type UserAgentParser = (userAgent: string) => ParsedUserAgent | null;

interface SimulatorWindow extends Window {
  readonly top: SimulatorWindow | null;
  'dx-force-device'?: string | Device;
  'dx-force-device-object'?: Device;
  tinyHippos?: unknown;
}

const window = getWindow();

const KNOWN_UA_TABLE: Record<string, string> = {
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

const DEFAULT_DEVICE: ResolvedDevice = {
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

const isDeviceConfig = (value: unknown): value is Device => isPlainObject(value);

const UA_PARSERS = {
  generic(userAgent: string): ParsedUserAgent | null {
    const isPhone = /windows phone/i.test(userAgent) || /WPDesktop/.exec(userAgent);
    const isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
    const isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
    const isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());

    if (!(isPhone || isTablet || isDesktop || isMac)) {
      return null;
    }

    let deviceType: DeviceType = 'desktop';
    if (isPhone) {
      deviceType = 'phone';
    } else if (isTablet) {
      deviceType = 'tablet';
    }

    return {
      deviceType,
      platform: 'generic',
      version: [],
      grade: 'A',
      mac: isMac,
    };
  },

  appleTouchDevice(userAgent: string): ParsedUserAgent | null {
    const navigator = getNavigator();
    const isIpadOs = /Macintosh/i.test(userAgent) && navigator?.maxTouchPoints > 2;
    const isAppleDevice = /ip(hone|od|ad)/i.test(userAgent);

    if (!isAppleDevice && !isIpadOs) {
      return null;
    }

    const isPhone = /ip(hone|od)/i.test(userAgent);
    const matches = /os\s{0,}X? (\d+)_(\d+)_?(\d+)?/i.exec(userAgent);
    const version = matches
      ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || '0', 10)]
      : [];

    const isIPhone4 = window.screen.height === (960 / 2);
    const grade = isIPhone4 ? 'B' : 'A';

    const isDesktopMode = /Macintosh/i.test(userAgent) && !/Mobile/i.test(userAgent);

    let deviceType: DeviceType = 'tablet';
    if (isDesktopMode) {
      deviceType = 'desktop';
    } else if (isPhone) {
      deviceType = 'phone';
    }

    return {
      deviceType,
      platform: 'ios',
      version,
      grade,
    };
  },

  android(userAgent: string): ParsedUserAgent | null {
    // TODO: Check this RegExp.
    //  It looks like there may be missing android user agents.
    const isAndroid = /android|htc_|silk/i.test(userAgent);
    const isWinPhone = /windows phone/i.test(userAgent);

    if (!isAndroid || isWinPhone) {
      return null;
    }

    const isPhone = /mobile/i.test(userAgent);
    const matches = /android (\d+)\.?(\d+)?\.?(\d+)?/i.exec(userAgent);
    const version = matches
      ? [parseInt(matches[1], 10), parseInt(matches[2] || '0', 10), parseInt(matches[3] || '0', 10)]
      : [];
    const worseThanAndroid44 = version.length > 1
      && (version[0] < 4 || (version[0] === 4 && version[1] < 4));
    const grade = worseThanAndroid44 ? 'B' : 'A';

    return {
      deviceType: isPhone ? 'phone' : 'tablet',
      platform: 'android',
      version,
      grade,
    };
  },
};
const UA_PARSERS_ARRAY: UserAgentParser[] = [
  UA_PARSERS.appleTouchDevice,
  UA_PARSERS.android,
  UA_PARSERS.generic,
];

class Devices {
  _window: SimulatorWindow;

  _realDevice: ResolvedDevice;

  _currentDevice: ResolvedDevice | undefined;

  _currentOrientation: Orientation | undefined;

  _eventsStrategy: EventsStrategy;

  changed: Callback;

  _forced?: boolean;

  _deviceClasses!: string;

  _isSimulator?: boolean;

  _currentWidth?: number;

  declare Devices?: typeof Devices;

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

  current(): ResolvedDevice;
  current(deviceOrName: string | Device): void;
  current(deviceOrName?: string | Device): ResolvedDevice | undefined {
    if (deviceOrName) {
      this._currentDevice = this._getDevice(deviceOrName);
      this._forced = true;
      this.changed.fire();

      return undefined;
    }

    if (!this._currentDevice) {
      const forcedDevice = this._getForcedDeviceOrName();
      if (forcedDevice) {
        this._forced = true;
      }
      this._currentDevice = this._getDevice(forcedDevice);
    }

    return this._currentDevice;
  }

  real(): ResolvedDevice;
  real(forceDevice: Device): void;
  real(forceDevice?: Device): ResolvedDevice | undefined {
    /// #DEBUG
    if (isPlainObject(forceDevice)) {
      extend(this._realDevice, forceDevice);
      return undefined;
    }
    /// #ENDDEBUG
    return extend({}, this._realDevice) as ResolvedDevice;
  }

  orientation(): Orientation | undefined {
    return this._currentOrientation;
  }

  isForced(): boolean | undefined {
    return this._forced;
  }

  isRippleEmulator(): boolean {
    return !!this._window.tinyHippos;
  }

  _getCssClasses(device?: Device): string[] {
    const result: string[] = [];
    const realDevice = this._realDevice;
    const currentDevice = device ?? this.current();

    // TODO: use real device here?
    if (currentDevice.deviceType) {
      result.push(`dx-device-${currentDevice.deviceType}`);
      if (currentDevice.deviceType !== 'desktop') {
        result.push('dx-device-mobile');
      }
    }

    result.push(`dx-device-${realDevice.platform}`);

    if (realDevice.version?.length) {
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

  attachCssClasses(element: Element | dxElementWrapper, device?: Device): void {
    this._deviceClasses = this._getCssClasses(device).join(' ');
    $(element).addClass(this._deviceClasses);
  }

  detachCssClasses(element: Element | dxElementWrapper): void {
    $(element).removeClass(this._deviceClasses);
  }

  isSimulator(): boolean {
    // NOTE: error may happen due to same-origin policy
    try {
      return Boolean(
        this._isSimulator
        || (hasWindow() && this._window.top !== this._window.self && this._window.top?.['dx-force-device'])
        || this.isRippleEmulator(),
      );
    } catch (e) {
      return false;
    }
  }

  forceSimulator(): void {
    this._isSimulator = true;
  }

  _getDevice(deviceOrName?: ForcedDevice): ResolvedDevice {
    if (deviceOrName === 'genericPhone') {
      return this._fromConfig({
        deviceType: 'phone',
        platform: 'generic',
        generic: true,
      });
    }

    if (isDeviceConfig(deviceOrName)) {
      return this._fromConfig(deviceOrName);
    }

    if (deviceOrName) {
      const ua = KNOWN_UA_TABLE[deviceOrName];
      if (!ua) {
        throw errors.Error('E0005');
      }
      return this._fromUA(ua);
    }

    return this._fromUA(getNavigator().userAgent);
  }

  _getForcedDeviceOrName(): ForcedDevice {
    try {
      return this._getDeviceOrNameFromWindowScope() || this._getDeviceNameFromSessionStorage();
    } catch (e) {
      return this._getDeviceNameFromSessionStorage();
    }
  }

  _getDeviceOrNameFromWindowScope(): string | Device | undefined {
    if (!hasWindow()) {
      return undefined;
    }

    const { top } = this._window;

    return top?.['dx-force-device-object'] || top?.['dx-force-device'] || undefined;
  }

  _getDeviceNameFromSessionStorage(): ForcedDevice {
    const sessionStorage = SessionStorage();

    if (!sessionStorage) {
      return undefined;
    }

    const deviceOrName = sessionStorage.getItem('dx-force-device');

    if (deviceOrName === null) {
      return null;
    }

    try {
      return JSON.parse(deviceOrName) as string | Device;
    } catch (ex) {
      return deviceOrName;
    }
  }

  _fromConfig(config: Device): ResolvedDevice {
    const result = extend({}, DEFAULT_DEVICE, this._currentDevice, config) as ResolvedDevice;
    const shortcuts = {
      phone: result.deviceType === 'phone',
      tablet: result.deviceType === 'tablet',
      android: result.platform === 'android',
      ios: result.platform === 'ios',
      generic: result.platform === 'generic',
    };

    return extend(result, shortcuts) as ResolvedDevice;
  }

  _fromUA(ua: string): ResolvedDevice {
    for (const parser of UA_PARSERS_ARRAY) {
      const config = parser(ua);

      if (config) {
        return this._fromConfig(config);
      }
    }

    return DEFAULT_DEVICE;
  }

  _changeOrientation(): void {
    const $window = $(this._window);
    const orientation: Orientation = getHeight($window) > getWidth($window) ? 'portrait' : 'landscape';

    if (this._currentOrientation === orientation) {
      return;
    }

    this._currentOrientation = orientation;

    this._eventsStrategy.fireEvent('orientationChanged', [{
      orientation,
    }]);
  }

  _recalculateOrientation(): void {
    const windowWidth = getWidth(this._window);

    if (this._currentWidth === windowWidth) {
      return;
    }
    this._currentWidth = windowWidth;

    this._changeOrientation();
  }

  on(eventName: string | EventHandlers, eventHandler?: EventHandler): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName: string, eventHandler?: EventHandler): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
}

const devices = new Devices();

when(uiLayerInitialized).done(() => {
  const viewPortElement = viewPort();
  if (viewPortElement) {
    devices.attachCssClasses(viewPortElement);
  }

  changeCallback.add((newViewPort, prevViewPort) => {
    devices.detachCssClasses(prevViewPort);
    devices.attachCssClasses(newViewPort);
  });
});

/// #DEBUG
devices.Devices = Devices;
/// #ENDDEBUG

export default devices;
