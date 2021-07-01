import SchedulerWorkSpaceIndicator from './ui.scheduler.work_space.indicator';
import { formatWeekdayAndDay } from './utils/base';

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
}

export default SchedulerWorkspaceVertical;
