import { WrapperBase, ElementWrapper } from './wrapperBase.js';

const FOCUS_OVERLAY_POSTFIX_CLASS = 'focus-overlay';
const COMMAND_ADAPTIVE_CLASS = 'dx-command-adaptive';
const COMMAND_ADAPTIVE_HIDDEN_CLASS = 'dx-command-adaptive-hidden';
const FILTER_BUILDER_CLASS = 'dx-filterbuilder';
const FILTER_BUILDER_GROUP_CLASS = 'dx-filterbuilder-group';
const FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = 'dx-filterbuilder-item-value-text';
const FILTER_BUILDER_TEXT_PART_CLASS = 'dx-filterbuilder-text-part';
const HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';
const LIST_ITEM_CLASS = 'dx-list-item';
const BUTTON_CLASS = 'dx-button';
const FOCUSED_ROW_CLASS = 'dx-row-focused';
const SELECTED_ROW_CLASS = 'dx-selection';
const DATA_GRID_PREFIX = 'dx-datagrid';
const ROW_CLASS = 'dx-row';
const DATA_ROW_CLASS = 'dx-data-row';
const TREELIST_PREFIX = 'dx-treelist';
const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FIXED_CONTENT_CLASS = 'dx-datagrid-content-fixed';
const HEADER_COLUMN_INDICATORS_CLASS = 'dx-column-indicators';
const GRID_TABLE_CLASS = 'dx-datagrid-table';
const FREE_SPACE_ROW_CLASS = 'dx-freespace-row';
const VIRTUAL_ROW_CLASS = 'dx-virtual-row';
const COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_BUTTON_CLASS = 'dx-link';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
const FOCUSED_CLASS = 'dx-focused';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const HIDDEN_CLASS = 'dx-hidden';
const INSERTED_ROW_CLASS = 'dx-row-inserted';

class GridWrapper extends WrapperBase {
    constructor(containerSelector, widgetPrefix) {
        super(containerSelector);
        this.pager = new PagerWrapper(containerSelector, widgetPrefix);
        this.filterPanel = new FilterPanelWrapper(containerSelector, widgetPrefix);
        this.headerPanel = new HeaderPanelWrapper(containerSelector, widgetPrefix);
        this.headers = new HeadersWrapper(containerSelector, widgetPrefix);
        this.filterRow = new FilterRowWrapper(containerSelector, widgetPrefix);
        this.rowsView = new RowsViewWrapper(containerSelector, widgetPrefix);
        this.filterBuilder = new FilterBuilderWrapper('BODY', widgetPrefix);
        this.columns = new ColumnWrapper(containerSelector, widgetPrefix);
    }

    getElement() {
        return this.getContainer();
    }

    isEditorCell($cell) {
        return $cell.hasClass('dx-editor-cell');
    }
}

export default class DataGridWrapper extends GridWrapper {
    constructor(containerSelector) {
        super(containerSelector, DATA_GRID_PREFIX);
    }
}

export class TreeListWrapper extends GridWrapper {
    constructor(containerSelector) {
        super(containerSelector, TREELIST_PREFIX);
    }
}

class GridElement extends WrapperBase {
    constructor(containerSelector, widgetPrefix = 'dx-datagrid') {
        super(containerSelector);
        this.widgetPrefix = widgetPrefix;
    }
}

class GridTableElement extends GridElement {
    getTable() {
        return this.getElement().find(`.${GRID_TABLE_CLASS}`);
    }
}

export class ColumnWrapper extends GridElement {
    getCommandButtons() {
        return this.getContainer().find('td[class*=\'dx-command\'] .dx-link');
    }
}

export class Editor extends ElementWrapper {
    constructor(containerWrapper) {
        super(containerWrapper, `.${TEXTEDITOR_CLASS}`);
    }

    getInputElement() {
        return this.getElement().find(`.${TEXTEDITOR_INPUT_CLASS}`);
    }
}

export class Cell extends WrapperBase {
    constructor(row, index) {
        super(row.getElement());
        this.index = index;
    }

    getElement() {
        return this.getContainer().find(`td:nth-child(${this.index + 1})`);
    }

    getEditor() {
        return new Editor(this);
    }

