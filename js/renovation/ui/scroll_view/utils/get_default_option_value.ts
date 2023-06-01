import devices from '../../../../core/devices';
import { nativeScrolling } from '../../../../core/utils/support';
import browser from '../../../../core/utils/browser';

export function isDesktop(): boolean {
  return !devices.isSimulator()
    && devices.real().deviceType === 'desktop'
    && devices.current().platform === 'generic';
}

export function getDefaultUseSimulatedScrollbar(): boolean {
  return !!nativeScrolling
  && devices.real().platform === 'android'
  && !browser.mozilla;
}

export function getDefaultBounceEnabled(): boolean {
  return !isDesktop();
}

export function getDefaultUseNative(): boolean {
  return !!nativeScrolling;
}

export function getDefaultNativeRefreshStrategy(): 'swipeDown' | 'pullDown' {
  return devices.real().platform === 'android' ? 'swipeDown' : 'pullDown';
}
