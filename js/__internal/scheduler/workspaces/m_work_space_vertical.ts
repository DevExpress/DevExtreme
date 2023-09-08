import SchedulerWorkSpaceIndicator from './ui.scheduler.work_space.indicator';
import { formatWeekdayAndDay } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
    _getFormat() {
        return formatWeekdayAndDay;
    }

    generateRenderOptions() {
        const options = super.generateRenderOptions();

        return {
            ...options,
            isGenerateTimePanelData: true,
        };
    }

    _isRenderHeaderPanelEmptyCell() {
        return true;
    }

}

export default SchedulerWorkspaceVertical;
