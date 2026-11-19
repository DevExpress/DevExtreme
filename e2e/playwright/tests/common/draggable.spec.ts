import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';

const AUTO_SCROLLED = 60;

const centerOf = async (element: Locator): Promise<{ x: number; y: number }> => {
  const box = await element.boundingBox();

  if (!box) {
    throw new Error(`${element.toString()} has no box`);
  }

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// The ScrollView auto-scrolls only while the pointer stays at its edge, so the drag stops there
// until the content has scrolled, then goes on along the same line to the end point.
const dragThroughTheEdge = async (
  page: Page,
  element: Locator,
  container: Locator,
  direction: 'down' | 'right',
  scrolled: () => Promise<number>,
): Promise<void> => {
  const start = await centerOf(element);
  const box = await container.boundingBox();

  if (!box) {
    throw new Error(`${container.toString()} has no box`);
  }

  const atTheEdge = direction === 'down'
    ? { x: start.x, y: box.y + box.height - 1 }
    : { x: box.x + box.width - 1, y: start.y };
  const end = direction === 'down'
    ? { x: start.x, y: start.y + 400 }
    : { x: start.x + 400, y: start.y };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(atTheEdge.x, atTheEdge.y, { steps: 10 });

  await expect.poll(scrolled).toBeGreaterThan(AUTO_SCROLLED);

  await page.mouse.move(end.x, end.y, { steps: 10 });
  await page.mouse.up();
};

test.describe('Draggable', () => {
  test('dxDraggable element should not loose its position on dragging with auto-scroll inside ScrollView (T1169590)', async ({ page }) => {
    await page.evaluate(() => {
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
    await createWidget(page, 'dxScrollView', {
      direction: 'both',
    }, '#scrollview');
    await createWidget(page, 'dxDraggable', { }, '#drag-me');

    const draggable = page.locator('#drag-me');
    const container = page.locator('#scrollview .dx-scrollable-container');
    const scrollTop = (): Promise<number> => container.evaluate((element) => element.scrollTop);
    const scrollLeft = (): Promise<number> => container.evaluate((element) => element.scrollLeft);
    const draggableRect = (): Promise<DOMRect> => draggable
      .evaluate((element) => element.getBoundingClientRect().toJSON());

    await dragThroughTheEdge(page, draggable, container, 'down', scrollTop);

    await expect.poll(scrollTop).toBeGreaterThan(AUTO_SCROLLED);
    await expect.poll(async () => (await draggableRect()).top).toBeGreaterThan(400);

    await draggable.scrollIntoViewIfNeeded();

    await dragThroughTheEdge(page, draggable, container, 'right', scrollLeft);

    await expect.poll(scrollLeft).toBeGreaterThan(AUTO_SCROLLED);
    await expect.poll(async () => (await draggableRect()).left).toBeGreaterThan(400);
  });
});
