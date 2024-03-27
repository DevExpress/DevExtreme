import { formatWeekdayAndDay } from '../__migration/utils/index';
import SchedulerWorkSpaceIndicator from './m_work_space_indicator';

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
