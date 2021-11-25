const getCurrentCellIndex = (completeTimePanelMap, today, cellDuration) => {
    for(let i = 0; i < completeTimePanelMap.length; i++) {
        const cell = completeTimePanelMap[i];
        const endDate = new Date(cell.startDate.getTime() + cellDuration);

        if(!cell.allDay && cell.startDate <= today && today < endDate) {
            return cell.index;
        }
    }

    return -1;
};

const getCurrentAndNeighborCellsIndices = (cellIndex) => {
    if(cellIndex === 0) {
        return [0];
    }

    return cellIndex % 2 === 0
        ? [cellIndex - 1, cellIndex]
        : [cellIndex, cellIndex + 1];
};

const getCurrentTimePanelCellsFromAllGroups =
    (cellAndNeighborIndices, verticalGroupCount, cellCountPerGroup) => {
        const result = [];

        for(let groupIndex = 0; groupIndex < verticalGroupCount; groupIndex++) {
            const currentGroupIndexes = cellAndNeighborIndices.map(
                cellIndex => cellCountPerGroup * groupIndex + cellIndex
            );

            result.push(...currentGroupIndexes);
        }

        return result;
    };

export const getCurrentTimePanelCellIndices = (completeTimePanelMap, options) => {
    const {
        cellDuration,
        today,
        cellCountPerGroup,
        groupCount,
        isSequentialGrouping,
        selectNeighbors,
    } = options;

    const cellIndex = getCurrentCellIndex(completeTimePanelMap, today, cellDuration);
    if(cellIndex === -1) {
        return [];
    }

    const cellAndNeighborIndices = selectNeighbors
        ? getCurrentAndNeighborCellsIndices(cellIndex)
        : [cellIndex];

    if(isSequentialGrouping) {
        return getCurrentTimePanelCellsFromAllGroups(
            cellAndNeighborIndices,
            groupCount,
            cellCountPerGroup,
        );
    }


    return cellAndNeighborIndices;
};
