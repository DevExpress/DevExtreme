import registerComponent from '@js/core/component_registrator';
import {
  getWeekendsCount,
} from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/work_week';
import { VIEWS } from '@js/ui/scheduler/constants';

import SchedulerWorkSpaceWeek from './m_ui_scheduler_work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
  get type() { return VIEWS.WORK_WEEK; }

  constructor(...args) {
    // @ts-expect-error
    super(...args);

    this._getWeekendsCount = getWeekendsCount;
  }

  _getElementClass() {
    return WORK_WEEK_CLASS;
  }
}

// @ts-expect-error
registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

export default SchedulerWorkSpaceWorkWeek;
