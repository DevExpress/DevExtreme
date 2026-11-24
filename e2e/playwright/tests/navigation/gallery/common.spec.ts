import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { expectImagesLoaded, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Gallery from '../../../models/gallery';

const YELLOW_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzi8wA8AA9sBsq0bEHsAAAAASUVORK5CYII=';
const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY1hSWg4AA1EBkakDs38AAAAASUVORK5CYII=';
const RED_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/i5aQsABQcCYPaWuk8AAAAASUVORK5CYII=';

test.describe('Click on indicator', () => {
  test('click on indicator item should change selected item', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      showIndicator: true,
      items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
    });

    const gallery = new Gallery(page, '#container');
    const secondIndicatorItem = gallery.getIndicatorItem(1);

    await secondIndicatorItem.element.click();
    await secondIndicatorItem.expectSelected();
  });

  [true, false].forEach((showIndicator) => {
    test(`Gallery. Check normal and focus state. showIndicator=${showIndicator}`, async ({ page }) => {
      await createWidget(page, 'dxGallery', (options: { showIndicator: boolean; items: string[] }) => ({
        height: 110,
        ...options,
        itemTemplate(item: string) {
          const result = $('<div>');

          $('<img>')
            .attr({ src: item })
            .height(100)
            .width(100)
            .appendTo(result);

          return result;
        },
      }), '#container', { arg: { showIndicator, items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL] } });

      await setAttribute(page, '#container', 'style', 'width: 120px; height: 120px;');

      await expectImagesLoaded(page.locator('#container'), 3);
      await testScreenshot(page, `Gallery. showIndicator=${showIndicator}.png`, { element: '#container' });

      await page.locator('#container').click();

      await testScreenshot(page, `Focused gallery. showIndicator=${showIndicator}.png`, { element: '#container' });
    });
  });
});
