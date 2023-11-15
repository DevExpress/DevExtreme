import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Gallery from '../../../model/gallery';

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
    await t
      .expect(await takeScreenshot(`Gallery. showIndicator=${showIndicator}.png`))
      .ok();

    await t
      .click('#container');

    await t
      .expect(await takeScreenshot(`Focused gallery. showIndicator=${showIndicator}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxGallery', {
    height: 300,
    showIndicator,
    items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
  }));
});
