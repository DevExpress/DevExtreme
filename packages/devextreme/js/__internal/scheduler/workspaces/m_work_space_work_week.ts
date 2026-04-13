import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpaceWeek from './m_work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
  get type() { return VIEWS.WORK_WEEK; }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      skippedDays: [0, 6],
    });
  }

  protected override getElementClass() {
    return WORK_WEEK_CLASS;
  }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek as any);

export default SchedulerWorkSpaceWorkWeek;
