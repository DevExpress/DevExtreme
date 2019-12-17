import Errors from '../widget/ui.errors';
import { getWindow } from '../../core/utils/window';

let ganttViewCore;

function getGanttViewCore() {
    if(!ganttViewCore) {
        ganttViewCore = requestGantt();
    }

    return ganttViewCore;
}

function requestGantt() {
    const window = getWindow();
    const ganttViewCore = window && window.DevExpress && window.DevExpress.Gantt || require('devexpress-gantt');

    if(!ganttViewCore) {
        throw Errors.Error('E1041', 'devexpress-gantt');
    }

    return ganttViewCore;
}

export { getGanttViewCore };
