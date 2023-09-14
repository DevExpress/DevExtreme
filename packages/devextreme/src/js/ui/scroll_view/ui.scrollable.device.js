import devices from '../../core/devices';
import { nativeScrolling, touch } from '../../core/utils/support';

export const deviceDependentOptions = function() {
    return [{
        device: function() {
            return !nativeScrolling;
        },
        options: {
            useNative: false
        }
    }, {
        device: function(device) {
            return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
            bounceEnabled: false,

            scrollByThumb: true,

            scrollByContent: touch,

            showScrollbar: 'onHover'
        }
    }];
};
