import registerComponent from '@js/core/component_registrator';
import { VIEWS } from '@js/ui/scheduler/constants';

import SchedulerWorkSpaceVertical from './m_ui_scheduler_work_space_vertical';

const DAY_CLASS = 'dx-scheduler-work-space-day';

class SchedulerWorkSpaceDay extends SchedulerWorkSpaceVertical {
  // @ts-expect-error
  get type() { return VIEWS.DAY; }

  _getElementClass() {
    return DAY_CLASS;
  }

  // @ts-expect-error
  _renderDateHeader() {
    return this.option('intervalCount') === 1 ? null : super._renderDateHeader();
  }

  renderRHeaderPanel() {
    if (this.option('intervalCount') === 1) {
      super.renderRHeaderPanel(false);
    } else {
      super.renderRHeaderPanel(true);
    }
  }
}

// @ts-expect-error
registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);

export default SchedulerWorkSpaceDay;
