const Errors = require('../widget/ui.errors');
const Diagram = require('devexpress-diagram');

function getDiagram() {
    if(!Diagram) {
        throw Errors.Error('E1041', 'devexpress-diagram');
    }

    return Diagram;
}

module.exports.getDiagram = getDiagram;
