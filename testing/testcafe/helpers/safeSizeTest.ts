import { ClientFunction } from 'testcafe';
import { BrowserSizeType, DEFAULT_BROWSER_SIZE, restoreBrowserSize } from './restoreBrowserSize';

const SCROLLBAR_SIZE = 15;

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

  await t.resizeWindow(width, height);

  await ClientFunction(() => {
    const { visualViewport } = window as any;

    setVisualViewportSize(visualViewport, 'width', width - SCROLLBAR_SIZE);
    setVisualViewportSize(visualViewport, 'height', height - SCROLLBAR_SIZE);
  }, {
    dependencies: {
      width,
      height,
      setVisualViewportSize,
      SCROLLBAR_SIZE,
    },
  })();
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
