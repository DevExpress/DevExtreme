import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    overlay: "dx-overlay",
    overlayWrapper: "dx-overlay-wrapper",
    contextMenu: "dx-context-menu",
    subMenu: "dx-submenu",
    item: "dx-menu-item"
};

class Overlay {
    element: Selector;
    getOverlayInstance: ClientFunction<any>;

    constructor() {
        this.element = Selector(`.${CLASS.overlay}`);

        const { element } = this;
        this.getOverlayInstance = ClientFunction(
            () => $(element())['dxOverlay']('instance'),
            { dependencies: { element }}
        );
    }

    getOverlayOffset(): Promise<any> {
        const getOverlayInstance: any = this.getOverlayInstance;
        return ClientFunction(
            ()=> {
                const { offsetX, offsetY, pageX, pageY } = getOverlayInstance()._position.of;

                return { offsetX: offsetX, offsetY: offsetY, pageX: pageX, pageY: pageY }
            },
            { dependencies: { getOverlayInstance } }
        )();
    }
}

class OverlayWrapper {
    element: Selector;

    constructor() {
        this.element = Selector(`.${CLASS.overlayWrapper}`);
    }

    getVisibility(): Promise<string> {
        const { element } = this;
        const contextMenuClass = CLASS.contextMenu;
        
        return ClientFunction(()=> $(element()).find(`.${contextMenuClass}`).css("visibility"), {
            dependencies: { element, contextMenuClass }
        })();
    }
}

export default class ContextMenu extends Widget {
    items: Selector;
    overlay: Overlay;
    overlayWrapper: OverlayWrapper;

    name: string = 'dxContextMenu';

    constructor (id: string|Selector) {
        super(id);

        this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
        this.overlay = new Overlay();
        this.overlayWrapper = new OverlayWrapper();
    }

    getItemCount() {
        return this.items.count;
    }
}
