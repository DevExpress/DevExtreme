import registerComponent from '@js/core/component_registrator';
import { weekUtils } from '@ts/scheduler/r1/utils/index';

import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceVertical from './m_work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type() { return VIEWS.WEEK; }

  _getElementClass() {
    return WEEK_CLASS;
  }

  _calculateViewStartDate() {
    return weekUtils.calculateViewStartDate(this.option('startDate') as any, this._firstDayOfWeek());
  }
}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek as any);

export default SchedulerWorkSpaceWeek;
