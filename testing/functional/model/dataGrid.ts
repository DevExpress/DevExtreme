import { ClientFunction, Selector } from "testcafe";
import Widget from "./internal/widget";

const CLASS = {
    headers: 'headers',
    headerRow: 'dx-header-row',
    headerPanel: 'header-panel',
    filterRow: 'filter-row',
    filterMenu: 'dx-filter-menu',
    dataRow: 'dx-data-row',
    groupRow: 'dx-group-row',
    commandEdit: 'dx-command-edit',
    commandExpand: 'dx-command-expand',
    commandLink: 'dx-link',
    editCell: 'dx-editor-cell',
    focused: 'dx-focused',
    focusedState: 'dx-state-focused',
    hiddenFocusedState: 'dx-cell-focus-disabled',
    focusedRow: 'dx-row-focused',
    rowRemoved: 'dx-row-removed',
    editorInput: 'dx-texteditor-input',
    filterPanel: 'filter-panel',
    filterPanelIcon: 'dx-icon-filter',
    filterPanelText: 'filter-panel-text',
    pager: 'pager',
    pagerPageSize: 'dx-page-size',
    pagerPrevNavButton: 'dx-prev-button',
    pagerNextNavButton: 'dx-next-button',
    pagerPage: 'dx-page',
    selection: 'dx-selection',
    form: 'dx-form',
    textEditor: 'dx-texteditor',
    textEditorInput: 'dx-texteditor-input',
    invalid: 'dx-invalid',
    invalidCell: 'dx-datagrid-invalid',
    invalidOverlayMessage: 'dx-invalid-message',
    cellModified: 'dx-cell-modified',
    editFormRow: 'edit-form',
    button: 'dx-button',
    formButtonsContainer: 'form-buttons-container',
    selectCheckBox: 'dx-select-checkbox',
    pendingIndicator: 'dx-pending-indicator',
    addRowButton: 'addrow-button',
    insertedRow: 'dx-row-inserted',
    editedRow: 'dx-edit-row',
    saveButton: 'save-button',
    groupExpanded: 'group-opened',
    overlayContent: 'edit-popup',
    popupContent: 'dx-overlay-content',
    toolbar: 'dx-toolbar'
};

const addWidgetPrefix = function(widgetName: string, className: string) {
    return `dx-${widgetName.slice(2).toLowerCase() + (className ? '-' + className : '')}`;
};

class DxElement {
    element: Selector;
    hasFocusedState: Promise<boolean>;
    hasHiddenFocusState: Promise<boolean>;

    constructor(element: Selector) {
        this.element = element;
        this.hasFocusedState = this.element.hasClass(CLASS.focusedState);
        this.hasHiddenFocusState = this.element.hasClass(CLASS.hiddenFocusedState);
    }
}


class HeaderPanel extends DxElement {
    widgetName: string;

    constructor(element: Selector, widgetName: string) {
        super(element);
        this.widgetName = widgetName;
    }

    getAddRowButton(): Selector {
        return this.element.find(`.${addWidgetPrefix(this.widgetName, CLASS.addRowButton)}`);
    }

    getSaveButton(): Selector {
        return this.element.find(`.${addWidgetPrefix(this.widgetName, CLASS.saveButton)}`);
    }
}

class Headers extends DxElement {
    widgetName: string;

    constructor(element: Selector, widgetName) {
        super(element);
        this.widgetName = widgetName;
    }

    getHeaderRow(index: number): HeaderRow {
        return new HeaderRow(this.element.find(`.${CLASS.headerRow}:nth-child(${++index})`));
    }

    getFilterRow(): FilterRow {
        return new FilterRow(this.element.find(`.${addWidgetPrefix(this.widgetName, CLASS.filterRow)}`));
    }
}

class FilterRow extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getFilterCell(index: number): FilterCell {
        return new FilterCell(this.element.find(`.${CLASS.editCell}:nth-child(${index + 1})`));
    }
}

class FilterCell extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getSearchIcon(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.filterMenu}`));
    }

    getEditor(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.editorInput}`));
    }
}

class HeaderCell extends DxElement {
    constructor(headerRow: Selector, index: number) {
        super(headerRow.find(`td:nth-child(${++index})`));
    }

    getFilterIcon(): Selector {
        return this.element.find(`.dx-column-indicators > .dx-header-filter`);
    }
}

