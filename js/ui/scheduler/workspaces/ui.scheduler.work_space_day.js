import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';

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
        if(this.option('intervalCount') === 1) {
            super.renderRHeaderPanel(false);
        } else {
            super.renderRHeaderPanel(true);
        }
    }
}

registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);

export default SchedulerWorkSpaceDay;
