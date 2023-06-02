import { ClientFunction } from 'testcafe';

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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  await ClientFunction((width, height, callback) => {
    const { visualViewport } = window as any;

    callback(visualViewport, 'width', width);
    callback(visualViewport, 'height', height);
  })(width, height, setVisualViewportSize);

  await t.resizeWindow(width, height);
};

export type {
  BrowserSizeType,
};

export {
  DEFAULT_BROWSER_SIZE,
  restoreBrowserSize,
};
