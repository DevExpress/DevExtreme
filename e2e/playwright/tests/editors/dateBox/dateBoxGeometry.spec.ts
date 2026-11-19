import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DateBox from '../../../models/dateBox';

test.describe('DateBox (datetime) geometry (T896846)', () => {
  test.use({ browserSize: [600, 550] });

  test('Geometry is good', async ({ page }) => {
    await page.evaluate(async () => {
      await (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400);
    });

    await createWidget(page, 'dxDateBox', {
      pickerType: 'calendar',
      width: 200,
      value: new Date(1.5e12),
    });

    const dateBox = new DateBox(page, '#container');

    await dateBox.option('opened', true);

    await testScreenshot(page, 'Datebox with calendar.png');

    await dateBox.option('opened', false);
    await dateBox.option('type', 'datetime');
    await dateBox.option('opened', true);

    await testScreenshot(page, 'Datebox with datetime.png');

    await dateBox.option('opened', false);
    await dateBox.option({ showAnalogClock: false });
    await dateBox.option('opened', true);

    await testScreenshot(page, 'Datebox with datetime without analog clock.png');

    await dateBox.option('opened', false);
    await dateBox.option({ displayFormat: 'HH:mm', calendarOptions: { visible: false }, showAnalogClock: true });
    await dateBox.option('opened', true);

    await testScreenshot(page, 'Datebox with datetime without calendar.png');
  });
});
