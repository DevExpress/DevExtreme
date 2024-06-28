import browser from 'core/utils/browser';
import caret from '__internal/ui/text_box/m_utils.caret';

export default function($input) {
    const isDesktopChrome = ('chrome' in window) && ('app' in window.chrome) && ('isInstalled' in window.chrome.app);
    const isChromeEmulatedIOS = isDesktopChrome && browser.safari;
    if(isChromeEmulatedIOS) {
        $input.focus();
        caret($input, 0);
    }
}