class HeaderRow extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getHeaderCell(index: number): HeaderCell {
        return new HeaderCell(this.element, index);
    }
}

class DataCell extends DxElement {
    element: Selector;
    isEditCell: Promise<boolean>;
    isFocused: Promise<boolean>;
    isValidationPending: Promise<boolean>;
    isInvalid: Promise<boolean>;
    isModified: Promise<boolean>;
    hasInvalidMessage: Promise<boolean>;

    constructor(dataRow: Selector, index: number) {
        super(dataRow.find(`td:nth-child(${++index})`));
        this.isEditCell = this.element.hasClass(CLASS.editCell);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.isValidationPending = this.element.find(`div.${CLASS.pendingIndicator}`).exists;
        this.isInvalid = this.element.hasClass(CLASS.invalidCell);
        this.isModified = this.element.hasClass(CLASS.cellModified);
        this.hasInvalidMessage = this.element.find(`.${CLASS.invalidOverlayMessage} .${CLASS.popupContent}`).exists;
    }

    getEditor(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.editorInput}`));
    }
}

class CommandCell extends DxElement {
    constructor(dataRow: Selector, index: number) {
        super(dataRow.find(`td:nth-child(${++index}).${CLASS.commandEdit}`));
    }

    getButton(index: number) {
        return this.element.find(`.${CLASS.commandLink}:nth-child(${index + 1})`);
    }
}

class DataRow extends DxElement {
    isRemoved: Promise<boolean>;
    isFocusedRow: Promise<boolean>;
    isSelected: Promise<boolean>;
    isInserted: Promise<boolean>;
    isEdited: Promise<boolean>;

    constructor(element: Selector) {
        super(element);
        this.isRemoved = this.element.hasClass(CLASS.rowRemoved);
        this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
        this.isSelected = this.element.hasClass(CLASS.selection);
        this.isInserted = this.element.hasClass(CLASS.insertedRow);
        this.isEdited = this.element.hasClass(CLASS.editedRow);
    }

    getDataCell(index: number): DataCell {
        return new DataCell(this.element, index);
    }

    getCommandCell(index: number): CommandCell {
        return new CommandCell(this.element, index);
    }

    getSelectCheckBox(): Selector {
        return this.element.find(`.${CLASS.selectCheckBox}`);
    }
}

class GroupRow extends DxElement {
    widgetName: string;
    isFocusedRow: Promise<boolean>;
    isFocused: Promise<boolean>;
    isExpanded: Promise<boolean>;

    constructor(element: Selector, widgetName: string) {
        super(element);
        this.widgetName = widgetName;
        this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.isExpanded = this.element.find(`.${CLASS.commandExpand} .${addWidgetPrefix(this.widgetName, CLASS.groupExpanded)}`).exists
    }

    getCell(index: number): DataCell {
        return new DataCell(this.element, index);
    }
}

class FilterPanel extends DxElement {
    widgetName: string;

    constructor(element: Selector, widgetName) {
        super(element);
        this.widgetName = widgetName;
    }

    getIconFilter(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.filterPanelIcon}`));
    }

    getFilterText(): DxElement {
        return new DxElement(this.element.find(`.${addWidgetPrefix(this.widgetName, CLASS.filterPanelText)}`));
    }
}

class NavPage extends DxElement {
    isSelected = this.element.hasClass(CLASS.selection);

    constructor(pagerElement: Selector, index: number) {
        super(pagerElement.find(`.${CLASS.pagerPage}`).nth(index));
    }
}

