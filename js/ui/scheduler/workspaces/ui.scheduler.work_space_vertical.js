import SchedulerWorkSpaceIndicator from './ui.scheduler.work_space.indicator';
import dateLocalization from '../../../localization/date';
import timeZoneUtils from '../utils.timeZone';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
    _getFormat() {
        return this._formatWeekdayAndDay;
    }

    generateRenderOptions() {
        const startViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this.getStartViewDate());
        const _getTimeText = (row, column) => {
            // T410490: incorrectly displaying time slots on Linux
            const index = row % this._getRowCount();
            if(index % 2 === 0 && column === 0) {
                return dateLocalization.format(this._getTimeCellDateCore(startViewDate, row), 'shorttime');
            }
            return '';
        };

        const options = super.generateRenderOptions();
        options.cellDataGetters.push((_, rowIndex, columnIndex) => {
            return {
                value: {
                    text: _getTimeText(rowIndex, columnIndex)
                },
            };
        });

        return options;
    }
}

export default SchedulerWorkspaceVertical;
