import devices from '@js/core/devices';
import { nativeScrolling, touch } from '@js/core/utils/support';

export const deviceDependentOptions = function () {
  return [{
    device() {
      return !nativeScrolling;
    },
    options: {
      useNative: false,
    },
  }, {
    device(device) {
      return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,

      scrollByThumb: true,

      scrollByContent: touch,

      showScrollbar: 'onHover',
    },
  }];
};
