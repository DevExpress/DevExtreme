import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture.disablePageReloads`Draggable`
  .page(url(__dirname, '../container.html'));

test('dxDraggable element should not loose its position on dragging with auto-scroll inside ScrollView (T1169590)', async (t) => {
  const draggable = Selector('#drag-me');

  await t
    .drag(draggable, 0, 400, { speed: 0.1 })

    .expect(Selector('.dx-scrollable-container')().scrollTop)
    .gt(95);

  await t
    .expect((await draggable().boundingClientRect).top)
    .gt(400);
}).before(async () => {
  const init = ClientFunction(() => {
    $('<div>', {
      id: 'scrollview',
      width: 400,
      height: 400,
    }).appendTo('#container');

    $('<div>', {
      id: 'scrollview-content',
      height: 500,
    }).appendTo('#scrollview');

    $('<div>', {
      id: 'drag-me',
    })
      .css({
        'background-color': 'blue',
      })
      .appendTo('#scrollview-content');
    $('#drag-me').append('DRAG ME!!!');

    $(`<style>
        #scrollview {
        position: absolute;
        top: 0;
        padding: 20px;
        background: #f18787;
        }
        }</style>`).appendTo('head');
  });

  await init();
  await createWidget('dxScrollView', { }, '#scrollview');
  await createWidget('dxDraggable', { }, '#drag-me');
});
