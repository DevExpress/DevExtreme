import devices from '__internal/core/m_devices';

export const shouldSkipTestForDevice = (allowedDeviceTypes, assert = null, message = null) => {
    if(!Array.isArray(allowedDeviceTypes)) {
        throw new Error('deviceTypes should be an array');
    }
    if(!allowedDeviceTypes.includes(devices.real().deviceType)) {
        assert && assert.ok(true, message || 'Test should be skipped on devices not in list:  ' + allowedDeviceTypes.toString());
        return true;
    }
    return false;
};
