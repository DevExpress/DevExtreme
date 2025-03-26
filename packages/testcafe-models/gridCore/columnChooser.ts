import { ClientFunction } from "testcafe";
import FocusableElement from "testcafe-models/internal/focusable";
import Popup from "testcafe-models/popup";
import TreeView from "testcafe-models/treeView";

const CLASS = {
    overlayContent: 'dx-overlay-content',
    treeView: 'dx-treeview',
    treeViewItem: 'dx-treeview-item',
};

export default class ColumnChooser extends FocusableElement {
    popup: Popup;

    treeView: TreeView;

    isOpen: Promise<boolean>;

    constructor(element: Selector) {
        super(element);

        this.popup = new Popup(this.element.find(`.${CLASS.overlayContent}`));
        this.treeView = new TreeView(this.element.find(`.${CLASS.treeView}`));
        this.isOpen = this.element.exists;
    }

    async focusList() {
        await ClientFunction(
            (container) => {
                const $treeView = $(container());
                $treeView.trigger('focus');
            }, 
            {
                dependencies: {
                    treeView: this.treeView,
                }
            }
        )(this.treeView);
    }

    getColumn(index = 0): Selector {
        return this.treeView.element.find(`.${CLASS.treeViewItem}`).nth(index);
    }
}