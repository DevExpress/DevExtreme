import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import ContextMenu from '../../model/contextMenu';

fixture `ContextMenu`
    .page(url(__dirname, './pages/T755681.html'));

test("Context menu should shown in the same position when item was added in runtime", async t => {
    const contextMenu = new ContextMenu('#contextMenu');
    const target = Selector('#menuTarget');
    
    await t
        .click(target)
        .expect(contextMenu.overlayWrapper.getVisibility()).eql("visible")

    const initialOverlayOffset = await contextMenu.overlay.getOverlayOffset();

    await t
        .expect(contextMenu.getItemCount()).eql(1)

    await t    
        .expect(contextMenu.getItemCount()).eql(2)
        .expect(contextMenu.overlay.getOverlayOffset()).eql(initialOverlayOffset)
});