import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const customToolbarItems = [
  {
    location: 'before',
    name: 'dateNavigator',
    options: {
      items: [
        { key: 'today', text: 'Today' },
        'prev',
        'next',
        'dateInterval',
      ],
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    options: { icon: 'plus' },
  },
  'viewSwitcher',
];

test('Scheduler default toolbar should works', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 3, 27),
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'scheduler-default toolbar.png', { element: scheduler.toolbar.element });
});

test('Scheduler toolbar should be hided', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 3, 27),
    toolbar: {
      visible: false,
      items: [
        { location: 'before', name: 'viewSwitcher' },
        { location: 'after', name: 'dateNavigator' },
      ],
    },
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.toolbar.element).toHaveCount(0);

  await testScreenshot(page, 'scheduler-hidden-toolbar.png', { element: scheduler.element });
});

[
  { toolbar: { items: customToolbarItems }, description: 'custom toolbar' },
  { toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] }, description: 'toolbar with today' },
  { toolbar: { disabled: true, items: customToolbarItems }, description: 'disabled toolbar' },
].forEach(({ toolbar, description }) => {
  test(`Scheduler ${description} should works`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      toolbar,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(page, `scheduler-${description}.png`, { element: scheduler.toolbar.element });
  });
});
