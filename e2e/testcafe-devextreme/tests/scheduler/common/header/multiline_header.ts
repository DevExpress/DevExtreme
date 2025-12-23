import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler multiline header`
  .page(url(__dirname, '../../../container.html'));

const buttons = Array.from({ length: 12 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

[true, false].forEach((multiline) => {
  test(`Scheduler [multiline=${multiline}] toolbar`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await testScreenshot(
      t,
      takeScreenshot,
      `scheduler-multiline-${multiline}-toolbar.png`,
      { element: scheduler.toolbar.element },
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    height: 200,
    toolbar: {
      multiline,
      items: [
        'dateNavigator',
        ...buttons,
        'viewSwitcher',
      ],
    },
  }));
});