class Pager extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getPageSize(index: number): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerPageSize}:nth-child(${index + 1})`));
    }

    getPrevNavButton(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerPrevNavButton}`));
    }

    getNextNavButton(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerNextNavButton}`));
    }

    getNavPage(index: number): NavPage {
        return new NavPage(this.element, index);
    }
}

export class EditForm extends DxElement {
    form: Selector;
    saveButton: Selector;
    cancelButton: Selector;

    constructor(element: Selector, buttons: Selector) {
        super(element);
        this.form = this.element.find(`.${CLASS.form}`);
        this.saveButton = buttons.nth(0);
        this.cancelButton = buttons.nth(1);
    }

    getItem(id): Selector {
        return this.form.find(`.${CLASS.textEditorInput}[id*=_${id}]`)
    }

    getInvalids(): Selector {
        return this.form.find(`.${CLASS.textEditor}.${CLASS.invalid}`);
    }
}

export default class DataGrid extends Widget {
    dataRows: Selector;
    getGridInstance: ClientFunction<any>;

    name: string;

    constructor(id: string, name='dxDataGrid') {
        super(id);

        this.name = name;
        this.dataRows = this.element.find(`.${CLASS.dataRow}`);

        const grid = this.element;

        this.getGridInstance = ClientFunction(
            () => $(grid())[`${name}`]('instance'),
            { dependencies: { grid, name }}
        );
    }

    addWidgetPrefix(className: string) {
        return addWidgetPrefix(this.name, className);
    }

    getHeaders(): Headers {
        return new Headers(this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`), this.name);
    }

    getDataRow(index: number): DataRow {
        return new DataRow(this.element.find(`.${CLASS.dataRow}:nth-child(${++index})`));
    }

    getDataCell(rowIndex: number, columnIndex: number): DataCell {
        return this.getDataRow(rowIndex).getDataCell(columnIndex);
    }

    getGroupRow(index: number): GroupRow {
        return new GroupRow(this.element.find(`.${CLASS.groupRow}`).nth(index), this.name);
    }

    getFocusedRow(): Selector {
        return this.dataRows.filter(`.${CLASS.focusedRow}`);
    }

    getFilterPanel(): FilterPanel {
        return new FilterPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.filterPanel)}`), this.name);
    }

    getPager(): Pager {
        return new Pager(this.element.find(`.${this.addWidgetPrefix(CLASS.pager)}`));
    }

    scrollTo(options): Promise<void> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollTo(options),
            { dependencies: { getGridInstance, options } }
        )();
    }

    getScrollLeft() : Promise<number> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollLeft(),
            { dependencies: { getGridInstance } }
        )();
    }

    getScrollbarWidth(isHorizontal: boolean) : Promise<number> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getView('rowsView').getScrollbarWidth(isHorizontal),
            { dependencies: { getGridInstance, isHorizontal } }
        )();
    }

    getEditForm(): EditForm {
        const editFormRowClass = this.addWidgetPrefix(CLASS.editFormRow);
        const element = this.element ? this.element.find(`.${editFormRowClass}`) :  Selector(`.${editFormRowClass}`);
        const buttons = element.find(`.${this.addWidgetPrefix(CLASS.formButtonsContainer)} .${CLASS.button}`);

        return new EditForm(element, buttons);
    }

    getPopupEditForm(): EditForm {
        const element = Selector(`.${this.addWidgetPrefix(CLASS.overlayContent)} .${CLASS.popupContent}`);
        const buttons = element.find(`.${this.addWidgetPrefix(CLASS.toolbar)} .${CLASS.button}`);

        return new EditForm(element, buttons);
    }

    getHeaderPanel(): HeaderPanel {
        return new HeaderPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.headerPanel)}`), this.name);
    }

    api_option(name: any, value = 'undefined') : Promise<any> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => {
                const dataGrid = getGridInstance();
                return value !== 'undefined' ? dataGrid.option(name, value) : dataGrid.option(name);
            },
            { dependencies: { getGridInstance, name, value } }
        )();
    }

    api_editRow(rowIndex: number) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().editRow(rowIndex),
            { dependencies: { getGridInstance, rowIndex } }
        )();
    }

    api_cancelEditData() : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().cancelEditData(),
            { dependencies: { getGridInstance } }
        )();
    }

    api_saveEditData() : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().saveEditData(),
            { dependencies: { getGridInstance } }
        )();
    }

    api_editCell(rowIndex: number, columnIndex: number) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().editCell(rowIndex, columnIndex),
            { dependencies: { getGridInstance, rowIndex, columnIndex } }
        )();
    }

    api_cellValue(rowIndex: number, columnIndex: number, value: string) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().editCell(rowIndex, columnIndex, value),
            { dependencies: { getGridInstance, rowIndex, columnIndex, value } }
        )();
    }

    api_getCellValidationStatus(rowIndex: number, columnIndex: number) : Promise<any> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(() => {
            const dataGrid = getGridInstance();
            const result = dataGrid.getController('validating').getCellValidationResult({ rowKey : dataGrid.getKeyByRowIndex(rowIndex), columnIndex });
            return result ? result.status : null;
        }, { dependencies: { getGridInstance, rowIndex, columnIndex } }
        )();
    }
}
