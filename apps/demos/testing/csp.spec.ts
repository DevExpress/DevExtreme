// Opens every demo with the Content-Security-Policy header of utils/visual-tests/playwright/csp-policy.js
// and fails on a violation. Run it from apps/demos:
//   pnpm run csp-check                                # every demo of every framework
//   pnpm run csp-check --grep "Angular CSP"           # one framework; likewise jQuery, React, Vue
//   pnpm run csp-check --grep "jQuery CSP Map-"       # demos of one component
import { existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { expect, test, type Page } from '@playwright/test';
import {
  FRAMEWORKS,
  globalReadFrom,
  shouldRunFramework,
  shouldRunTestAtIndex,
  updateConfig,
} from '../utils/visual-tests/matrix-test-core';
import { mockApi } from '../utils/visual-tests/playwright/api-mocks';
import { BASE_URL } from '../utils/visual-tests/playwright/const';
import { prepareCspPage, trackPageActivity } from '../utils/visual-tests/playwright/demo-page';

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

const ERROR_LINES = 8;

updateConfig({ explicitTestArgs: [], verbose: false });

// A violation must fail the run, not pass on a retry as flaky: the test itself retries a failed load
// once, and only when the load came with no violation. Two loads may take longer than one test.
test.describe.configure({ retries: 0, timeout: 120000 });

// The page is not waited for its stylesheets, as the screenshot tests do: a stylesheet blocked by the
// policy never loads, and its report is all the test needs.
async function openCspDemo(page: Page, url: string, waitForIdle: () => Promise<void>): Promise<void> {
  await page.goto(url);
  await waitForIdle();

  // An Angular demo shows "Loading..." in <demo-app> until the application has bootstrapped.
  if (await page.locator('demo-app').count()) {
    await page.waitForFunction(
      () => document.querySelector<HTMLElement>('demo-app')?.innerText !== 'Loading...',
      null,
      { timeout: 20000 },
    );
    await waitForIdle();
  }

  // A demo can request a resource from a timer after the page has settled.
  await page.waitForTimeout(500);
  await waitForIdle();
}

// The load error and up to two distinct page errors, to tell why a demo did not load.
function describeFailure(loadError: unknown, pageErrors: string[]): string {
  const errors = [
    ...(loadError ? [`load error: ${loadError instanceof Error ? loadError.message : String(loadError)}`] : []),
    ...[...new Set(pageErrors)].slice(0, 2).map((error) => `page error: ${error}`),
  ];

  return errors.map((error) => `\n${error.split('\n').slice(0, ERROR_LINES).join('\n')}`).join('');
}

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
        const pageErrors: string[] = [];
        const waitForIdle = trackPageActivity(page);

        page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));
        // A blocked resource is logged as an error too; it is reported as a violation already.
        page.on('console', (message) => {
          if (message.type() === 'error' && !message.text().includes('Content Security Policy')) {
            pageErrors.push(message.text());
          }
        });

        await mockApi(page);
        // The browser reports a violation of the policy, a blocked eval() that the page caught included.
        // The route is added last, so it comes before the catch-all API mock.
        await page.route('**/csp-report', async (route) => {
          const body = route.request().postData() ?? '';

          try {
            const report = (JSON.parse(body) as { 'csp-report'?: CspReport })['csp-report'] ?? {};

            violations.add(`${report['effective-directive'] ?? report['violated-directive']}: ${report['blocked-uri'] || 'N/A'}`
              + ` (${report['source-file'] ?? 'N/A'}:${report['line-number'] ?? '?'})`);
          } catch {
            violations.add(`an unreadable report: ${body}`);
          } finally {
            // An unanswered report would keep the page from settling.
            await route.fulfill({ status: 204 });
          }
        });
        await prepareCspPage(page, clientScript);

        const load = async (): Promise<unknown> => {
          try {
            await openCspDemo(page, pageURL, waitForIdle);

            return null;
          } catch (error) {
            return error;
          }
        };

        let loadError = await load();

        if (loadError && !violations.size) {
          loadError = await load();
        }

        // A blocked resource can keep the page from loading; the violation is the reason to report then.
        expect([...violations], `CSP violations${describeFailure(loadError, pageErrors)}`).toEqual([]);

        if (loadError) {
          throw new Error(`The demo did not load${describeFailure(loadError, pageErrors)}`);
        }

        await expect(page.locator(RENDERED_WIDGET).first(), `a rendered widget${describeFailure(null, pageErrors)}`).toBeAttached();
      });
    });
  });
});