    hasFocusedClass() {
        return this.getElement().hasClass(FOCUSED_CLASS);
    }

    isEditorCell() {
        return this.getElement().hasClass(EDITOR_CELL_CLASS);
    }
}

export class Row extends WrapperBase {
    constructor(rowsView, index = -1) {
        super(rowsView.getElement());
        this.index = index;
        this.elementClass = ROW_CLASS;
    }

    getElement() {
        const rows = this.getContainer().find(`:not(.${FIXED_CONTENT_CLASS}) .${this.elementClass}`);
        return this.index === -1 ? rows : rows.eq(this.index);
    }

    getCell(index) {
        return new Cell(this, index);
    }
}

export class CommandAdaptive extends ElementWrapper {
    constructor(containerWrapper) {
        super(containerWrapper, `.${COMMAND_ADAPTIVE_CLASS}`);
    }

    isVisible() {
        return !this.getElement().hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS);
    }
}

export class CommandCell extends ElementWrapper {
    constructor(containerWrapper, columnIndex) {
        super(containerWrapper, `.${COMMAND_EDIT_CLASS}:nth-child(${columnIndex + 1})`);
    }

    getButton(index) {
        return new ElementWrapper(this, `.${COMMAND_BUTTON_CLASS}:nth-child(${index})`);
    }
}

export class DataRow extends Row {
    constructor(container, index) {
        super(container, index);
        this.elementClass = DATA_ROW_CLASS;
    }

    getSelectCheckBox(columnIndex = -1) {
        let selector = `.${SELECT_CHECKBOX_CLASS}`;
        if(columnIndex >= 0) {
            selector += `:nth-child(${columnIndex + 1})`;
        }
        return new ElementWrapper(this, selector);
    }

    isSelected() {
        return this.getElement().hasClass(SELECTED_ROW_CLASS);
    }

    isFocusedRow() {
        return this.getElement().hasClass(FOCUSED_ROW_CLASS);
    }

    isNewRow() {
        return this.getElement().hasClass(INSERTED_ROW_CLASS);
    }

    getCommandAdaptive() {
        return new CommandAdaptive(this);
    }

    getCommandCell(columnIndex) {
        return new CommandCell(this, columnIndex);
    }
}

export class FixedDataRow extends DataRow {
    getElement() {
        return this.getContainer()
            .find(`.${FIXED_CONTENT_CLASS} .${this.elementClass}`)
            .eq(this.index);
    }
}

export class FreeSpaceRow extends Row {
    constructor(container) {
        super(container, -1);
        this.elementClass = FREE_SPACE_ROW_CLASS;
    }
}

export class VirtualRow extends Row {
    constructor(container) {
        super(container, -1);
        this.elementClass = VIRTUAL_ROW_CLASS;
    }
}

export class FocusOverlay extends ElementWrapper {
    constructor(containerWrapper) {
        const focusOverlaySelector = `.${containerWrapper.widgetPrefix}-${FOCUS_OVERLAY_POSTFIX_CLASS}`;
        super(containerWrapper, focusOverlaySelector);
    }

    isVisible() {
        const $focusOverlay = this.getElement();
        return $focusOverlay.length > 0 && !$focusOverlay.hasClass(HIDDEN_CLASS);
    }
}

