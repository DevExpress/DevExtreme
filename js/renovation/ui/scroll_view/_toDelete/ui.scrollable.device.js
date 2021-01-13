import devices from '../../core/devices';
import { touch } from '../../core/utils/support';

export const deviceDependentOptions = function() {
    return [{
        device: function(device) {
            return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
            bounceEnabled: false,

            scrollByContent: touch,
        }
    }];
};
