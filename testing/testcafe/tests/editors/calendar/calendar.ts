import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`Calendar`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  test(`Calendar with showWeekNumbers rendered correct (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`calendar-with-showWeekNumbers-theme=${theme.replace(/\./g, '-')}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    await createWidget('dxCalendar', {
      value: new Date('01.01.2022'),
      showWeekNumbers: true,
    });
  });
});

test('Calendar with showWeekNumbers rendered correct for last week of year value', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('calendar-with-showWeekNumbers-last-week.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('12.31.2021'),
    showWeekNumbers: true,
  });
});

test('Calendar with showWeekNumbers rendered correct with rtlEnabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('calendar-with-showWeekNumbers-rtl-enabled.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('01.01.2022'),
    showWeekNumbers: true,
    rtlEnabled: true,
  });
});
