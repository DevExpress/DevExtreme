import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox (datetime) geometry (T896846)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const waitFont = async () => page.evaluate(() => (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400));

  test('Geometry is good', async ({ page }) => {

    await waitFont();

    await createWidget(page, 'dxDateBox', {
      pickerType: 'calendar',
      width: 200,
      value: new Date(1.5e12),
    });

    const dateBox = page.locator('#container');

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
