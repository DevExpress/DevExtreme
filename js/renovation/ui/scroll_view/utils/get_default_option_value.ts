import devices from '../../../../core/devices';
import { nativeScrolling } from '../../../../core/utils/support';

export function isDesktop(): boolean {
  return !devices.isSimulator()
    && devices.real().deviceType === 'desktop'
    && devices.current().platform === 'generic';
}

export function getDefaultBounceEnabled(): boolean {
  return !isDesktop();
}

export function getDefaultUseNative(): boolean {
  return !!nativeScrolling;
}
