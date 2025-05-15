import devices from '__internal/core/m_devices';

export const shouldSkipOnDevices = ({
    deviceTypes = [],
    assert = null,
    message = null
} = {}) => {
    if(!Array.isArray(deviceTypes)) {
        throw new Error('deviceTypes should be an array');
    }
    if(deviceTypes.includes(devices.real().deviceType)) {
        assert && assert.ok(true, message || `Test skipped on devices:  ${deviceTypes.toString()}`);
        return true;
    }
    return false;
};

export const shouldSkipOnDesktop = (assert = null, message = null) => shouldSkipOnDevices({
    deviceTypes: ['desktop'],
    assert,
    message,
});

export const shouldSkipOnPhone = (assert = null, message = null) => shouldSkipOnDevices({
    deviceTypes: ['phone'],
    assert,
    message,
});

export const shouldSkipOnMobile = (assert = null, message = null) => shouldSkipOnDevices({
    deviceTypes: ['phone', 'tablet'],
    assert,
    message,
});
