import { ClientFunction } from 'testcafe';
import { BrowserSizeType, DEFAULT_BROWSER_SIZE, restoreBrowserSize } from './restoreBrowserSize';

type TestCafeFn = (t: TestController) => Promise<any>;

const emptyFunction = () => Promise.resolve();

const setVisualViewportSize = (object: any, propertyName: string, value: number) => {
  Object.defineProperty(object, propertyName, {
    get: () => value,
    configurable: true,
  });
};

const setBrowserSize = async (
  t: TestController,
  size: BrowserSizeType,
) => {
  const [width, height] = size;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  await ClientFunction((width, height, callback) => {
    const { visualViewport } = window as any;

    callback(visualViewport, 'width', width);
    callback(visualViewport, 'height', height);
  })(width, height, setVisualViewportSize);

  await t.resizeWindow(width, height);
};

const decorateTestCafeBefore = (
  testCafeTest: TestFn,
  size: BrowserSizeType,
): void => {
  const originBefore = testCafeTest.before;

  const decoratedBefore = (beforeFunc: TestCafeFn): TestFn => {
    const decoratedFunc = async (t: TestController) => {
      await setBrowserSize(t, size);
      return beforeFunc(t);
    };

    originBefore(decoratedFunc);
    return testCafeTest;
  };

  Object.defineProperty(testCafeTest, 'before', {
    get: () => decoratedBefore,
  });
};

const decorateTestCafeAfter = (
  testCafeTest: TestFn,
): void => {
  const originAfter = testCafeTest.after;

  const decoratedAfter = (afterFunc: TestCafeFn): TestFn => {
    const decoratedFunc = async (t: TestController) => {
      await restoreBrowserSize(t);
      return afterFunc(t);
    };

    originAfter(decoratedFunc);
    return testCafeTest;
  };

  Object.defineProperty(testCafeTest, 'after', {
    get: () => decoratedAfter,
  });
};

const safeSizeTest = (
  name: string,
  testFunction: TestCafeFn,
  size: BrowserSizeType = DEFAULT_BROWSER_SIZE,
): TestFn => {
  const testCafeTest = test(name, testFunction);

  decorateTestCafeBefore(testCafeTest, size);
  decorateTestCafeAfter(testCafeTest);

  testCafeTest.before(emptyFunction);
  testCafeTest.after(emptyFunction);

  return testCafeTest;
};

export {
  safeSizeTest,
};
