import { WrapperBase } from './wrapperBase.js';

export class DataGridWrapper {
    constructor(containerSelector) {
        this.pager = new PagerWrapper(containerSelector);
        this.filterPanel = new FilterPanelWrapper(containerSelector);
        this.headerPanel = new HeaderPanelWrapper(containerSelector);
        this.headers = new HeadersWrapper(containerSelector);
        this.filterRow = new FilterRowWrapper(containerSelector);
    }
}

export class ColumnWrapper extends WrapperBase {
    getCommandButtons() {
        return this.getContainer().find("td[class*='dx-command'] .dx-link");
    }
}

export class RowsViewWrapper extends WrapperBase {
    getElement() {
        return this.getContainer().find(".dx-datagrid-rowsview");
    }

    getVirtualRowElement() {
        return this.getContainer().find(".dx-virtual-row");
    }

    getVirtualCell(columnIndex) {
        return this.getVirtualRowElement().find("td").eq(columnIndex);
    }
}

export class PagerWrapper extends WrapperBase {
    constructor(containerSelector) {
        super(containerSelector);
        this.PAGE_SIZES_SELECTOR = ".dx-datagrid-pager .dx-page-sizes";
        this.PAGES_SELECTOR = ".dx-datagrid-pager .dx-pages";
    }

    getElement() {
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
        return this.getElement().hasClass("dx-state-focused");
    }
}

export class FilterPanelWrapper extends WrapperBase {
    getElement() {
        return this.getContainer().find(".dx-datagrid-filter-panel");
    }

    getIconFilter() {
        return this.getElement().find(".dx-icon-filter");
    }

    getPanelText() {
        return this.getElement().find(".dx-datagrid-filter-panel-text");
    }

    getClearFilterButton() {
        return this.getElement().find(".dx-datagrid-filter-panel-clear-filter");
    }
}

export class FilterRowWrapper extends WrapperBase {
    getElement() {
        return this.getContainer().find(".dx-datagrid-filter-row");
    }

    getTextEditorInput(index) {
        return this.getElement().find(".dx-texteditor-input").eq(index);
    }
}

export class HeaderPanelWrapper extends WrapperBase {
    getElement() {
        return this.getContainer().find(".dx-datagrid-header-panel");
    }

    getGroupPanelElement() {
        return this.getElement().find(".dx-datagrid-group-panel");
    }

    getGroupPanelItem(index) {
        return this.getGroupPanelElement().find(".dx-group-panel-item").eq(index);
    }
}

export class HeadersWrapper extends WrapperBase {
    getElement() {
        return this.getContainer().find(".dx-datagrid-headers");
    }

    getHeaderItem(rowIndex, columnIndex) {
        return this.getElement().find(".dx-header-row").eq(rowIndex).find("td").eq(columnIndex);
    }

    getHeaderFilterItem(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(".dx-header-filter");
    }
}

