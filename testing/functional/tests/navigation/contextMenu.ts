import url from '../../helpers/getPageUrl';
import { Selector, ClientFunction } from 'testcafe';
import { createWidget } from '../../helpers/testHelper';
import ContextMenu from '../../model/contextMenu';

fixture `ContextMenu`
    .page(url(__dirname, '../container.html')); 

interface IOptions {
    id: string,
    width: number,
    height: number,
    backgroundColor: string
}

const appendElementTo = ClientFunction((selector: string, tagName: string, options: IOptions) => {
    const container = document.querySelector(selector);
    const element = document.createElement(tagName);
    const { id, width, height, backgroundColor } = options;

    element.setAttribute("id", id);
    element.style.cssText = `width: ${width}px; height: ${height}px; background-color: ${backgroundColor};`;
    element.innerText = id;

    container.appendChild(element);
});

test("Context menu should be shown in the same position when item was added in runtime", async t => {
    const contextMenu = new ContextMenu('#container');
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
}).before(async t => {
    const menuTargetID = "menuTarget";
    await appendElementTo("body", "button", { id: menuTargetID, width: 150, height: 50, backgroundColor: "steelblue" });

    return createWidget("dxContextMenu", {
        items: [ { text: "item1"}],
        showEvent:"dxclick",
        target: `#${menuTargetID}`,
        onShowing: (e) => {
            if(!(window as any).isItemAdded) {
                setTimeout(() => {
                    (window as any).isItemAdded = true;
                    const items = e.component.option("items");
                    items.push({ text: "item 2" });
                    e.component.option("items", items);
                }, 1000);
            }
        }
    });
});
