import { ClientFunction } from 'testcafe';
import {
  settings,
  shouldRunTestExplicitly,
  updateConfig,
} from './matrix-test-core';

export * from './matrix-test-core';

updateConfig();

export const execCode = ClientFunction((code) => {
  // eslint-disable-next-line no-eval
  const result = eval(code);
  if (result && typeof result.then === 'function') {
    return Promise.race([result, new Promise((resolve) => setTimeout(resolve, 60000))]);
  }

  return Promise.resolve();
});

export const waitForAngularLoading = ClientFunction(() => new Promise((resolve) => {
  let demoAppCounter = 0;
  const demoAppIntervalHandle = setInterval(() => {
    const demoApp = document.querySelector('demo-app');
    // @ts-expect-error ts-error
    if ((demoApp && demoApp.innerText !== 'Loading...') || demoAppCounter === 120) {
      setTimeout(resolve, 500);
      clearInterval(demoAppIntervalHandle);
    }
    demoAppCounter += 1;
  }, 1000);
}));

// A screenshot taken before <link rel="stylesheet"> resolves gets unstyled, default-browser layout.
export const waitForStylesheets = ClientFunction(() => new Promise((resolve) => {
  const check = () => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    if (links.every((link: any) => link.sheet !== null)) {
      resolve(undefined);
      return;
    }
    setTimeout(check, 50);
  };
  check();
}));

export function runTestAtPage(test, demoUrl) {
  let executor = test;

  if (settings.explicitTests) {
    // eslint-disable-next-line no-only-tests/no-only-tests
    executor = shouldRunTestExplicitly(demoUrl) ? test.only : test.skip;
  }
  return executor.page(demoUrl);
}
