import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`Calendar`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  test(`Calendar with showWeekNumbers rendered correct (${theme})`, async (t) => {
    await t.expect(await compareScreenshot(t, `calendar-with-showWeekNumbers-theme=${theme.replace(/\./g, '-')}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 300);
    await changeTheme(theme);

    await createWidget('dxCalendar', {
      value: new Date('01.01.2022'),
      showWeekNumbers: true,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
