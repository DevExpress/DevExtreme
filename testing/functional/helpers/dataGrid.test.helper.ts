import { Selector, ClientFunction } from "testcafe";

export default class DataGridTestHelper {
    dataGrid: Selector;

    constructor(selector: string) {
        this.dataGrid = Selector(selector);
    }

    getDataRow(rowIndex: number) : Selector {
        return this.dataGrid.find(`.dx-data-row:nth-child(${rowIndex + 1})`);
    }

    getDataCell(rowIndex: number, columnIndex: number) : Selector {
        return this.getDataRow(rowIndex).find(`td:nth-child(${columnIndex + 1})`);
    }

    getFocusedRow() : Selector {
        return this.dataGrid.find(`.dx-data-row.dx-row-focused`);
    }

    isRowRemoved(rowIndex: number) : Promise<boolean> {
        return this.getDataRow(rowIndex).hasClass("dx-row-removed");
    }

    async scrollTo(options) : Promise<void> {
        var selector = this.dataGrid;
        return await ClientFunction(() => {
            $(selector())["dxDataGrid"]("instance").getScrollable().scrollTo(options);
        },
            { dependencies: { selector, options } }
        )()
    }

    async getScrollLeft() : Promise<number> {
        var selector = this.dataGrid;
        return await ClientFunction(() => {
            return $(selector())["dxDataGrid"]("instance").getScrollable().scrollLeft();
        },
            { dependencies: { selector } }
        )()
    }
}

export class DataGridKeyboardTestHelper extends DataGridTestHelper {
    constructor(selector: string) {
        super(selector);
    }

    cellHasFocusClass(rowIndex: number, columnIndex: number) : Promise<boolean> {
        return this.getDataCell(rowIndex, columnIndex).hasClass("dx-focused");
    }

    isEditCell(rowIndex: number, columnIndex: number) : Promise<boolean> {
        return this.getDataCell(rowIndex, columnIndex).hasClass("dx-editor-cell");
    }
}
