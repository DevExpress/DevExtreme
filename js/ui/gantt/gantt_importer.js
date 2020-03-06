const Errors = require('../widget/ui.errors');
const Gantt = require('devexpress-gantt');


function getGanttViewCore() {
    if(!Gantt) {
        throw Errors.Error('E1041', 'devexpress-gantt');
    }

    return Gantt;
}

module.exports.getGanttViewCore = getGanttViewCore;
