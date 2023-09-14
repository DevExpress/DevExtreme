import registerComponent from '@js/core/component_registrator';
import { calculateViewStartDate } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/week';

import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceVertical from './m_work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type() { return VIEWS.WEEK; }

  _getElementClass() {
    return WEEK_CLASS;
  }

  _calculateViewStartDate() {
    return calculateViewStartDate(this.option('startDate') as any, this._firstDayOfWeek());
  }
}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek as any);

export default SchedulerWorkSpaceWeek;
