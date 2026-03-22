import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterialBased } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const ITEM_HEIGHT = 40;

  const TIME_VIEW_FIELD_CLASS = 'dx-timeview-field';
  const SELECT_BOX_CONTAINER_CLASS = 'dx-selectbox-container';

  if (!isMaterialBased()) {
    [[11, 12, 1925], [10, 23, 2001]].forEach(([month, day, year]) => {
      test(`Rollers should be scrolled correctly when value is changed to ${day}/${month}/${year} using kbn and valueChangeEvent=keyup (T948310)`, async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
        pickerType: 'rollers',
        openOnFieldClick: false,
        useMaskBehavior: true,
        valueChangeEvent: 'keyup',
      });

        const dateBox = page.locator('#container');
        const { dropDownEditorButton } = dateBox;

        await page.click(dropDownEditorButton);

        await page.click(DateBox.getDoneButton());

        await page.typeText(dateBox.input, `${month}${day}${year}`);

        await page.click(dropDownEditorButton);

        const views = {
          month: month - 1,
          day: day - 1,
          year: year - 1900,
        };
        for (const viewName of Object.keys(views)) {
          const scrollTop = await DateBox.getRollerScrollTop(viewName);

          expect(scrollTop).toBe(views[viewName] * ITEM_HEIGHT, `${viewName} view is scrolled correctly`);
        });

    });
    });
  }

  test('DateBox with datetime and root element as container (T1193495)', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    value: new Date(2022, 10, 23, 17, 23),
    type: 'datetime',
    pickerType: 'calendar',
    opened: true,
    width: 300,
    dropDownOptions: {
      container: '#container',
    },
  }, '#container');

    await testScreenshot(page, 'DateBox with datetime and root element as container.png', { element: '#container' });

    });

  test('DateBox with datetime and opened AM/PM select (T1312677)', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    value: new Date(2022, 10, 23, 17, 23),
    type: 'datetime',
    pickerType: 'calendar',
    opened: true,
    dropDownOptions: {
      container: '#container',
    },
  }, '#container');

    const timeViewSelect = page.locator(`#container .${TIME_VIEW_FIELD_CLASS} .${SELECT_BOX_CONTAINER_CLASS}`);

    await page.click(timeViewSelect);

    await testScreenshot(page,
      'DateBox with datetime and opened AMPM select.png',
      { element: '#container' },

    });
});
