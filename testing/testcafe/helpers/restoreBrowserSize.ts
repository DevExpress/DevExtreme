// eslint-disable-next-line @typescript-eslint/no-type-alias
type BrowserSizeType = [width: number, height: number];
const DEFAULT_BROWSER_SIZE: BrowserSizeType = [1200, 800];

const setVisualViewportSize = (object: any, propertyName: string, value: number) => {
  Object.defineProperty(object, propertyName, {
    get: () => value,
  });
};

const restoreBrowserSize = async (t: TestController):
Promise<any> => {
  const [width, height] = DEFAULT_BROWSER_SIZE;

  const { visualViewport } = window;

  setVisualViewportSize(visualViewport, 'width', width);
  setVisualViewportSize(visualViewport, 'height', height);

  await t.resizeWindow(width, height);
};

export type {
  BrowserSizeType,
};

export {
  DEFAULT_BROWSER_SIZE,
  restoreBrowserSize,
};
