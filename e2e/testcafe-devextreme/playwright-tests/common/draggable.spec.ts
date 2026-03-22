import { test, expect } from '@playwright/test';
import { createWidget } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Draggable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const init = async () => page.evaluate(() => {
    $('<div>', {
      id: 'scrollview',
      width: '400px',
      height: '400px',
    })
      .css({
        position: 'absolute',
        top: 0,
        padding: '20px',
        background: '#f18787',
      })
      .appendTo('#container');

    $('<div>', {
      id: 'scrollview-content',
      height: '500px',
      width: '500px',
    }).appendTo('#scrollview');

    $('<div>', {
      id: 'drag-me',
    })
      .css({
        'background-color': 'blue',
        display: 'inline-block',
      })
      .appendTo('#scrollview-content');
    $('#drag-me').append('DRAG ME!!!');
  });

  test('dxDraggable element should not loose its position on dragging with auto-scroll inside ScrollView (T1169590)', async ({ page }) => {

    await init();
    await createWidget(page, 'dxScrollView', {
      direction: 'both',
    }, '#scrollview');
    await createWidget(page, 'dxDraggable', { }, '#drag-me');

    const draggable = page.locator('#drag-me');
    const scrollable = page.locator('#scrollview');

    await (async () => {
        const box = await draggable.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 400, { steps: 10 });
          await page.mouse.up();
        }
      })()

      .expect(scrollable.getContainer()().scrollTop)
      .gt(60);

    await page.expect((await draggable().boundingClientRect).top)
      .gt(400);

    await draggable.scrollIntoViewIfNeeded();

    await (async () => {
        const box = await draggable.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 400, box.y + box.height / 2 + 0, { steps: 10 });
          await page.mouse.up();
        }
      })()

      .expect(scrollable.getContainer()().scrollLeft)
      .gt(60);

    await page.expect((await draggable().boundingClientRect).left)
      .gt(400);

    });
});
