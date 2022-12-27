import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
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
  safeSizeTest(`Geometry is good (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateBox = new DateBox('#container');

    await t
      .expect(await takeScreenshot(`Datebox with calendar${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('type', 'datetime');
    await t
      .expect(await takeScreenshot(`Datebox with datetime${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('opened', false);
    await dateBox.option({ showAnalogClock: false });
    await dateBox.option('opened', true);

    await t
      .expect(await takeScreenshot(`Datebox with datetime without analog clock${getThemePostfix(theme)}`))
      .ok();

    await dateBox.option('opened', false);
    await dateBox.option({ displayFormat: 'HH:mm', calendarOptions: { visible: false }, showAnalogClock: true });
    await dateBox.option('opened', true);

    await t
      .expect(await takeScreenshot(`Datebox with datetime without calendar${getThemePostfix(theme)}`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [600, 500]).before(async () => {
    await changeTheme(theme);
    await waitFont();

    return createWidget('dxDateBox', {
      opened: true,
      pickerType: 'calendar',
      width: 200,
      value: new Date(1.5e12),
    });
  });
});
