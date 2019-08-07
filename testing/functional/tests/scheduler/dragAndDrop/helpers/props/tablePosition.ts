export class TablePosition<T> {
    row: T;
    cell: T;

    constructor(row: T, cell: T) {
        this.row = row;
        this.cell = cell;
    }
}
