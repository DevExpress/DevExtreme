import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import ContextMenu from '../../../model/contextMenu';
import { appendElementTo } from '../helpers/domUtils';

fixture.disablePageReloads`ContextMenu`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Context menu should be shown in the same position when item was added in runtime (T755681)', async (t) => {
  const contextMenu = new ContextMenu('#container');
  const target = Selector('#menuTarget');

  await t
    .click(target)
    .expect(contextMenu.overlayWrapper.getVisibility()).eql('visible');

  const initialOverlayOffset = await contextMenu.overlay.getOverlayOffset();

  await t
    .expect(contextMenu.getItemCount()).eql(1);

  await t
    .expect(contextMenu.getItemCount()).eql(2)
    .expect(contextMenu.overlay.getOverlayOffset()).eql(initialOverlayOffset);
}).before(async () => {
  const menuTargetID = 'menuTarget';
  await appendElementTo('container', 'button', menuTargetID, {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  return createWidget('dxContextMenu', {
    items: [{ text: 'item1' }],
    showEvent: 'dxclick',
    target: `#${menuTargetID}`,
    onShowing: (e) => {
      if (!(window as any).isItemAdded) {
        setTimeout(() => {
          (window as any).isItemAdded = true;
          const items = e.component.option('items');
          items.push({ text: 'item 2' });
          e.component.option('items', items);
        }, 1000);
      }
    },
  });
});
