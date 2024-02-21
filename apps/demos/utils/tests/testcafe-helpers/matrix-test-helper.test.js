/* istanbul ignore file */

const fs = require('fs');
const helper = require('../../visual-tests/matrix-test-helper');

const productDemoFramework = [{ filename: 'Demos/Accordion/Overview/Angular/index.json' }];
const productDemo = [{ filename: 'Demos/Accordion/Overview/visualtestrc.json' }];
const productDemoDescription = [{ filename: 'Demos/Accordion/Overview/description.md' }];
const stubPath = [{ filename: 'stub' }];
const manualScreenPath = [{ filename: 'testing/widgets/datagrid/etalons/image.png' }];
const manualTestPath = [{ filename: 'testing/widgets/datagrid/sometest.test.js' }];
const testStub = {
  name: 'test',
  only: {
    name: 'only',
    page() { return this; },
  },
  skip: {
    name: 'skip',
    page() { return this; },
  },
  page() { return this; },
};

function updateChanges(value, options) {
  fs.writeFileSync('changed-files.json', JSON.stringify(value));
  helper.updateConfig({
    ...options,
    verbose: false,
  });
}

describe('Matrix test helper tests', () => {
  beforeAll(() => {
    process.env.CI_ENV = 'true';
    process.env.CHANGEDFILEINFOSPATH = 'changed-files.json';
  });

  test('Product-Demo-Framework change test', () => {
    updateChanges(productDemoFramework);
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Angular/').name).toBe('only');
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Jquery/').name).toBe('skip');
  });

  test('Product-Demo change test', () => {
    updateChanges(productDemo);
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Angular/').name).toBe('only');
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Jquery/').name).toBe('only');
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Another/Jquery/').name).toBe('skip');
  });

  test('Do nothing on description.md change test', () => {
    updateChanges(productDemoDescription);
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Angular/').name).toBe('skip');
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Jquery/').name).toBe('skip');
  });

  test('Run all on unknown change test', () => {
    updateChanges(stubPath);
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Angular/').name).toBe('test');
    expect(helper.runTestAtPage(testStub, 'http://127.0.0.1:8080/Demos/Accordion/Overview/Jquery/').name).toBe('test');
  });

  test('Run manual test on manual etalon change', () => {
    try {
      updateChanges(manualScreenPath);
      let value;
      helper.runManualTestCore(testStub, 'DataGrid', 'SomeDemo', 'jQuery', (x) => { value = x.name; });
      expect(value).toBe('only');
    } finally {
      helper.updateConfig();
    }
  });

  test('Not run manual test on manual etalon change for another widget', () => {
    try {
      updateChanges(manualScreenPath);
      let value;
      helper.runManualTestCore(testStub, 'Scheduler', 'SomeDemo', 'jQuery', (x) => { value = x.name; });
      expect(value).toBeUndefined();
    } finally {
      helper.updateConfig();
    }
  });

  test('Run manual test on demo change', () => {
    try {
      updateChanges(productDemo);
      let value;
      helper.runManualTestCore(testStub, 'Accordion', 'Overview', 'jQuery', (x) => { value = x.name; });
      expect(value).toBe('only');
    } finally {
      helper.updateConfig();
    }
  });

  test('Not run manual test on another demo change', () => {
    try {
      updateChanges(productDemo);
      let value;
      helper.runManualTestCore(testStub, 'Accordion', 'AnotherDemo', 'jQuery', (x) => { value = x.name; });
      expect(value).toBeUndefined();
    } finally {
      helper.updateConfig();
    }
  });

  test('Run manual test on manual test change', () => {
    try {
      updateChanges(manualTestPath);
      let value;
      helper.runManualTestCore(testStub, 'DataGrid', 'SomeDemo', 'jQuery', (x) => { value = x.name; });
      expect(value).toBe('only');
    } finally {
      helper.updateConfig();
    }
  });
});
