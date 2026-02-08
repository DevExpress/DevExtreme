import type { Device } from '@js/core/devices';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import supportUtils from '@ts/core/utils/m_support';
import type { ScrollableProperties } from '@ts/ui/scroll_view/scrollable';

type DeviceDependentOptions = Pick<ScrollableProperties, 'useNative' | 'bounceEnabled' | 'scrollByThumb' | 'scrollByContent' | 'showScrollbar'>;

export const deviceDependentOptions = function deviceDependentOptions():
DefaultOptionsRule<DeviceDependentOptions>[] {
  return [{
    device(): boolean {
      return !supportUtils.nativeScrolling;
    },
    options: {
      useNative: false,
    },
  }, {
    device(device: Device): boolean {
      return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: supportUtils.touch,
      showScrollbar: 'onHover',
    },
  }];
};
