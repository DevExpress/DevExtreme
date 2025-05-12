import devices from '__internal/core/m_devices';

export const shouldSkipOnDevice = ({
    allowedDevices = [],
    assert = null,
    message = null
} = {}) => {
    if(!Array.isArray(allowedDevices)) {
        throw new Error('deviceTypes should be an array');
    }
    if(!allowedDevices.includes(devices.real().deviceType)) {
        assert && assert.ok(true, message || 'Test should be skipped on devices not in list:  ' + allowedDevices.toString());
        return true;
    }
    return false;
};
