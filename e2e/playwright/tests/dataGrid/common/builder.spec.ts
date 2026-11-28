import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import FilterBuilder from '../../../models/filterBuilder';
import { DateBoxPopup } from '../../../models/filterBuilder/dateboxPopup';

const scrollTo = (page: Page, x: number, y: number): Promise<void> => page.evaluate(
  ({ left, top }) => { window.scrollTo(left, top); },
  { left: x, top: y },
);

test.describe('Filter Builder', () => {
  test('Field menu should be opened on field click if window scroll exists (T852701)', async ({ page }) => {
    const filter = [] as any[];
    const fields = [] as any[];

    for (let i = 1; i <= 50; i += 1) {
      if (i > 1) {
        filter.push('or');
      }
      const name = `Test${i}`;
      filter.push([name, '=', 'Test']);
      fields.push({ dataField: name });
    }

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
    });

    const filterBuilder = new FilterBuilder(page, DEFAULT_SELECTOR);
    const lastField = filterBuilder.getField(49);

    await scrollTo(page, 0, 10000);
    await lastField.element.click();

    await expect(lastField.element).toHaveText('Test 50');
    await expect(FilterBuilder.getPopupTreeView(page)).toBeVisible();
  });

  test('DateBox should not close on click (T1051831)', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [{
        dataField: 'datetime',
        dataType: 'datetime',
        editorOptions: {
          pickerType: 'rollers',
        },
      }],
      value: ['datetime', '=', new Date()],
    });

    const filterBuilder = new FilterBuilder(page, DEFAULT_SELECTOR);
    const popup = new DateBoxPopup(page);

    const field = filterBuilder.getField(0, 'item');

    await field.getValueText().click();
    await field.getDateBox().click();
    await popup.getDoneButton().click();

    const overlayContent = popup.getContent();

    await expect(overlayContent.first()).toBeAttached();
  });
});
