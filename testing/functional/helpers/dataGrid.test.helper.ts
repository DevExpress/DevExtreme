import { Selector } from "testcafe";

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
}
