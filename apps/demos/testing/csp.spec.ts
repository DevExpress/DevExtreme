import { existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { expect, test } from '@playwright/test';
import {
  FRAMEWORKS,
  globalReadFrom,
  shouldRunFramework,
  shouldRunTestAtIndex,
  updateConfig,
} from '../utils/visual-tests/matrix-test-core';
import { mockApi } from '../utils/visual-tests/playwright/api-mocks';
import { BASE_URL } from '../utils/visual-tests/playwright/const';
import { openDemo, prepareCspPage, trackPageActivity } from '../utils/visual-tests/playwright/demo-page';

interface CspReport {
  'blocked-uri'?: string;
  'effective-directive'?: string;
  'violated-directive'?: string;
  'source-file'?: string;
  'line-number'?: number;
}

const DEMOS_ROOT = join(__dirname, '..');

// UI widgets, viz widgets (a root <svg class="dx...">) and the new-generation widgets.
const RENDERED_WIDGET = '.dx-widget, svg[class^="dx"], .dx-cardview, .dx-pagination';

updateConfig({ explicitTestArgs: [], verbose: false });

const demoPaths = glob.sync('Demos/*/*', { cwd: DEMOS_ROOT }).sort();

Object.values(FRAMEWORKS).forEach((approach) => {
  if (!shouldRunFramework(approach)) { return; }

  // Every demo of the framework is checked: the skip list and the demo settings are about screenshots.
  test.describe(`${approach} CSP`, () => {
    demoPaths.forEach((demoPath, index) => {
      const demoDir = join(DEMOS_ROOT, demoPath);

      if (!shouldRunTestAtIndex(index + 1) || !existsSync(join(demoDir, approach, 'index.html'))) { return; }

      const [, widgetName, demoName] = demoPath.split(/[/\\]/);
      const pageURL = `${BASE_URL}/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;
      const clientScript = globalReadFrom(demoDir, 'client-script.js', null);

      test(`${widgetName}-${demoName}`, async ({ page }) => {
        const violations = new Set<string>();
        const waitForIdle = trackPageActivity(page);

        await mockApi(page);
        // The browser sends a report on every violation of the policy, a blocked eval() caught by
        // the page included. The route is added last, so it comes before the catch-all API mock.
        await page.route('**/csp-report', async (route) => {
          const report = (JSON.parse(route.request().postData() ?? '{}') as { 'csp-report'?: CspReport })['csp-report'] ?? {};

          violations.add(`${report['effective-directive'] ?? report['violated-directive']}: ${report['blocked-uri'] || 'N/A'}`
            + ` (${report['source-file'] ?? 'N/A'}:${report['line-number'] ?? '?'})`);
          await route.fulfill({ status: 204 });
        });
        await prepareCspPage(page, clientScript);

        // A blocked resource can keep the page from loading; the violation is the reason to report then.
        let loadError: unknown = null;

        try {
          await openDemo(page, pageURL, waitForIdle);
          await waitForIdle();
        } catch (error) {
          loadError = error;
        }

        expect([...violations], 'CSP violations').toEqual([]);

        if (loadError) { throw loadError; }

        await expect(page.locator(RENDERED_WIDGET).first(), 'a rendered widget').toBeAttached();
      });
    });
  });
});
