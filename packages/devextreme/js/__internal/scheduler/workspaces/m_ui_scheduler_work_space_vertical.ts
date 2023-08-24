import { formatWeekdayAndDay } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';

import SchedulerWorkSpaceIndicator from './m_ui_scheduler_work_space_indicator';

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
