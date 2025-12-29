import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { parseHTML } from '@js/core/utils/html_parser';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getOuterHeight } from '@js/core/utils/size';
import { changeCallback, originalViewPort, value as viewPortValue } from '@js/core/utils/view_port';
import { getWindow, hasWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';
import { uiLayerInitialized } from '@ts/core/utils/m_common';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';

const window = getWindow();
const ready = readyCallbacks.add;
const viewPort = viewPortValue;
const viewPortChanged = changeCallback;
// @ts-expect-error ts-error
let initDeferred = new Deferred();

const DX_LINK_SELECTOR = 'link[rel=dx-theme]';
const THEME_ATTR = 'data-theme';
const ACTIVE_ATTR = 'data-active';
const DX_HAIRLINES_CLASS = 'dx-hairlines';
const ANY_THEME = 'any';

// eslint-disable-next-line @typescript-eslint/init-declarations
let context;
// eslint-disable-next-line @typescript-eslint/init-declarations
let $activeThemeLink;
// eslint-disable-next-line @typescript-eslint/init-declarations
let knownThemes;
// eslint-disable-next-line @typescript-eslint/init-declarations
let currentThemeName;
// eslint-disable-next-line @typescript-eslint/init-declarations
let pendingThemeName;
let defaultTimeout = 15000;

const THEME_MARKER_PREFIX = 'dx.';

function readThemeMarker(): string | null {
  if (!hasWindow()) {
    return null;
  }
  // @ts-expect-error ts-error
  const element = $('<div>', context).addClass('dx-theme-marker').appendTo(context.documentElement);
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let result: string;

  try {
    if (!window?.getComputedStyle) {
      return null;
    }
    result = window.getComputedStyle(element.get(0)).fontFamily;
    if (!result) {
      return null;
    }

    result = result.replace(/["']/g, '');
    if (result.substr(0, THEME_MARKER_PREFIX.length) !== THEME_MARKER_PREFIX) {
      return null;
    }
    return result.substr(THEME_MARKER_PREFIX.length);
  } finally {
    element.remove();
  }
}

export function isPendingThemeLoaded(): boolean {
  if (!pendingThemeName) {
    return true;
  }

  const anyThemePending = pendingThemeName === ANY_THEME;

  if (initDeferred.state() === 'resolved' && anyThemePending) {
    return true;
  }

  const themeMarker = readThemeMarker();

  if (themeMarker && anyThemePending) {
    return true;
  }

  return themeMarker === pendingThemeName;
}

// FYI
// http://stackoverflow.com/q/2635814
// http://stackoverflow.com/a/3078636
export function waitForThemeLoad(themeName: string): void {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let waitStartTime;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let timerId;
  let intervalCleared = true;

  pendingThemeName = themeName;

  function handleLoaded(): void {
    pendingThemeName = null;
    clearInterval(timerId);
    intervalCleared = true;

    themeReadyCallback.fire();
    themeReadyCallback.empty();

    initDeferred.resolve();
  }

  if (isPendingThemeLoaded() || !defaultTimeout) {
    handleLoaded();
  } else {
    if (!intervalCleared) {
      if (pendingThemeName) {
        pendingThemeName = themeName;
      }
      return;
    }
    waitStartTime = Date.now();

    intervalCleared = false;
    // eslint-disable-next-line no-restricted-globals
    timerId = setInterval((): void => {
      const isLoaded = isPendingThemeLoaded();
      const isTimeout = !isLoaded && Date.now() - waitStartTime > defaultTimeout;

      if (isTimeout) {
        errors.log('W0004', pendingThemeName);
      }

      if (isLoaded || isTimeout) {
        handleLoaded();
      }
    }, 10);
  }
}

function processMarkup(): void {
  // @ts-expect-error ts-error
  const $allThemeLinks = $(DX_LINK_SELECTOR, context);
  if (!$allThemeLinks.length) {
    return;
  }

  knownThemes = {};
  // @ts-expect-error ts-error
  $activeThemeLink = $(parseHTML('<link rel=stylesheet>'), context);

  // @ts-expect-error ts-error
  $allThemeLinks.each(function (): void {
    // @ts-expect-error ts-error
    const link = $(this, context);
    const fullThemeName = link.attr(THEME_ATTR);
    const url = link.attr('href');
    const isActive = link.attr(ACTIVE_ATTR) === 'true';

    // @ts-expect-error ts-error
    knownThemes[fullThemeName] = {
      url,
      isActive,
    };
  });

  $allThemeLinks.last().after($activeThemeLink);
  $allThemeLinks.remove();
}

function resolveFullThemeName(desiredThemeName: string): string | null {
  const desiredThemeParts = desiredThemeName ? desiredThemeName.split('.') : [];
  let result = null;

  if (knownThemes) {
    if (desiredThemeName in knownThemes) {
      return desiredThemeName;
    }

    // @ts-expect-error ts-error
    each(knownThemes, (knownThemeName, themeData) => {
      const knownThemeParts = knownThemeName.split('.');

      if (desiredThemeParts[0] && knownThemeParts[0] !== desiredThemeParts[0]) {
        return;
      }

      if (desiredThemeParts[1] && desiredThemeParts[1] !== knownThemeParts[1]) {
        return;
      }

      if (desiredThemeParts[2] && desiredThemeParts[2] !== knownThemeParts[2]) {
        return;
      }

      if (!result || themeData.isActive) {
        result = knownThemeName;
      }

      if (themeData.isActive) {
        // eslint-disable-next-line consistent-return
        return false;
      }
    });
  }

  return result;
}

function initContext(newContext): void {
  try {
    if (newContext !== context) {
      knownThemes = null;
    }
  } catch (x) {
    // Cross-origin permission error
    knownThemes = null;
  }

  context = newContext;
}

function getCssClasses(themeName?: string): string[] {
  // @ts-expect-error ts-error
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-use-before-define, @typescript-eslint/prefer-nullish-coalescing
  themeName = themeName || current();

  const result: string[] = [];
  const themeNameParts = themeName?.split('.');

  if (themeNameParts) {
    result.push(
      `dx-theme-${themeNameParts[0]}`,
      `dx-theme-${themeNameParts[0]}-typography`,
    );

    if (themeNameParts.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      result.push(`dx-color-scheme-${themeNameParts[1]}${isMaterialBased(themeName as string) ? `-${themeNameParts[2]}` : ''}`);
    }
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/init-declarations
let themeClasses;

// eslint-disable-next-line @typescript-eslint/naming-convention
function _attachCssClasses(element, themeName?: string): void {
  themeClasses = getCssClasses(themeName).join(' ');
  $(element).addClass(themeClasses);

  const activateHairlines = (): void => {
    const pixelRatio = hasWindow() && window.devicePixelRatio;

    if (!pixelRatio || pixelRatio < 2) {
      return;
    }

    const $tester = $('<div>');
    $tester.css('border', '.5px solid transparent');
    $('body').append($tester);
    if (getOuterHeight($tester) === 1) {
      $(element).addClass(DX_HAIRLINES_CLASS);
      themeClasses += ` ${DX_HAIRLINES_CLASS}`;
    }
    $tester.remove();
  };

  activateHairlines();
}

export function attachCssClasses(element: dxElementWrapper, themeName?: string): void {
  when(uiLayerInitialized).done((): void => {
    _attachCssClasses(element, themeName);
  });
}

export function detachCssClasses(element: dxElementWrapper): void {
  when(uiLayerInitialized).done((): void => {
    $(element).removeClass(themeClasses);
  });
}

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type,consistent-return
export function current(options) {
  if (!arguments.length) {
    currentThemeName = currentThemeName || readThemeMarker();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return currentThemeName;
  }

  detachCssClasses(viewPort());

  // eslint-disable-next-line no-param-reassign
  options = options || {};
  if (typeof options === 'string') {
    // eslint-disable-next-line no-param-reassign
    options = { theme: options };
  }

  const isAutoInit = options._autoInit;
  const { loadCallback } = options;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let currentThemeData;

  currentThemeName = resolveFullThemeName(options.theme || currentThemeName);

  if (currentThemeName) {
    currentThemeData = knownThemes[currentThemeName];
  }

  if (loadCallback) {
    themeReadyCallback.add(loadCallback);
  }

  if (currentThemeData) {
    $activeThemeLink.attr('href', knownThemes[currentThemeName].url);
    // @ts-expect-error ts-error
    if (themeReadyCallback.has() || initDeferred.state() !== 'resolved' || options._forceTimeout) {
      waitForThemeLoad(currentThemeName);
    }
  } else if (isAutoInit) {
    if (hasWindow()) {
      waitForThemeLoad(ANY_THEME);
    }

    themeReadyCallback.fire();
    themeReadyCallback.empty();
  } else {
    throw errors.Error('E0021', currentThemeName);
  }

  initDeferred.done((): void => attachCssClasses(originalViewPort(), currentThemeName));
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function init(options): void {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  initContext(options.context || domAdapter.getDocument());

  if (!context) return;
  processMarkup();
  currentThemeName = undefined;
  current(options);
}

function isTheme(themeRegExp: string, themeName: string): boolean {
  if (!themeName) {
    // eslint-disable-next-line no-param-reassign
    themeName = currentThemeName || readThemeMarker();
  }

  return new RegExp(themeRegExp).test(themeName);
}

export function isMaterial(themeName: string): boolean {
  return isTheme('material', themeName);
}

export function isFluent(themeName: string): boolean {
  return isTheme('fluent', themeName);
}

export function isMaterialBased(themeName: string): boolean {
  return isMaterial(themeName) || isFluent(themeName);
}

export function isGeneric(themeName: string): boolean {
  return isTheme('generic', themeName);
}

export function isDark(themeName: string): boolean {
  return isTheme('dark', themeName);
}

export function isCompact(themeName: string): boolean {
  return isTheme('compact', themeName);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function themeReady(callback): void {
  themeReadyCallback.add(callback);
}

export function isWebFontLoaded(text: string, fontWeight: string): boolean {
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

  testElement.parentNode?.removeChild(testElement);

  return etalonFontWidth !== testedFontWidth;
}

export function waitWebFont(text: string, fontWeight: string): Promise<unknown> {
  const interval = 15;
  const timeout = 2000;

  return new Promise((resolve) => {
    const clear = (): void => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearInterval(intervalId);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearTimeout(timeoutId);
      // @ts-expect-error ts-error
      resolve();
    };

    const check = (): void => {
      if (isWebFontLoaded(text, fontWeight)) {
        clear();
      }
    };

    // eslint-disable-next-line no-restricted-globals
    const intervalId = setInterval(check, interval);
    // eslint-disable-next-line no-restricted-globals
    const timeoutId = setTimeout(clear, timeout);
  });
}

function autoInit(): void {
  init({
    _autoInit: true,
    _forceTimeout: true,
  });

  // @ts-expect-error ts-error
  if ($(DX_LINK_SELECTOR, context).length) {
    throw errors.Error('E0022');
  }
}

if (hasWindow()) {
  autoInit();
} else {
  ready(autoInit);
}

// eslint-disable-next-line @typescript-eslint/no-shadow
viewPortChanged.add((viewPort, prevViewPort): void => {
  initDeferred.done((): void => {
    detachCssClasses(prevViewPort);
    attachCssClasses(viewPort);
  });
});

// @ts-expect-error ts-error
devices.changed.add((): void => {
  init({ _autoInit: true });
});

export {
  themeReady as ready,
};

export function resetTheme(): void {
  $activeThemeLink?.attr('href', 'about:blank');
  currentThemeName = null;
  pendingThemeName = null;
  // @ts-expect-error ts-error
  initDeferred = new Deferred();
}

export function initialized(callback: Function): void {
  initDeferred.done(callback);
}

export function setDefaultTimeout(timeout: number): void {
  defaultTimeout = timeout;
}

/**
 * Added default export according to our documentation
 * https://js.devexpress.com/Documentation/ApiReference/Common/Utils/ui/themes/
 * */
export default {
  setDefaultTimeout,
  init,
  initialized,
  resetTheme,
  ready: themeReady,
  waitWebFont,
  isWebFontLoaded,
  isCompact,
  isDark,
  isGeneric,
  isMaterial,
  isFluent,
  isMaterialBased,
  detachCssClasses,
  attachCssClasses,
  current,
  waitForThemeLoad,
  isPendingThemeLoaded,
};
