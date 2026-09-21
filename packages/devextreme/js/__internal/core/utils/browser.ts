import type { BrowserInfo } from '@js/core/utils/browser';
import { extend } from '@js/core/utils/extend';
import { getNavigator } from '@js/core/utils/window';

export type BrowserName = Exclude<keyof BrowserInfo, 'version'>;

export type Browser = BrowserInfo & {
  _fromUA: (userAgent: string) => BrowserInfo;
};

const navigator = getNavigator();

const webkitRegExp = /(webkit)[ /]([\w.]+)/;
const mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;

const browserFromUA = (userAgent: string): BrowserInfo => {
  const ua = userAgent.toLowerCase();

  const result: BrowserInfo = {};
  const matches = webkitRegExp.exec(ua)
    ?? (!ua.includes('compatible') ? mozillaRegExp.exec(ua) : null)
    ?? [];
  let browserName = matches[1] as BrowserName | undefined;
  let browserVersion = matches[2] as string | undefined;

  if (browserName === 'webkit') {
    result.webkit = true;

    if (ua.includes('chrome') || ua.includes('crios')) {
      browserName = 'chrome';
      browserVersion = /(?:chrome|crios)\/(\d+\.\d+)/.exec(ua)?.[1];
    } else if (ua.includes('fxios')) {
      browserName = 'mozilla';
      browserVersion = /fxios\/(\d+\.\d+)/.exec(ua)?.[1];
    } else if (ua.includes('safari') && /version|phantomjs/.test(ua)) {
      browserName = 'safari';
      browserVersion = /(?:version|phantomjs)\/([0-9.]+)/.exec(ua)?.[1];
    } else {
      browserName = 'unknown';
      browserVersion = /applewebkit\/([0-9.]+)/.exec(ua)?.[1];
    }
  }

  if (browserName) {
    result[browserName] = true;
    result.version = browserVersion;
  }

  return result;
};

const browser: Browser = extend({ _fromUA: browserFromUA }, browserFromUA(navigator.userAgent));

export { browser };
