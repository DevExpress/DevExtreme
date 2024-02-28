import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

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

function getInterestProcessArgs() {
  // eslint-disable-next-line spellcheck/spell-checker
  return process.argv.slice(2);
}

export function getExplicitTestsFromArgs() {
  const result = { masks: [] };
  getInterestProcessArgs().forEach((argument) => {
    const parts = argument.split('-');
    result.masks.push(patternGroupFromValues(...parts));
  });
  return result.masks.length ? result : undefined;
}

export function getChangedFiles() {
  const changedFilesPath = process.env.CHANGEDFILEINFOSPATH;
  return changedFilesPath
    && existsSync(changedFilesPath)
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

export function changeTheme(dirName, relativePath, demoPath, theme) {
  const indexFilePath = join(dirName, `${relativePath}${demoPath}/index.html`);

  const updatedContent = globalReadFrom(dirName, `${relativePath}${demoPath}/index.html`, (data) => data.replace(/dx(\.\w+)*\.light\.css/g, `dx.${theme}.css`));

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
    const oldToJSON = RegExp.prototype.toJSON;
    try {
      // Necessary for JSON.stringify call: by default RegExps will produce an empty string.
      // eslint-disable-next-line no-extend-native
      RegExp.prototype.toJSON = RegExp.prototype.toString;
      // eslint-disable-next-line no-console
      if (settings.verbose) { console.log('Test filters: \r\n', JSON.stringify(result, null, 2)); }
    } finally {
      // eslint-disable-next-line no-extend-native
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
  return (settings.current === settings.total ? 0 : settings.current)
      === ((testIndex % settings.total) || 0);
}

const SKIPPED_TESTS = {
  Angular: {
    Charts: ['ZoomingAndScrollingAPI'],
    Common: ['EditorAppearanceVariants'],
    DataGrid: [
      'AdvancedMasterDetailView',
      'AjaxRequest',
      'Appearance',
      'BatchEditing',
      'CellEditingAndEditingAPI',
      'ColumnCustomization',
      'CustomNewRecordPosition',
      'DataValidation',
      'EditStateManagement',
      'Filtering',
      'FilteringAPI',
      'GroupSummaries',
      'InfiniteScrolling',
      'MasterDetailAPI',
      'MasterDetailView',
      'MultipleRecordSelectionAPI',
      'MultipleSorting',
      'OdataService',
      'RecordGrouping',
      'RecordPaging',
      'RemoteGrouping',
      'RowEditingAndEditingEvents',
      'RowSelection',
      'SimpleArray',
      'StatePersistence',
    ],
    DropDownBox: ['MultipleSelection'],
    Form: ['CustomizeItem'],
    Gauges: ['VariableNumberOfBars'],
    List: [
      'ItemDragging',
      'ListSelection',
    ],
    PivotGrid: ['IntegratedFieldChooser'],
    Popup: ['Scrolling'],
    Scheduler: [
      'CustomDragAndDrop',
      'Resources',
    ],
    Sortable: ['Kanban'],
    TabPanel: ['Overview'],
    Tabs: [
      'Overview',
      'Selection',
    ],
    Toolbar: ['Adaptability'],
    TreeView: ['ItemSelectionAndCustomization'],
  },
  Vue: {
    DataGrid: [
      'EditStateManagement',
      'FilteringAPI',
      'StatePersistence',
    ],
  },
};

export function shouldRunTest(currentFramework, testIndex, product, demo) {
  const frameworkSkippedDemos = SKIPPED_TESTS[currentFramework]
      && SKIPPED_TESTS[currentFramework][product];

  if (frameworkSkippedDemos && frameworkSkippedDemos.indexOf(demo) > -1) {
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

export function runTestAtPage(test, demoUrl) {
  let executor = test;
  if (settings.explicitTests) {
    executor = shouldRunTestExplicitly(demoUrl) ? test.only : executor = test.skip;
  }
  return executor.page(demoUrl);
}

export function runManualTestCore(testObject, product, demo, framework, callback) {
  changeTheme(__dirname, '../../', `/JSDemos/Demos/${product}/${demo}/${framework}/`, process.env.THEME);

  const test = testObject.page(`http://localhost:8080/apps/demos/Demos/${product}/${demo}/${framework}/`);
  const index = settings.manualTestIndex;
  settings.manualTestIndex += 1;

  if (!shouldRunTest(framework, index, product, demo)) {
    return;
  }

  if (settings.explicitTests) {
    if (shouldRunTestExplicitlyInternal(framework, product, demo)) {
      callback(test.only);
    }
    return;
  }

  callback(test);
}

export function runManualTest(product, demo, framework, callback) {
  if (Array.isArray(framework)) {
    framework.forEach((i) => {
      runManualTestCore(test, product, demo, i, callback);
    });
  } else {
    runManualTestCore(test, product, demo, framework, callback);
  }
}

export function getPortByIndex(testIndex) {
  return (settings.total && (Math.floor(testIndex / settings.total) % settings.concurrency)) || 0;
}

export function updateConfig(customSettings) {
  settings.verbose = true;
  settings.manualTestIndex = 0;
  settings.demoExpr = /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<framework>angular|angularjs|jquery|react|vue)\/.*/i;
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
