import { WrapperBase } from './wrapperBase.js';

export class PagerWrapper extends WrapperBase {
    constructor(containerSelector) {
        super(containerSelector);
        this.PAGE_SIZES_SELECTOR = ".dx-datagrid-pager .dx-page-sizes";
        this.PAGES_SELECTOR = ".dx-datagrid-pager .dx-pages";
    }

    getPagerElement() {
        return this.getContainer().find(".dx-datagrid-pager");
    }

    getPagerPageSizeElements() {
        return this.getContainer().find(`${this.PAGE_SIZES_SELECTOR} > .dx-page-size`);
    }

    getPagerPageSizeElement(index) {
        return this.getPagerPageSizeElements().eq(index);
    }

    getPagerPageChooserElement() {
        return this.getContainer().find(`${this.PAGES_SELECTOR}`);
    }
    getPagerPagesElements() {
        return this.getPagerPageChooserElement().find(".dx-page");
    }
    getPagerPageElement(index) {
        return this.getPagerPagesElements().eq(index);
    }
    getPagerButtonsElements() {
        return this.getPagerPageChooserElement().find(".dx-navigate-button");
    }
    getNextButtonsElement() {
        return this.getPagerPageChooserElement().find(".dx-next-button");
    }
    getPrevButtonsElement() {
        return this.getPagerPageChooserElement().find(".dx-prev-button");
    }

    isFocusedState() {
        return this.getPagerElement().hasClass("dx-state-focused");
    }
}
