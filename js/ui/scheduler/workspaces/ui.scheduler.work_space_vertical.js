import SchedulerWorkSpaceIndicator from './ui.scheduler.work_space.indicator';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
    _getFormat() {
        return this._formatWeekdayAndDay;
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
