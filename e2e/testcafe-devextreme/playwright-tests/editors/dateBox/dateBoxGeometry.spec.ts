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

  test('Geometry is good', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 550 });

    await page.evaluate(() => (window as any).DevExpress.ui.themes.waitWebFont('1234567890APM/:', 400));

    await createWidget(page, 'dxDateBox', {
      pickerType: 'calendar',
      width: 200,
      value: new Date(1.5e12),
    });

    await page.evaluate(() => {
      ($('#container') as any).dxDateBox('instance').option('opened', true);
    });

    await testScreenshot(page, 'Datebox with calendar.png');

    await page.evaluate(() => {
      ($('#container') as any).dxDateBox('instance').option('opened', false);
      ($('#container') as any).dxDateBox('instance').option('type', 'datetime');
      ($('#container') as any).dxDateBox('instance').option('opened', true);
    });

    await testScreenshot(page, 'Datebox with datetime.png');

    await page.evaluate(() => {
      ($('#container') as any).dxDateBox('instance').option('opened', false);
      ($('#container') as any).dxDateBox('instance').option({ showAnalogClock: false });
      ($('#container') as any).dxDateBox('instance').option('opened', true);
    });

    await testScreenshot(page, 'Datebox with datetime without analog clock.png');

    await page.evaluate(() => {
      ($('#container') as any).dxDateBox('instance').option('opened', false);
      ($('#container') as any).dxDateBox('instance').option({ displayFormat: 'HH:mm', calendarOptions: { visible: false }, showAnalogClock: true });
      ($('#container') as any).dxDateBox('instance').option('opened', true);
    });

    await testScreenshot(page, 'Datebox with datetime without calendar.png');
  });
});
