import { join } from 'path';
import { ClientFunction } from 'testcafe';
import { getTestGlobalsScriptPath } from './test-globals-bundle';
import { widgetsGalleryServiceMock } from '../../testing/apiMocks/widgetsGalleryServiceMock';
import { xmlaServiceMock } from '../../testing/apiMocks/xmlaServiceMock';
import {
  FRAMEWORKS,
  settings,
  changeTheme,
  globalReadFrom,
  injectStyle,
  shouldRunTest,
  shouldRunTestExplicitly,
  shouldRunTestExplicitlyInternal,
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

const SKIPPED_TESTS = {
  jQuery: {},
  Angular: {},
  Vue: {},
  React: {},
};

export function runTestAtPage(test, demoUrl) {
  let executor = test;

  if (settings.explicitTests) {
    // eslint-disable-next-line no-only-tests/no-only-tests
    executor = shouldRunTestExplicitly(demoUrl) ? test.only : test.skip;
  }
  return executor.page(demoUrl);
}

export function runManualTestCore(
  testObject,
  widget,
  demo,
  framework,
  callback,
) {
  settings.manualTestIndex += 1;
  const index = settings.manualTestIndex;

  if (!shouldRunTest(framework, index, widget, demo, SKIPPED_TESTS)) {
    return;
  }

  const clientScriptSource = globalReadFrom(__dirname, `../../Demos/${widget}/${demo}/client-script.js`, (x) => [{ content: x }]) || [];
  const testCodeSource = globalReadFrom(__dirname, `../../Demos/${widget}/${demo}/test-code.js`, (x) => x) || '';

  changeTheme(__dirname, `../../Demos/${widget}/${demo}/${FRAMEWORKS[framework]}/index.html`, process.env.THEME);
  const testURL = `http://127.0.0.1:8080/apps/demos/Demos/${widget}/${demo}/${FRAMEWORKS[framework]}/`;

  const getTestStyles = (demoName) => {
    switch (demoName) {
      case 'EditorAppearanceVariants':
        return '.dx-toast-wrapper { display: none !important; }';
      case 'VirtualScrolling':
      case 'StatePersistence':
      case 'EditStateManagement':
      case 'BatchUpdateRequest':
        return '.dx-scrollable-scroll { visibility: visible !important; }';
      default:
        return '';
    }
  };

  const testStyles = getTestStyles(demo);
  const testGlobalsScriptPath = getTestGlobalsScriptPath(FRAMEWORKS[framework]);

  const clientScripts = [
    { module: 'mockdate' },
    join(__dirname, './inject/test-utils.js'),
    ...(testGlobalsScriptPath ? [testGlobalsScriptPath] : []),
    { content: injectStyle(globalReadFrom(__dirname, './inject/test-styles.css', (x) => x)) },
    ...(testStyles !== '' ? [{ content: injectStyle(testStyles) }] : []),
    ...clientScriptSource,
  ];

  const test = testObject.clientScripts(clientScripts)
    .requestHooks(widgetsGalleryServiceMock, xmlaServiceMock)
    .page(testURL);

  test.before?.(async (t) => {
    await waitForStylesheets();

    if (testCodeSource) {
      await execCode(testCodeSource);
    }

    const [width, height] = t.fixtureCtx.initialWindowSize;

    await t.resizeWindow(width, height);

    if (FRAMEWORKS[framework] === 'Angular') {
      await waitForAngularLoading();
    }
  });

  if (settings.explicitTests) {
    if (shouldRunTestExplicitlyInternal(framework, widget, demo)) {
      // eslint-disable-next-line no-only-tests/no-only-tests
      callback(test.only);
    }
    return;
  }

  callback(test);
}

export function runManualTest(widget, demo, callback) {
  const framework = settings.targetFramework;
  runManualTestCore(test, widget, demo, framework, callback);
}
