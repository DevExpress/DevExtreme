import { WrapperBase } from "./wrapperBase.js";

const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

export class SearchBoxWrapper extends WrapperBase {
    constructor(containerSelector, widgetName) {
        super(containerSelector);
        this.widgetName = widgetName.toLowerCase();
    }

    getElement() {
        return this.getContainer().find(`.dx-${this.widgetName}-search`);
    }

    getEditorInput() {
        return this.getElement().find(`.${TEXTEDITOR_INPUT_CLASS}`);
    }
}

export class TreeViewSearchBoxWrapper extends SearchBoxWrapper {
    constructor(containerSelector) {
        super(containerSelector, "treeview");
    }
}

export class ListSearchBoxWrapper extends SearchBoxWrapper {
    constructor(containerSelector) {
        super(containerSelector, "list");
    }
}
