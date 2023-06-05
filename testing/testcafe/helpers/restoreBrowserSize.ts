type BrowserSizeType = [width: number, height: number];
const DEFAULT_BROWSER_SIZE: BrowserSizeType = [1200, 800];

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
