import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import DateBox from '../../../model/dateBox';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400));

fixture.disablePageReloads`DateBox (datetime) geometry (T896846)`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Geometry is good', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dateBox = new DateBox('#container');

  await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with calendar.png');

  await dateBox.option('type', 'datetime');

  await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime.png');

  await dateBox.option('opened', false);
  await dateBox.option({ showAnalogClock: false });
  await dateBox.option('opened', true);

  await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime without analog clock.png');

  await dateBox.option('opened', false);
  await dateBox.option({ displayFormat: 'HH:mm', calendarOptions: { visible: false }, showAnalogClock: true });
  await dateBox.option('opened', true);

  await takeScreenshotInTheme(t, takeScreenshot, 'Datebox with datetime without calendar.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [600, 550]).before(async () => {
  await waitFont();

  return createWidget('dxDateBox', {
    opened: true,
    pickerType: 'calendar',
    width: 200,
    value: new Date(1.5e12),
  });
});
