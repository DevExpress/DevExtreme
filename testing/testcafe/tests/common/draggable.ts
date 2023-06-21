import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import Scrollable from '../../model/scrollView/scrollable';

fixture.disablePageReloads`Draggable`
  .page(url(__dirname, '../container.html'));

const init = ClientFunction(() => {
  $('<div>', {
    id: 'scrollview',
    width: 400,
    height: 400,
  })
    .css({
      position: 'absolute',
      top: 0,
      padding: 20,
      background: '#f18787',
    })
    .appendTo('#container');

  $('<div>', {
    id: 'scrollview-content',
    height: 500,
    width: 500,
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

test('dxDraggable element should not loose its position on dragging with auto-scroll inside ScrollView (T1169590)', async (t) => {
  const draggable = Selector('#drag-me');
  const scrollable = new Scrollable('#scrollview');

  await t
    .drag(draggable, 0, 400, { speed: 0.1 })

    .expect(scrollable.getContainer()().scrollTop)
    .gt(60);

  await t
    .expect((await draggable().boundingClientRect).top)
    .gt(400);

  await t.scrollIntoView(draggable);

  await t
    .drag(draggable, 400, 0, { speed: 0.1 })

    .expect(scrollable.getContainer()().scrollLeft)
    .gt(60);

  await t
    .expect((await draggable().boundingClientRect).left)
    .gt(400);
}).before(async () => {
  await init();
  await createWidget('dxScrollView', {
    direction: 'both',
  }, '#scrollview');
  await createWidget('dxDraggable', { }, '#drag-me');
});
