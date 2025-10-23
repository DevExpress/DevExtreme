import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ClientFunction } from 'testcafe';
import { THEME } from './helpers/theme-utils';
import { gitHubIgnored } from './github-ignored-list';

export const FRAMEWORKS = {
  jquery: 'jQuery',
  react: 'React',
  vue: 'Vue',
  angular: 'Angular'
};

export const execCode = ClientFunction((code) => {
  // eslint-disable-next-line no-eval
  const result = eval(code);
  if (result && typeof result.then === 'function') {
    return Promise.race([result, new Promise((resolve) => setTimeout(resolve, 60000))]);
  }

  return Promise.resolve();
});

const settings = {
  concurrency: undefined,
  targetFramework: undefined,
  total: undefined,
  current: undefined,
  verbose: undefined,
  demoExpr: undefined,
  demoFilesExpr: undefined,
  commonEtalonsExpr: undefined,
  manualEtalonsExpr: undefined,
  explicitTests: undefined,
  ignoreChangesPathPatterns: undefined,
  manualTestIndex: undefined,
};

// eslint-disable-next-line no-use-before-define
// @ts-expect-error types error
updateConfig();

function shouldRunTestExplicitlyInternal(framework, product, demo) {
  return settings.explicitTests.masks.some((x) => x.framework.test(framework)
    && x.demo.test(demo)
    && x.product.test(product));
}

function patternGroupFromValues(product, demo, framework) {
  const wrap = (x) => RegExp(x || '.*', 'i');
  return {
    product: wrap(product),
    demo: wrap(demo),
    framework: wrap(framework),
  };
}

export const injectStyle = (style) => `
  var style = document.createElement('style');
  style.innerHTML = \`${style}\`;
  document.getElementsByTagName('head')[0].appendChild(style);
`;

export const waitForAngularLoading = ClientFunction(() => new Promise((resolve) => {
  let demoAppCounter = 0;
  const demoAppIntervalHandle = setInterval(() => {
    const demoApp = document.querySelector('demo-app') as HTMLElement;
    if ((demoApp && demoApp.innerText !== 'Loading...') || demoAppCounter === 120) {
      setTimeout(resolve, 500);
      clearInterval(demoAppIntervalHandle);
    }
    demoAppCounter += 1;
  }, 1000);
}));

function getInterestProcessArgs() {
  // eslint-disable-next-line spellcheck/spell-checker
  return process.argv.slice(2);
}

export function getExplicitTestsFromArgs() {
  const result = { masks: [] };
  getInterestProcessArgs().forEach((argument) => {
    const parts = argument.split('-');
    // @ts-expect-error types error
    result.masks.push(patternGroupFromValues(...parts));
  });
  return result.masks.length ? result : undefined;
}

export function getChangedFiles() {
  const changedFilesPath = process.env.CHANGEDFILEINFOSPATH;
  return changedFilesPath
    && existsSync(changedFilesPath)
    // @ts-expect-error types error
    && JSON.parse(readFileSync(changedFilesPath));
}

export function globalReadFrom(basePath, relativePath, mapCallback) {
  const absolute = join(basePath, relativePath);
  if (existsSync(absolute)) {
    const result = readFileSync(absolute, 'utf8');
    return (mapCallback && result && mapCallback(result)) || result;
  }
  return null;
}

