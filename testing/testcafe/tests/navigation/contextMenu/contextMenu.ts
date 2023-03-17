import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import ContextMenu from '../../../model/contextMenu';
import { appendElementTo } from '../../../helpers/domUtils';

fixture`ContextMenu`
  .page(url(__dirname, '../../container.html'));

test('Context menu should be shown in the same position when item was added in runtime (T755681)', async (t) => {
  const contextMenu = new ContextMenu('#contextMenu');
  const target = Selector('#menuTarget');

  await t
    .click(target)
    .expect(contextMenu.overlay.getContent().getStyleProperty('visibility')).eql('visible');

  const initialOverlayOffset = await contextMenu.overlay.getOverlayOffset();

  await t
    .expect(contextMenu.getItemCount()).eql(1);

  await t
    .expect(contextMenu.getItemCount()).eql(2)
    .expect(contextMenu.overlay.getOverlayOffset()).eql(initialOverlayOffset);
}).before(async () => {
  const menuTargetID = 'menuTarget';
  await appendElementTo('#container', 'div', 'contextMenu');
  await appendElementTo('#container', 'button', menuTargetID, {
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
  }, '#contextMenu');
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).isItemAdded;
  })();
});
