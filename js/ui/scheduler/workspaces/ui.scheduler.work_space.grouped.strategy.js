
const LAST_GROUP_CELL_CLASS = 'dx-scheduler-last-group-cell';
const FIRST_GROUP_CELL_CLASS = 'dx-scheduler-first-group-cell';

class GroupedStrategy {
    constructor(workSpace) {
        this._workSpace = workSpace;
    }

    getLastGroupCellClass() {
        return LAST_GROUP_CELL_CLASS;
    }

    getFirstGroupCellClass() {
        return FIRST_GROUP_CELL_CLASS;
    }

    _getOffsetByAllDayPanel() {
        return 0;
    }

    _getGroupTop() {
        return 0;
    }
}

export default GroupedStrategy;