export function changeTheme(dirName, demoPath, theme) {
  if (!theme || theme === THEME.generic) {
    return;
  }

  const updatedContent = globalReadFrom(dirName, demoPath, (data) => {
    const result = data.replace(/data-theme="[^"]+"/g, `data-theme="${theme}"`);

    return result.replace(/dx\.[^.]+(\.css")/g, `dx.${theme}$1`);
  });

  const indexFilePath = join(dirName, demoPath);

  if (existsSync(indexFilePath)) {
    writeFileSync(indexFilePath, updatedContent, 'utf8');
  }
}

function getExplicitTestsInternal() {
  const changedFiles = getChangedFiles();

  if (!changedFiles) { return getExplicitTestsFromArgs(); }
  if (!Array.isArray(changedFiles)) {
    // eslint-disable-next-line no-console
    console.log('Running all tests. Changed files are not iterable: ', JSON.stringify(changedFiles));
  }

  const result = { masks: [], traceTree: undefined };

  // eslint-disable-next-line no-restricted-syntax
  for (const changedFile of changedFiles) {
    const fileName = changedFile.filename;

    if (settings.ignoreChangesPathPatterns.some((x) => x.test(fileName))) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const parseResult = settings.demoExpr.exec(fileName)
      || settings.demoFilesExpr.exec(fileName)
      || settings.commonEtalonsExpr.exec(fileName)
      || settings.manualEtalonsExpr.exec(fileName);

    if (parseResult) {
      const groups = parseResult.groups || {};

      result.masks.push(patternGroupFromValues(
        groups.product,
        groups.demo,
        groups.framework,
      ));
    } else {
      // eslint-disable-next-line no-console
      if (settings.verbose) { console.log('Unable to parse changed file, running all tests: ', fileName); }
      return undefined;
    }
  }

  return result;
}
function getExplicitTests() {
  const result = getExplicitTestsInternal();
  if (result) {
    // @ts-expect-error types error
    const oldToJSON = RegExp.prototype.toJSON;
    try {
      // Necessary for JSON.stringify call: by default RegExps will produce an empty string.
      // eslint-disable-next-line no-extend-native
      // @ts-expect-error types error
      RegExp.prototype.toJSON = RegExp.prototype.toString;
      // eslint-disable-next-line no-console
      if (settings.verbose) { console.log('Test filters: \r\n', JSON.stringify(result, null, 2)); }
    } finally {
      // eslint-disable-next-line no-extend-native
      // @ts-expect-error types error
      RegExp.prototype.toJSON = oldToJSON;
    }
  }

  return result;
}

export function shouldRunFramework(currentFramework) {
  return !currentFramework
    || !settings.targetFramework
    || currentFramework.toLowerCase() === settings.targetFramework.toLowerCase();
}

export function shouldRunTestAtIndex(testIndex) {
  if (!settings.total) {
    return true;
  }

  const part = testIndex % settings.total;
  const currentPart = settings.current - 1;

  return part === currentPart;
}

const SKIPPED_TESTS = {
  jQuery: {
    Charts: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'AreaSelectionZooming', themes: [THEME.material] },
      { demo: 'ZoomingAndScrollingAPI', themes: [THEME.material] },
      { demo: 'TooltipCustomization', themes: [THEME.material] },
      { demo: 'LegendMarkersCustomization', themes: [THEME.material] },
      { demo: 'PieResolveLabelOverlap', themes: [THEME.material] },
    ],
    DataGrid: [
      { demo: 'CellEditing', themes: [THEME.material] },
      { demo: 'MultipleRecordSelectionAPI', themes: [THEME.material] },
      // Scroll to const value. Not enough for other themes, because the height of elements is different.
      { demo: 'RemoteGrouping', themes: [THEME.fluent, THEME.material] },
      { demo: 'RowEditing', themes: [THEME.fluent, THEME.material] },
      { demo: 'Toolbar', themes: [THEME.generic, THEME.fluent, THEME.material] },
    ],
    Gantt: [
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    VectorMap: [
      { demo: 'Tooltip', themes: [THEME.material] },
      { demo: 'TooltipsCustomization', themes: [THEME.material] },
    ]
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['EditStateManagement', 'Toolbar', 'RemoteGrouping'],
    Scheduler: ['ContextMenu'],
    FileUploader: ['CustomDropzone']
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Scheduler: [
      // NOTE: Context menu item position is different across themes
      { demo: 'ContextMenu', themes: [THEME.fluent] },
    ],
    DataGrid: ['EditStateManagement', 'Toolbar', 'RemoteGrouping'],
    FileUploader: ['CustomDropzone']
  },
  React: {
    Common: ['PopupAndNotificationsOverview'],
    Scheduler: [
      { demo: 'ContextMenu', themes: [THEME.fluent] },
    ],
    DataGrid: ['EditStateManagement', 'Toolbar', 'RemoteGrouping'],
    FileUploader: ['CustomDropzone']
  },
};

export function shouldSkipDemo(framework, component, demoName, skippedTests) {
  const frameworkTests = skippedTests[framework];
  if (!frameworkTests) {
    return false;
  }

  const componentTests = frameworkTests[component];
  if (!componentTests) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const test of componentTests) {
    if (typeof test === 'string' && test === demoName) {
      return true;
    } if (test.demo === demoName
      && test.themes.includes(process.env.THEME || THEME.generic)) {
      return true;
    }
  }

  return false;
}

