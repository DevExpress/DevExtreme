import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceVertical from './m_work_space_vertical';

const DAY_CLASS = 'dx-scheduler-work-space-day';

class SchedulerWorkSpaceDay extends SchedulerWorkSpaceVertical {
  get type() { return VIEWS.DAY; }

  _getElementClass() {
    return DAY_CLASS;
  }

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

registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay as any);

export default SchedulerWorkSpaceDay;
