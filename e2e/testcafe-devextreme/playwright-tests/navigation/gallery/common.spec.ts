import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Click on indicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const YELLOW_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzi8wA8AA9sBsq0bEHsAAAAASUVORK5CYII=';
  const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY1hSWg4AA1EBkagDs38AAAAASUVORK5CYII=';
  const RED_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/i5aQsABQcCYPaWuk8AAAAASUVORK5CYII=';

  test('click on indicator item should change selected item', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
    height: 300,
    showIndicator: true,
    items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
  });

    const secondIndicatorItem = page.locator('#container .dx-gallery-indicator-item').nth(1);

    await secondIndicatorItem.click();
    const isSelected = await page.evaluate(() => {
      const gallery = ($('#container') as any).dxGallery('instance');
      return gallery.option('selectedIndex') === 1;
    });
    expect(isSelected).toBe(true);

    });

  [true, false].forEach((showIndicator) => {
    test(`Gallery. Check normal and focus state. showIndicator=${showIndicator}`, async ({ page }) => {

      await createWidget(page, 'dxGallery', {
        height: 110,
        showIndicator,
        items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
        itemTemplate(item: string) {
          const result = $('<div>');

          $('<img>')
            .attr({ src: item })
            .height(100)
            .width(100)
            .appendTo(result);

          return result;
        },
      });

      await setAttribute(page, '#container', 'style', 'width: 120px; height: 120px;');


      await testScreenshot(page, `Gallery. showIndicator=${showIndicator}.png`, { element: '#container' });

      await page.locator('#container').click();

      await testScreenshot(page, `Focused gallery. showIndicator=${showIndicator}.png`, { element: '#container' });

    });
  });
});
