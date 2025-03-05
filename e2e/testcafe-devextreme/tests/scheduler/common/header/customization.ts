import { compareScreenshot } from 'devextreme-screenshot-comparer';
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

[
  { description: 'default toolbar' },
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
