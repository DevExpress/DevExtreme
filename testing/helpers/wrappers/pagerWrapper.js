import { WrapperBase } from './wrapperBase.js';

export class PagerWrapper extends WrapperBase {
    getPagerPageSizeElements() {
        return this.getContainer().find(".dx-datagrid-pager .dx-page-sizes > .dx-page-size");
    }

    getPagerPagesElements() {
        return this.getContainer().find(".dx-datagrid-pager .dx-pages > .dx-page");
    }

    getPagerButtonsElements() {
        return this.getContainer().find(".dx-datagrid-pager .dx-pages > .dx-navigate-button");
    }
}
