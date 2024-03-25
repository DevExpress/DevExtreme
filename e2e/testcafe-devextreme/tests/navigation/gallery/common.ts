import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Gallery from 'devextreme-testcafe-models/gallery';
import { setAttribute } from '../../../helpers/domUtils';

const YELLOW_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzi8wA8AA9sBsq0bEHsAAAAASUVORK5CYII=';
const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY1hSWg4AA1EBkakDs38AAAAASUVORK5CYII=';
const RED_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/i5aQsABQcCYPaWuk8AAAAASUVORK5CYII=';

fixture.disablePageReloads`Click on indicator`
  .page(url(__dirname, '../../container.html'));

test('click on indicator item should change selected item', async (t) => {
  const gallery = new Gallery('#container');
  const secondIndicatorItem = gallery.getIndicatorItem(1);

  await t
    .click(secondIndicatorItem.element)
    .expect(secondIndicatorItem.isSelected).ok();
}).before(async () => createWidget('dxGallery', {
  height: 300,
  showIndicator: true,
  items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
}));

[true, false].forEach((showIndicator) => {
  test(`Gallery. Check normal and focus state. showIndicator=${showIndicator}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await setAttribute('#container', 'style', 'width: 120px; height: 120px;');

    await testScreenshot(t, takeScreenshot, `Gallery. showIndicator=${showIndicator}.png`, { element: '#container' });

    await t
      .click('#container');

    await testScreenshot(t, takeScreenshot, `Focused gallery. showIndicator=${showIndicator}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxGallery', {
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
  }));
});
