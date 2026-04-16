import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpaceWeek from './m_work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
  get type() { return VIEWS.WORK_WEEK; }

  protected override getElementClass() {
    return WORK_WEEK_CLASS;
  }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek as any);

export default SchedulerWorkSpaceWorkWeek;
