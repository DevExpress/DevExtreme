import { formatWeekdayAndDay } from '@ts/scheduler/r1/utils/index';

import SchedulerWorkSpaceIndicator from './m_work_space_indicator';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
  getFormat() {
    return formatWeekdayAndDay;
  }

  generateRenderOptions() {
    const options = super.generateRenderOptions();

    return {
      ...options,
      isGenerateTimePanelData: true,
    };
  }

  isRenderHeaderPanelEmptyCell() {
    return true;
  }
}

export default SchedulerWorkspaceVertical;
