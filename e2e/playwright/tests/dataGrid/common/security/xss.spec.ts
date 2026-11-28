import { expect, test } from '../../../../fixtures';
import { openTestPage } from '../../../../helpers/testPageUtils';
import FilterBuilder from '../../../../models/filterBuilder';

const XSS_PAGE_URL = '/e2e/playwright/tests/dataGrid/common/security/pages/XSS.html';

test.describe('XSS', () => {
  test('The XSS script does not run when the markup has been replaced with text', async ({ page }) => {
    // The page shows its widgets as it loads, so the alerts are caught before it opens.
    const alerts: string[] = [];

    page.on('dialog', async (dialog) => {
      if (dialog.type() === 'alert') {
        alerts.push(dialog.message());
      }

      await dialog.dismiss();
    });

    await openTestPage(page, XSS_PAGE_URL);

    const filterBuilder = new FilterBuilder(page, '#filter-builder');
    const group = filterBuilder.getField(0, 'groupOperation');

    await group.element.click();
    await expect(FilterBuilder.getPopupTreeView(page)).toBeVisible();
    await FilterBuilder.getPopupTreeViewNode(page).click();

    expect(alerts, 'XSS alert was invoked!').toEqual([]);
  });
});
