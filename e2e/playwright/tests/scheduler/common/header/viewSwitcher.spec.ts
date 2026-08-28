import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import SelectBox from '../../../../models/selectBox';

const defaultSelectBoxValue = 'Samantha Bright';

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

  const scheduler = new Scheduler(page, '#container');
  const { toolbar: { viewSwitcher } } = scheduler;

  await viewSwitcher.getButton('Day').element.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await viewSwitcher.getButton('Some week').element.click();

  expect(await scheduler.checkViewType('week')).toBe(true);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  expect(await scheduler.checkViewType('day')).toBe(true);
});

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

  const scheduler = new Scheduler(page, '#container');
  const selectBox = new SelectBox(page, '.dx-selectbox');

  await selectBox.open();

  const list = await selectBox.getList();

  await list.getItem(0).element.click();

  expect(await selectBox.getValue()).toBe(defaultSelectBoxValue);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await scheduler.toolbar.viewSwitcher.getButton('Month').element.click();

  expect(await scheduler.checkViewType('month')).toBe(true);
  expect(await selectBox.getValue()).toBe(defaultSelectBoxValue);
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

    const { toolbar } = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `toolbar-without-view-switcher-(useDropDownViewSwitcher=${useDropDownViewSwitcher}).png`,
      { element: toolbar.element },
    );
  });
});
