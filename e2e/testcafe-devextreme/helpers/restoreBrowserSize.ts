// eslint-disable-next-line import/extensions
import { DEFAULT_BROWSER_SIZE } from './const.js';

type BrowserSizeType = [width: number, height: number];

const restoreBrowserSize = async (t: TestController):
Promise<any> => {
  const [width, height] = DEFAULT_BROWSER_SIZE;
  await t.resizeWindow(width, height);
};

export type {
  BrowserSizeType,
};

export {
  DEFAULT_BROWSER_SIZE,
  restoreBrowserSize,
};
