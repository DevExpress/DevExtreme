import devices from 'core/devices';

export const getEmulatorStyles = () => {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    if('chrome' in window && devices.real().deviceType !== 'desktop') {
        return 'input[type=date] { padding: 1px 0; }';
    }

    return '';
};
