import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import DataRow from './data/row';
import GroupRow from './groupRow';
import FilterPanel from './filter/panel';
import Pager from './pager';
import EditForm from './editForm';
import HeaderPanel from './headers/panel';
import DataCell from './data/cell';
import Headers from './headers';

const CLASS = {
    headers: 'headers',
    headerPanel: 'header-panel',
    dataRow: 'dx-data-row',
    groupRow: 'dx-group-row',
    focusedRow: 'dx-row-focused',
    filterPanel: 'filter-panel',
    pager: 'pager',
    editFormRow: 'edit-form',
    button: 'dx-button',
    formButtonsContainer: 'form-buttons-container',
    overlayContent: 'edit-popup',
    popupContent: 'dx-overlay-content',
    toolbar: 'dx-toolbar'
};

export default class DataGrid extends Widget {
    dataRows: Selector;
    getGridInstance: ClientFunction<any>;

    name: string;

    constructor(id: string, name = 'dxDataGrid') {
        super(id);

        this.name = name;
        this.dataRows = this.element.find(`.${CLASS.dataRow}`);

        const grid = this.element;

        this.getGridInstance = ClientFunction(
            () => $(grid())[`${name}`]('instance'),
            { dependencies: { grid, name } }
        );
    }

    addWidgetPrefix(className: string) {
        return Widget.addClassPrefix(this.name, className);
    }

    getHeaders(): Headers {
        return new Headers(this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`), this.name);
    }

    getDataRow(index: number): DataRow {
        return new DataRow(this.element.find(`.${CLASS.dataRow}[aria-rowindex='${index + 1}']`), this.name);
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
        const element = this.element ? this.element.find(`.${editFormRowClass}`) : Selector(`.${editFormRowClass}`);
        const buttons = element.find(`.${this.addWidgetPrefix(CLASS.formButtonsContainer)} .${CLASS.button}`);

        return new EditForm(element, buttons);
    }

    getPopupEditForm(): EditForm {
        const element = Selector(`.${this.addWidgetPrefix(CLASS.overlayContent)} .${CLASS.popupContent}`);
        const buttons = element.find(`.${CLASS.toolbar} .${CLASS.button}`);

        return new EditForm(element, buttons);
    }

    getHeaderPanel(): HeaderPanel {
        return new HeaderPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.headerPanel)}`), this.name);
    }

    apiOption(name: any, value = 'undefined') : Promise<any> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => {
                const dataGrid = getGridInstance();
                return value !== 'undefined' ? dataGrid.option(name, value) : dataGrid.option(name);
            },
            { dependencies: { getGridInstance, name, value } }
        )();
    }

    apiEditRow(rowIndex: number) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().editRow(rowIndex),
            { dependencies: { getGridInstance, rowIndex } }
        )();
    }

    apiCancelEditData() : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().cancelEditData(),
            { dependencies: { getGridInstance } }
        )();
    }

    apiSaveEditData() : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().saveEditData(),
            { dependencies: { getGridInstance } }
        )();
    }

    apiEditCell(rowIndex: number, columnIndex: number) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().editCell(rowIndex, columnIndex),
            { dependencies: { getGridInstance, rowIndex, columnIndex } }
        )();
    }

    apiCellValue(rowIndex: number, columnIndex: number, value: string) : Promise<void> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(
            () => getGridInstance().editCell(rowIndex, columnIndex, value),
            { dependencies: { getGridInstance, rowIndex, columnIndex, value } }
        )();
    }

    apiGetCellValidationStatus(rowIndex: number, columnIndex: number) : Promise<any> {
        const getGridInstance: any = this.getGridInstance;
        return ClientFunction(() => {
            const dataGrid = getGridInstance();
            const result = dataGrid.getController('validating').getCellValidationResult({ rowKey: dataGrid.getKeyByRowIndex(rowIndex), columnIndex });
            return result ? result.status : null;
        }, { dependencies: { getGridInstance, rowIndex, columnIndex } }
        )();
    }
}
