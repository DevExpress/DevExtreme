class MergedRangesManager {
    constructor(dataProvider, helpers, mergeRowFieldValues, mergeColumnFieldValues) {
        this.mergedCells = [];
        this.mergedRanges = [];

        this.dataProvider = dataProvider;
        this.helpers = helpers;
        this.mergeRowFieldValues = mergeRowFieldValues;
        this.mergeColumnFieldValues = mergeColumnFieldValues;
    }

    updateMergedRanges(excelCell, rowIndex, cellIndex) {
        if(this.helpers._isHeaderCell(this.dataProvider, rowIndex, cellIndex)) {
            if(!this.isCellInMergedRanges(rowIndex, cellIndex)) {
                const { rowspan, colspan } = this.dataProvider.getCellMerging(rowIndex, cellIndex);
                const isMasterCellOfMergedRange = colspan || rowspan;

                if(isMasterCellOfMergedRange) {
                    const allowToMergeRange = this.helpers._allowToMergeRange(this.dataProvider, rowIndex, cellIndex, rowspan, colspan, this.mergeRowFieldValues, this.mergeColumnFieldValues);
                    this.updateMergedCells(excelCell, rowIndex, cellIndex, rowspan, colspan, allowToMergeRange);

                    if(allowToMergeRange) {
                        this.mergedRanges.push({
                            masterCell: excelCell,
                            ...{ rowspan, colspan }
                        });
                    }
                }
            }
        }
    }

    isCellInMergedRanges(rowIndex, cellIndex) {
        return this.mergedCells[rowIndex] && this.mergedCells[rowIndex][cellIndex];
    }

    tryGetMergedCellInfo(rowIndex, cellIndex) {
        if(this.helpers._isHeaderCell(this.dataProvider, rowIndex, cellIndex)) {
            if(this.isCellInMergedRanges(rowIndex, cellIndex)) {
                return this.mergedCells[rowIndex][cellIndex];
            }
        }
    }

    updateMergedCells(excelCell, rowIndex, cellIndex, rowspan, colspan, allowToMergeRange) {
        for(let i = rowIndex; i <= rowIndex + rowspan; i++) {
            for(let j = cellIndex; j <= cellIndex + colspan; j++) {
                if(!this.mergedCells[i]) {
                    this.mergedCells[i] = [];
                }
                this.mergedCells[i][j] = {
                    masterCell: excelCell,
                    unmerged: !allowToMergeRange
                };
            }
        }
    }

    applyMergedRages(worksheet) {
        this.mergedRanges.forEach((range) => {
            const startRowIndex = range.masterCell.fullAddress.row;
            const startColumnIndex = range.masterCell.fullAddress.col;
            const endRowIndex = startRowIndex + range.rowspan;
            const endColumnIndex = startColumnIndex + range.colspan;

            worksheet.mergeCells(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
        });
    }
}

export { MergedRangesManager };
