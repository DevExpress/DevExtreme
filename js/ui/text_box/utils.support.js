import domAdapter from '../../core/dom_adapter';
import devices from '../../core/devices';
import browser from '../../core/utils/browser';

// Must become obsolete after the fix https://bugs.chromium.org/p/chromium/issues/detail?id=947408
function isModernAndroidDevice() {
    const { android, version } = devices.real();
    return android && version[0] > 4;
}

export function isInputEventsL2Supported() {
    // after the fix https://bugs.chromium.org/p/chromium/issues/detail?id=947408 chrome supports input events l2
    return ('onbeforeinput' in domAdapter.createElement('input') && !browser.chrome) || isModernAndroidDevice();
}
