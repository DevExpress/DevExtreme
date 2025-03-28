import { compareScreenshot, createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

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
  const scheduler = new Scheduler('#container');

  await t.expect(await compareScreenshot(t, 'scheduler-default toolbar.png', scheduler.element)).ok();
}).before(async () => createWidget('dxScheduler', {
  views: ['day', 'week', 'workWeek', 'month'],
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 27),
  height: 200,
}));

[
  { toolbar: { items: customToolbarItems }, description: 'custom toolbar' },
  { toolbar: { visible: false }, description: 'hided toolbar' },
  { toolbar: { disabled: true, items: customToolbarItems }, description: 'disabled toolbar' },
].forEach(({ toolbar, description }) => {
  test(`Scheduler ${description} should works`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t.expect(await compareScreenshot(t, `scheduler-${description}.png`, scheduler.element)).ok();
  }).before(async () => createWidget('dxScheduler', {
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    height: 200,
    toolbar,
  }));
});

test('Scheduler today button should works', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t
    .expect(await takeScreenshot('scheduler-today-button.png', scheduler.element))
    .ok()
    .click(scheduler.toolbar.todayButton);

  const currentDate = await scheduler.option('currentDate') as Date;
  const today = new Date();

  currentDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  await t
    .expect(currentDate)
    .eql(today)
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  views: ['day', 'week', 'workWeek', 'month'],
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 27),
  height: 200,
  toolbar: {
    items: ['today', 'dateNavigator', 'viewSwitcher'],
  },
}));
