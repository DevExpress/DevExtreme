import devices from '__internal/core/m_devices';

export const isDesktopDevice = () => {
    return devices.real().deviceType === 'desktop';
};
