type TestCafeFn = (t: TestController) => Promise<any>;

const skipInShadowDomMode = (
  name: string,
  testFunction: TestCafeFn,
): TestFn => {
  const isShadowDom = process.env.shadowDom === 'true';
  const testCafeTest = isShadowDom ? test.skip(name, testFunction) : test(name, testFunction);

  return testCafeTest;
};

export {
  skipInShadowDomMode,
};
