import registerComponent from '@js/core/component_registrator';
import { weekUtils } from '@ts/scheduler/r1/utils/index';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpaceVertical from './m_work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type(): string {
    return this.option('type') ?? VIEWS.WEEK;
  }

  protected override getElementClass(): string {
    return this.type === VIEWS.WORK_WEEK ? WORK_WEEK_CLASS : WEEK_CLASS;
  }

  protected override calculateViewStartDate(): Date {
    return weekUtils.calculateViewStartDate(this.option('startDate') as Date, this.firstDayOfWeek());
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek as any);

export default SchedulerWorkSpaceWeek;
