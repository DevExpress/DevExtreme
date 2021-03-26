class MergeRanges {
    constructor(dataProvider, privateOptions, mergeRowFieldValues, mergeColumnFieldValues) {
        this.mergedCells = [];
        this.mergeRanges = [];

        this.dataProvider = dataProvider;
        this.privateOptions = privateOptions;
        this.mergeRowFieldValues = mergeRowFieldValues;
        this.mergeColumnFieldValues = mergeColumnFieldValues;
    }

    update(excelCell, rowIndex, cellIndex) {
        if(this.privateOptions._isHeaderCell(this.dataProvider, rowIndex, cellIndex)) {
            if(this.cellInMergeRanges(rowIndex, cellIndex)) {
                const cell = this.mergedCells[rowIndex][cellIndex];
                if(cell.merged === false) {
                    excelCell.style = cell.masterCell.style;
                    excelCell.value = cell.masterCell.value;
                }
            } else {
                this.updateMergedRanges(excelCell, rowIndex, cellIndex);
            }
        }
    }

    updateMergedRanges(excelCell, rowIndex, cellIndex) {
        const { rowspan, colspan } = this.dataProvider.getCellMerging(rowIndex, cellIndex);
        const isMasterCell = colspan || rowspan;

        if(isMasterCell) {
            const allowToMergeRange = this.privateOptions._allowToMergeRange(this.dataProvider, rowIndex, cellIndex, rowspan, colspan, this.mergeRowFieldValues, this.mergeColumnFieldValues);
            this.updateMergedCells(excelCell, rowIndex, cellIndex, rowspan, colspan, allowToMergeRange);

            if(allowToMergeRange) {
                this.mergeRanges.push({
                    masterCell: excelCell,
                    ...{ rowspan, colspan }
                });
            }
        }
    }

    cellInMergeRanges(rowIndex, cellIndex) {
        return this.mergedCells[rowIndex] && this.mergedCells[rowIndex][cellIndex];
    }

    updateMergedCells(excelCell, rowIndex, cellIndex, rowspan, colspan, allowToMergeRange) {
        for(let i = rowIndex; i <= rowIndex + rowspan; i++) {
            for(let j = cellIndex; j <= cellIndex + colspan; j++) {
                if(!this.mergedCells[i]) {
                    this.mergedCells[i] = [];
                }
                this.mergedCells[i][j] = {
                    masterCell: excelCell,
                    merged: allowToMergeRange
                };
            }
        }
    }

    mergeCells(worksheet) {
        this.mergeRanges.forEach((mergeRange) => {
            const startRowIndex = mergeRange.masterCell.fullAddress.row;
            const startColumnIndex = mergeRange.masterCell.fullAddress.col;
            const endRowIndex = startRowIndex + mergeRange.rowspan;
            const endColumnIndex = startColumnIndex + mergeRange.colspan;

            worksheet.mergeCells(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
        });
    }
}

export { MergeRanges };
