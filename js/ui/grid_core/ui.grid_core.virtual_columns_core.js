import { extend } from '../../core/utils/extend';

function foreachColumnInfo(info, callback, rowIndex, offsets, columnCount, lastProcessedIndexes) {
    rowIndex = rowIndex || 0;
    offsets = offsets || [];
    lastProcessedIndexes = lastProcessedIndexes || [];
    offsets[rowIndex] = offsets[rowIndex] || 0;

    const row = info[rowIndex];
    const startIndex = lastProcessedIndexes[rowIndex] + 1 || 0;
    let processedColumnCount = 0;

    if(!row) {
        return;
    }

    let colIndex;

    for(colIndex = startIndex; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        const visibleIndex = colIndex + offsets[rowIndex];
        const colspan = cell.colspan || 1;

        foreachColumnInfo(info, callback, rowIndex + (cell.rowspan || 1), offsets, colspan, lastProcessedIndexes);

        offsets[rowIndex] += colspan - 1;

        processedColumnCount += colspan;

        if(cell.rowspan) {
            for(let i = rowIndex + 1; i < rowIndex + cell.rowspan; i++) {
                offsets[i] = offsets[i] || 0;
                offsets[i] += (cell.colspan || 1);
            }
        }

        if(callback(cell, visibleIndex, rowIndex, colIndex) === false) {
            break;
        }
        if(columnCount !== undefined && processedColumnCount >= columnCount) {
            break;
        }
    }

    lastProcessedIndexes[rowIndex] = colIndex;
}

function createColumnsInfo(info, startIndex, endIndex) {
    const newInfo = [];

    foreachColumnInfo(info, function(columnInfo, visibleIndex, rowIndex) {
        let cell = columnInfo;
        let colspan;
        const cellColspan = cell.colspan || 1;
        const isVisible = visibleIndex + cellColspan - 1 >= startIndex && visibleIndex < endIndex;

        newInfo[rowIndex] = newInfo[rowIndex] || [];

        if(isVisible) {
            if(visibleIndex < startIndex) {
                colspan = cellColspan - (startIndex - visibleIndex);
                visibleIndex = startIndex;
            } else {
                colspan = cellColspan;
            }

            if(visibleIndex + colspan > endIndex) {
                colspan = endIndex - visibleIndex;
            }

            if(colspan !== cellColspan) {
                cell = extend({}, cell, {
                    colspan: colspan
                });
            }

            newInfo[rowIndex].push(cell);

        } else if(visibleIndex > endIndex) {
            return false;
        }
    });

    for(let i = 0; i < newInfo.length; i++) {
        newInfo[i] = newInfo[i] || [];
    }

    return newInfo;
}

exports.foreachColumnInfo = foreachColumnInfo;
exports.createColumnsInfo = createColumnsInfo;

