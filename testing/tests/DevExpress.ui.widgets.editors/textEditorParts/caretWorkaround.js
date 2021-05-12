import browser from 'core/utils/browser';
import caret from 'ui/text_box/utils.caret';

export default function($input) {
    // NOTE: We decided to return to this problem when next Edge is released
    // Edge sets the caret to the end of the mask editor when iframe is used and focus is triggered by the focus() method

    const isDesktopChrome = ('chrome' in window) && ('app' in window.chrome) && ('isInstalled' in window.chrome.app);
    const isChromeEmulatedIOS = isDesktopChrome && browser.safari;
    if(isChromeEmulatedIOS) {
        $input.focus();
        caret($input, 0);
    }
}
