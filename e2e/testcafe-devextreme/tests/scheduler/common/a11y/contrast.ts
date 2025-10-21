import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`a11y - contrast`
  .page(url(__dirname, '../../../container.html'));

[
  Themes.fluentBlue,
  Themes.fluentBlueDark,
].forEach((theme) => {
  test(`Scheduler a11y: Insufficient contrast of day numbers in the MonthView (${theme})`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`month_day_number_contrast-${theme}`, scheduler.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      currentView: 'month',
      currentDate: new Date(2020, 10, 25),
    });
  });
});
