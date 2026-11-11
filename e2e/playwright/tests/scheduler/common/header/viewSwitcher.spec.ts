import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import { classMatcher } from '../../../../models/internal/classMatcher';
import Scheduler, { VIEW_TYPE_CLASS } from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const getSelectBoxInput = (page: Page): Locator => page.locator('.dx-selectbox .dx-texteditor-input');

const openSelectBoxList = async (page: Page): Promise<Locator> => {
  const input = getSelectBoxInput(page);

  await page.locator('.dx-selectbox').evaluate((element) => {
    ($(element) as any).dxSelectBox('instance').open();
  });
  await expect(input).toHaveAttribute('aria-owns', /.+/);

  const popupId = await input.getAttribute('aria-owns');

  return page.locator(`[id="${popupId}"] .dx-list .dx-list-item:not(.nested-item)`);
};

test.describe('Scheduler header - View switcher', () => {
  test('it should correctly switch a differently typed views (T1080992)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [
        'day',
        {
          type: 'week',
          name: 'Some week',
        },
      ],
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const {
      toolbar: {
        viewSwitcher,
      },
    } = scheduler;

    await viewSwitcher.getButton('Day').element.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await viewSwitcher.getButton('Some week').element.click();
    await expect(scheduler.workSpace).toHaveClass(classMatcher(VIEW_TYPE_CLASS.week));
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(scheduler.workSpace).toHaveClass(classMatcher(VIEW_TYPE_CLASS.day));
  });

  const defaultSelectBoxValue = 'Samantha Bright';

  test('Changing view does not reset toolbar items state', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['week', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 27),
      toolbar: {
        items: [
          {
            location: 'before',
            widget: 'dxSelectBox',
            options: { items: [defaultSelectBoxValue] },
          },
          'viewSwitcher',
        ],
        allowKeyboardNavigation: false,
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const selectBoxInput = getSelectBoxInput(page);

    const listItems = await openSelectBoxList(page);

    await listItems.nth(0).click();
    await expect(selectBoxInput).toHaveValue(defaultSelectBoxValue);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await scheduler.toolbar.viewSwitcher.getButton('Month').element.click();
    await expect(scheduler.workSpace).toHaveClass(classMatcher(VIEW_TYPE_CLASS.month));

    await expect(selectBoxInput).toHaveValue(defaultSelectBoxValue);
  });

  [true, false].forEach((useDropDownViewSwitcher) => {
    test(`view switcher should not be displayed if views has only one element when useDropDownViewSwitcher: ${useDropDownViewSwitcher}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2020, 2, 2),
        currentView: 'day',
        views: ['day'],
        useDropDownViewSwitcher,
        height: 580,
      });

      const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

      await testScreenshot(
        page,
        `toolbar-without-view-switcher-(useDropDownViewSwitcher=${useDropDownViewSwitcher}).png`,
        { element: toolbar.element },
      );
    });
  });
});
