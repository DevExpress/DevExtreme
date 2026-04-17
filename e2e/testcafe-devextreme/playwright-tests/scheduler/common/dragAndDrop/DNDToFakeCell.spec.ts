import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, appendElementTo } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Drag-n-drop to fake cell', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should not select cells outside the scheduler(T1040795)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', { id: 'scheduler' });
    await appendElementTo(page, '#container', 'div', { id: 'fake', style: 'width: 400px; height: 100px;' });
    await page.evaluate(() => {
      $('#fake').addClass('scheduler-date-table-cell');
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'app',
        startDate: new Date(2021, 3, 26, 2),
        endDate: new Date(2021, 3, 26, 2, 30),
      }],
      views: ['day'],
      currentDate: new Date(2021, 3, 26),
      height: 200,
      width: 400,
    }, '#scheduler');

    const element = page.locator('#scheduler .dx-scheduler-appointment').filter({ hasText: 'app' });

    const box = await element.boundingBox();
    await element.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 200, { steps: 10 });
    await page.mouse.up();

    const hasDraggableClass = await page.locator('#fake').evaluate(
      (el) => el.classList.contains('dx-scheduler-date-table-droppable-cell'),
    );
    expect(hasDraggableClass).toBe(false);
  });
});
