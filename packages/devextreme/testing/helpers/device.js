import devices from '__internal/core/m_devices';

export const isRealDeviceTypeNotIn = (deviceTypes, assert = null, message = null) => {
    const allowedDeviceTypes = Array.isArray(deviceTypes) ? deviceTypes : [deviceTypes];
    if(!allowedDeviceTypes.includes(devices.real().deviceType)) {
        assert && assert.ok(true, message || 'Test should be skipped on devices not in list:  ' + deviceTypes.toString());
        return true;
    }
    return false;
};
