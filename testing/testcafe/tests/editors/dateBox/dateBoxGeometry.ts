import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/getPostfix';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import DateBox from '../../../model/dateBox';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400));

fixture`DateBox (datetime) geometry (T896846)`
  .page(url(__dirname, '../../container.html'));

const themes = ['material.blue.light', 'generic.light'];
themes.forEach((theme) => {
  test(`Geometry is good (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateBox = new DateBox('#container');

    await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with calendar.png');

    await dateBox.option('type', 'datetime');

    await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime.png');

    await dateBox.option('opened', false);
    await dateBox.option('showAnalogClock', false);
    await dateBox.option('opened', true);

    await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime without analog clock.png');

    await dateBox.option('opened', false);
    await dateBox.option('displayFormat', 'HH:mm');
    await dateBox.option('calendarOptions', { visible: false });
    await dateBox.option('showAnalogClock', false);
    await dateBox.option('opened', true);

    await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime without calendar.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(600, 550);
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
