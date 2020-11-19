import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Gallery from '../../model/gallery';

const YELLOW_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzi8wA8AA9sBsq0bEHsAAAAASUVORK5CYII=';
const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY1hSWg4AA1EBkakDs38AAAAASUVORK5CYII=';
const RED_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/i5aQsABQcCYPaWuk8AAAAASUVORK5CYII=';
const createGallery = (options) => createWidget('dxGallery', options, true);

fixture`Click on indicator`
  .page(url(__dirname, '../container.html'));

test('click on indicator item should change selected item', async (t) => {
  const gallery = new Gallery('#container');
  const secondIndicatorItem = gallery.getIndicatorItem(1);

  await t
    .click(secondIndicatorItem.element)
    .expect(secondIndicatorItem.isSelected).ok();
}).before(() => createGallery({
  height: 300,
  showIndicator: true,
  items: [BLACK_PIXEL, RED_PIXEL, YELLOW_PIXEL],
}));
