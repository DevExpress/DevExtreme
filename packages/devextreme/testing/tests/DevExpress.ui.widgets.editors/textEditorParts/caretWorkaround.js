import browser from 'core/utils/browser';
import caret from 'ui/text_box/utils.caret';

export default function($input) {
    const isDesktopChrome = ('chrome' in window) && ('app' in window.chrome) && ('isInstalled' in window.chrome.app);
    const isChromeEmulatedIOS = isDesktopChrome && browser.safari;
    if(isChromeEmulatedIOS) {
        $input.focus();
        caret($input, 0);
    }
}
