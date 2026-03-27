import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe('Offset: Agenda', () => {
  test('Agenda view should not be affected by root offset option', async ({ page }) => {
    for (const offset of [0, -240, 240]) {
      await setupPage(page);

      await createWidget(page, 'dxScheduler', {
        dataSource: [
          {
            startDate: '2023-09-04T00:00:00',
            endDate: '2023-09-04T02:00:00',
            text: '#0 04: 00 -> 02',
          },
          {
            startDate: '2023-09-04T10:00:00',
            endDate: '2023-09-04T12:00:00',
            text: '#1 04: 10 -> 12',
          },
          {
            startDate: '2023-09-04T23:00:00',
            endDate: '2023-09-05T01:00:00',
            text: '#2 04: 22 -> 01',
          },
        ],
        currentView: 'agenda',
        currentDate: '2023-09-03',
        height: 800,
        offset,
      });

      const workSpace = page.locator('.dx-scheduler-work-space');
      await testScreenshot(page, `offset_agenda-not-affected_offset-${offset}.png`, { element: workSpace });
    }
  });
});
