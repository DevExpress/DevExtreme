import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

function splitRowsInfosHorizontally(rowsInfosByPages, splitByColumns) {
    if(!isDefined(splitByColumns)) {
        return rowsInfosByPages;
    }

    const newRowsInfosByPages = [];
    const columnIndexes = splitByColumns;

    for(let i = 0; i <= columnIndexes.length; i++) {
        const newRowsInfos = [];

        rowsInfosByPages.forEach((rowsInfos) => rowsInfos.forEach(rowInfo => {
            const newRowsInfo = extend({}, rowInfo);
            newRowsInfo.cells = [];

            const startColumn = i === 0 ? 0 : columnIndexes[i - 1];
            const length = i < columnIndexes.length ? columnIndexes[i] - startColumn : rowInfo.cells.length - startColumn;
            if(length > 0) {
                for(let cellIndex = startColumn; cellIndex < startColumn + length; cellIndex++) {
                    newRowsInfo.cells.push(rowInfo.cells[cellIndex]);
                }
                newRowsInfos.push(newRowsInfo);
            }
        }));

        if(newRowsInfos.length > 0) {
            newRowsInfosByPages.push(newRowsInfos);
        }
    }

    return newRowsInfosByPages;
}

export { splitRowsInfosHorizontally };
