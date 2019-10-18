import { WrapperBase } from './wrapperBase.js';

const FOCUS_OVERLAY_CLASS = "dx-datagrid-focus-overlay";
const COMMAND_ADAPTIVE_CLASS = "dx-command-adaptive";
const COMMAND_ADAPTIVE_HIDDEN_CLASS = "dx-command-adaptive-hidden";
const FILTER_BUILDER_CLASS = "dx-filterbuilder";
const FILTER_BUILDER_GROUP_CLASS = "dx-filterbuilder-group";
const FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text";
const FILTER_BUILDER_TEXT_PART_CLASS = "dx-filterbuilder-text-part";
const HEADER_FILTER_MENU_CLASS = "dx-header-filter-menu";
const LIST_ITEM_CLASS = "dx-list-item";
const BUTTON_CLASS = "dx-button";

export class DataGridWrapper {
    constructor(containerSelector) {
        this.pager = new PagerWrapper(containerSelector);
        this.filterPanel = new FilterPanelWrapper(containerSelector);
        this.headerPanel = new HeaderPanelWrapper(containerSelector);
        this.headers = new HeadersWrapper(containerSelector);
        this.filterRow = new FilterRowWrapper(containerSelector);
        this.rowsView = new RowsViewWrapper(containerSelector);
        this.filterBuilder = new FilterBuilderWrapper("BODY");
    }

    findFocusOverlay() {
        return this.getElement().find();
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

    getRowElement(rowIndex) {
        return this.getElement().find(".dx-row").eq(rowIndex);
    }

    getDataRowElement(rowIndex) {
        return this.getElement().find(".dx-data-row").eq(rowIndex);
    }

    getRowAdaptiveElement(rowIndex) {
        return this.getDataRowElement(rowIndex).find(`.${COMMAND_ADAPTIVE_CLASS}`);
    }

    isRowAdaptiveVisible(rowIndex) {
        return !this.getRowAdaptiveElement(rowIndex).hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS);
    }

    getEditorInputElement(rowIndex, columnIndex) {
        return this.getDataRowElement(rowIndex).find("td").eq(columnIndex).find(".dx-texteditor-input");
    }

    getSelectionCheckBoxElement(rowIndex) {
        return this.getDataRowElement(rowIndex).find(".dx-select-checkbox");
    }

    isRowVisible(rowIndex, precision) {
        const $row = this.getRowElement(rowIndex);
        return this._isInnerElementVisible($row, precision);
    }

    _isInnerElementVisible($element, precision = 0) {
        const rowsViewRect = this.getElement()[0].getBoundingClientRect();
        const elementRect = $element[0].getBoundingClientRect();
        const diffTop = Math.floor(elementRect.top - rowsViewRect.top) + precision;
        const diffBottom = Math.floor(rowsViewRect.bottom - elementRect.bottom) + precision;

        return diffTop >= 0 && diffBottom >= 0;
    }

    findFocusOverlay() {
        return this.getElement().find(`.${FOCUS_OVERLAY_CLASS}`);
    }

    isFocusOverlayVisible() {
        const $focusOverlay = this.findFocusOverlay();
        return $focusOverlay.length && !this.findFocusOverlay().hasClass("dx-hidden");
    }

    getFocusedRow() {
        return this.getElement().find(".dx-row-focused");
    }

    hasFocusedRow() {
        return this.getFocusedRow().length > 0;
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

    getMenuElement(index) {
        return this.getElement().find(".dx-editor-cell").eq(index).find(".dx-menu");
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

    getHeaderItemTextContent(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(".dx-datagrid-text-content").eq(0).text();
    }

    getHeaderFilterItem(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(".dx-header-filter");
    }
}

export class FilterBuilderWrapper extends WrapperBase {
    constructor(containerSelector) {
        super(containerSelector);
        this.headerFilterMenu = new HeaderFilterMenu(containerSelector);
    }

    getElement() {
        return this.getContainer().find(`.${FILTER_BUILDER_CLASS}.dx-widget`);
    }

    getItemValueTextElement(index = 0) {
        return this.getElement().find(`.${FILTER_BUILDER_GROUP_CLASS}:nth-child(${index + 1})`).find(`.${FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS}`);
    }

    getItemValueTextParts(index = 0) {
        return this.getItemValueTextElement(index).find(`.${FILTER_BUILDER_TEXT_PART_CLASS}`);
    }
}

export class HeaderFilterMenu extends WrapperBase {
    getElement() {
        return this.getContainer().find(`.${HEADER_FILTER_MENU_CLASS}`);
    }

    getDropDownListItem(index) {
        return this.getElement().find(`.${LIST_ITEM_CLASS}:nth-child(${index + 1})`);
    }

    getButtonOK() {
        return this.getElement().find(`.${BUTTON_CLASS}[aria-label='OK']`);
    }
}
