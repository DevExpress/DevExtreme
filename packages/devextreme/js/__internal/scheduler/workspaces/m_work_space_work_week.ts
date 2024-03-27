import registerComponent from '@js/core/component_registrator';

import {
  getWeekendsCount,
} from '../__migration/utils/index';
import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceWeek from './m_work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
  get type() { return VIEWS.WORK_WEEK; }

  constructor(...args: any[]) {
    // @ts-expect-error
    super(...args);

    this._getWeekendsCount = getWeekendsCount;
  }

  _getElementClass() {
    return WORK_WEEK_CLASS;
  }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek as any);

export default SchedulerWorkSpaceWorkWeek;
