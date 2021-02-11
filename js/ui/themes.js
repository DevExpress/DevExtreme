import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import Promise from '../core/polyfills/promise';
import $ from '../core/renderer';
import { Deferred } from '../core/utils/deferred';
import { parseHTML } from '../core/utils/html_parser';
import { each } from '../core/utils/iterator';
import readyCallbacks from '../core/utils/ready_callbacks';
import { value as viewPortValue, changeCallback, originalViewPort } from '../core/utils/view_port';
import { getWindow, hasWindow } from '../core/utils/window';
import { themeReadyCallback } from './themes_callback';
import errors from './widget/ui.errors';
const window = getWindow();
const ready = readyCallbacks.add;
const viewPort = viewPortValue;
const viewPortChanged = changeCallback;
let initDeferred = new Deferred();

const DX_LINK_SELECTOR = 'link[rel=dx-theme]';
const THEME_ATTR = 'data-theme';
const ACTIVE_ATTR = 'data-active';
const DX_HAIRLINES_CLASS = 'dx-hairlines';
const ANY_THEME = 'any';

let context;
let $activeThemeLink;
let knownThemes;
let currentThemeName;
let pendingThemeName;
let defaultTimeout = 15000;

const THEME_MARKER_PREFIX = 'dx.';

function readThemeMarker() {
    if(!hasWindow()) {
        return null;
    }
    const element = $('<div>', context).addClass('dx-theme-marker').appendTo(context.documentElement);
    let result;

    try {
        result = element.css('fontFamily');
        if(!result) {
            return null;
        }

        result = result.replace(/["']/g, '');
        if(result.substr(0, THEME_MARKER_PREFIX.length) !== THEME_MARKER_PREFIX) {
            return null;
        }
        return result.substr(THEME_MARKER_PREFIX.length);
    } finally {
        element.remove();
    }
}

// FYI
// http://stackoverflow.com/q/2635814
// http://stackoverflow.com/a/3078636
function waitForThemeLoad(themeName) {
    let waitStartTime;
    let timerId;
    let intervalCleared = true;

    pendingThemeName = themeName;

    function handleLoaded() {
        pendingThemeName = null;
        clearInterval(timerId);
        intervalCleared = true;

        themeReadyCallback.fire();
        themeReadyCallback.empty();

        initDeferred.resolve();
    }

    if(isPendingThemeLoaded() || !defaultTimeout) {
        handleLoaded();
    } else {

        if(!intervalCleared) {
            if(pendingThemeName) {
                pendingThemeName = themeName;
            }
            return;
        }
        waitStartTime = Date.now();

        intervalCleared = false;
        timerId = setInterval(function() {
            const isLoaded = isPendingThemeLoaded();
            const isTimeout = !isLoaded && Date.now() - waitStartTime > defaultTimeout;

            if(isTimeout) {
                errors.log('W0004', pendingThemeName);
            }

            if(isLoaded || isTimeout) {
                handleLoaded();
            }
        }, 10);
    }
}

function isPendingThemeLoaded() {
    if(!pendingThemeName) {
        return true;
    }

    const anyThemePending = pendingThemeName === ANY_THEME;

    if(initDeferred.state() === 'resolved' && anyThemePending) {
        return true;
    }

    const themeMarker = readThemeMarker();

    if(themeMarker && anyThemePending) {
        return true;
    }

    return themeMarker === pendingThemeName;
}

function processMarkup() {
    const $allThemeLinks = $(DX_LINK_SELECTOR, context);
    if(!$allThemeLinks.length) {
        return;
    }

    knownThemes = {};
    $activeThemeLink = $(parseHTML('<link rel=stylesheet>'), context);

    $allThemeLinks.each(function() {
        const link = $(this, context);
        const fullThemeName = link.attr(THEME_ATTR);
        const url = link.attr('href');
        const isActive = link.attr(ACTIVE_ATTR) === 'true';

        knownThemes[fullThemeName] = {
            url: url,
            isActive: isActive
        };
    });

    $allThemeLinks.last().after($activeThemeLink);
    $allThemeLinks.remove();
}

function resolveFullThemeName(desiredThemeName) {

    const desiredThemeParts = desiredThemeName ? desiredThemeName.split('.') : [];
    let result = null;

    if(knownThemes) {
        if(desiredThemeName in knownThemes) {
            return desiredThemeName;
        }

        each(knownThemes, function(knownThemeName, themeData) {
            const knownThemeParts = knownThemeName.split('.');

            if(desiredThemeParts[0] && knownThemeParts[0] !== desiredThemeParts[0]) {
                return;
            }

            if(desiredThemeParts[1] && desiredThemeParts[1] !== knownThemeParts[1]) {
                return;
            }

            if(desiredThemeParts[2] && desiredThemeParts[2] !== knownThemeParts[2]) {
                return;
            }

            if(!result || themeData.isActive) {
                result = knownThemeName;
            }

            if(themeData.isActive) {
                return false;
            }
        });
    }

    return result;
}

function initContext(newContext) {
    try {
        if(newContext !== context) {
            knownThemes = null;
        }
    } catch(x) {
        // Cross-origin permission error
        knownThemes = null;
    }

    context = newContext;
}

function init(options) {
    options = options || {};
    initContext(options.context || domAdapter.getDocument());

    if(!context) return;
    processMarkup();
    currentThemeName = undefined;
    current(options);
}

function current(options) {
    if(!arguments.length) {
        currentThemeName = currentThemeName || readThemeMarker();
        return currentThemeName;
    }

    detachCssClasses(viewPort());

    options = options || {};
    if(typeof options === 'string') {
        options = { theme: options };
    }

    const isAutoInit = options._autoInit;
    const loadCallback = options.loadCallback;
    let currentThemeData;

    currentThemeName = resolveFullThemeName(options.theme || currentThemeName);

    if(currentThemeName) {
        currentThemeData = knownThemes[currentThemeName];
    }

    if(loadCallback) {
        themeReadyCallback.add(loadCallback);
    }

    if(currentThemeData) {
        // NOTE:
        // 1. <link> element re-creation leads to incorrect CSS rules priority in Internet Explorer (T246821).
        // 2. We have no reliable info, why this hack has been applied and whether it is still relevant.
        // 3. This hack leads Internet Explorer crashing after icon font has been implemented.
        //    $activeThemeLink.removeAttr("href"); // this is for IE, to stop loading prev CSS
        $activeThemeLink.attr('href', knownThemes[currentThemeName].url);
        if((themeReadyCallback.has() || initDeferred.state() !== 'resolved' || options._forceTimeout)) {
            waitForThemeLoad(currentThemeName);
        }
    } else {
        if(isAutoInit) {
            if(hasWindow()) {
                waitForThemeLoad(ANY_THEME);
            }

            themeReadyCallback.fire();
            themeReadyCallback.empty();
        } else {
            throw errors.Error('E0021', currentThemeName);
        }
    }

    checkThemeDeprecation();

    initDeferred.done(() => attachCssClasses(originalViewPort(), currentThemeName));
}

function getCssClasses(themeName) {
    themeName = themeName || current();

    const result = [];
    const themeNameParts = themeName && themeName.split('.');

    if(themeNameParts) {
        result.push(
            'dx-theme-' + themeNameParts[0],
            'dx-theme-' + themeNameParts[0] + '-typography'
        );

        if(themeNameParts.length > 1) {
            result.push('dx-color-scheme-' + themeNameParts[1] + (isMaterial(themeName) ? ('-' + themeNameParts[2]) : ''));
        }
    }

    return result;
}

let themeClasses;
function attachCssClasses(element, themeName) {
    themeClasses = getCssClasses(themeName).join(' ');
    $(element).addClass(themeClasses);

    const activateHairlines = function() {
        const pixelRatio = hasWindow() && window.devicePixelRatio;

        if(!pixelRatio || pixelRatio < 2) {
            return;
        }

        const $tester = $('<div>');
        $tester.css('border', '.5px solid transparent');
        $('body').append($tester);
        if($tester.outerHeight() === 1) {
            $(element).addClass(DX_HAIRLINES_CLASS);
            themeClasses += ' ' + DX_HAIRLINES_CLASS;
        }
        $tester.remove();
    };

    activateHairlines();
}

function detachCssClasses(element) {
    $(element).removeClass(themeClasses);
}

function themeReady(callback) {
    themeReadyCallback.add(callback);
}

function isTheme(themeRegExp, themeName) {
    if(!themeName) {
        themeName = currentThemeName || readThemeMarker();
    }

    return new RegExp(themeRegExp).test(themeName);
}

function isMaterial(themeName) {
    return isTheme('material', themeName);
}

function isIos7(themeName) {
    return isTheme('ios7', themeName);
}

function isGeneric(themeName) {
    return isTheme('generic', themeName);
}

function isDark(themeName) {
    return isTheme('dark', themeName);
}

function checkThemeDeprecation() {
    if(isIos7()) {
        errors.log('W0010', 'The \'ios7\' theme', '19.1', 'Use the \'generic\' theme instead.');
    }
}

function isWebFontLoaded(text, fontWeight) {
    const testedFont = 'Roboto, RobotoFallback, Arial';
    const etalonFont = 'Arial';

    const document = domAdapter.getDocument();
    const testElement = document.createElement('span');

    testElement.style.position = 'absolute';
    testElement.style.top = '-9999px';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.fontFamily = etalonFont;
    testElement.style.fontSize = '250px';
    testElement.style.fontWeight = fontWeight;
    testElement.innerHTML = text;

    document.body.appendChild(testElement);

    const etalonFontWidth = testElement.offsetWidth;
    testElement.style.fontFamily = testedFont;
    const testedFontWidth = testElement.offsetWidth;

    testElement.parentNode.removeChild(testElement);

    return etalonFontWidth !== testedFontWidth;
}

function waitWebFont(text, fontWeight) {
    const interval = 15;
    const timeout = 2000;

    return new Promise(resolve => {
        const check = () => {
            if(isWebFontLoaded(text, fontWeight)) {
                clear();
            }
        };

        const clear = () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            resolve();
        };

        const intervalId = setInterval(check, interval);
        const timeoutId = setTimeout(clear, timeout);
    });
}

function autoInit() {
    init({
        _autoInit: true,
        _forceTimeout: true
    });

    if($(DX_LINK_SELECTOR, context).length) {
        throw errors.Error('E0022');
    }
}

if(hasWindow()) {
    autoInit();
} else {
    ready(autoInit);
}

viewPortChanged.add(function(viewPort, prevViewPort) {
    initDeferred.done(function() {
        detachCssClasses(prevViewPort);
        attachCssClasses(viewPort);
    });
});

devices.changed.add(function() {
    init({ _autoInit: true });
});

exports.init = init;
exports.waitForThemeLoad = waitForThemeLoad;
exports.current = current;
exports.attachCssClasses = attachCssClasses;
exports.detachCssClasses = detachCssClasses;
exports.isMaterial = isMaterial;
exports.isIos7 = isIos7;
exports.isGeneric = isGeneric;
exports.isDark = isDark;
exports.checkThemeDeprecation = checkThemeDeprecation;
exports.isWebFontLoaded = isWebFontLoaded;
exports.waitWebFont = waitWebFont;
exports.ready = themeReady;
exports.isPendingThemeLoaded = isPendingThemeLoaded;

exports.resetTheme = function() {
    $activeThemeLink && $activeThemeLink.attr('href', 'about:blank');
    currentThemeName = null;
    pendingThemeName = null;
    initDeferred = new Deferred();
};

exports.setDefaultTimeout = function(timeout) {
    defaultTimeout = timeout;
};

exports.initialized = function(callback) {
    initDeferred.done(callback);
};
