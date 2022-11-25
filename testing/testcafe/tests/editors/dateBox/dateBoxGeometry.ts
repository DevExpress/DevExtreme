import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import DateBox from '../../../model/dateBox';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400));

fixture`DateBox (datetime) geometry (T896846)`
  .page(url(__dirname, '../../container.html'));

const themes = ['material.blue.light', 'generic.light'];
themes.forEach((theme) => {
  test(`Geometry is good (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateBox = new DateBox('#container');

    await t
      .expect(await takeScreenshot(`Datebox with calendar${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('type', 'datetime');

    await t
      .expect(await takeScreenshot(`Datebox with datetime${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('showAnalogClock', false);

    await t
      .expect(await takeScreenshot(`Datebox with datetime without analog clock${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('displayFormat', 'HH:mm');
    await dateBox.option('calendarOptions', { visible: false });

    await t
      .expect(await takeScreenshot(`Datebox with datetime without calendar${getThemePostfix(theme)}`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(600, 600);
    await changeTheme(theme);
    await waitFont();

    return createWidget('dxDateBox', {
      opened: true,
      pickerType: 'calendar',
      width: 200,
      value: new Date(1.5e12),
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
