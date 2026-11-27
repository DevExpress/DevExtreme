import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const newRowPositionOptions = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];

const setNewRowPosition = async (page: Page, newRowPosition: string): Promise<void> => {
  const index = newRowPositionOptions.indexOf(newRowPosition);
  await page.locator('#newRowPositionSelectBox').click();
  await page.locator('.dx-dropdownlist-popup-wrapper .dx-list-item').nth(index).click();
};

const clickAddButton = async (page: Page): Promise<void> => {
  await page.locator('.dx-datagrid-addrow-button').first().click();
};

const clickCancelButton = async (page: Page): Promise<void> => {
  await page.locator('.dx-command-edit .dx-link-cancel').first().click();
};

const selectPage = async (page: Page, pageNumber: number): Promise<void> => {
  await page.locator('.dx-page').filter({ hasText: `${pageNumber}` }).first().click();
};

const newRowPositionTestTemplate = (
  { newRowPosition, pageNumber }: { newRowPosition: string; pageNumber: number },
) => async ({ page }: { page: Page }): Promise<void> => {
  await selectPage(page, pageNumber);
  await setNewRowPosition(page, newRowPosition);
  await clickAddButton(page);

  // The last page has its own etalons: the TestCafe test wrote both pages into one file.
  const pageSuffix = pageNumber === 1 ? '' : '_last_page';

  await testScreenshot(page, `datagrid_CustomNewRecordPosition_${newRowPosition}${pageSuffix}_added.png`);

  await clickCancelButton(page);
};

describeManualTest('DataGrid', 'NewRecordPosition', { width: 900, height: 600 }, () => {
  newRowPositionOptions.forEach((newRowPosition) => {
    test(`newRowPosition - ${newRowPosition}`, newRowPositionTestTemplate({
      newRowPosition,
      pageNumber: 1,
    }));
  });

  ['first', 'last'].forEach((newRowPosition) => {
    test(`newRowPosition - ${newRowPosition} - last page`, newRowPositionTestTemplate({
      newRowPosition,
      pageNumber: 42,
    }));
  });

  test('insertAfterKey', async ({ page }) => {
    await selectPage(page, 1);

    await page.locator('.dx-command-edit .dx-link.dx-icon-add').first().click();

    await testScreenshot(page, 'datagrid_CustomNewRecordPosition_insertAfterKey_clicked.png');
  });
});
