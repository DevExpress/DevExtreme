import registerComponent from '@js/core/component_registrator';
import { weekUtils } from '@ts/scheduler/r1/utils/index';

import type { ViewType } from '../types';
import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpaceVertical from './work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type(): ViewType { return VIEWS.WEEK; }

  protected override getElementClass(): string {
    return WEEK_CLASS;
  }

  protected override calculateViewStartDate(): Date {
    return weekUtils.calculateViewStartDate(this.option('startDate') as Date, this.firstDayOfWeek());
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek as any);

export default SchedulerWorkSpaceWeek;
