import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-n-drop to fake cell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Should not select cells outside the scheduler(T1040795)', async () => {
  // Scheduler on '#container'

  const { element } = page.locator('.dx-scheduler-appointment').filter({ hasText: 'app' });

  await t
    .drag(element, 0, 200)

    .expect(Selector('#fake').hasClass('dx-scheduler-date-table-droppable-cell'))
    .eql(false);
});

// TODO: .before() block not converted - move to test setup
// {
  await appendElementTo('#container', 'div', 'scheduler');
  await appendElementTo('#container', 'div', 'fake', {
    width: '400px', height: '100px',
  });
  await ClientFunction(() => {
    $('#fake').addClass('scheduler-date-table-cell');
  })();

  return createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'app',
        startDate: new Date(2021, 3, 26, 2),
        endDate: new Date(2021, 3, 26, 2, 30),
      },
    ],
    views: ['day'],
    currentDate: new Date(2021, 3, 26),
    height: 200,
    width: 400,
  }, '#scheduler');
});
});
