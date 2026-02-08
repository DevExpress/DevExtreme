import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler header customization`
  .page(url(__dirname, '../../../container.html'));

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

test('Scheduler default toolbar should works', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await testScreenshot(t, takeScreenshot, 'scheduler-default toolbar.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 3, 27),
}));

test('Scheduler toolbar should be hided', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.toolbar.element.exists).notOk();

  await testScreenshot(t, takeScreenshot, 'scheduler-hidden-toolbar.png', { element: scheduler.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 3, 27),
  toolbar: {
    visible: false,
    items: [
      { location: 'before', name: 'viewSwitcher' },
      { location: 'after', name: 'dateNavigator' },
    ],
  },
}));

[
  { toolbar: { items: customToolbarItems }, description: 'custom toolbar' },
  { toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] }, description: 'toolbar with today' },
  { toolbar: { disabled: true, items: customToolbarItems }, description: 'disabled toolbar' },
].forEach(({ toolbar, description }) => {
  test(`Scheduler ${description} should works`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await testScreenshot(t, takeScreenshot, `scheduler-${description}.png`, { element: scheduler.toolbar.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    currentDate: new Date(2021, 3, 27),
    toolbar,
  }));
});
