import { formatWeekdayAndDay } from '@ts/scheduler/r1/utils/index';

import type { ViewDataProviderOptions } from './view_model/m_types';
import SchedulerWorkSpaceIndicator from './work_space_indicator';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
  protected override getFormat(): (date: Date) => string {
    return formatWeekdayAndDay;
  }

  generateRenderOptions(): ViewDataProviderOptions {
    const options = super.generateRenderOptions();

    return {
      ...options,
      isGenerateTimePanelData: true,
    };
  }

  protected override isRenderHeaderPanelEmptyCell(): boolean {
    return true;
  }
}

export default SchedulerWorkspaceVertical;
