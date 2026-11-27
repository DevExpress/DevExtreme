import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import type { Page } from '@playwright/test';
import {
  globalReadFrom,
  settings,
  shouldRunTestAtIndex,
  shouldRunTestExplicitly,
  updateConfig,
} from '../matrix-test-core';
import { getTestGlobalsScriptPath } from '../test-globals-bundle';
import { mockApi } from './api-mocks';
import { BASE_URL, THEME } from './const';
import {
  getVendorVizWidgets,
  openDemo,
  prepareDemoPage,
  runTestCode,
  trackPageActivity,
} from './demo-page';

type DemoSteps = (page: Page) => Promise<void>;

export interface Demo {
  widgetName: string;
  demoName: string;
  testName: string;
  pageURL: string;
  clientScript: string | null;
  testCode: string | null;
  testStyles: string | null;
  stepsPath: string;
  testGlobals: string | null;
  vendorVizWidgets: ReturnType<typeof getVendorVizWidgets>;
}

const DEMOS_ROOT = join(__dirname, '..', '..', '..');

// Demos are selected by name with --grep, so the command line holds no demo masks.
updateConfig({ explicitTestArgs: [], verbose: false });

const demoPaths = glob.sync('Demos/*/*', { cwd: DEMOS_ROOT }).sort();

export function getDemos(framework: string): Demo[] {
  // The widgets test-code.js reaches through window.DevExpress; the React and Vue bundles expose them only with this script.
  const testGlobalsPath = getTestGlobalsScriptPath(framework);
  const testGlobals = testGlobalsPath ? readFileSync(testGlobalsPath, 'utf8') : null;
  const vendorVizWidgets = getVendorVizWidgets(framework);

  return demoPaths.flatMap((demoPath, index): Demo[] => {
    const demoDir = join(DEMOS_ROOT, demoPath);

    if (!shouldRunTestAtIndex(index + 1) || !existsSync(join(demoDir, framework))) { return []; }

    const [, widgetName, demoName] = demoPath.split(/[/\\]/);
    const pageURL = `${BASE_URL}/apps/demos/Demos/${widgetName}/${demoName}/${framework}/`;
    const testSettings = globalReadFrom(demoDir, 'visualtestrc.json', (x) => JSON.parse(x));

    if (process.env.CI && !['all', 'ignore'].includes(process.env.DISABLE_DEMO_TEST_SETTINGS)) {
      const mergedTestSettings = { ...testSettings, ...testSettings?.[framework.toLowerCase()] };

      if (mergedTestSettings.ignore) { return []; }
    }

    if (settings.explicitTests && !shouldRunTestExplicitly(pageURL)) { return []; }

    return [{
      widgetName,
      demoName,
      testName: `${widgetName}-${demoName}`,
      pageURL,
      clientScript: globalReadFrom(demoDir, 'client-script.js', null),
      testCode: globalReadFrom(demoDir, 'test-code.js', null),
      testStyles: globalReadFrom(demoDir, 'test-styles.css', null),
      stepsPath: join(demoDir, 'playwright-test-code.js'),
      testGlobals,
      vendorVizWidgets,
    }];
  });
}

export async function loadDemo(page: Page, demo: Demo): Promise<string[]> {
  const pageErrors: string[] = [];

  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));

  const waitForIdle = trackPageActivity(page);

  await mockApi(page);
  await prepareDemoPage(page, demo.pageURL, THEME, demo.clientScript, demo.testGlobals, demo.vendorVizWidgets);
  await openDemo(page, demo.pageURL, waitForIdle);

  if (demo.testStyles) {
    await page.addStyleTag({ content: demo.testStyles });
  }

  if (demo.testCode) {
    await runTestCode(page, demo.testCode);
  }

  if (existsSync(demo.stepsPath)) {
    // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports
    const { default: steps } = require(demo.stepsPath) as { default: DemoSteps };

    await steps(page);
  }

  await waitForIdle();

  return pageErrors;
}
