import { formatWeekdayAndDay } from '@ts/scheduler/r1/utils/index';

import SchedulerWorkSpaceIndicator from './work_space_indicator';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
  protected override getFormat() {
    return formatWeekdayAndDay;
  }

  generateRenderOptions() {
    const options = super.generateRenderOptions();

    return {
      ...options,
      isGenerateTimePanelData: true,
    };
  }

  protected override isRenderHeaderPanelEmptyCell() {
    return true;
  }
}

export default SchedulerWorkspaceVertical;