export function shouldRunTest(currentFramework, testIndex, product, demo, skippedTests) {
  if (shouldSkipDemo(FRAMEWORKS[currentFramework], product, demo, skippedTests)) {
    return false;
  }

  return shouldRunFramework(currentFramework) && shouldRunTestAtIndex(testIndex);
}

export function shouldRunTestExplicitly(demoUrl) {
  if (!settings.explicitTests) { return false; }

  const parts = demoUrl.split('/').filter((x) => x && x.length);

  return shouldRunTestExplicitlyInternal(
    parts[parts.length - 1],
    parts[parts.length - 3],
    parts[parts.length - 2],
  );
}

export function runTestAtPage(test, demoUrl, shouldSkipJsError) {
  let executor = test;

  if (shouldSkipJsError) {
    test.skipJsErrors();
  }

  if (settings.explicitTests) {
    executor = shouldRunTestExplicitly(demoUrl) ? test.only : executor = test.skip;
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
  const isGitHubDemos = process.env.ISGITHUBDEMOS;

  settings.manualTestIndex += 1;
  const index = settings.manualTestIndex;

  if (!shouldRunTest(framework, index, widget, demo, SKIPPED_TESTS)) {
    return;
  }

  const clientScriptSource = globalReadFrom(__dirname, `../../Demos/${widget}/${demo}/client-script.js`, (x) => [{ content: x }]) || [];
  const testCodeSource = globalReadFrom(__dirname, `../../Demos/${widget}/${demo}/test-code.js`, (x) => x) || '';

  let testURL = '';

  if (isGitHubDemos) {
    if (widget !== 'DataGrid' || gitHubIgnored.includes(demo)) {
      return;
    }

    const theme = process.env.THEME.replace('generic.', '');
    testURL = `http://127.0.0.1:808${getPortByIndex(index)}/${widget}/${demo}/${FRAMEWORKS[framework]}/?theme=dx.${theme}`;
  } else {
    changeTheme(__dirname, `../../Demos/${widget}/${demo}/${FRAMEWORKS[framework]}/index.html`, process.env.THEME);
    testURL = `http://127.0.0.1:808${getPortByIndex(index)}/apps/demos/Demos/${widget}/${demo}/${FRAMEWORKS[framework]}/`;
  }

  const test = testObject.clientScripts([
    { module: 'mockdate' },
    join(__dirname, './inject/test-utils.js'),
    { content: injectStyle(globalReadFrom(__dirname, '../utils/visual-tests/inject/test-styles.css', (x) => x)) },
    ...clientScriptSource,
  ])
    .page(testURL);

  test.before?.(async (t) => {
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
      callback(test.only);
    }
    return;
  }

  callback(test);
}

export function runManualTest(widget, demo, callback) {
  if (process.env.STRATEGY === 'accessibility') {
    return;
  }

  const framework = settings.targetFramework;
  runManualTestCore(test, widget, demo, framework, callback);
}

export function getPortByIndex(testIndex) {
  return (settings.total && (Math.floor(testIndex / settings.total) % settings.concurrency)) || 0;
}

export function updateConfig(customSettings) {
  settings.verbose = true;
  settings.manualTestIndex = settings.current ? (settings.current - 1) : 0;
  settings.demoExpr = /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<framework>angular|jquery|react|vue)\/.*/i;
  settings.demoFilesExpr = /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<data>.*)/i;
  settings.commonEtalonsExpr = /testing\/etalons\/(?<product>\w+)-(?<demo>\w+)(?<suffix>.*).png/i;
  settings.manualEtalonsExpr = /testing\/widgets\/(?<product>\w+)\/.*/i;
  settings.concurrency = (process.env.CONCURRENCY && (+process.env.CONCURRENCY)) || 1;
  if (process.env.CONSTEL) {
    const match = process.env.CONSTEL.match(/(?<name>\w+)(?<parallel>\((?<current>\d+)\/(?<total>\d+)\))?/);
    if (match) {
      settings.targetFramework = match.groups.name;
      const parallelFilter = match.groups.parallel;
      if (parallelFilter) {
        settings.total = +match.groups.total;
        settings.current = +match.groups.current;
      }
    }
  }
  settings.ignoreChangesPathPatterns = [
    /mvcdemos.*/i,
    /netcoredemos.*/i,
    /menumeta.json/i,
    /.*.md/i,
  ];

  if (customSettings) {
    Object.assign(settings, customSettings);
  }

  settings.explicitTests = getExplicitTests();
}
