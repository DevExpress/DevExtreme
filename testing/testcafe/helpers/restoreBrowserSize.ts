import { ClientFunction } from 'testcafe';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type BrowserSizeType = [width: number, height: number];
const DEFAULT_BROWSER_SIZE: BrowserSizeType = [1200, 800];

const setVisualViewportSize = (object: any, propertyName: string, value: number) => {
  Object.defineProperty(object, propertyName, {
    get: () => value,
    configurable: true,
  });
};

const restoreBrowserSize = async (t: TestController):
Promise<any> => {
  const [width, height] = DEFAULT_BROWSER_SIZE;

  await t.resizeWindow(width, height);

  await ClientFunction(() => {
    const { visualViewport } = window as any;

    setVisualViewportSize(visualViewport, 'width', width);
    setVisualViewportSize(visualViewport, 'height', height);
  }, {
    dependencies: {
      width,
      height,
      setVisualViewportSize,
    },
  })();
};

export type {
  BrowserSizeType,
};

export {
  DEFAULT_BROWSER_SIZE,
  restoreBrowserSize,
};