export class RowsViewWrapper extends GridTableElement {
    constructor(container, widgetPrefix) {
        super(container);
        this.widgetPrefix = widgetPrefix;
    }

    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-rowsview`);
    }

    getVirtualRow() {
        return new VirtualRow(this);
    }

    // getRowElement
    getRow(rowIndex) {
        return new Row(this, rowIndex);
    }

    getDataRow(rowIndex) {
        return new DataRow(this, rowIndex);
    }

    getDataRows() {
        return new DataRow(this);
    }

    getFreeSpaceRow() {
        return new FreeSpaceRow(this);
    }

    getFixedDataRow(rowIndex) {
        return new FixedDataRow(this, rowIndex);
    }

    getFocusOverlay() {
        return new FocusOverlay(this);
    }

    getCell(rowIndex, columnIndex) {
        return this.getRow(rowIndex).getCell(columnIndex);
    }

    getCellElement(rowIndex, columnIndex) {
        return this.getCell(rowIndex, columnIndex).getElement();
    }

    isRowVisible(rowIndex, precision) {
        const $row = this.getRow(rowIndex).getElement();
        return this._isInnerElementVisible($row, precision);
    }

    _isInnerElementVisible($element, precision = 0) {
        const rowsViewRect = this.getContainer()[0].getBoundingClientRect();
        const elementRect = $element[0].getBoundingClientRect();
        const diffTop = Math.floor(elementRect.top - rowsViewRect.top) + precision;
        const diffBottom = Math.floor(rowsViewRect.bottom - elementRect.bottom) + precision;

        return diffTop >= 0 && diffBottom >= 0;
    }
}

export class PagerWrapper extends GridElement {
    constructor(containerSelector, widgetPrefix) {
        super(containerSelector, widgetPrefix);
        this.PAGE_SIZES_SELECTOR = `.${this.widgetPrefix}-pager .dx-page-sizes`;
        this.PAGES_SELECTOR = `.${this.widgetPrefix}-pager .dx-pages`;
    }

    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-pager`);
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
        return this.getPagerPageChooserElement().find('.dx-page');
    }
    getPagerPageElement(index) {
        return this.getPagerPagesElements().eq(index);
    }
    getPagerButtonsElements() {
        return this.getPagerPageChooserElement().find('.dx-navigate-button');
    }
    getNextButtonsElement() {
        return this.getPagerPageChooserElement().find('.dx-next-button');
    }
    getPrevButtonsElement() {
        return this.getPagerPageChooserElement().find('.dx-prev-button');
    }

    isFocusedState() {
        return this.getElement().hasClass('dx-state-focused');
    }
}

export class FilterPanelWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-filter-panel`);
    }

    getIconFilter() {
        return this.getElement().find('.dx-icon-filter');
    }

    getPanelText() {
        return this.getElement().find(`.${this.widgetPrefix}-filter-panel-text`);
    }

    getClearFilterButton() {
        return this.getElement().find(`.${this.widgetPrefix}-filter-panel-clear-filter`);
    }
}

export class FilterRowWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-filter-row`).eq(0);
    }

    getTextEditor(index) {
        return this.getElement().find('.dx-texteditor').eq(index);
    }

    getTextEditorInput(index) {
        return this.getElement().find(`.${TEXTEDITOR_INPUT_CLASS}`).eq(index);
    }

    getEditorCell(index) {
        return this.getElement().find('.dx-editor-cell').eq(index);
    }

    getMenuElement(index) {
        return this.getEditorCell(index).find('.dx-menu');
    }
}

export class HeaderPanelWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-header-panel`);
    }

    getGroupPanelElement() {
        return this.getElement().find(`.${this.widgetPrefix}-group-panel`);
    }

    getGroupPanelItem(index) {
        return this.getGroupPanelElement().find('.dx-group-panel-item').eq(index);
    }

    getGroupPanelItems() {
        return this.getGroupPanelElement().find('.dx-group-panel-item');
    }
}

export class HeadersWrapper extends GridTableElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-headers`);
    }

    getHeaderItem(rowIndex, columnIndex) {
        return this.getElement().find('.dx-header-row').eq(rowIndex).find('td').eq(columnIndex);
    }

    getHeaderItemTextContent(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(`.${this.widgetPrefix}-text-content`).eq(0).text();
    }

    getHeaderFilterItem(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find('.dx-header-filter');
    }

    getColumnsIndicators() {
        return this.getElement().find(`.${HEADER_COLUMN_INDICATORS_CLASS}`);
    }

    isColumnHidden(index) {
        const $colsHeadersView = this.getContainer().find('.dx-datagrid-headers col');
        const $colsRowsView = this.getContainer().find('.dx-datagrid-headers col');
        const headersColWidth = $colsHeadersView.get(index).style.width;
        const rowsViewWidth = $colsRowsView.get(index).style.width;

        return (headersColWidth === '0.0001px' || headersColWidth === '0px') && (rowsViewWidth === '0.0001px' || rowsViewWidth === '0px');
    }
}

export class FilterBuilderWrapper extends GridElement {
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

export class HeaderFilterMenu extends GridElement {
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
