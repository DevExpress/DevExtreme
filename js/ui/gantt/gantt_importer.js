import Errors from '../widget/ui.errors';
import Gantt from 'devexpress-gantt';


function getGanttViewCore() {
    if(!Gantt) {
        throw Errors.Error('E1041', 'devexpress-gantt');
    }

    return Gantt;
}

export { getGanttViewCore };
